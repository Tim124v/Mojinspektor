import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAppStore from '../store/appStore'
import AppLogo from './AppLogo.jsx'
import { onAuthChange, logoutUser } from '../services/firebase.js'

export default function Header() {
  const streak = useAppStore((s) => s.streak)
  const location = useLocation()
  const navigate = useNavigate()
  const showBack = location.pathname !== '/'
  const [accountEmail, setAccountEmail] = useState('')

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      if (user && !user.isAnonymous) {
        setAccountEmail(user.email || '')
      } else {
        setAccountEmail('')
      }
    })
    return unsub
  }, [])

  async function handleAccountClick() {
    if (!window.confirm('Вийти з акаунту?')) return
    const r = await logoutUser()
    if (r.success) {
      useAppStore.setState({ isPremium: false })
    }
  }

  const accountLetter = accountEmail.trim()
    ? accountEmail.trim()[0].toUpperCase()
    : ''

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Назад"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-gray-100">
          <AppLogo size={26} className="scale-110" />
        </div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="min-w-0 truncate text-left text-lg font-bold text-gray-900 hover:opacity-80"
        >
          MójInspektor
        </button>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        {accountLetter ? (
          <button
            type="button"
            title={accountEmail}
            onClick={handleAccountClick}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700 hover:bg-red-200"
            aria-label="Акаунт"
          >
            {accountLetter}
          </button>
        ) : null}
        {streak > 0 ? (
          <div className="flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1">
            <span className="text-base">🔥</span>
            <span className="text-sm font-semibold text-orange-600">{streak} днів</span>
          </div>
        ) : null}
      </div>
    </header>
  )
}
