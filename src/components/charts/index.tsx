import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'
import type { SkillDomain } from '@/types/analysis'
import { SKILL_DOMAINS } from '@/types/analysis'

interface SkillRadarProps {
  scores: Record<SkillDomain, number>
  className?: string
}

export function SkillRadarChart({ scores, className }: SkillRadarProps) {
  const data = SKILL_DOMAINS.map((domain) => ({
    domain,
    score: scores[domain] ?? 0,
  }))

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis
            dataKey="domain"
            tick={{ fill: '#464555', fontSize: 12, fontFamily: 'JetBrains Mono' }}
          />
          <Radar
            dataKey="score"
            stroke="#4f46e5"
            fill="rgba(79, 70, 229, 0.2)"
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface CareerScoreChartProps {
  data: { month: string; score: number }[]
}

export function CareerScoreChart({ data }: CareerScoreChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis hide domain={[0, 100]} />
        <Tooltip
          contentStyle={{ background: '#111827', border: 'none', borderRadius: 8, color: '#fff' }}
        />
        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={entry.month}
              fill={index === data.length - 1 ? '#3525cd' : `rgba(53, 37, 205, ${0.1 + index * 0.08})`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

interface HeatmapProps {
  days: { date: string; count: number }[]
}

function getHeatmapColor(count: number, max: number): string {
  if (count === 0) return '#F3F4F6'
  const ratio = count / Math.max(max, 1)
  if (ratio < 0.25) return '#c3c0ff'
  if (ratio < 0.5) return '#4f46e5'
  if (ratio < 0.75) return '#3525cd'
  return '#0f0069'
}

export function ContributionHeatmap({ days }: HeatmapProps) {
  const max = Math.max(...days.map((d) => d.count), 1)
  const weeks: typeof days[] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1">
      {weeks.flatMap((week, wi) =>
        week.map((day, di) => (
          <div
            key={`${wi}-${di}`}
            className="heatmap-cell transition-transform hover:scale-125 hover:ring-2 hover:ring-primary"
            style={{ backgroundColor: getHeatmapColor(day.count, max) }}
            title={`${day.date}: ${day.count} contributions`}
          />
        )),
      )}
    </div>
  )
}

interface LanguageBarsProps {
  languages: { language: string; percentage: number; color?: string }[]
}

export function LanguageBars({ languages }: LanguageBarsProps) {
  return (
    <div className="space-y-4">
      {languages.map((lang) => (
        <div key={lang.language} className="space-y-2">
          <div className="flex justify-between font-label-md text-label-md">
            <span>{lang.language}</span>
            <span>{lang.percentage}%</span>
          </div>
          <div className="h-2 w-full bg-surface-subtle rounded-full overflow-hidden">
            <div
              className="h-full transition-all"
              style={{
                width: `${lang.percentage}%`,
                backgroundColor: lang.color || '#3525cd',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

interface VelocityChartProps {
  data: number[]
}

export function VelocityChart({ data }: VelocityChartProps) {
  const chartData = data.map((value, i) => ({ index: i + 1, value }))
  return (
    <div className="h-32 flex items-end gap-2">
      {chartData.map((item, i) => (
        <div
          key={item.index}
          className="flex-1 rounded-t transition-all duration-300 hover:bg-primary"
          style={{
            height: `${item.value}%`,
            backgroundColor: i === chartData.length - 1 ? '#3525cd' : `rgba(53, 37, 205, 0.1)`,
          }}
        />
      ))}
    </div>
  )
}
