import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fees, feesNote, product } from "../content";

export default defineTool({
  name: "get_fees",
  title: "Get fees and estimate cost",
  description:
    "Return the published SQOOT Pure fee schedule. Optionally pass an allocation amount in USD to estimate the allocation fee and first-year storage costs.",
  inputSchema: {
    amount_usd: z
      .number()
      .positive()
      .optional()
      .describe("Optional allocation amount in USD to estimate fees for."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ amount_usd }) => {
    const round = (n: number) => Math.round(n * 100) / 100;
    const estimate =
      amount_usd === undefined
        ? undefined
        : {
            amountUsd: round(amount_usd),
            belowMinimum: amount_usd < product.minimumAllocationUsd,
            allocationFeeUsd: round(amount_usd * 0.03),
            annualStorageFeeUsd: round(amount_usd * 0.0035),
            insuredStorageFeeUsd: round(amount_usd * 0.0045),
            firstYearTotalFeesUsd: round(amount_usd * (0.03 + 0.0035 + 0.0045)),
          };
    const payload = { fees, note: feesNote, estimate };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
