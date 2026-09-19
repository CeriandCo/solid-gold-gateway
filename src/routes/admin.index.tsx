import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
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
  component: () => (
    <section className="admin-card">
      <h1 className="admin-heading">Posts</h1>
      <p className="admin-muted">Coming in the next step.</p>
    </section>
  ),
});
