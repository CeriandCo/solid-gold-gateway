ALTER TABLE public.gift_card_orders
  ADD COLUMN IF NOT EXISTS attempt_id uuid UNIQUE;