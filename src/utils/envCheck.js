const REQUIRED_VITE = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_STRIPE_PUBLISHABLE_KEY',
  'VITE_STRIPE_PAYMENT_LINK',
]

/**
 * In dev mode also checks VITE_ANTHROPIC_API_KEY (needed for direct browser calls).
 * In production ANTHROPIC_API_KEY lives on the server — not checked here.
 */
export function checkRequiredEnvVars() {
  const missing = []
  const allRequired = import.meta.env.DEV
    ? [...REQUIRED_VITE, 'VITE_ANTHROPIC_API_KEY']
    : REQUIRED_VITE

  for (const key of allRequired) {
    const v = import.meta.env[key]
    if (v === undefined || v === null || String(v).trim() === '') {
      missing.push(key)
    }
  }
  return missing
}
