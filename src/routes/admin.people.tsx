import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  addEditor,
  getAdminMe,
  listEditors,
  removeEditor,
  setEditorPassword,
  setEditorRole,
  type AdminRole,
  type EditorRow,
} from "@/lib/admin.functions";
import { AdminNoAccess } from "@/components/admin-no-access";

export const Route = createFileRoute("/admin/people")({
  // No route guard here: the /admin layout gates rendering and the component checks the
  // admin role in place. Server functions and RLS remain the real boundary.

  head: () => ({
    meta: [
      { title: "People | AURUM admin" },
      { name: "description", content: "Who can sign in to the AURUM admin." },
      { property: "og:title", content: "People | AURUM admin" },
      { property: "og:description", content: "Who can sign in to the AURUM admin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PeoplePage,
});

const ROLES: AdminRole[] = ["admin", "reviewer", "editor"];

function PeoplePage() {
  const [rows, setRows] = useState<EditorRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    try {
      setRows(await listEditors());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load the list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const me = await getAdminMe();
        if (!active) return;
        if (me.role !== "admin") {
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        setIsAdmin(true);
        await reload();
      } catch {
        if (!active) return;
        setIsAdmin(false);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (isAdmin === false) return <AdminNoAccess />;


  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      await reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That change was refused.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="admin-card">
      <h1 className="admin-heading">People</h1>
      <p className="admin-muted">
        Only these emails can sign in. Admins manage everything, reviewers can publish,
        editors write drafts.
      </p>

      {error ? (
        <p className="admin-alert" role="alert">
          {error}
        </p>
      ) : null}

      <form
        className="admin-row-form"
        onSubmit={(event) => {
          event.preventDefault();
          void run(async () => {
            await addEditor({ data: { email, role } });
            setEmail("");
            setRole("editor");
          });
        }}
      >
        <label className="admin-label" htmlFor="new-editor-email">
          Add someone
        </label>
        <div className="admin-row-form__controls">
          <input
            id="new-editor-email"
            type="email"
            required
            placeholder="name@example.com"
            className="admin-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <select
            className="admin-input admin-input--select"
            aria-label="Role for the new person"
            value={role}
            onChange={(event) => setRole(event.target.value as AdminRole)}
          >
            {ROLES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <button type="submit" className="admin-button" disabled={busy || !email}>
            Add
          </button>
        </div>
      </form>

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Signed in</th>
              <th scope="col">Password</th>
              <th scope="col">
                <span className="admin-visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.email}</td>
                <td>
                  <select
                    className="admin-input admin-input--select"
                    aria-label={`Role for ${row.email}`}
                    value={row.role}
                    disabled={busy}
                    onChange={(event) =>
                      void run(() =>
                        setEditorRole({
                          data: { id: row.id, role: event.target.value as AdminRole },
                        }),
                      )
                    }
                  >
                    {ROLES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{row.signedIn ? "Yes" : "Not yet"}</td>
                <td>
                  <PasswordCell email={row.email} disabled={busy} />
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-button admin-button--ghost"
                    disabled={busy}
                    onClick={() => void run(() => removeEditor({ data: { id: row.id } }))}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

/**
 * Sets or resets an allowlisted account's password. The value is typed here by an
 * admin, sent once to the server and handed straight to auth; it is never stored
 * in this page's state after saving, logged, or written anywhere else.
 */
function PasswordCell({ email, disabled }: { email: string; disabled: boolean }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const inputId = `set-password-${email.replace(/[^a-z0-9]/gi, "-")}`;

  return (
    <form
      className="admin-row-form__controls"
      onSubmit={(event) => {
        event.preventDefault();
        setSaving(true);
        setStatus(null);
        void setEditorPassword({ data: { email, password: value } })
          .then((result) => {
            setValue("");
            setStatus(result.created ? "Account created." : "Password updated.");
          })
          .catch((cause: unknown) => {
            setStatus(cause instanceof Error ? cause.message : "Could not set that password.");
          })
          .finally(() => setSaving(false));
      }}
    >
      <label className="admin-visually-hidden" htmlFor={inputId}>
        New password for {email}
      </label>
      <input
        id={inputId}
        type="password"
        className="admin-input"
        autoComplete="new-password"
        minLength={12}
        placeholder="At least 12 characters"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        type="submit"
        className="admin-button admin-button--ghost"
        disabled={disabled || saving || value.length < 12}
      >
        {saving ? "Saving…" : "Set"}
      </button>
      {status ? (
        <span className="admin-note" role="status">
          {status}
        </span>
      ) : null}
    </form>
  );
}
