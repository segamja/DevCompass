import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { useAuth } from '@/hooks/useAuth'
import { isSupabaseConfigured } from '@/lib/supabase'
import { disableDemoMode } from '@/lib/demo'
import { useAuthStore } from '@/stores/authStore'
import { useTranslation } from '@/i18n/useTranslation'
import { getVersionLabel } from '@/lib/version'

export default function SettingsPage() {
  const { profile, signInWithGitHub, signOut } = useAuth()
  const isDemo = useAuthStore((s) => s.isDemo)
  const setDemo = useAuthStore((s) => s.setDemo)
  const { t } = useTranslation()

  const handleSignOut = async () => {
    if (isDemo) {
      disableDemoMode()
      setDemo(false)
      window.location.href = '/'
      return
    }
    await signOut()
    window.location.href = '/'
  }

  return (
    <div className="p-margin-desktop max-w-container-max mx-auto space-y-stack-lg">
      <div>
        <h2 className="font-headline-lg text-headline-lg mb-2">{t('settings.title')}</h2>
        <p className="font-body-lg text-on-surface-variant">{t('settings.subtitle')}</p>
      </div>

      <div className="bg-white border border-border-base rounded-2xl divide-y divide-border-base">
        <SettingsRow
          title={t('settings.language')}
          description={t('settings.languageDesc')}
          action={<LanguageSwitcher variant="select" />}
        />
        <SettingsRow
          title={t('settings.githubAccount')}
          description={profile ? `@${profile.github_username}` : t('settings.notConnected')}
          action={
            <Button variant="secondary" size="sm" onClick={signInWithGitHub}>
              <Icon name="sync_alt" />
              {t('settings.reconnect')}
            </Button>
          }
        />
        <SettingsRow
          title={t('settings.supabaseConnection')}
          description={isSupabaseConfigured ? t('settings.configured') : t('settings.missingEnv')}
          action={
            <span className={`font-label-sm ${isSupabaseConfigured ? 'text-success' : 'text-error'}`}>
              {isSupabaseConfigured ? t('settings.active') : t('settings.notConfigured')}
            </span>
          }
        />
        <SettingsRow
          title={t('settings.notifications')}
          description={t('settings.notificationsDesc')}
          action={<input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />}
        />
        <SettingsRow
          title={t('settings.signOut')}
          description={isDemo ? t('settings.signOutDemoDesc') : t('settings.signOutDesc')}
          action={
            <Button variant="secondary" size="sm" onClick={handleSignOut}>
              {isDemo ? t('settings.exitDemo') : t('settings.signOut')}
            </Button>
          }
        />
        <SettingsRow
          title={t('settings.version')}
          description={t('settings.versionDesc')}
          action={
            <span className="font-label-sm text-on-surface-variant font-mono">{getVersionLabel()}</span>
          }
        />
      </div>
    </div>
  )
}

function SettingsRow({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between p-6 gap-4">
      <div>
        <h3 className="font-body-md font-bold">{title}</h3>
        <p className="font-body-sm text-on-surface-variant">{description}</p>
      </div>
      {action}
    </div>
  )
}
