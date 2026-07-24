import { LOCALE_LABELS, type Locale } from '@/i18n/types'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  className?: string
  variant?: 'inline' | 'select'
}

export function LanguageSwitcher({ className, variant = 'inline' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation()

  if (variant === 'select') {
    return (
      <select
        className={cn('px-3 py-2 rounded-lg border border-border-base bg-white font-body-sm', className)}
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label="Language"
      >
        {(Object.keys(LOCALE_LABELS) as Locale[]).map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    )
  }

  return (
    <div className={cn('inline-flex rounded-lg border border-border-base overflow-hidden', className)}>
      {(Object.keys(LOCALE_LABELS) as Locale[]).map((code) => (
        <button
          key={code}
          type="button"
          className={cn(
            'px-3 py-1.5 font-label-sm transition-colors',
            locale === code ? 'bg-primary text-white' : 'bg-white text-on-surface-variant hover:bg-surface-subtle',
          )}
          onClick={() => setLocale(code)}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  )
}
