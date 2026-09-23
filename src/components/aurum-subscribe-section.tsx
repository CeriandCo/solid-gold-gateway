import { useId, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";

import { GoldButton } from "@/components/site-chrome";
import { subscribeToMelt } from "@/lib/newsletter.functions";
import {
  MELT_MESSAGES,
  buildSignupRequest,
  outcomeFor,
  type MeltOutcome,
} from "@/lib/newsletter/form-state";

/**
 * No consent wording is shown here. The approved copy has not arrived, and the
 * consent snapshot recorded against a signup is built on the server
 * (src/lib/newsletter/consent.server.ts), never in the browser. Until that copy
 * exists the server refuses every signup, so this form truthfully reports that
 * sign-up is not available yet. When the wording arrives, it is added to the
 * server module and displayed here in the same change.
 */

const LISTS = [
  { id: "daily-note", key: "dailyNote", title: "Daily Note", description: "Short sourced notes, published as they are written." },
  { id: "weekly-brief", key: "weeklyBrief", title: "Weekly Brief", description: "One longer read each Monday." },
] as const;

const BENEFITS = [
  { title: "Every fact sourced", body: "Each material claim links to where it was published." },
  { title: "No forecasts", body: "We describe what happened. We never say what happens next." },
  { title: "Human reviewed", body: "Drafts are AI-assisted but a person approves before sending." },
  { title: "One click out", body: "Every email carries an unsubscribe link. No dark patterns." },
] as const;

type ListId = (typeof LISTS)[number]["id"];

export function AurumSubscribeSection() {
  const statusId = useId();
  const subscribe = useServerFn(subscribeToMelt);
  const inFlight = useRef(false);

  const [selected, setSelected] = useState<ListId[]>([]);
  const [attempted, setAttempted] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<MeltOutcome | null>(null);

  const noListSelected = selected.length === 0;
  const canSubmit = !submitting;
  const succeeded = outcome === "success";

  const toggle = (id: ListId) =>
    setSelected((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      if (next.length > 0) setAttempted(false);
      return next;
    });

  const chosenLabels = LISTS.filter(({ id }) => selected.includes(id)).map(({ title }) => title);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Ref as well as state: a second click in the same tick cannot get through.
    if (!canSubmit || inFlight.current) return;
    if (noListSelected) {
      setAttempted(true);
      return;
    }

    inFlight.current = true;
    setAttempted(false);
    setOutcome(null);
    setSubmitting(true);

    try {
      const result = await subscribe({ data: buildSignupRequest(email, selected) });
      setOutcome(outcomeFor(result));
    } catch {
      // Never surface an exception to the visitor; the server already refuses
      // to describe its own internals.
      setOutcome("unavailable");
    } finally {
      setSubmitting(false);
      inFlight.current = false;
    }
  };

  const statusMessage = submitting
    ? "Sending your preferences."
    : outcome
      ? MELT_MESSAGES[outcome]
      : "";

  return (
    <section id="subscribe" className="aurum-section aurum-subscribe" aria-labelledby="aurum-subscribe-title">
      <div className="site-container">
        <p className="aurum-subscribe__eyebrow">STAY IN TOUCH</p>
        <h2 id="aurum-subscribe-title" className="aurum-subscribe__title">
          Gold, explained on a schedule
        </h2>
        <p className="aurum-subscribe__dek">
          Pick what you want. Each one is separate, and you can take just one. Sourced, plain and free — no forecasts,
          no calls, no sales.
        </p>

        <div className="aurum-subscribe__grid">
          <div className="aurum-subscribe__panel">
            {succeeded ? (
              // Truthful for both a first and a repeat signup, and identical
              // either way: it says what we did, not that any provider has the
              // address or that it has been confirmed.
              <div className="aurum-subscribe__done">
                <h3>{MELT_MESSAGES.success}</h3>
                <p>We have your preferences for {chosenLabels.join(" and ")}.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate={false}>
                <fieldset className="aurum-subscribe__fieldset">
                  <legend className="aurum-subscribe__label">WHAT WOULD YOU LIKE TO RECEIVE</legend>
                  <div className="aurum-subscribe__choices">
                    {LISTS.map(({ id, key, title, description }) => (
                      <label key={id} className="aurum-subscribe__choice" htmlFor={`aurum-subscribe-${id}`}>
                        <input
                          id={`aurum-subscribe-${id}`}
                          name={key}
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
                  <p aria-live="polite" className="aurum-subscribe__status">
                    {attempted && noListSelected ? "Choose at least one thing to receive." : ""}
                  </p>
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
                  onClick={() => {
                    if (noListSelected) setAttempted(true);
                  }}
                  className="aurum-subscribe__submit"
                >
                  {status === "submitting" ? "Subscribing…" : "Subscribe"}
                </GoldButton>

                <p id={statusId} role="status" aria-live="polite" className="aurum-subscribe__status">
                  {statusMessage}
                </p>

                <div className="aurum-subscribe__consent">
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
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
