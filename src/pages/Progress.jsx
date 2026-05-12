import { useNavigate } from 'react-router-dom'
import useAppStore from '../store/appStore'
import { topics, getQuestionsByTopic } from '../data/questions'
import { useTranslation } from '../hooks/useTranslation'
import { getDisplayStudiedForTopicDeck } from '../utils/deckProgress'

function TopicBar({ topic, accuracy, studied }) {
  const pct = accuracy !== null ? accuracy : 0
  const barColor = pct >= 80 ? '#3B6D11' : pct >= 60 ? '#F59E0B' : '#A32D2D'
  const textColor = pct >= 80 ? 'text-success' : pct >= 60 ? 'text-amber-600' : 'text-error'
  const notCompletedLabel = {
    uk: 'Не пройдено',
    pl: 'Nieukończono',
  }[topic.language] || 'Не пройдено'
  const studiedCardsLabel = {
    uk: 'карток вивчено',
    pl: 'fiszek ukończono',
  }[topic.language] || 'карток вивчено'

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="text-base">{topic.icon}</span>
          <span className="text-sm font-medium text-gray-800">{topic.label}</span>
        </div>
        <span className={`text-sm font-bold ${accuracy !== null ? textColor : 'text-gray-400'}`}>
          {accuracy !== null ? `${pct}%` : notCompletedLabel}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      {studied > 0 && (
        <p className="text-xs text-gray-400 mt-1">{studied} {studiedCardsLabel}</p>
      )}
    </div>
  )
}

export default function Progress() {
  const navigate = useNavigate()
  const { streak, topicProgress, totalCardsStudied, cardProgress } = useAppStore()
  const { t, language } = useTranslation()

  const topicsWithAccuracy = topics.map(topic => {
    const p = topicProgress[topic.slug] || { studied: 0, correct: 0 }
    const accuracy = p.studied > 0 ? Math.round((p.correct / p.studied) * 100) : null
    const label = topic.labelKey && t[topic.labelKey] ? t[topic.labelKey] : topic.name
    const deck = getQuestionsByTopic(topic.slug).filter(Boolean)
    const displayStudied = getDisplayStudiedForTopicDeck(deck, p, cardProgress[topic.slug])
    return { ...topic, accuracy, studied: displayStudied, correct: p.correct, label, language }
  })

  const studiedTopics = topicsWithAccuracy.filter(t => t.accuracy !== null)
  const weakTopics = studiedTopics.filter(t => t.accuracy < 60)
  const strongTopics = studiedTopics.filter(t => t.accuracy >= 80)

  const totalCorrect = Object.values(topicProgress).reduce((s, p) => s + p.correct, 0)
  const overallAccuracy = totalCardsStudied > 0 ? Math.round((totalCorrect / totalCardsStudied) * 100) : 0
  const topicLabelMap = topics.reduce((acc, topic) => {
    acc[topic.slug] = topic.labelKey && t[topic.labelKey] ? t[topic.labelKey] : topic.name
    return acc
  }, {})
  const recentTopics = Object.entries(cardProgress || {})
    .filter(([, data]) => data?.lastVisited)
    .sort((a, b) => new Date(b[1].lastVisited) - new Date(a[1].lastVisited))
    .slice(0, 3)

  function handleRepeatWeak() {
    if (weakTopics.length > 0) {
      navigate(`/cards?topic=${weakTopics[0].slug}`)
    }
  }

  return (
    <div className="px-4 py-5 fade-in">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{t.progress_title}</h2>

      {/* Overall stats */}
      <div className="bg-primary rounded-xl p-4 mb-5 text-white">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-xs opacity-75 mt-0.5">🔥 {t.progress_streak_short}</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalCardsStudied}</div>
            <div className="text-xs opacity-75 mt-0.5">📚 {t.progress_cards_short}</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{overallAccuracy}%</div>
            <div className="text-xs opacity-75 mt-0.5">🎯 {t.progress_accuracy_short}</div>
          </div>
        </div>
      </div>

      {/* Bar chart by topic */}
      <h3 className="text-base font-bold text-gray-900 mb-3">{t.home_topics}</h3>
      <div className="bg-card rounded-xl p-4 border border-gray-100 mb-5">
        {topicsWithAccuracy.map(t => (
          <TopicBar key={t.slug} topic={t} accuracy={t.accuracy} studied={t.studied} />
        ))}
      </div>
      {recentTopics.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: '500',
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '10px',
          }}>
            {t.progress_recent_activity}
          </p>
          {recentTopics.map(([slug, data]) => (
            <div
              key={slug}
              onClick={() => navigate(`/cards?topic=${slug}`)}
              style={{
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div>
                <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
                  {topicLabelMap[slug] || slug}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                  {t.progress_card_line
                    .replace('{n}', String(data.lastIndex + 1))
                    .replace('{correct}', String(data.answeredIds?.length || 0))}
                </p>
              </div>
              <span style={{
                fontSize: '11px',
                background: '#EAF3DE',
                color: '#27500A',
                padding: '3px 8px',
                borderRadius: '20px',
                fontWeight: '500',
              }}>
                {t.progress_continue_arrow}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Weak topics */}
      {weakTopics.length > 0 && (
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-error inline-block" />
            {t.progress_weak}
          </h3>
          <div className="flex flex-col gap-2">
            {weakTopics.map(t => (
              <div
                key={t.slug}
                className="flex items-center justify-between bg-error-light rounded-xl px-4 py-3 border border-red-100"
              >
                <div className="flex items-center gap-2">
                  <span>{t.icon}</span>
                  <span className="text-sm font-medium text-gray-800">{t.label}</span>
                </div>
                <span className="text-error font-bold text-sm">{t.accuracy}%</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleRepeatWeak}
            className="w-full mt-3 bg-primary text-white font-semibold py-3 rounded-xl text-sm min-h-11"
          >
            {t.progress_practice_weak}
          </button>
        </div>
      )}

      {/* Strong topics */}
      {strongTopics.length > 0 && (
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-success inline-block" />
            {t.progress_strong}
          </h3>
          <div className="flex flex-col gap-2">
            {strongTopics.map(t => (
              <div
                key={t.slug}
                className="flex items-center justify-between bg-success-light rounded-xl px-4 py-3 border border-green-100"
              >
                <div className="flex items-center gap-2">
                  <span>{t.icon}</span>
                  <span className="text-sm font-medium text-gray-800">{t.label}</span>
                </div>
                <span className="text-success font-bold text-sm">{t.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {studiedTopics.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-500 text-sm">{t.progress_total}: 0</p>
          <button
            onClick={() => navigate('/cards?topic=history')}
            className="mt-4 bg-primary text-white font-semibold py-3 px-6 rounded-xl text-sm min-h-11"
          >
            {t.progress_start_learning}
          </button>
        </div>
      )}

      {/* Tip */}
      <div className="mt-2 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <p className="text-sm font-semibold text-blue-800 mb-1">{t.progress_tip_title}</p>
        <p className="text-xs text-blue-700">
          {t.progress_tip_body}
        </p>
      </div>
    </div>
  )
}
