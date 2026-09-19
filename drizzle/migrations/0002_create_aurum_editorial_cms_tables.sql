CREATE TABLE public.aurum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('daily_note','weekly_brief','article')),
  slug text NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL CHECK (length(btrim(title)) > 0),
  summary text NOT NULL CHECK (length(btrim(summary)) > 0),
  body jsonb NOT NULL CHECK (jsonb_typeof(body) = 'array'),
  pull_quote text,
  review_line text,
  read_minutes integer CHECK (read_minutes IS NULL OR read_minutes > 0),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','published','archived')),
  published_at timestamptz,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT aurum_posts_type_slug_key UNIQUE (type, slug),
  CONSTRAINT aurum_posts_published_needs_date CHECK (status <> 'published' OR published_at IS NOT NULL)
);

CREATE INDEX aurum_posts_listing_idx ON public.aurum_posts (type, status, published_at DESC);

CREATE TABLE public.aurum_post_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.aurum_posts(id) ON DELETE CASCADE,
  position integer NOT NULL,
  publisher text NOT NULL CHECK (length(btrim(publisher)) > 0),
  title text NOT NULL CHECK (length(btrim(title)) > 0),
  source_date date NOT NULL,
  url text NOT NULL CHECK (url LIKE 'https://%'),
  CONSTRAINT aurum_post_sources_post_position_key UNIQUE (post_id, position)
);

CREATE INDEX aurum_post_sources_post_id_idx ON public.aurum_post_sources (post_id);

GRANT ALL ON public.aurum_posts TO service_role;
GRANT ALL ON public.aurum_post_sources TO service_role;

ALTER TABLE public.aurum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aurum_post_sources ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.aurum_posts_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER aurum_posts_updated_at
BEFORE UPDATE ON public.aurum_posts
FOR EACH ROW EXECUTE FUNCTION public.aurum_posts_set_updated_at();

-- Published daily notes and weekly briefs must always have at least one source.
CREATE OR REPLACE FUNCTION public.aurum_posts_require_source()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  p record;
  n integer;
BEGIN
  SELECT * INTO p FROM public.aurum_posts
  WHERE id = CASE WHEN TG_TABLE_NAME = 'aurum_posts' THEN NEW.id
                  ELSE COALESCE(NEW.post_id, OLD.post_id) END;

  IF p IS NULL THEN
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

CREATE CONSTRAINT TRIGGER aurum_posts_require_source_trg
AFTER INSERT OR UPDATE ON public.aurum_posts
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION public.aurum_posts_require_source();

CREATE CONSTRAINT TRIGGER aurum_post_sources_require_source_trg
AFTER DELETE OR UPDATE ON public.aurum_post_sources
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION public.aurum_posts_require_source();