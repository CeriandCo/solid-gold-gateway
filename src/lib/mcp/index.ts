import { defineMcp, type AnyToolDefinition } from "@lovable.dev/mcp-js";
import getProductOverview from "./tools/get-product-overview";
import getFees from "./tools/get-fees";
import searchFaq from "./tools/search-faq";

export default defineMcp({
  name: "sqoot-gold-vault",
  title: "SQOOT Gold Vault",
  version: "0.1.0",
  instructions:
    "Public information tools for SQOOT Pure, a fractional physical gold allocation service. Use `get_product_overview` for what the product is and how it works, `get_fees` for the fee schedule and cost estimates, and `search_faq` for published questions and answers.",
  tools: [getProductOverview, getFees, searchFaq],
});
