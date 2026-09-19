-- Rate-limit ledger for admin magic-link requests (one per email per 60 seconds).
-- Written only by the server (service role); no anon or authenticated access.
CREATE TABLE public.aurum_admin_link_requests (
  email text PRIMARY KEY,
  last_requested_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.aurum_admin_link_requests TO service_role;

ALTER TABLE public.aurum_admin_link_requests ENABLE ROW LEVEL SECURITY;
