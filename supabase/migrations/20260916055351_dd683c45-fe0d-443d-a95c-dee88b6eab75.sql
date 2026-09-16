CREATE TABLE public.aurum_spot_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  price numeric NOT NULL CHECK (price > 100 AND price < 100000),
  currency text NOT NULL CHECK (currency = 'USD'),
  unit text NOT NULL CHECK (unit = 'troy_ounce'),
  observed_at timestamptz NOT NULL,
  change_amount numeric NOT NULL,
  change_percent numeric NOT NULL CHECK (change_percent > -100 AND change_percent < 100),
  high_24h numeric NOT NULL CHECK (high_24h > 100 AND high_24h < 100000),
  low_24h numeric NOT NULL CHECK (low_24h > 100 AND low_24h < 100000),
  previous_close numeric NOT NULL CHECK (previous_close > 100 AND previous_close < 100000),
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.aurum_spot_prices TO anon, authenticated;
GRANT ALL ON public.aurum_spot_prices TO service_role;
ALTER TABLE public.aurum_spot_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view AURUM spot prices"
ON public.aurum_spot_prices FOR SELECT
TO anon, authenticated
USING (true);
CREATE INDEX aurum_spot_prices_observed_at_idx ON public.aurum_spot_prices (observed_at DESC);

CREATE TABLE public.aurum_daily_closes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  price_date date NOT NULL UNIQUE,
  close_price numeric NOT NULL CHECK (close_price > 100 AND close_price < 100000),
  currency text NOT NULL CHECK (currency = 'USD'),
  unit text NOT NULL CHECK (unit = 'troy_ounce'),
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.aurum_daily_closes TO anon, authenticated;
GRANT ALL ON public.aurum_daily_closes TO service_role;
ALTER TABLE public.aurum_daily_closes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view AURUM daily closes"
ON public.aurum_daily_closes FOR SELECT
TO anon, authenticated
USING (true);
CREATE INDEX aurum_daily_closes_price_date_idx ON public.aurum_daily_closes (price_date DESC);