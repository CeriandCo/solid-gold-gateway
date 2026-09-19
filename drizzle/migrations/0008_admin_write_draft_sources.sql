-- Step 3b-3: listed editors may change sources of drafts they may edit.

GRANT INSERT, UPDATE, DELETE ON public.aurum_post_sources TO authenticated;

-- A source is editable exactly when its parent post is an editable draft.
CREATE OR REPLACE FUNCTION public.aurum_can_edit_post_sources(_post_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.aurum_posts p
    WHERE p.id = _post_id
      AND p.status = 'draft'
      AND public.aurum_can_edit_draft(p.author_id)
  );
$$;

CREATE POLICY "Editors add draft sources"
ON public.aurum_post_sources
FOR INSERT
TO authenticated
WITH CHECK (public.aurum_can_edit_post_sources(post_id));

CREATE POLICY "Editors update draft sources"
ON public.aurum_post_sources
FOR UPDATE
TO authenticated
USING (public.aurum_can_edit_post_sources(post_id))
WITH CHECK (public.aurum_can_edit_post_sources(post_id));

CREATE POLICY "Editors delete draft sources"
ON public.aurum_post_sources
FOR DELETE
TO authenticated
USING (public.aurum_can_edit_post_sources(post_id));

-- Replacing the whole list in one statement keeps a post and its sources in step:
-- the delete and the inserts share a single transaction, and RLS still applies
-- because the function runs as the caller.
CREATE OR REPLACE FUNCTION public.aurum_replace_post_sources(_post_id uuid, _sources jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  item jsonb;
  i integer := 0;
BEGIN
  DELETE FROM public.aurum_post_sources WHERE post_id = _post_id;
  FOR item IN SELECT * FROM jsonb_array_elements(coalesce(_sources, '[]'::jsonb))
  LOOP
    INSERT INTO public.aurum_post_sources (post_id, position, publisher, title, source_date, url)
    VALUES (
      _post_id,
      i,
      btrim(item->>'publisher'),
      btrim(item->>'title'),
      (item->>'date')::date,
      btrim(item->>'url')
    );
    i := i + 1;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.aurum_replace_post_sources(uuid, jsonb) TO authenticated;