import { LANGUAGES } from '../i18n/translations'
import useAppStore from '../store/appStore'
import { useTranslation } from '../hooks/useTranslation'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useAppStore()
  const { t } = useTranslation()

  return (
    <div style={{ padding: '16px 0' }}>
      <p style={{
        fontSize: '12px',
        fontWeight: '500',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '10px'
      }}>
        {t.settings_language}
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              border: language === lang.code
                ? '2px solid #DC143C'
                : '1px solid #E5E7EB',
              background: language === lang.code ? '#FCEBEB' : 'transparent',
              color: language === lang.code ? '#A32D2D' : '#374151',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: language === lang.code ? '600' : '400',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: '16px' }}>{lang.flag}</span>
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}
