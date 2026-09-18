DELETE FROM public.aurum_spot_prices;

ALTER TABLE public.aurum_spot_prices ALTER COLUMN previous_close DROP NOT NULL;

CREATE UNIQUE INDEX aurum_spot_prices_observed_at_key
  ON public.aurum_spot_prices (observed_at);