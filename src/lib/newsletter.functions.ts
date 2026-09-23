import { createServerFn } from "@tanstack/react-start";

import type { NewsletterResult } from "./newsletter/types";

export type { NewsletterErrorCode, NewsletterResult } from "./newsletter/types";
export { MELT_LISTS, MELT_SOURCE } from "./newsletter/types";

/** The wording a visitor sees and its version (a comparison token only), or null while signup is disabled. */
export type MeltConsentNotice = { text: string; version: string } | null;

/**
 * Public projection of the one authoritative consent definition. The browser
 * displays this and nothing else; it cannot supply or override the snapshot the
 * server stores, which comes from the same definition.
 */
export const fetchMeltConsentNotice = createServerFn({ method: "GET" }).handler(
  async (): Promise<MeltConsentNotice> => {
    const { publicConsentNotice } = await import("./newsletter/consent.server");
    return publicConsentNotice();
  },
);

/**
 * Public MELT newsletter signup. The browser sends only an address, the content
 * preferences it selected and the fixed form identifier; everything else —
 * consent wording, consent time, the rate-limit identity — is decided on the
 * server. See newsletter/signup.server.ts.
 *
 * The server-only module is imported inside the handler so service-role code
 * never enters a client-reachable chunk.
 */
export const subscribeToMelt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<NewsletterResult> => {
    try {
      const { runMeltSignup } = await import("./newsletter/signup.server");
      return await runMeltSignup(data);
    } catch {
      return { ok: false, code: "unavailable" };
    }
  });
