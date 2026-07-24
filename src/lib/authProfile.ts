import type { Session } from '@supabase/supabase-js'
import type { Profile } from '@/types/analysis'
import { translate } from '@/i18n/translate'
import { useLocaleStore } from '@/stores/localeStore'

export function profileFromSession(session: Session): Profile {
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
