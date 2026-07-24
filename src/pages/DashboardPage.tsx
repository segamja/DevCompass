import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/shared/Icon'
import { Button } from '@/components/ui/button'
import { InsightCard } from '@/components/shared/InsightCard'
import { SkillRadarChart, CareerScoreChart, ContributionHeatmap, LanguageBars } from '@/components/charts'
import { useAnalysis } from '@/hooks/useAnalysis'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { useAnalyzeDNA } from '@/hooks/useAnalyzeDNA'
import { useTranslation } from '@/i18n/useTranslation'

export default function DashboardPage() {
  const { analysis, isLoading } = useAnalysis()
  const profile = useAuthStore((s) => s.profile)
  const navigate = useNavigate()
  const { signOut, signInWithGitHub } = useAuth()
  const { analyze, reset, isLoading: analyzing, error, needsReauth } = useAnalyzeDNA()
  const { t } = useTranslation()

  const handleAnalyze = () => {
    reset()
    analyze()
  }

  const handleReLogin = async () => {
    reset()
    await signOut()
    await signInWithGitHub()
  }

  if (isLoading) {
    return <div className="p-margin-desktop text-on-surface-variant">{t('dashboard.loading')}</div>
  }

  if (!analysis) {
    return (
      <div className="p-margin-desktop max-w-container-max mx-auto text-center py-20">
        <Icon name="analytics" className="text-6xl text-primary mb-4" />
        <h2 className="font-headline-lg text-headline-lg mb-4">{t('dashboard.welcomeTitle')}</h2>
        <p className="font-body-lg text-on-surface-variant mb-8 max-w-md mx-auto">
          {t('dashboard.welcomeDesc')}
        </p>
        {error && (
          <div className="max-w-md mx-auto mb-6 p-4 rounded-xl bg-error-container text-on-error-container font-body-sm text-left space-y-3">
            <p>{needsReauth ? t('errors.githubTokenMissing') : error}</p>
            {needsReauth && (
              <Button variant="secondary" size="sm" onClick={handleReLogin}>
                <Icon name="login" />
                {t('errors.reconnectGitHub')}
              </Button>
            )}
          </div>
        )}
        <Button size="lg" onClick={handleAnalyze} disabled={analyzing}>
          <Icon name="bolt" filled />
          {analyzing ? t('common.analyzing') : t('dashboard.analyzeCta')}
        </Button>
      </div>
    )
  }

  const monthLabels = t('dashboard.months').split(',')
  const careerScoreData = Array.from({ length: 12 }, (_, i) => ({
    month: monthLabels[i],
    score: Math.max(30, analysis.career_score - (11 - i) * 8 + Math.floor(Math.random() * 10)),
  }))

  return (
    <div className="p-margin-desktop space-y-stack-lg max-w-container-max mx-auto w-full">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 glass-card p-8 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-surface-dim overflow-hidden border-4 border-white shadow-xl">
              {profile?.avatar_url ? (
                <img className="w-full h-full object-cover" src={profile.avatar_url} alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <Icon name="person" className="text-4xl text-primary" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-success text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
              <Icon name="verified" filled className="text-sm" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-headline-lg text-headline-lg">{profile?.github_username || t('common.developer')}</h2>
            <p className="font-label-md text-label-md text-on-surface-variant">@{profile?.github_username}</p>
            <p className="font-body-md text-on-surface-variant mt-2">{analysis.developer_slogan}</p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {analysis.developer_dna.slice(0, 2).map((d) => (
                <span key={d} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full font-label-sm border border-secondary/20">{d}</span>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatBox label={t('dashboard.careerScore')} value={String(analysis.career_score)} highlight />
              <StatBox label={t('dashboard.dnaRank')} value={t('dashboard.dnaRankValue', { percent: 100 - analysis.dna_stability_score })} />
              <StatBox label={t('dashboard.aiReadiness')} value={`${analysis.ai_readiness}%`} />
              <StatBox label={t('dashboard.velocity')} value={t('dashboard.velocityValue', { count: analysis.learning_velocity })} success />
            </div>
            <div className="mt-8 flex gap-3 flex-wrap justify-center md:justify-start">
              <Button onClick={() => navigate('/career-coach')}>
                <Icon name="psychology" filled />
                {t('dashboard.askCoach')}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/developer-dna')}>
                {t('dashboard.viewDnaMap')}
              </Button>
            </div>
          </div>
        </div>

        <InsightCard title={t('dashboard.aiRecommendation')}>
          <h3 className="font-headline-md text-headline-md leading-tight mb-4">{analysis.ai_recommendation.title}</h3>
          <p className="font-body-md text-on-surface-variant mb-6">{analysis.ai_recommendation.description}</p>
          <div className="h-2 w-full bg-surface-subtle rounded-full overflow-hidden mb-4">
            <div className="h-full bg-secondary transition-all" style={{ width: `${analysis.ai_recommendation.progress}%` }} />
          </div>
          <Button variant="secondary" className="w-full text-secondary border-secondary/10">
            {analysis.ai_recommendation.action}
          </Button>
        </InsightCard>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter auto-rows-[200px]">
        <div className="md:col-span-2 lg:row-span-2 bg-white border border-border-base rounded-2xl p-8 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-headline-md text-headline-md">{t('dashboard.overallCareerScore')}</h3>
              <p className="font-body-sm text-on-surface-variant">{t('dashboard.growthTrajectory')}</p>
            </div>
            <span className="flex items-center gap-1 px-3 py-1 bg-success/10 text-success rounded-full font-label-sm">
              <Icon name="trending_up" className="text-sm" />
              +12%
            </span>
          </div>
          <div className="flex-1 min-h-[200px]">
            <CareerScoreChart data={careerScoreData} />
          </div>
        </div>

        <div className="md:col-span-2 bg-white border border-border-base rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-label-md font-bold uppercase text-on-surface-variant">{t('dashboard.contributionHeatmap')}</h3>
            <span className="text-label-sm text-on-surface-variant opacity-60">{t('dashboard.last12Weeks')}</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <ContributionHeatmap days={analysis.contribution_calendar.slice(-84)} />
          </div>
        </div>

        <StatCard icon="source" value={String(profile?.public_repos ?? 0)} label={t('dashboard.activeRepos')} />
        <StatCard icon="commit" value={String(analysis.contribution_calendar.reduce((s, d) => s + d.count, 0))} label={t('dashboard.contributions')} success />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="bg-white border border-border-base rounded-2xl p-8">
          <h3 className="font-headline-md text-headline-md mb-4">{t('dashboard.skillRadar')}</h3>
          <SkillRadarChart scores={analysis.skill_scores} />
        </div>
        <div className="bg-white border border-border-base rounded-2xl p-8">
          <h3 className="font-headline-md text-headline-md mb-6">{t('dashboard.languageDistribution')}</h3>
          <LanguageBars languages={analysis.language_distribution} />
        </div>
        <div className="bg-white border border-border-base rounded-2xl p-8">
          <h3 className="font-headline-md text-headline-md mb-2">{t('dashboard.growthTimeline')}</h3>
          <p className="font-body-sm text-on-surface-variant mb-6">{t('dashboard.recentMilestones')}</p>
          <div className="space-y-4">
            {analysis.growth_timeline.slice(-4).reverse().map((m) => (
              <div key={m.id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                  <Icon name={m.icon} className="text-[16px]" />
                </div>
                <div>
                  <p className="font-label-md font-bold">{m.title}</p>
                  <p className="font-body-sm text-on-surface-variant">{m.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function StatBox({ label, value, highlight, success }: { label: string; value: string; highlight?: boolean; success?: boolean }) {
  return (
    <div className="p-3 rounded-xl bg-surface-subtle">
      <p className="font-label-sm text-on-surface-variant uppercase mb-1">{label}</p>
      <p className={`font-headline-md text-headline-md ${highlight ? 'text-primary' : success ? 'text-success' : 'text-on-surface'}`}>{value}</p>
    </div>
  )
}

function StatCard({ icon, value, label, success }: { icon: string; value: string; label: string; success?: boolean }) {
  return (
    <div className="bg-white border border-border-base rounded-2xl p-6 flex flex-col justify-between group hover:border-primary/30 transition-all">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${success ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
        <Icon name={icon} />
      </div>
      <div>
        <p className="font-headline-md font-bold">{value}</p>
        <p className="font-label-md text-on-surface-variant">{label}</p>
      </div>
    </div>
  )
}

