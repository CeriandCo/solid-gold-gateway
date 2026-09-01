import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { faqs } from "../content";

export default defineTool({
  name: "search_faq",
  title: "Search the FAQ",
  description:
    "Search the published SQOOT Pure frequently asked questions. Omit the query to return every question and answer.",
  inputSchema: {
    query: z.string().trim().optional().describe("Optional keywords to filter the FAQ by."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }) => {
    const q = query?.toLowerCase() ?? "";
    const matches = q
      ? faqs.filter((f) => `${f.question} ${f.answer}`.toLowerCase().includes(q))
      : [...faqs];
    const payload = { query: query ?? null, count: matches.length, results: matches };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
