import { Link } from 'react-router-dom'

/** Політика конфіденційності (українською; базовий текст для Stripe / MVP). */
export default function Privacy() {
  return (
    <div className="fade-in px-4 py-6 pb-24 text-gray-800">
      <Link
        to="/"
        className="mb-4 inline-block text-sm font-medium text-primary"
      >
        ← На головну
      </Link>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Політика конфіденційності</h1>
      <p className="mb-6 text-xs text-gray-500">Оновлено: 7 травня 2026</p>

      <div className="space-y-4 text-sm leading-relaxed">
        <p>
          MójInspektor («ми», «застосунок») поважає ваші дані. Цей документ пояснює, що ми збираємо
          і навіщо, у межах мобільного веб-застосунку для підготовки до співбесіди.
        </p>

        <h2 className="pt-2 text-base font-bold text-gray-900">Які дані</h2>
        <ul className="list-inside list-disc space-y-1 text-gray-700">
          <li>
            <strong>Контакт і верифікація:</strong> номер телефону, якщо ви проходите SMS-верифікацію
            через Firebase — для захисту доступу та зв’язку з акаунтом.
          </li>
          <li>
            <strong>Технічні дані:</strong> налаштування застосунку, прогрес навчання та (за потреби)
            ідентифікатор користувача Firebase для синхронізації статусу Premium.
          </li>
          <li>
            <strong>Оплата:</strong> платіж обробляється <strong>Stripe</strong>; ми не зберігаємо повні дані банківської
            картки на наших серверах. До нас може потрапляти підтвердження транзакції та метадані сесії.
          </li>
          <li>
            <strong>Штучний інтелект:</strong> тексти запитів до AI (інспектор, перевірка письма B1)
            передаються через захищений серверний проксі до постачальника моделі (Anthropic) згідно з їхньою політикою.
          </li>
        </ul>

        <h2 className="pt-2 text-base font-bold text-gray-900">Як використовуємо</h2>
        <p>
          Надання функцій застосунку, активація Premium після оплати, покращення стабільності та безпеки.
          Ми не продаємо ваші персональні дані третім сторонам для маркетингу.
        </p>

        <h2 className="pt-2 text-base font-bold text-gray-900">Firebase та Stripe</h2>
        <p>
          Автентифікація й частина облікових записів можуть оброблятися{' '}
          <strong>Google Firebase</strong>.
          Платежі — <strong>Stripe Inc.</strong> Ознайомтесь також із політиками цих сервісів на їхніх сайтах.
        </p>

        <h2 className="pt-2 text-base font-bold text-gray-900">Зв’язок</h2>
        <p>
          Питання щодо даних: напишіть на{' '}
          <a href="mailto:support@mojinspektor.pl" className="text-primary underline">
            support@mojinspektor.pl
          </a>
          .
        </p>
      </div>
    </div>
  )
}
