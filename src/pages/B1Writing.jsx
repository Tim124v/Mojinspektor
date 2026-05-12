import { useCallback, useEffect, useMemo, useState } from 'react'
import PaywallModal from '../components/PaywallModal'
import { writingSets } from '../data/b1ExamData'
import { checkB1Writing } from '../services/claude'
import useAppStore from '../store/appStore'
import { canUse, FREEMIUM } from '../config/freemium'
import useExamTimer from '../hooks/useExamTimer'
import { useTranslation } from '../hooks/useTranslation'
import { useIsPremium } from '../hooks/useIsPremium'

export default function B1Writing() {
  const { t } = useTranslation()
  const language = useAppStore((s) => s.language) || 'uk'
  const updateB1Progress = useAppStore((s) => s.updateB1Progress)
  const b1Progress = useAppStore((s) => s.b1Progress)
  const isPremium = useIsPremium()
  const freeB1Used = useAppStore((s) => s.freeB1Used)
  const incrementB1Used = useAppStore((s) => s.incrementB1Used)
  const b1WritingDraft = useAppStore((s) => s.b1WritingDraft)
  const saveB1WritingDraft = useAppStore((s) => s.saveB1WritingDraft)
  const clearB1WritingDraft = useAppStore((s) => s.clearB1WritingDraft)

  const [setIdx, setSetIdx] = useState(() => Math.floor(Math.random() * writingSets.length))
  const [taskKey, setTaskKey] = useState(() => (Math.random() < 0.5 ? 'taskA' : 'taskB'))
  const [userText, setUserText] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [showPaywall, setShowPaywall] = useState(false)
  const timer = useExamTimer(75)

  const currentSet = writingSets[setIdx]
  const activeTask = currentSet[taskKey]
  const draftId = `${currentSet.id}_${taskKey}`
  const promptText = language === 'pl' ? activeTask.prompt_pl : activeTask.prompt
  const wordCount = userText.trim() ? userText.trim().split(/\s+/).filter(Boolean).length : 0
  const wordCounterGreen =
    wordCount >= activeTask.minWords || (activeTask.minWords >= 100 && wordCount >= 100)

  useEffect(() => {
    setFeedback(null)
  }, [draftId])

  useEffect(() => {
    if (b1WritingDraft.topicId === draftId) {
      setUserText(b1WritingDraft.draftText || '')
    } else {
      setUserText('')
    }
  }, [draftId, b1WritingDraft.topicId, b1WritingDraft.draftText])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userText.trim().length > 10) {
        saveB1WritingDraft(draftId, promptText, userText)
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [userText, draftId, promptText, saveB1WritingDraft])

  async function handleCheck() {
    if (wordCount < activeTask.minWords) {
      setFeedback({ error: t.b1_min_words_error.replace('{n}', String(activeTask.minWords)) })
      return
    }
    setIsChecking(true)
    setFeedback(null)
    try {
      const result = await checkB1Writing(promptText, userText)
      setFeedback({ text: result })
      clearB1WritingDraft()

      const scoreMatch = result.match(/(\d+)\/20/i)
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0
      const normalizedScore = Math.round((score / 20) * 30)
      const prev = b1Progress.writing
      updateB1Progress('writing', {
        completed: prev.completed + 1,
        totalScore: prev.totalScore + score,
        lastScore: normalizedScore,
        lastMax: 30,
      })
    } catch (error) {
      const msg = error?.message || t.b1_error_connection
      setFeedback({ error: msg })
    } finally {
      setIsChecking(false)
    }
  }

  const setButtons = useMemo(() => writingSets.map((s, idx) => ({ idx, label: `Set ${s.setNumber}` })), [])

  const handleNewTopic = useCallback(() => {
    let newSet = setIdx
    let newKey = taskKey
    let iter = 0
    while (newSet === setIdx && newKey === taskKey && iter < 60) {
      newSet = Math.floor(Math.random() * writingSets.length)
      newKey = Math.random() < 0.5 ? 'taskA' : 'taskB'
      iter++
    }
    setSetIdx(newSet)
    setTaskKey(newKey)
    setUserText('')
    setFeedback(null)
    clearB1WritingDraft()
  }, [setIdx, taskKey, clearB1WritingDraft])

  return (
    <div className="px-4 py-4">
      <div className={`mb-3 rounded-xl border p-3 text-xs ${timer.isExpired ? 'border-red-200 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-700'}`}>
        <b>{t.b1_time}:</b> {timer.label}
        {timer.isExpired && <span> · {t.b1_timer_expired_check}</span>}
      </div>
      <h1 className="mb-3 text-lg font-bold">{t.b1_writing_title}</h1>

      <div className="mb-3 flex gap-2">
        {setButtons.map((s) => (
          <button key={s.label} onClick={() => setSetIdx(s.idx)} className={`rounded-full px-3 py-1 text-xs ${setIdx === s.idx ? 'bg-primary text-white' : 'bg-gray-100'}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="mb-3 flex gap-2">
        <button onClick={() => setTaskKey('taskA')} className={`rounded-lg px-3 py-2 text-xs ${taskKey === 'taskA' ? 'bg-primary text-white' : 'bg-gray-100'}`}>
          A ({currentSet.taskA.minWords}-{currentSet.taskA.maxWords})
        </button>
        <button onClick={() => setTaskKey('taskB')} className={`rounded-lg px-3 py-2 text-xs ${taskKey === 'taskB' ? 'bg-primary text-white' : 'bg-gray-100'}`}>
          B ({currentSet.taskB.minWords}-{currentSet.taskB.maxWords})
        </button>
      </div>

      <div className="mb-3 rounded-xl border border-gray-100 bg-white p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t.b1_topic_label}</p>
          <button
            type="button"
            onClick={handleNewTopic}
            className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-primary"
          >
            {t.b1_new_topic}
          </button>
        </div>
        <p className="mb-2 text-sm font-semibold">{promptText}</p>
        <ul className="list-disc pl-5 text-xs text-gray-600">
          {(activeTask.tips || []).map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
      </div>

      <textarea
        value={userText}
        onChange={(e) => !timer.isExpired && setUserText(e.target.value)}
        placeholder={t.b1_placeholder_answer}
        className="mb-2 h-52 w-full rounded-xl border border-gray-200 p-4 text-sm"
      />
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className={wordCounterGreen ? 'font-semibold text-green-700' : 'text-red-600'}>
          {wordCount} / {activeTask.minWords}+ {t.b1_words}
          {activeTask.minWords >= 100 && wordCount >= 100 && wordCount < activeTask.minWords && (
            <span className="ml-2 text-green-600">{t.b1_words_bonus}</span>
          )}
        </span>
        {b1WritingDraft.topicId === draftId && b1WritingDraft.draftText && (
          <button className="underline" onClick={() => { clearB1WritingDraft(); setUserText('') }}>
            {t.b1_clear_draft}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          if (timer.isExpired) return
          const access = canUse('b1_writing', { isPremium, freeB1Used })
          if (!access.allowed) return setShowPaywall(true)
          if (!isPremium) incrementB1Used()
          void handleCheck()
        }}
        disabled={timer.isExpired || isChecking || wordCount < activeTask.minWords}
        className="w-full rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-40"
      >
        {t.b1_check_ai}
      </button>

      {isChecking && (
        <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 py-4 text-sm text-gray-600">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
          {t.b1_checking}
        </div>
      )}

      {feedback?.error && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {feedback.error}
        </div>
      )}
      {feedback?.text && !isChecking && (
        <div className="mt-3 whitespace-pre-wrap rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm text-gray-800">
          {feedback.text}
        </div>
      )}

      {!isPremium && (
        <p className="mt-2 text-center text-xs text-gray-500">
          {t.b1_free_checks_label}: {Math.max(0, FREEMIUM.FREE_B1_CHECKS - freeB1Used)} / {FREEMIUM.FREE_B1_CHECKS}
        </p>
      )}

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} reason="b1_writing" />
    </div>
  )
}
