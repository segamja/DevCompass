import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Icon } from '@/components/shared/Icon'
import { Button } from '@/components/ui/button'
import { useAnalyzeDNA } from '@/hooks/useAnalyzeDNA'
import type { RepoRecommendation } from '@/types/analysis'
import { useTranslation } from '@/i18n/useTranslation'

export default function RepoRecommendationsPage() {
  const { data: repos = [], isLoading, refetch } = useQuery({
    queryKey: ['repo-recommendations'],
    queryFn: () => api.getRepoRecommendations().then((r) => r.repos as RepoRecommendation[]),
  })
  const { analyze, isLoading: analyzing } = useAnalyzeDNA()
  const { t } = useTranslation()

  if (isLoading) return <div className="p-margin-desktop">{t('common.loading')}</div>

  if (!repos.length) {
    return (
      <div className="p-margin-desktop text-center py-20">
        <p className="text-on-surface-variant mb-4">{t('repoRecommendations.empty')}</p>
        <Button onClick={() => analyze().then(() => refetch())} disabled={analyzing}>{t('repoRecommendations.generateCta')}</Button>
      </div>
    )
  }

  return (
    <div className="p-margin-desktop max-w-container-max mx-auto space-y-stack-lg">
      <div>
        <h2 className="font-headline-lg text-headline-lg mb-2">{t('repoRecommendations.title')}</h2>
        <p className="font-body-lg text-on-surface-variant">{t('repoRecommendations.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {repos.map((repo) => (
          <a
            key={`${repo.owner}/${repo.name}`}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white border border-border-base rounded-2xl hover:border-primary/30 hover:shadow-md transition-all block"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-headline-md text-headline-md">{repo.owner}/{repo.name}</h3>
                <div className="flex items-center gap-1 text-on-surface-variant mt-1">
                  <Icon name="star" className="text-sm" filled />
                  <span className="font-label-sm">{repo.stars.toLocaleString()}</span>
                </div>
              </div>
              <Icon name="open_in_new" className="text-on-surface-variant" />
            </div>
            <p className="font-body-sm text-on-surface-variant mb-4">{repo.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {repo.topics.slice(0, 4).map((topic) => (
                <span key={topic} className="px-2 py-1 bg-surface-subtle rounded text-label-sm font-label-sm">{topic}</span>
              ))}
            </div>
            <p className="font-body-sm text-secondary insight-card pl-3 border-l-2">{repo.match_reason}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
