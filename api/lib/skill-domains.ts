export const SKILL_DOMAINS = [
  'Backend',
  'Frontend',
  'AI',
  'Database',
  'DevOps',
  'Cloud',
  'Documentation',
  'Collaboration',
] as const

export type SkillDomain = (typeof SKILL_DOMAINS)[number]
