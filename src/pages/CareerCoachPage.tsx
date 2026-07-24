import { useState, useRef, useEffect } from 'react'
import { Icon } from '@/components/shared/Icon'
import { Button } from '@/components/ui/button'
import { GapBadge, PriorityBadge } from '@/components/shared/Tags'
import { useCareerCoach } from '@/hooks/useCareerCoach'
import { useAnalysis } from '@/hooks/useAnalysis'
import { useTranslation, getDomainLabel } from '@/i18n/useTranslation'
import { formatRelativeTimeLocalized } from '@/i18n/translate'

const SUGGESTION_KEYS = [
  'careerCoach.suggestions.learnNext',
  'careerCoach.suggestions.reviewPortfolio',
  'careerCoach.suggestions.systemDesign',
  'careerCoach.suggestions.salaryBenchmarks',
] as const

export default function CareerCoachPage() {
  const { messages, sendMessage, isSending } = useCareerCoach()
  const { analysis } = useAnalysis()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const { t, locale } = useTranslation()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  const handleSend = async () => {
    if (!input.trim() || isSending) return
    const msg = input.trim()
    setInput('')
    await sendMessage(msg)
  }

  const recommendations = analysis?.career_recommendations ?? []

  return (
    <div className="flex h-full overflow-hidden">
      <section className="flex-1 flex flex-col bg-surface-bg relative">
        <div className="flex-1 overflow-y-auto chat-scroll p-margin-desktop space-y-6 pb-32">
          {messages.length === 0 && (
            <div className="flex gap-4 max-w-3xl">
              <CoachAvatar />
              <div className="bg-surface-muted border border-border-base p-4 rounded-2xl rounded-tl-none">
                <p className="font-body-md">
                  {t('careerCoach.greeting')}
                  {analysis ? ` ${t('careerCoach.greetingArchetype', { archetype: analysis.primary_archetype })}` : ''}, {t('careerCoach.greetingClosing')}
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              {msg.role === 'assistant' ? <CoachAvatar /> : <UserAvatar />}
              <div className={`space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-surface-muted border border-border-base rounded-tl-none'}`}>
                  <p className="font-body-md whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-label-sm text-on-surface-variant">{formatRelativeTimeLocalized(locale, msg.created_at)}</span>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex gap-4 max-w-3xl opacity-60">
              <CoachAvatar pulsing />
              <div className="flex items-center gap-1.5 p-4 bg-surface-subtle rounded-2xl">
                {[0, 0.2, 0.4].map((delay) => (
                  <div key={delay} className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-margin-desktop bg-gradient-to-t from-surface-bg via-surface-bg/95 to-transparent">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {SUGGESTION_KEYS.map((key) => {
                const suggestion = t(key)
                return (
                  <button
                    key={key}
                    type="button"
                    className="shrink-0 px-4 py-2 rounded-full border border-border-base bg-surface-bg hover:border-primary hover:text-primary transition-all text-body-sm whitespace-nowrap"
                    onClick={() => setInput(suggestion)}
                  >
                    {suggestion}
                  </button>
                )
              })}
            </div>
            <div className="relative flex items-center bg-surface-bg border border-border-base rounded-2xl p-2 pl-5 focus-within:border-primary shadow-lg">
              <input
                className="flex-1 bg-transparent border-none focus:ring-0 text-body-md py-3 outline-none"
                placeholder={t('careerCoach.inputPlaceholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button className="rounded-xl" onClick={handleSend} disabled={isSending}>
                <Icon name="send" />
              </Button>
            </div>
            <p className="text-center text-label-sm text-on-surface-variant opacity-60">{t('careerCoach.disclaimer')}</p>
          </div>
        </div>
      </section>

      <aside className="w-80 border-l border-border-base bg-surface-muted flex flex-col p-6 overflow-y-auto chat-scroll shrink-0">
        <div className="mb-8">
          <h3 className="font-headline-md text-headline-md mb-2">{t('careerCoach.focusedGrowth')}</h3>
          <p className="text-body-sm text-on-surface-variant">{t('careerCoach.focusedGrowthSubtitle')}</p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-label-md uppercase tracking-wider text-on-surface-variant">{t('careerCoach.topPriorities')}</h4>
              <Icon name="auto_awesome" className="text-primary text-[18px]" />
            </div>
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec) => (
                <div key={rec.title} className="p-4 bg-surface-bg rounded-xl border-l-4 border-secondary shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <PriorityBadge priority={rec.priority} />
                  <p className="font-body-md font-semibold mt-2">{rec.title}</p>
                  <div className="flex items-center gap-3 mt-3 text-label-sm text-on-surface-variant">
                    <span className="flex items-center gap-1"><Icon name="schedule" className="text-[14px]" />{t('careerCoach.hoursFormat', { hours: rec.estimated_hours })}</span>
                    <span className="flex items-center gap-1"><Icon name="layers" className="text-[14px]" />{t('careerCoach.modulesFormat', { count: rec.modules })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {analysis && (
            <div>
              <h4 className="font-label-md uppercase tracking-wider text-on-surface-variant mb-3">{t('careerCoach.skillRadar')}</h4>
              <div className="space-y-2">
                {Object.entries(analysis.skill_scores).slice(0, 4).map(([skill, score]) => (
                  <div key={skill} className="flex items-center justify-between p-2 bg-surface-bg rounded-lg border border-border-base">
                    <span className="text-body-sm font-medium">{getDomainLabel(locale, skill)}</span>
                    <div className="w-24 h-1.5 bg-surface-subtle rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis?.job_match_preview[0] && (
            <div>
              <h4 className="font-label-md uppercase tracking-wider text-on-surface-variant mb-3">{t('careerCoach.gapAnalysis')}</h4>
              {analysis.job_match_preview[0].gaps.slice(0, 2).map((gap) => (
                <div key={gap.skill} className="flex items-center gap-3 p-3 bg-surface-bg border border-border-base rounded-xl mb-2">
                  <div className={`w-2 h-2 rounded-full ${gap.status === 'MATCHED' ? 'bg-success' : 'bg-error'}`} />
                  <div className="flex-1">
                    <p className="font-label-md">{gap.skill}</p>
                    <p className="text-body-sm text-on-surface-variant">{gap.description}</p>
                  </div>
                  <GapBadge status={gap.status} />
                </div>
              ))}
            </div>
          )}

          {analysis && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white relative overflow-hidden">
              <p className="font-label-md opacity-80 mb-1">{t('careerCoach.projection')}</p>
              <p className="font-body-md font-bold mb-2">{t('careerCoach.promotion', { months: analysis.promotion_projection_months })}</p>
              <p className="text-label-sm opacity-90">{t('careerCoach.promotionHint')}</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

function CoachAvatar({ pulsing }: { pulsing?: boolean }) {
  return (
    <div className={`w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0 ${pulsing ? 'ai-pulse' : ''}`}>
      <Icon name="psychology" className="text-primary" />
    </div>
  )
}

function UserAvatar() {
  return (
    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
      <Icon name="person" />
    </div>
  )
}
