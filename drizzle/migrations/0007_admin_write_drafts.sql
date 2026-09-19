-- Step 3b-2: listed editors may create, edit and delete DRAFTS only.
-- Published, scheduled and archived posts stay read-only through the API.

GRANT INSERT, UPDATE, DELETE ON public.aurum_posts TO authenticated;

-- Who may touch a given draft: editors only their own, reviewers/admins any.
CREATE OR REPLACE FUNCTION public.aurum_can_edit_draft(_author_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE public.aurum_current_editor_role()
    WHEN 'admin' THEN true
    WHEN 'reviewer' THEN true
    WHEN 'editor' THEN _author_id = auth.uid()
    ELSE false
  END;
$$;

CREATE POLICY "Listed editors create drafts"
ON public.aurum_posts
FOR INSERT
TO authenticated
WITH CHECK (
  public.aurum_current_editor_role() IS NOT NULL
  AND status = 'draft'
  AND author_id = auth.uid()
);

CREATE POLICY "Editors update drafts"
ON public.aurum_posts
FOR UPDATE
TO authenticated
USING (status = 'draft' AND public.aurum_can_edit_draft(author_id))
WITH CHECK (status = 'draft' AND public.aurum_can_edit_draft(author_id));

CREATE POLICY "Editors delete drafts"
ON public.aurum_posts
FOR DELETE
TO authenticated
USING (status = 'draft' AND public.aurum_can_edit_draft(author_id));

-- Workflow columns are owned by the review workflow (step 4), never by the form.
CREATE OR REPLACE FUNCTION public.aurum_posts_guard_workflow_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Only ordinary user sessions are constrained; service role and maintenance are not.
  IF current_user <> 'authenticated' THEN
    RETURN NEW;
  END IF;

  IF NEW.author_id IS DISTINCT FROM OLD.author_id
     OR NEW.type IS DISTINCT FROM OLD.type
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.submitted_at IS DISTINCT FROM OLD.submitted_at
     OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
     OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at THEN
    RAISE EXCEPTION 'AURUM workflow fields (author, type, status, review) change only through the review workflow'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER aurum_posts_guard_workflow_fields_trg
BEFORE UPDATE ON public.aurum_posts
FOR EACH ROW EXECUTE FUNCTION public.aurum_posts_guard_workflow_fields();
