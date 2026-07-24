import { useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured, getAuthRedirectUrl } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'
import { disableDemoMode } from '@/lib/demo'
import type { Profile } from '@/types/analysis'
import { translate } from '@/i18n/translate'
import { useLocaleStore } from '@/stores/localeStore'

function profileFromSession(session: Session): Profile {
  const meta = session.user.user_metadata as Record<string, unknown>
  const locale = useLocaleStore.getState().locale
  const username =
    (meta.user_name as string) ||
    (meta.preferred_username as string) ||
    (meta.login as string) ||
    session.user.email?.split('@')[0] ||
    translate(locale, 'common.developer')

  return {
    id: session.user.id,
    github_username: username,
    avatar_url: (meta.avatar_url as string) || null,
    bio: (meta.bio as string) || null,
    public_repos: 0,
    followers: 0,
    created_at: session.user.created_at,
  }
}

export function useAuth() {
  const { session, user, profile, setSession, setProfile, clear } = useAuthStore()
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthReady(true)
      return
    }

    let mounted = true

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return
      if (s) {
        disableDemoMode()
        setSession(s)
        setProfile(profileFromSession(s))
      }
      setAuthReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'SIGNED_IN' && s) {
        disableDemoMode()
        useAuthStore.getState().setDemo(false)
        setSession(s)
        setProfile(profileFromSession(s))
      } else if (event === 'SIGNED_OUT') {
        clear()
      } else {
        setSession(s)
        if (!s) clear()
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setSession, setProfile, clear])

  useEffect(() => {
    if (!session || useAuthStore.getState().isDemo) return

    api.getProfile()
      .then(({ profile: p }) => {
        if (p) setProfile(p)
      })
      .catch(() => {
        // API unavailable — keep profile from session metadata
      })
  }, [session, setProfile])

  const signInWithGitHub = async () => {
    if (!isSupabaseConfigured) {
      throw new Error(
        translate(useLocaleStore.getState().locale, 'auth.supabaseNotConfigured'),
      )
    }

    disableDemoMode()
    useAuthStore.getState().setDemo(false)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        scopes: 'read:user repo',
        redirectTo: getAuthRedirectUrl('/auth/callback'),
      },
    })

    if (error) throw error
  }

  const signOut = async () => {
    disableDemoMode()
    useAuthStore.getState().setDemo(false)
    await supabase.auth.signOut()
    clear()
  }

  return {
    session,
    user,
    profile,
    authReady,
    signInWithGitHub,
    signOut,
    isConfigured: isSupabaseConfigured,
  }
}

export type { Session, User }
