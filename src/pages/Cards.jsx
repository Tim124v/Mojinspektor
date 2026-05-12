import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import AnswerButton from '../components/AnswerButton'
import ProgressBar from '../components/ProgressBar'
import { getQuestionsByTopic, topics } from '../data/questions'
import useAppStore from '../store/appStore'
import { useTranslation } from '../hooks/useTranslation'
import { filterAnsweredIdsForDeck } from '../utils/deckProgress'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function restoreCardsOrder(topicSlug, savedProgress) {
  try {
    const fresh = getQuestionsByTopic(topicSlug).filter(Boolean)
    const savedOrder = savedProgress?.cardOrderIds || []

    if (!savedOrder.length) {
      return shuffle(fresh).filter(Boolean)
    }

    const byId = new Map(fresh.map((item) => [item.id, item]))
    const ordered = savedOrder.map((id) => byId.get(id)).filter(Boolean)
    const remaining = fresh.filter((item) => item && !savedOrder.includes(item.id))
    return [...ordered, ...remaining].filter(Boolean)
  } catch (error) {
    console.error('Failed to load cards:', error)
    return []
  }
}

function safeResumeIndex(rawIndex, deckLen) {
  if (deckLen === 0) return 0
  return rawIndex >= deckLen || rawIndex < 0 ? 0 : rawIndex
}

export default function Cards() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const topicSlug = searchParams.get('topic') || 'all'
  const { t, language } = useTranslation()
  const questionLanguage = useAppStore((s) => s.questionLanguage) || 'uk'
  const setQuestionLanguage = useAppStore((s) => s.setQuestionLanguage)
  const savedStoreProgress = useAppStore((s) => s.cardProgress)
  const saveCardProgress = useAppStore((s) => s.saveCardProgress)
  const clearCardProgress = useAppStore((s) => s.clearCardProgress)

  const sessionInitRef = useRef(null)
  const [cards, setCards] = useState(() => {
    const saved = savedStoreProgress[topicSlug]
    const deck = restoreCardsOrder(topicSlug, saved)
    const filtered = filterAnsweredIdsForDeck(saved?.answeredIds || [], deck)
    sessionInitRef.current = {
      filtered,
      filteredSet: new Set(filtered),
      current: safeResumeIndex(saved?.lastIndex ?? 0, deck.length),
    }
    return deck
  })
  const savedProgress = savedStoreProgress[topicSlug]
  const [current, setCurrent] = useState(() => sessionInitRef.current.current)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [answeredCorrectly, setAnsweredCorrectly] = useState(
    () => sessionInitRef.current.filteredSet
  )
  const [correctCount, setCorrectCount] = useState(() => sessionInitRef.current.filtered.length)
  const [wrongCount, setWrongCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [sessionCorrect, setSessionCorrect] = useState(() => sessionInitRef.current.filtered.length)

  const addSession = useAppStore((s) => s.addSession)
  const updateStreak = useAppStore((s) => s.updateStreak)
  const updateTopicProgress = useAppStore((s) => s.updateTopicProgress)

  const topicInfo = topics.find(tp => tp.slug === topicSlug)
  const topicLabel = topicInfo?.labelKey && t[topicInfo.labelKey]
    ? t[topicInfo.labelKey]
    : topicInfo?.name || 'Всі теми'

  useEffect(() => {
    const topicSavedProgress = savedStoreProgress[topicSlug]
    const nextCards = restoreCardsOrder(topicSlug, topicSavedProgress)
    const rawIds = topicSavedProgress?.answeredIds || []
    const filteredIds = filterAnsweredIdsForDeck(rawIds, nextCards)
    const safeIndex = safeResumeIndex(topicSavedProgress?.lastIndex ?? 0, nextCards.length)
    const restoredAnswered = new Set(filteredIds)

    setCards(nextCards)
    setCurrent(safeIndex)
    setSelected(null)
    setAnswered(false)
    setAnsweredCorrectly(restoredAnswered)
    setCorrectCount(restoredAnswered.size)
    setWrongCount(0)
    setFinished(false)
    setSessionCorrect(restoredAnswered.size)

    if (
      filteredIds.length !== rawIds.length &&
      topicSavedProgress &&
      nextCards.length > 0
    ) {
      saveCardProgress(topicSlug, safeIndex, filteredIds, nextCards.map((c) => c.id))
    }
  }, [topicSlug])

  useEffect(() => {
    if (!cards.length) return
    if (current >= cards.length || current < 0) {
      setCurrent(0)
    }
  }, [cards, current])

  if (!cards.length) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 mb-3">{t.cards_empty_topic}</p>
        <button
          onClick={() => navigate('/')}
          className="border border-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg"
        >
          {t.cards_back_home}
        </button>
      </div>
    )
  }

  const safeCurrent =
    current < 0 || current >= cards.length ? 0 : current
  const card = cards[safeCurrent]
  const total = cards.length

  if (!card) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 mb-3">{t.cards_empty_topic}</p>
        <button
          onClick={() => navigate('/')}
          className="border border-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg"
        >
          {t.cards_back_home}
        </button>
      </div>
    )
  }

  const langLabels = { uk: '🇺🇦 УКР', pl: '🇵🇱 PL' }

  const getQuestionText = (item) => {
    if (questionLanguage === 'pl' && item?.question_pl) return item.question_pl
    return item?.question
  }

  const getOptions = (item) => {
    if (questionLanguage === 'pl' && Array.isArray(item?.options_pl)) return item.options_pl
    return item.options
  }

  const getExplanation = (item) => {
    if (questionLanguage === 'pl' && item?.explanation_pl) return item.explanation_pl
    return item.explanation
  }

  const question = getQuestionText(card)
  const options = getOptions(card)
  const explanation = getExplanation(card)

  async function handleSelect(idx) {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const isCorrect = idx === card.correctIndex
    const nextAnsweredCorrectly = new Set(answeredCorrectly)
    if (isCorrect) {
      if (!nextAnsweredCorrectly.has(card.id)) {
        nextAnsweredCorrectly.add(card.id)
        setCorrectCount((c) => c + 1)
        setSessionCorrect((c) => c + 1)
      }
    } else {
      setWrongCount(w => w + 1)
    }
    setAnsweredCorrectly(nextAnsweredCorrectly)
    saveCardProgress(topicSlug, safeCurrent, [...nextAnsweredCorrectly], cards.map((item) => item.id))
    updateStreak()
    // Progress key must match topic.slug on Home (see topics in this file). Prefer card.topicSlug.
    const slugForProgress =
      card.topicSlug != null && String(card.topicSlug).trim() !== ''
        ? card.topicSlug
        : topicSlug
    if (!(isCorrect && answeredCorrectly.has(card.id))) {
      updateTopicProgress(slugForProgress, isCorrect)
    }
    try {
      await useAppStore.getState().saveProgress()
    } catch {
      /* cloud sync must not break the session */
    }
  }

  function handleNext() {
    if (safeCurrent + 1 >= total) {
      updateStreak()
      addSession({
        date: new Date().toISOString(),
        topic: topicLabel,
        topicSlug: topicSlug === 'all' ? 'history' : topicSlug,
        correct: sessionCorrect,
        wrong: wrongCount,
        total,
      })
      saveCardProgress(topicSlug, total - 1, [...answeredCorrectly], cards.map((item) => item.id))
      setFinished(true)
    } else {
      const nextIndex = safeCurrent + 1
      setCurrent(nextIndex)
      setSelected(null)
      setAnswered(false)
      saveCardProgress(topicSlug, nextIndex, [...answeredCorrectly], cards.map((item) => item.id))
    }
  }

  function handleRestart() {
    const q = shuffle(getQuestionsByTopic(topicSlug).filter(Boolean)).filter(Boolean)
    clearCardProgress(topicSlug)
    setCards(q)
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setAnsweredCorrectly(new Set())
    setCorrectCount(0)
    setWrongCount(0)
    setFinished(false)
    setSessionCorrect(0)
  }

  if (finished) {
    const pct = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '💪'
    const resultMsg = pct >= 80 ? t.cards_result_great : pct >= 60 ? t.cards_result_good : t.cards_result_poor
    return (
      <div className="px-4 py-6 flex flex-col items-center fade-in">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.cards_result_title}</h2>
        <div className="text-5xl font-bold text-primary mb-2">{pct}%</div>
        <p className="text-gray-500 mb-3 text-center">{resultMsg}</p>
        <p className="text-gray-400 mb-6 text-center text-sm">
          {t.cards_correct}: {sessionCorrect} {t.question_of} {total}
        </p>
        <div className="w-full bg-card rounded-xl p-4 border border-gray-100 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-success font-medium">✓ {t.cards_correct}: {sessionCorrect}</span>
            <span className="text-error font-medium">✗ {t.cards_wrong}: {wrongCount}</span>
          </div>
          <ProgressBar value={sessionCorrect} max={total} />
        </div>
        <button
          onClick={handleRestart}
          className="w-full bg-primary text-white font-semibold py-3 rounded-xl text-base min-h-11"
        >
          {t.cards_restart}
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full mt-3 border border-gray-200 text-gray-700 font-medium py-3 rounded-xl text-base min-h-11"
        >
          {t.nav_home}
        </button>
      </div>
    )
  }

  const cardBg = !answered
    ? 'bg-white'
    : selected === card.correctIndex
    ? 'bg-success-light'
    : 'bg-error-light'

  return (
    <div className="px-4 py-4 fade-in">
      {savedProgress && savedProgress.lastIndex > 0 && !finished && (
        <div style={{
          background: '#E6F1FB',
          border: '0.5px solid #B5D4F4',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '500', color: '#0C447C', margin: '0 0 2px' }}>
              {t.cards_continue_learn}
            </p>
            <p style={{ fontSize: '12px', color: '#185FA5', margin: 0 }}>
              {t.cards_stopped_at.replace('{n}', String(savedProgress.lastIndex + 1))}
            </p>
          </div>
          <button
            onClick={() => {
              clearCardProgress(topicSlug)
              setCurrent(0)
              setAnsweredCorrectly(new Set())
              setCorrectCount(0)
              setSessionCorrect(0)
              setWrongCount(0)
              setAnswered(false)
              setSelected(null)
            }}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '12px',
              color: '#185FA5',
              cursor: 'pointer',
              padding: '4px 8px',
              textDecoration: 'underline',
              flexShrink: 0,
            }}
          >
            {t.cards_from_scratch}
          </button>
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => navigate(-1)} className="text-gray-400 p-1 -ml-1">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
          {topicLabel}
        </span>
        <span className="text-[11px] bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5 text-gray-500">
          {langLabels[questionLanguage] || '🌐'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setQuestionLanguage('uk')}
          style={{
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            cursor: 'pointer',
            border: questionLanguage === 'uk' ? '2px solid #DC143C' : '0.5px solid var(--color-border-secondary, #E5E7EB)',
            background: questionLanguage === 'uk' ? '#FCEBEB' : 'transparent',
            color: questionLanguage === 'uk' ? '#A32D2D' : 'var(--color-text-secondary, #6B7280)',
          }}
        >
          {t.cards_q_lang_uk}
        </button>
        <button
          type="button"
          onClick={() => setQuestionLanguage('pl')}
          style={{
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            cursor: 'pointer',
            border: questionLanguage === 'pl' ? '2px solid #DC143C' : '0.5px solid var(--color-border-secondary, #E5E7EB)',
            background: questionLanguage === 'pl' ? '#FCEBEB' : 'transparent',
            color: questionLanguage === 'pl' ? '#A32D2D' : 'var(--color-text-secondary, #6B7280)',
          }}
        >
          {t.cards_q_lang_pl}
        </button>
      </div>

      {questionLanguage === 'pl' && !card.question_pl && (
        <p
          style={{
            fontSize: '11px',
            color: 'var(--color-text-tertiary, #9CA3AF)',
            textAlign: 'center',
            marginBottom: '8px',
            fontStyle: 'italic',
          }}
        >
          {t.cards_question_uk_only}
        </p>
      )}

      <div className="mb-2">
        <ProgressBar value={safeCurrent + 1} max={total} />
      </div>

      <div className="flex justify-between text-xs mb-4 px-1">
        <span className="text-success font-semibold">✓ {correctCount}</span>
        <span className="text-gray-400 font-medium">{safeCurrent + 1} {t.question_of} {total}</span>
        <span className="text-error font-semibold">✗ {wrongCount}</span>
      </div>

      <div
        className={`rounded-xl shadow-sm p-5 mb-4 transition-colors duration-300 border border-gray-100 ${cardBg}`}
        style={{ minHeight: '120px' }}
      >
        <p className="text-base font-semibold text-gray-900 leading-relaxed">{question}</p>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {options.map((opt, idx) => {
          let state = undefined
          if (answered) {
            if (idx === card.correctIndex) state = 'correct'
            else if (idx === selected) state = 'wrong'
          }
          return (
            <AnswerButton
              key={idx}
              text={opt}
              state={state}
              onClick={() => handleSelect(idx)}
              disabled={answered}
            />
          )
        })}
      </div>

      {answered && (
        <div
          className={`rounded-xl p-4 mb-4 text-sm leading-relaxed ${
            selected === card.correctIndex ? 'bg-success-light' : 'bg-error-light'
          }`}
        >
          <p className={`font-semibold mb-1 ${selected === card.correctIndex ? 'text-success' : 'text-error'}`}>
            {selected === card.correctIndex ? t.answer_correct : t.answer_wrong}
          </p>
          <p className="text-gray-700">{explanation}</p>
        </div>
      )}

      {answered && (
        <button
          onClick={handleNext}
          className="w-full bg-primary text-white font-semibold py-3 rounded-xl text-base min-h-11"
        >
          {safeCurrent + 1 >= total ? '✓ ' + t.cards_result_title : t.cards_next}
        </button>
      )}
    </div>
  )
}
