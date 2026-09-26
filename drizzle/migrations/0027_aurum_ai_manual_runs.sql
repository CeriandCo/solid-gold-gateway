-- Usage ledger for editor-triggered "Generate with AI" drafts. Kept separate from
-- aurum_ai_runs so manual generations never consume the scheduled pipeline's daily cap.
CREATE TABLE IF NOT EXISTS public.aurum_ai_manual_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  outcome text NOT NULL CHECK (outcome IN ('generated', 'rejected', 'error')),
  provider text,
  model text,
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  cost_usd numeric,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS aurum_ai_manual_runs_created_at_idx ON public.aurum_ai_manual_runs (created_at DESC);
REVOKE ALL ON public.aurum_ai_manual_runs FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.aurum_ai_manual_runs TO service_role;
ALTER TABLE public.aurum_ai_manual_runs ENABLE ROW LEVEL SECURITY;
-- No policies: only the service role reads or writes this table.