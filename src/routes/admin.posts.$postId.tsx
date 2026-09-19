import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getAdminMe,
  getAdminPost,
  type AdminPostDetail,
} from "@/lib/admin.functions";
import { formatShortDate } from "@/lib/aurum-editorial";

export const Route = createFileRoute("/admin/posts/$postId")({
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
      { title: "Post | AURUM admin" },
      { name: "description", content: "A read-only look at an AURUM editorial post." },
      { property: "og:title", content: "Post | AURUM admin" },
      { property: "og:description", content: "A read-only look at an AURUM editorial post." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PostDetailPage,
});

const STATUS_LABELS: Record<string, string> = {
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

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return formatShortDate(new Date(iso).toISOString().slice(0, 10));
}

function PostDetailPage() {
  const { postId } = Route.useParams();
  const [post, setPost] = useState<AdminPostDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAdminPost({ data: { id: postId } })
      .then((data) => {
        if (!active) return;
        if (!data) setError("That post could not be found.");
        else setPost(data);
      })
      .catch((cause) => {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "Could not load the post.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [postId]);

  if (loading) {
    return (
      <section className="admin-card">
        <p className="admin-muted">Loading…</p>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="admin-card">
        <p className="admin-alert" role="alert">
          {error ?? "That post could not be found."}
        </p>
        <p>
          <Link to="/admin/posts">Back to all posts</Link>
        </p>
      </section>
    );
  }

  return (
    <section className="admin-card">
      <p className="admin-muted">
        <Link to="/admin/posts">← All posts</Link>
      </p>
      <h1 className="admin-heading">{post.title}</h1>
      <p className="admin-note" role="note">
        Editing arrives in the next step. This is a read-only summary.
      </p>

      <dl className="admin-detail">
        <div className="admin-detail__row">
          <dt>Type</dt>
          <dd>{TYPE_LABELS[post.type] ?? post.type}</dd>
        </div>
        <div className="admin-detail__row">
          <dt>Status</dt>
          <dd>
            <span className={`admin-badge admin-badge--${post.status.replace("_", "-")}`}>
              {STATUS_LABELS[post.status] ?? post.status}
            </span>
          </dd>
        </div>
        <div className="admin-detail__row">
          <dt>Publication date</dt>
          <dd>{formatDate(post.publishedAt)}</dd>
        </div>
        <div className="admin-detail__row">
          <dt>Summary</dt>
          <dd>{post.summary}</dd>
        </div>
      </dl>

      <h2 className="admin-subheading">Sources ({post.sources.length})</h2>
      {post.sources.length === 0 ? (
        <p className="admin-muted">No sources attached.</p>
      ) : (
        <ul className="admin-source-list">
          {post.sources.map((source) => (
            <li key={`${source.url}-${source.title}`}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title}
              </a>{" "}
              <span className="admin-muted">
                — {source.publisher}, {formatShortDate(source.date)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
