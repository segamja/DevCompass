import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/shared/Icon'
import { api } from '@/lib/api'
import type { ResumeContent } from '@/types/analysis'
import { useTranslation } from '@/i18n/useTranslation'

const TAB_KEYS: { value: ResumeContent['type']; labelKey: string }[] = [
  { value: 'resume', labelKey: 'resume.tabResume' },
  { value: 'cover', labelKey: 'resume.tabCover' },
  { value: 'linkedin', labelKey: 'resume.tabLinkedin' },
]

export default function ResumePage() {
  const [contents, setContents] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ResumeContent['type']>('resume')
  const { t } = useTranslation()

  const generate = async (type: ResumeContent['type']) => {
    setLoading(type)
    try {
      const { content } = await api.generateResume(type)
      setContents((prev) => ({ ...prev, [type]: content }))
    } finally {
      setLoading(null)
    }
  }

  const download = (type: ResumeContent['type']) => {
    const content = contents[type]
    if (!content) return
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `devcompass-${type}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-margin-desktop max-w-container-max mx-auto space-y-stack-lg">
      <div>
        <h2 className="font-headline-lg text-headline-lg mb-2">{t('resume.title')}</h2>
        <p className="font-body-lg text-on-surface-variant">{t('resume.subtitle')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ResumeContent['type'])}>
        <TabsList>
          {TAB_KEYS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>{t(tab.labelKey)}</TabsTrigger>
          ))}
        </TabsList>

        {TAB_KEYS.map((tab) => {
          const tabLabel = t(tab.labelKey)
          return (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="bg-white border border-border-base rounded-2xl p-6">
                <div className="flex gap-3 mb-4">
                  <Button onClick={() => generate(tab.value)} disabled={loading === tab.value}>
                    <Icon name="auto_awesome" />
                    {loading === tab.value ? t('common.generating') : t('resume.generateCta', { type: tabLabel })}
                  </Button>
                  {contents[tab.value] && (
                    <Button variant="secondary" onClick={() => download(tab.value)}>
                      <Icon name="download" />
                      {t('resume.download')}
                    </Button>
                  )}
                </div>
                <textarea
                  className="w-full h-96 p-4 bg-surface-subtle rounded-xl border-none focus:ring-2 focus:ring-primary font-body-md resize-none"
                  placeholder={t('resume.placeholder', { type: tabLabel })}
                  value={contents[tab.value] || ''}
                  onChange={(e) => setContents((prev) => ({ ...prev, [tab.value]: e.target.value }))}
                />
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
