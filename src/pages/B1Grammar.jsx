import { useMemo, useState } from 'react'
import useAppStore from '../store/appStore'
import { examStructure, grammarTasks } from '../data/b1ExamData'
import useExamTimer from '../hooks/useExamTimer'

const normalize = (value) => (value || '').toString().trim().toLowerCase()

export default function B1Grammar() {
  const language = useAppStore((s) => s.language) || 'uk'
  const b1Progress = useAppStore((s) => s.b1Progress)
  const updateB1Progress = useAppStore((s) => s.updateB1Progress)

  const [taskIdx, setTaskIdx] = useState(0)
  const [itemIdx, setItemIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [typed, setTyped] = useState('')
  const [checked, setChecked] = useState(false)
  const [correctTotal, setCorrectTotal] = useState(0)
  const [finished, setFinished] = useState(false)
  const timer = useExamTimer(45)

  const task = grammarTasks[taskIdx]
  const item = task.items[itemIdx]
  const isChoice = ['declension', 'comparative'].includes(task.type)
  const answerValue = isChoice ? selected : typed

  const isCorrect = useMemo(() => {
    if (!checked) return false
    if (isChoice) return selected === item.correctIndex
    const accepted = [item.answer, ...(item.acceptedAnswers || [])].map(normalize)
    return accepted.includes(normalize(typed))
  }, [checked, isChoice, selected, typed, item])

  function handleCheck() {
    if (checked) return
    if (answerValue === null || normalize(answerValue) === '') return
    const localIsCorrect = isChoice
      ? selected === item.correctIndex
      : [item.answer, ...(item.acceptedAnswers || [])].map(normalize).includes(normalize(typed))
    setChecked(true)
    if (localIsCorrect) setCorrectTotal((v) => v + 1)
  }

  function handleNext() {
    const atLastItem = itemIdx >= task.items.length - 1
    const atLastTask = taskIdx >= grammarTasks.length - 1

    if (atLastItem && atLastTask) {
      const prev = b1Progress.grammar || { completed: 0, correct: 0 }
      const total = grammarTasks.reduce((sum, t) => sum + t.items.length, 0)
      const finalScore = correctTotal
      const sectionMax = examStructure.sections.find((s) => s.id === 'grammar')?.maxPoints || 30
      const normalizedScore = Math.round((finalScore / total) * sectionMax)
      updateB1Progress('grammar', {
        completed: prev.completed + 1,
        correct: prev.correct + finalScore,
        lastScore: normalizedScore,
        lastMax: sectionMax,
      })
      setFinished(true)
      return
    }

    if (atLastItem) {
      setTaskIdx((v) => v + 1)
      setItemIdx(0)
    } else {
      setItemIdx((v) => v + 1)
    }
    setSelected(null)
    setTyped('')
    setChecked(false)
  }

  function restart() {
    setTaskIdx(0)
    setItemIdx(0)
    setSelected(null)
    setTyped('')
    setChecked(false)
    setCorrectTotal(0)
    setFinished(false)
  }

  if (finished) {
    const total = grammarTasks.reduce((sum, t) => sum + t.items.length, 0)
    const score = correctTotal + (isCorrect ? 1 : 0)
    return (
      <div className="px-4 py-5">
        <div className="rounded-xl border border-gray-100 bg-white p-5 text-center">
          <p className="mb-2 text-2xl font-bold">{score}/{total}</p>
          <p className="text-sm text-gray-500">
            {language === 'pl' ? 'Wynik ćwiczenia gramatycznego' : 'Результат граматики'}
          </p>
        </div>
        <button onClick={restart} className="mt-4 w-full rounded-xl bg-primary py-3 font-semibold text-white">
          {language === 'pl' ? 'Powtórz' : 'Повторити'}
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 py-4">
      <div className={`mb-3 rounded-xl border p-3 text-xs ${timer.isExpired ? 'border-red-200 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-700'}`}>
        <b>{language === 'pl' ? 'Czas' : 'Час'}:</b> {timer.label}
        {timer.isExpired && <span> · {language === 'pl' ? 'Czas minął, zakończ próbę.' : 'Час вийшов, заверши спробу.'}</span>}
      </div>
      <p className="mb-1 text-xs text-gray-500">
        {language === 'pl' ? 'Gramatyka B1' : 'Граматика B1'} · {taskIdx + 1}/{grammarTasks.length}
      </p>
      <h1 className="mb-2 text-lg font-bold">{task.title}</h1>
      <p className="mb-4 text-sm text-gray-600">{language === 'pl' ? task.instructions_pl : task.instructions}</p>

      {(task.wordBox || []).length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {task.wordBox.map((word) => (
            <span key={word} className="rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs">
              {word}
            </span>
          ))}
        </div>
      )}

      <div className="mb-2 text-xs text-gray-500">
        {language === 'pl' ? 'Pytanie' : 'Питання'} {itemIdx + 1}/{task.items.length}
      </div>
      <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium">{item.sentence}</div>

      {isChoice ? (
        <div className="mb-4 flex flex-col gap-2">
          {item.options.map((option, idx) => {
            const selectedNow = selected === idx
            const optionCorrect = checked && idx === item.correctIndex
            const optionWrong = checked && selectedNow && idx !== item.correctIndex
            return (
              <button
                key={option}
                onClick={() => !checked && !timer.isExpired && setSelected(idx)}
                className={`rounded-xl border px-3 py-3 text-left text-sm ${
                  optionCorrect ? 'border-green-300 bg-green-50 text-green-700'
                    : optionWrong ? 'border-red-300 bg-red-50 text-red-700'
                      : selectedNow ? 'border-primary bg-red-50'
                        : 'border-gray-200 bg-white'
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>
      ) : (
        <input
          value={typed}
          onChange={(e) => !checked && !timer.isExpired && setTyped(e.target.value)}
          placeholder={language === 'pl' ? 'Wpisz odpowiedź...' : 'Введіть відповідь...'}
          className="mb-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
      )}

      {checked && (
        <div className={`mb-4 rounded-xl p-3 text-sm ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <p className="mb-1 font-semibold">{isCorrect ? '✓ Correct' : '✗ Wrong'}</p>
          <p>{item.explanation}</p>
        </div>
      )}

      <div className="flex gap-2">
        {!checked ? (
          <button disabled={timer.isExpired} onClick={handleCheck} className="w-full rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-50">
            {language === 'pl' ? 'Sprawdź' : 'Перевірити'}
          </button>
        ) : (
          <button onClick={handleNext} className="w-full rounded-xl bg-primary py-3 font-semibold text-white">
            {language === 'pl' ? 'Dalej' : 'Далі'}
          </button>
        )}
      </div>
    </div>
  )
}
