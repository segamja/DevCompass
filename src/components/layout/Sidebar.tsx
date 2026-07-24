import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/shared/Icon'
import { NAV_ITEMS } from '@/lib/navigation'
import { Button } from '@/components/ui/button'
import { useAnalyzeDNA } from '@/hooks/useAnalyzeDNA'
import { useTranslation } from '@/i18n/useTranslation'

export function Sidebar() {
  const { analyze, isLoading } = useAnalyzeDNA()
  const { t } = useTranslation()

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-muted border-r border-border-base flex flex-col py-stack-lg z-50">
      <div className="px-6 mb-8">
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface">DevCompass</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70 uppercase tracking-widest mt-1">
          {t('landing.tagline')}
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'text-primary font-bold border-r-2 border-primary bg-surface-subtle'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-subtle',
              )
            }
          >
            <Icon name={item.icon} />
            <span className="font-body-md text-body-md">{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-6 pt-stack-md">
        <Button className="w-full" onClick={() => analyze()} disabled={isLoading}>
          <Icon name="bolt" filled />
          {isLoading ? t('common.analyzing') : t('appShell.analyzeDna')}
        </Button>
      </div>
    </aside>
  )
}
