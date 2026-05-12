import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAppStore from '../store/appStore'
import { FREEMIUM } from '../config/freemium'
import { redirectToCheckout } from '../services/stripe'
import { useIsPremium } from '../hooks/useIsPremium'
import AuthModal from '../components/AuthModal.jsx'
import { getCurrentUser, onAuthChange } from '../services/firebase.js'

export default function Upgrade() {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const [paymentVerifyError, setPaymentVerifyError] = useState('')
  const [paymentVerifying, setPaymentVerifying] = useState(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).get('payment_success') === 'true'
  })
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const finalizePremiumAfterStripe = useAppStore((s) => s.finalizePremiumAfterStripe)
  const isPremium = useIsPremium()

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      if (user && !user.isAnonymous) {
        setIsLoggedIn(true)
        setUserEmail(user.email || '')
        useAppStore.getState().setFirebaseUid(user.uid)
      } else {
        setIsLoggedIn(false)
        setUserEmail('')
      }
    })
    return unsub
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment_success') !== 'true') return

    const sessionId = params.get('session_id')
    const clearParams = () => {
      window.history.replaceState({}, '', window.location.pathname)
    }

    if (!sessionId?.trim()) {
      clearParams()
      setPaymentVerifyError('Оплата не підтверджена. Зверніться до підтримки.')
      setPaymentVerifying(false)
      return
    }

    let cancelled = false
    ;(async () => {
      setPaymentVerifying(true)
      setPaymentVerifyError('')
      try {
        const res = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionId.trim() }),
        })
        const data = await res.json().catch(() => ({}))
        if (cancelled) return
        clearParams()
        if (data.verified === true) {
          await finalizePremiumAfterStripe()
          if (!cancelled) setDone(true)
        } else {
          setPaymentVerifyError('Оплата не підтверджена. Зверніться до підтримки.')
        }
      } catch {
        if (cancelled) return
        clearParams()
        setPaymentVerifyError('Оплата не підтверджена. Зверніться до підтримки.')
      } finally {
        if (!cancelled) setPaymentVerifying(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [finalizePremiumAfterStripe])

  const handlePurchase = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true)
      return
    }
    setIsProcessing(true)
    try {
      const uid = getCurrentUser()?.uid
      const ok = redirectToCheckout(uid)
      if (!ok) setIsProcessing(false)
    } catch {
      setIsProcessing(false)
      alert('Помилка при переході до оплати. Спробуйте ще раз.')
    }
  }

  const handleAuthSuccess = (uid) => {
    setShowAuthModal(false)
    useAppStore.getState().setFirebaseUid(uid)
    setIsProcessing(true)
    try {
      const ok = redirectToCheckout(uid)
      if (!ok) setIsProcessing(false)
    } catch {
      setIsProcessing(false)
      alert('Помилка при переході до оплати. Спробуйте ще раз.')
    }
  }

  if (paymentVerifying) {
    return (
      <div className="mx-auto max-w-mobile px-5 py-16 text-center text-gray-600">
        Перевірка оплати…
      </div>
    )
  }

  if (done) {
    return (
      <div className="mx-auto max-w-mobile px-5 py-10 text-center">
        <p className="mb-4 text-xl font-semibold text-gray-900">✅ Premium активовано!</p>
        <div className="mb-5 text-6xl">🎉</div>
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">Вітаємо — у вас Premium</h2>
        <p className="text-sm text-gray-600">
          Повний доступ активовано. Тепер у вас є доступ до всіх питань, необмежених симуляцій і повної підготовки до B1.
        </p>
      </div>
    )
  }

  if (isPremium) {
    return (
      <div className="mx-auto max-w-mobile px-5 py-10 text-center">
        <div className="mb-4 text-5xl">⭐</div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">У вас вже є Premium</h2>
        <p className="mb-6 text-sm text-gray-600">Повний доступ активовано. Насолоджуйтесь підготовкою!</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white"
        >
          На головну
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-mobile pb-24">
      {paymentVerifyError ? (
        <div className="px-5 pt-4">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {paymentVerifyError}
          </div>
        </div>
      ) : null}

      <div className="relative bg-primary px-6 pb-8 pt-10 text-center text-white">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 rounded-lg bg-white/20 px-3 py-1.5 text-sm"
        >
          ← Назад
        </button>
        <div className="mb-3 text-5xl">⭐</div>
        <h1 className="mb-2 text-2xl font-bold">MójInspektor Premium</h1>
        <p className="text-sm text-white/90">Повна підготовка до Карти поляка, Сталого побуту і держіспиту B1</p>
      </div>

      <div className="px-5 py-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Що включено</p>
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4">
          {[
            '500+ питань по всіх темах',
            'Необмежені симуляції інспектора',
            'AI-перевірка письма B1',
            'Усна частина B1 та ролеві ігри',
            'Розділ Державний устрій і Географія',
          ].map((item) => (
            <div key={item} className="py-2 text-sm text-gray-700">
              ✓ {item}
            </div>
          ))}
        </div>

        <div className="mb-5 text-center">
          <div className="text-4xl font-bold text-primary">{FREEMIUM.PRICE_PLN} zł</div>
          <p className="text-sm text-gray-600">Одноразова оплата · Назавжди · Без підписки</p>
          <p className="mt-1 text-xs text-gray-400">≈ {FREEMIUM.PRICE_USD}$</p>
        </div>

        {isLoggedIn ? (
          <p className="mb-2 text-center text-xs text-gray-500">✓ Акаунт: {userEmail}</p>
        ) : null}

        <button
          type="button"
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full rounded-xl bg-primary py-4 text-sm font-bold text-white disabled:opacity-60"
        >
          {isProcessing ? 'Перехід до оплати…' : `Отримати Premium — ${FREEMIUM.PRICE_PLN} zł`}
        </button>
        <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
          Продовжуючи оплату, ви погоджуєтесь із{' '}
          <Link to="/terms" className="font-medium text-primary underline">
            умовами використання
          </Link>{' '}
          та{' '}
          <Link to="/privacy" className="font-medium text-primary underline">
            політикою конфіденційності
          </Link>
          .
        </p>
      </div>

      {showAuthModal ? (
        <AuthModal
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      ) : null}
    </div>
  )
}
