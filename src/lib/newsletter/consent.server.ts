/**
 * MELT consent configuration — server-owned, and FAIL CLOSED (task T3 Phase 3).
 *
 * ────────────────────────────────────────────────────────────────────────────
 * NO APPROVED CONSENT WORDING EXISTS YET.
 * APPROVED_CONSENT is deliberately null. While it is null the signup server
 * function refuses every request with a generic "unavailable" and writes no
 * row, so no developer placeholder can ever become stored consent evidence.
 *
 * To enable signups, replace null with the client-approved wording and its
 * version. Both travel with every stored signup, so the version must be bumped
 * in the same edit whenever the text changes.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * There is no environment-variable fallback and no default on purpose: a
 * mistyped variable must not be able to switch persistence on with unapproved
 * text. The browser never supplies any part of this snapshot.
 */

export type NewsletterConsent = {
  /** Version recorded against the signup. 1–80 characters. */
  version: string;
  /** Exact wording shown to the subscriber, rebuilt here rather than trusted. 1–4000 characters. */
  text: string;
};

const APPROVED_CONSENT = null as NewsletterConsent | null;

/** Mirrors the database CHECK constraints, so an unusable snapshot is rejected before any write. */
export function isUsableConsent(consent: NewsletterConsent | null): consent is NewsletterConsent {
  if (!consent) return false;
  const version = consent.version.trim();
  const text = consent.text.trim();
  return (
    version.length >= 1 && version.length <= 80 && text.length >= 1 && text.length <= 4000
  );
}

/** The approved consent snapshot, or null while the wording is still awaited. */
export function approvedConsent(): NewsletterConsent | null {
  return isUsableConsent(APPROVED_CONSENT) ? APPROVED_CONSENT : null;
}
