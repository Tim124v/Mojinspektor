# MójInspektor 🦅

> PWA app for preparing for interviews for the **Karta Polaka**, **permanent residence (Stały pobyt)**, and the Polish language **B1** state exam

[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev)
[![PWA](https://img.shields.io/badge/PWA-ready-green)](https://web.dev/pwa)
[![Claude AI](https://img.shields.io/badge/AI-Claude-orange)](https://anthropic.com)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-yellow)](https://firebase.google.com)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-blueviolet)](https://stripe.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-99%2F100-brightgreen)](#)

## 🔗 Demo

**[mojinspektor.pl](https://www.mojinspektor.pl)**

---

## 📖 Project story

The app was built by someone who personally went through the Karta Polaka and permanent residence interviews.
While preparing, all useful information was scattered across different sources — there was no tool
that showed what a real interview looks like from the inside.

At first, the app was created for the author’s brothers to help them prepare.
It then grew into a full product for everyone on this path.

**Real results:** the author’s wife scored 99.7/100 on the B1 exam.
The author received a positive decision on permanent residence (Karta stałego pobytu).

---

## 📱 About the app

MójInspektor is the only AI trainer that simulates a real interview with an inspector.
The inspector builds a family tree generation by generation — just like on the actual exam.

### Who it’s for
- Ukrainians and Belarusians preparing for the **Karta Polaka**
- People applying for **permanent residence** (zezwolenie na pobyt stały)
- Anyone taking the Polish **B1** state exam

---

## ✨ Features

### 🃏 Flashcards
- 500+ questions across 9 topics from real interviews
- Bilingual mode: questions in Ukrainian or Polish
- Progress tracking per topic
- Streaks and correct-answer statistics

### 👨‍💼 AI inspector
- Full simulation of a real inspector interview
- Two modes: **Karta Polaka** and **Stały pobyt**
- The inspector speaks only Polish — like on the real exam
- Builds a family tree by generation (name, birthplace, occupation, death)
- Phases: introduction → family tree → language → culture → history → protocol
- Violation system: 3 warnings → interview ends
- Final score on 4 criteria in protocol format
- 90-minute timer for Premium (like the real exam)

### 🎓 B1 mock exam
- Full simulation of the state exam with 5 parts
- Real data from official 2025 exam PDFs (February, April, June)
- Official MP3 audio for listening comprehension
- Separate timer for each part
- AI grading of writing tasks with detailed feedback
- Microphone for the speaking section (Web Speech API)
- Score calculation and pass/fail verdict

### 📚 B1 practice by section
- Listening, reading, grammar, writing, speaking — separately
- AI writing review on 4 criteria with scores
- Role-play for speaking (doctor, landlord, bank)
- Real texts and tasks from official exams

### 💳 Freemium monetization
- Free: first cards in each topic, 2 inspector simulations, 1 part of the mock exam
- Premium: **49.99 PLN/month** — full access, cancel anytime
- Stripe Checkout with cards and Klarna
- Stripe Customer Portal for subscription management

---

## 🛠 Tech stack

### Frontend
- **React 18** — UI components, hooks, lazy loading
- **Vite 5** — build, code splitting, tree shaking
- **TailwindCSS** — mobile-first design
- **React Router v6** — SPA navigation
- **Zustand** — global state persisted in localStorage
- **PWA** — Service Worker, install to home screen

### Backend (Vercel Serverless Functions)
- **`/api/claude-proxy`** — Anthropic API proxy, rate limiting via Firestore
- **`/api/stripe-webhook`** — payment handling, Premium activation
- **`/api/verify-payment`** — payment session verification, replay-attack protection
- **`/api/check-access`** — Premium status check via Firebase
- **`/api/stripe-portal`** — Stripe Customer Portal for subscription management

### Services
- **Anthropic Claude** — AI inspector, writing review, speaking section
- **Firebase Auth** — email/password authentication
- **Firebase Firestore** — user progress, analytics, rate limiting
- **Stripe** — subscriptions, webhooks, Customer Portal
- **Vercel** — deploy, Edge Network, environment variables

---

## 🔐 Security

- API keys only on the server — never exposed to the client
- CORS Origin checks on all API endpoints
- Rate limiting via Firestore — survives Vercel cold starts
- Stripe webhook `stripe-signature` verification — tamper protection
- Replay-attack protection for payments — sessionId in Firestore
- Firestore Rules — users can only read their own data
- CSP headers, X-Frame-Options: DENY, X-Content-Type-Options

---

## 📊 Analytics

Custom analytics via Firestore — no third-party trackers:
- `view_paywall` — paywall page view
- `begin_checkout` — checkout started
- `purchase` — successful payment
- `start_inspector` — simulation started
- `complete_mock_exam` — mock exam completed

---

## ⚡ Performance

| Metric | Result |
|---|---|
| Lighthouse Performance (desktop) | **99/100** |
| Lighthouse Performance (mobile) | **82/100** |
| Lighthouse SEO | **100/100** |
| Lighthouse Accessibility | **88/100** |

Optimizations: lazy-loaded pages, code splitting by vendor and data files,
deferred loading of heavy JS modules, prefetch of upcoming routes.

---

## 🗂 Project structure

## 🚀 Getting started

```bash
npm install
npm run dev
npm run build
```

### Environment variables (.env)

```env
# Anthropic
ANTHROPIC_API_KEY=

# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
FIREBASE_PROJECT_ID=
FIREBASE_SERVICE_ACCOUNT_KEY=

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Vercel
ALLOWED_ORIGIN=https://www.mojinspektor.pl
VERCEL_ENV=production
```

---

## 📈 SEO

- Meta tags (title, description, keywords, og:*)
- Canonical URL
- sitemap.xml registered in Google Search Console
- /about landing page optimized for search queries

---

## 📝 License

This is a commercial product. Code is published for portfolio purposes only.
Use of the code or content without the author’s permission is prohibited.

---

*Built by someone who personally went through the Karta Polaka and permanent residence interviews —
and knows what the inspector actually asks.*
