/**
 * POST /api/check-access — серверна перевірка Premium через Firestore (service account).
 * Runtime: nodejs (Edge не підтримує RS256 через node:crypto).
 */
export const config = { runtime: 'nodejs' }

import { createSign } from 'node:crypto'

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function sendJson(res, status, obj) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', 'https://www.mojinspektor.pl')
  return res.status(status).send(JSON.stringify(obj))
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.mojinspektor.pl')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' })
  }

  let body
  try {
    const raw = await readRequestBody(req)
    body = JSON.parse(raw.length ? raw.toString('utf8') : '{}')
  } catch {
    return sendJson(res, 400, { error: 'Invalid JSON' })
  }

  const { uid, feature } = body || {}

  if (!uid || !feature) {
    return sendJson(res, 400, { allowed: false, reason: 'missing params' })
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

  if (!projectId || !serviceAccountKey) {
    // Fallback: allow if server not configured (never in production)
    return sendJson(res, 200, { allowed: true, source: 'fallback' })
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey)
    const token = await getAccessToken(serviceAccount)
    if (!token) {
      return sendJson(res, 200, { allowed: false, isPremium: false })
    }

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`
    const fsRes = await fetch(firestoreUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!fsRes.ok) {
      return sendJson(res, 200, { allowed: false, isPremium: false })
    }

    const data = await fsRes.json()
    const fields = data.fields || {}
    const isPremium = fields.isPremium?.booleanValue === true

    return sendJson(res, 200, {
      allowed: isPremium || feature === 'cards',
      isPremium,
    })
  } catch (err) {
    return sendJson(res, 200, { allowed: false, error: err.message })
  }
}

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/datastore',
  }
  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url')
  const signingInput = `${encode(header)}.${encode(payload)}`
  const sign = createSign('RSA-SHA256')
  sign.update(signingInput)
  const signature = sign.sign(serviceAccount.private_key, 'base64url')
  const jwt = `${signingInput}.${signature}`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  const tokenData = await tokenRes.json()
  return tokenData.access_token
}
