import { Icon } from '@/components/shared/Icon'
import { Button } from '@/components/ui/button'
import { useVersionCheck } from '@/hooks/useVersionCheck'
import { useTranslation } from '@/i18n/useTranslation'
import { getVersionLabel } from '@/lib/version'

export function UpdatePrompt() {
  const { updateAvailable, clientVersion, clientSha, dismiss, refresh } = useVersionCheck()
  const { t } = useTranslation()

  if (!updateAvailable) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-8">
      <button
        type="button"
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
        aria-label={t('update.dismiss')}
        onClick={dismiss}
      />
      <div
        role="dialog"
        aria-labelledby="update-prompt-title"
        className="relative w-full max-w-md bg-white border border-border-base rounded-2xl shadow-2xl p-6 space-y-4"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Icon name="system_update" className="text-2xl" />
          </div>
          <div>
            <h2 id="update-prompt-title" className="font-headline-md text-headline-md mb-1">
              {t('update.title')}
            </h2>
            <p className="font-body-sm text-on-surface-variant">
              {t('update.description')}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-surface-subtle px-4 py-3 font-label-sm text-on-surface-variant space-y-1">
          <p>{t('update.current')}: v{clientVersion} ({clientSha})</p>
          <p className="text-primary font-bold">
            {t('update.latest')}: v{updateAvailable.version} ({updateAvailable.sha})
          </p>
        </div>

        <p className="font-body-sm text-on-surface-variant">
          {t('update.hint')}
        </p>

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <Button type="button" variant="secondary" onClick={dismiss}>
            {t('update.later')}
          </Button>
          <Button type="button" onClick={refresh}>
            <Icon name="refresh" />
            {t('update.refreshNow')}
          </Button>
        </div>

        <p className="text-center font-label-sm text-label-sm text-on-surface-variant opacity-50">
          {getVersionLabel()}
        </p>
      </div>
    </div>
  )
}
