const APP_STORAGE_PREFIX = 'devcompass_'
const SUPABASE_STORAGE_PREFIX = 'sb-'

function expireCookie(name: string, path: string, domain?: string) {
  const base = `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`
  document.cookie = domain ? `${base};domain=${domain}` : base
}

/** Remove all cookies readable from the current document. */
export function clearSiteCookies() {
  const cookieNames = document.cookie
    .split(';')
    .map((part) => part.split('=')[0]?.trim())
    .filter((name): name is string => Boolean(name))

  const { hostname } = window.location
  const domainVariants = new Set<string | undefined>([undefined, hostname])

  if (hostname.includes('.')) {
    domainVariants.add(`.${hostname}`)
    const parts = hostname.split('.')
    if (parts.length >= 2) {
      domainVariants.add(`.${parts.slice(-2).join('.')}`)
    }
  }

  for (const name of cookieNames) {
    for (const domain of domainVariants) {
      expireCookie(name, '/', domain)
      expireCookie(name, window.location.pathname || '/', domain)
    }
  }
}

function clearStorageByPrefix(storage: Storage, prefixes: string[]) {
  const keys: string[] = []
  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i)
    if (!key) continue
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      keys.push(key)
    }
  }
  keys.forEach((key) => storage.removeItem(key))
}

/** Clear cookies and app-related storage before loading a new build. */
export function clearStorageBeforeUpdate() {
  clearSiteCookies()
  clearStorageByPrefix(localStorage, [APP_STORAGE_PREFIX, SUPABASE_STORAGE_PREFIX])
  clearStorageByPrefix(sessionStorage, [APP_STORAGE_PREFIX, SUPABASE_STORAGE_PREFIX])
}
