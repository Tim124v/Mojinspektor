import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

export default function BottomNav() {
  const location = useLocation()
  const { t } = useTranslation()

  const navItems = [
    {
      to: '/',
      label: t.nav_home,
      icon: (active) => (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M3 12L12 4l9 8" stroke={active ? '#DC143C' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 10v9a1 1 0 001 1h4v-4h4v4h4a1 1 0 001-1v-9" stroke={active ? '#DC143C' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      to: '/cards',
      label: t.nav_cards,
      icon: (active) => (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="3" stroke={active ? '#DC143C' : '#9CA3AF'} strokeWidth="2"/>
          <path d="M8 10h8M8 14h5" stroke={active ? '#DC143C' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      to: '/inspector',
      label: t.nav_inspector,
      icon: (active) => (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" stroke={active ? '#DC143C' : '#9CA3AF'} strokeWidth="2"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={active ? '#DC143C' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      to: '/progress',
      label: t.nav_progress,
      icon: (active) => (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M4 18V14M9 18V10M14 18V6M19 18V12" stroke={active ? '#DC143C' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-gray-100 h-16 flex items-center justify-around px-2 z-10">
      {navItems.map(item => {
        const active =
          item.to === '/'
            ? location.pathname === '/'
            : location.pathname === item.to || location.pathname.startsWith(item.to + '/')
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-0.5 min-w-[56px] py-2"
          >
            {item.icon(active)}
            <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </NavLink>
        )
      })}
    </nav>
  )
}
