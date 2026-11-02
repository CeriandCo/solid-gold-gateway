import { createServerFn } from "@tanstack/react-start";

import type { LeadResult } from "./leads/consent";

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<LeadResult> => {
    try {
      const { runWaitlistSignup } = await import("./leads/leads.server");
      return await runWaitlistSignup(data);
    } catch {
      return { ok: false, code: "unavailable" };
    }
  });

export const submitPartnerApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<LeadResult> => {
    try {
      const { runPartnerApplication } = await import("./leads/leads.server");
      return await runPartnerApplication(data);
    } catch {
      return { ok: false, code: "unavailable" };
    }
  });
