import { useMemo, useState } from 'react'
import useAppStore from '../store/appStore'
import { examStructure, readingTasks } from '../data/b1ExamData'
import useExamTimer from '../hooks/useExamTimer'
import { useTranslation } from '../hooks/useTranslation'

export default function B1Reading() {
  const { t } = useTranslation()
  const language = useAppStore((s) => s.language) || 'uk'
  const b1Progress = useAppStore((s) => s.b1Progress)
  const updateB1Progress = useAppStore((s) => s.updateB1Progress)

  const [taskIdx, setTaskIdx] = useState(0)
  const [itemIdx, setItemIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const [takNieAnswers, setTakNieAnswers] = useState({})
  const [takNieChecked, setTakNieChecked] = useState(false)
  const [gapAnswers, setGapAnswers] = useState({})
  const [gapChecked, setGapChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const timer = useExamTimer(45)

  const task = readingTasks[taskIdx]
  const item = task.type === 'text_interpretation' ? task.items[itemIdx] : null
  const totalPoints = useMemo(() => readingTasks.reduce((sum, t) => sum + (t.items?.length || 0) + (t.correctAnswers ? Object.keys(t.correctAnswers).length : 0), 0), [])

  function nextTask() {
    if (taskIdx >= readingTasks.length - 1) {
      const prev = b1Progress.reading
      const sectionMax = examStructure.sections.find((s) => s.id === 'reading')?.maxPoints || 30
      const normalizedScore = Math.round((score / totalPoints) * sectionMax)
      updateB1Progress('reading', {
        completed: prev.completed + 1,
        correct: prev.correct + score,
        lastScore: normalizedScore,
        lastMax: sectionMax,
      })
      setFinished(true)
      return
    }
    setTaskIdx((v) => v + 1)
    setItemIdx(0)
    setSelected(null)
    setChecked(false)
    setTakNieAnswers({})
    setTakNieChecked(false)
    setGapAnswers({})
    setGapChecked(false)
  }

  function checkChoice() {
    if (selected === null || checked) return
    if (selected === item.correctIndex) setScore((v) => v + 1)
    setChecked(true)
  }

  function nextChoice() {
    if (itemIdx >= task.items.length - 1) {
      nextTask()
      return
    }
    setItemIdx((v) => v + 1)
    setSelected(null)
    setChecked(false)
  }

  function toggleTakNie(id, value) {
    if (takNieChecked) return
    setTakNieAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function checkTakNie() {
    if (takNieChecked) return
    let local = 0
    task.items.forEach((row) => {
      if (takNieAnswers[row.id] === row.answer) local += 1
    })
    setScore((v) => v + local)
    setTakNieChecked(true)
  }

  function setGap(gapId, fragmentId) {
    if (gapChecked) return
    setGapAnswers((prev) => ({ ...prev, [gapId]: fragmentId }))
  }

  function checkGaps() {
    if (gapChecked) return
    let local = 0
    Object.entries(task.correctAnswers).forEach(([gapId, answer]) => {
      if (gapAnswers[gapId] === answer) local += 1
    })
    setScore((v) => v + local)
    setGapChecked(true)
  }

  if (finished) {
    return (
      <div className="px-4 py-5">
        <div className="rounded-xl border border-gray-100 bg-white p-5 text-center">
          <p className="mb-2 text-2xl font-bold">{score}/{totalPoints}</p>
          <p className="text-sm text-gray-500">
            {t.b1_reading_result}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-4">
      <div className={`mb-3 rounded-xl border p-3 text-xs ${timer.isExpired ? 'border-red-200 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-700'}`}>
        <b>{t.b1_time}:</b> {timer.label}
        {timer.isExpired && <span> · {t.b1_timer_expired_try}</span>}
      </div>
      <p className="mb-1 text-xs text-gray-500">
        {t.b1_task} {taskIdx + 1}/{readingTasks.length}
      </p>
      <h1 className="mb-1 text-lg font-bold">{task.title}</h1>
      <p className="mb-4 text-sm text-gray-600">{language === 'pl' ? task.instructions_pl : task.instructions}</p>

      {task.type === 'text_interpretation' && (
        <>
          <div className="mb-2 text-xs text-gray-500">
            {t.b1_question} {itemIdx + 1}/{task.items.length}
          </div>
          <div className="mb-3 rounded-xl border border-gray-100 bg-white p-4 text-sm">{item.text}</div>
          <div className="mb-3 text-sm font-medium">{language === 'pl' ? item.question_pl : item.question}</div>
          <div className="mb-4 flex flex-col gap-2">
            {(language === 'pl' ? item.options_pl : item.options).map((opt, idx) => {
              const correct = checked && idx === item.correctIndex
              const wrong = checked && selected === idx && idx !== item.correctIndex
              return (
                <button
                  key={idx}
                  onClick={() => !checked && !timer.isExpired && setSelected(idx)}
                  className={`rounded-xl border px-3 py-3 text-left text-sm ${
                    correct ? 'border-green-300 bg-green-50 text-green-700'
                      : wrong ? 'border-red-300 bg-red-50 text-red-700'
                        : selected === idx ? 'border-primary bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
          {checked && (
            <div className="mb-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-700">{item.explanation}</div>
          )}
          <button disabled={timer.isExpired && !checked} onClick={checked ? nextChoice : checkChoice} className="w-full rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-50">
            {checked
              ? (itemIdx + 1 < task.items.length ? t.b1_next : t.b1_next_task)
              : t.b1_check}
          </button>
        </>
      )}

      {task.type === 'reading_tak_nie' && (
        <>
          <div className="mb-3 rounded-xl border border-gray-100 bg-white p-4 text-sm whitespace-pre-wrap">{task.text}</div>
          <div className="mb-4 flex flex-col gap-2">
            {task.items.map((row) => {
              const chosen = takNieAnswers[row.id]
              const ok = takNieChecked && chosen === row.answer
              const bad = takNieChecked && chosen !== undefined && chosen !== row.answer
              return (
                <div key={row.id} className={`rounded-xl border p-3 ${ok ? 'border-green-300 bg-green-50' : bad ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}>
                  <p className="mb-2 text-sm">{language === 'pl' ? row.statement_pl : row.statement}</p>
                  <div className="flex gap-2">
                    <button disabled={timer.isExpired} onClick={() => toggleTakNie(row.id, true)} className={`rounded-lg px-3 py-1 text-xs ${chosen === true ? 'bg-primary text-white' : 'bg-gray-100'} disabled:opacity-50`}>TAK</button>
                    <button disabled={timer.isExpired} onClick={() => toggleTakNie(row.id, false)} className={`rounded-lg px-3 py-1 text-xs ${chosen === false ? 'bg-primary text-white' : 'bg-gray-100'} disabled:opacity-50`}>NIE</button>
                  </div>
                  {takNieChecked && <p className="mt-2 text-xs text-gray-700">{row.explanation}</p>}
                </div>
              )
            })}
          </div>
          <button disabled={timer.isExpired && !takNieChecked} onClick={takNieChecked ? nextTask : checkTakNie} className="w-full rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-50">
            {takNieChecked ? t.b1_next_task : t.b1_check}
          </button>
        </>
      )}

      {task.type === 'fill_fragments' && (
        <>
          <div className="mb-3 rounded-xl border border-gray-100 bg-white p-4 text-sm">
            {task.text_with_gaps.map((part, idx) => (
              <span key={idx}>
                {part.type === 'text' ? part.content : (
                  <select
                    value={gapAnswers[part.id] || ''}
                    onChange={(e) => !timer.isExpired && setGap(String(part.id), e.target.value)}
                    className="mx-1 rounded border border-gray-300 px-1 py-0.5 text-xs"
                  >
                    <option value="">[{part.id}]</option>
                    {task.fragments.map((f) => (
                      <option key={f.id} value={f.id}>{f.id}</option>
                    ))}
                  </select>
                )}
              </span>
            ))}
          </div>
          <div className="mb-4 grid grid-cols-1 gap-2">
            {task.fragments.map((fragment) => (
              <div key={fragment.id} className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs">
                <span className="font-semibold">{fragment.id}.</span> {fragment.text}
              </div>
            ))}
          </div>
          {gapChecked && (
            <div className="mb-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-700">
              {Object.entries(task.explanations).map(([gapId, text]) => (
                <p key={gapId} className="mb-1"><b>{gapId}:</b> {text}</p>
              ))}
            </div>
          )}
          <button disabled={timer.isExpired && !gapChecked} onClick={gapChecked ? nextTask : checkGaps} className="w-full rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-50">
            {gapChecked ? t.b1_finish_reading : t.b1_check}
          </button>
        </>
      )}
    </div>
  )
}
