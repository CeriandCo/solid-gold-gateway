import { defineTool } from "@lovable.dev/mcp-js";
import { product, steps } from "../content";

export default defineTool({
  name: "get_product_overview",
  title: "Get product overview",
  description:
    "Return the SQOOT Pure product overview: what fractional gold allocation is, the $25 minimum, availability, trust partners, and the five onboarding steps.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const payload = { product, howItWorks: steps };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
