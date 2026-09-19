-- AURUM CMS access control: allowlist of editors + single-row settings.
CREATE TABLE public.aurum_editors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE
    CHECK (email = lower(email) AND email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  role text NOT NULL CHECK (role IN ('admin','reviewer','editor')),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Single-row table: the primary key can only ever hold TRUE.
CREATE TABLE public.aurum_cms_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  allow_self_approval boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

INSERT INTO public.aurum_cms_settings (id) VALUES (true);

-- Role of the calling user: matched by user_id, or by verified auth email before
-- the first sign-in links the row. SECURITY DEFINER so RLS policies never query
-- aurum_editors recursively. Read-only on purpose (see aurum_link_current_editor).
CREATE OR REPLACE FUNCTION public.aurum_current_editor_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT e.role
  FROM public.aurum_editors e
  WHERE auth.uid() IS NOT NULL
    AND (
      e.user_id = auth.uid()
      OR (e.user_id IS NULL
          AND e.email = (SELECT lower(u.email) FROM auth.users u WHERE u.id = auth.uid()))
    )
  ORDER BY (e.user_id = auth.uid()) DESC NULLS LAST
  LIMIT 1
$$;

-- Links the caller's auth user to their allowlist row on first sign-in.
CREATE OR REPLACE FUNCTION public.aurum_link_current_editor()
RETURNS text
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_email text;
  v_role text;
BEGIN
  IF v_uid IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT role INTO v_role FROM public.aurum_editors WHERE user_id = v_uid;
  IF v_role IS NOT NULL THEN
    RETURN v_role;
  END IF;

  SELECT lower(email) INTO v_email FROM auth.users WHERE id = v_uid;
  IF v_email IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE public.aurum_editors
  SET user_id = v_uid
  WHERE email = v_email AND user_id IS NULL
  RETURNING role INTO v_role;

  RETURN v_role;
END;
$$;

-- The last admin can never be deleted or demoted.
CREATE OR REPLACE FUNCTION public.aurum_protect_last_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admins integer;
BEGIN
  IF OLD.role <> 'admin' THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.role = 'admin' THEN
    RETURN NEW;
  END IF;

  SELECT count(*) INTO v_admins FROM public.aurum_editors WHERE role = 'admin';
  IF v_admins <= 1 THEN
    RAISE EXCEPTION 'The last admin cannot be removed or demoted.'
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER aurum_editors_protect_last_admin
BEFORE UPDATE OR DELETE ON public.aurum_editors
FOR EACH ROW EXECUTE FUNCTION public.aurum_protect_last_admin();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.aurum_editors TO authenticated;
GRANT SELECT, UPDATE ON public.aurum_cms_settings TO authenticated;
GRANT ALL ON public.aurum_editors TO service_role;
GRANT ALL ON public.aurum_cms_settings TO service_role;
GRANT EXECUTE ON FUNCTION public.aurum_current_editor_role() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.aurum_link_current_editor() TO authenticated, service_role;

ALTER TABLE public.aurum_editors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aurum_cms_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage the editor allowlist"
ON public.aurum_editors FOR ALL TO authenticated
USING (public.aurum_current_editor_role() = 'admin')
WITH CHECK (public.aurum_current_editor_role() = 'admin');

CREATE POLICY "Editors read their own row"
ON public.aurum_editors FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Listed editors read settings"
ON public.aurum_cms_settings FOR SELECT TO authenticated
USING (public.aurum_current_editor_role() IS NOT NULL);

CREATE POLICY "Admins update settings"
ON public.aurum_cms_settings FOR UPDATE TO authenticated
USING (public.aurum_current_editor_role() = 'admin')
WITH CHECK (public.aurum_current_editor_role() = 'admin');

INSERT INTO public.aurum_editors (email, role) VALUES ('hoangvh238.dev@gmail.com', 'admin');
