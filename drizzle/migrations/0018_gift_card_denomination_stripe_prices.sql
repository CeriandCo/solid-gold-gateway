-- S2: bind gift card denominations to a Stripe Product catalog.
-- The columns hold only Stripe price ids (public identifiers, never secrets).
-- RLS stays as it is: enabled with no policies, service role only.

ALTER TABLE public.gift_card_denominations
  ADD COLUMN IF NOT EXISTS stripe_price_id_test text,
  ADD COLUMN IF NOT EXISTS stripe_price_id_live text;

CREATE UNIQUE INDEX IF NOT EXISTS gift_card_denominations_price_test_uq
  ON public.gift_card_denominations (stripe_price_id_test)
  WHERE stripe_price_id_test IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS gift_card_denominations_price_live_uq
  ON public.gift_card_denominations (stripe_price_id_live)
  WHERE stripe_price_id_live IS NOT NULL;

-- All-or-nothing write of the mapping for one mode, in a single transaction.
CREATE OR REPLACE FUNCTION public.gift_card_set_stripe_prices(_mode text, _map jsonb)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  k text;
  v text;
  n integer := 0;
BEGIN
  IF _mode NOT IN ('test', 'live') THEN
    RAISE EXCEPTION 'Unknown Stripe mode %', _mode USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF _mode = 'test' THEN
    UPDATE public.gift_card_denominations
       SET stripe_price_id_test = NULL
     WHERE stripe_price_id_test IS NOT NULL;
  ELSE
    UPDATE public.gift_card_denominations
       SET stripe_price_id_live = NULL
     WHERE stripe_price_id_live IS NOT NULL;
  END IF;

  FOR k, v IN SELECT key, value #>> '{}' FROM jsonb_each(coalesce(_map, '{}'::jsonb))
  LOOP
    IF v IS NULL OR v = '' THEN
      RAISE EXCEPTION 'Empty price id for denomination %', k USING ERRCODE = 'invalid_parameter_value';
    END IF;
    IF _mode = 'test' THEN
      UPDATE public.gift_card_denominations SET stripe_price_id_test = v WHERE id = k::uuid;
    ELSE
      UPDATE public.gift_card_denominations SET stripe_price_id_live = v WHERE id = k::uuid;
    END IF;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Unknown denomination %', k USING ERRCODE = 'no_data_found';
    END IF;
    n := n + 1;
  END LOOP;

  RETURN n;
END
$$;

REVOKE ALL ON FUNCTION public.gift_card_set_stripe_prices(text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.gift_card_set_stripe_prices(text, jsonb) TO service_role;