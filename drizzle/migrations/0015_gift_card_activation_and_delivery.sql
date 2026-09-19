-- lovable-cron-fallback-reviewed: 96 runs/day; gift-card safety holds expire at an exact stored timestamp, so the release must be time-based, and 15 minutes is the agreed maximum delay before an eligible card becomes active.
-- B4: activation after the hold, code minting and delivery.
-- Codes are never stored in plaintext: only code_hash (HMAC-SHA256 with the
-- server-side pepper) and code_last4 ever reach the database.

ALTER TABLE public.commerce_settings
  ADD COLUMN IF NOT EXISTS delivery_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_from text NULL;

ALTER TABLE public.commerce_settings
  DROP CONSTRAINT IF EXISTS commerce_settings_email_from;
ALTER TABLE public.commerce_settings
  ADD CONSTRAINT commerce_settings_email_from
  CHECK (email_from IS NULL OR email_from ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');

ALTER TABLE public.gift_cards
  ADD COLUMN IF NOT EXISTS delivery_claimed_at timestamptz NULL;

ALTER TABLE public.gift_cards DROP CONSTRAINT IF EXISTS gift_cards_code_hash_hex;
ALTER TABLE public.gift_cards
  ADD CONSTRAINT gift_cards_code_hash_hex
  CHECK (code_hash IS NULL OR code_hash ~ '^[0-9a-f]{64}$');

ALTER TABLE public.gift_cards DROP CONSTRAINT IF EXISTS gift_cards_code_last4_shape;
ALTER TABLE public.gift_cards
  ADD CONSTRAINT gift_cards_code_last4_shape
  CHECK (code_last4 IS NULL OR code_last4 ~ '^[0-9A-Z]{4}$');

CREATE INDEX IF NOT EXISTS gift_cards_delivery_queue_idx
  ON public.gift_cards (status, delivered_at, delivery_claimed_at);

CREATE TABLE IF NOT EXISTS public.gift_card_delivery_attempts (
  id bigserial PRIMARY KEY,
  gift_card_id uuid NOT NULL REFERENCES public.gift_cards(id) ON DELETE CASCADE,
  attempted_at timestamptz NOT NULL DEFAULT now(),
  outcome text NOT NULL,
  provider_message_id text NULL,
  error_category text NULL,
  CONSTRAINT gift_card_delivery_attempts_outcome CHECK (outcome IN ('sent','failed','skipped')),
  CONSTRAINT gift_card_delivery_attempts_error_len CHECK (error_category IS NULL OR length(error_category) <= 64),
  CONSTRAINT gift_card_delivery_attempts_message_len CHECK (provider_message_id IS NULL OR length(provider_message_id) <= 200)
);
GRANT ALL ON public.gift_card_delivery_attempts TO service_role;
ALTER TABLE public.gift_card_delivery_attempts ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS gift_card_delivery_attempts_card_idx
  ON public.gift_card_delivery_attempts (gift_card_id, attempted_at DESC);

CREATE OR REPLACE FUNCTION public.gift_card_activate_due()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  r record;
  activated integer := 0;
BEGIN
  FOR r IN
    SELECT c.id
    FROM public.gift_cards c
    JOIN public.gift_card_orders o ON o.id = c.order_id
    WHERE c.status = 'pending'
      AND c.hold_until IS NOT NULL
      AND c.hold_until <= now()
      AND o.status = 'paid'
    ORDER BY c.hold_until
    FOR UPDATE OF c SKIP LOCKED
    LIMIT 200
  LOOP
    PERFORM public.gift_card_record(r.id, 'activate', 'system:activation', 0, 'active', NULL);
    activated := activated + 1;
  END LOOP;
  RETURN activated;
END;
$fn$;
REVOKE ALL ON FUNCTION public.gift_card_activate_due() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gift_card_activate_due() TO service_role;

CREATE OR REPLACE FUNCTION public.gift_card_claim_for_delivery(
  _limit integer DEFAULT 25,
  _lease_minutes integer DEFAULT 10
)
RETURNS TABLE (
  gift_card_id uuid,
  order_id uuid,
  amount_cents integer,
  currency text,
  recipient_name text,
  recipient_email text,
  gift_message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  RETURN QUERY
  WITH claimable AS (
    SELECT c.id
    FROM public.gift_cards c
    JOIN public.gift_card_orders o ON o.id = c.order_id
    WHERE c.status = 'active'
      AND c.delivered_at IS NULL
      AND o.status = 'paid'
      AND o.recipient_email IS NOT NULL
      AND (c.delivery_claimed_at IS NULL
           OR c.delivery_claimed_at < now() - make_interval(mins => greatest(_lease_minutes, 1)))
    ORDER BY c.activated_at NULLS FIRST
    FOR UPDATE OF c SKIP LOCKED
    LIMIT greatest(least(_limit, 25), 0)
  ), claimed AS (
    UPDATE public.gift_cards c
    SET delivery_claimed_at = now()
    WHERE c.id IN (SELECT id FROM claimable)
    RETURNING c.id, c.order_id, c.amount_cents, c.currency
  )
  SELECT cl.id, cl.order_id, cl.amount_cents, cl.currency,
         o.recipient_name, o.recipient_email, o.gift_message
  FROM claimed cl
  JOIN public.gift_card_orders o ON o.id = cl.order_id;
END;
$fn$;
REVOKE ALL ON FUNCTION public.gift_card_claim_for_delivery(integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gift_card_claim_for_delivery(integer, integer) TO service_role;

CREATE OR REPLACE FUNCTION public.gift_card_release_delivery_claim(_gift_card_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $fn$
  UPDATE public.gift_cards
  SET delivery_claimed_at = NULL
  WHERE id = _gift_card_id AND delivered_at IS NULL;
$fn$;
REVOKE ALL ON FUNCTION public.gift_card_release_delivery_claim(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gift_card_release_delivery_claim(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.gift_card_set_code(
  _gift_card_id uuid,
  _code_hash text,
  _code_last4 text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  updated integer;
BEGIN
  UPDATE public.gift_cards
  SET code_hash = _code_hash, code_last4 = _code_last4
  WHERE id = _gift_card_id
    AND status = 'active'
    AND delivered_at IS NULL;
  GET DIAGNOSTICS updated = ROW_COUNT;
  RETURN updated = 1;
END;
$fn$;
REVOKE ALL ON FUNCTION public.gift_card_set_code(uuid, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gift_card_set_code(uuid, text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.commerce_prune_delivery_attempts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $fn$
  DELETE FROM public.gift_card_delivery_attempts WHERE attempted_at < now() - interval '180 days';
$fn$;
REVOKE ALL ON FUNCTION public.commerce_prune_delivery_attempts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.commerce_prune_delivery_attempts() TO service_role;

SELECT cron.unschedule('commerce-activate-due') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'commerce-activate-due');
SELECT cron.schedule('commerce-activate-due', '*/15 * * * *', $job$SELECT public.gift_card_activate_due();$job$);

SELECT cron.unschedule('commerce-prune-delivery-attempts') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'commerce-prune-delivery-attempts');
SELECT cron.schedule('commerce-prune-delivery-attempts', '23 3 * * *', $job$SELECT public.commerce_prune_delivery_attempts();$job$);