-- Task T3 Phase 2: MELT newsletter opt-in — persistence foundation only.
--
-- Two tables, both following the verified locked pattern used by the commerce
-- and admin tables: service_role grants, RLS enabled, and no policies at all,
-- so the public REST surface can reach neither of them. Nothing here wires the
-- public form, calls a provider, or stores consent wording: the copy is not
-- approved yet and no signup row may exist until it is.

-- 1. Local consent evidence ---------------------------------------------------
-- A MELT signup received by us, and the consent snapshot accepted at that
-- moment. It records nothing about provider subscription, audience membership,
-- double opt-in confirmation or email delivery; those are later decisions.
CREATE TABLE public.newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  lists text[] NOT NULL,
  consent_version text NOT NULL,
  consent_text text NOT NULL,
  consented_at timestamptz NOT NULL,
  source text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Normalisation happens in server code (trim + lowercase, as in
  -- admin.server.ts); the database only refuses anything that clearly did not
  -- go through it. No RFC parsing here — syntax validation is the server's job.
  CONSTRAINT newsletter_signups_email_unique UNIQUE (email),
  CONSTRAINT newsletter_signups_email_len CHECK (length(email) BETWEEN 3 AND 254),
  CONSTRAINT newsletter_signups_email_normalised
    CHECK (email = lower(email) AND email = btrim(email)),

  -- Content preferences shown in the MELT form. These are OUR content choices,
  -- never a provider audience or list identifier.
  CONSTRAINT newsletter_signups_lists_not_empty CHECK (array_length(lists, 1) >= 1),
  CONSTRAINT newsletter_signups_lists_allowed
    CHECK (lists <@ ARRAY['daily-note', 'weekly-brief']::text[]),

  -- An accidental empty consent snapshot must never become consent evidence.
  CONSTRAINT newsletter_signups_consent_version_len
    CHECK (length(btrim(consent_version)) BETWEEN 1 AND 80),
  CONSTRAINT newsletter_signups_consent_text_len
    CHECK (length(btrim(consent_text)) BETWEEN 1 AND 4000),
  CONSTRAINT newsletter_signups_source_len
    CHECK (length(btrim(source)) BETWEEN 1 AND 200)
);

COMMENT ON TABLE public.newsletter_signups IS
  'MELT newsletter signups received locally, with the consent snapshot accepted at the time (T3).';
COMMENT ON COLUMN public.newsletter_signups.email IS
  'Server-normalised address (trimmed, lowercased). Unique; no second raw-email column exists.';
COMMENT ON COLUMN public.newsletter_signups.lists IS
  'Our own MELT content choices, not provider audience or list identifiers.';
COMMENT ON COLUMN public.newsletter_signups.consent_version IS
  'Version of the consent wording accepted. Server-controlled; the browser never chooses it.';
COMMENT ON COLUMN public.newsletter_signups.consent_text IS
  'Exact consent wording shown, rebuilt server-side rather than trusted from the browser.';
COMMENT ON COLUMN public.newsletter_signups.consented_at IS
  'When the current consent snapshot was accepted. Only changes when consent itself changes.';
COMMENT ON COLUMN public.newsletter_signups.source IS
  'Bounded description of where the signup came from. Not an attribution dump, referrer or IP.';

-- updated_at is maintained by the database, matching aurum_posts_set_updated_at.
-- consented_at is deliberately untouched here: an unrelated row update must not
-- rewrite when consent was given.
CREATE OR REPLACE FUNCTION public.newsletter_signups_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.newsletter_signups_set_updated_at() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.newsletter_signups_set_updated_at() TO service_role;

CREATE TRIGGER newsletter_signups_updated_at
BEFORE UPDATE ON public.newsletter_signups
FOR EACH ROW EXECUTE FUNCTION public.newsletter_signups_set_updated_at();

GRANT ALL ON public.newsletter_signups TO service_role;
ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;

-- 2. Rate-limit bucket --------------------------------------------------------
-- Modelled on public.checkout_attempts. Only a salted hash, no raw IP, no
-- email, no user agent, no payload. The pepper is a server secret
-- (NEWSLETTER_HASH_PEPPER, deliberately separate from COMMERCE_HASH_PEPPER) and
-- never appears in SQL — the database stores the resulting hash only.
CREATE TABLE public.newsletter_attempts (
  id bigserial PRIMARY KEY,
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.newsletter_attempts IS
  'Abuse accounting for MELT signup attempts: salted IP hash and time only (T3).';

GRANT ALL ON public.newsletter_attempts TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.newsletter_attempts_id_seq TO service_role;

ALTER TABLE public.newsletter_attempts ENABLE ROW LEVEL SECURITY;

CREATE INDEX newsletter_attempts_ip_created_idx
  ON public.newsletter_attempts (ip_hash, created_at);

-- 3. Retention ----------------------------------------------------------------
-- Attempts are abuse accounting and expire after 7 days, as in commerce.
-- Signups are consent evidence and are never pruned here.
CREATE OR REPLACE FUNCTION public.newsletter_prune_attempts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  DELETE FROM public.newsletter_attempts WHERE created_at < now() - interval '7 days';
$$;

REVOKE EXECUTE ON FUNCTION public.newsletter_prune_attempts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.newsletter_prune_attempts() TO service_role;

SELECT cron.unschedule('newsletter-prune-attempts')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'newsletter-prune-attempts');
SELECT cron.schedule(
  'newsletter-prune-attempts',
  '29 3 * * *',
  $job$SELECT public.newsletter_prune_attempts();$job$
);
