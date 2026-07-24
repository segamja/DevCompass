import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import type { WeeklyReport } from '@/types/analysis'
import { useTranslation } from '@/i18n/useTranslation'

export default function WeeklyReportPage() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['weekly-reports'],
    queryFn: () => api.getWeeklyReports().then((r) => r.reports as WeeklyReport[]),
  })

  const generateMutation = useMutation({
    mutationFn: () => api.generateWeeklyReport(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['weekly-reports'] }),
  })

  const latest = reports[0]

  if (isLoading) return <div className="p-margin-desktop">{t('common.loading')}</div>

  return (
    <div className="p-margin-desktop max-w-container-max mx-auto space-y-stack-lg">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg mb-2">{t('weeklyReport.title')}</h2>
          <p className="font-body-lg text-on-surface-variant">{t('weeklyReport.subtitle')}</p>
        </div>
        <Button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
          <Icon name="summarize" />
          {generateMutation.isPending ? t('common.generating') : t('weeklyReport.generateCta')}
        </Button>
      </div>

      {!latest ? (
        <div className="text-center py-20 text-on-surface-variant">
          <Icon name="summarize" className="text-5xl mb-4 opacity-30" />
          <p>{t('weeklyReport.empty')}</p>
        </div>
      ) : (
        <div className="space-y-gutter">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <StatCard label={t('weeklyReport.contributions')} value={String(latest.contributions)} icon="commit" />
            <StatCard label={t('weeklyReport.highlights')} value={String(latest.highlights.length)} icon="star" />
            <StatCard label={t('weeklyReport.recommendedSkills')} value={String(latest.recommended_skills.length)} icon="school" />
          </div>

          <div className="bg-white border border-border-base rounded-2xl p-8">
            <h3 className="font-headline-md text-headline-md mb-4">{t('weeklyReport.weeklySummary')}</h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">{latest.summary}</p>
          </div>

          {latest.skill_changes.length > 0 && (
            <div className="bg-white border border-border-base rounded-2xl p-8">
              <h3 className="font-headline-md text-headline-md mb-4">{t('weeklyReport.skillChanges')}</h3>
              <div className="space-y-2">
                {latest.skill_changes.map((s) => (
                  <div key={s.skill} className="flex justify-between p-3 bg-surface-subtle rounded-lg">
                    <span className="font-label-md">{s.skill}</span>
                    <span className="text-success font-label-md">{t('weeklyReport.skillChangeFormat', { change: s.change })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-border-base rounded-2xl p-8">
            <h3 className="font-headline-md text-headline-md mb-4">{t('weeklyReport.recommendedSkills')}</h3>
            <div className="flex flex-wrap gap-2">
              {latest.recommended_skills.map((s) => (
                <span key={s} className="px-4 py-2 bg-primary/10 text-primary rounded-full font-label-md">{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="p-6 bg-white border border-border-base rounded-2xl">
      <Icon name={icon} className="text-primary mb-2" />
      <p className="font-headline-md text-headline-md">{value}</p>
      <p className="font-label-sm text-on-surface-variant">{label}</p>
    </div>
  )
}
