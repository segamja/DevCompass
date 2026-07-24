import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { getAppOrigin, getCanonicalAppOrigin, supabase } from '@/lib/supabase'
import { profileFromSession } from '@/lib/authProfile'
import { api } from '@/lib/api'
import { disableDemoMode } from '@/lib/demo'
import { useAuthStore } from '@/stores/authStore'
import { Icon } from '@/components/shared/Icon'
import { useTranslation } from '@/i18n/useTranslation'

async function resolveSession(): Promise<Session | null> {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) throw error
    return data.session
  }

  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

function storeSession(session: Session) {
  disableDemoMode()
  useAuthStore.getState().setDemo(false)
  useAuthStore.getState().setSession(session)
  useAuthStore.getState().setProfile(profileFromSession(session))
}

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    let cancelled = false

    async function finishAuth() {
      const params = new URLSearchParams(window.location.search)
      const authError = params.get('error_description') || params.get('error')

      if (authError) {
        setError(decodeURIComponent(authError))
        return
      }

      const canonicalOrigin = getCanonicalAppOrigin()
      if (
        canonicalOrigin &&
        window.location.origin !== canonicalOrigin &&
        window.location.hostname.endsWith('.vercel.app')
      ) {
        setError(t('auth.wrongCallbackDomain', { url: canonicalOrigin, current: window.location.origin }))
        return
      }

      try {
        let session = await resolveSession()

        if (cancelled) return

        if (!session) {
          await new Promise((r) => setTimeout(r, 800))
          session = await resolveSession()
        }

        if (cancelled) return

        if (!session) {
          setError(t('auth.callbackFailed'))
          return
        }

        storeSession(session)

        if (session.provider_token) {
          api.syncGitHub().catch(() => {
            // User can retry from dashboard if DB or token storage is not ready.
          })
        }

        navigate('/dashboard', { replace: true })
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : t('auth.callbackFailed')
        if (/pkce code verifier/i.test(message)) {
          const loginUrl = getCanonicalAppOrigin() || getAppOrigin()
          setError(t('auth.pkceError', { url: loginUrl }))
          return
        }
        setError(message)
      }
    }

    finishAuth()

    return () => {
      cancelled = true
    }
  }, [navigate, t])

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white border border-border-base rounded-2xl p-8 text-center">
          <Icon name="error" className="text-error text-5xl mb-4" />
          <h1 className="font-headline-md text-headline-md mb-2">{t('auth.callbackErrorTitle')}</h1>
          <p className="font-body-md text-on-surface-variant mb-6">{error}</p>
          <button
            type="button"
            className="px-6 py-3 bg-primary text-white rounded-lg font-bold"
            onClick={() => navigate('/', { replace: true })}
          >
            {t('auth.backHome')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-body-md text-on-surface-variant">{t('auth.callbackLoading')}</p>
    </div>
  )
}
