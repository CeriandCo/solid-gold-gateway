CREATE OR REPLACE FUNCTION public.gift_card_order_settle(
  _order_id uuid,
  _event_id text,
  _payment_intent_id text,
  _needs_review boolean,
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
  hold integer;
BEGIN
  SELECT * INTO ord FROM public.gift_card_orders WHERE id = _order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order % not found', _order_id USING ERRCODE = 'no_data_found';
  END IF;

  -- A second delivery of the same payment must never issue a second card.
  SELECT * INTO existing_card FROM public.gift_cards WHERE order_id = _order_id;
  IF FOUND THEN
    RETURN jsonb_build_object('card_id', existing_card.id, 'created', false);
  END IF;

  SELECT hold_hours INTO hold FROM public.commerce_settings WHERE id = true;

  UPDATE public.gift_card_orders
  SET status = CASE WHEN _needs_review THEN 'review' ELSE 'paid' END,
      paid_at = coalesce(paid_at, now()),
      stripe_payment_intent_id = coalesce(_payment_intent_id, stripe_payment_intent_id),
      recipient_name = coalesce(_recipient_name, recipient_name),
      recipient_email = coalesce(_recipient_email, recipient_email),
      gift_message = coalesce(_gift_message, gift_message),
      buyer_email = coalesce(_buyer_email, buyer_email),
      card_fingerprint_hash = coalesce(_card_fingerprint_hash, card_fingerprint_hash),
      updated_at = now()
  WHERE id = _order_id;

  INSERT INTO public.gift_cards (order_id, status, amount_cents, balance_cents, currency, hold_until)
  VALUES (
    _order_id,
    CASE WHEN _needs_review THEN 'review' ELSE 'pending' END,
    ord.amount_cents,
    0,
    ord.currency,
    now() + make_interval(hours => coalesce(hold, 72))
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

  IF _needs_review THEN
    PERFORM public.gift_card_record(
      new_card_id, 'review', 'system:webhook', 0, NULL, _event_id
    );
  END IF;

  RETURN jsonb_build_object('card_id', new_card_id, 'created', true);
END;
$$;

REVOKE ALL ON FUNCTION public.gift_card_order_settle(uuid, text, text, boolean, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.gift_card_order_settle(uuid, text, text, boolean, text, text, text, text, text) TO service_role;