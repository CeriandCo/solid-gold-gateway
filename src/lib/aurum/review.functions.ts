/**
 * AURUM review workflow — submission step (draft -> in_review) and the thin
 * wrapper over the atomic publish/schedule primitive.
 *
 * Authentication happens in the middleware, authorization through the caller's
 * own user-scoped client, and only then is the privileged client loaded to make
 * the workflow write the authenticated session is deliberately forbidden to make
 * (see the aurum_posts_guard_workflow_fields trigger).
 *
 * Publication is different: public.aurum_publish_post is the authority, and it
 * reads auth.uid() to record who approved. The wrapper therefore calls it with
 * the caller's own client and never with service-role capability.
 */
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireRole } from "@/lib/admin-roles";
import { parseDraftInput, writeError } from "@/lib/admin.functions";


export const SUBMIT_NOT_FOUND = "That post could not be found.";
export const SUBMIT_FORBIDDEN = "You cannot send that post for review.";
export const SUBMIT_WRONG_STATUS = "Only a draft can be sent for review.";
export const SUBMIT_STALE =
  "This draft changed after you opened it. Reload the page and try again.";
export const SUBMIT_MISSING_SOURCE = "Add at least one source before sending this for review.";
export const SUBMIT_CONFLICT = "Someone else changed this post. Reload the page and try again.";

export type SubmitForReviewInput = {
  postId: string;
  /**
   * Optional `aurum_posts.updated_at` the editor's form was loaded with.
   *
   * It protects exactly one thing: submitting while the POST ROW has moved on
   * since the form was opened (title, slug, summary, body, pull quote, review
   * line, read minutes, publication date). It is NOT a post+sources version
   * token — source rows are written by aurum_replace_post_sources, which does
   * not touch aurum_posts.updated_at.
   */
  updatedAt: string | null;
};

export type SubmitForReviewResult = {
  id: string;
  status: "in_review";
  submittedAt: string | null;
  changed: boolean;
};

const SOURCED_TYPES = new Set(["daily_note", "weekly_brief"]);

type PersistedPost = {
  id: string;
  type: string;
  status: string;
  slug: string;
  title: string;
  summary: string;
  body: unknown;
  pull_quote: string | null;
  review_line: string | null;
  read_minutes: number | null;
  published_at: string | null;
  updated_at: string;
  submitted_at: string | null;
  author_id: string | null;
};

const POST_COLUMNS =
  "id, type, status, slug, title, summary, body, pull_quote, review_line, read_minutes, published_at, updated_at, submitted_at, author_id";

/**
 * Validates the PERSISTED row with the same rules the draft editor enforces, so
 * a post can never enter review on unsaved or hand-crafted values.
 */
export function validatePersistedPost(post: PersistedPost): void {
  if (!SOURCED_TYPES.has(post.type) && post.type !== "article") {
    throw new Error("That post type cannot be sent for review.");
  }
  parseDraftInput({
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    body: Array.isArray(post.body) ? post.body : [],
    pullQuote: post.pull_quote,
    reviewLine: post.review_line,
    readMinutes: post.read_minutes,
    publishedAt: post.published_at,
    sources: [],
  });
}

export type SubmitDeps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPrivileged: () => Promise<any>;
};

export async function performSubmitForReview(
  deps: SubmitDeps,
  input: SubmitForReviewInput,
): Promise<SubmitForReviewResult> {
  const { supabase, getPrivileged } = deps;

  // Any listed editor may submit; who may submit WHICH post is the database's
  // existing draft-ownership truth, asked below.
  await requireRole(supabase, ["editor", "reviewer", "admin"]);

  const { data: post, error } = await supabase
    .from("aurum_posts")
    .select(POST_COLUMNS)
    .eq("id", input.postId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!post) throw new Error(SUBMIT_NOT_FOUND);
  const row = post as PersistedPost;

  // Reuse aurum_can_edit_draft rather than restating ownership rules here.
  const { data: mayEdit, error: permissionError } = await supabase.rpc("aurum_can_edit_draft", {
    _author_id: row.author_id,
  });
  if (permissionError) throw new Error(permissionError.message);
  if (mayEdit !== true) throw new Error(SUBMIT_FORBIDDEN);

  if (row.status !== "draft") {
    // A post already awaiting review is the intended end state: idempotent
    // success, and the original submission time is left exactly as it was.
    if (row.status === "in_review") {
      return { id: row.id, status: "in_review", submittedAt: row.submitted_at, changed: false };
    }
    throw new Error(SUBMIT_WRONG_STATUS);
  }

  if (input.updatedAt && input.updatedAt !== row.updated_at) throw new Error(SUBMIT_STALE);

  validatePersistedPost(row);

  if (SOURCED_TYPES.has(row.type)) {
    const { count, error: sourceError } = await supabase
      .from("aurum_post_sources")
      .select("id", { count: "exact", head: true })
      .eq("post_id", row.id);
    if (sourceError) throw new Error(sourceError.message);
    if ((count ?? 0) === 0) throw new Error(SUBMIT_MISSING_SOURCE);
  }

  // Authorized: only now is privileged capability obtained.
  const privileged = await getPrivileged();
  const submittedAt = new Date().toISOString();
  const { data: updated, error: updateError } = await privileged
    .from("aurum_posts")
    .update({
      status: "in_review",
      submitted_at: submittedAt,
      reviewed_by: null,
      reviewed_at: null,
    })
    .eq("id", row.id)
    .eq("status", "draft")
    // Any edit to the post row between validation and this write loses the race.
    .eq("updated_at", row.updated_at)
    .select("id, status, submitted_at");
  if (updateError) throw writeError(updateError);

  const written = (updated ?? []) as { id: string; status: string; submitted_at: string }[];
  if (written.length === 0) {
    const { data: after, error: afterError } = await privileged
      .from("aurum_posts")
      .select("status, submitted_at")
      .eq("id", row.id)
      .maybeSingle();
    if (afterError) throw new Error(afterError.message);
    if (!after) throw new Error(SUBMIT_NOT_FOUND);
    if (after.status === "in_review") {
      return { id: row.id, status: "in_review", submittedAt: after.submitted_at, changed: false };
    }
    throw new Error(SUBMIT_CONFLICT);
  }

  return {
    id: row.id,
    status: "in_review",
    submittedAt: written[0]!.submitted_at,
    changed: true,
  };
}

export const submitForReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>;
    const updatedAt = String(input["updatedAt"] ?? "").trim();
    return {
      postId: String(input["postId"] ?? ""),
      updatedAt: updatedAt.length > 0 ? updatedAt : null,
    };
  })
  .handler(async ({ data, context }): Promise<SubmitForReviewResult> =>
    performSubmitForReview(
      {
        supabase: context.supabase,
        getPrivileged: async () =>
          (await import("@/integrations/supabase/client.server")).supabaseAdmin,
      },
      data,
    ),
  );
