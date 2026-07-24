import { Icon } from '@/components/shared/Icon'
import { Button } from '@/components/ui/button'
import { DnaTag, SkillTag } from '@/components/shared/Tags'
import { useAnalysis } from '@/hooks/useAnalysis'
import { useAnalyzeDNA } from '@/hooks/useAnalyzeDNA'
import { useTranslation } from '@/i18n/useTranslation'

export default function DeveloperDNAPage() {
  const { analysis, isLoading } = useAnalysis()
  const { analyze, isLoading: analyzing } = useAnalyzeDNA()
  const { t } = useTranslation()

  if (isLoading) return <div className="p-margin-desktop">{t('common.loading')}</div>

  if (!analysis) {
    return (
      <div className="p-margin-desktop text-center py-20">
        <p className="mb-4 text-on-surface-variant">{t('dna.empty')}</p>
        <Button onClick={() => analyze()} disabled={analyzing}>{t('dna.analyzeCta')}</Button>
      </div>
    )
  }

  return (
    <div className="p-margin-desktop max-w-container-max mx-auto space-y-stack-lg">
      <section className="relative overflow-hidden rounded-2xl bg-inverse-surface text-on-primary p-10 flex flex-col md:flex-row items-center gap-8 ai-border-glow">
        <div className="flex-1 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-inverse-primary mb-6">
            <Icon name="psychology" filled className="text-sm" />
            <span className="font-label-sm">{t('dna.primaryArchetype')}</span>
          </div>
          <h2 className="font-headline-xl text-headline-xl mb-4">{analysis.primary_archetype}</h2>
          <p className="font-body-lg text-on-primary-container max-w-xl opacity-90">{analysis.career_story.slice(0, 280)}...</p>
          <div className="mt-8 flex gap-4 flex-wrap">
            {analysis.developer_dna.map((d) => (
              <DnaTag key={d}>{d}</DnaTag>
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/3 h-48 relative flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-primary to-secondary blur-3xl opacity-40" />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 bg-surface-bg border border-border-base p-stack-lg rounded-2xl insight-card">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="auto_stories" className="text-secondary" />
            <h3 className="font-headline-md text-headline-md">{t('dna.aiSummary')}</h3>
          </div>
          <p className="font-body-md text-on-surface-variant leading-relaxed">{analysis.career_story}</p>
        </div>
        <div className="bg-surface-container-high rounded-2xl p-stack-lg border border-outline-variant">
          <h4 className="font-label-md text-on-surface-variant mb-4 uppercase tracking-wider">{t('dna.stabilityScore')}</h4>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-extrabold">{analysis.dna_stability_score}</span>
            <span className="text-xl font-bold text-success">/ 100</span>
          </div>
          <p className="font-body-sm text-on-surface-variant">{t('dna.stabilityDesc', { archetype: analysis.primary_archetype })}</p>
          <div className="mt-6 w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full" style={{ width: `${analysis.dna_stability_score}%` }} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <BentoCard title={t('dna.strengths')} icon="verified" iconColor="text-success">
          <ul className="space-y-3">
            {analysis.strengths.map((s) => (
              <li key={s} className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle border border-border-base">
                <Icon name="check_circle" className="text-primary" />
                <span className="font-body-md font-medium">{s}</span>
              </li>
            ))}
          </ul>
        </BentoCard>

        <BentoCard title={t('dna.gaps')} icon="trending_down" iconColor="text-error">
          <ul className="space-y-3">
            {analysis.gaps.map((g) => (
              <li key={g} className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle border border-border-base">
                <Icon name="warning" className="text-on-surface-variant" />
                <span className="font-body-md font-medium">{g}</span>
              </li>
            ))}
          </ul>
        </BentoCard>

        <BentoCard title={t('dna.style')} icon="model_training" iconColor="text-secondary">
          <div className="space-y-4">
            {analysis.learning_style.map((s) => (
              <DnaTag key={s}>{s}</DnaTag>
            ))}
          </div>
        </BentoCard>

        <BentoCard title={t('dna.stack')} icon="terminal" iconColor="text-primary">
          <div className="flex flex-wrap gap-2">
            {[...analysis.tech_stack.primary, ...analysis.tech_stack.secondary].map((tech) => (
              <SkillTag key={tech}>{tech}</SkillTag>
            ))}
          </div>
          {analysis.tech_stack.exploring.length > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Icon name="trending_up" className="text-sm" />
                <span className="font-label-sm">{t('dna.exploring')}</span>
              </div>
              <p className="font-body-sm font-bold">{analysis.tech_stack.exploring.join(', ')}</p>
            </div>
          )}
        </BentoCard>
      </section>
    </div>
  )
}

function BentoCard({ title, icon, iconColor, children }: { title: string; icon: string; iconColor: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-bg border border-border-base rounded-2xl p-stack-md flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Icon name={icon} className={iconColor} />
        <h4 className="font-headline-md text-headline-md">{title}</h4>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
