import { createFileRoute } from "@tanstack/react-router";
import { AdminPostForm } from "@/components/admin-post-form";

export const Route = createFileRoute("/admin/posts/new")({
  // No route guard here: the /admin layout gates rendering; server functions enforce access.

  head: () => ({
    meta: [
      { title: "New post | AURUM admin" },
      { name: "description", content: "Write a new AURUM draft." },
      { property: "og:title", content: "New post | AURUM admin" },
      { property: "og:description", content: "Write a new AURUM draft." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <AdminPostForm post={null} />,
});
