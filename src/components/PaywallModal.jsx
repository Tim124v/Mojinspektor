import { useNavigate } from 'react-router-dom'
import { FREEMIUM } from '../config/freemium'

export default function PaywallModal({ isOpen, onClose, reason }) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const reasons = {
    inspector: {
      icon: '👨‍💼',
      title: 'Ліміт симуляцій вичерпано',
      desc: `Безкоштовна версія включає ${FREEMIUM.FREE_INSPECTOR_LIMIT} симуляції співбесіди з інспектором.`,
    },
    b1_writing: {
      icon: '✍️',
      title: 'Ліміт перевірок вичерпано',
      desc: `Безкоштовна версія включає ${FREEMIUM.FREE_B1_CHECKS} перевірки письма з AI.`,
    },
    cards_full: {
      icon: '📚',
      title: 'Повна база питань',
      desc: 'У безкоштовній версії доступно 20 питань з кожної теми.',
    },
    default: {
      icon: '⭐',
      title: 'Premium функція',
      desc: 'Ця функція доступна тільки в Premium версії.',
    },
  }

  const content = reasons[reason] || reasons.default

  const handleGoToUpgrade = () => {
    onClose()
    navigate('/upgrade')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6">
        <div className="mb-5 text-center">
          <div className="mb-2 text-4xl">{content.icon}</div>
          <p className="mb-2 text-lg font-semibold text-gray-900">{content.title}</p>
          <p className="text-sm text-gray-500">{content.desc}</p>
        </div>

        <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Повний доступ включає</p>
          {[
            '500+ питань з усіх тем',
            'Необмежені симуляції інспектора',
            'AI-перевірка письма B1',
            'Усна частина та ролеві ігри B1',
          ].map((item) => (
            <div key={item} className="py-1 text-sm text-gray-700">
              ✓ {item}
            </div>
          ))}
        </div>

        <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-4 text-center">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-800">Ціна Premium</p>
          <div className="text-3xl font-bold text-primary">{FREEMIUM.PRICE_PLN} zł</div>
          <p className="mt-1 text-sm text-gray-600">одноразово · назавжди · без підписки</p>
          <p className="mt-1 text-xs text-gray-500">≈ {FREEMIUM.PRICE_USD} USD</p>
        </div>

        <button
          type="button"
          onClick={handleGoToUpgrade}
          className="mb-2 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white"
        >
          {`Отримати повний доступ — ${FREEMIUM.PRICE_PLN} zł`}
        </button>
        <button type="button" onClick={onClose} className="w-full rounded-xl py-2 text-sm text-gray-500">
          Залишитися в безкоштовній версії
        </button>
      </div>
    </div>
  )
}
