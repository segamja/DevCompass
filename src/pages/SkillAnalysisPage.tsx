import { SkillRadarChart } from '@/components/charts'
import { useAnalysis } from '@/hooks/useAnalysis'
import { SKILL_DOMAINS } from '@/types/analysis'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useAnalyzeDNA } from '@/hooks/useAnalyzeDNA'
import { useTranslation, getDomainLabel } from '@/i18n/useTranslation'

export default function SkillAnalysisPage() {
  const { analysis, isLoading } = useAnalysis()
  const { analyze, isLoading: analyzing } = useAnalyzeDNA()
  const { t, locale } = useTranslation()

  if (isLoading) return <div className="p-margin-desktop">{t('common.loading')}</div>

  if (!analysis) {
    return (
      <div className="p-margin-desktop text-center py-20">
        <p className="text-on-surface-variant mb-4">{t('skillAnalysis.empty')}</p>
        <Button onClick={() => analyze()} disabled={analyzing}>{t('dna.analyzeCta')}</Button>
      </div>
    )
  }

  return (
    <div className="p-margin-desktop max-w-container-max mx-auto space-y-stack-lg">
      <div>
        <h2 className="font-headline-lg text-headline-lg mb-2">{t('skillAnalysis.title')}</h2>
        <p className="font-body-lg text-on-surface-variant">{t('skillAnalysis.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <div className="bg-white border border-border-base rounded-2xl p-8">
          <h3 className="font-headline-md text-headline-md mb-4">{t('skillAnalysis.skillRadar')}</h3>
          <SkillRadarChart scores={analysis.skill_scores} />
        </div>

        <div className="bg-white border border-border-base rounded-2xl p-8 space-y-6">
          <h3 className="font-headline-md text-headline-md">{t('skillAnalysis.domainBreakdown')}</h3>
          {SKILL_DOMAINS.map((domain) => {
            const score = analysis.skill_scores[domain] ?? 0
            return (
              <div key={domain}>
                <div className="flex justify-between mb-2">
                  <span className="font-label-md">{getDomainLabel(locale, domain)}</span>
                  <span className="font-label-md text-primary">{t('skillAnalysis.scoreFormat', { score })}</span>
                </div>
                <Progress value={score} />
                <p className="text-body-sm text-on-surface-variant mt-1">
                  {score >= 80 ? t('skillAnalysis.strong') : score >= 60 ? t('skillAnalysis.growing') : t('skillAnalysis.opportunity')}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
