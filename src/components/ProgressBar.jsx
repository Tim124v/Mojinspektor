
export default function ProgressBar({ value, max, color = '#DC143C', className = '' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0

  return (
    <div className={`w-full bg-gray-100 rounded-full h-2 ${className}`}>
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}
