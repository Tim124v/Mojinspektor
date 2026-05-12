import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopicCard from '../components/TopicCard'
import SectionCard from '../components/SectionCard'
import LanguageSwitcher from '../components/LanguageSwitcher'
import PremiumBadge from '../components/PremiumBadge'
import useAppStore from '../store/appStore'
import { FREEMIUM } from '../config/freemium'
import { topics, getQuestionsByTopic } from '../data/questions'
import { useTranslation } from '../hooks/useTranslation'
import { useIsPremium } from '../hooks/useIsPremium'
import AppLogo from '../components/AppLogo.jsx'
import { getDisplayStudiedForTopicDeck } from '../utils/deckProgress'

export default function Home() {
  const navigate = useNavigate()
  const {
    streak,
    cardsLearnedToday,
    totalCardsStudied,
    topicProgress,
    updateStreak,
    b1Progress,
    residentProgress,
    cardProgress,
    inspectorSession,
    b1WritingDraft,
  } = useAppStore()
  const isPremium = useIsPremium()
  const { t } = useTranslation()

  useEffect(() => {
    updateStreak()
  }, [])

  const totalCorrect = Object.values(topicProgress).reduce((s, p) => s + (p.correct || 0), 0)
  const overallAccuracy = totalCardsStudied > 0 ? Math.round((totalCorrect / totalCardsStudied) * 100) : 0

  const b1Total = b1Progress.writing.completed
    + b1Progress.speaking.completed
    + b1Progress.reading.completed
    + b1Progress.listening.completed
    + (b1Progress.grammar?.completed || 0)
  const b1Progress_pct = Math.min(100, Math.round((b1Total / 20) * 100))

  const residentPct = Math.min(100, Math.round((residentProgress.cardsStudied / 30) * 100))
  const kartaTopicSlugs = ['history', 'culture', 'symbols', 'inspector', 'government', 'geography', 'znani_zywy', 'znani_hist']
  const kartaHasProgress = Object.keys(cardProgress || {}).some((slug) =>
    kartaTopicSlugs.includes(slug) && (cardProgress[slug]?.lastIndex || 0) > 0
  )
  const inspectorHasProgress = inspectorSession?.isActive
  const b1HasDraft = !!b1WritingDraft?.draftText

  const kartaStudied = kartaTopicSlugs.reduce((sum, slug) => {
    const deck = getQuestionsByTopic(slug).filter(Boolean)
    const p = topicProgress[slug] || { studied: 0, correct: 0 }
    return sum + getDisplayStudiedForTopicDeck(deck, p, cardProgress[slug])
  }, 0)
  const kartaTarget = kartaTopicSlugs.reduce((s, slug) => s + getQuestionsByTopic(slug).length, 0) || 1
  const kartaPct = Math.min(100, Math.round((kartaStudied / kartaTarget) * 100))

  const sections = [
    {
      icon: <AppLogo size={28} className="drop-shadow-sm" />,
      title: t.home_section_karta_title,
      description: t.home_section_karta_desc,
      path: '/cards',
      progress: kartaPct,
      status: getSectionStatus(kartaPct),
      color: '#DC143C',
      resumeBadge: kartaHasProgress
        ? {
            label: t.home_resume_arrow,
            background: '#EAF3DE',
            color: '#27500A',
          }
        : null,
    },
    {
      icon: '🏛️',
      title: t.home_section_resident_title,
      description: t.home_section_resident_desc,
      path: '/resident',
      progress: residentPct,
      status: getSectionStatus(residentPct),
      color: '#3B82F6',
    },
    {
      icon: '🎓',
      title: t.home_section_b1_title,
      description: t.home_section_b1_desc,
      path: '/b1exam',
      progress: b1Progress_pct,
      status: getSectionStatus(b1Progress_pct),
      color: '#8B5CF6',
      resumeBadge: b1HasDraft
        ? {
            label: t.home_draft_badge,
            background: '#E6F1FB',
            color: '#0C447C',
          }
        : null,
    },
    {
      icon: '👨‍💼',
      title: t.home_section_inspector_title,
      description: t.home_section_inspector_desc,
      path: '/inspector',
      progress: undefined,
      status: 'not_started',
      color: '#F59E0B',
      resumeBadge: inspectorHasProgress
        ? {
            label: t.home_resume_arrow,
            background: '#EAF3DE',
            color: '#27500A',
          }
        : null,
    },
  ]

  function getSectionStatus(pct) {
    if (pct === 0) return 'not_started'
    if (pct >= 80) return 'ready'
    return 'in_progress'
  }

  return (
    <div className="px-4 py-5 fade-in">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-3 ring-1 ring-gray-100 shadow-sm p-1">
          <AppLogo size={56} />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">MójInspektor</h1>
          <PremiumBadge />
        </div>
        <p className="text-sm text-gray-600 text-center mt-1">
          {t.home_subtitle}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card rounded-xl p-3 text-center border border-gray-100">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-xl font-bold text-gray-900">{streak}</div>
          <div className="text-xs text-gray-600">{t.home_streak}</div>
        </div>
        <div className="bg-card rounded-xl p-3 text-center border border-gray-100">
          <div className="text-2xl mb-1">📚</div>
          <div className="text-xl font-bold text-gray-900">{cardsLearnedToday}</div>
          <div className="text-xs text-gray-600">{t.home_cards_today}</div>
        </div>
        <div className="bg-card rounded-xl p-3 text-center border border-gray-100">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-xl font-bold text-gray-900">{overallAccuracy}%</div>
          <div className="text-xs text-gray-600">{t.home_accuracy}</div>
        </div>
      </div>

      {!isPremium && (
        <div
          onClick={() => navigate('/upgrade')}
          className="mb-4 flex cursor-pointer items-center justify-between rounded-xl border border-amber-300 bg-amber-100 px-4 py-3"
        >
          <div>
            <p className="text-sm font-semibold text-amber-800">{t.home_premium_title}</p>
            <p className="text-xs text-amber-700">
              {t.home_premium_desc.replace('{price}', String(FREEMIUM.PRICE_PLN))}
            </p>
          </div>
          <span className="text-amber-700">›</span>
        </div>
      )}

      <h2 className="text-base font-bold text-gray-900 mb-3">{t.home_sections}</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {sections.map((section) => (
          <SectionCard
            key={section.path}
            icon={section.icon}
            title={section.title}
            description={section.description}
            path={section.path}
            progress={section.progress}
            status={section.status}
            color={section.color}
            resumeBadge={section.resumeBadge}
          />
        ))}
      </div>

      <h2 className="text-base font-bold text-gray-900 mb-3">{t.home_topics}</h2>
      <div className="flex flex-col gap-3 mb-6">
        {topics.map(topic => (
          <TopicCard key={topic.slug} topic={topic} />
        ))}
      </div>

      <div
        style={{
          marginTop: '24px',
          borderTop: '0.5px solid var(--color-border-tertiary, #E5E7EB)',
          paddingTop: '16px',
          marginBottom: '16px',
        }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
          <Link to="/privacy" className="font-medium text-primary underline">
            {t.nav_privacy}
          </Link>
          <Link to="/terms" className="font-medium text-primary underline">
            {t.nav_terms}
          </Link>
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  )
}
