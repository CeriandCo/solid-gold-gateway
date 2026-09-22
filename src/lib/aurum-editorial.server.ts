// Server-only editorial reads for AURUM Daily Notes and Weekly Briefs.
// The browser never queries aurum_posts / aurum_post_sources directly: RLS has no
// policies at all, so the service-role client on the server is the only way in.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { formatShortDate, type AurumEditorial, type AurumEditorialSource } from "@/lib/aurum-editorial";

export type AurumEditorialType = "daily_note" | "weekly_brief" | "article";

export type EditorialPage = {
  items: AurumEditorial[];
  total: number;
  /** True when a deep-linked slug sits deeper than DEEP_LINK_MAX; the caller redirects to its own page. */
  deepLinkOverflow: boolean;
};

const POST_COLUMNS =
  "id, slug, title, summary, body, pull_quote, review_line, read_minutes, published_at";

/**
 * Hard ceiling on how far a shared ?note= link may expand the first page. Without it
 * a link to an old note would load every newer note in one request, and past 1000
 * rows the Data API silently truncates.
 */
const DEEP_LINK_MAX = 60;

/** "2026-09-08" -> "8 Sep 2026", exactly the strings the site shows today. */
const formatSourceDate = formatShortDate;

/** timestamptz -> the UTC calendar date as YYYY-MM-DD. */
function toUtcDate(value: string): string {
  return new Date(value).toISOString().slice(0, 10);
}


function deriveReadMinutes(body: string[]): number {
  const words = body.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

type SourceRow = {
  post_id: string;
  position: number;
  publisher: string;
  title: string;
  source_date: string;
  url: string;
};

function mapPost(row: Record<string, unknown>, sources: AurumEditorialSource[]): AurumEditorial {
  const body = Array.isArray(row["body"]) ? (row["body"] as string[]) : [];
  return {
    slug: row["slug"] as string,
    title: row["title"] as string,
    summary: row["summary"] as string,
    publishedAt: toUtcDate(row["published_at"] as string),
    readMinutes: (row["read_minutes"] as number | null) ?? deriveReadMinutes(body),
    body,
    ...(row["pull_quote"] ? { pullQuote: row["pull_quote"] as string } : {}),
    ...(row["review_line"] ? { reviewLine: row["review_line"] as string } : {}),
    sources,
  };
}

/**
 * A post is publicly visible only when it is published AND its publication time has
 * passed. Applied in one place so every read path shares it; a future-dated published
 * post is therefore scheduled, not live.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function visible(query: any): any {
  return query.eq("status", "published").lte("published_at", new Date().toISOString());
}

async function loadSources(postIds: string[]): Promise<Map<string, AurumEditorialSource[]>> {
  const map = new Map<string, AurumEditorialSource[]>();
  if (postIds.length === 0) return map;

  const { data, error } = await supabaseAdmin
    .from("aurum_post_sources")
    .select("post_id, position, publisher, title, source_date, url")
    .in("post_id", postIds)
    .order("position", { ascending: true });
  if (error) throw new Error(`Failed to load editorial sources: ${error.message}`);

  for (const row of (data ?? []) as SourceRow[]) {
    const list = map.get(row.post_id) ?? [];
    list.push({
      publisher: row.publisher,
      title: row.title,
      date: formatSourceDate(row.source_date),
      url: row.url,
    });
    map.set(row.post_id, list);
  }
  return map;
}

async function hydrate(rows: Record<string, unknown>[]): Promise<AurumEditorial[]> {
  const sources = await loadSources(rows.map((row) => row["id"] as string));
  return rows.map((row) => mapPost(row, sources.get(row["id"] as string) ?? []));
}

/**
 * How many visible posts of this type sort before the given slug (0 = newest).
 * Tie-aware: matches the list order (published_at desc, id desc), so two posts
 * sharing a timestamp can never swap between requests and be repeated or skipped.
 */
async function rankOfSlug(type: AurumEditorialType, slug: string): Promise<number | null> {
  const { data, error } = await visible(
    supabaseAdmin.from("aurum_posts").select("id, published_at").eq("type", type).eq("slug", slug),
  ).maybeSingle();
  if (error) throw new Error(`Failed to locate editorial post: ${error.message}`);
  if (!data) return null;

  const post = data as { id: string; published_at: string };
  const { count, error: countError } = await visible(
    supabaseAdmin.from("aurum_posts").select("id", { count: "exact", head: true }).eq("type", type),
  ).or(
    `published_at.gt.${post.published_at},and(published_at.eq.${post.published_at},id.gt.${post.id})`,
  );
  if (countError) throw new Error(`Failed to locate editorial post: ${countError.message}`);
  return count ?? 0;
}

export async function loadEditorialPage(input: {
  type: AurumEditorialType;
  limit: number;
  offset: number;
  includeSlug?: string | null;
}): Promise<EditorialPage> {
  let limit = input.limit;
  let deepLinkOverflow = false;

  // A shared link must open its note even when it sits past the first page — but only
  // up to DEEP_LINK_MAX. Anything deeper is redirected to the post's own page instead.
  if (input.includeSlug && input.offset === 0) {
    const rank = await rankOfSlug(input.type, input.includeSlug);
    if (rank !== null && rank + 1 > limit) {
      if (rank + 1 > DEEP_LINK_MAX) deepLinkOverflow = true;
      else limit = rank + 1;
    }
  }

  const { data, count, error } = await visible(
    supabaseAdmin
      .from("aurum_posts")
      .select(POST_COLUMNS, { count: "exact" })
      .eq("type", input.type),
  )
    .order("published_at", { ascending: false })
    .order("id", { ascending: false })
    .range(input.offset, input.offset + limit - 1);
  if (error) throw new Error(`Failed to load editorial posts: ${error.message}`);

  return {
    items: await hydrate((data ?? []) as Record<string, unknown>[]),
    total: count ?? 0,
    deepLinkOverflow,
  };
}


/**
 * Every publicly visible Daily Note and Weekly Brief, newest first, tie-broken by id
 * so the order can never swap between requests. Drafts, scheduled and archived posts
 * are excluded by the shared `visible()` filter.
 */
export async function loadEditorialArchive(): Promise<AurumArchiveRow[]> {
  const { data, error } = await visible(
    supabaseAdmin
      .from("aurum_posts")
      .select("slug, title, summary, published_at, type")
      .in("type", ["daily_note", "weekly_brief"]),
  )
    .order("published_at", { ascending: false })
    .order("id", { ascending: false });
  if (error) throw new Error(`Failed to load editorial archive: ${error.message}`);

  return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    slug: row["slug"] as string,
    title: row["title"] as string,
    summary: (row["summary"] as string | null) ?? "",
    publishedAt: toUtcDate(row["published_at"] as string),
    type: row["type"] as AurumArchiveRow["type"],
  }));
}

export async function loadEditorialBySlug(
  type: AurumEditorialType,
  slug: string,
): Promise<AurumEditorial | null> {
  const { data, error } = await visible(
    supabaseAdmin.from("aurum_posts").select(POST_COLUMNS).eq("type", type).eq("slug", slug),
  ).maybeSingle();
  if (error) throw new Error(`Failed to load editorial post: ${error.message}`);
  if (!data) return null;

  const [post] = await hydrate([data as Record<string, unknown>]);
  return post ?? null;
}
