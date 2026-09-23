import { createServerFn } from "@tanstack/react-start";

import type { NewsletterResult } from "./newsletter/types";

export type { NewsletterErrorCode, NewsletterResult } from "./newsletter/types";
export { MELT_LISTS, MELT_SOURCE } from "./newsletter/types";

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
    const { runMeltSignup } = await import("./newsletter/signup.server");
    return runMeltSignup(data);
  });
