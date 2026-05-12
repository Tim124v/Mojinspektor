import { useNavigate } from 'react-router-dom'
import useAppStore from '../store/appStore'
import { examStructure } from '../data/b1ExamData'

export default function B1Exam() {
  const navigate = useNavigate()
  const language = useAppStore((s) => s.language) || 'uk'
  const b1Progress = useAppStore((s) => s.b1Progress)
  const resetB1Progress = useAppStore((s) => s.resetB1Progress)

  const sectionRoutes = {
    listening: '/b1exam/listening',
    reading: '/b1exam/reading',
    grammar: '/b1exam/grammar',
    writing: '/b1exam/writing',
    speaking: '/b1exam/speaking',
  }

  const sectionColors = {
    listening: { bg: '#E6F1FB', border: '#B5D4F4', text: '#0C447C', icon: '🎧' },
    reading: { bg: '#EAF3DE', border: '#97C459', text: '#27500A', icon: '📖' },
    grammar: { bg: '#FAEEDA', border: '#FAC775', text: '#633806', icon: '✏️' },
    writing: { bg: '#EEEDFE', border: '#AFA9EC', text: '#3C3489', icon: '📝' },
    speaking: { bg: '#FCEBEB', border: '#F09595', text: '#A32D2D', icon: '🗣️' },
  }

  const sectionResults = examStructure.sections.map((section) => {
    const stat = b1Progress?.[section.id] || {}
    const score = stat.lastScore
    const max = stat.lastMax || section.maxPoints
    const passed = typeof score === 'number' ? score >= section.passingPoints : null
    return { section, score, max, passed }
  })

  function handleResetB1() {
    const msg = language === 'pl'
      ? 'Na pewno chcesz zresetować cały postęp B1?'
      : 'Точно скинути весь прогрес B1?'
    if (!window.confirm(msg)) return
    resetB1Progress()
  }

  return (
    <div style={{ maxWidth: '430px', margin: '0 auto', paddingBottom: '100px' }}>
      <div style={{ background: '#DC143C', padding: '20px 20px 24px' }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
          {language === 'pl' ? 'Przygotowanie do egzaminu' : 'Підготовка до іспиту'}
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: '500', color: '#fff', margin: '0 0 4px' }}>
          {language === 'pl' ? 'Egzamin B1' : 'Державний екзамен B1'}
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
          {language === 'pl'
            ? 'Egzamin certyfikatowy z języka polskiego jako obcego'
            : 'Підготовка до офіційного іспиту польської мови'}
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
          {language === 'pl' ? 'Struktura egzaminu' : 'Структура іспиту'}
        </p>
        <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', padding: '8px 14px', background: 'var(--color-background-secondary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '500' }}>{language === 'pl' ? 'Część' : 'Частина'}</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '500', textAlign: 'right', marginRight: '16px' }}>{language === 'pl' ? 'Czas' : 'Час'}</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '500', textAlign: 'right' }}>{language === 'pl' ? 'Pkt' : 'Балів'}</span>
          </div>
          {examStructure.sections.map((section, i) => (
            <div key={section.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', padding: '10px 14px', borderBottom: i < examStructure.sections.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>{sectionColors[section.id].icon}</span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{section.name[language] || section.name.uk}</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'right', marginRight: '16px' }}>{section.timeMinutes} хв</span>
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-primary)', textAlign: 'right' }}>{section.maxPoints}</span>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '10px 14px', background: '#FCEBEB', borderTop: '0.5px solid #F09595' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#A32D2D' }}>{language === 'pl' ? 'RAZEM' : 'РАЗОМ'}</span>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#A32D2D' }}>160 {language === 'pl' ? 'pkt' : 'балів'}</span>
          </div>
        </div>

        <div style={{ background: '#FAEEDA', border: '0.5px solid #FAC775', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', color: '#633806', margin: 0 }}>
            ⚠️ {language === 'pl'
              ? 'Zdajesz gdy uzyskasz minimum 50% z KAŻDEJ części osobno.'
              : 'Складаєш коли отримаєш мінімум 50% з КОЖНОЇ частини окремо.'}
          </p>
        </div>

        <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: '12px', padding: '12px', marginBottom: '20px' }}>
          <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 600 }}>
            {language === 'pl' ? 'Wynik ostatniej próby (PASS/FAIL)' : 'Результат останньої спроби (PASS/FAIL)'}
          </p>
          {sectionResults.map(({ section, score, max, passed }) => (
            <div key={section.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderTop: '0.5px solid #f0f0f0' }}>
              <span style={{ fontSize: '12px' }}>{section.name[language] || section.name.uk}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: passed === null ? '#9ca3af' : passed ? '#166534' : '#991b1b' }}>
                {typeof score === 'number'
                  ? `${score}/${max} · ${passed ? 'PASS' : 'FAIL'}`
                  : (language === 'pl' ? 'Brak wyniku' : 'Немає результату')}
              </span>
            </div>
          ))}
          <button
            onClick={handleResetB1}
            style={{
              width: '100%',
              marginTop: '10px',
              border: '0.5px solid #F09595',
              background: '#FCEBEB',
              color: '#A32D2D',
              borderRadius: '10px',
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {language === 'pl' ? 'Resetuj wyniki B1' : 'Скинути результати B1'}
          </button>
        </div>

        <p style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
          {language === 'pl' ? 'Ćwicz każdą część' : 'Практикуй кожну частину'}
        </p>

        {examStructure.sections.map((section) => {
          const colors = sectionColors[section.id]
          const completed = b1Progress?.[section.id]?.completed || 0
          return (
            <div
              key={section.id}
              onClick={() => navigate(sectionRoutes[section.id])}
              style={{
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '10px',
                cursor: 'pointer',
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                {colors.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--color-text-primary)', margin: 0 }}>
                    {section.name[language] || section.name.uk}
                  </p>
                  <span style={{ fontSize: '11px', background: colors.bg, color: colors.text, padding: '2px 8px', borderRadius: '20px', fontWeight: '500', flexShrink: 0, marginLeft: '8px' }}>
                    {section.maxPoints} {language === 'pl' ? 'pkt' : 'балів'}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 8px', lineHeight: '1.4' }}>
                  {section.description[language] || section.description.uk}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                    ⏱ {section.timeMinutes} {language === 'pl' ? 'minut' : 'хвилин'} · {section.taskCount} {language === 'pl' ? 'завдань' : 'завдань'}
                  </span>
                  <span style={{ fontSize: '12px', color: colors.text, fontWeight: '500' }}>
                    {completed > 0 ? `${completed} ${language === 'pl' ? 'ukończono' : 'виконано'}` : (language === 'pl' ? 'Ćwicz →' : 'Практикувати →')}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
