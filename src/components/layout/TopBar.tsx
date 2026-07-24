import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/shared/Icon'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { useSyncGitHub } from '@/hooks/useSyncGitHub'
import { useTranslation } from '@/i18n/useTranslation'

interface TopBarProps {
  searchPlaceholder?: string
}

export function TopBar({ searchPlaceholder }: TopBarProps) {
  const profile = useAuthStore((s) => s.profile)
  const navigate = useNavigate()
  const { sync, isSyncing } = useSyncGitHub()
  const { t } = useTranslation()

  return (
    <header className="h-16 px-margin-desktop sticky top-0 z-40 bg-surface-bg border-b border-border-base flex justify-between items-center">
      <div className="flex items-center w-1/3">
        <div className="relative w-full max-w-sm">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-subtle border-none rounded-full focus:ring-2 focus:ring-primary/20 text-body-sm font-body-sm transition-all"
            placeholder={searchPlaceholder}
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-border-base pr-6">
          <button type="button" className="text-on-surface-variant hover:text-primary transition-colors relative">
            <Icon name="notifications" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-white" />
          </button>
          <button
            type="button"
            className="text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => sync()}
            disabled={isSyncing}
            title={t('common.syncGitHub')}
          >
            <Icon name="sync_alt" className={isSyncing ? 'animate-spin' : ''} />
          </button>
        </div>
        <Button
          variant="outline"
          className="rounded-full border-primary text-primary hover:bg-primary hover:text-white"
          onClick={() => navigate('/career-coach')}
        >
          <Icon name="assistant" />
          {t('appShell.aiAssistant')}
        </Button>
        <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-border-base">
          {profile?.avatar_url ? (
            <img className="w-full h-full object-cover" src={profile.avatar_url} alt={profile.github_username} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
              <Icon name="person" />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
