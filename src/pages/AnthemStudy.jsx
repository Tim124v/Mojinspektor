import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { polishAnthem } from '../data/anthem'
import useAppStore from '../store/appStore'

export default function AnthemStudy() {
  const navigate = useNavigate()
  const language = useAppStore(s => s.language) || 'uk'
  const [showTranslation, setShowTranslation] = useState(false)
  const [learnMode, setLearnMode] = useState(false)
  const [revealedLines, setRevealedLines] = useState({})

  const toggleLine = (verseIdx, lineIdx) => {
    const key = `${verseIdx}-${lineIdx}`
    setRevealedLines(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div style={{ maxWidth: '430px', margin: '0 auto', paddingBottom: '100px' }}>
      <div style={{
        background: '#DC143C',
        padding: '20px 20px 24px',
        position: 'relative',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 12px',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '12px',
          }}
        >
          ← {language === 'pl' ? 'Wróć' : 'Назад'}
        </button>
        <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#fff', margin: '0 0 4px' }}>
          {polishAnthem.title}
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
          {polishAnthem.subtitle}
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{
          background: 'var(--color-background-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '16px',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: '0 0 8px' }}>
            {polishAnthem.info[language] || polishAnthem.info.uk}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', margin: 0 }}>
            {polishAnthem.author[language] || polishAnthem.author.uk}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => setLearnMode(false)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: !learnMode ? '2px solid #DC143C' : '0.5px solid var(--color-border-secondary)',
              background: !learnMode ? '#FCEBEB' : 'transparent',
              color: !learnMode ? '#A32D2D' : 'var(--color-text-secondary)',
              fontSize: '13px',
              fontWeight: !learnMode ? '500' : '400',
              cursor: 'pointer',
            }}
          >
            {language === 'pl' ? '📖 Czytaj' : '📖 Читати'}
          </button>
          <button
            onClick={() => { setLearnMode(true); setRevealedLines({}) }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: learnMode ? '2px solid #DC143C' : '0.5px solid var(--color-border-secondary)',
              background: learnMode ? '#FCEBEB' : 'transparent',
              color: learnMode ? '#A32D2D' : 'var(--color-text-secondary)',
              fontSize: '13px',
              fontWeight: learnMode ? '500' : '400',
              cursor: 'pointer',
            }}
          >
            {language === 'pl' ? '🧠 Zapamiętaj' : '🧠 Вчити'}
          </button>
        </div>

        {polishAnthem.verses.map((verse, vIdx) => (
          <div key={vIdx} style={{ marginBottom: '16px' }}>
            {!verse.isRefrain && (
              <p style={{
                fontSize: '11px',
                fontWeight: '500',
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px',
              }}>
                {language === 'pl'
                  ? (verse.isMain ? 'Zwrotka 1 (najważniejsza)' : `Zwrotka ${verse.number}`)
                  : (verse.isMain ? 'Куплет 1 (найважливіший)' : `Куплет ${verse.number}`)
                }
              </p>
            )}
            {verse.isRefrain && vIdx === 1 && (
              <p style={{
                fontSize: '11px',
                fontWeight: '500',
                color: '#DC143C',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px',
              }}>
                {language === 'pl' ? 'Refren' : 'Приспів'}
              </p>
            )}

            <div style={{
              background: verse.isMain
                ? '#FCEBEB'
                : verse.isRefrain
                  ? 'var(--color-background-secondary)'
                  : 'var(--color-background-primary)',
              border: verse.isMain
                ? '0.5px solid #F09595'
                : '0.5px solid var(--color-border-tertiary)',
              borderRadius: '12px',
              padding: '14px 16px',
            }}>
              {verse.lines.map((line, lIdx) => (
                <div key={lIdx}>
                  {learnMode ? (
                    <div
                      onClick={() => toggleLine(vIdx, lIdx)}
                      style={{
                        padding: '4px 0',
                        cursor: 'pointer',
                        minHeight: '28px',
                      }}
                    >
                      {revealedLines[`${vIdx}-${lIdx}`] ? (
                        <span style={{
                          fontSize: '16px',
                          color: verse.isMain ? '#A32D2D' : 'var(--color-text-primary)',
                          fontFamily: 'var(--font-serif)',
                          lineHeight: '1.7',
                        }}>
                          {line}
                        </span>
                      ) : (
                        <div style={{
                          height: '20px',
                          background: verse.isMain ? '#F09595' : 'var(--color-border-secondary)',
                          borderRadius: '4px',
                          marginTop: '4px',
                          opacity: 0.4,
                        }} />
                      )}
                    </div>
                  ) : (
                    <p style={{
                      fontSize: '16px',
                      color: verse.isMain ? '#A32D2D' : 'var(--color-text-primary)',
                      fontFamily: 'var(--font-serif)',
                      lineHeight: '1.7',
                      margin: '2px 0',
                    }}>
                      {line}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {learnMode && (
          <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', textAlign: 'center', marginBottom: '16px' }}>
            {language === 'pl'
              ? 'Dotknij linię aby odkryć słowa'
              : 'Натисни на рядок щоб відкрити слова'
            }
          </p>
        )}

        <button
          onClick={() => setShowTranslation(!showTranslation)}
          style={{
            width: '100%',
            background: 'transparent',
            border: '0.5px solid var(--color-border-secondary)',
            borderRadius: '10px',
            padding: '12px',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          {showTranslation
            ? (language === 'pl' ? '▲ Ukryj tłumaczenie' : '▲ Сховати переклад')
            : (language === 'pl' ? '▼ Pokaż tłumaczenie na ukraiński' : '▼ Показати переклад українською')
          }
        </button>

        {showTranslation && (
          <div style={{
            background: 'var(--color-background-secondary)',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '16px',
          }}>
            <p style={{
              fontSize: '11px',
              fontWeight: '500',
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '10px',
            }}>
              {language === 'pl' ? 'Tłumaczenie (ukraiński)' : 'Переклад українською'}
            </p>
            {polishAnthem.translation.uk.map((line, i) => (
              <p key={i} style={{
                fontSize: '14px',
                color: line === '---' ? 'var(--color-border-primary)' : 'var(--color-text-secondary)',
                fontStyle: 'italic',
                lineHeight: '1.7',
                margin: line === '---' ? '8px 0' : '2px 0',
              }}>
                {line === '---' ? '— — —' : line}
              </p>
            ))}
          </div>
        )}

        <p style={{
          fontSize: '11px',
          fontWeight: '500',
          color: 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '10px',
        }}>
          {language === 'pl' ? 'Ważne fakty' : 'Важливі факти'}
        </p>
        <div style={{
          background: 'var(--color-background-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: '12px',
          padding: '8px 16px',
        }}>
          {(polishAnthem.keyFacts[language] || polishAnthem.keyFacts.uk).map((fact, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '10px',
              padding: '8px 0',
              borderBottom: i < (polishAnthem.keyFacts[language] || polishAnthem.keyFacts.uk).length - 1
                ? '0.5px solid var(--color-border-tertiary)'
                : 'none',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#DC143C',
                flexShrink: 0,
                marginTop: '7px',
              }} />
              <span style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: '1.5' }}>
                {fact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

