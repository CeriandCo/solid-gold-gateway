ALTER TABLE public.newsletter_signups
  ADD COLUMN environment text NOT NULL DEFAULT 'non_production' CHECK (environment IN ('production','non_production')),
  ADD COLUMN cio_status text NOT NULL DEFAULT 'skipped' CHECK (cio_status IN ('pending','sending','sent','failed','skipped')),
  ADD COLUMN cio_attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN cio_sent_at timestamptz;
COMMENT ON COLUMN public.newsletter_signups.cio_status IS 'Customer.io claim-before-send status; preserve on consent upsert to prevent duplicate subscriber events.';