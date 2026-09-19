-- Read-only access to editorial content for anyone on the editor allowlist.
-- The public site keeps using the service-role server module; these grants and
-- policies exist only so the signed-in admin area can read drafts too.

GRANT SELECT ON public.aurum_posts TO authenticated;
GRANT SELECT ON public.aurum_post_sources TO authenticated;
GRANT ALL ON public.aurum_posts TO service_role;
GRANT ALL ON public.aurum_post_sources TO service_role;

CREATE POLICY "Listed editors read all posts"
ON public.aurum_posts
FOR SELECT
TO authenticated
USING (public.aurum_current_editor_role() IS NOT NULL);

CREATE POLICY "Listed editors read all post sources"
ON public.aurum_post_sources
FOR SELECT
TO authenticated
USING (public.aurum_current_editor_role() IS NOT NULL);