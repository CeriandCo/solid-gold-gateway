-- Ledger stays append-only for everyone except an explicit, server-role-only
-- purge path used to remove rows created by automated tests.
CREATE OR REPLACE FUNCTION public.gift_card_ledger_append_only()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF current_setting('commerce.allow_ledger_purge', true) = 'on' THEN
    RETURN COALESCE(OLD, NEW);
  END IF;
  RAISE EXCEPTION 'gift_card_ledger is append-only; % is not permitted', TG_OP
    USING ERRCODE = 'insufficient_privilege';
END;
$$;

-- Removes one non-live order and everything hanging off it. Service role only.
CREATE OR REPLACE FUNCTION public.commerce_purge_test_order(_order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_live boolean;
BEGIN
  SELECT livemode INTO is_live FROM public.gift_card_orders WHERE id = _order_id;
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  IF is_live IS TRUE THEN
    RAISE EXCEPTION 'refusing to purge a livemode order';
  END IF;

  PERFORM set_config('commerce.allow_ledger_purge', 'on', true);

  DELETE FROM public.gift_card_ledger
  WHERE gift_card_id IN (SELECT id FROM public.gift_cards WHERE order_id = _order_id);

  DELETE FROM public.gift_card_delivery_attempts
  WHERE gift_card_id IN (SELECT id FROM public.gift_cards WHERE order_id = _order_id);

  DELETE FROM public.commerce_alerts
  WHERE order_id = _order_id
     OR gift_card_id IN (SELECT id FROM public.gift_cards WHERE order_id = _order_id);

  DELETE FROM public.gift_cards WHERE order_id = _order_id;
  DELETE FROM public.gift_card_orders WHERE id = _order_id;

  PERFORM set_config('commerce.allow_ledger_purge', 'off', true);
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.commerce_purge_test_order(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.commerce_purge_test_order(uuid) TO service_role;