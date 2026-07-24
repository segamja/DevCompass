import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GapBadge } from '@/components/shared/Tags'
import { Icon } from '@/components/shared/Icon'
import { api } from '@/lib/api'
import type { JobMatchGap } from '@/types/analysis'
import { useTranslation } from '@/i18n/useTranslation'

interface MatchResult {
  job_title: string
  match_score: number
  gaps: JobMatchGap[]
}

export default function JobMatchingPage() {
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<MatchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { t } = useTranslation()

  const handleMatch = async () => {
    if (!jobDescription.trim()) return
    setLoading(true)
    setError('')
    try {
      const { match } = await api.matchJob(jobDescription)
      setResult(match as MatchResult)
    } catch (e) {
      setError(e instanceof Error ? e.message : t('jobMatching.matchFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-margin-desktop max-w-container-max mx-auto space-y-stack-lg">
      <div>
        <h2 className="font-headline-lg text-headline-lg mb-2">{t('jobMatching.title')}</h2>
        <p className="font-body-lg text-on-surface-variant">{t('jobMatching.subtitle')}</p>
      </div>

      <div className="bg-white border border-border-base rounded-2xl p-8">
        <label className="font-label-md block mb-2">{t('jobMatching.pasteLabel')}</label>
        <textarea
          className="w-full h-48 p-4 bg-surface-subtle rounded-xl border-none focus:ring-2 focus:ring-primary resize-none font-body-md"
          placeholder={t('jobMatching.pastePlaceholder')}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <Button className="mt-4" onClick={handleMatch} disabled={loading || !jobDescription.trim()}>
          <Icon name="work" />
          {loading ? t('common.analyzing') : t('jobMatching.analyzeCta')}
        </Button>
        {error && <p className="text-error mt-2 font-body-sm">{error}</p>}
      </div>

      {result && (
        <div className="bg-white border border-border-base rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-headline-md text-headline-md">{result.job_title}</h3>
              <p className="text-on-surface-variant">{t('jobMatching.matchComplete')}</p>
            </div>
            <div className="text-center">
              <p className="font-headline-xl text-headline-xl text-primary">{result.match_score}%</p>
              <p className="font-label-sm text-on-surface-variant">{t('jobMatching.matchScore')}</p>
            </div>
          </div>
          <div className="space-y-3">
            {result.gaps.map((gap) => (
              <div key={gap.skill} className="flex items-center gap-3 p-4 bg-surface-subtle border border-border-base rounded-xl">
                <div className={`w-2 h-2 rounded-full shrink-0 ${gap.status === 'MATCHED' ? 'bg-success' : gap.status === 'HIGH_GAP' ? 'bg-error' : 'bg-tertiary'}`} />
                <div className="flex-1">
                  <p className="font-label-md">{gap.skill}</p>
                  <p className="text-body-sm text-on-surface-variant">{gap.description}</p>
                </div>
                <GapBadge status={gap.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
