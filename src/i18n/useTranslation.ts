import { useCallback } from 'react'
import { translate } from './translate'
import type { Locale } from './types'
import { useLocaleStore } from '@/stores/localeStore'

const DOMAIN_KEY_MAP: Record<string, string> = {
  Backend: 'domains.backend',
  Frontend: 'domains.frontend',
  AI: 'domains.ai',
  Database: 'domains.database',
  DevOps: 'domains.devOps',
  Cloud: 'domains.cloud',
  Documentation: 'domains.documentation',
  Collaboration: 'domains.collaboration',
}

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale)
  const setLocale = useLocaleStore((s) => s.setLocale)

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(locale, key, params),
    [locale],
  )

  return { t, locale, setLocale }
}

export function getDomainLabel(locale: Locale, domain: string): string {
  const key = DOMAIN_KEY_MAP[domain]
  return key ? translate(locale, key) : domain
}
