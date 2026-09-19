import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAdminMe } from "@/lib/admin.functions";
import { AdminPostForm } from "@/components/admin-post-form";

export const Route = createFileRoute("/admin/posts/new")({
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
