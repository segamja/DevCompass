import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from '@/i18n/useTranslation'

interface AppShellProps {
  searchPlaceholder?: string
  fullHeight?: boolean
}

export function AppShell({ searchPlaceholder, fullHeight }: AppShellProps) {
  const isDemo = useAuthStore((s) => s.isDemo)
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={fullHeight ? 'flex-1 ml-[260px] h-screen flex flex-col overflow-hidden' : 'flex-1 ml-[260px] min-h-screen flex flex-col'}>
        {isDemo && (
          <div className="bg-secondary/10 border-b border-secondary/20 px-margin-desktop py-2 text-center font-label-sm text-secondary">
            {t('appShell.demoBanner')}
          </div>
        )}
        <TopBar searchPlaceholder={searchPlaceholder ?? t('appShell.searchDefault')} />
        <div className={fullHeight ? 'flex-1 overflow-hidden' : 'flex-1'}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export function CareerCoachShell() {
  const { t } = useTranslation()
  return <AppShell fullHeight searchPlaceholder={t('appShell.searchCareer')} />
}
