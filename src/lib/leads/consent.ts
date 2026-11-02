/**
 * Waitlist consent wording — the single definition shown under every waitlist
 * and early-access form and stored with each signup. The final words "Privacy
 * Policy" are rendered as a link to /privacy; the stored text is this exact
 * plain sentence.
 *
 * Bump the version (`waitlist-YYYY-MM-DD`) whenever the wording or its meaning
 * changes; every stored signup keeps the version it accepted.
 */
export const WAITLIST_CONSENT = {
  version: "waitlist-2026-11-02",
  lead: "By joining, you agree to receive emails from TRUNK about our launch and updates. You can unsubscribe anytime. See our",
  linkText: "Privacy Policy",
  text: "By joining, you agree to receive emails from TRUNK about our launch and updates. You can unsubscribe anytime. See our Privacy Policy.",
} as const;

export const WAITLIST_SOURCES = ["home_final_cta", "waitlist_cta", "early_access"] as const;
export type WaitlistSource = (typeof WAITLIST_SOURCES)[number];

export type LeadResult = { ok: true } | { ok: false; code: "invalid_request" | "rate_limited" | "unavailable" };
