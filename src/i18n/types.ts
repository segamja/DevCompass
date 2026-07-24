export type Locale = 'ko' | 'en'

export const DEFAULT_LOCALE: Locale = 'ko'

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
}

export type TranslationDict = {
  [key: string]: string | TranslationDict
}
