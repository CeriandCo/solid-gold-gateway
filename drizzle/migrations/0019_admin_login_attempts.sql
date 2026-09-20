-- Rate-limit bucket for admin password sign-in, mirroring public.checkout_attempts:
-- RLS on with no policies, service_role only, salted hashes instead of raw values.
CREATE TABLE public.aurum_admin_login_attempts (
  id bigserial PRIMARY KEY,
  email_hash text NOT NULL,
  ip_hash text NOT NULL,
  succeeded boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.aurum_admin_login_attempts TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.aurum_admin_login_attempts_id_seq TO service_role;

ALTER TABLE public.aurum_admin_login_attempts ENABLE ROW LEVEL SECURITY;

CREATE INDEX aurum_admin_login_attempts_email_idx
  ON public.aurum_admin_login_attempts (email_hash, created_at DESC);
CREATE INDEX aurum_admin_login_attempts_ip_idx
  ON public.aurum_admin_login_attempts (ip_hash, created_at DESC);

CREATE OR REPLACE FUNCTION public.aurum_prune_admin_login_attempts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  DELETE FROM public.aurum_admin_login_attempts WHERE created_at < now() - interval '7 days';
$$;

REVOKE EXECUTE ON FUNCTION public.aurum_prune_admin_login_attempts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.aurum_prune_admin_login_attempts() TO service_role;