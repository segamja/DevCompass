import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale } from '@/i18n/types'
import { DEFAULT_LOCALE } from '@/i18n/types'

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'devcompass-locale' },
  ),
)
