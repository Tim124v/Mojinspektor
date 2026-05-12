import { useState } from 'react'
import { registerWithEmail, loginWithEmail } from '../services/firebase'

export default function AuthModal({ onSuccess, onClose }) {
  const [tab, setTab] = useState('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Заповніть всі поля.')
      return
    }
    setLoading(true)
    setError('')
    const fn = tab === 'register' ? registerWithEmail : loginWithEmail
    const result = await fn(email.trim(), password)
    setLoading(false)
    if (result.success) {
      onSuccess(result.uid)
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-xl text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="mb-1 text-lg font-bold text-gray-800">
          {tab === 'register' ? 'Створіть акаунт' : 'Увійдіть'}
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          {tab === 'register'
            ? 'Щоб Premium не зникав після очищення браузера'
            : 'Відновіть доступ до вашого Premium'}
        </p>

        <div className="mb-4 flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => {
              setTab('register')
              setError('')
            }}
            className={`flex-1 pb-2 text-sm font-medium transition-colors ${
              tab === 'register'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-400'
            }`}
          >
            Реєстрація
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('login')
              setError('')
            }}
            className={`flex-1 pb-2 text-sm font-medium transition-colors ${
              tab === 'login'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-400'
            }`}
          >
            Увійти
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-red-400 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Пароль (мінімум 6 символів)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-red-400 focus:outline-none"
          />
        </div>

        {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:bg-red-300"
        >
          {loading
            ? 'Зачекайте...'
            : tab === 'register'
              ? 'Зареєструватись та продовжити'
              : 'Увійти та продовжити'}
        </button>

        <p className="mt-3 text-center text-xs text-gray-400">
          {tab === 'register' ? (
            <>
              Вже є акаунт?{' '}
              <button
                type="button"
                onClick={() => {
                  setTab('login')
                  setError('')
                }}
                className="text-red-500 underline"
              >
                Увійти
              </button>
            </>
          ) : (
            <>
              Немає акаунту?{' '}
              <button
                type="button"
                onClick={() => {
                  setTab('register')
                  setError('')
                }}
                className="text-red-500 underline"
              >
                Зареєструватись
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
