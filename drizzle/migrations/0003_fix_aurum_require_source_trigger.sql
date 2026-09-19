CREATE OR REPLACE FUNCTION public.aurum_posts_require_source()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  target uuid;
  p record;
  n integer;
BEGIN
  IF TG_TABLE_NAME = 'aurum_posts' THEN
    target := NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    target := OLD.post_id;
  ELSE
    target := NEW.post_id;
  END IF;

  SELECT * INTO p FROM public.aurum_posts WHERE id = target;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  IF p.status = 'published' AND p.type IN ('daily_note','weekly_brief') THEN
    SELECT count(*) INTO n FROM public.aurum_post_sources WHERE post_id = p.id;
    IF n = 0 THEN
      RAISE EXCEPTION 'AURUM sourcing rule: published % "%" must have at least one source', p.type, p.slug
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  RETURN NULL;
END;
$$;