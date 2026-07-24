declare const __APP_VERSION__: string
declare const __GIT_SHA__: string

export const APP_VERSION = __APP_VERSION__
export const GIT_SHA = __GIT_SHA__

export function getVersionLabel(): string {
  return `v${APP_VERSION} (${GIT_SHA})`
}
