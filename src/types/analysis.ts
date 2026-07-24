export type SkillDomain =
  | 'Backend'
  | 'Frontend'
  | 'AI'
  | 'Database'
  | 'DevOps'
  | 'Cloud'
  | 'Documentation'
  | 'Collaboration'

export interface TimelineMilestone {
  id: string
  title: string
  period: string
  category: string
  story: string
  tags: string[]
  icon: string
  isCurrent?: boolean
}

export interface HighlightProject {
  repo_name: string
  summary: string
  key_contribution: string
  stars?: number
  language?: string
}

export interface CareerRecommendation {
  title: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  estimated_hours: number
  modules: number
  description: string
}

export interface RepoRecommendation {
  name: string
  owner: string
  description: string
  stars: number
  topics: string[]
  match_reason: string
  url: string
}

export interface JobMatchGap {
  skill: string
  status: 'MATCHED' | 'HIGH_GAP' | 'MEDIUM_GAP'
  description: string
}

export interface JobMatchPreview {
  job_title: string
  match_score: number
  gaps: JobMatchGap[]
}

export interface TechStack {
  primary: string[]
  secondary: string[]
  exploring: string[]
}

export interface LanguageDistribution {
  language: string
  percentage: number
  color?: string
}

export interface ContributionDay {
  date: string
  count: number
}

export interface AnalysisResult {
  developer_slogan: string
  developer_dna: string[]
  primary_archetype: string
  dna_stability_score: number
  career_score: number
  skill_scores: Record<SkillDomain, number>
  growth_timeline: TimelineMilestone[]
  career_story: string
  tech_stack: TechStack
  strengths: string[]
  gaps: string[]
  learning_style: string[]
  highlight_projects: HighlightProject[]
  career_recommendations: CareerRecommendation[]
  repo_recommendations: RepoRecommendation[]
  job_match_preview: JobMatchPreview[]
  weekly_insights: string
  language_distribution: LanguageDistribution[]
  contribution_calendar: ContributionDay[]
  ai_recommendation: {
    title: string
    description: string
    progress: number
    action: string
  }
  learning_velocity: number
  ai_readiness: number
  promotion_projection_months: number
}

export interface Profile {
  id: string
  github_username: string
  avatar_url: string | null
  bio: string | null
  public_repos: number
  followers: number
  created_at: string
}

export interface CareerCoachMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface LearningRoadmapItem {
  id: string
  title: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  progress: number
  estimated_hours: number
  modules: number
  description: string
}

export interface UniversityMission {
  id: string
  type: 'daily' | 'weekly'
  title: string
  description: string
  completed: boolean
  points: number
}

export interface WeeklyReport {
  week_start: string
  contributions: number
  skill_changes: { skill: string; change: number }[]
  highlights: string[]
  recommended_skills: string[]
  summary: string
}

export interface ResumeContent {
  type: 'resume' | 'cover' | 'linkedin'
  content: string
}

export interface PortfolioContent {
  developer_slogan: string
  career_story: string
  tech_stack: TechStack
  highlight_projects: HighlightProject[]
  developer_dna: string[]
  skill_scores: Record<SkillDomain, number>
}

export interface GitHubSnapshot {
  profile: {
    login: string
    name: string | null
    bio: string | null
    avatar_url: string
    public_repos: number
    followers: number
    created_at: string
  }
  repos: Array<{
    name: string
    full_name: string
    description: string | null
    stargazers_count: number
    forks_count: number
    language: string | null
    topics: string[]
    updated_at: string
  }>
  starred: Array<{
    name: string
    full_name: string
    description: string | null
    stargazers_count: number
    topics: string[]
  }>
  languages: Record<string, number>
  readmes: Record<string, string>
  contribution_calendar: ContributionDay[]
  total_contributions: number
}

export const SKILL_DOMAINS: SkillDomain[] = [
  'Backend',
  'Frontend',
  'AI',
  'Database',
  'DevOps',
  'Cloud',
  'Documentation',
  'Collaboration',
]

export const DNA_ARCHETYPES = [
  'AI Agent Builder',
  'Backend Engineer',
  'Frontend Creator',
  'Cloud Architect',
  'Open Source Explorer',
  'Problem Solver',
] as const

export const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3776AB',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Rust: '#DEA584',
  Go: '#00ADD8',
  Java: '#ED8B00',
  'C++': '#00599C',
  Ruby: '#CC342D',
  PHP: '#777BB4',
  Swift: '#FA7343',
  Kotlin: '#7F52FF',
  Dart: '#0175C2',
  Shell: '#89E051',
  HTML: '#E34F26',
  CSS: '#1572B6',
}
