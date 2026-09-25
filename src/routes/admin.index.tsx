import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  beforeLoad: ({ location }) => {
    console.log("DBG", typeof window, JSON.stringify(location));
    // Keep the query and fragment: a sign-in link lands here with its one-time token
    // after `#`, and it must survive the forward so the sign-in client can read it.
    throw redirect({
      to: "/admin/posts",
      search: location.search as never,
      hash: location.hash,
      replace: true,
    });
  },
});
