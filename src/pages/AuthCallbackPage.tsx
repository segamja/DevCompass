import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { api } from '@/lib/api'
import { Icon } from '@/components/shared/Icon'
import { useTranslation } from '@/i18n/useTranslation'

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

      // PKCE / implicit: Supabase client parses hash/query and stores session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (cancelled) return

      if (sessionError) {
        setError(sessionError.message)
        return
      }

      if (session) {
        if (session.provider_token) {
          api.syncGitHub().catch(() => {
            // Token sync can fail if DB is not ready; user can retry from dashboard.
          })
        }
        navigate('/dashboard', { replace: true })
        return
      }

      // Wait briefly for onAuthStateChange after redirect
      await new Promise((r) => setTimeout(r, 500))
      const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession()

      if (cancelled) return

      if (retryError) {
        setError(retryError.message)
        return
      }

      if (retrySession) {
        if (retrySession.provider_token) {
          api.syncGitHub().catch(() => {
            // Token sync can fail if DB is not ready; user can retry from dashboard.
          })
        }
        navigate('/dashboard', { replace: true })
      } else {
        setError(t('auth.callbackFailed'))
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

