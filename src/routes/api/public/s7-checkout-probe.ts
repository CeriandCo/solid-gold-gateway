import { createFileRoute } from '@tanstack/react-router'

/**
 * TEMPORARY diagnostic endpoint for task S-7. Delete once the investigation is
 * closed. Requires the cron shared secret; never returns or logs any key.
 */
async function handle(request: Request) {
  const secret = process.env['AURUM_FETCHER_CRON_SECRET']
  if (!secret || request.headers.get('x-cron-secret') !== secret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    })
  }

  const url = new URL(request.url)
  const denominationId = url.searchParams.get('denominationId') ?? ''
  const attemptId = url.searchParams.get('attemptId') ?? crypto.randomUUID()
  const probePriceId = url.searchParams.get('priceId')

  const out: Record<string, unknown> = { attemptId, origin: request.headers.get('origin') }

  const { getStripeSecretKey, createStripeClient, isLiveKey } = await import('@/lib/commerce.server')
  const { keyMode } = await import('@/lib/commerce/stripe-catalog.server')
  const key = getStripeSecretKey()
  out['keyPresent'] = Boolean(key)
  out['keyMode'] = keyMode()
  out['keyIsLive'] = key ? isLiveKey(key) : null

  if (probePriceId && key) {
    try {
      const stripe = createStripeClient(key)
      const price = await stripe.prices.retrieve(probePriceId)
      out['priceProbe'] = {
        ok: true,
        id: price.id,
        unit_amount: price.unit_amount,
        currency: price.currency,
        type: price.type,
        active: price.active,
        livemode: price.livemode,
        product: price.product,
      }
    } catch (cause) {
      const err = cause as { type?: string; code?: string; statusCode?: number; message?: string }
      out['priceProbe'] = {
        ok: false,
        type: err?.type,
        code: err?.code,
        status: err?.statusCode,
        message: err?.message,
      }
    }
  }

  if (denominationId) {
    const { runGiftCardCheckout } = await import('@/lib/commerce-checkout.server')
    try {
      out['checkout'] = await runGiftCardCheckout({ denominationId, attemptId })
    } catch (cause) {
      const err = cause as { type?: string; code?: string; statusCode?: number; message?: string }
      out['checkoutThrew'] = {
        type: err?.type,
        code: err?.code,
        status: err?.statusCode,
        message: err?.message ?? String(cause),
      }
    }
  }

  const { getGiftCardOffering } = await import('@/lib/commerce.functions')
  try {
    out['offering'] = await getGiftCardOffering()
  } catch (cause) {
    out['offeringThrew'] = String(cause)
  }

  return new Response(JSON.stringify(out, null, 2), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })
}

export const Route = createFileRoute('/api/public/s7-checkout-probe')({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
})
