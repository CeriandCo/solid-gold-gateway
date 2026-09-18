import { createFileRoute } from '@tanstack/react-router'

/**
 * Backfills aurum_daily_closes from Yahoo Finance.
 *
 * IMPORTANT: the series is `GC=F`, COMEX gold FUTURES — not the Dillon Gage
 * spot feed that fills aurum_spot_prices. The two series are close but not
 * strictly comparable (futures carry basis/contango). Jay still needs to
 * confirm whether Yahoo stays as the history source.
 *
 * Gated by the same X-Cron-Secret header as the fetcher. Not public.
 */

const YAHOO_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/GC=F?range=5y&interval=1d'
const UPSTREAM_TIMEOUT_MS = 8000
const MAX_RETRIES = 2
const TRANSIENT_STATUSES = new Set([429, 502, 503, 504])

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type FetchResult =
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; status: number; reason: string }

async function fetchHistory(): Promise<FetchResult> {
  let last: FetchResult = { ok: false, status: 502, reason: 'Upstream request failed' }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let transient = false
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)
    try {
      const response = await fetch(YAHOO_URL, {
        headers: { accept: 'application/json', 'user-agent': 'Mozilla/5.0 (compatible; SqootAurum/1.0)' },
        signal: controller.signal,
      })
      if (!response.ok) {
        console.error(`[aurum-backfill-daily-history] Yahoo returned HTTP ${response.status}`)
        last = { ok: false, status: 502, reason: `Upstream HTTP ${response.status}` }
        transient = TRANSIENT_STATUSES.has(response.status)
      } else {
        return { ok: true, payload: (await response.json()) as Record<string, unknown> }
      }
    } catch (cause) {
      const aborted = cause instanceof Error && cause.name === 'AbortError'
      console.error('[aurum-backfill-daily-history] request failed', cause)
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
    await sleep(500 * 2 ** attempt + Math.floor(Math.random() * 250))
  }

  return last
}

async function handle(request: Request) {
  const cronSecret = process.env['AURUM_FETCHER_CRON_SECRET']
  if (!cronSecret) {
    console.error('[aurum-backfill-daily-history] AURUM_FETCHER_CRON_SECRET is not configured')
    return json({ outcome: 'error', reason: 'Endpoint is not configured' }, 500)
  }
  if (request.headers.get('x-cron-secret') !== cronSecret) {
    return json({ outcome: 'error', reason: 'Unauthorized' }, 401)
  }

  const result = await fetchHistory()
  if (!result.ok) return json({ outcome: 'error', reason: result.reason }, result.status)

  const chart = result.payload['chart'] as { result?: unknown[] } | undefined
  const series = (chart?.result?.[0] ?? null) as
    | { timestamp?: number[]; indicators?: { quote?: { close?: (number | null)[] }[] } }
    | null
  const timestamps = series?.timestamp
  const closes = series?.indicators?.quote?.[0]?.close
  if (!Array.isArray(timestamps) || !Array.isArray(closes)) {
    return json({ outcome: 'error', reason: 'Unexpected Yahoo payload shape' }, 502)
  }

  const rows: { price_date: string; close_price: number; currency: string; unit: string; source: string }[] = []
  const seen = new Set<string>()
  for (let i = 0; i < timestamps.length; i++) {
    const close = closes[i]
    const ts = timestamps[i]
    // Skip gaps rather than writing a fabricated value.
    if (typeof close !== 'number' || !Number.isFinite(close) || close <= 0) continue
    if (typeof ts !== 'number' || !Number.isFinite(ts)) continue
    const date = new Date(ts * 1000).toISOString().slice(0, 10)
    if (seen.has(date)) continue
    seen.add(date)
    rows.push({
      price_date: date,
      close_price: close,
      currency: 'USD',
      unit: 'troy_ounce',
      source: 'yahoo:GC=F',
    })
  }

  if (rows.length === 0) return json({ outcome: 'error', reason: 'No usable history points' }, 502)

  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  const { count: beforeCount } = await supabaseAdmin
    .from('aurum_daily_closes')
    .select('id', { count: 'exact', head: true })

  // Upsert on price_date: re-running is safe and never duplicates.
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await supabaseAdmin
      .from('aurum_daily_closes')
      .upsert(rows.slice(i, i + 500), { onConflict: 'price_date' })
    if (error) {
      console.error('[aurum-backfill-daily-history] upsert failed', error.message)
      return json({ outcome: 'error', reason: 'Upsert failed' }, 500)
    }
  }

  const { count: afterCount } = await supabaseAdmin
    .from('aurum_daily_closes')
    .select('id', { count: 'exact', head: true })

  const inserted = (afterCount ?? 0) - (beforeCount ?? 0)
  const dates = rows.map((row) => row.price_date).sort()

  return json(
    {
      outcome: 'ok',
      rows_processed: rows.length,
      rows_inserted: inserted,
      rows_updated: rows.length - inserted,
      earliest_date: dates[0] ?? null,
      latest_date: dates[dates.length - 1] ?? null,
      total_rows: afterCount ?? null,
      source: 'yahoo:GC=F',
    },
    200,
  )
}

export const Route = createFileRoute('/api/public/aurum-backfill-daily-history')({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
})
