-- The read endpoints (service role, server-side) are now the only way in.
DROP POLICY IF EXISTS "Public can view AURUM spot prices" ON public.aurum_spot_prices;
DROP POLICY IF EXISTS "Public can view AURUM daily closes" ON public.aurum_daily_closes;

REVOKE SELECT ON public.aurum_spot_prices FROM anon, authenticated;
REVOKE SELECT ON public.aurum_daily_closes FROM anon, authenticated;

GRANT ALL ON public.aurum_spot_prices TO service_role;
GRANT ALL ON public.aurum_daily_closes TO service_role;