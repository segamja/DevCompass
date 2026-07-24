import { Icon } from '@/components/shared/Icon'
import { Button } from '@/components/ui/button'
import { VelocityChart } from '@/components/charts'
import { useAnalysis } from '@/hooks/useAnalysis'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/i18n/useTranslation'

const NODE_COLORS = ['bg-primary', 'bg-secondary', 'bg-primary-container', 'bg-[#61dafb]', 'bg-secondary-container', 'bg-success']

export default function GrowthTimelinePage() {
  const { analysis, isLoading } = useAnalysis()
  const navigate = useNavigate()
  const { t } = useTranslation()

  if (isLoading) return <div className="p-margin-desktop">{t('common.loading')}</div>
  if (!analysis) {
    return (
      <div className="p-margin-desktop text-center py-20">
        <p className="text-on-surface-variant mb-4">{t('growthTimeline.empty')}</p>
        <Button onClick={() => navigate('/dashboard')}>{t('growthTimeline.goDashboard')}</Button>
      </div>
    )
  }

  const velocityData = [40, 60, 35, 80, 95, 100]

  return (
    <div className="p-margin-desktop max-w-container-max mx-auto">
      <div className="mb-stack-lg">
        <h2 className="font-headline-lg text-headline-lg mb-2">{t('growthTimeline.title')}</h2>
        <p className="font-body-lg text-on-surface-variant max-w-2xl">
          {t('growthTimeline.subtitle')}
        </p>
      </div>

      <div className="relative py-10">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 timeline-line opacity-20 hidden md:block" />
        <div className="space-y-stack-lg relative">
          {analysis.growth_timeline.map((milestone, i) => {
            const isEven = i % 2 === 0
            return (
              <div key={milestone.id} className={`relative flex flex-col md:flex-row${isEven ? '' : '-reverse'} items-center justify-between group`}>
                <div className={`w-full md:w-[45%] mb-4 md:mb-0 ${isEven ? 'md:text-right' : ''}`}>
                  <div className={`p-6 bg-surface-bg border border-border-base rounded-xl ai-glow-card transition-all ${milestone.isCurrent ? 'border-l-4 border-l-primary' : ''}`}>
                    <span className="inline-block px-3 py-1 bg-surface-subtle text-primary font-label-sm rounded-full mb-3 uppercase tracking-wider">
                      {milestone.category}
                    </span>
                    <h3 className="font-headline-md text-headline-md mb-2">{milestone.title}</h3>
                    <p className="text-on-surface-variant italic font-body-sm mb-4">&ldquo;{milestone.story}&rdquo;</p>
                    <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : ''}`}>
                      {milestone.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-surface-container-high rounded text-label-sm font-label-sm text-primary">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={`relative z-10 w-12 h-12 flex items-center justify-center ${NODE_COLORS[i % NODE_COLORS.length]} rounded-full shadow-lg`}>
                  <Icon name={milestone.icon} className="text-white" filled />
                  {milestone.isCurrent && <div className="absolute inset-0 rounded-full node-pulse bg-primary" />}
                </div>
                <div className={`hidden md:block w-[45%] ${isEven ? 'pl-8' : 'text-right pr-8'}`}>
                  <span className="font-label-md text-on-surface-variant">{milestone.period}</span>
                  {milestone.isCurrent && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-label-md text-primary font-bold">{t('growthTimeline.currentFocus')}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-stack-lg p-margin-desktop bg-surface-container-low rounded-2xl border border-border-base text-center">
        <Icon name="rocket_launch" className="text-primary text-4xl mb-4" />
        <h4 className="font-headline-md text-headline-md mb-2">{t('growthTimeline.whatsNext')}</h4>
        <p className="font-body-md text-on-surface-variant max-w-xl mx-auto mb-6">{analysis.weekly_insights}</p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate('/learning-roadmap')}>{t('growthTimeline.explorePath')}</Button>
          <Button onClick={() => navigate('/career-coach')}>{t('growthTimeline.askCoach')}</Button>
        </div>
      </div>

      <section className="mt-stack-lg">
        <h3 className="font-headline-md text-headline-md mb-stack-md">{t('growthTimeline.velocityBreakdown')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 bg-surface-bg border border-border-base rounded-2xl">
            <p className="font-label-sm text-on-surface-variant uppercase mb-1">{t('growthTimeline.learningVelocity')}</p>
            <h4 className="font-headline-md text-headline-md mb-4">{t('growthTimeline.velocityValue', { count: analysis.learning_velocity })}</h4>
            <VelocityChart data={velocityData} />
          </div>
          <div className="p-6 bg-inverse-surface text-inverse-on-surface rounded-2xl flex flex-col">
            <Icon name="strikethrough_s" className="text-secondary-fixed text-4xl mb-4" />
            <h4 className="font-headline-md text-headline-md mb-2">{t('growthTimeline.dnaEvolution')}</h4>
            <p className="font-body-sm mb-6 opacity-80">{t('growthTimeline.evolutionDesc', { archetype: analysis.primary_archetype })}</p>
            <div className="mt-auto">
              <div className="flex justify-between text-label-sm mb-1">
                <span>{t('growthTimeline.aiReadiness')}</span>
                <span>{analysis.ai_readiness}%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary-fixed h-full" style={{ width: `${analysis.ai_readiness}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
