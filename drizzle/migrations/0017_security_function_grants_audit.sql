CREATE OR REPLACE FUNCTION public.security_function_grants()
RETURNS TABLE (
  function_name text,
  arguments text,
  security_definer boolean,
  anon_execute boolean,
  authenticated_execute boolean,
  service_role_execute boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.proname::text,
         pg_get_function_identity_arguments(p.oid),
         p.prosecdef,
         has_function_privilege('anon', p.oid, 'EXECUTE'),
         has_function_privilege('authenticated', p.oid, 'EXECUTE'),
         has_function_privilege('service_role', p.oid, 'EXECUTE')
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
  ORDER BY p.proname;
$$;

REVOKE ALL ON FUNCTION public.security_function_grants() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.security_function_grants() TO service_role;