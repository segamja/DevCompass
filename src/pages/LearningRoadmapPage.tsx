import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { PriorityBadge } from '@/components/shared/Tags'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useAnalyzeDNA } from '@/hooks/useAnalyzeDNA'
import { useTranslation } from '@/i18n/useTranslation'

export default function LearningRoadmapPage() {
  const { data: items = [], isLoading, refetch } = useQuery({
    queryKey: ['learning-roadmap'],
    queryFn: () => api.getLearningRoadmap().then((r) => r.items),
  })
  const { analyze, isLoading: analyzing } = useAnalyzeDNA()
  const { t } = useTranslation()

  if (isLoading) return <div className="p-margin-desktop">{t('common.loading')}</div>

  if (!items.length) {
    return (
      <div className="p-margin-desktop text-center py-20">
        <p className="text-on-surface-variant mb-4">{t('learningRoadmap.empty')}</p>
        <Button onClick={() => analyze().then(() => refetch())} disabled={analyzing}>
          {analyzing ? t('common.analyzing') : t('learningRoadmap.generateCta')}
        </Button>
      </div>
    )
  }

  return (
    <div className="p-margin-desktop max-w-container-max mx-auto space-y-stack-lg">
      <div>
        <h2 className="font-headline-lg text-headline-lg mb-2">{t('learningRoadmap.title')}</h2>
        <p className="font-body-lg text-on-surface-variant">{t('learningRoadmap.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {items.map((item) => (
          <div key={item.id} className="p-6 bg-white border border-border-base rounded-2xl hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <PriorityBadge priority={item.priority} />
              <span className="text-label-sm text-on-surface-variant">{t('learningRoadmap.metaFormat', { hours: item.estimated_hours, modules: item.modules })}</span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-2">{item.title}</h3>
            <p className="font-body-sm text-on-surface-variant mb-4">{item.description}</p>
            <Progress value={item.progress} />
            <p className="text-label-sm text-on-surface-variant mt-2">{t('learningRoadmap.progressFormat', { percent: item.progress })}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
