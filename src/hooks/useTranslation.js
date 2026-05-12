import useAppStore from '../store/appStore'
import { translations } from '../i18n/translations'

export function useTranslation() {
  const language = useAppStore((state) => state.language) || 'uk'
  const safeLang = ['uk', 'pl'].includes(language) ? language : 'uk'
  const t = translations[safeLang] || translations.uk
  return { t, language: safeLang }
}
