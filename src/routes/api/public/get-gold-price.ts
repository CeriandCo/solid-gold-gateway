import { createFileRoute } from '@tanstack/react-router'
import { derivePriceChange } from '@/lib/aurum/price-change'

/**
 * Public, read-only current gold price.
 *
 * Reads only the AURUM tables in this project's database — it never calls
 * Dillon Gage and never requires the cron secret. Freshness is computed here,
 * on the server, from observed_at; the browser clock is never trusted.
 *
 * Day change is derived only from two observations of the exact same provider
 * feed. Persisted derivatives are validated before they can reach a browser.
 */


/**
 * Working default: 900s = 15 minutes = three 5-minute fetch intervals.
 * The final threshold still needs Jay's sign-off.
 */
const DEFAULT_MAX_AGE_SECONDS = 900

type Freshness = 'fresh' | 'stale' | 'unavailable'

type PriceResponse = {
  price_usd: number | null
  change_amount: number | null
  change_pct: number | null
  day_high: number | null
  day_low: number | null
  previous_close: number | null
  previous_close_source: string | null

  provider: string | null
  provider_timestamp: string | null
  fetched_at: string | null
  age_seconds: number | null
  freshness: Freshness
}

function json(body: PriceResponse, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

const UNAVAILABLE: PriceResponse = {
  price_usd: null,
  change_amount: null,
  change_pct: null,
  day_high: null,
  day_low: null,
  previous_close: null,
  previous_close_source: null,

  provider: null,
  provider_timestamp: null,
  fetched_at: null,
  age_seconds: null,
  freshness: 'unavailable',
}

function num(value: unknown): number | null {
  const parsed = typeof value === 'string' ? Number(value) : value
  return typeof parsed === 'number' && Number.isFinite(parsed) ? parsed : null
}

/** Defensive rounding — upstream history carries float32 artifacts. */
function round2(value: number): number {
  return Math.round(value * 100) / 100
}


async function handle() {
  const maxAge = Number(process.env['AURUM_PRICE_MAX_AGE_SECONDS'] ?? DEFAULT_MAX_AGE_SECONDS)
  const maxAgeSeconds = Number.isFinite(maxAge) && maxAge > 0 ? maxAge : DEFAULT_MAX_AGE_SECONDS

  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  const { data, error } = await supabaseAdmin
    .from('aurum_spot_prices')
    .select('price, change_amount, change_percent, high_24h, low_24h, previous_close, source, observed_at, created_at')
    .order('observed_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('[get-gold-price] read failed', error.message)
    return json(UNAVAILABLE, 503)
  }

  const row = data?.[0]
  if (!row) return json(UNAVAILABLE, 503)

  const price = num(row.price)
  const observedAt = row.observed_at ? new Date(row.observed_at) : null
  if (price === null || price <= 0 || !observedAt || Number.isNaN(observedAt.getTime())) {
    return json(UNAVAILABLE, 503)
  }

  const ageSeconds = Math.max(0, Math.round((Date.now() - observedAt.getTime()) / 1000))
  // Boundary rule: at age_seconds exactly equal to the max age the result is
  // `fresh` — the comparison is `<=`, so the boundary is deterministic.
  const freshness: Freshness = ageSeconds <= maxAgeSeconds ? 'fresh' : 'stale'

  const provider = typeof row.source === 'string' ? row.source : null
  const rawPreviousClose = num(row.previous_close)
  const previousCloseSource = rawPreviousClose !== null ? provider : null
  const change = derivePriceChange({
    price,
    baseline: rawPreviousClose,
    priceSource: provider,
    baselineSource: previousCloseSource,
    suppliedAmount: num(row.change_amount) ?? undefined,
    suppliedPercent: num(row.change_percent) ?? undefined,
  })
  if (rawPreviousClose !== null && !change) {
    console.error('[get-gold-price] stored day-change fields contradict the same-feed price baseline')
  }

  const windowStart = new Date(observedAt.getTime() - 24 * 60 * 60 * 1000).toISOString()
  const { data: windowRows, error: windowError } = provider
    ? await supabaseAdmin
      .from('aurum_spot_prices')
      .select('price')
      .eq('source', provider)
      .gte('observed_at', windowStart)
      .lte('observed_at', observedAt.toISOString())
    : { data: null, error: null }
  if (windowError) console.error('[get-gold-price] rolling range read failed', windowError.message)
  const windowPrices = (windowRows ?? []).map((item) => num(item.price)).filter((item): item is number => item !== null)
  const dayHigh = !windowError && windowPrices.length > 0 ? Math.max(...windowPrices) : null
  const dayLow = !windowError && windowPrices.length > 0 ? Math.min(...windowPrices) : null

  return json(
    {
      price_usd: price,
      change_amount: change?.amount ?? null,
      change_pct: change?.percent ?? null,
      day_high: dayHigh,
      day_low: dayLow,
      previous_close: change && rawPreviousClose !== null ? round2(rawPreviousClose) : null,
      previous_close_source: previousCloseSource,

      provider,
      provider_timestamp: observedAt.toISOString(),
      fetched_at: row.created_at ? new Date(row.created_at).toISOString() : null,
      age_seconds: ageSeconds,
      freshness,
    },
    200,
  )
}

export const Route = createFileRoute('/api/public/get-gold-price')({
  server: {
    handlers: {
      GET: () => handle(),
    },
  },
})
