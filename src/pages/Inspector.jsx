import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ChatBubble from '../components/ChatBubble'
import useAppStore from '../store/appStore'
import { requestFinalEvaluation, sendMessageToClaude, sendMessageToClaudeResident } from '../services/claude'
import PaywallModal from '../components/PaywallModal'
import { canUse, FREEMIUM } from '../config/freemium'
import { useTranslation } from '../hooks/useTranslation'
import { useIsPremium } from '../hooks/useIsPremium'
import AppLogo from '../components/AppLogo.jsx'

function inferSimSlot(freeInspectorUsed, userMessageCount) {
  if (userMessageCount === 0) return Math.min(2, freeInspectorUsed)
  return Math.min(2, Math.max(0, freeInspectorUsed - 1))
}

function getMaxMessages(isPremium, simSlot) {
  if (isPremium) return FREEMIUM.PREMIUM_SIMULATION_MESSAGES
  if (simSlot === 0) return FREEMIUM.TRIAL_SIMULATION_MESSAGES
  return FREEMIUM.FULL_SIMULATION_MESSAGES
}

function getOpeningMessage(mode, isTrial) {
  if (isTrial) {
    return mode === 'resident'
      ? `Dzień dobry. Jestem inspektor Wątrobska. Це пробна симуляція — до ${FREEMIUM.TRIAL_SIMULATION_MESSAGES} повідомлень. Перейдімо одразу до справи. Як давно ви в Польщі і на якій підставі? (Jak długo Pan/Pani mieszka w Polsce i na jakiej podstawie?)`
      : `Dzień dobry. Jestem inspektor Kowalski. Це пробна симуляція — до ${FREEMIUM.TRIAL_SIMULATION_MESSAGES} повідомлень. Розкажіть коротко: хто у вашій родині є поляком? (Kto w Pana/Pani rodzinie jest Polakiem?)`
  }
  return mode === 'resident'
    ? `Dzień dobry. Jestem inspektor Wątrobska, wydział pobytu stałego. Прошу сісти. Наша розмова записується відповідно до процедури. Якщо питання може нашкодити вам або вашій родині — маєте право не відповідати. Є питання перед початком? (Czy ma Pan/Pani pytania zanim zaczniemy?)`
    : `Dzień dobry. Jestem inspektor Kowalski, Urząd do Spraw Cudzoziemców. Прошу сісти. Наша розмова записується. Якщо питання може нашкодити вам або вашій родині — маєте право не відповідати. Є питання? (Czy ma Pan/Pani pytania zanim zaczniemy?)`
}

function buildOpeningAssistantMessage(mode, isPremium, freeInspectorUsed) {
  const slotPreview = isPremium ? -1 : Math.min(2, freeInspectorUsed)
  const isTrial = !isPremium && slotPreview === 0
  return {
    role: 'assistant',
    content: getOpeningMessage(mode, isTrial),
  }
}

/** Тривалість симуляції співбесіди після старту (секунди). */
const INTERVIEW_DURATION_SEC = 60 * 60 // 60 хвилин

/** Формат MM:SS (хвилини можуть бути ≥ 60). */
function formatInterviewTimer(totalSeconds) {
  const safe = Math.max(0, totalSeconds)
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Inspector() {
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const initialMode = searchParams.get('mode') === 'resident' ? 'resident' : 'karta'

  const {
    setInspectorMessages,
    clearInspectorMessages,
    addInspectorSession,
    inspectorSession,
    saveInspectorSession,
    clearInspectorSession,
    freeInspectorUsed,
    incrementInspectorUsed,
    language: uiLanguage,
  } = useAppStore()
  const isPremium = useIsPremium()
  const { t } = useTranslation()

  const [mode, setMode] = useState(initialMode)
  const [messages, setMessages] = useState(() => {
    const { isPremium, freeInspectorUsed } = useAppStore.getState()
    return [buildOpeningAssistantMessage(initialMode, isPremium, freeInspectorUsed)]
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [exchangeCount, setExchangeCount] = useState(0)
  const [showPaywall, setShowPaywall] = useState(false)
  const [isTerminated, setIsTerminated] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)

  const canResume = inspectorSession.isActive && !inspectorSession.timerExpired
  const [hasSavedSession, setHasSavedSession] = useState(canResume)

  const [timerSeconds, setTimerSeconds] = useState(INTERVIEW_DURATION_SEC)
  const [timerActive, setTimerActive] = useState(false)
  const [timerExpired, setTimerExpired] = useState(false)
  const timerRef = useRef(null)
  const timerExpireHandledRef = useRef(false)

  const [isListening, setIsListening] = useState(false)
  const [micSupported, setMicSupported] = useState(false)
  const [speechLang, setSpeechLang] = useState('pl-PL')
  const recognitionRef = useRef(null)
  const speechSnapshotRef = useRef('')
  const finalSpeechRef = useRef('')
  /** false під час відправки / після stop — щоб пізні onresult не перезаписали поле */
  const allowSpeechIntoInputRef = useRef(true)

  const endRef = useRef(null)
  const inputRef = useRef(null)
  /** Слот 0 | 1 | 2 фіксується перед incrementInspectorUsed; -1 = premium */
  const inspectorSimSlotRef = useRef(null)
  /** Авто-оцінка після ліміту: скасування при unmount / новій відправці (Strict Mode) */
  const autoEvalTimeoutRef = useRef(null)
  const autoEvalSeqRef = useRef(0)
  const evaluationInProgressRef = useRef(false)


  const stopListening = () => {
    allowSpeechIntoInputRef.current = false
    const r = recognitionRef.current
    if (r) {
      try {
        r.stop()
      } catch {
        /* ignore */
      }
      recognitionRef.current = null
    }
    setIsListening(false)
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
      return
    }
    startListening()
  }

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert(t.inspector_mic_unsupported)
      return
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        /* ignore */
      }
      recognitionRef.current = null
    }

    speechSnapshotRef.current = input
    finalSpeechRef.current = ''

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = speechLang
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      allowSpeechIntoInputRef.current = true
      setIsListening(true)
    }
    recognition.onresult = (event) => {
      if (!allowSpeechIntoInputRef.current || recognitionRef.current !== recognition) return
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const piece = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalSpeechRef.current += piece
        } else {
          interim += piece
        }
      }
      const prefix = speechSnapshotRef.current
      const finals = finalSpeechRef.current
      setInput(prefix + finals + interim)
    }
    recognition.onerror = (event) => {
      if (event.error === 'aborted' || event.error === 'no-speech') {
        return
      }
      setIsListening(false)
      recognitionRef.current = null
      if (event.error === 'not-allowed') {
        alert(t.inspector_mic_denied)
      }
    }
    recognition.onend = () => {
      recognitionRef.current = null
      setIsListening(false)
    }
    try {
      recognition.start()
    } catch {
      setIsListening(false)
      recognitionRef.current = null
    }
  }

  const stopInterviewTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setTimerActive(false)
  }

  const endInterview = () => {
    stopInterviewTimer()
    stopListening()
    clearInspectorSession()
    setInterviewStarted(false)
  }

  const handleTimerExpired = () => {
    if (timerExpireHandledRef.current) return
    timerExpireHandledRef.current = true
    stopInterviewTimer()

    const timeoutText = t.inspector_chat_timeout

    setMessages((prev) => {
      const next = [...prev, { role: 'assistant', content: timeoutText }]
      saveInspectorSession(
        mode,
        next,
        true,
        isPremium ? undefined : inspectorSimSlotRef.current ?? undefined
      )
      return next
    })
    setTimerExpired(true)
    setIsTerminated(true)
    setInterviewStarted(false)
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    setInspectorMessages(messages)
    if (messages.length > 1 && !interviewStarted && !timerExpired) {
      saveInspectorSession(
        mode,
        messages,
        false,
        isPremium ? undefined : inspectorSimSlotRef.current ?? undefined
      )
    }
  }, [messages, mode, interviewStarted, timerExpired, isPremium, saveInspectorSession, setInspectorMessages])

  useEffect(() => {
    if (!timerActive) return

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          handleTimerExpired()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [timerActive])

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setMicSupported(true)
    }
  }, [])

  useEffect(() => {
    return () => {
      stopListening()
      stopInterviewTimer()
      if (autoEvalTimeoutRef.current) {
        clearTimeout(autoEvalTimeoutRef.current)
        autoEvalTimeoutRef.current = null
      }
      autoEvalSeqRef.current += 1
    }
  }, [])

  function switchMode(newMode) {
    if (autoEvalTimeoutRef.current) {
      clearTimeout(autoEvalTimeoutRef.current)
      autoEvalTimeoutRef.current = null
    }
    autoEvalSeqRef.current += 1
    endInterview()
    inspectorSimSlotRef.current = null
    setMode(newMode)
    const { isPremium: prem, freeInspectorUsed: freeUsed } = useAppStore.getState()
    setMessages([buildOpeningAssistantMessage(newMode, prem, freeUsed)])
    clearInspectorMessages()
    setHasSavedSession(false)
    setError(null)
    setExchangeCount(0)
    setIsTerminated(false)
    setTimerSeconds(INTERVIEW_DURATION_SEC)
    setTimerExpired(false)
    timerExpireHandledRef.current = false
  }

  async function handleSend(text) {
    const content = text || input.trim()
    if (!content || loading || isTerminated || timerExpired) return

    if (autoEvalTimeoutRef.current) {
      clearTimeout(autoEvalTimeoutRef.current)
      autoEvalTimeoutRef.current = null
      autoEvalSeqRef.current += 1
    }

    if (exchangeCount === 0) {
      const inspectorAccess = canUse('inspector', useAppStore.getState())
      if (!inspectorAccess.allowed) {
        setShowPaywall(true)
        return
      }
      const { freeInspectorUsed: freeUsed } = useAppStore.getState()
      if (!isPremium) {
        inspectorSimSlotRef.current = freeUsed
        incrementInspectorUsed()
      } else {
        inspectorSimSlotRef.current = -1
      }
      setInterviewStarted(true)
      setHasSavedSession(false)
      clearInspectorSession()
      setTimerSeconds(INTERVIEW_DURATION_SEC)
      setTimerExpired(false)
      timerExpireHandledRef.current = false
      setTimerActive(true)
    }

    allowSpeechIntoInputRef.current = false
    stopListening()
    finalSpeechRef.current = ''
    speechSnapshotRef.current = ''

    const userMsg = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const sendFn = mode === 'resident' ? sendMessageToClaudeResident : sendMessageToClaude
      const reply = await sendFn(newMessages)
      const terminated = reply.includes('[INTERVIEW_TERMINATED]')
      const cleanReply = reply.replace('[INTERVIEW_TERMINATED]', '').trim()
      const updated = [...newMessages, { role: 'assistant', content: cleanReply }]
      setMessages(updated)

      if (terminated) {
        setIsTerminated(true)
        endInterview()
        return
      }

      const newCount = exchangeCount + 1
      setExchangeCount(newCount)
      const slot =
        inspectorSimSlotRef.current !== null && inspectorSimSlotRef.current !== undefined
          ? inspectorSimSlotRef.current
          : inferSimSlot(useAppStore.getState().freeInspectorUsed, updated.filter((m) => m.role === 'user').length)
      const maxMsg = getMaxMessages(isPremium, slot)
      const newUserCount = updated.filter((m) => m.role === 'user').length
      saveInspectorSession(
        mode,
        updated,
        false,
        isPremium ? undefined : inspectorSimSlotRef.current ?? undefined
      )
      if (newUserCount >= maxMsg && !terminated) {
        if (autoEvalTimeoutRef.current) {
          clearTimeout(autoEvalTimeoutRef.current)
        }
        const seq = ++autoEvalSeqRef.current
        autoEvalTimeoutRef.current = setTimeout(() => {
          autoEvalTimeoutRef.current = null
          if (seq !== autoEvalSeqRef.current) return
          handleGetEvaluation(updated)
        }, 1000)
      }
    } catch (e) {
      setError(e?.message || t.error_connection)
    } finally {
      setLoading(false)
      setInput('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  async function handleGetEvaluation(messagesOverride) {
    if (evaluationInProgressRef.current) return
    if (autoEvalTimeoutRef.current) {
      clearTimeout(autoEvalTimeoutRef.current)
      autoEvalTimeoutRef.current = null
    }
    autoEvalSeqRef.current += 1
    evaluationInProgressRef.current = true

    const msgsForEval = messagesOverride ?? messages
    endInterview()
    setLoading(true)
    setError(null)
    try {
      const result = await requestFinalEvaluation(msgsForEval, mode)
      setMessages(() => [...msgsForEval, { role: 'assistant', content: result, isEval: true }])
      addInspectorSession({ mode, date: new Date().toISOString(), messages: msgsForEval.length })
    } catch (e) {
      setError(t.error_eval)
    } finally {
      setLoading(false)
      evaluationInProgressRef.current = false
    }
  }

  function handleClear() {
    if (autoEvalTimeoutRef.current) {
      clearTimeout(autoEvalTimeoutRef.current)
      autoEvalTimeoutRef.current = null
    }
    autoEvalSeqRef.current += 1
    endInterview()
    inspectorSimSlotRef.current = null
    const { isPremium: prem, freeInspectorUsed: freeUsed } = useAppStore.getState()
    setMessages([buildOpeningAssistantMessage(mode, prem, freeUsed)])
    clearInspectorMessages()
    setHasSavedSession(false)
    setError(null)
    setExchangeCount(0)
    setIsTerminated(false)
    setTimerSeconds(INTERVIEW_DURATION_SEC)
    setTimerExpired(false)
    timerExpireHandledRef.current = false
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const inspectorName = mode === 'resident' ? t.inspector_name_resident : t.inspector_name_karta
  const inspectorOrg = mode === 'resident' ? t.inspector_org_resident : t.inspector_org_karta
  const userMessageCount = messages.filter((m) => m.role === 'user').length
  const hasEvaluationMessage = messages.some((m) => m.isEval)
  const effectiveSlot = isPremium
    ? -1
    : interviewStarted || userMessageCount > 0
      ? inspectorSimSlotRef.current !== null && inspectorSimSlotRef.current !== undefined
        ? inspectorSimSlotRef.current
        : inferSimSlot(freeInspectorUsed, userMessageCount)
      : Math.min(2, freeInspectorUsed)
  const maxMessages = getMaxMessages(isPremium, effectiveSlot)
  const showEvaluateCta =
    !loading &&
    !hasEvaluationMessage &&
    !isTerminated &&
    userMessageCount >= maxMessages - 2 &&
    userMessageCount < maxMessages

  return (
    <div className="flex flex-col fade-in" style={{ height: 'calc(100vh - 56px - 64px)' }}>
      <div className="px-4 py-2 border-b border-gray-100 bg-white">
        {hasSavedSession && (
          <div style={{
            background: '#EAF3DE',
            border: '0.5px solid #97C459',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '12px',
          }}>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#27500A', marginBottom: '6px' }}>
              {t.inspector_resume_title}
            </p>
            <p style={{ fontSize: '12px', color: '#3B6D11', marginBottom: '12px' }}>
              {t.inspector_resume_subtitle
                .replace(
                  '{mode}',
                  inspectorSession.mode === 'karta' ? t.inspector_mode_karta_short : t.inspector_mode_resident_short
                )
                .replace('{count}', String(inspectorSession.messageCount))}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  const restoredMode = inspectorSession.mode || mode
                  const restoredMessages = inspectorSession.messages
                  const restoredUserCount = restoredMessages.filter((msg) => msg.role === 'user').length
                  const { freeInspectorUsed: freeUsed } = useAppStore.getState()
                  const restoredSlot =
                    inspectorSession.simSlot !== undefined && inspectorSession.simSlot !== null
                      ? inspectorSession.simSlot
                      : inferSimSlot(freeUsed, restoredUserCount)
                  inspectorSimSlotRef.current = restoredSlot
                  setMode(restoredMode)
                  setMessages(restoredMessages)
                  setExchangeCount(restoredUserCount)
                  setInterviewStarted(restoredUserCount > 0)
                  setHasSavedSession(false)
                }}
                style={{
                  flex: 1,
                  background: '#3B6D11',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                {t.inspector_resume_continue}
              </button>
              <button
                onClick={() => {
                  clearInspectorSession()
                  setHasSavedSession(false)
                }}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '0.5px solid #639922',
                  borderRadius: '8px',
                  padding: '10px',
                  color: '#3B6D11',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {t.inspector_resume_new}
              </button>
            </div>
          </div>
        )}

        {!isPremium && (
          <div
            className={`mb-2 rounded-lg px-3 py-2 text-center text-xs ${
              freeInspectorUsed >= FREEMIUM.FREE_INSPECTOR_LIMIT
                ? 'bg-red-50 text-red-700'
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            {freeInspectorUsed >= FREEMIUM.FREE_INSPECTOR_LIMIT
              ? t.inspector_limit_exhausted
              : t.inspector_limit_used
                .replace('{used}', String(freeInspectorUsed))
                .replace('{limit}', String(FREEMIUM.FREE_INSPECTOR_LIMIT))}
          </div>
        )}

        <div className="flex gap-1 mb-2">
          <button
            onClick={() => switchMode('karta')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === 'karta' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <AppLogo size={14} className="flex-shrink-0" />
              Karta Polaka
            </span>
          </button>
          <button
            onClick={() => switchMode('resident')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              mode === 'resident' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            🏠 Stały pobyt
          </button>
        </div>

        <p className="mb-2 text-xs leading-snug text-gray-600">
          {mode === 'resident' ? t.inspector_mode_resident_subtitle : t.inspector_mode_karta_subtitle}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg flex-shrink-0">
              👨‍💼
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">{inspectorName}</div>
              <div className="text-xs text-gray-400">{inspectorOrg}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                <span className="text-xs text-green-600 font-medium">{t.inspector_online}</span>
              </div>
              {!isPremium && (
                <div
                  style={{
                    fontSize: '11px',
                    color: effectiveSlot === 0 ? 'var(--color-text-secondary, #6B7280)' : '#0C447C',
                    background:
                      effectiveSlot === 0
                        ? 'var(--color-background-secondary, #F3F4F6)'
                        : '#E6F1FB',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    display: 'inline-block',
                    marginTop: '4px',
                  }}
                >
                  {effectiveSlot === 0
                    ? `Пробна симуляція · до ${FREEMIUM.TRIAL_SIMULATION_MESSAGES} повідомлень`
                    : `Повна симуляція · до ${FREEMIUM.FULL_SIMULATION_MESSAGES} повідомлень`}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userMessageCount > 0 && (
              <span className="text-xs text-gray-400">
                {userMessageCount}/{maxMessages}
              </span>
            )}
            <button
              onClick={handleClear}
              className="text-xs text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg"
            >
              {t.inspector_clear}
            </button>
          </div>
        </div>
      </div>

      {timerActive && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: timerSeconds < 300 ? '#FCEBEB' : timerSeconds < 600 ? '#FAEEDA' : '#F9FAFB',
          borderBottom: '0.5px solid #E5E7EB',
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: timerSeconds < 300 ? '#A32D2D' : '#4B5563',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {formatInterviewTimer(timerSeconds)}
          </span>
          <span style={{ fontSize: '12px', color: '#6B7280' }}>
            {t.inspector_timer_left}
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm mr-2 mt-auto flex-shrink-0">👨‍💼</div>
            <div className="bg-card border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="text-center text-error text-sm py-2 px-4 bg-error-light rounded-xl mb-2">
            {error}
          </div>
        )}
        {hasEvaluationMessage && (
          <div
            style={{
              background: 'var(--color-background-secondary, #F9FAFB)',
              borderRadius: '12px',
              padding: '16px',
              margin: '12px 0',
              border: '0.5px solid var(--color-border-tertiary, #E5E7EB)',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                fontWeight: '500',
                color: 'var(--color-text-tertiary, #6B7280)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px',
              }}
            >
              {t.inspector_protocol_title}
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary, #4B5563)',
                lineHeight: '1.5',
              }}
            >
              {t.inspector_protocol_body}
            </p>
            {freeInspectorUsed === 1 && !isPremium && inspectorSimSlotRef.current === 0 && (
              <div
                style={{
                  background: '#FAEEDA',
                  border: '0.5px solid #FAC775',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  marginTop: '12px',
                }}
              >
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#633806',
                    marginBottom: '6px',
                  }}
                >
                  Пробна симуляція завершена
                </p>
                <p style={{ fontSize: '12px', color: '#854F0B', lineHeight: '1.5', marginBottom: '10px' }}>
                  У вас ще є 2 повні симуляції (до 20 повідомлень кожна). Або отримайте необмежений доступ —{' '}
                  {FREEMIUM.PRICE_PLN} zł назавжди.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/upgrade')}
                  style={{
                    background: '#DC143C',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Отримати Premium → {FREEMIUM.PRICE_PLN} zł
                </button>
              </div>
            )}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {showEvaluateCta && (
        <div className="px-4 py-2 border-t border-purple-100 bg-purple-50 fade-in">
          <button
            onClick={() => handleGetEvaluation()}
            className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl text-sm min-h-11"
          >
            {t.inspector_evaluate_btn}
          </button>
        </div>
      )}

      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        {!isPremium && freeInspectorUsed >= FREEMIUM.FREE_INSPECTOR_LIMIT && (
          <button
            onClick={() => setShowPaywall(true)}
            className="mb-2 w-full rounded-xl border border-amber-300 bg-amber-100 py-2 text-xs font-semibold text-amber-800"
          >
            {t.inspector_premium_unlock}
          </button>
        )}

        {isTerminated ? (
          <div className="my-2 rounded-xl bg-red-50 px-4 py-4 text-center">
            <p className="mb-2 text-sm font-semibold text-red-700">
              {timerExpired ? t.inspector_terminated_timer : t.inspector_terminated_staff}
            </p>
            <button
              onClick={handleClear}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white"
            >
              {t.inspector_try_again}
            </button>
          </div>
        ) : (
          <>
            {micSupported && (
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[11px] text-gray-500">
                  {t.inspector_speech_lang}
                </span>
                <button
                  type="button"
                  disabled={isListening}
                  onClick={() => setSpeechLang('pl-PL')}
                  className={`rounded-full px-3 py-1 text-[11px] ${
                    speechLang === 'pl-PL'
                      ? 'border border-red-400 bg-red-50 text-red-700'
                      : 'border border-gray-200 text-gray-500'
                  } ${isListening ? 'opacity-40' : ''}`}
                >
                  🇵🇱 Polski
                </button>
                <button
                  type="button"
                  disabled={isListening}
                  onClick={() => setSpeechLang('uk-UA')}
                  className={`rounded-full px-3 py-1 text-[11px] ${
                    speechLang === 'uk-UA'
                      ? 'border border-red-400 bg-red-50 text-red-700'
                      : 'border border-gray-200 text-gray-500'
                  } ${isListening ? 'opacity-40' : ''}`}
                >
                  🇺🇦 Українська
                </button>
              </div>
            )}

            {isListening && (
              <div className="mb-2 text-center text-xs font-medium text-red-600">
                <span className="inline-block h-2 w-2 rounded-full bg-red-600 mr-2 animate-pulse-dot" />
                {t.inspector_recording}{' '}
                · {speechLang === 'pl-PL' ? t.inspector_voice_hint_pl : t.inspector_voice_hint_uk}
              </div>
            )}

            <div className="flex gap-2 items-center">
              {micSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={loading || isTerminated}
                  title={isListening ? t.inspector_mic_stop : t.inspector_mic_start}
                  className={`h-11 w-11 rounded-full flex items-center justify-center ${
                    isListening ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                  } disabled:opacity-50`}
                >
                  {isListening ? '■' : '🎤'}
                </button>
              )}
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening ? t.inspector_placeholder_listening : t.inspector_placeholder
                }
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-primary bg-card min-h-11 max-h-28"
                style={{ lineHeight: '1.4' }}
                disabled={loading || (!isPremium && freeInspectorUsed >= FREEMIUM.FREE_INSPECTOR_LIMIT && exchangeCount === 0)}
                readOnly={isListening}
              />
              <button
                onClick={() => handleSend()}
                disabled={
                  !input.trim() ||
                  loading ||
                  isTerminated ||
                  timerExpired ||
                  (!isPremium && freeInspectorUsed >= FREEMIUM.FREE_INSPECTOR_LIMIT && exchangeCount === 0)
                }
                className="bg-primary text-white rounded-xl px-4 min-h-11 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </>
        )}
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        reason="inspector"
      />
    </div>
  )
}
