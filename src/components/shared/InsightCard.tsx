import { cn } from '@/lib/utils'
import { Icon } from './Icon'

interface InsightCardProps {
  title?: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export function InsightCard({ title, children, className, action }: InsightCardProps) {
  return (
    <div className={cn('ai-insight-glow bg-white p-8 rounded-2xl flex flex-col', className)}>
      {title && (
        <div className="flex items-center gap-2 text-secondary mb-4">
          <Icon name="auto_awesome" />
          <span className="font-label-md text-label-md font-bold uppercase tracking-wider">{title}</span>
        </div>
      )}
      <div className="flex-1">{children}</div>
      {action}
    </div>
  )
}
