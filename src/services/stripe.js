/**
 * STRIPE PAYMENT SERVICE
 *
 * Payment Link — URL у Stripe Dashboard (buy.stripe.com/...).
 * Після оплати success URL → /upgrade?payment_success=true (див. getSuccessUrl()).
 *
 * Live: VITE_STRIPE_PAYMENT_LINK без підрядка test_, pk_live_ у publishable key.
 * .env обов’язково задає VITE_STRIPE_PAYMENT_LINK (без захардкоженого fallback).
 */

let stripePromise

export function getStripe() {
  if (stripePromise !== undefined) return stripePromise
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  if (!key) {
    stripePromise = Promise.resolve(null)
    return stripePromise
  }
  stripePromise = import('@stripe/stripe-js').then(({ loadStripe }) => loadStripe(key))
  return stripePromise
}

function getPaymentLink() {
  const raw = import.meta.env.VITE_STRIPE_PAYMENT_LINK
  return raw && String(raw).trim() ? String(raw).trim() : ''
}

/** true, якщо схоже на live Payment Link (немає фрагмента test_ у шляху, як у тестових лінках Stripe). */
export function isLiveMode() {
  const link = getPaymentLink()
  return link.length > 0 && !link.includes('test_')
}

/** URL після успішної оплати (Stripe Payment Link success URL і редіректи в застосунку). */
export function getSuccessUrl() {
  const base = window.location.origin
  return `${base}/upgrade?payment_success=true`
}

/**
 * Редірект на Stripe Payment Link.
 * @returns {boolean} false якщо лінк не налаштований (оплата не запущена).
 */
/**
 * @param {string} [clientReferenceId] — Firebase uid для Stripe Payment Link (client_reference_id у URL).
 */
export function redirectToCheckout(clientReferenceId) {
  const link = getPaymentLink()
  if (!link) {
    console.error('VITE_STRIPE_PAYMENT_LINK is not configured')
    alert('Оплата тимчасово недоступна. Спробуйте пізніше або зверніться до підтримки.')
    return false
  }
  const id = clientReferenceId && String(clientReferenceId).trim()
  if (id) {
    const sep = link.includes('?') ? '&' : '?'
    window.location.assign(`${link}${sep}client_reference_id=${encodeURIComponent(id)}`)
    return true
  }
  window.location.assign(link)
  return true
}

export function checkPaymentSuccess() {
  const params = new URLSearchParams(window.location.search)
  return params.get('payment_success') === 'true'
}
