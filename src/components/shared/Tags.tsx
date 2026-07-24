import { cn } from '@/lib/utils'
import { useTranslation } from '@/i18n/useTranslation'

export function DnaTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('dna-tag px-3 py-1 rounded-lg inline-block', className)}>
      {children}
    </span>
  )
}

export function SkillTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('skill-tag px-4 py-2 rounded-full', className)}>
      {children}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: 'HIGH' | 'MEDIUM' | 'LOW' }) {
  const { t } = useTranslation()
  const styles = {
    HIGH: 'text-secondary bg-secondary/10',
    MEDIUM: 'text-primary bg-primary/10',
    LOW: 'text-on-surface-variant bg-surface-subtle',
  }
  const labels = {
    HIGH: t('badges.highPriority'),
    MEDIUM: t('badges.medium'),
    LOW: t('badges.low'),
  }
  return (
    <span className={cn('font-label-sm text-label-sm px-2 py-0.5 rounded font-mono', styles[priority])}>
      {labels[priority]}
    </span>
  )
}

export function GapBadge({ status }: { status: 'MATCHED' | 'HIGH_GAP' | 'MEDIUM_GAP' }) {
  const { t } = useTranslation()
  const styles = {
    MATCHED: 'text-success',
    HIGH_GAP: 'text-error',
    MEDIUM_GAP: 'text-tertiary',
  }
  const labels = {
    MATCHED: t('badges.matched'),
    HIGH_GAP: t('badges.highGap'),
    MEDIUM_GAP: t('badges.mediumGap'),
  }
  return (
    <span className={cn('font-label-sm px-2 py-1 bg-surface-subtle rounded border border-border-base', styles[status])}>
      {labels[status]}
    </span>
  )
}
