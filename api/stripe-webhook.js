/**
 * Stripe webhook — Vercel Node Serverless Function.
 * Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (Dashboard → Webhooks → signing secret).
 */
import Stripe from 'stripe'

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

async function createJWT(serviceAccount) {
  const header = { alg: 'RS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
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

  const crypto = await import('node:crypto')
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(signingInput)
  const signature = sign.sign(serviceAccount.private_key, 'base64url')

  return `${signingInput}.${signature}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!webhookSecret || !secretKey) {
    console.error('stripe-webhook: missing STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY')
    return res.status(500).json({ error: 'Server misconfigured' })
  }

  const stripe = new Stripe(secretKey)
  const sig = req.headers['stripe-signature']

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature' })
  }

  let buf
  try {
    buf = await readRequestBody(req)
  } catch (e) {
    console.error('stripe-webhook: body read error', e)
    return res.status(400).json({ error: 'Invalid body' })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err) {
    console.error('stripe-webhook: signature verification failed', err.message)
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    if (session.payment_status === 'paid') {
      const uid = session.client_reference_id || session.metadata?.firebaseUid || null
      const email = session.customer_details?.email || null

      console.log('stripe checkout.session.completed — payment confirmed', {
        id: session.id,
        email,
        uid,
      })

      if (uid) {
        const projectId = process.env.FIREBASE_PROJECT_ID
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

        if (projectId && serviceAccountKey) {
          try {
            const serviceAccount = JSON.parse(serviceAccountKey)

            // Get access token via Google OAuth2
            const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: await createJWT(serviceAccount),
              }),
            })
            const tokenData = await tokenRes.json()
            const accessToken = tokenData.access_token

            if (accessToken) {
              // Write to Firestore via REST API
              const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`
              await fetch(firestoreUrl, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                  fields: {
                    isPremium: { booleanValue: true },
                    activatedAt: { stringValue: new Date().toISOString() },
                    source: { stringValue: 'stripe_webhook' },
                    stripeSessionId: { stringValue: session.id },
                  },
                }),
              })
              console.log('stripe-webhook: Premium written to Firestore for uid', uid)
            }
          } catch (err) {
            console.error('stripe-webhook: failed to write Firestore', err.message)
            // Non-fatal — user can still activate via redirect flow
          }
        } else {
          console.warn(
            'stripe-webhook: FIREBASE_PROJECT_ID or FIREBASE_SERVICE_ACCOUNT_KEY not set — skipping Firestore write'
          )
        }
      } else {
        console.warn('stripe-webhook: no uid in session — cannot write to Firestore')
      }
    }
  }

  return res.status(200).json({ received: true })
}
