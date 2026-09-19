import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdminMe, getCmsSettings, setAllowSelfApproval } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/settings")({
  // UI guard only; the server functions and RLS are the real boundary.
  beforeLoad: async () => {
    try {
      const me = await getAdminMe();
      if (me.role !== "admin") throw redirect({ to: "/admin" });
    } catch (error) {
      if (error && typeof error === "object" && "to" in error) throw error;
      throw redirect({ to: "/admin" });
    }
  },
  head: () => ({
    meta: [
      { title: "Settings | AURUM admin" },
      { name: "description", content: "AURUM editorial workflow settings." },
      { property: "og:title", content: "Settings | AURUM admin" },
      { property: "og:description", content: "AURUM editorial workflow settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [allow, setAllow] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const settings = await getCmsSettings();
        setAllow(settings.allowSelfApproval);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not load settings.");
      }
    })();
  }, []);

  const toggle = async (next: boolean) => {
    setBusy(true);
    setError(null);
    const previous = allow;
    setAllow(next);
    try {
      await setAllowSelfApproval({ data: { allowSelfApproval: next } });
    } catch (cause) {
      setAllow(previous);
      setError(cause instanceof Error ? cause.message : "That change was refused.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="admin-card">
      <h1 className="admin-heading">Settings</h1>
      {error ? (
        <p className="admin-alert" role="alert">
          {error}
        </p>
      ) : null}
      {allow === null ? (
        <p className="admin-muted">Loading…</p>
      ) : (
        <div className="admin-setting">
          <label className="admin-setting__row">
            <input
              type="checkbox"
              checked={allow}
              disabled={busy}
              onChange={(event) => void toggle(event.target.checked)}
            />
            <span>Allow a person to publish their own post</span>
          </label>
          <p className="admin-muted">
            Turning this off means a second person has to publish what someone wrote.
          </p>
          <p className="admin-note">Takes effect when publishing arrives in the next step.</p>
        </div>
      )}
    </section>
  );
}
