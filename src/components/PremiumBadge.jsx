import { useIsPremium } from '../hooks/useIsPremium'

export default function PremiumBadge() {
  const isPremium = useIsPremium()
  if (!isPremium) return null

  return (
    <span className="rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
      ⭐ Premium
    </span>
  )
}
