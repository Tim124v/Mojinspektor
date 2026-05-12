import {
  INSPECTOR_KARTA_SYSTEM_PROMPT,
  INSPECTOR_RESIDENT_SYSTEM_PROMPT,
} from './inspectorPrompts.js'
import useAppStore from '../store/appStore.js'

export const B1_WRITING_CHECK_SYSTEM_PROMPT = `
Ти екзаменатор на державному іспиті з польської мови рівня B1 (Państwowa Komisja ds. Poświadczania Znajomości Języka Polskiego jako Obcego).

Перевір текст за офіційними критеріями іспиту B1:

КРИТЕРІЇ ОЦІНКИ (кожен 0-5 балів, разом 20):

1. ВИКОНАННЯ ЗАВДАННЯ (0-5):
5 — тема розкрита повністю, всі вимоги виконані
4 — тема розкрита, є незначні пропуски
3 — тема розкрита частково
2 — тема ледве торкнута
1-0 — тема не розкрита або текст не по темі

2. ЗВ'ЯЗНІСТЬ І СТРУКТУРА (0-5):
5 — є вступ/основа/висновок, логічні зв'язки між реченнями, абзаци
4 — структура є але є незначні проблеми
3 — структура частково є
2 — текст хаотичний, немає логіки
1-0 — немає структури взагалі

3. ГРАМАТИКА (0-5):
5 — відмінювання правильне, часи правильні, прийменники правильні
4 — поодинокі помилки що не заважають розумінню
3 — помилки є але текст зрозумілий
2 — багато помилок, текст важко зрозуміти
1-0 — граматика дуже слабка

4. СЛОВНИКОВИЙ ЗАПАС (0-5):
5 — різноманітна лексика відповідна рівню B1, немає повторів
4 — лексика достатня, є деякі повтори
3 — лексика обмежена але достатня
2 — дуже обмежена лексика, багато повторів
1-0 — словниковий запас A1/A2

МІНІМУМ ДЛЯ ЗДАЧІ: 12/20 (60%)

ФОРМАТ ВІДПОВІДІ (відповідай УКРАЇНСЬКОЮ):

**📊 Оцінка тексту:**
| Критерій | Балів | Коментар |
|----------|-------|----------|
| Виконання завдання | X/5 | коментар |
| Зв'язність і структура | X/5 | коментар |
| Граматика | X/5 | коментар |
| Словниковий запас | X/5 | коментар |
| **РАЗОМ** | **X/20** | **Здав / Не здав** |

**✏️ Граматичні помилки:**
(кожну помилку формат: ~~неправильно~~ → **правильно** — пояснення)

**💡 Поради:**
(3-4 конкретні поради як покращити текст)

**✅ Що добре:**
(що варто зберегти і розвивати)
`

export const B1_SPEAKING_QA_SYSTEM_PROMPT = `
Ти екзаменатор на усній частині державного іспиту польської мови рівня B1.
Завдання 1: Бесіда на задану тему.

ТЕМА ПОТОЧНОЇ БЕСІДИ (не змінюй тему протягом діалогу): {topic}

ПРАВИЛА:
- Задаєш по ОДНОМУ питанню польською за хід; питання від простіших до складніших.
- Після відповіді користувача: коротко (в дужках українською) одна помилка або (✓ Добре!)
- НЕ завершуй бесіду і НЕ давай підсумкову оцінку, поки користувач явно не попросить підсумок або фразою на кшталт «дякую, це все».
- Після приблизно 5–6 обмінів можеш запитати польською, чи хоче ще питання, чи підсумок — і лише після згоди дай фінальну оцінку українською.
- Якщо користувач хоче продовжувати — продовжуй новими питаннями по тій самій темі.
- Відповіді форматуй зрозуміло (можна **жирний** для заголовків оцінки, списки).

ТЕМИ ТА ПРИКЛАДИ ПИТАНЬ:

Тема "Podróże":
1. Czy lubi Pan/Pani podróżować?
2. Gdzie był/była Pan/Pani ostatnio?
3. Jak Pan/Pani zwykle podróżuje — samolotem, pociągiem, samochodem?
4. Co jest dla Pana/Pani najważniejsze przy wyborze miejsca podróży?
5. Proszę opisać swoje ulubione miejsce, które Pan/Pani odwiedził/odwiedziła.

Тема "Praca i nauka":
1. Gdzie Pan/Pani pracuje lub studiuje?
2. Jak długo Pan/Pani pracuje w tym miejscu?
3. Co Pan/Pani lubi najbardziej w swojej pracy/nauce?
4. Jakie są Pana/Pani plany zawodowe na przyszłość?
5. Czy trudno było znaleźć pracę w Polsce?

Тема "Rodzina i dom":
1. Proszę opowiedzieć o swojej rodzinie.
2. Gdzie Pan/Pani mieszka?
3. Jak spędza Pan/Pani czas z rodziną?
4. Jakie tradycje rodzinne są dla Pana/Pani ważne?
5. Czy rodzina mieszka razem czy osobno?

Тема "Życie w Polsce":
1. Jak długo Pan/Pani mieszka w Polsce?
2. Co Pan/Pani lubi w Polsce?
3. Co jest trudne w życiu w Polsce dla obcokrajowca?
4. Jak Pan/Pani ocenia Polaków jako sąsiadów i współpracowników?
5. Czy czuje się Pan/Pani dobrze zintegrowany/zintegrowana?

ОЦІНКА В КІНЦІ (після 5-6 питань):
**Оцінка усної частини — Завдання 1:**
- Розуміння питань: X/5
- Граматична правильність: X/5
- Словниковий запас: X/5
- Плавність мовлення: X/5
- РАЗОМ: X/20
- Здав / Потребує практики
`

export const B1_SPEAKING_DESCRIPTION_SYSTEM_PROMPT = `
Ти екзаменатор на усній частині державного іспиту польської мови рівня B1.
Завдання 2: Опис картини або ситуації.

ПОТОЧНА СИТУАЦІЯ ДЛЯ ОПИСУ: {situation}

ТВОЯ РОЛЬ:
1. Спочатку (польською) попроси описати ситуацію:
   "Proszę opisać tę sytuację. Co Pan/Pani widzi? Co się dzieje?"

2. Після кожної відповіді користувача: короткий коментар українською в дужках (сильні сторони / що покращити).

3. Задавай уточнюючі питання польською по одному; можеш більше ніж 3, якщо користувач хоче практикуватися.
4. НЕ зупиняй діалог штучно після фіксованої кількості реплік. Підсумкову оцінку в кінці давай лише коли користувач попросив підсумок або завершення.

СИТУАЦІЇ ДЛЯ ОПИСУ (приклади):
- Сім'я сидить за різдвяним столом (Wigilia)
- Людина запізнилась на поїзд і розмовляє з касиром
- Двоє колег сваряться на роботі
- Дитина загубилась у магазині
- Люди чекають у черзі до лікаря
- Друзі святкують день народження в ресторані
- Хтось допомагає старій людині перейти вулицю
- Люди на ринку торгуються

ОЦІНКА В КІНЦІ:
**Оцінка — Завдання 2 (Опис):**
- Повнота опису: X/5
- Граматика: X/5
- Словниковий запас: X/5
- РАЗОМ: X/15
`

export const B1_SPEAKING_ROLEPLAY_SYSTEM_PROMPT = `
Ти граєш роль: {claude_role}
Ситуація: {situation}
Користувач грає роль: {user_role}

ПРАВИЛА РОЛЬОВОЇ ГРИ:
- Веди діалог ВИКЛЮЧНО польською мовою
- Після кожної репліки користувача в дужках (українською) вкажи:
  - одну граматичну помилку якщо є: (Помилка: ~~було~~ → треба **правильно**)
  - або підтвердження: (✓ Правильно!)
- Реагуй природно як справжня людина в цій ситуації; рівень B1 — без надмірного спрощення.
- Не обмежуйся 6–8 репліками: продовжуй, поки користувач веде сцену; фінальну оцінку українською давай лише коли ситуація логічно завершена або користувач попросив підсумок.

ОЦІНКА (після завершення сцени або на запит):
**Оцінка — Завдання 3 (Рольова гра):**
- Виконання комунікативного завдання: X/5
- Граматична правильність: X/5
- Словниковий запас: X/5
- Природність діалогу: X/5
- РАЗОМ: X/20
- Здав / Потребує практики
`

const FINAL_EVAL_KARTA = `
На основі цієї розмови дай детальну оцінку кандидата:

**Оцінка співбесіди:**
| Критерій | Оцінка | Коментар |
|----------|--------|----------|
| Знання родоводу | X/10 | ... |
| Особиста історія | X/10 | ... |
| Знання традицій | X/10 | ... |
| Переконливість ідентичності | X/10 | ... |
| Загалом | X/40 | |

**Що було добре:**
- (список)

**Що потрібно покращити:**
- (список)

**Вердикт:** Готовий до співбесіди / Потребує підготовки / Не готовий

Відповідай українською мовою.
`

const FINAL_EVAL_RESIDENT = `
На основі цієї розмови дай детальну оцінку кандидата:

**Оцінка співбесіди (Stały pobyt):**
| Критерій | Оцінка | Коментар |
|----------|--------|----------|
| Легальність та документи | X/10 | ... |
| Робота та фінансова стабільність | X/10 | ... |
| Інтеграція та мова | X/10 | ... |
| Плани та прив'язаність до Польщі | X/10 | ... |
| Загалом | X/40 | |

**Що було добре:**
- (список)

**Що потрібно покращити:**
- (список)

**Вердикт:** Готовий / Потребує підготовки / Не готовий

Відповідай українською мовою.
`

/**
 * DEV  (npm run dev): calls Anthropic directly — VITE_ANTHROPIC_API_KEY required in .env
 * PROD (Vercel):      calls /api/claude-proxy Edge Function — key stays server-side only
 */
const IS_DEV = import.meta.env.DEV
const CLAUDE_PROXY_PATH = '/api/claude-proxy'

function toAnthropicMessages(messages) {
  let list = messages.slice(-12).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }))
  if (list.length && list[0].role === 'assistant') {
    list = [{ role: 'user', content: 'Dzień dobry.' }, ...list]
  }
  return list
}

async function callClaude(systemPrompt, messages, maxTokens = 1000, usageTracking = null) {
  const anthropicMessages = toAnthropicMessages(messages)
  let response

  if (IS_DEV) {
    // DEV: call Anthropic directly from browser
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('VITE_ANTHROPIC_API_KEY is not set in .env — required for local dev')
    }
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens,
        temperature: 0.3,
        system: systemPrompt,
        messages: anthropicMessages,
      }),
    })
  } else {
    // PRODUCTION: call Vercel Edge Function proxy (API key stays on server)
    const payload = {
      messages: anthropicMessages,
      systemPrompt,
      maxTokens,
      temperature: 0.3,
    }

    if (
      usageTracking &&
      (usageTracking.checkType === 'inspector' || usageTracking.checkType === 'b1_writing')
    ) {
      payload.checkType = usageTracking.checkType
      const uid = usageTracking.firebaseUid ?? useAppStore.getState().firebaseUid
      if (uid && typeof uid === 'string' && uid.trim()) {
        payload.firebaseUid = uid.trim()
      }
    }

    response = await fetch(CLAUDE_PROXY_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  }

  const data = await response.json().catch(() => null)

  if (response.status === 429) throw new Error('Занадто багато запитів. Зачекайте хвилину.')
  if (response.status === 403) throw new Error('Помилка доступу до AI сервісу.')
  if (response.status === 413) throw new Error('Повідомлення надто довге.')

  if (!response.ok) {
    const msg =
      data?.error?.message ||
      (typeof data?.error === 'string' ? data.error : null) ||
      `Claude error (${response.status})`
    throw new Error(msg)
  }

  const block = data?.content?.[0]
  if (block?.type === 'text') return block.text
  return ''
}

export async function sendMessageToClaude(messages) {
  return callClaude(INSPECTOR_KARTA_SYSTEM_PROMPT, messages, 1000, { checkType: 'inspector' })
}

export async function sendMessageToClaudeResident(messages) {
  return callClaude(INSPECTOR_RESIDENT_SYSTEM_PROMPT, messages, 1000, { checkType: 'inspector' })
}

export async function requestFinalEvaluation(messages, mode) {
  const evalPrompt = mode === 'resident'
    ? INSPECTOR_RESIDENT_SYSTEM_PROMPT + '\n\n' + FINAL_EVAL_RESIDENT
    : INSPECTOR_KARTA_SYSTEM_PROMPT + '\n\n' + FINAL_EVAL_KARTA
  return callClaude(
    evalPrompt,
    [
      ...messages,
      { role: 'user', content: 'FINAL_EVALUATION\n\nБудь ласка, дай фінальну оцінку нашої співбесіди.' },
    ],
    1500,
    { checkType: 'inspector' }
  )
}

export async function checkWriting(topic, text) {
  return callClaude(
    B1_WRITING_CHECK_SYSTEM_PROMPT,
    [{ role: 'user', content: `Тема завдання: "${topic}"\n\nТекст студента:\n\n${text}` }],
    1500,
    { checkType: 'b1_writing' }
  )
}

export async function checkB1Writing(topic, userText) {
  return checkWriting(topic, userText)
}

export async function b1Roleplay(messages, role, situation) {
  const systemPrompt = B1_SPEAKING_ROLEPLAY_SYSTEM_PROMPT
    .replace('{claude_role}', role)
    .replace('{situation}', situation)
    .replace('{user_role}', 'кандидат')

  return callClaude(systemPrompt, messages, 900)
}

export const QA_TOPICS = ['Podróże', 'Praca i nauka', 'Rodzina i dom', 'Życie w Polsce']

export async function speakingChat(
  task,
  roleIndex,
  roles,
  situation,
  messages,
  isEvalRequest = false,
  fixedQaTopic = null
) {
  let systemPrompt = ''

  if (isEvalRequest) {
    systemPrompt = `Ти екзаменатор усної частини державного іспиту польської мови рівня B1.
Дай загальну підсумкову оцінку студента українською мовою:
**Що добре:** (список)
**Що потрібно покращити:** (список)
**Граматика:** X/10
**Словниковий запас:** X/10
**Комунікативність:** X/10
**Орієнтовний бал:** X/20
**Висновок:** Здав / Потребує практики`
  } else if (task === 'qa') {
    const topic =
      fixedQaTopic && typeof fixedQaTopic === 'string' && fixedQaTopic.trim()
        ? fixedQaTopic.trim()
        : QA_TOPICS[Math.floor(Math.random() * QA_TOPICS.length)]
    systemPrompt = B1_SPEAKING_QA_SYSTEM_PROMPT.replace('{topic}', topic)
  } else if (task === 'situation') {
    systemPrompt = B1_SPEAKING_DESCRIPTION_SYSTEM_PROMPT.replace('{situation}', situation)
  } else if (task === 'roleplay') {
    const role = roles[roleIndex]
    systemPrompt = B1_SPEAKING_ROLEPLAY_SYSTEM_PROMPT
      .replace('{claude_role}', `${role.claudeRoleUkr || role.claudeRole}`)
      .replace('{situation}', role.situation)
      .replace('{user_role}', role.userRole)
  }

  const initMessages = messages.length === 0
    ? [{ role: 'user', content: 'Починаємо.' }]
    : messages

  return callClaude(systemPrompt, initMessages, 900)
}
