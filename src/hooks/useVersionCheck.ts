import { useCallback, useEffect, useState } from 'react'
import { clearStorageBeforeUpdate } from '@/lib/clearUpdateStorage'
import { APP_VERSION, GIT_SHA } from '@/lib/version'

export interface ServerVersion {
  version: string
  sha: string
  builtAt?: string
}

const CLIENT_VERSION_KEY = `${APP_VERSION}:${GIT_SHA}`
const DISMISS_KEY = 'devcompass_update_dismissed'
const DISMISS_TTL_MS = 60 * 60 * 1000

function isDismissed(serverKey: string): boolean {
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    const { key, until } = JSON.parse(raw) as { key: string; until: number }
    if (key !== serverKey) return false
    return Date.now() < until
  } catch {
    return false
  }
}

export function dismissUpdatePrompt(serverKey: string) {
  sessionStorage.setItem(
    DISMISS_KEY,
    JSON.stringify({ key: serverKey, until: Date.now() + DISMISS_TTL_MS }),
  )
}

async function fetchServerVersion(): Promise<ServerVersion | null> {
  try {
    const res = await fetch(`/version.json?_=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json() as Promise<ServerVersion>
  } catch {
    return null
  }
}

export function useVersionCheck() {
  const [updateAvailable, setUpdateAvailable] = useState<ServerVersion | null>(null)

  const checkVersion = useCallback(async () => {
    const server = await fetchServerVersion()
    if (!server?.version || !server?.sha) return

    const serverKey = `${server.version}:${server.sha}`
    if (serverKey === CLIENT_VERSION_KEY) {
      setUpdateAvailable(null)
      return
    }

    if (isDismissed(serverKey)) return
    setUpdateAvailable(server)
  }, [])

  useEffect(() => {
    void checkVersion()

    const interval = setInterval(checkVersion, 2 * 60 * 1000)

    const onVisible = () => {
      if (document.visibilityState === 'visible') void checkVersion()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [checkVersion])

  const dismiss = useCallback(() => {
    if (updateAvailable) {
      dismissUpdatePrompt(`${updateAvailable.version}:${updateAvailable.sha}`)
    }
    setUpdateAvailable(null)
  }, [updateAvailable])

  const refresh = useCallback(() => {
    clearStorageBeforeUpdate()
    const url = new URL(window.location.href)
    url.searchParams.set('_v', Date.now().toString())
    window.location.replace(url.toString())
  }, [])

  return {
    updateAvailable,
    clientVersion: APP_VERSION,
    clientSha: GIT_SHA,
    dismiss,
    refresh,
  }
}
