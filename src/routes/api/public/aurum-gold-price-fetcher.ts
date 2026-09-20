import { createFileRoute } from '@tanstack/react-router'
import { derivePriceChange } from '@/lib/aurum/price-change'

/**
 * Fetches the current gold spot price from Dillon Gage FizConnect, validates it,
 * and inserts one row into aurum_spot_prices. Manually invokable; no scheduling.
 */

/**
 * NOTE: the default below is Dillon Gage's STAGING host. The production host is
 * still unconfirmed and pending from Jay. Set FIZCONNECT_BASE_URL to switch
 * hosts without a code change.
 */
const FIZ_BASE_DEFAULT = 'https://stage-connect.fiztrade.com/FizServices/GetExtendedSpotPriceData'
/** Guard against abusive repeat writes on this open endpoint. */
const MIN_SECONDS_BETWEEN_INSERTS = 60
/** Upstream request budget. Whole run incl. retries stays well inside 20s. */
const UPSTREAM_TIMEOUT_MS = 8000
const MAX_RETRIES = 2
/** Sanity window for observed_at relative to server time. */
const MAX_FUTURE_MS = 5 * 60 * 1000
const MAX_PAST_MS = 20 * 60 * 1000

type Outcome =
  | { outcome: 'inserted'; price: number; observed_at: string; source: string }
  | { outcome: 'duplicate'; observed_at: string }
  | {
      outcome: 'skipped-stale' | 'rejected-invalid' | 'error' | 'throttled'
      reason: string
    }

function json(body: Outcome, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

/**
 * Offset of a named IANA zone at a given instant, in milliseconds
 * (e.g. US Central in summer -> -5h).
 */
function zoneOffsetMs(timeZone: string, at: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'longOffset',
  }).formatToParts(at)
  const name = parts.find((part) => part.type === 'timeZoneName')?.value ?? 'GMT+00:00'
  const match = /GMT([+-])(\d{2}):?(\d{2})?/.exec(name)
  if (!match) return 0
  const sign = match[1] === '-' ? -1 : 1
  const hours = Number(match[2] ?? 0)
  const minutes = Number(match[3] ?? 0)
  return sign * (hours * 60 + minutes) * 60_000
}

let loggedMissingOffset = false

/**
 * Legacy ASP.NET date format, with an optional timezone suffix:
 *   /Date(1427750042076-0500)/
 * The number is wall-clock milliseconds in the stated offset, so the true UTC
 * instant is `ms - offset` (with -0500 the instant is 5 hours LATER).
 *
 * Observed reality on the staging feed: no suffix is sent, yet the number is
 * US Central wall clock, not UTC. When the suffix is absent we therefore apply
 * the DST-aware America/Chicago offset and log it once.
 */
function parseSpotTime(value: unknown): Date | null {
  if (typeof value !== 'string') return null
  const match = /\/Date\((-?\d+)([+-]\d{4})?\)/.exec(value)
  if (!match?.[1]) return null
  const ms = Number(match[1])
  if (!Number.isFinite(ms)) return null

  let offsetMs: number
  const suffix = match[2]
  if (suffix) {
    const sign = suffix[0] === '-' ? -1 : 1
    offsetMs = sign * (Number(suffix.slice(1, 3)) * 60 + Number(suffix.slice(3, 5))) * 60_000
  } else {
    // RE-VERIFY ON 1 NOVEMBER 2026: if the provider actually emits a fixed
    // -0500 rather than true US Central local time, this silently shifts by an
    // hour when DST ends. The 20-minute past guard below is what catches it.
    offsetMs = zoneOffsetMs('America/Chicago', new Date(ms))
    if (!loggedMissingOffset) {
      loggedMissingOffset = true
      console.warn(
        `[aurum-gold-price-fetcher] spotTime has no offset suffix; treating it as US Central wall clock (offset ${offsetMs / 3_600_000}h)`,
      )
    }
  }

  const date = new Date(ms - offsetMs)
  return Number.isNaN(date.getTime()) ? null : date
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type FetchResult =
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; status: number; reason: string }

const TRANSIENT_STATUSES = new Set([429, 502, 503, 504])

/** Fetch with an 8s abort timeout and bounded retries for transient failures only. */
async function fetchSpotData(url: string, redactedUrl: string): Promise<FetchResult> {
  let last: FetchResult = { ok: false, status: 502, reason: 'Upstream request failed' }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let transient = false
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)
    try {
      const response = await fetch(url, {
        headers: { accept: 'application/json' },
        signal: controller.signal,
      })
      if (!response.ok) {
        console.error(`[aurum-gold-price-fetcher] ${redactedUrl} returned HTTP ${response.status}`)
        last = { ok: false, status: 502, reason: `Upstream HTTP ${response.status}` }
        transient = TRANSIENT_STATUSES.has(response.status)
      } else {
        return { ok: true, payload: (await response.json()) as Record<string, unknown> }
      }
    } catch (cause) {
      const aborted = cause instanceof Error && cause.name === 'AbortError'
      console.error(`[aurum-gold-price-fetcher] request to ${redactedUrl} failed`, cause)
      last = {
        ok: false,
        status: 504,
        reason: aborted ? `Upstream timed out after ${UPSTREAM_TIMEOUT_MS}ms` : 'Upstream request failed',
      }
      transient = aborted
    } finally {
      clearTimeout(timer)
    }

    if (!transient || attempt === MAX_RETRIES) return last
    // Exponential backoff with jitter: ~0.5s then ~1s. Worst case stays under 20s.
    await sleep(500 * 2 ** attempt + Math.floor(Math.random() * 250))
  }

  return last
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

  const fizBase = process.env['FIZCONNECT_BASE_URL'] || FIZ_BASE_DEFAULT
  const redactedUrl = `${fizBase}/***REDACTED***`
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

  const result = await fetchSpotData(`${fizBase}/${token}`, redactedUrl)
  if (!result.ok) {
    return json({ outcome: 'error', reason: result.reason }, result.status)
  }
  const payload = result.payload

  // The API answers 200 even for errors. Never retried.
  if (typeof payload?.['error'] === 'string' && payload['error'].length > 0) {
    console.error('[aurum-gold-price-fetcher] upstream error:', payload['error'])
    return json({ outcome: 'error', reason: String(payload['error']) }, 502)
  }

  const goldAsk = payload['goldAsk']
  const observedAt = parseSpotTime(payload['spotTime'])
  const areStale = payload['areStale']
  const activeFeed = typeof payload['activeFeed'] === 'string' ? payload['activeFeed'] : 'unknown'

  if (!isFiniteNumber(goldAsk) || goldAsk <= 0) {
    return json({ outcome: 'rejected-invalid', reason: 'goldAsk is not a finite positive number' }, 422)
  }
  if (!observedAt) {
    return json({ outcome: 'rejected-invalid', reason: 'spotTime is missing or unparseable' }, 422)
  }

  // Sanity guard: catches a timezone regression in either direction before any insert.
  const driftMs = Date.now() - observedAt.getTime()
  if (driftMs < -MAX_FUTURE_MS || driftMs > MAX_PAST_MS) {
    const minutes = (driftMs / 60000).toFixed(1)
    return json(
      {
        outcome: 'rejected-invalid',
        reason: `observed_at (${observedAt.toISOString()}) drifts ${minutes} minutes from server time; outside the allowed window (-5min to +20min)`,
      },
      422,
    )
  }

  if (areStale !== 0) {
    console.warn(`[aurum-gold-price-fetcher] upstream reports areStale=${String(areStale)}; not inserting`)
    return json({ outcome: 'skipped-stale', reason: `Upstream flagged the quote as stale (areStale=${String(areStale)})` }, 200)
  }

  const source = `dillon_gage:${activeFeed}`
  const observedDayStart = `${observedAt.toISOString().slice(0, 10)}T00:00:00.000Z`
  const { data: closeRows, error: closeError } = await supabaseAdmin
    .from('aurum_spot_prices')
    .select('price, source')
    .eq('source', source)
    .lt('observed_at', observedDayStart)
    .order('observed_at', { ascending: false })
    .limit(1)
  if (closeError) {
    console.error('[aurum-gold-price-fetcher] daily close read failed', closeError.message)
    return json({ outcome: 'error', reason: 'Database read failed' }, 500)
  }
  const rawPreviousClose = closeRows?.[0]?.price
  const previousClose = isFiniteNumber(rawPreviousClose) ? rawPreviousClose : null
  const change = derivePriceChange({
    price: goldAsk,
    baseline: previousClose,
    priceSource: source,
    baselineSource: closeRows?.[0]?.source,
  })
  if (previousClose === null) {
    console.warn('[aurum-gold-price-fetcher] no prior same-feed close found; day change is unavailable')
  }

  // high_24h / low_24h from the rolling 24-hour window, including the current quote.
  const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: windowRows, error: windowError } = await supabaseAdmin
    .from('aurum_spot_prices')
    .select('price')
    .eq('source', source)
    .gte('observed_at', windowStart)
  if (windowError) {
    console.error('[aurum-gold-price-fetcher] 24h window read failed', windowError.message)
    return json({ outcome: 'error', reason: 'Database read failed' }, 500)
  }
  const prices = [goldAsk, ...(windowRows ?? []).map((row) => Number(row.price)).filter(isFiniteNumber)]
  const high24h = Math.max(...prices)
  const low24h = Math.min(...prices)

  const { error: insertError } = await supabaseAdmin.from('aurum_spot_prices').insert({
    price: goldAsk,
    currency: 'USD',
    unit: 'troy_ounce',
    observed_at: observedAt.toISOString(),
    change_amount: change?.amount ?? 0,
    change_percent: change?.percent ?? 0,
    high_24h: high24h,
    low_24h: low24h,
    previous_close: previousClose,
    source,
  })
  if (insertError) {
    // Unique violation on observed_at: the provider has not published a new quote.
    if (insertError.code === '23505') {
      return json({ outcome: 'duplicate', observed_at: observedAt.toISOString() }, 200)
    }
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
