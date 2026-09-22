/**
 * The ONLY data the AI Daily Note pipeline may read: two internal price tables
 * and, for tone only, the text of already-published AURUM notes.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";

import type { DailyCloseRow, FactPack, FactPackInputs, SpotRow } from "./fact-pack";

export async function loadFactInputs(): Promise<FactPackInputs> {
  const { data: spot, error: spotError } = await supabaseAdmin
    .from("aurum_spot_prices")
    .select("id, price, currency, unit, observed_at, high_24h, low_24h, previous_close")
    .order("observed_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (spotError) throw new Error(`Failed to read spot prices: ${spotError.message}`);

  const { data: close, error: closeError } = await supabaseAdmin
    .from("aurum_daily_closes")
    .select("id, price_date, close_price, currency, unit")
    .order("price_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (closeError) throw new Error(`Failed to read daily closes: ${closeError.message}`);

  return {
    spot: (spot as SpotRow | null) ?? null,
    lastClose: (close as DailyCloseRow | null) ?? null,
  };
}

/** Published note summaries, used as tone samples only. Treated as data. */
export async function loadStyleSamples(limit = 3): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("aurum_posts")
    .select("summary")
    .eq("type", "daily_note")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return ((data ?? []) as { summary: string | null }[])
    .map((row) => (row.summary ?? "").trim())
    .filter(Boolean);
}

/**
 * Truthful internal sources. Our own price data has no external publisher, so
 * the citation names the internal table and row and links to the public page
 * that renders that same data. No external or invented URL is ever written.
 */
export function buildInternalSources(pack: FactPack, siteUrl: string) {
  const seen = new Set<string>();
  const sources: { publisher: string; title: string; date: string; url: string }[] = [];
  for (const fact of pack.facts) {
    const key = `${fact.source.table}:${fact.source.rowId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    sources.push({
      publisher: "SQOOT AURUM price record",
      title:
        fact.source.table === "aurum_spot_prices"
          ? `Stored gold spot observation (${fact.source.table} row ${fact.source.rowId})`
          : `Stored gold daily close (${fact.source.table} row ${fact.source.rowId})`,
      date: fact.effectiveAt.slice(0, 10),
      url: `${siteUrl.replace(/\/+$/, "")}/aurum#price`,
    });
  }
  return sources;
}
