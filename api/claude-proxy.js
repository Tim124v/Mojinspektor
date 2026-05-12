/**
 * Vercel Edge Function — Anthropic Claude proxy (API key stays server-side).
 * Env: ANTHROPIC_API_KEY (required), ALLOWED_ORIGIN optional comma-separated origins.
 *
 * Rate limit: 30 POST / 60s per client IP (best-effort у межах warm isolate).
 */

export const config = {
  runtime: 'edge',
}

const RATE_WINDOW_MS = 60_000
const RATE_LIMIT = 30
const MAX_BODY_BYTES = 520_000

const USAGE_CHECK_TYPES = new Set(['b1_writing', 'inspector'])

/** @type {Map<string, number[]>} */
const rateBuckets = new Map()

function getClientKey(request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim() || 'unknown'
  return request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip') || 'unknown'
}

function rateLimitConsume(key) {
  const now = Date.now()
  let stamps = rateBuckets.get(key)
  if (!stamps) stamps = []
  stamps = stamps.filter((t) => now - t < RATE_WINDOW_MS)
  if (stamps.length >= RATE_LIMIT) {
    rateBuckets.set(key, stamps)
    return { allow: false, remaining: 0 }
  }
  stamps.push(now)
  rateBuckets.set(key, stamps)
  return { allow: true, remaining: RATE_LIMIT - stamps.length }
}

function securityHeaders(remaining) {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-RateLimit-Limit': String(RATE_LIMIT),
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
  }
}

function corsHeaders(origin) {
  if (!origin) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function json(body, status, origin, remaining = RATE_LIMIT) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...securityHeaders(remaining),
      ...corsHeaders(origin),
    },
  })
}

function allowedOriginHeader(request) {
  const origin = request.headers.get('origin')
  if (!origin) return { ok: false, origin: null }

  const raw = process.env.ALLOWED_ORIGIN
  if (!raw || !raw.trim()) {
    return { ok: true, origin }
  }

  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (list.includes(origin)) return { ok: true, origin }
  return { ok: false, origin: null }
}

export default async function handler(request) {
  const isVercelProduction = process.env.VERCEL_ENV === 'production'
  if (isVercelProduction && !process.env.ALLOWED_ORIGIN?.trim()) {
    return new Response(
      JSON.stringify({
        error: { message: 'Server misconfigured: set ALLOWED_ORIGIN in Vercel' },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...securityHeaders(0) },
      }
    )
  }

  const preflight = allowedOriginHeader(request)

  if (request.method === 'OPTIONS') {
    if (!preflight.ok || !preflight.origin) {
      return new Response(null, { status: 403, headers: securityHeaders(0) })
    }
    return new Response(null, {
      status: 204,
      headers: {
        ...securityHeaders(RATE_LIMIT),
        ...corsHeaders(preflight.origin),
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  if (request.method !== 'POST') {
    return json({ error: { message: 'Method not allowed' } }, 405, preflight.origin || null, 0)
  }

  if (!request.headers.get('origin')) {
    return new Response(JSON.stringify({ error: { message: 'Forbidden: missing Origin' } }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...securityHeaders(0) },
    })
  }

  if (!preflight.ok) {
    return new Response(JSON.stringify({ error: { message: 'Forbidden: invalid Origin' } }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...securityHeaders(0) },
    })
  }

  const corsOrigin = preflight.origin
  const clientKey = getClientKey(request)
  const { allow, remaining } = rateLimitConsume(clientKey)
  if (!allow) {
    return json(
      { error: { message: 'Too many requests', code: 'RATE_LIMITED' } },
      429,
      corsOrigin,
      0
    )
  }

  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return json(
      { error: { message: 'Payload too large', code: 'PAYLOAD_TOO_LARGE' } },
      413,
      corsOrigin,
      remaining
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: { message: 'Invalid JSON body' } }, 400, corsOrigin, remaining)
  }

  const bodyStr = JSON.stringify(body)
  if (bodyStr.length > MAX_BODY_BYTES) {
    return json(
      { error: { message: 'Payload too large', code: 'PAYLOAD_TOO_LARGE' } },
      413,
      corsOrigin,
      remaining
    )
  }

  const {
    messages,
    systemPrompt,
    maxTokens,
    temperature,
    checkType: rawCheckType,
    firebaseUid: rawFirebaseUid,
  } = body || {}

  let checkType = rawCheckType
  if (checkType !== undefined && checkType !== null) {
    if (typeof checkType !== 'string' || !USAGE_CHECK_TYPES.has(checkType)) {
      return json(
        { error: { message: 'checkType must be "inspector" or "b1_writing" when provided' } },
        400,
        corsOrigin,
        remaining
      )
    }
  } else {
    checkType = undefined
  }

  let firebaseUid = rawFirebaseUid
  if (firebaseUid !== undefined && firebaseUid !== null) {
    if (typeof firebaseUid !== 'string') {
      return json(
        { error: { message: 'firebaseUid must be a string when provided' } },
        400,
        corsOrigin,
        remaining
      )
    }
    firebaseUid = firebaseUid.trim()
  } else {
    firebaseUid = undefined
  }

  if (typeof firebaseUid === 'string' && firebaseUid) {
    console.log(
      JSON.stringify({
        event: 'claude_proxy_usage',
        checkType: checkType || null,
        firebaseUid,
        t: Date.now(),
      })
    )
  }

  // For inspector and b1_writing — verify Premium or freemium from server
  // (freemium counting stays on client for now — server check only for Premium)
  // This is already handled by client-side limits — no change needed here
  //
  // Just log usage as before — full server-side freemium is v2 scope

  if (!Array.isArray(messages) || messages.length === 0) {
    return json(
      { error: { message: 'messages must be a non-empty array' } },
      400,
      corsOrigin,
      remaining
    )
  }
  if (typeof systemPrompt !== 'string' || !systemPrompt.trim()) {
    return json(
      { error: { message: 'systemPrompt must be a non-empty string' } },
      400,
      corsOrigin,
      remaining
    )
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return json(
      { error: { message: 'Server misconfigured: ANTHROPIC_API_KEY' } },
      500,
      corsOrigin,
      remaining
    )
  }

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: typeof maxTokens === 'number' && maxTokens > 0 ? maxTokens : 1000,
      temperature: typeof temperature === 'number' ? temperature : 0.3,
      system: systemPrompt,
      messages,
    }),
  })

  const data = await anthropicRes.json().catch(() => ({
    error: { message: `Anthropic error (${anthropicRes.status})` },
  }))

  return new Response(JSON.stringify(data), {
    status: anthropicRes.status,
    headers: {
      'Content-Type': 'application/json',
      ...securityHeaders(remaining),
      ...corsHeaders(corsOrigin),
    },
  })
}
