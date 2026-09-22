-- T2 final phase: AI-written AURUM Daily Note drafts.
-- Additive only: provenance column, run log + alerts, and three
-- service-role-only functions. No function here can publish a post.

ALTER TABLE public.aurum_posts
  ADD COLUMN IF NOT EXISTS origin text NOT NULL DEFAULT 'human';

ALTER TABLE public.aurum_posts DROP CONSTRAINT IF EXISTS aurum_posts_origin_check;
ALTER TABLE public.aurum_posts
  ADD CONSTRAINT aurum_posts_origin_check CHECK (origin IN ('human', 'ai'));

-- Provenance is trusted-code data: an ordinary session may never set or change it.
CREATE OR REPLACE FUNCTION public.aurum_posts_guard_workflow_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF current_user <> 'authenticated' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.origin IS DISTINCT FROM 'human' THEN
      RAISE EXCEPTION 'AURUM post provenance is set by trusted code only'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.author_id IS DISTINCT FROM OLD.author_id
     OR NEW.type IS DISTINCT FROM OLD.type
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.submitted_at IS DISTINCT FROM OLD.submitted_at
     OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
     OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at
     OR NEW.origin IS DISTINCT FROM OLD.origin THEN
    RAISE EXCEPTION 'AURUM workflow fields (author, type, status, review, origin) change only through the review workflow'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS aurum_posts_guard_workflow_insert ON public.aurum_posts;
CREATE TRIGGER aurum_posts_guard_workflow_insert
  BEFORE INSERT ON public.aurum_posts
  FOR EACH ROW EXECUTE FUNCTION public.aurum_posts_guard_workflow_fields();

CREATE TABLE IF NOT EXISTS public.aurum_ai_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  window_key text NOT NULL UNIQUE,
  outcome text NOT NULL DEFAULT 'started'
    CHECK (outcome IN ('started', 'skipped', 'generated', 'rejected', 'saved', 'error')),
  provider text,
  model text,
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  cost_usd numeric,
  cost_available boolean NOT NULL DEFAULT false,
  post_id uuid REFERENCES public.aurum_posts(id) ON DELETE SET NULL,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);

CREATE INDEX IF NOT EXISTS aurum_ai_runs_created_at_idx ON public.aurum_ai_runs (created_at DESC);

CREATE TABLE IF NOT EXISTS public.aurum_ai_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  kind text NOT NULL,
  run_id uuid REFERENCES public.aurum_ai_runs(id) ON DELETE SET NULL,
  post_id uuid REFERENCES public.aurum_posts(id) ON DELETE SET NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS aurum_ai_alerts_created_at_idx ON public.aurum_ai_alerts (created_at DESC);

ALTER TABLE public.aurum_ai_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aurum_ai_alerts ENABLE ROW LEVEL SECURITY;

-- No policies: only the service role (which bypasses RLS) reads or writes these.
REVOKE ALL ON public.aurum_ai_runs FROM anon, authenticated;
REVOKE ALL ON public.aurum_ai_alerts FROM anon, authenticated;
GRANT ALL ON public.aurum_ai_runs TO service_role;
GRANT ALL ON public.aurum_ai_alerts TO service_role;

CREATE OR REPLACE FUNCTION public.aurum_ai_max_runs_per_day()
RETURNS integer LANGUAGE sql IMMUTABLE AS $$ SELECT 4 $$;

CREATE OR REPLACE FUNCTION public.aurum_ai_claim_run(_window_key text, _daily_cap integer)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  effective_cap integer := least(greatest(coalesce(_daily_cap, 1), 0), public.aurum_ai_max_runs_per_day());
  used integer;
  new_id uuid;
BEGIN
  IF _window_key IS NULL OR length(btrim(_window_key)) = 0 THEN
    RAISE EXCEPTION 'A generation window key is required' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext('aurum_ai_daily_note'));

  IF EXISTS (SELECT 1 FROM public.aurum_ai_runs WHERE window_key = _window_key) THEN
    RETURN jsonb_build_object('outcome', 'duplicate');
  END IF;

  SELECT count(*) INTO used
    FROM public.aurum_ai_runs
   WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';

  IF used >= effective_cap THEN
    RETURN jsonb_build_object('outcome', 'cap', 'used', used, 'cap', effective_cap);
  END IF;

  INSERT INTO public.aurum_ai_runs (window_key) VALUES (_window_key) RETURNING id INTO new_id;
  RETURN jsonb_build_object('outcome', 'claimed', 'run_id', new_id, 'used', used + 1, 'cap', effective_cap);
END;
$function$;

CREATE OR REPLACE FUNCTION public.aurum_ai_finish_run(
  _run_id uuid,
  _outcome text,
  _provider text DEFAULT NULL,
  _model text DEFAULT NULL,
  _input_tokens integer DEFAULT NULL,
  _output_tokens integer DEFAULT NULL,
  _total_tokens integer DEFAULT NULL,
  _cost_usd numeric DEFAULT NULL,
  _post_id uuid DEFAULT NULL,
  _detail text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.aurum_ai_runs
     SET outcome = _outcome,
         provider = coalesce(_provider, provider),
         model = coalesce(_model, model),
         input_tokens = coalesce(_input_tokens, input_tokens),
         output_tokens = coalesce(_output_tokens, output_tokens),
         total_tokens = coalesce(_total_tokens, total_tokens),
         cost_usd = coalesce(_cost_usd, cost_usd),
         cost_available = (coalesce(_cost_usd, cost_usd) IS NOT NULL),
         post_id = coalesce(_post_id, post_id),
         detail = coalesce(_detail, detail),
         finished_at = now()
   WHERE id = _run_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.aurum_ai_create_in_review(
  _run_id uuid,
  _slug text,
  _title text,
  _summary text,
  _body jsonb,
  _sources jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_id uuid;
  item jsonb;
  i integer := 0;
  run public.aurum_ai_runs%ROWTYPE;
BEGIN
  SELECT * INTO run FROM public.aurum_ai_runs WHERE id = _run_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Unknown AI run' USING ERRCODE = 'P0002';
  END IF;
  IF run.post_id IS NOT NULL THEN
    RAISE EXCEPTION 'This AI run already produced a post' USING ERRCODE = '55000';
  END IF;

  IF jsonb_typeof(_body) <> 'array' OR jsonb_array_length(_body) = 0 THEN
    RAISE EXCEPTION 'A verified AI draft needs body content' USING ERRCODE = '23514';
  END IF;
  IF jsonb_typeof(_sources) <> 'array' OR jsonb_array_length(_sources) = 0 THEN
    RAISE EXCEPTION 'A verified AI draft needs at least one source' USING ERRCODE = '23514';
  END IF;

  INSERT INTO public.aurum_posts (
    type, slug, title, summary, body, status, origin,
    author_id, submitted_at, reviewed_by, reviewed_at, published_at
  ) VALUES (
    'daily_note', _slug, _title, _summary, _body, 'in_review', 'ai',
    NULL, now(), NULL, NULL, NULL
  ) RETURNING id INTO new_id;

  FOR item IN SELECT * FROM jsonb_array_elements(_sources)
  LOOP
    INSERT INTO public.aurum_post_sources (post_id, position, publisher, title, source_date, url)
    VALUES (
      new_id, i,
      btrim(item->>'publisher'),
      btrim(item->>'title'),
      (item->>'date')::date,
      btrim(item->>'url')
    );
    i := i + 1;
  END LOOP;

  UPDATE public.aurum_ai_runs SET post_id = new_id WHERE id = _run_id;
  RETURN new_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.aurum_ai_claim_run(text, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.aurum_ai_finish_run(uuid, text, text, text, integer, integer, integer, numeric, uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.aurum_ai_create_in_review(uuid, text, text, text, jsonb, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.aurum_ai_max_runs_per_day() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.aurum_ai_claim_run(text, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.aurum_ai_finish_run(uuid, text, text, text, integer, integer, integer, numeric, uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.aurum_ai_create_in_review(uuid, text, text, text, jsonb, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.aurum_ai_max_runs_per_day() TO service_role;
