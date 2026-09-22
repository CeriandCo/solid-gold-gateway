import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdminMe, getCmsSettings, setAllowSelfApproval } from "@/lib/admin.functions";
import {
  getStripeCatalogStatus,
  runStripeCatalogSync,
  type CatalogStatus,
  type CatalogSyncResult,
} from "@/lib/commerce-admin.functions";
import { AdminNoAccess } from "@/components/admin-no-access";


export const Route = createFileRoute("/admin/settings")({
  // No route guard here: the /admin layout gates rendering and the component checks the
  // admin role in place. Server functions and RLS remain the real boundary.

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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const me = await getAdminMe();
        if (!active) return;
        if (me.role !== "admin") {
          setIsAdmin(false);
          return;
        }
        setIsAdmin(true);
        const settings = await getCmsSettings();
        if (!active) return;
        setAllow(settings.allowSelfApproval);
      } catch (cause) {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "Could not load settings.");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (isAdmin === false) return <AdminNoAccess />;


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
    <>
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
            <p className="admin-note">
              Checked every time someone publishes or schedules a post.
            </p>
          </div>
        )}
      </section>

      <StripeCatalogCard />
    </>
  );
}

const MODE_LABEL: Record<string, string> = {
  test: "Sandbox",
  live: "Live",
  unset: "Not configured",
};

function StripeCatalogCard() {
  const [status, setStatus] = useState<CatalogStatus | null>(null);
  const [result, setResult] = useState<CatalogSyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      setStatus(await getStripeCatalogStatus());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not read the catalog.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const verify = async () => {
    setBusy(true);
    setError(null);
    try {
      const outcome = await runStripeCatalogSync();
      setResult(outcome);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The check could not be run.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="admin-card" style={{ marginTop: "1.5rem" }}>
      <div className="admin-card__header">
        <h2 className="admin-heading">Stripe</h2>
        <span
          className={`admin-badge${status?.mode === "live" ? " admin-badge--published" : status?.mode === "test" ? " admin-badge--scheduled" : ""}`}
        >
          {MODE_LABEL[status?.mode ?? "unset"]}
        </span>
      </div>

      {error ? (
        <p className="admin-alert" role="alert">
          {error}
        </p>
      ) : null}

      {status === null ? (
        <p className="admin-muted">Loading…</p>
      ) : (
        <dl className="admin-setting">
          <div className="admin-setting__row">
            <dt className="admin-muted" style={{ margin: 0, minWidth: "9rem" }}>
              Currency
            </dt>
            <dd style={{ margin: 0 }}>{status.currency?.toUpperCase() ?? "Not set"}</dd>
          </div>
          <div className="admin-setting__row">
            <dt className="admin-muted" style={{ margin: 0, minWidth: "9rem" }}>
              Gift card prices
            </dt>
            <dd style={{ margin: 0 }}>
              {status.mapped} of {status.expected} linked
              {status.ready ? " — ready" : " — not ready"}
            </dd>
          </div>
          <div className="admin-setting__row">
            <dt className="admin-muted" style={{ margin: 0, minWidth: "9rem" }}>
              Product
            </dt>
            <dd style={{ margin: 0 }}>{result?.productId ?? status.productId ?? "—"}</dd>
          </div>
          <div className="admin-setting__row">
            <dt className="admin-muted" style={{ margin: 0, minWidth: "9rem" }}>
              Last check
            </dt>
            <dd style={{ margin: 0 }}>
              {status.lastSync
                ? `${new Date(status.lastSync.at).toLocaleString()} — ${status.lastSync.message}`
                : "Never"}
            </dd>
          </div>
        </dl>
      )}

      {result && !result.ok && result.problems.length > 0 ? (
        <ul className="admin-muted" style={{ margin: "0 0 0.75rem", paddingLeft: "1.1rem" }}>
          {result.problems.map((problem, index) => (
            <li key={`${problem.code}-${index}`}>
              {problem.code}
              {problem.lookupKey ? ` — ${problem.lookupKey}` : ""}
              {problem.detail ? ` (${problem.detail})` : ""}
            </li>
          ))}
        </ul>
      ) : null}

      <button type="button" className="admin-button" onClick={() => void verify()} disabled={busy}>
        {busy ? "Checking…" : "Verify catalog"}
      </button>
      <p className="admin-note">
        Buying stays switched off until every amount is linked to a checked Stripe price. No keys
        are shown here.
      </p>
    </section>
  );
}

