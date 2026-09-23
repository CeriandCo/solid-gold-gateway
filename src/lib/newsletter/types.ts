/** MELT content preferences. Our own content choices — never provider list identifiers. */
export const MELT_LISTS = ["daily-note", "weekly-brief"] as const;
export type MeltList = (typeof MELT_LISTS)[number];

/**
 * The only place a MELT signup may say it came from. The database column allows
 * 200 characters, but the browser gets one allowlisted value, so no referrer,
 * UTM or gclid string can ever reach it.
 */
export const MELT_SOURCE = "aurum_melt" as const;

/**
 * Minimal coded result, matching commerce. Nothing here distinguishes a new
 * subscriber from an existing one, and no internal detail ever leaves the
 * server. There are deliberately no provider codes: no provider exists.
 */
export type NewsletterErrorCode = "invalid_request" | "rate_limited" | "unavailable";

export type NewsletterResult = { ok: true } | { ok: false; code: NewsletterErrorCode };
