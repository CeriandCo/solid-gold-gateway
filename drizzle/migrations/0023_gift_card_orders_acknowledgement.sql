-- Task C-9: record the purchase acknowledgement on the order itself.
ALTER TABLE public.gift_card_orders
  ADD COLUMN IF NOT EXISTS terms_version text,
  ADD COLUMN IF NOT EXISTS acknowledged_text text,
  ADD COLUMN IF NOT EXISTS acknowledged_at timestamptz;

COMMENT ON COLUMN public.gift_card_orders.terms_version IS
  'Version string of the purchase acknowledgement the buyer ticked (C-9).';
COMMENT ON COLUMN public.gift_card_orders.acknowledged_text IS
  'Exact acknowledgement text shown to the buyer, rebuilt server-side.';
COMMENT ON COLUMN public.gift_card_orders.acknowledged_at IS
  'Server timestamp at which the acknowledged purchase request was accepted.';
