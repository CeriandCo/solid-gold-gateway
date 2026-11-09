import { GoldButton } from "@/components/site-chrome";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState, type FormEvent } from "react";
import { subscribeToMelt, MELT_LISTS, MELT_SOURCE, type MeltConsentNotice } from "@/lib/newsletter.functions";

const BENEFITS = [
  { title: "Go beyond the headlines", body: "Explore the stories, context and ideas behind physical gold." },
  { title: "Keep building your knowledge", body: "Discover more detailed reads and fresh perspectives as you learn." },
  { title: "Be part of the conversation", body: "Join the AURUM community and explore gold with other curious minds." },
] as const;

export function AurumSubscribeSection({ consentNotice }: { consentNotice?: MeltConsentNotice }) {
  const subscribe = useServerFn(subscribeToMelt);
  const inFlight = useRef(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || !consentNotice) return;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    try {
      const result = await subscribe({ data: { email, lists: [...MELT_LISTS], source: MELT_SOURCE, consentVersion: consentNotice.version } });
      if (result.ok) setDone(true);
      else setError(result.code === "invalid_request" ? "Please enter a valid email address." : result.code === "rate_limited" ? "Too many attempts. Please try again later." : "Something went wrong. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  const privacySuffix = "Privacy Policy.";
  const linkedConsent = consentNotice?.text.endsWith(privacySuffix);
  return (
    <section id="subscribe" className="aurum-section aurum-subscribe" aria-labelledby="aurum-subscribe-title">
      <div className="site-container aurum-subscribe__invitation">
        <div>
          <p className="aurum-subscribe__eyebrow">KEEP YOUR CURIOSITY GROWING</p>
          <h2 id="aurum-subscribe-title" className="aurum-subscribe__title">
            The MELT Newsletter &amp; more
          </h2>
          <p className="aurum-subscribe__dek">
            A deeper understanding of gold starts with a little curiosity. Explore The MELT Newsletter,
            thoughtful insights and ongoing conversations in AURUM — a place to keep learning, one idea at a time.
          </p>
          {consentNotice ? (
            <div className="aurum-subscribe__optin">
              {done ? <p role="status" className="aurum-subscribe__success">You're in. Look out for The MELT in your inbox.</p> : (
                <form onSubmit={submit} aria-busy={busy}>
                  <div className="aurum-subscribe__email-row">
                    <label htmlFor="melt-email" className="sr-only">Email address</label>
                    <input id="melt-email" type="email" autoComplete="email" required placeholder="Your email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={busy} aria-describedby={error ? "melt-error melt-consent" : "melt-consent"} />
                    <GoldButton type="submit" variant="primary" size="hero" className="aurum-subscribe__join" disabled={busy} aria-busy={busy}>Join The MELT</GoldButton>
                  </div>
                  {error ? <p id="melt-error" role="alert" className="aurum-subscribe__status">{error}</p> : null}
                  <p id="melt-consent" className="aurum-subscribe__consent-text">
                    {linkedConsent ? <>{consentNotice.text.slice(0, -privacySuffix.length)}<Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link>.</> : consentNotice.text}
                  </p>
                </form>
              )}
            </div>
          ) : null}
          <a href="https://aurum-be0064.circle.so/" target="_blank" rel="noopener noreferrer" className="aurum-subscribe__community">Or join the AURUM community</a>
        </div>
        <div className="aurum-subscribe__more">
          <p className="aurum-subscribe__eyebrow">MORE TO DISCOVER</p>
          <ul className="aurum-subscribe__benefits">
            {BENEFITS.map(({ title, body }) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
