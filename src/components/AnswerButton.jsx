
export default function AnswerButton({ text, state, onClick, disabled }) {
  const baseClass = "w-full min-h-11 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 border"

  let variantClass = "bg-white border-gray-200 text-gray-800 active:scale-98"
  if (state === 'correct') {
    variantClass = "bg-success-light border-success text-success"
  } else if (state === 'wrong') {
    variantClass = "bg-error-light border-error text-error"
  } else if (state === 'highlight') {
    variantClass = "bg-success-light border-success text-success"
  }

  return (
    <button
      className={`${baseClass} ${variantClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center gap-2">
        {state === 'correct' && <span className="text-base flex-shrink-0">✓</span>}
        {state === 'wrong' && <span className="text-base flex-shrink-0">✗</span>}
        <span>{text}</span>
      </div>
    </button>
  )
}
