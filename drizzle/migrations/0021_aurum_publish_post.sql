-- AURUM review workflow: the single atomic publish/schedule primitive.
--
-- Authorization, status, author, self-approval, sourcing and the requested
-- publication time are all evaluated inside one transaction against a locked
-- post row, so no caller can win a race between checking and writing.
--
-- Additive only: creates one function and its grants. No existing row is read
-- or written by this migration, and nothing calls the function yet.

CREATE OR REPLACE FUNCTION public.aurum_publish_post(
  _post_id uuid,
  _published_at timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_now timestamptz := now();
  v_role text;
  v_post public.aurum_posts%ROWTYPE;
  v_allow boolean;
  v_target timestamptz;
  v_same_intent boolean;
BEGIN
  -- 1. Authentication. Raised before anything is read, so an anonymous caller
  --    cannot learn whether _post_id exists.
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'AURUM publish: not signed in'
      USING ERRCODE = '28000';
  END IF;

  -- 2. Authorization. Positive allowlist, derived from the database-side role
  --    primitive; never accepted as input.
  v_role := public.aurum_current_editor_role();
  IF v_role IS NULL OR v_role NOT IN ('reviewer', 'admin') THEN
    RAISE EXCEPTION 'AURUM publish: reviewer or admin permission is required'
      USING ERRCODE = '42501';
  END IF;

  -- 3. Lock the post before any workflow decision is made.
  SELECT * INTO v_post FROM public.aurum_posts WHERE id = _post_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'AURUM publish: post not found'
      USING ERRCODE = 'no_data_found';
  END IF;

  -- 4. Already-published rows: idempotent only for the same reviewer with the
  --    same intent. One reviewer owns the recorded approval.
  IF v_post.status = 'published' THEN
    v_same_intent := CASE
      WHEN _published_at IS NULL THEN v_post.published_at <= v_now
      ELSE v_post.published_at = _published_at
    END;

    IF v_post.reviewed_by IS NOT DISTINCT FROM v_uid AND v_same_intent THEN
      RETURN jsonb_build_object(
        'id', v_post.id,
        'status', v_post.status,
        'published_at', v_post.published_at,
        'changed', false
      );
    END IF;

    RAISE EXCEPTION 'AURUM publish: this post was already published or scheduled by another approval'
      USING ERRCODE = '40001';
  END IF;

  -- 5. Any other state is a stale workflow error; never transition silently.
  IF v_post.status <> 'in_review' THEN
    RAISE EXCEPTION 'AURUM publish: this post is no longer awaiting review'
      USING ERRCODE = '55000';
  END IF;

  -- 6. Self-approval, read inside the same locked transaction. Fails closed.
  SELECT s.allow_self_approval INTO v_allow
  FROM public.aurum_cms_settings s
  WHERE s.id = true;

  IF v_allow IS NULL THEN
    RAISE EXCEPTION 'AURUM publish: approval settings are unavailable'
      USING ERRCODE = '42501';
  END IF;

  IF v_allow = false
     AND v_post.author_id IS NOT NULL
     AND v_post.author_id = v_uid THEN
    RAISE EXCEPTION 'AURUM publish: another reviewer must approve your own post'
      USING ERRCODE = '42501';
  END IF;

  -- 7. The one content invariant the table CHECKs cannot express.
  IF jsonb_array_length(v_post.body) = 0 THEN
    RAISE EXCEPTION 'AURUM publish: this post has no content to publish'
      USING ERRCODE = 'check_violation';
  END IF;

  -- 8. Sourcing, matching the existing deferred trigger's scope exactly.
  IF v_post.type IN ('daily_note', 'weekly_brief')
     AND NOT EXISTS (
       SELECT 1 FROM public.aurum_post_sources src WHERE src.post_id = v_post.id
     ) THEN
    RAISE EXCEPTION 'AURUM publish: add at least one source before publishing'
      USING ERRCODE = 'check_violation';
  END IF;

  -- 9. Publication time. NULL means now; an explicit past instant is refused
  --    rather than silently coerced.
  IF _published_at IS NOT NULL AND _published_at <= v_now THEN
    RAISE EXCEPTION 'AURUM publish: to publish immediately, leave the publication time empty'
      USING ERRCODE = '22007';
  END IF;

  v_target := coalesce(_published_at, v_now);

  -- 10. The transition. updated_at is left to the existing trigger.
  UPDATE public.aurum_posts
  SET status = 'published',
      published_at = v_target,
      reviewed_by = v_uid,
      reviewed_at = v_now
  WHERE id = v_post.id;

  RETURN jsonb_build_object(
    'id', v_post.id,
    'status', 'published',
    'published_at', v_target,
    'changed', true
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.aurum_publish_post(uuid, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aurum_publish_post(uuid, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.aurum_publish_post(uuid, timestamptz) TO service_role;