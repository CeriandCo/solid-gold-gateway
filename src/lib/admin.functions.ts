import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { NEUTRAL_SIGN_IN_MESSAGE } from "@/lib/admin.server";

export type AdminRole = "admin" | "reviewer" | "editor";

export type AdminMe = {
  email: string;
  role: AdminRole | null;
};

export type EditorRow = {
  id: string;
  email: string;
  role: AdminRole;
  signedIn: boolean;
  createdAt: string;
};

const ROLES: AdminRole[] = ["admin", "reviewer", "editor"];

function parseRole(value: unknown): AdminRole {
  const role = ROLES.find((candidate) => candidate === value);
  if (!role) throw new Error("Choose a role of admin, reviewer or editor.");
  return role;
}

/**
 * Resolves the caller's role through the user-scoped client, linking their auth user
 * to the allowlist row on first sign-in. Returns null for anyone not on the list.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resolveRole(supabase: any): Promise<AdminRole | null> {
  const { data, error } = await supabase.rpc("aurum_link_current_editor");
  if (error) throw new Error(error.message);
  return (data as AdminRole | null) ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function requireAdmin(supabase: any): Promise<void> {
  const role = await resolveRole(supabase);
  if (role !== "admin") throw new Error("Forbidden: this area is for admins only.");
}

/** Public: allowlist-gated, rate-limited magic-link request. Never reveals membership. */
export const requestAdminSignInLink = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>;
    return { email: String(input["email"] ?? "") };
  })
  .handler(async ({ data }) => {
    const { normalizeEmail, isValidEmail, sendAdminSignInLink } = await import(
      "@/lib/admin.server"
    );
    const email = normalizeEmail(data.email);
    if (!isValidEmail(email)) return { message: NEUTRAL_SIGN_IN_MESSAGE };

    // The return host comes from the request itself, so the link always comes back to
    // whichever host the person started from (preview now, the live domain later).
    const origin = new URL(getRequest().url).origin;
    const outcome = await sendAdminSignInLink(email, `${origin}/admin`);
    console.info(`[admin] sign-in link request: ${outcome}`);
    return { message: NEUTRAL_SIGN_IN_MESSAGE };
  });

export const getAdminMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminMe> => {
    const role = await resolveRole(context.supabase);
    const email = String((context.claims as { email?: string }).email ?? "");
    return { email, role };
  });

export const listEditors = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<EditorRow[]> => {
    await requireAdmin(context.supabase);
    const { data, error } = await context.supabase
      .from("aurum_editors")
      .select("id, email, role, user_id, created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => ({
      id: row.id,
      email: row.email,
      role: row.role as AdminRole,
      signedIn: row.user_id !== null,
      createdAt: row.created_at,
    }));
  });

export const addEditor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>;
    return { email: String(input["email"] ?? ""), role: parseRole(input["role"]) };
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase);
    const { normalizeEmail, isValidEmail } = await import("@/lib/admin.server");
    const email = normalizeEmail(data.email);
    if (!isValidEmail(email)) throw new Error("Enter a valid email address.");

    const { error } = await context.supabase
      .from("aurum_editors")
      .insert({ email, role: data.role, created_by: context.userId });
    if (error) {
      throw new Error(
        error.code === "23505" ? "That email is already on the list." : error.message,
      );
    }
    return { ok: true };
  });

export const setEditorRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>;
    return { id: String(input["id"] ?? ""), role: parseRole(input["role"]) };
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase);
    const { error } = await context.supabase
      .from("aurum_editors")
      .update({ role: data.role })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeEditor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => ({
    id: String(((data ?? {}) as Record<string, unknown>)["id"] ?? ""),
  }))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase);
    const { error } = await context.supabase.from("aurum_editors").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getCmsSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const role = await resolveRole(context.supabase);
    if (!role) throw new Error("Forbidden: you are not on the editor list.");
    const { data, error } = await context.supabase
      .from("aurum_cms_settings")
      .select("allow_self_approval, updated_at")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return {
      allowSelfApproval: data?.allow_self_approval ?? true,
      updatedAt: data?.updated_at ?? null,
    };
  });

export const setAllowSelfApproval = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => ({
    allowSelfApproval: Boolean(((data ?? {}) as Record<string, unknown>)["allowSelfApproval"]),
  }))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase);
    const { error } = await context.supabase
      .from("aurum_cms_settings")
      .update({
        allow_self_approval: data.allowSelfApproval,
        updated_at: new Date().toISOString(),
        updated_by: context.userId,
      })
      .eq("id", true);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Posts (read-only for now; creating and editing arrive in the next step)
// ---------------------------------------------------------------------------

export type AdminPostTypeFilter = "all" | "daily_note" | "weekly_brief";
export type AdminStatusTab =
  | "all"
  | "draft"
  | "in_review"
  | "scheduled"
  | "published"
  | "archived";

/** The lifecycle shown in the admin; "scheduled" is derived, never stored. */
export type AdminPostStatus = Exclude<AdminStatusTab, "all">;

export type AdminPostRow = {
  id: string;
  title: string;
  type: string;
  status: AdminPostStatus;
  publishedAt: string | null;
  updatedAt: string;
  sourceCount: number;
};

export type AdminPostsPage = {
  rows: AdminPostRow[];
  total: number;
  page: number;
  pageSize: number;
  counts: Record<AdminStatusTab, number>;
};

export type AdminPostDetail = {
  id: string;
  title: string;
  type: string;
  status: AdminPostStatus;
  summary: string;
  publishedAt: string | null;
  updatedAt: string;
  sources: { publisher: string; title: string; date: string; url: string }[];
};

export const ADMIN_POSTS_PAGE_SIZE = 25;

const POST_TYPES = ["daily_note", "weekly_brief"] as const;
const STATUS_TABS: AdminStatusTab[] = [
  "all",
  "draft",
  "in_review",
  "scheduled",
  "published",
  "archived",
];

function parseTypeFilter(value: unknown): AdminPostTypeFilter {
  if (value === "all") return "all";
  const type = POST_TYPES.find((candidate) => candidate === value);
  if (!type) throw new Error("Unsupported type filter.");
  return type;
}

function parseStatusTab(value: unknown): AdminStatusTab {
  const tab = STATUS_TABS.find((candidate) => candidate === value);
  if (!tab) throw new Error("Unsupported status filter.");
  return tab;
}

/** PostgREST treats % and _ in like patterns as wildcards; strip them from search. */
function cleanSearch(value: string): string {
  return value.trim().replace(/[%_]/g, "").slice(0, 120);
}

/** Type + search filters shared by the row query and every tab count. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyListFilters(query: any, type: AdminPostTypeFilter, search: string): any {
  if (type !== "all") query = query.eq("type", type);
  if (search) query = query.ilike("title", `%${search}%`);
  return query;
}

/** Status-tab filter. Scheduled = published with a future publication time. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyStatusTab(query: any, tab: AdminStatusTab, now: string): any {
  switch (tab) {
    case "all":
      return query;
    case "scheduled":
      return query.eq("status", "published").gt("published_at", now);
    case "published":
      return query.eq("status", "published").lte("published_at", now);
    default:
      return query.eq("status", tab);
  }
}

function deriveStatus(status: string, publishedAt: string | null, now: string): AdminPostStatus {
  if (status === "published" && publishedAt && publishedAt > now) return "scheduled";
  return status as AdminPostStatus;
}

export const listAdminPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>;
    const page = Number(input["page"] ?? 1);
    return {
      type: parseTypeFilter(input["type"]),
      status: parseStatusTab(input["status"]),
      search: cleanSearch(String(input["search"] ?? "")),
      page: Number.isFinite(page) ? Math.max(Math.trunc(page), 1) : 1,
    };
  })
  .handler(async ({ data, context }): Promise<AdminPostsPage> => {
    const role = await resolveRole(context.supabase);
    if (!role) throw new Error("Forbidden: you are not on the editor list.");

    const now = new Date().toISOString();
    const from = (data.page - 1) * ADMIN_POSTS_PAGE_SIZE;

    const counts = Object.fromEntries(
      await Promise.all(
        STATUS_TABS.map(async (tab) => {
          const query = applyStatusTab(
            applyListFilters(
              context.supabase
                .from("aurum_posts")
                .select("id", { count: "exact", head: true }),
              data.type,
              data.search,
            ),
            tab,
            now,
          );
          const { count, error } = await query;
          if (error) throw new Error(error.message);
          return [tab, count ?? 0];
        }),
      ),
    ) as Record<AdminStatusTab, number>;

    const { data: posts, error } = await applyStatusTab(
      applyListFilters(
        context.supabase
          .from("aurum_posts")
          .select("id, title, type, status, published_at, updated_at"),
        data.type,
        data.search,
      ),
      data.status,
      now,
    )
      .order("updated_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, from + ADMIN_POSTS_PAGE_SIZE - 1);
    if (error) throw new Error(error.message);

    type PostRow = {
      id: string;
      title: string;
      type: string;
      status: string;
      published_at: string | null;
      updated_at: string;
    };
    const postRows = (posts ?? []) as PostRow[];
    const ids = postRows.map((post) => post.id);
    const sourceCounts = new Map<string, number>();
    if (ids.length > 0) {
      const { data: sources, error: sourceError } = await context.supabase
        .from("aurum_post_sources")
        .select("post_id")
        .in("post_id", ids);
      if (sourceError) throw new Error(sourceError.message);
      for (const source of sources ?? []) {
        sourceCounts.set(source.post_id, (sourceCounts.get(source.post_id) ?? 0) + 1);
      }
    }

    return {
      rows: postRows.map((post) => ({
        id: post.id,
        title: post.title,
        type: post.type,
        status: deriveStatus(post.status, post.published_at, now),
        publishedAt: post.published_at,
        updatedAt: post.updated_at,
        sourceCount: sourceCounts.get(post.id) ?? 0,
      })),
      total: counts[data.status],
      page: data.page,
      pageSize: ADMIN_POSTS_PAGE_SIZE,
      counts,
    };
  });

export const getAdminPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => ({
    id: String(((data ?? {}) as Record<string, unknown>)["id"] ?? ""),
  }))
  .handler(async ({ data, context }): Promise<AdminPostDetail | null> => {
    const role = await resolveRole(context.supabase);
    if (!role) throw new Error("Forbidden: you are not on the editor list.");

    const { data: post, error } = await context.supabase
      .from("aurum_posts")
      .select("id, title, type, status, summary, published_at, updated_at")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) return null;

    const { data: sources, error: sourceError } = await context.supabase
      .from("aurum_post_sources")
      .select("publisher, title, source_date, url")
      .eq("post_id", post.id)
      .order("position", { ascending: true });
    if (sourceError) throw new Error(sourceError.message);

    const now = new Date().toISOString();
    return {
      id: post.id,
      title: post.title,
      type: post.type,
      status: deriveStatus(post.status, post.published_at, now),
      summary: post.summary,
      publishedAt: post.published_at,
      updatedAt: post.updated_at,
      sources: (sources ?? []).map((source) => ({
        publisher: source.publisher,
        title: source.title,
        date: source.source_date,
        url: source.url,
      })),
    };
  });

// ---------------------------------------------------------------------------
// Draft editing (step 3b-2). Drafts only: RLS refuses anything else.
// ---------------------------------------------------------------------------

export type AdminPostEditable = {
  id: string;
  type: "daily_note" | "weekly_brief" | string;
  status: AdminPostStatus;
  slug: string;
  title: string;
  summary: string;
  body: string[];
  pullQuote: string;
  reviewLine: string;
  readMinutes: number | null;
  publishedAt: string | null;
  updatedAt: string;
  /** False for published, scheduled and archived posts: the form opens read-only. */
  editable: boolean;
  sources: { publisher: string; title: string; date: string; url: string }[];
};

export type AdminSourceInput = {
  publisher: string;
  title: string;
  date: string;
  url: string;
};

export type AdminDraftInput = {
  title: string;
  slug: string;
  summary: string;
  body: string[];
  pullQuote: string | null;
  reviewLine: string | null;
  readMinutes: number | null;
  publishedAt: string | null;
  sources: AdminSourceInput[];
};


export const WEEKLY_BRIEF_REVIEW_LINE =
  "Drafted with AI assistance from approved sources, and reviewed by a person before publication and before sending.";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Title -> slug; the form uses the same rule so the server never surprises the user. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function optionalText(value: unknown): string | null {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function parseDraftInput(input: Record<string, unknown>): AdminDraftInput {
  const title = String(input["title"] ?? "").trim();
  if (!title) throw new Error("A title is required.");

  const slug = String(input["slug"] ?? "").trim().toLowerCase();
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error("The web address can only use lowercase letters, numbers and hyphens.");
  }

  const summary = String(input["summary"] ?? "").trim();
  if (!summary) throw new Error("A summary is required.");

  const body = (Array.isArray(input["body"]) ? input["body"] : [])
    .map((paragraph) => String(paragraph ?? "").trim())
    .filter((paragraph) => paragraph.length > 0);
  if (body.length === 0) throw new Error("Add at least one paragraph.");

  const readMinutesRaw = input["readMinutes"];
  let readMinutes: number | null = null;
  if (readMinutesRaw !== null && readMinutesRaw !== undefined && readMinutesRaw !== "") {
    const parsed = Math.trunc(Number(readMinutesRaw));
    if (!Number.isFinite(parsed) || parsed < 1) throw new Error("Read time must be 1 or more.");
    readMinutes = parsed;
  }

  const publishedAtRaw = optionalText(input["publishedAt"]);
  let publishedAt: string | null = null;
  if (publishedAtRaw) {
    const date = new Date(publishedAtRaw);
    if (Number.isNaN(date.getTime())) throw new Error("That publication date is not valid.");
    publishedAt = date.toISOString();
  }

  return {
    title,
    slug,
    summary,
    body,
    pullQuote: optionalText(input["pullQuote"]),
    reviewLine: optionalText(input["reviewLine"]),
    readMinutes,
    publishedAt,
    sources: parseSources(input["sources"]),
  };
}

/** Same rules the form enforces inline, repeated here because the form cannot be trusted. */
function parseSources(value: unknown): AdminSourceInput[] {
  const list = Array.isArray(value) ? value : [];
  const today = new Date().toISOString().slice(0, 10);
  return list.map((raw, index) => {
    const item = (raw ?? {}) as Record<string, unknown>;
    const where = `Source ${index + 1}`;
    const publisher = String(item["publisher"] ?? "").trim();
    if (!publisher) throw new Error(`${where}: a publisher is required.`);
    const title = String(item["title"] ?? "").trim();
    if (!title) throw new Error(`${where}: a title is required.`);
    const date = String(item["date"] ?? "").trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(`${date}T00:00:00Z`).getTime())) {
      throw new Error(`${where}: a valid date is required.`);
    }
    if (date > today) throw new Error(`${where}: the date cannot be in the future.`);
    const url = String(item["url"] ?? "").trim();
    let parsed: URL | null = null;
    try {
      parsed = new URL(url);
    } catch {
      parsed = null;
    }
    if (!parsed || parsed.protocol !== "https:") {
      throw new Error(`${where}: the web link must be a full address starting with https://.`);
    }
    return { publisher, title, date, url };
  });
}


function writeError(error: { code?: string; message: string }): Error {
  if (error.code === "23505") {
    return new Error("That web address is already used by another post of this type.");
  }
  if (error.code === "42501" || /row-level security/i.test(error.message)) {
    return new Error("That post cannot be changed here. Only drafts you may edit can be saved.");
  }
  return new Error(error.message);
}

export const getAdminPostForEdit = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => ({
    id: String(((data ?? {}) as Record<string, unknown>)["id"] ?? ""),
  }))
  .handler(async ({ data, context }): Promise<AdminPostEditable | null> => {
    const role = await resolveRole(context.supabase);
    if (!role) throw new Error("Forbidden: you are not on the editor list.");

    const { data: post, error } = await context.supabase
      .from("aurum_posts")
      .select(
        "id, type, status, slug, title, summary, body, pull_quote, review_line, read_minutes, published_at, updated_at, author_id",
      )
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) return null;

    const { data: sources, error: sourceError } = await context.supabase
      .from("aurum_post_sources")
      .select("publisher, title, source_date, url")
      .eq("post_id", post.id)
      .order("position", { ascending: true });
    if (sourceError) throw new Error(sourceError.message);

    const now = new Date().toISOString();
    const status = deriveStatus(post.status, post.published_at, now);
    const mayEditOwn = role !== "editor" || post.author_id === context.userId;

    return {
      id: post.id,
      type: post.type,
      status,
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      body: Array.isArray(post.body) ? (post.body as string[]) : [],
      pullQuote: post.pull_quote ?? "",
      reviewLine: post.review_line ?? "",
      readMinutes: post.read_minutes,
      publishedAt: post.published_at,
      updatedAt: post.updated_at,
      editable: post.status === "draft" && mayEditOwn,
      sources: (sources ?? []).map((source) => ({
        publisher: source.publisher,
        title: source.title,
        date: source.source_date,
        url: source.url,
      })),
    };
  });

export const createDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>;
    return { type: parseTypeFilter(input["type"]), draft: parseDraftInput(input) };
  })
  .handler(async ({ data, context }): Promise<{ id: string }> => {
    const role = await resolveRole(context.supabase);
    if (!role) throw new Error("Forbidden: you are not on the editor list.");
    if (data.type === "all") throw new Error("Choose a post type.");

    const { data: row, error } = await context.supabase
      .from("aurum_posts")
      .insert({
        type: data.type,
        status: "draft",
        author_id: context.userId,
        slug: data.draft.slug,
        title: data.draft.title,
        summary: data.draft.summary,
        body: data.draft.body,
        pull_quote: data.draft.pullQuote,
        review_line: data.draft.reviewLine,
        read_minutes: data.draft.readMinutes,
        published_at: data.draft.publishedAt,
      })
      .select("id")
      .single();
    if (error) throw writeError(error);

    try {
      await saveSources(context.supabase, row.id, data.draft.sources);
    } catch (cause) {
      // Never leave a post behind without the sources the person just entered.
      await context.supabase.from("aurum_posts").delete().eq("id", row.id);
      throw cause;
    }
    return { id: row.id };
  });

/** One statement, one transaction: the whole source list is replaced or nothing is. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function saveSources(supabase: any, postId: string, sources: AdminSourceInput[]) {
  const { error } = await supabase.rpc("aurum_replace_post_sources", {
    _post_id: postId,
    _sources: sources,
  });
  if (error) throw writeError(error);
}

export const updateDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>;
    return { id: String(input["id"] ?? ""), draft: parseDraftInput(input) };
  })
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const role = await resolveRole(context.supabase);
    if (!role) throw new Error("Forbidden: you are not on the editor list.");

    const { data: rows, error } = await context.supabase
      .from("aurum_posts")
      .update({
        slug: data.draft.slug,
        title: data.draft.title,
        summary: data.draft.summary,
        body: data.draft.body,
        pull_quote: data.draft.pullQuote,
        review_line: data.draft.reviewLine,
        read_minutes: data.draft.readMinutes,
        published_at: data.draft.publishedAt,
      })
      .eq("id", data.id)
      .select("id");
    if (error) throw writeError(error);
    if (!rows || rows.length === 0) {
      throw new Error("That post cannot be changed here. Only drafts you may edit can be saved.");
    }
    await saveSources(context.supabase, data.id, data.draft.sources);
    return { ok: true };
  });


export const deleteDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => ({
    id: String(((data ?? {}) as Record<string, unknown>)["id"] ?? ""),
  }))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const role = await resolveRole(context.supabase);
    if (!role) throw new Error("Forbidden: you are not on the editor list.");

    const { data: rows, error } = await context.supabase
      .from("aurum_posts")
      .delete()
      .eq("id", data.id)
      .select("id");
    if (error) throw writeError(error);
    if (!rows || rows.length === 0) {
      throw new Error("That post cannot be deleted here. Only drafts you may edit can be removed.");
    }
    return { ok: true };
  });


/**
 * Public: email + password sign-in for the admin area.
 *
 * Every refusal returns the same message, so the endpoint cannot be used to
 * discover who is on the allowlist. Rate limiting, allowlist checks and the
 * immediate sign-out of a non-allowlisted account all happen server side.
 */
export const adminSignInWithPassword = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>;
    return { email: String(input["email"] ?? ""), password: String(input["password"] ?? "") };
  })
  .handler(async ({ data }) => {
    const { adminPasswordSignIn } = await import("@/lib/admin-password.server");
    const result = await adminPasswordSignIn(data.email, data.password);
    if (!result.ok) {
      console.info("[admin] password sign-in refused");
      return { ok: false as const, message: result.message };
    }
    return {
      ok: true as const,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  });

/** Admin only: set or reset the password of an allowlisted account. */
export const setEditorPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>;
    return { email: String(input["email"] ?? ""), password: String(input["password"] ?? "") };
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase);
    const { setAdminPassword } = await import("@/lib/admin-password.server");
    const result = await setAdminPassword(data.email, data.password);
    if (!result.ok) throw new Error(result.message);
    return { created: result.created };
  });
