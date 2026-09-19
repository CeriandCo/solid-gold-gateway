-- Commerce foundation for SQOOT Pure Gift Cards.
-- Every table: RLS enabled, no policies (service role only).

CREATE TABLE public.commerce_settings (
  id boolean PRIMARY KEY DEFAULT true,
  checkout_enabled boolean NOT NULL DEFAULT false,
  currency text NULL,
  allowed_origins text[] NOT NULL DEFAULT '{}',
  hold_hours integer NOT NULL DEFAULT 72,
  review_threshold_cents integer NOT NULL DEFAULT 100000,
  daily_limit_cents integer NOT NULL DEFAULT 200000,
  max_card_cents integer NOT NULL DEFAULT 200000,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid NULL,
  CONSTRAINT commerce_settings_single_row CHECK (id),
  CONSTRAINT commerce_settings_currency_format CHECK (currency IS NULL OR currency ~ '^[a-z]{3}$'),
  CONSTRAINT commerce_settings_hold_hours CHECK (hold_hours >= 0 AND hold_hours <= 720),
  CONSTRAINT commerce_settings_review_threshold CHECK (review_threshold_cents > 0),
  CONSTRAINT commerce_settings_daily_limit CHECK (daily_limit_cents > 0 AND daily_limit_cents <= 200000),
  CONSTRAINT commerce_settings_max_card CHECK (max_card_cents > 0 AND max_card_cents <= 200000)
);
GRANT ALL ON public.commerce_settings TO service_role;
ALTER TABLE public.commerce_settings ENABLE ROW LEVEL SECURITY;
INSERT INTO public.commerce_settings (id) VALUES (true);

CREATE TABLE public.gift_card_denominations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount_cents integer NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gift_card_denominations_amount CHECK (amount_cents > 0 AND amount_cents <= 200000)
);
GRANT ALL ON public.gift_card_denominations TO service_role;
ALTER TABLE public.gift_card_denominations ENABLE ROW LEVEL SECURITY;
INSERT INTO public.gift_card_denominations (amount_cents, sort_order) VALUES
  (5000, 1), (10000, 2), (25000, 3), (50000, 4), (100000, 5), (200000, 6);

CREATE TABLE public.gift_card_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'open',
  denomination_id uuid NULL REFERENCES public.gift_card_denominations(id),
  amount_cents integer NOT NULL,
  currency text NOT NULL,
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text UNIQUE NULL,
  buyer_email text NULL,
  recipient_name text NULL,
  recipient_email text NULL,
  gift_message text NULL,
  card_fingerprint_hash text NULL,
  client_ip_hash text NULL,
  livemode boolean NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gift_card_orders_status CHECK (status IN ('open','paid','expired','refunded','disputed','review','failed')),
  CONSTRAINT gift_card_orders_amount CHECK (amount_cents > 0 AND amount_cents <= 200000),
  CONSTRAINT gift_card_orders_currency CHECK (currency ~ '^[a-z]{3}$'),
  CONSTRAINT gift_card_orders_buyer_email_lower CHECK (buyer_email IS NULL OR buyer_email = lower(buyer_email)),
  CONSTRAINT gift_card_orders_recipient_email_lower CHECK (recipient_email IS NULL OR recipient_email = lower(recipient_email)),
  CONSTRAINT gift_card_orders_gift_message CHECK (gift_message IS NULL OR length(gift_message) <= 255)
);
GRANT ALL ON public.gift_card_orders TO service_role;
ALTER TABLE public.gift_card_orders ENABLE ROW LEVEL SECURITY;
CREATE INDEX gift_card_orders_buyer_email_paid_at_idx ON public.gift_card_orders (buyer_email, paid_at);
CREATE INDEX gift_card_orders_fingerprint_paid_at_idx ON public.gift_card_orders (card_fingerprint_hash, paid_at);

CREATE TABLE public.gift_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL UNIQUE REFERENCES public.gift_card_orders(id),
  status text NOT NULL DEFAULT 'pending',
  amount_cents integer NOT NULL,
  balance_cents integer NOT NULL,
  currency text NOT NULL,
  code_hash text UNIQUE NULL,
  code_last4 text NULL,
  hold_until timestamptz NULL,
  activated_at timestamptz NULL,
  delivered_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gift_cards_status CHECK (status IN ('pending','review','active','delivered','redeemed','frozen','void')),
  CONSTRAINT gift_cards_amount CHECK (amount_cents > 0 AND amount_cents <= 200000),
  CONSTRAINT gift_cards_balance CHECK (balance_cents >= 0 AND balance_cents <= amount_cents),
  CONSTRAINT gift_cards_currency CHECK (currency ~ '^[a-z]{3}$')
);
GRANT ALL ON public.gift_cards TO service_role;
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.gift_card_ledger (
  id bigserial PRIMARY KEY,
  gift_card_id uuid NOT NULL REFERENCES public.gift_cards(id),
  entry_type text NOT NULL,
  amount_cents integer NOT NULL DEFAULT 0,
  balance_after integer NOT NULL,
  actor text NOT NULL,
  reference text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gift_card_ledger_entry_type CHECK (entry_type IN ('issue','activate','review','deliver','redeem','freeze','unfreeze','void')),
  CONSTRAINT gift_card_ledger_balance_after CHECK (balance_after >= 0)
);
GRANT ALL ON public.gift_card_ledger TO service_role;
ALTER TABLE public.gift_card_ledger ENABLE ROW LEVEL SECURITY;
CREATE INDEX gift_card_ledger_card_idx ON public.gift_card_ledger (gift_card_id, id);

CREATE TABLE public.stripe_events (
  event_id text PRIMARY KEY,
  type text NULL,
  livemode boolean NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz NULL,
  status text NOT NULL DEFAULT 'processing',
  error text NULL,
  CONSTRAINT stripe_events_status CHECK (status IN ('processing','processed','ignored','failed')),
  CONSTRAINT stripe_events_error_len CHECK (error IS NULL OR length(error) <= 300)
);
GRANT ALL ON public.stripe_events TO service_role;
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.checkout_attempts (
  id bigserial PRIMARY KEY,
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.checkout_attempts TO service_role;
ALTER TABLE public.checkout_attempts ENABLE ROW LEVEL SECURITY;
CREATE INDEX checkout_attempts_ip_created_idx ON public.checkout_attempts (ip_hash, created_at);

-- Gift card state machine -----------------------------------------------
CREATE OR REPLACE FUNCTION public.gift_cards_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed text[] := ARRAY[
    'pending>active','pending>review','pending>void',
    'review>active','review>void',
    'active>delivered','active>frozen','active>void',
    'delivered>redeemed','delivered>frozen',
    'frozen>active','frozen>delivered','frozen>void'
  ];
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NOT ((OLD.status || '>' || NEW.status) = ANY (allowed)) THEN
      RAISE EXCEPTION 'Illegal gift card status transition: % -> %', OLD.status, NEW.status
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  IF NEW.balance_cents IS DISTINCT FROM OLD.balance_cents
     AND coalesce(current_setting('sqoot.ledger_write', true), 'off') <> 'on' THEN
    RAISE EXCEPTION 'Gift card balance changes only through gift_card_record()'
      USING ERRCODE = 'check_violation';
  END IF;

  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER gift_cards_guard_trg
BEFORE UPDATE ON public.gift_cards
FOR EACH ROW EXECUTE FUNCTION public.gift_cards_guard();

-- Append-only ledger -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.gift_card_ledger_append_only()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'gift_card_ledger is append-only; % is not permitted', TG_OP
    USING ERRCODE = 'insufficient_privilege';
END;
$$;

CREATE TRIGGER gift_card_ledger_no_update_trg
BEFORE UPDATE OR DELETE ON public.gift_card_ledger
FOR EACH ROW EXECUTE FUNCTION public.gift_card_ledger_append_only();

-- The only supported way to move balance or status -----------------------
CREATE OR REPLACE FUNCTION public.gift_card_record(
  _gift_card_id uuid,
  _entry_type text,
  _actor text,
  _amount_cents integer DEFAULT 0,
  _new_status text DEFAULT NULL,
  _reference text DEFAULT NULL
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  card public.gift_cards%ROWTYPE;
  new_balance integer;
  ledger_id bigint;
BEGIN
  SELECT * INTO card FROM public.gift_cards WHERE id = _gift_card_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Gift card % not found', _gift_card_id USING ERRCODE = 'no_data_found';
  END IF;

  new_balance := card.balance_cents + coalesce(_amount_cents, 0);
  IF new_balance < 0 OR new_balance > card.amount_cents THEN
    RAISE EXCEPTION 'Resulting balance % is outside 0..%', new_balance, card.amount_cents
      USING ERRCODE = 'check_violation';
  END IF;

  PERFORM set_config('sqoot.ledger_write', 'on', true);

  UPDATE public.gift_cards
  SET balance_cents = new_balance,
      status = coalesce(_new_status, status),
      activated_at = CASE WHEN _new_status = 'active' AND activated_at IS NULL THEN now() ELSE activated_at END,
      delivered_at = CASE WHEN _new_status = 'delivered' AND delivered_at IS NULL THEN now() ELSE delivered_at END
  WHERE id = _gift_card_id;

  PERFORM set_config('sqoot.ledger_write', 'off', true);

  INSERT INTO public.gift_card_ledger (gift_card_id, entry_type, amount_cents, balance_after, actor, reference)
  VALUES (_gift_card_id, _entry_type, coalesce(_amount_cents, 0), new_balance, _actor, _reference)
  RETURNING id INTO ledger_id;

  RETURN ledger_id;
END;
$$;

REVOKE ALL ON FUNCTION public.gift_card_record(uuid, text, text, integer, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gift_card_record(uuid, text, text, integer, text, text) TO service_role;

-- Retention: checkout attempts older than 7 days -------------------------
CREATE OR REPLACE FUNCTION public.commerce_prune_checkout_attempts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.checkout_attempts WHERE created_at < now() - interval '7 days';
$$;

SELECT cron.schedule(
  'commerce-prune-checkout-attempts',
  '17 3 * * *',
  $$SELECT public.commerce_prune_checkout_attempts();$$
);
