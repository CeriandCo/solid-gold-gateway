import { createFileRoute } from '@tanstack/react-router'

/**
 * Fetches the current gold spot price from Dillon Gage FizConnect, validates it,
 * and inserts one row into aurum_spot_prices. Manually invokable; no scheduling.
 */

const FIZ_BASE = 'https://stage-connect.fiztrade.com/FizServices/GetExtendedSpotPriceData'
/** Guard against abusive repeat writes on this open endpoint. */
const MIN_SECONDS_BETWEEN_INSERTS = 60

type Outcome =
  | { outcome: 'inserted'; price: number; observed_at: string; source: string }
  | { outcome: 'skipped-stale' | 'rejected-invalid' | 'error' | 'throttled'; reason: string }

function json(body: Outcome, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

/** Legacy ASP.NET date format: /Date(1427750042076)/ */
function parseSpotTime(value: unknown): Date | null {
  if (typeof value !== 'string') return null
  const match = /\/Date\((-?\d+)/.exec(value)
  if (!match?.[1]) return null
  const date = new Date(Number(match[1]))
  return Number.isNaN(date.getTime()) ? null : date
}

async function handle(request: Request) {
  // Primary gate: shared secret header. Rejects before any database or upstream call.
  // The header value is never logged.
  const cronSecret = process.env['AURUM_FETCHER_CRON_SECRET']
  if (!cronSecret) {
    console.error('[aurum-gold-price-fetcher] AURUM_FETCHER_CRON_SECRET is not configured')
    return json({ outcome: 'error', reason: 'Endpoint is not configured' }, 500)
  }
  if (request.headers.get('x-cron-secret') !== cronSecret) {
    return json({ outcome: 'error', reason: 'Unauthorized' }, 401)
  }

  const token = process.env['DILLON_GAGE_API_TOKEN']
  if (!token) {
    console.error('[aurum-gold-price-fetcher] DILLON_GAGE_API_TOKEN is not configured')
    return json({ outcome: 'error', reason: 'Missing DILLON_GAGE_API_TOKEN secret' }, 500)
  }

  const redactedUrl = `${FIZ_BASE}/***REDACTED***`
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

  // Secondary layer: throttle repeat writes.
  const throttleSince = new Date(Date.now() - MIN_SECONDS_BETWEEN_INSERTS * 1000).toISOString()
  const { data: recent, error: recentError } = await supabaseAdmin
    .from('aurum_spot_prices')
    .select('id')
    .gte('created_at', throttleSince)
    .limit(1)
  if (recentError) {
    console.error('[aurum-gold-price-fetcher] throttle check failed', recentError.message)
    return json({ outcome: 'error', reason: 'Database read failed' }, 500)
  }
  if (recent && recent.length > 0) {
    return json(
      { outcome: 'throttled', reason: `A price was already recorded in the last ${MIN_SECONDS_BETWEEN_INSERTS}s` },
      429,
    )
  }

  let payload: Record<string, unknown>
  try {
    const response = await fetch(`${FIZ_BASE}/${token}`, { headers: { accept: 'application/json' } })
    if (!response.ok) {
      console.error(`[aurum-gold-price-fetcher] ${redactedUrl} returned HTTP ${response.status}`)
      return json({ outcome: 'error', reason: `Upstream HTTP ${response.status}` }, 502)
    }
    payload = (await response.json()) as Record<string, unknown>
  } catch (cause) {
    console.error(`[aurum-gold-price-fetcher] request to ${redactedUrl} failed`, cause)
    return json({ outcome: 'error', reason: 'Upstream request failed' }, 502)
  }

  // The API answers 200 even for errors.
  if (typeof payload?.['error'] === 'string' && payload['error'].length > 0) {
    console.error('[aurum-gold-price-fetcher] upstream error:', payload['error'])
    return json({ outcome: 'error', reason: String(payload['error']) }, 502)
  }

  // TEMPORARY diagnostic: raw spotTime format (not a secret).
  console.log('[aurum-gold-price-fetcher] raw spotTime:', JSON.stringify(payload['spotTime']))

  const goldAsk = payload['goldAsk']
  const goldChange = payload['goldChange']
  const goldChangePercent = payload['goldChangePercent']
  const observedAt = parseSpotTime(payload['spotTime'])
  const areStale = payload['areStale']
  const activeFeed = typeof payload['activeFeed'] === 'string' ? payload['activeFeed'] : 'unknown'

  if (!isFiniteNumber(goldAsk) || goldAsk <= 0) {
    return json({ outcome: 'rejected-invalid', reason: 'goldAsk is not a finite positive number' }, 422)
  }
  if (!isFiniteNumber(goldChange) || !isFiniteNumber(goldChangePercent)) {
    return json({ outcome: 'rejected-invalid', reason: 'goldChange/goldChangePercent are not finite numbers' }, 422)
  }
  if (!observedAt) {
    return json({ outcome: 'rejected-invalid', reason: 'spotTime is missing or unparseable' }, 422)
  }
  if (areStale !== 0) {
    console.warn(`[aurum-gold-price-fetcher] upstream reports areStale=${String(areStale)}; not inserting`)
    return json({ outcome: 'skipped-stale', reason: `Upstream flagged the quote as stale (areStale=${String(areStale)})` }, 200)
  }

  // previous_close: latest stored daily close strictly before today (UTC).
  const todayUtc = new Date().toISOString().slice(0, 10)
  const { data: closeRows, error: closeError } = await supabaseAdmin
    .from('aurum_daily_closes')
    .select('close_price')
    .lt('price_date', todayUtc)
    .order('price_date', { ascending: false })
    .limit(1)
  if (closeError) {
    console.error('[aurum-gold-price-fetcher] daily close read failed', closeError.message)
    return json({ outcome: 'error', reason: 'Database read failed' }, 500)
  }
  let previousClose = closeRows?.[0]?.close_price
  if (!isFiniteNumber(previousClose)) {
    console.warn('[aurum-gold-price-fetcher] no prior daily close found; falling back to current goldAsk')
    previousClose = goldAsk
  }

  // high_24h / low_24h from the rolling 24-hour window, including the current quote.
  const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: windowRows, error: windowError } = await supabaseAdmin
    .from('aurum_spot_prices')
    .select('price')
    .gte('observed_at', windowStart)
  if (windowError) {
    console.error('[aurum-gold-price-fetcher] 24h window read failed', windowError.message)
    return json({ outcome: 'error', reason: 'Database read failed' }, 500)
  }
  const prices = [goldAsk, ...(windowRows ?? []).map((row) => Number(row.price)).filter(isFiniteNumber)]
  const high24h = Math.max(...prices)
  const low24h = Math.min(...prices)

  const source = `dillon_gage:${activeFeed}`
  const { error: insertError } = await supabaseAdmin.from('aurum_spot_prices').insert({
    price: goldAsk,
    currency: 'USD',
    unit: 'troy_ounce',
    observed_at: observedAt.toISOString(),
    change_amount: goldChange,
    change_percent: goldChangePercent,
    high_24h: high24h,
    low_24h: low24h,
    previous_close: previousClose,
    source,
  })
  if (insertError) {
    console.error('[aurum-gold-price-fetcher] insert failed', insertError.message)
    return json({ outcome: 'error', reason: 'Insert failed' }, 500)
  }

  return json({ outcome: 'inserted', price: goldAsk, observed_at: observedAt.toISOString(), source }, 200)
}

export const Route = createFileRoute('/api/public/aurum-gold-price-fetcher')({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
})
