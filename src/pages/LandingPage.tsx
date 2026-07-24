import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { useAnalysisStore } from '@/stores/analysisStore'
import { DEMO_PROFILE, DEMO_ANALYSIS, enableDemoMode } from '@/lib/demo'
import { isSupabaseConfigured } from '@/lib/supabase'
import { useTranslation } from '@/i18n/useTranslation'

const FEATURE_KEYS = [
  { icon: 'strikethrough_s', titleKey: 'landing.features.dna.title', descKey: 'landing.features.dna.desc' },
  { icon: 'analytics', titleKey: 'landing.features.skill.title', descKey: 'landing.features.skill.desc' },
  { icon: 'timeline', titleKey: 'landing.features.timeline.title', descKey: 'landing.features.timeline.desc' },
  { icon: 'psychology', titleKey: 'landing.features.coach.title', descKey: 'landing.features.coach.desc' },
  { icon: 'person_pin', titleKey: 'landing.features.portfolio.title', descKey: 'landing.features.portfolio.desc' },
] as const

export default function LandingPage() {
  const { signInWithGitHub, session, authReady, isConfigured } = useAuth()
  const navigate = useNavigate()
  const setDemo = useAuthStore((s) => s.setDemo)
  const setProfile = useAuthStore((s) => s.setProfile)
  const setAnalysis = useAnalysisStore((s) => s.setAnalysis)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  if (authReady && session && !useAuthStore.getState().isDemo) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const handleGitHubLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithGitHub()
    } catch (e) {
      setError(e instanceof Error ? e.message : t('landing.loginError'))
      setLoading(false)
    }
  }

  const enterDemo = () => {
    enableDemoMode()
    setDemo(true)
    setProfile(DEMO_PROFILE)
    setAnalysis(DEMO_ANALYSIS)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="px-margin-desktop py-6 flex justify-between items-center max-w-container-max mx-auto">
        <div>
          <h1 className="font-headline-md text-headline-md font-bold">DevCompass</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">{t('landing.tagline')}</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button onClick={handleGitHubLogin} disabled={loading || !isConfigured}>
            <Icon name="login" />
            {loading ? t('landing.signInConnecting') : t('landing.signIn')}
          </Button>
        </div>
      </header>

      <section className="px-margin-desktop py-20 max-w-container-max mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-label-sm mb-8">
          <Icon name="auto_awesome" />
          {t('landing.badge')}
        </div>
        <h2 className="font-headline-xl text-headline-xl text-on-surface mb-6 max-w-3xl mx-auto">
          {t('landing.heroTitle')}
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
          {t('landing.heroDesc')}
        </p>

        {!isConfigured && (
          <div className="max-w-xl mx-auto mb-8 p-4 bg-error-container text-on-error-container rounded-xl text-left font-body-sm">
            <p className="font-bold mb-2">{t('landing.supabaseRequired')}</p>
            <p>{t('landing.supabaseRequiredDesc')}</p>
          </div>
        )}

        {error && (
          <div className="max-w-xl mx-auto mb-8 p-4 bg-error-container text-on-error-container rounded-xl font-body-sm">
            {error}
          </div>
        )}

        {isSupabaseConfigured && (
          <p className="font-label-sm text-success mb-6">{t('landing.supabaseReady')}</p>
        )}

        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" onClick={handleGitHubLogin} disabled={loading || !isConfigured}>
            <Icon name="login" />
            {loading ? t('landing.redirecting') : t('landing.getStarted')}
          </Button>
          <Button size="lg" variant="secondary" onClick={enterDemo}>
            <Icon name="visibility" />
            {t('landing.demoPreview')}
          </Button>
        </div>
      </section>

      <section className="px-margin-desktop py-16 max-w-container-max mx-auto">
        <h3 className="font-headline-lg text-headline-lg text-center mb-12">{t('landing.featuresTitle')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {FEATURE_KEYS.map((f) => (
            <div key={f.titleKey} className="p-8 bg-white border border-border-base rounded-2xl hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon name={f.icon} />
              </div>
              <h4 className="font-headline-md text-headline-md mb-2">{t(f.titleKey)}</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-margin-desktop py-8 border-t border-border-base text-center text-on-surface-variant font-body-sm">
        {t('landing.footer')}
      </footer>
    </div>
  )
}
