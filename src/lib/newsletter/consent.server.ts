/**
 * MELT consent configuration — the single authoritative production definition
 * (tasks T3 Phase 3 and Phase 5).
 *
 * ════════════════════════════════════════════════════════════════════════════
 * PRODUCTION SIGNUP IS DISABLED.
 *
 * APPROVED_CONSENT is null because the client has not supplied approved MELT
 * consent wording. While it is null:
 *   • the form shows no consent wording at all;
 *   • every signup is refused with a generic "unavailable";
 *   • no row is written to newsletter_signups.
 *
 * TO ACTIVATE SIGNUP (the entire procedure):
 *   1. replace `null` below with the approved wording and its version, e.g.
 *        const APPROVED_CONSENT: NewsletterConsent | null = {
 *          version: "melt-2026-10-01",
 *          text: "…exact approved wording…",
 *        };
 *   2. run `bunx vitest run src/lib/newsletter` — the consent tests must pass;
 *   3. check /aurum#subscribe in a browser: the wording appears and a signup
 *      stores that exact text;
 *   4. deploy.
 *
 * TO ROLL BACK URGENTLY: set it to null again. The wording disappears, signup
 * fails closed, and every stored consent record is left untouched.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * This wording is version-controlled product copy, not a secret, so it lives
 * here in source control where a reviewer can see the exact text, the exact
 * version and the fact that signup is being switched on. It is deliberately NOT
 * an environment variable: that would make activation invisible in review and
 * untestable. It is also the ONLY production definition — the component renders
 * a projection of this text and the server stores this same text, so the two
 * can never drift.
 *
 * VERSIONING CONVENTION: `melt-YYYY-MM-DD`, the date the wording was approved.
 * Bump it for any material change to what a visitor is agreeing to — different
 * wording, a different purpose, a different communication scope, or a different
 * privacy meaning. A pure code refactor that leaves the text identical does not
 * change the version. The version travels with every stored signup, so an old
 * record keeps the version it accepted even after this file changes.
 */

export type NewsletterConsent = {
  /** Human-readable version, `melt-YYYY-MM-DD`. 1–80 characters, trimmed. */
  version: string;
  /** Exact wording shown to the visitor and stored against the signup. 1–4000 characters, trimmed. */
  text: string;
};

export const CONSENT_VERSION_MAX = 80;
export const CONSENT_TEXT_MAX = 4000;

/** Control characters other than newline and tab: never legitimate in approved copy. */
const FORBIDDEN_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

const APPROVED_CONSENT = null as NewsletterConsent | null;

/**
 * Mirrors the database CHECK constraints and refuses anything malformed. A
 * broken definition makes signup unavailable; it is never quietly repaired,
 * because silently trimming or rewriting approved copy would store something
 * other than what was approved and shown.
 */
export function isUsableConsent(consent: NewsletterConsent | null | undefined): consent is NewsletterConsent {
  if (!consent) return false;
  const { version, text } = consent;
  if (typeof version !== "string" || typeof text !== "string") return false;

  // Already-trimmed values only: no silent repair.
  if (version !== version.trim() || text !== text.trim()) return false;
  if (version.length < 1 || version.length > CONSENT_VERSION_MAX) return false;
  if (text.length < 1 || text.length > CONSENT_TEXT_MAX) return false;
  if (FORBIDDEN_CHARACTERS.test(version) || FORBIDDEN_CHARACTERS.test(text)) return false;
  // A version identifier is a single line.
  if (/[\n\r\t]/.test(version)) return false;

  return true;
}

/** The approved consent snapshot, or null while the wording is still awaited. */
export function approvedConsent(): NewsletterConsent | null {
  return isUsableConsent(APPROVED_CONSENT) ? APPROVED_CONSENT : null;
}

/**
 * The public projection: the wording a visitor sees, and nothing else. The
 * version is internal mechanics and is not sent to the browser — the server
 * decides what version to store. Returns null while signup is disabled, which
 * is what removes the consent block from the page.
 */
export function publicConsentNotice(): { text: string } | null {
  const consent = approvedConsent();
  return consent ? { text: consent.text } : null;
}
