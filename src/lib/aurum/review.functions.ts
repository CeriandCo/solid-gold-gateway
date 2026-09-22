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

/* ------------------------------------------------------------------ *
 * Publish / schedule — a thin wrapper over public.aurum_publish_post.
 * ------------------------------------------------------------------ */

export const PUBLISH_UNAUTHENTICATED = "Sign in again to publish this post.";
export const PUBLISH_FORBIDDEN_ROLE = "Only a reviewer or an admin can publish a post.";
export const PUBLISH_SELF_APPROVAL = "Another reviewer has to approve your own post.";
export const PUBLISH_SETTINGS_UNAVAILABLE =
  "Publishing is unavailable right now. Try again in a moment.";
export const PUBLISH_NOT_FOUND = "That post could not be found.";
export const PUBLISH_WRONG_STATUS = "That post is no longer awaiting review.";
export const PUBLISH_CONFLICT =
  "Another reviewer already published or scheduled this post. Reload the page.";
export const PUBLISH_EMPTY_BODY = "That post has no content to publish.";
export const PUBLISH_MISSING_SOURCE = "Add at least one source before publishing.";
export const PUBLISH_PAST_TIME = "To publish immediately, leave the publication time empty.";
export const PUBLISH_BAD_TIME =
  "Enter a publication time as a full date and time including its time zone.";
export const PUBLISH_UNEXPECTED = "That post could not be published. Try again.";

/** ISO-8601 instant with an explicit zone: trailing Z or a ±HH:MM offset. */
const ABSOLUTE_INSTANT =
  /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d{1,6})?)?(Z|[+-]\d{2}:\d{2})$/;

const publishInput = z
  .object({
    postId: z.string().uuid(),
    // A timezone-less local datetime is refused rather than guessed at.
    publishedAt: z
      .string()
      .trim()
      .regex(ABSOLUTE_INSTANT, PUBLISH_BAD_TIME)
      .refine((value) => !Number.isNaN(Date.parse(value)), PUBLISH_BAD_TIME)
      .nullish()
      .transform((value) => (value ? new Date(value).toISOString() : null)),
  })
  .strict();

export type PublishPostInput = z.input<typeof publishInput>;

/** The server function's input contract, exported so it can be tested directly. */
export function parsePublishInput(data: unknown): { postId: string; publishedAt: string | null } {
  return publishInput.parse(data ?? {});
}

export type PublishPostResult = {
  id: string;
  status: "published";
  publishedAt: string;
  changed: boolean;
};

/**
 * Translates the RPC's SQLSTATE + stable message into the application's error
 * vocabulary. 42501 and 23514 each cover two distinct situations the RPC
 * separates by message, so both are inspected.
 */
export function translatePublishError(error: { code?: string; message?: string }): Error {
  const code = error.code ?? "";
  const message = error.message ?? "";

  if (code === "28000") return new Error(PUBLISH_UNAUTHENTICATED);
  if (code === "P0002") return new Error(PUBLISH_NOT_FOUND);
  if (code === "40001") return new Error(PUBLISH_CONFLICT);
  if (code === "55000") return new Error(PUBLISH_WRONG_STATUS);
  if (code === "22007") return new Error(PUBLISH_PAST_TIME);
  if (code === "42501") {
    if (/another reviewer must approve/i.test(message)) return new Error(PUBLISH_SELF_APPROVAL);
    if (/approval settings are unavailable/i.test(message)) {
      return new Error(PUBLISH_SETTINGS_UNAVAILABLE);
    }
    return new Error(PUBLISH_FORBIDDEN_ROLE);
  }
  if (code === "23514") {
    if (/at least one source/i.test(message)) return new Error(PUBLISH_MISSING_SOURCE);
    if (/no content to publish/i.test(message)) return new Error(PUBLISH_EMPTY_BODY);
  }

  // Unknown database failure: fail closed, and say nothing about internals.
  console.error("aurum_publish_post failed", { code, message });
  return new Error(PUBLISH_UNEXPECTED);
}

const publishPayload = z.object({
  id: z.string().uuid(),
  status: z.literal("published"),
  published_at: z.string().min(1),
  changed: z.boolean(),
});

export async function performPublishPost(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  input: { postId: string; publishedAt: string | null },
): Promise<PublishPostResult> {
  // Defence in depth only — the RPC independently enforces the same rule.
  await requireRole(supabase, ["reviewer", "admin"]);

  const { data, error } = await supabase.rpc("aurum_publish_post", {
    _post_id: input.postId,
    _published_at: input.publishedAt,
  });
  if (error) throw translatePublishError(error);

  const parsed = publishPayload.safeParse(data);
  if (!parsed.success) {
    console.error("aurum_publish_post returned an unexpected payload");
    throw new Error(PUBLISH_UNEXPECTED);
  }

  return {
    id: parsed.data.id,
    status: "published",
    publishedAt: parsed.data.published_at,
    changed: parsed.data.changed,
  };
}

export const publishPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(parsePublishInput)
  .handler(
    async ({ data, context }): Promise<PublishPostResult> =>
      performPublishPost(context.supabase, data),
  );

/* ------------------------------------------------------------------ *
 * Return to draft — in_review -> draft, so the author can make changes.
 *
 * Not an approval decision: the self-approval setting is deliberately not
 * consulted, and no content or source validation runs. Returning a post for
 * changes must work precisely when the content is incomplete.
 * ------------------------------------------------------------------ */

export const RETURN_NOT_FOUND = "That post could not be found.";
export const RETURN_WRONG_STATUS = "That post is not awaiting review.";
export const RETURN_UNEXPECTED = "That post could not be returned to draft. Try again.";

const returnInput = z.object({ postId: z.string().uuid() }).strict();

/** The server function's input contract, exported so it can be tested directly. */
export function parseReturnInput(data: unknown): { postId: string } {
  return returnInput.parse(data ?? {});
}

export type ReturnToDraftResult = {
  id: string;
  status: "draft";
  changed: boolean;
};

export type ReturnDeps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPrivileged: () => Promise<any>;
};

export async function performReturnToDraft(
  deps: ReturnDeps,
  input: { postId: string },
): Promise<ReturnToDraftResult> {
  // Reviewing is a reviewer/admin act, exactly as publication is.
  await requireRole(deps.supabase, ["reviewer", "admin"]);

  // Authorized: only now is privileged capability obtained.
  const privileged = await deps.getPrivileged();

  // The starting state is enforced by the write itself, never by a prior read.
  const { data: updated, error } = await privileged
    .from("aurum_posts")
    .update({
      status: "draft",
      submitted_at: null,
      // Cleared, not overwritten: reviewed_by means "the reviewer who approved
      // this post", and nothing here was approved.
      reviewed_by: null,
      reviewed_at: null,
    })
    .eq("id", input.postId)
    .eq("status", "in_review")
    .select("id, status");
  if (error) throw writeError(error);

  const written = (updated ?? []) as { id: string }[];
  if (written.length > 0) {
    return { id: written[0]!.id, status: "draft", changed: true };
  }

  // Nothing moved: either the post is gone, or it left review first.
  const { data: after, error: afterError } = await privileged
    .from("aurum_posts")
    .select("status")
    .eq("id", input.postId)
    .maybeSingle();
  if (afterError) throw new Error(RETURN_UNEXPECTED);
  if (!after) throw new Error(RETURN_NOT_FOUND);
  throw new Error(RETURN_WRONG_STATUS);
}

export const returnToDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(parseReturnInput)
  .handler(
    async ({ data, context }): Promise<ReturnToDraftResult> =>
      performReturnToDraft(
        {
          supabase: context.supabase,
          getPrivileged: async () =>
            (await import("@/integrations/supabase/client.server")).supabaseAdmin,
        },
        data,
      ),
  );

/* ------------------------------------------------------------------ *
 * Archive (unpublish) — published -> archived.
 *
 * One action serves two situations, because a scheduled post is simply a
 * published row whose publication time has not arrived: it unpublishes live
 * content and it cancels a scheduled publication.
 *
 * Removal from public view is a safety action, never an approval decision: no
 * content or source validation runs, the approval setting is not consulted, and
 * publication provenance (published_at, reviewed_by, reviewed_at, submitted_at)
 * is deliberately preserved for a later restore design.
 * ------------------------------------------------------------------ */

export const ARCHIVE_NOT_FOUND = "That post could not be found.";
export const ARCHIVE_WRONG_STATUS = "That post is not published.";
export const ARCHIVE_UNEXPECTED = "That post could not be unpublished. Try again.";

const archiveInput = z.object({ postId: z.string().uuid() }).strict();

/** The server function's input contract, exported so it can be tested directly. */
export function parseArchiveInput(data: unknown): { postId: string } {
  return archiveInput.parse(data ?? {});
}

export type ArchivePostResult = {
  id: string;
  status: "archived";
  changed: boolean;
};

export type ArchiveDeps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPrivileged: () => Promise<any>;
};

export async function performArchivePost(
  deps: ArchiveDeps,
  input: { postId: string },
): Promise<ArchivePostResult> {
  // Taking content off the site is a reviewer/admin act, exactly as putting it
  // there is. The role always comes from the caller's own client.
  await requireRole(deps.supabase, ["reviewer", "admin"]);

  // Authorized: only now is privileged capability obtained.
  const privileged = await deps.getPrivileged();

  // Status is a predicate on the write itself, never a prior read: that is what
  // makes two simultaneous requests produce exactly one transition. It matches
  // live and scheduled rows alike, both of which are status = 'published'.
  const { data: updated, error } = await privileged
    .from("aurum_posts")
    .update({ status: "archived" })
    .eq("id", input.postId)
    .eq("status", "published")
    .select("id, status");
  if (error) throw writeError(error);

  const written = (updated ?? []) as { id: string }[];
  if (written.length > 0) {
    return { id: written[0]!.id, status: "archived", changed: true };
  }

  // Nothing moved: the post is gone, or it is not (or no longer) published.
  // An already archived row is reported as a wrong state rather than as
  // idempotent success — the schema records no archived_by/archived_at, so this
  // request cannot be shown to be the one that produced the archived state.
  const { data: after, error: afterError } = await privileged
    .from("aurum_posts")
    .select("status")
    .eq("id", input.postId)
    .maybeSingle();
  if (afterError) throw new Error(ARCHIVE_UNEXPECTED);
  if (!after) throw new Error(ARCHIVE_NOT_FOUND);
  throw new Error(ARCHIVE_WRONG_STATUS);
}

export const archivePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(parseArchiveInput)
  .handler(
    async ({ data, context }): Promise<ArchivePostResult> =>
      performArchivePost(
        {
          supabase: context.supabase,
          getPrivileged: async () =>
            (await import("@/integrations/supabase/client.server")).supabaseAdmin,
        },
        data,
      ),
  );
