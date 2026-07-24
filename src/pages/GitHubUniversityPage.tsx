import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import type { UniversityMission } from '@/types/analysis'
import { useTranslation } from '@/i18n/useTranslation'

export default function GitHubUniversityPage() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data: missions = [], isLoading } = useQuery({
    queryKey: ['university-missions'],
    queryFn: () => api.getUniversityMissions().then((r) => r.missions),
  })

  const completeMutation = useMutation({
    mutationFn: (missionId: string) => api.completeMission(missionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['university-missions'] }),
  })

  if (isLoading) return <div className="p-margin-desktop">{t('common.loading')}</div>

  const daily = missions.filter((m: UniversityMission) => m.type === 'daily')
  const weekly = missions.filter((m: UniversityMission) => m.type === 'weekly')
  const totalPoints = missions.filter((m: UniversityMission) => m.completed).reduce((s: number, m: UniversityMission) => s + m.points, 0)

  return (
    <div className="p-margin-desktop max-w-container-max mx-auto space-y-stack-lg">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-headline-lg text-headline-lg mb-2">{t('githubUniversity.title')}</h2>
          <p className="font-body-lg text-on-surface-variant">{t('githubUniversity.subtitle')}</p>
        </div>
        <div className="text-right">
          <p className="font-headline-md text-headline-md text-primary">{totalPoints}</p>
          <p className="font-label-sm text-on-surface-variant">{t('githubUniversity.pointsEarned')}</p>
        </div>
      </div>

      <MissionSection title={t('githubUniversity.dailyMissions')} icon="today" missions={daily} onComplete={(id) => completeMutation.mutate(id)} t={t} />
      <MissionSection title={t('githubUniversity.weeklyChallenges')} icon="emoji_events" missions={weekly} onComplete={(id) => completeMutation.mutate(id)} t={t} />

      <div className="p-6 bg-surface-container-low rounded-2xl border border-border-base">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="menu_book" className="text-primary" />
          <h3 className="font-headline-md text-headline-md">{t('githubUniversity.readmeTitle')}</h3>
        </div>
        <p className="font-body-md text-on-surface-variant mb-4">
          {t('githubUniversity.readmeDesc')}
        </p>
        <Button variant="secondary">{t('githubUniversity.readmeCta')}</Button>
      </div>
    </div>
  )
}

function MissionSection({
  title,
  icon,
  missions,
  onComplete,
  t,
}: {
  title: string
  icon: string
  missions: UniversityMission[]
  onComplete: (id: string) => void
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon name={icon} className="text-primary" />
        <h3 className="font-headline-md text-headline-md">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {missions.map((m) => (
          <div
            key={m.id}
            className={`p-6 bg-white border rounded-2xl transition-all ${m.completed ? 'border-success/30 bg-success/5' : 'border-border-base'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-body-md font-bold">{m.title}</h4>
              <span className="font-label-sm text-primary">{t('githubUniversity.pointsFormat', { points: m.points })}</span>
            </div>
            <p className="font-body-sm text-on-surface-variant mb-4">{m.description}</p>
            {m.completed ? (
              <span className="flex items-center gap-1 text-success font-label-sm">
                <Icon name="check_circle" filled className="text-sm" />
                {t('githubUniversity.completed')}
              </span>
            ) : (
              <Button size="sm" onClick={() => onComplete(m.id)}>{t('githubUniversity.markComplete')}</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
