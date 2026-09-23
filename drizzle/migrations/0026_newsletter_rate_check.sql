-- T3 Phase 6: atomic newsletter rate limiter. Records the attempt and counts
-- both windows under a per-bucket transaction advisory lock, so concurrent
-- requests from one bucket are serialised and each sees an exact count.
-- Returns true when the caller is over a limit.
CREATE OR REPLACE FUNCTION public.newsletter_rate_check(
  _ip_hash text,
  _short_max integer,
  _day_max integer,
  _short_seconds integer DEFAULT 900,
  _day_seconds integer DEFAULT 86400
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _short integer;
  _day integer;
BEGIN
  IF _ip_hash IS NULL OR length(_ip_hash) = 0 OR _short_max < 1 OR _day_max < 1
     OR _short_seconds < 1 OR _day_seconds < _short_seconds THEN
    RAISE EXCEPTION 'invalid rate check arguments';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended('newsletter_rate:' || _ip_hash, 0));

  INSERT INTO public.newsletter_attempts (ip_hash) VALUES (_ip_hash);

  SELECT count(*) FILTER (WHERE created_at > now() - make_interval(secs => _short_seconds)),
         count(*)
    INTO _short, _day
    FROM public.newsletter_attempts
   WHERE ip_hash = _ip_hash
     AND created_at > now() - make_interval(secs => _day_seconds);

  RETURN _short > _short_max OR _day > _day_max;
END;
$$;

REVOKE ALL ON FUNCTION public.newsletter_rate_check(text, integer, integer, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.newsletter_rate_check(text, integer, integer, integer, integer) TO service_role;