import { createFileRoute } from '@tanstack/react-router'

/**
 * Public, read-only daily close history for the AURUM chart.
 * Reads aurum_daily_closes only; bounded to the requested window.
 */

const RANGE_DAYS = {
  '30d': 30,
  '90d': 90,
  '1y': 365,
  '5y': 1826,
} as const

type RangeKey = keyof typeof RANGE_DAYS

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

async function handle(request: Request) {
  const rangeParam = new URL(request.url).searchParams.get('range') ?? '1y'
  if (!(rangeParam in RANGE_DAYS)) {
    return json({ error: `Unsupported range '${rangeParam}'. Use 30d, 90d, 1y or 5y.` }, 400)
  }
  const days = RANGE_DAYS[rangeParam as RangeKey]

  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  // Newest-first so a row cap can never silently drop the most recent year,
  // then re-sorted ascending for the chart.
  const { data, error } = await supabaseAdmin
    .from('aurum_daily_closes')
    .select('price_date, close_price, source')
    .gte('price_date', from)
    .order('price_date', { ascending: false })
    .limit(days + 1)

  if (error) {
    console.error('[get-history] read failed', error.message)
    return json({ points: [], source: null, latest_date: null }, 503)
  }

  const points = (data ?? [])
    .map((row) => ({ date: row.price_date, close: Number(row.close_price) }))
    .filter((point) => Number.isFinite(point.close))

  return json(
    {
      points,
      source: data?.[0]?.source ?? null,
      latest_date: points.length > 0 ? points[points.length - 1]?.date ?? null : null,
    },
    200,
  )
}

export const Route = createFileRoute('/api/public/get-history')({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
    },
  },
})
