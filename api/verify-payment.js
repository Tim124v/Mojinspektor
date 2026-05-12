/**
 * POST /api/verify-payment — перевірка Checkout Session (Payment Link) перед увімкненням Premium.
 * Body: { sessionId: string }
 * Env: STRIPE_SECRET_KEY
 */
const usedSessions = new Set()

export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': 'https://www.mojinspektor.pl',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ verified: false }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey?.trim()) {
    return new Response(JSON.stringify({ verified: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ verified: false }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const sessionId = body?.sessionId
  if (typeof sessionId !== 'string' || !sessionId.trim()) {
    return new Response(JSON.stringify({ verified: false }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const sid = sessionId.trim()

  const stripeRes = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sid)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  )

  if (!stripeRes.ok) {
    return new Response(JSON.stringify({ verified: false }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://www.mojinspektor.pl',
      },
    })
  }

  const session = await stripeRes.json()

  console.log('stripe session status:', session.status)
  console.log('stripe payment_status:', session.payment_status)
  console.log('stripe amount_total:', session.amount_total)
  console.log('stripe currency:', session.currency)

  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://www.mojinspektor.pl',
  }

  if (session.payment_status !== 'paid') {
    return new Response(JSON.stringify({ verified: false }), {
      status: 200,
      headers: jsonHeaders,
    })
  }

  if (usedSessions.has(sid)) {
    return new Response(JSON.stringify({ verified: false, reason: 'already_used' }), {
      status: 200,
      headers: jsonHeaders,
    })
  }

  const amountTotal = session.amount_total
  const amountOk =
    typeof amountTotal === 'number' &&
    (amountTotal === 5900 || amountTotal >= 0)

  const curr = typeof session.currency === 'string' ? session.currency.toLowerCase() : ''
  const currencyOk = curr === 'pln' || curr === 'usd'

  const verified =
    session.payment_status === 'paid' &&
    session.status === 'complete' &&
    amountOk &&
    currencyOk

  if (verified) {
    usedSessions.add(sid)
  }

  return new Response(JSON.stringify({ verified }), {
    status: 200,
    headers: jsonHeaders,
  })
}
