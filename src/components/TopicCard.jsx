import { useNavigate } from 'react-router-dom'
import ProgressBar from './ProgressBar'
import useAppStore from '../store/appStore'
import { useTranslation } from '../hooks/useTranslation'
import { getQuestionsByTopic } from '../data/questions'
import { getDisplayStudiedForTopicDeck } from '../utils/deckProgress'

export default function TopicCard({ topic }) {
  const navigate = useNavigate()
  const topicProgress = useAppStore(s => s.topicProgress)
  const cardProgress = useAppStore(s => s.cardProgress)
  const { t } = useTranslation()
  const deck = topic.slug ? getQuestionsByTopic(topic.slug).filter(Boolean) : []
  const totalCards = deck.length > 0 ? deck.length : (topic.totalCards ?? 0)
  const progress = topicProgress[topic.slug] || { studied: 0, correct: 0 }
  const cardEntry = topic.slug ? cardProgress[topic.slug] : null
  const displayStudied =
    deck.length > 0
      ? getDisplayStudiedForTopicDeck(deck, progress, cardEntry)
      : Math.min(progress.studied, totalCards)
  const completionPct =
    totalCards > 0 ? Math.min(100, Math.round((displayStudied / totalCards) * 100)) : 0
  const accuracyPct =
    progress.studied > 0 ? Math.round((progress.correct / progress.studied) * 100) : null

  const label = topic.labelKey && t[topic.labelKey] ? t[topic.labelKey] : topic.name

  return (
    <button
      onClick={() => navigate(topic.path || `/cards?topic=${topic.slug}`)}
      className="w-full bg-card rounded-xl p-4 text-left border border-gray-100 active:scale-98 transition-transform"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{topic.icon}</span>
          <span className="font-semibold text-gray-900 text-sm">{label}</span>
        </div>
        <span className="text-xs text-gray-600">
          {displayStudied}/{totalCards}
          {accuracyPct != null && (
            <span className="ml-2 text-gray-600">· {accuracyPct}%</span>
          )}
        </span>
      </div>
      <ProgressBar value={displayStudied} max={totalCards} />
      <div className="mt-1.5 text-xs text-gray-600">
        {t.topic_card_deck_progress}: {completionPct}% · {t.progress_accuracy}:{' '}
        {accuracyPct != null ? `${accuracyPct}%` : '—'}
      </div>
    </button>
  )
}
