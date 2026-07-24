import type { Locale, TranslationDict } from './types'
import { en } from './locales/en'
import { ko } from './locales/ko'

const translations: Record<Locale, TranslationDict> = { ko, en }

function getNestedValue(dict: TranslationDict, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as TranslationDict)[part]
    }
    return undefined
  }, dict)
  return typeof value === 'string' ? value : undefined
}

export function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const value = getNestedValue(translations[locale], key) ?? getNestedValue(translations.ko, key) ?? key
  if (!params) return value
  return value.replace(/\{\{(\w+)\}\}/g, (_, name) => String(params[name] ?? `{{${name}}}`))
}

export function formatRelativeTimeLocalized(locale: Locale, date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return translate(locale, 'common.time.justNow')
  if (minutes < 60) return translate(locale, 'common.time.minutesAgo', { minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return translate(locale, 'common.time.hoursAgo', { hours })
  const days = Math.floor(hours / 24)
  if (days < 30) return translate(locale, 'common.time.daysAgo', { days })
  return d.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')
}
