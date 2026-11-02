CREATE TABLE public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (char_length(email) BETWEEN 3 AND 254),
  source text NOT NULL CHECK (source IN ('home_final_cta','waitlist_cta','early_access')),
  consent_version text NOT NULL CHECK (char_length(consent_version) BETWEEN 1 AND 80),
  consent_text text NOT NULL CHECK (char_length(consent_text) BETWEEN 1 AND 4000),
  consented_at timestamptz NOT NULL DEFAULT now(),
  environment text NOT NULL CHECK (environment IN ('production','non_production')),
  cio_status text NOT NULL DEFAULT 'pending' CHECK (cio_status IN ('pending','sending','sent','failed','skipped')),
  cio_attempts integer NOT NULL DEFAULT 0,
  cio_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.waitlist_signups TO service_role;
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.partner_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (char_length(email) BETWEEN 3 AND 254),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 200),
  firm_name text NOT NULL CHECK (char_length(firm_name) BETWEEN 1 AND 200),
  website text CHECK (website IS NULL OR char_length(website) <= 500),
  role text NOT NULL CHECK (char_length(role) <= 100),
  license text NOT NULL CHECK (char_length(license) <= 100),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 40),
  state text NOT NULL CHECK (char_length(state) <= 60),
  client_count text NOT NULL CHECK (char_length(client_count) <= 20),
  message text CHECK (message IS NULL OR char_length(message) <= 4000),
  authorization_confirmed boolean NOT NULL CHECK (authorization_confirmed),
  terms_accepted boolean NOT NULL CHECK (terms_accepted),
  environment text NOT NULL CHECK (environment IN ('production','non_production')),
  cio_status text NOT NULL DEFAULT 'pending' CHECK (cio_status IN ('pending','sending','sent','failed','skipped')),
  cio_attempts integer NOT NULL DEFAULT 0,
  cio_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.partner_applications TO service_role;
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.lead_rate_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  scope text NOT NULL,
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX lead_rate_events_lookup ON public.lead_rate_events (scope, ip_hash, created_at);
GRANT ALL ON public.lead_rate_events TO service_role;
ALTER TABLE public.lead_rate_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.lead_rate_check(_scope text, _ip_hash text, _short_max integer, _day_max integer, _short_seconds integer, _day_seconds integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE short_count integer; day_count integer;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('lead_rate:' || _scope || ':' || _ip_hash));
  DELETE FROM public.lead_rate_events WHERE created_at < now() - interval '7 days';
  INSERT INTO public.lead_rate_events (scope, ip_hash) VALUES (_scope, _ip_hash);
  SELECT count(*) FILTER (WHERE created_at > now() - make_interval(secs => _short_seconds)),
         count(*) FILTER (WHERE created_at > now() - make_interval(secs => _day_seconds))
    INTO short_count, day_count
    FROM public.lead_rate_events WHERE scope = _scope AND ip_hash = _ip_hash;
  RETURN short_count > _short_max OR day_count > _day_max;
END;
$$;
REVOKE ALL ON FUNCTION public.lead_rate_check(text, text, integer, integer, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.lead_rate_check(text, text, integer, integer, integer, integer) TO service_role;