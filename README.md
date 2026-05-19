# MójInspektor 🦅

> PWA-застосунок для підготовки до співбесіди на **Карту поляка**, **Сталий побут** та державного іспиту з польської мови **B1**

[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev)
[![PWA](https://img.shields.io/badge/PWA-ready-green)](https://web.dev/pwa)
[![Claude AI](https://img.shields.io/badge/AI-Claude-orange)](https://anthropic.com)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-yellow)](https://firebase.google.com)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-blueviolet)](https://stripe.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-99%2F100-brightgreen)](#)

## 🔗 Демо

**[mojinspektor.pl](https://www.mojinspektor.pl)**

---

## 📖 Історія проекту

Застосунок створено людиною яка особисто пройшла співбесіду на Карту поляка та Сталий побут.
Під час підготовки вся корисна інформація була розкидана по різних джерелах — жодного інструменту
який показував би як виглядає реальна співбесіда зсередини.

Спочатку застосунок створювався для власних братів щоб допомогти їм підготуватися.
Потім перетворився на повноцінний продукт для всіх хто проходить цей шлях.

**Реальні результати:** дружина автора склала B1 на 99.7/100 балів.
Автор отримав позитивне рішення по Карті сталого побуту.

---

## 📱 Про застосунок

MójInspektor — єдиний AI-тренажер який симулює реальну співбесіду з інспектором.
Інспектор будує родовід по ланцюжку поколінь — саме так як це відбувається на справжньому екзамені.

### Для кого
- Українці та білоруси які готуються до **Карти поляка**
- Люди які оформляють **Сталий побут** (zezwolenie na pobyt stały)
- Всі хто складає держіспит з польської мови **B1**

---

## ✨ Функціонал

### 🃏 Флешкартки
- 500+ питань по 9 темах з реальних співбесід
- Двомовний режим: питання українською або польською
- Відстеження прогресу по кожній темі окремо
- Стріки та статистика правильних відповідей

### 👨‍💼 AI-інспектор
- Повна симуляція реальної співбесіди з інспектором
- Два режими: **Karta Polaka** та **Stały pobyt**
- Інспектор веде розмову лише польською — як на справжньому екзамені
- Будує родовід по ланцюжку поколінь (ім'я, місце народження, робота, смерть)
- Фази: знайомство → родовід → мова → культура → історія → протокол
- Система порушень: 3 попередження → завершення співбесіди
- Фінальна оцінка по 4 критеріях у форматі протоколу
- Таймер 90 хвилин для Premium (як на реальному екзамені)

### 🎓 Пробний іспит B1
- Повна симуляція державного іспиту з 5 частин
- Реальні дані з офіційних PDF іспитів 2025 року (лютий, квітень, червень)
- Офіційні MP3 аудіозаписи для розуміння на слух
- Таймер для кожної частини окремо
- AI-перевірка письмових завдань з детальною оцінкою
- Мікрофон для усної частини (Web Speech API)
- Підрахунок балів та вердикт: склав / не склав

### 📚 Практика B1 по частинах
- Аудіювання, читання, граматика, письмо, говоріння — окремо
- AI-перевірка письма по 4 критеріях з балами
- Рольові ігри для говоріння (лікар, орендодавець, банк)
- Реальні тексти та завдання з офіційних іспитів

### 💳 Freemium монетизація
- Безкоштовно: перші картки кожної теми, 2 симуляції інспектора, 1 частина пробного іспиту
- Premium: **49.99 zł/місяць** — повний доступ, скасувати будь-коли
- Stripe Checkout з підтримкою карток та Klarna
- Stripe Customer Portal для управління підпискою

---

## 🛠 Технічний стек

### Frontend
- **React 18** — UI компоненти, хуки, lazy loading
- **Vite 5** — збірка, code splitting, tree shaking
- **TailwindCSS** — мобільний дизайн, mobile-first
- **React Router v6** — SPA навігація
- **Zustand** — глобальний стан з персистентністю в localStorage
- **PWA** — Service Worker, встановлення на головний екран

### Backend (Vercel Serverless Functions)
- **`/api/claude-proxy`** — проксі до Anthropic API, rate limiting через Firestore
- **`/api/stripe-webhook`** — обробка платежів, активація Premium
- **`/api/verify-payment`** — верифікація сесії оплати, захист від replay-атак
- **`/api/check-access`** — перевірка Premium статусу через Firebase
- **`/api/stripe-portal`** — Stripe Customer Portal для управління підпискою

### Сервіси
- **Anthropic Claude** — AI-інспектор, перевірка письма, усна частина
- **Firebase Auth** — email/password автентифікація
- **Firebase Firestore** — прогрес користувачів, аналітика, rate limiting
- **Stripe** — підписки, webhooks, Customer Portal
- **Vercel** — деплой, Edge Network, Environment Variables

---

## 🔐 Безпека

- API ключі виключно на сервері — клієнт їх не бачить
- CORS перевірка Origin на всіх API endpoints
- Rate limiting через Firestore — виживає після cold start Vercel
- Stripe webhook підпис `stripe-signature` — захист від підробки
- Replay-attack захист для платежів — sessionId в Firestore
- Firestore Rules — користувач читає тільки свої дані
- CSP заголовки, X-Frame-Options: DENY, X-Content-Type-Options

---

## 📊 Аналітика

Власна система аналітики через Firestore — без сторонніх сервісів:
- `view_paywall` — перегляд сторінки оплати
- `begin_checkout` — початок оплати
- `purchase` — успішна оплата
- `start_inspector` — початок симуляції
- `complete_mock_exam` — завершення пробного іспиту

---

## ⚡ Продуктивність

| Метрика | Результат |
|---|---|
| Lighthouse Performance (desktop) | **99/100** |
| Lighthouse Performance (mobile) | **82/100** |
| Lighthouse SEO | **100/100** |
| Lighthouse Accessibility | **88/100** |

Оптимізації: lazy loading сторінок, code splitting по вендорах і data файлах,
defer завантаження важких JS модулів, prefetch наступних маршрутів.

---

## 🗂 Структура проекту
