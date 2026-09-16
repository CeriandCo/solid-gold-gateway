import { useId, useState, type FormEvent } from "react";
import { GoldButton } from "@/components/site-chrome";

/**
 * Consent copy is PENDING COMPLIANCE APPROVAL. Do not rewrite this text or bump the
 * version without approved wording — the version travels with every stored signup.
 */
const CONSENT_VERSION = "pending-2026-09-16";
const CONSENT_TEXT =
  "Customer.io stores the consent text shown, its version, the timestamp and the attribution source with every signup. Final copy must come from compliance.";

const LISTS = [
  { id: "daily-note", title: "Daily Note", description: "A short sourced note each trading day." },
  { id: "weekly-brief", title: "Weekly Brief", description: "One longer read each Monday." },
] as const;

const BENEFITS = [
  { title: "Every fact sourced", body: "Each material claim links to where it was published." },
  { title: "No forecasts", body: "We describe what happened. We never say what happens next." },
  { title: "Human reviewed", body: "Drafts are AI-assisted but a person approves before sending." },
  { title: "One click out", body: "Every email carries an unsubscribe link. No dark patterns." },
] as const;

type ListId = (typeof LISTS)[number]["id"];
type Status = "idle" | "submitting" | "success" | "error";

function attributionSource() {
  if (typeof window === "undefined") return { page: "/aurum#subscribe", campaign: {} as Record<string, string> };
  const params = new URLSearchParams(window.location.search);
  const campaign: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key.startsWith("utm_") || key === "gclid" || key === "ref") campaign[key] = value;
  });
  return {
    page: `${window.location.pathname}#subscribe`,
    referrer: document.referrer || null,
    campaign,
  };
}

export function AurumSubscribeSection() {
  const statusId = useId();
  const [selected, setSelected] = useState<ListId[]>(["daily-note", "weekly-brief"]);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const noListSelected = selected.length === 0;
  const canSubmit = !noListSelected && status !== "submitting";

  const toggle = (id: ListId) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const chosenLabels = LISTS.filter(({ id }) => selected.includes(id)).map(({ title }) => title);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");

    const payload = {
      subscriber: { email, lists: selected },
      consent: { text: CONSENT_TEXT, version: CONSENT_VERSION, status: "pending-approval" },
      consentedAt: new Date().toISOString(),
      attribution: attributionSource(),
    };

    try {
      // Customer.io is not wired yet — the shape below is what will be forwarded.
      console.info("[the-melt] subscribe", payload);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const statusMessage =
    status === "submitting"
      ? "Sending your preferences."
      : status === "error"
        ? "We could not save that just now. Your email is still here — press Subscribe again in a moment."
        : status === "success"
          ? `You are signed up for ${chosenLabels.join(" and ")}.`
          : noListSelected
            ? "Choose at least one list to subscribe."
            : "";

  return (
    <section id="subscribe" className="aurum-section aurum-subscribe" aria-labelledby="aurum-subscribe-title">
      <div className="aurum-container">
        <p className="aurum-subscribe__eyebrow">THE MELT</p>
        <h2 id="aurum-subscribe-title" className="aurum-subscribe__title">
          Gold, explained on a schedule
        </h2>
        <p className="aurum-subscribe__dek">
          Choose the Daily Note, the Weekly Brief, or both. Sourced, plain and free — no forecasts, no calls, no sales.
        </p>

        <div className="aurum-subscribe__grid">
          <div className="aurum-subscribe__panel">
            {status === "success" ? (
              <div className="aurum-subscribe__done">
                <h3>You are on the list.</h3>
                <p>
                  We will send {chosenLabels.join(" and ")} to {email}. Every email carries an unsubscribe link.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate={false}>
                <fieldset className="aurum-subscribe__fieldset">
                  <legend className="aurum-subscribe__label">WHAT WOULD YOU LIKE TO RECEIVE</legend>
                  <div className="aurum-subscribe__choices">
                    {LISTS.map(({ id, title, description }) => (
                      <label key={id} className="aurum-subscribe__choice">
                        <input
                          type="checkbox"
                          checked={selected.includes(id)}
                          onChange={() => toggle(id)}
                          aria-describedby={statusId}
                        />
                        <span>
                          <span className="aurum-subscribe__choice-title">{title}</span>
                          <span className="aurum-subscribe__choice-body">{description}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="aurum-subscribe__field">
                  <label htmlFor="aurum-melt-email" className="aurum-subscribe__label">
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="aurum-melt-email"
                    type="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="your@email.com"
                    aria-describedby={statusId}
                    className="h-[54px] w-full rounded-[2px] border border-beige bg-warm-white px-5 text-sm text-charcoal outline-none transition-shadow placeholder:text-[#8A938D] focus:border-gold focus:ring-2 focus:ring-gold/60"
                  />
                </div>

                <GoldButton
                  type="submit"
                  variant="primary"
                  size="hero"
                  icon="none"
                  disabled={!canSubmit}
                  className="aurum-subscribe__submit"
                >
                  {status === "submitting" ? "Subscribing…" : "Subscribe"}
                </GoldButton>

                <p id={statusId} role="status" aria-live="polite" className="aurum-subscribe__status">
                  {statusMessage}
                </p>

                <div className="aurum-subscribe__consent">
                  <p className="aurum-subscribe__consent-label">CONSENT — WORDING PENDING APPROVAL</p>
                  <p className="aurum-subscribe__consent-text">{CONSENT_TEXT}</p>
                </div>
              </form>
            )}
          </div>

          <aside className="aurum-subscribe__card">
            <p className="aurum-subscribe__card-eyebrow">WHAT YOU GET</p>
            <ul className="aurum-subscribe__benefits">
              {BENEFITS.map(({ title, body }) => (
                <li key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </li>
              ))}
            </ul>
            <div className="aurum-subscribe__card-foot">
              <p className="aurum-subscribe__card-free">Free, and always free. Nothing is sold in these emails.</p>
              <p className="aurum-subscribe__card-caution">
                Source allowlist and licensing are still being confirmed.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
