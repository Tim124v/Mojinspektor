import { useCallback, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import useAppStore from '../store/appStore'
import useExamTimer from '../hooks/useExamTimer'
import { b1Roleplay, speakingChat } from '../services/claude'
import { useTranslation } from '../hooks/useTranslation'

const SPEAKING_TOPICS = [
  'Praca i nauka',
  'Rodzina i dom',
  'Podróże i transport',
  'Zdrowie i sport',
  'Jedzenie i restauracje',
  'Hobby i czas wolny',
  'Miasto i okolica',
  'Zakupy i pieniądze',
  'Pogoda i pory roku',
  'Plany na przyszłość',
  'Tradycje i święta',
  'Technologia i internet',
  'Praca w Polsce',
  'Życie codzienne',
  'Kultura i sztuka',
]

const SITUATIONS = [
  'Na fotografii młoda kobieta stoi przy oknie kawiarni i czyta książkę',
  'Na zdjęciu rodzina siedzi przy stole i świętuje urodziny',
  'Na fotografii mężczyzna stoi na dworcu i patrzy na tablicę odjazdów',
  'Na zdjęciu para rozmawia z lekarzem w gabinecie',
  'Na fotografii dzieci bawią się w parku w słoneczny dzień',
  'Na zdjęciu kobieta rozmawia przez telefon w biurze',
  'Na fotografii turyści stoją przed zabytkowym budynkiem',
  'Na zdjęciu mężczyzna gotuje w kuchni',
  'Na fotografii ludzie czekają w kolejce do kasy w sklepie',
  'Na zdjęciu młoda kobieta uczy się przy laptopie w bibliotece',
  'Na fotografii rodzina pakuje walizki przed podróżą',
  'Na zdjęciu przyjaciele siedzą razem w restauracji',
]

const ROLEPLAY_SCENARIOS_SET1 = [
  { situation: 'Замовлення торта на день народження', role: 'pracownik cukierni' },
  { situation: 'Запис до лікаря на прийом', role: 'recepcjonista w przychodni' },
  { situation: 'Оренда квартири — перший дзвінок', role: 'właściciel mieszkania' },
  { situation: 'Скарга на зіпсований товар у магазині', role: 'kierownik sklepu' },
  { situation: 'Купівля квитка на потяг', role: 'kasjer na dworcu' },
  { situation: 'Розмова з сусідом про шум', role: 'sąsiad' },
  { situation: 'Запит про роботу по телефону', role: 'pracownik działu HR' },
  { situation: 'Відкриття рахунку в банку', role: 'pracownik banku' },
]

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function B1Speaking() {
  const { t } = useTranslation()
  const language = useAppStore((s) => s.language) || 'uk'
  const b1Progress = useAppStore((s) => s.b1Progress)
  const updateB1Progress = useAppStore((s) => s.updateB1Progress)

  const [aiMode, setAiMode] = useState('qa')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [attemptSaved, setAttemptSaved] = useState(false)

  const [sessionQaTopic, setSessionQaTopic] = useState(() => getRandom(SPEAKING_TOPICS))
  const [sessionSituation, setSessionSituation] = useState(() => getRandom(SITUATIONS))
  const [sessionRoleplay, setSessionRoleplay] = useState(() => getRandom(ROLEPLAY_SCENARIOS_SET1))

  const { reset: resetTimer, isExpired, label } = useExamTimer(15)
  const isFirstMount = useRef(true)

  const resetChat = useCallback(() => {
    setMessages([])
    setInput('')
    setError(null)
    setLoading(false)
    setAttemptSaved(false)
    setSessionQaTopic(getRandom(SPEAKING_TOPICS))
    setSessionSituation(getRandom(SITUATIONS))
    setSessionRoleplay(getRandom(ROLEPLAY_SCENARIOS_SET1))
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    resetChat()
  }, [aiMode, resetChat])

  async function sendAi() {
    const text = input.trim()
    if (!text || loading) return
    const userMsg = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)
    setError(null)
    try {
      let reply = ''
      if (aiMode === 'roleplay') {
        const rolePl = sessionRoleplay.role
        const sit =
          language === 'pl'
            ? `Sytuacja (kontekst): ${sessionRoleplay.situation}. Prowadź dialog po polsku jako: ${rolePl}.`
            : `Ситуація: ${sessionRoleplay.situation}. Веди діалог польською як: ${rolePl}.`
        reply = await b1Roleplay(next, rolePl, sit)
      } else if (aiMode === 'situation') {
        reply = await speakingChat('situation', 0, null, sessionSituation, next, false)
      } else {
        reply = await speakingChat('qa', 0, null, null, next, false, sessionQaTopic)
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setError(e?.message || t.b1_error_ai)
    } finally {
      setLoading(false)
    }
  }

  function saveAttempt() {
    const prev = b1Progress.speaking
    const turns = messages.filter((m) => m.role === 'user').length
    const score = Math.min(40, Math.round(turns * 4))
    updateB1Progress('speaking', {
      completed: prev.completed + 1,
      totalScore: prev.totalScore + score,
      lastScore: score,
      lastMax: 40,
    })
    setAttemptSaved(true)
  }

  const labels = {
    qa: t.b1_mode_qa,
    situation: t.b1_mode_situation,
    roleplay: t.b1_mode_roleplay,
  }

  return (
    <div
      className="flex min-h-0 w-full flex-1 flex-col px-4 py-4"
      style={{
        height: 'calc(100dvh - 120px)',
        maxHeight: 'calc(100dvh - 120px)',
      }}
    >
      <div
        className={`mb-3 shrink-0 rounded-xl border p-3 text-xs ${isExpired ? 'border-red-200 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-700'}`}
      >
        <b>{t.b1_time}:</b> {label}
        {isExpired && <span> · {t.b1_timer_expired}</span>}
      </div>
      <h1 className="mb-3 shrink-0 text-lg font-bold">{t.b1_speaking_title}</h1>

      <div className="mb-3 flex shrink-0 gap-2">
        {(['qa', 'situation', 'roleplay']).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setAiMode(m)}
            className={`flex-1 rounded-lg px-2 py-2 text-xs font-semibold ${aiMode === m ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {labels[m]}
          </button>
        ))}
      </div>

      {aiMode === 'qa' && (
        <div className="mb-3 shrink-0 rounded-xl border border-amber-100 bg-amber-50/80 px-3 py-2 text-sm text-amber-950">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-800">{t.b1_topic_label}</span>{' '}
          <span className="font-medium">{sessionQaTopic}</span>
        </div>
      )}

      {aiMode === 'situation' && (
        <div className="mb-3 shrink-0 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm text-gray-800">
          {sessionSituation}
        </div>
      )}

      {aiMode === 'roleplay' && (
        <div className="mb-3 shrink-0 rounded-xl border border-amber-100 bg-amber-50/80 p-3 text-sm text-gray-900">
          <p className="mb-1 text-xs font-semibold text-amber-900">{t.b1_scenario}</p>
          <p className="mb-1">{sessionRoleplay.situation}</p>
          <p className="text-xs text-gray-600">
            {language === 'pl' ? 'Twoja rola (AI):' : 'Роль AI:'}{' '}
            <span className="font-medium text-gray-800">{sessionRoleplay.role}</span>
          </p>
        </div>
      )}

      <div
        className="mb-2 min-h-0 flex-1 space-y-2 overflow-y-auto rounded-xl border border-gray-100 bg-white"
        style={{
          overflowY: 'auto',
          flex: 1,
          paddingBottom: 'max(80px, 10rem)',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '12px',
        }}
      >
        {messages.length === 0 && !loading && (
          <p className="text-center text-xs text-gray-400">
            {t.b1_empty_chat}
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'border border-gray-100 bg-card text-gray-800'}`}
            >
              {msg.role === 'user' ? (
                <span className="whitespace-pre-wrap">{msg.content}</span>
              ) : (
                <div
                  style={{
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: 'var(--color-text-primary, #111827)',
                  }}
                >
                  <ReactMarkdown
                    components={{
                      strong: ({ children }) => (
                        <strong style={{ fontWeight: 600, color: '#DC143C' }}>{children}</strong>
                      ),
                      p: ({ children }) => <p style={{ margin: '4px 0' }}>{children}</p>,
                      h2: ({ children }) => (
                        <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '8px 0 4px' }}>{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '6px 0 2px' }}>{children}</h3>
                      ),
                      ul: ({ children }) => <ul style={{ margin: '4px 0', paddingLeft: '1.1rem' }}>{children}</ul>,
                      ol: ({ children }) => <ol style={{ margin: '4px 0', paddingLeft: '1.1rem' }}>{children}</ol>,
                      li: ({ children }) => <li style={{ margin: '2px 0' }}>{children}</li>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl border border-gray-100 bg-card px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-2 shrink-0 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
      )}

      <div
        className="-mx-4 shrink-0 px-4"
        style={{
          position: 'sticky',
          bottom: '60px',
          zIndex: 10,
          background: 'var(--color-background-primary, #ffffff)',
          borderTop: '0.5px solid var(--color-border-tertiary, #E5E7EB)',
          padding: '8px 16px',
          display: 'flex',
          gap: '8px',
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendAi()
            }
          }}
          disabled={loading}
          placeholder={t.b1_placeholder_speaking}
          rows={2}
          className="min-h-11 flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={sendAi}
          disabled={loading || !input.trim()}
          className="self-end rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          →
        </button>
      </div>

      <div
        className="-mx-4 shrink-0 px-4"
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 11,
          background: 'var(--color-background-primary, #ffffff)',
          borderTop: '0.5px solid var(--color-border-tertiary, #E5E7EB)',
          padding: '12px 16px',
          display: 'flex',
          gap: '8px',
        }}
      >
        <button
          type="button"
          onClick={resetChat}
          className="flex-1 rounded-xl border border-gray-200 py-2 text-xs font-medium text-gray-600"
        >
          {t.b1_new_chat}
        </button>
        <button
          type="button"
          onClick={saveAttempt}
          disabled={attemptSaved || messages.length < 2}
          className="flex-1 rounded-xl bg-green-600 py-2 text-xs font-semibold text-white disabled:opacity-40"
        >
          {attemptSaved ? t.b1_saved : t.b1_save_result}
        </button>
      </div>
    </div>
  )
}
