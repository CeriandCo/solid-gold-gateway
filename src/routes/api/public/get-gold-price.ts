import { createFileRoute } from '@tanstack/react-router'

/**
 * Public, read-only current gold price.
 *
 * Reads only the AURUM tables in this project's database — it never calls
 * Dillon Gage and never requires the cron secret. Freshness is computed here,
 * on the server, from observed_at; the browser clock is never trusted.
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

  // Provider name only; never the raw provider payload or the token.
  const provider = typeof row.source === 'string' ? (row.source.split(':')[0] ?? null) : null

  return json(
    {
      price_usd: price,
      change_amount: num(row.change_amount),
      change_pct: num(row.change_percent),
      day_high: num(row.high_24h),
      day_low: num(row.low_24h),
      previous_close: num(row.previous_close),
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
