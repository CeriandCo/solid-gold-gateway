import { Link } from "@tanstack/react-router";

/** Shown in place of an admin-only page when the signed-in person is not an admin. */
export function AdminNoAccess() {
  return (
    <section className="admin-card">
      <h1 className="admin-heading">You do not have access</h1>
      <p className="admin-muted">
        This page is for admins only. Ask an admin if you need it.
      </p>
      <p>
        <Link to="/admin/posts">Back to all posts</Link>
      </p>
    </section>
  );
}
