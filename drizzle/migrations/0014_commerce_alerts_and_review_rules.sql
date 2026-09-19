CREATE TABLE IF NOT EXISTS public.commerce_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  severity text NOT NULL,
  kind text NOT NULL,
  order_id uuid REFERENCES public.gift_card_orders(id) ON DELETE SET NULL,
  gift_card_id uuid REFERENCES public.gift_cards(id) ON DELETE SET NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid,
  CONSTRAINT commerce_alerts_severity CHECK (severity IN ('info', 'warning', 'critical')),
  CONSTRAINT commerce_alerts_message_len CHECK (char_length(message) <= 500)
);

GRANT ALL ON public.commerce_alerts TO service_role;
ALTER TABLE public.commerce_alerts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS commerce_alerts_created_at_idx ON public.commerce_alerts (created_at DESC);

ALTER TABLE public.gift_card_orders
  ADD COLUMN IF NOT EXISTS review_reasons text[] NOT NULL DEFAULT '{}';

CREATE OR REPLACE FUNCTION public.gift_card_order_settle(
  _order_id uuid,
  _event_id text,
  _review_reasons text[] DEFAULT '{}',
  _three_ds_ok boolean DEFAULT true,
  _payment_intent_id text DEFAULT NULL,
  _recipient_name text DEFAULT NULL,
  _recipient_email text DEFAULT NULL,
  _gift_message text DEFAULT NULL,
  _buyer_email text DEFAULT NULL,
  _card_fingerprint_hash text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ord public.gift_card_orders%ROWTYPE;
  existing_card public.gift_cards%ROWTYPE;
  new_card_id uuid;
  settings public.commerce_settings%ROWTYPE;
  reasons text[] := coalesce(_review_reasons, '{}');
  needs_review boolean;
  window_start timestamptz := now() - interval '24 hours';
  total integer;
BEGIN
  SELECT * INTO settings FROM public.commerce_settings WHERE id = true;

  -- Velocity locks, always in the same order, so two concurrent settlements
  -- for the same buyer/card/recipient cannot both slip under the daily limit.
  IF _buyer_email IS NOT NULL THEN
    PERFORM pg_advisory_xact_lock(hashtextextended('buyer:' || _buyer_email, 0));
  END IF;
  IF _card_fingerprint_hash IS NOT NULL THEN
    PERFORM pg_advisory_xact_lock(hashtextextended('card:' || _card_fingerprint_hash, 0));
  END IF;
  IF _recipient_email IS NOT NULL THEN
    PERFORM pg_advisory_xact_lock(hashtextextended('recipient:' || _recipient_email, 0));
  END IF;

  SELECT * INTO ord FROM public.gift_card_orders WHERE id = _order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order % not found', _order_id USING ERRCODE = 'no_data_found';
  END IF;

  -- A second delivery of the same payment must never issue a second card.
  SELECT * INTO existing_card FROM public.gift_cards WHERE order_id = _order_id;
  IF FOUND THEN
    RETURN jsonb_build_object('card_id', existing_card.id, 'created', false);
  END IF;

  IF ord.amount_cents >= settings.review_threshold_cents THEN
    reasons := array_append(reasons, 'high_value');
    IF NOT coalesce(_three_ds_ok, true) THEN
      reasons := array_append(reasons, 'no_3ds_high_value');
    END IF;
  END IF;

  IF _buyer_email IS NOT NULL THEN
    SELECT coalesce(sum(amount_cents), 0) INTO total
    FROM public.gift_card_orders
    WHERE buyer_email = _buyer_email
      AND status IN ('paid', 'review', 'disputed')
      AND paid_at >= window_start
      AND id <> _order_id;
    IF total + ord.amount_cents > settings.daily_limit_cents THEN
      reasons := array_append(reasons, 'daily_limit_email');
    END IF;
  END IF;

  IF _card_fingerprint_hash IS NOT NULL THEN
    SELECT coalesce(sum(amount_cents), 0) INTO total
    FROM public.gift_card_orders
    WHERE card_fingerprint_hash = _card_fingerprint_hash
      AND status IN ('paid', 'review', 'disputed')
      AND paid_at >= window_start
      AND id <> _order_id;
    IF total + ord.amount_cents > settings.daily_limit_cents THEN
      reasons := array_append(reasons, 'daily_limit_card');
    END IF;
  END IF;

  IF _recipient_email IS NOT NULL THEN
    SELECT coalesce(sum(amount_cents), 0) INTO total
    FROM public.gift_card_orders
    WHERE recipient_email = _recipient_email
      AND status IN ('paid', 'review', 'disputed')
      AND paid_at >= window_start
      AND id <> _order_id;
    IF total + ord.amount_cents > settings.daily_limit_cents THEN
      reasons := array_append(reasons, 'daily_limit_recipient');
    END IF;
  END IF;

  needs_review := array_length(reasons, 1) IS NOT NULL;

  UPDATE public.gift_card_orders
  SET status = CASE WHEN needs_review THEN 'review' ELSE 'paid' END,
      review_reasons = reasons,
      paid_at = coalesce(paid_at, now()),
      stripe_payment_intent_id = coalesce(nullif(_payment_intent_id, ''), stripe_payment_intent_id),
      recipient_name = coalesce(nullif(_recipient_name, ''), recipient_name),
      recipient_email = coalesce(nullif(_recipient_email, ''), recipient_email),
      gift_message = coalesce(nullif(_gift_message, ''), gift_message),
      buyer_email = coalesce(nullif(_buyer_email, ''), buyer_email),
      card_fingerprint_hash = coalesce(nullif(_card_fingerprint_hash, ''), card_fingerprint_hash),
      updated_at = now()
  WHERE id = _order_id;

  INSERT INTO public.gift_cards (order_id, status, amount_cents, balance_cents, currency, hold_until)
  VALUES (
    _order_id,
    CASE WHEN needs_review THEN 'review' ELSE 'pending' END,
    ord.amount_cents,
    0,
    ord.currency,
    now() + make_interval(hours => coalesce(settings.hold_hours, 72))
  )
  ON CONFLICT (order_id) DO NOTHING
  RETURNING id INTO new_card_id;

  IF new_card_id IS NULL THEN
    SELECT id INTO new_card_id FROM public.gift_cards WHERE order_id = _order_id;
    RETURN jsonb_build_object('card_id', new_card_id, 'created', false);
  END IF;

  PERFORM public.gift_card_record(
    new_card_id, 'issue', 'system:webhook', ord.amount_cents, NULL, _event_id
  );

  IF needs_review THEN
    PERFORM public.gift_card_record(
      new_card_id, 'review', 'system:webhook', 0, NULL, _event_id
    );
    INSERT INTO public.commerce_alerts (severity, kind, order_id, gift_card_id, message)
    VALUES (
      'warning',
      'order_review',
      _order_id,
      new_card_id,
      'Order held for review: ' || array_to_string(reasons, ', ')
    );
  END IF;

  RETURN jsonb_build_object(
    'card_id', new_card_id,
    'created', true,
    'review', needs_review,
    'reasons', to_jsonb(reasons)
  );
END;
$$;

DROP FUNCTION IF EXISTS public.gift_card_order_settle(uuid, text, boolean, text, text, text, text, text, text);

REVOKE ALL ON FUNCTION public.gift_card_order_settle(uuid, text, text[], boolean, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.gift_card_order_settle(uuid, text, text[], boolean, text, text, text, text, text, text) TO service_role;