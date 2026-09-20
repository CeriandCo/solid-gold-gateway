import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdminPostForEdit, type AdminPostEditable } from "@/lib/admin.functions";
import { AdminPostForm } from "@/components/admin-post-form";

export const Route = createFileRoute("/admin/posts/$postId")({
  // No route guard here: the /admin layout gates rendering; server functions enforce access.

  head: () => ({
    meta: [
      { title: "Post | AURUM admin" },
      { name: "description", content: "Edit an AURUM editorial draft." },
      { property: "og:title", content: "Post | AURUM admin" },
      { property: "og:description", content: "Edit an AURUM editorial draft." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PostDetailPage,
});

function PostDetailPage() {
  const { postId } = Route.useParams();
  const [post, setPost] = useState<AdminPostEditable | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAdminPostForEdit({ data: { id: postId } })
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

  return <AdminPostForm key={post.id} post={post} />;
}
