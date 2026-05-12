import { Link } from 'react-router-dom'
import { FREEMIUM } from '../config/freemium'

/** Умови використання (українською; базовий текст для Stripe / MVP). */
export default function Terms() {
  const price = FREEMIUM.PRICE_PLN
  return (
    <div className="fade-in px-4 py-6 pb-24 text-gray-800">
      <Link
        to="/"
        className="mb-4 inline-block text-sm font-medium text-primary"
      >
        ← На головну
      </Link>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Умови використання</h1>
      <p className="mb-6 text-xs text-gray-500">Оновлено: 7 травня 2026</p>

      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          Ласкаво просимо до MójInspektor. Використовуючи застосунок, ви погоджуєтесь із цими умовами.
        </p>

        <h2 className="pt-2 text-base font-bold text-gray-900">Опис сервісу</h2>
        <p>
          MójInspektor — веб-застосунок для підготовки до співбесіди на Карту поляка, Сталий побут та
          підготовки до іспиту з польської B1: картки з питаннями, симуляції, матеріали та (у Premium)
          розширені функції з AI.
        </p>

        <h2 className="pt-2 text-base font-bold text-gray-900">Оплата та Premium</h2>
        <p>
          Одноразовий платіж <strong>{price} PLN</strong> відкриває пакет Premium на умовах, зазначених у застосунку на
          момент покупки. Оплата здійснюється через <strong>Stripe</strong>; підтвердження електронної пошти може
          бути частиною квитанції від платіжної системи.
        </p>
        <p>
          <strong>Повернення коштів:</strong> цифровий продукт надається одразу після успішної оплати.
          Повернення не передбачається (no refunds), окрім випадків, коли цього вимагає чинне законодавство.
        </p>

        <h2 className="pt-2 text-base font-bold text-gray-900">Заборонено</h2>
        <ul className="list-inside list-disc space-y-1 text-gray-700">
          <li>Обходити технічні обмеження, ламати безпеку або навантажувати сервіси автоматизованими запитами без дозволу.</li>
          <li>Використовувати контент застосунку для комерційного тиражування без згоди правовласників.</li>
          <li>Надавати неправдиві дані при верифікації, що може нашкодити іншим користувачам або сервісу.</li>
        </ul>

        <h2 className="pt-2 text-base font-bold text-gray-900">Обмеження відповідальності</h2>
        <p>
          Застосунок є навчальним інструментом і <strong>не</strong> є юридичною чи державною консультацією.
          Результати симуляцій AI не гарантують результат реальної співбесіди. Ми не несемо відповідальності
          за непрямі збитки, максимум — у межах, дозволених законом.
        </p>

        <h2 className="pt-2 text-base font-bold text-gray-900">Зв’язок</h2>
        <p>
          <a href="mailto:support@mojinspektor.pl" className="text-primary underline">
            support@mojinspektor.pl
          </a>
        </p>
      </div>
    </div>
  )
}
