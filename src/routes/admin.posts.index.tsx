import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getAdminMe,
  listAdminPosts,
  type AdminPostRow,
  type AdminPostsPage,
  type AdminPostStatus,
  type AdminPostTypeFilter,
  type AdminStatusTab,
} from "@/lib/admin.functions";
import { formatShortDate } from "@/lib/aurum-editorial";

export const Route = createFileRoute("/admin/posts/")({
  // UI guard only; the server functions and RLS are the real boundary.
  beforeLoad: async () => {
    try {
      const me = await getAdminMe();
      if (!me.role) throw redirect({ to: "/admin" });
    } catch (error) {
      if (error && typeof error === "object" && "to" in error) throw error;
      throw redirect({ to: "/admin" });
    }
  },
  head: () => ({
    meta: [
      { title: "Posts | AURUM admin" },
      { name: "description", content: "AURUM editorial posts." },
      { property: "og:title", content: "Posts | AURUM admin" },
      { property: "og:description", content: "AURUM editorial posts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PostsPage,
});

const STATUS_TABS: { key: AdminStatusTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "in_review", label: "In review" },
  { key: "scheduled", label: "Scheduled" },
  { key: "published", label: "Published" },
  { key: "archived", label: "Archived" },
];

const TYPE_FILTERS: { key: AdminPostTypeFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "daily_note", label: "Daily Note" },
  { key: "weekly_brief", label: "Weekly Brief" },
];

const STATUS_LABELS: Record<AdminPostStatus, string> = {
  draft: "Draft",
  in_review: "In review",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

const TYPE_LABELS: Record<string, string> = {
  daily_note: "Daily Note",
  weekly_brief: "Weekly Brief",
  article: "Article",
};

/** "2026-09-10" date part of any ISO timestamp, in UTC. */
function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return formatShortDate(new Date(iso).toISOString().slice(0, 10));
}

/** "10 Sep 2026, 14:32 UTC". */
function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const day = formatShortDate(date.toISOString().slice(0, 10));
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${day}, ${hh}:${mm} UTC`;
}

function StatusBadge({ status }: { status: AdminPostStatus }) {
  return (
    <span className={`admin-badge admin-badge--${status.replace("_", "-")}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function PostsPage() {
  const [type, setType] = useState<AdminPostTypeFilter>("all");
  const [status, setStatus] = useState<AdminStatusTab>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<AdminPostsPage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Debounce the search box so typing does not fire a query per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listAdminPosts({ data: { type, status, search, page } })
      .then((data) => {
        if (!active) return;
        setResult(data);
        setError(null);
      })
      .catch((cause) => {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "Could not load the posts.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [type, status, search, page]);

  const totalPages = result ? Math.max(Math.ceil(result.total / result.pageSize), 1) : 1;

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div>
          <h1 className="admin-heading">Posts</h1>
          <p className="admin-muted">
            Every Daily Note and Weekly Brief, including drafts. Read-only for now.
          </p>
        </div>
        <button
          type="button"
          className="admin-button"
          disabled
          title="Creating posts arrives in the next step."
        >
          New post
        </button>
      </div>

      {error ? (
        <p className="admin-alert" role="alert">
          {error}
        </p>
      ) : null}

      <div className="admin-tabs" role="group" aria-label="Filter by status">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className="admin-tab"
            aria-pressed={status === tab.key}
            onClick={() => {
              setStatus(tab.key);
              setPage(1);
            }}
          >
            {tab.label}
            {result ? <span className="admin-tab__count">{result.counts[tab.key]}</span> : null}
          </button>
        ))}
      </div>

      <div className="admin-filters">
        <div className="admin-tabs admin-tabs--small" role="group" aria-label="Filter by type">
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className="admin-tab"
              aria-pressed={type === filter.key}
              onClick={() => {
                setType(filter.key);
                setPage(1);
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="admin-filters__search">
          <label className="admin-visually-hidden" htmlFor="post-search">
            Search by title
          </label>
          <input
            id="post-search"
            type="search"
            className="admin-input"
            placeholder="Search by title"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
      </div>

      {loading && !result ? (
        <p className="admin-muted">Loading…</p>
      ) : result && result.rows.length === 0 ? (
        <p className="admin-muted">No posts match these filters.</p>
      ) : result ? (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Type</th>
                <th scope="col">Status</th>
                <th scope="col">Publication date</th>
                <th scope="col">Sources</th>
                <th scope="col">Last updated</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row: AdminPostRow) => (
                <tr key={row.id}>
                  <td>
                    <Link to="/admin/posts/$postId" params={{ postId: row.id }}>
                      {row.title}
                    </Link>
                  </td>
                  <td>{TYPE_LABELS[row.type] ?? row.type}</td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                  <td>{formatDate(row.publishedAt)}</td>
                  <td>{row.sourceCount}</td>
                  <td>{formatTimestamp(row.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="admin-pagination">
            <button
              type="button"
              className="admin-button admin-button--ghost"
              disabled={page <= 1 || loading}
              onClick={() => setPage((value) => Math.max(value - 1, 1))}
            >
              Previous
            </button>
            <span className="admin-muted">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="admin-button admin-button--ghost"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}
