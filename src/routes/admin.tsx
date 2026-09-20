import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAdminMe, requestAdminSignInLink, type AdminMe } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  // Sessions live in the browser, so the admin area is client-rendered.
  ssr: false,
  head: () => ({
    meta: [
      { title: "AURUM admin" },
      { name: "description", content: "Internal AURUM editorial tools." },
      { property: "og:title", content: "AURUM admin" },
      { property: "og:description", content: "Internal AURUM editorial tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

type SessionState = "loading" | "signed-out" | "signed-in";

function AdminLayout() {
  const [session, setSession] = useState<SessionState>("loading");
  const [me, setMe] = useState<AdminMe | null>(null);
  const [revoked, setRevoked] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    let active = true;

    const resolve = async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user) {
        setMe(null);
        setSession("signed-out");
        return;
      }
      try {
        const profile = await getAdminMe();
        if (!active) return;
        if (!profile.role) {
          // Removed from the allowlist after signing in.
          await supabase.auth.signOut();
          setRevoked(true);
          setSession("signed-out");
          return;
        }
        setMe(profile);
        setSession("signed-in");
      } catch {
        if (!active) return;
        setSession("signed-out");
      }
    };

    void resolve();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void resolve();
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    setMe(null);
    setSession("signed-out");
    navigate({ to: "/admin", replace: true });
  };

  if (session === "loading") {
    return (
      <div className="admin-shell admin-shell--center">
        <p className="admin-muted">Loading…</p>
      </div>
    );
  }

  if (session === "signed-out" || !me) {
    return <SignInScreen revoked={revoked} />;
  }

  const isAdmin = me.role === "admin";

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar__brand">
          <span className="admin-wordmark">AURUM</span>
          <span className="admin-topbar__label">Editorial admin</span>
        </div>
        <nav className="admin-nav" aria-label="Admin">
          <Link to="/admin/posts" activeProps={{ className: "is-active" }}>
            Posts
          </Link>
          {isAdmin ? (
            <>
              <Link to="/admin/people" activeProps={{ className: "is-active" }}>
                People
              </Link>
              <Link to="/admin/settings" activeProps={{ className: "is-active" }}>
                Settings
              </Link>
            </>
          ) : null}
        </nav>
        <div className="admin-topbar__account">
          <span className="admin-muted">{me.email}</span>
          <button type="button" className="admin-button admin-button--ghost" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

function SignInScreen({ revoked }: { revoked: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [linkSending, setLinkSending] = useState(false);

  // Password sign-in. Every refusal comes back from the server as one generic
  // message; the browser never decides whether an account exists.
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    setMessage(null);
    try {
      const result = await adminSignInWithPassword({ data: { email, password } });
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      setPassword("");
      await supabase.auth.setSession({
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
      });
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Fallback for a forgotten password.
  const sendLink = async () => {
    setLinkSending(true);
    setMessage(null);
    try {
      const result = await requestAdminSignInLink({ data: { email } });
      setMessage(result.message);
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLinkSending(false);
    }
  };

  return (
    <div className="admin-shell admin-shell--center">
      <div className="admin-card admin-signin">
        <span className="admin-wordmark">AURUM</span>
        <h1 className="admin-heading">Editorial admin</h1>
        {revoked ? (
          <p className="admin-alert" role="status">
            You no longer have access.
          </p>
        ) : (
          <p className="admin-muted">Sign in with your email and password.</p>
        )}
        <form onSubmit={submit} className="admin-form">
          <label className="admin-label" htmlFor="admin-email">
            Email
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="admin-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label className="admin-label" htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="admin-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="submit"
            className="admin-button"
            disabled={sending || !email || !password}
          >
            {sending ? "Signing in…" : "Sign in"}
          </button>
          <button
            type="button"
            className="admin-button admin-button--ghost"
            onClick={sendLink}
            disabled={linkSending || !email}
          >
            {linkSending ? "Sending…" : "Forgotten password? Email me a sign-in link"}
          </button>
        </form>

        {message ? (
          <p className="admin-note" role="status">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
