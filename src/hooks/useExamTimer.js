import { useCallback, useEffect, useMemo, useState } from 'react'

function formatTime(seconds) {
  const safe = Math.max(0, seconds)
  const mins = Math.floor(safe / 60)
  const secs = safe % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default function useExamTimer(totalMinutes) {
  const totalSeconds = totalMinutes * 60
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const isExpired = secondsLeft <= 0

  useEffect(() => {
    if (isExpired) return undefined
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [isExpired])

  const label = useMemo(() => formatTime(secondsLeft), [secondsLeft])

  const reset = useCallback(() => {
    setSecondsLeft(totalSeconds)
  }, [totalSeconds])

  return { secondsLeft, isExpired, label, reset }
}
