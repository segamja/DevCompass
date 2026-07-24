import OpenAI from 'openai'
import type { AnalysisResult, GitHubSnapshot, SkillDomain } from '../../src/types/analysis.js'
import { SKILL_DOMAINS } from './skill-domains.js'
import { computeLanguageDistribution } from './github.js'

const ANALYSIS_SCHEMA = {
  type: 'object' as const,
  properties: {
    developer_slogan: { type: 'string' },
    developer_dna: { type: 'array', items: { type: 'string' } },
    primary_archetype: { type: 'string' },
    dna_stability_score: { type: 'number' },
    career_score: { type: 'number' },
    skill_scores: {
      type: 'object',
      properties: Object.fromEntries(SKILL_DOMAINS.map((d) => [d, { type: 'number' }])),
      required: SKILL_DOMAINS,
      additionalProperties: false,
    },
    growth_timeline: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          period: { type: 'string' },
          category: { type: 'string' },
          story: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          icon: { type: 'string' },
          isCurrent: { type: 'boolean' },
        },
        required: ['id', 'title', 'period', 'category', 'story', 'tags', 'icon'],
        additionalProperties: false,
      },
    },
    career_story: { type: 'string' },
    tech_stack: {
      type: 'object',
      properties: {
        primary: { type: 'array', items: { type: 'string' } },
        secondary: { type: 'array', items: { type: 'string' } },
        exploring: { type: 'array', items: { type: 'string' } },
      },
      required: ['primary', 'secondary', 'exploring'],
      additionalProperties: false,
    },
    strengths: { type: 'array', items: { type: 'string' } },
    gaps: { type: 'array', items: { type: 'string' } },
    learning_style: { type: 'array', items: { type: 'string' } },
    highlight_projects: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          repo_name: { type: 'string' },
          summary: { type: 'string' },
          key_contribution: { type: 'string' },
        },
        required: ['repo_name', 'summary', 'key_contribution'],
        additionalProperties: false,
      },
    },
    career_recommendations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          priority: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] },
          estimated_hours: { type: 'number' },
          modules: { type: 'number' },
          description: { type: 'string' },
        },
        required: ['title', 'priority', 'estimated_hours', 'modules', 'description'],
        additionalProperties: false,
      },
    },
    repo_recommendations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          owner: { type: 'string' },
          description: { type: 'string' },
          stars: { type: 'number' },
          topics: { type: 'array', items: { type: 'string' } },
          match_reason: { type: 'string' },
          url: { type: 'string' },
        },
        required: ['name', 'owner', 'description', 'stars', 'topics', 'match_reason', 'url'],
        additionalProperties: false,
      },
    },
    job_match_preview: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          job_title: { type: 'string' },
          match_score: { type: 'number' },
          gaps: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                skill: { type: 'string' },
                status: { type: 'string', enum: ['MATCHED', 'HIGH_GAP', 'MEDIUM_GAP'] },
                description: { type: 'string' },
              },
              required: ['skill', 'status', 'description'],
              additionalProperties: false,
            },
          },
        },
        required: ['job_title', 'match_score', 'gaps'],
        additionalProperties: false,
      },
    },
    weekly_insights: { type: 'string' },
    ai_recommendation: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        progress: { type: 'number' },
        action: { type: 'string' },
      },
      required: ['title', 'description', 'progress', 'action'],
      additionalProperties: false,
    },
    learning_velocity: { type: 'number' },
    ai_readiness: { type: 'number' },
    promotion_projection_months: { type: 'number' },
  },
  required: [
    'developer_slogan', 'developer_dna', 'primary_archetype', 'dna_stability_score',
    'career_score', 'skill_scores', 'growth_timeline', 'career_story', 'tech_stack',
    'strengths', 'gaps', 'learning_style', 'highlight_projects', 'career_recommendations',
    'repo_recommendations', 'job_match_preview', 'weekly_insights', 'ai_recommendation',
    'learning_velocity', 'ai_readiness', 'promotion_projection_months',
  ],
  additionalProperties: false,
}

function buildFallbackAnalysis(snapshot: GitHubSnapshot): AnalysisResult {
  const langs = computeLanguageDistribution(snapshot.languages)
  const topLang = langs[0]?.language || 'TypeScript'
  const skillScores = Object.fromEntries(
    SKILL_DOMAINS.map((d) => [d, 50 + Math.floor(Math.random() * 40)]),
  ) as Record<SkillDomain, number>

  return {
    developer_slogan: `${topLang} developer building meaningful open source projects`,
    developer_dna: ['Problem Solver', 'Backend Engineer'],
    primary_archetype: 'Backend Engineer',
    dna_stability_score: 78,
    career_score: 720,
    skill_scores: skillScores,
    growth_timeline: [
      {
        id: '1', title: `${topLang} Foundation`, period: 'Early Career', category: 'Foundation',
        story: `Started building projects with ${topLang}.`, tags: [topLang.toUpperCase()], icon: 'terminal',
      },
      {
        id: '2', title: 'Open Source Growth', period: 'Recent', category: 'Growth',
        story: 'Expanded into collaborative development and documentation.', tags: ['OPEN SOURCE'], icon: 'code', isCurrent: true,
      },
    ],
    career_story: `${snapshot.profile.name || snapshot.profile.login} is an active GitHub developer with ${snapshot.profile.public_repos} public repositories and ${snapshot.total_contributions} contributions.`,
    tech_stack: {
      primary: langs.slice(0, 3).map((l) => l.language),
      secondary: ['Docker', 'Git'],
      exploring: snapshot.starred.slice(0, 3).flatMap((s) => s.topics).slice(0, 3),
    },
    strengths: ['Consistent contributions', 'Project ownership'],
    gaps: ['System design visibility', 'Cloud certifications'],
    learning_style: ['Project-based', 'Documentation-first'],
    highlight_projects: snapshot.repos.slice(0, 3).map((r) => ({
      repo_name: r.name,
      summary: r.description || 'Personal project',
      key_contribution: 'Core development and maintenance',
      stars: r.stargazers_count,
      language: r.language || undefined,
    })),
    career_recommendations: [
      { title: 'Docker & Containerization', priority: 'HIGH', estimated_hours: 12, modules: 4, description: 'Strengthen DevOps skills' },
      { title: 'System Design Patterns', priority: 'MEDIUM', estimated_hours: 20, modules: 6, description: 'Prepare for senior roles' },
    ],
    repo_recommendations: [
      { name: 'fastapi', owner: 'tiangolo', description: 'Modern Python web framework', stars: 75000, topics: ['python', 'api'], match_reason: 'Matches your backend focus', url: 'https://github.com/tiangolo/fastapi' },
    ],
    job_match_preview: [
      {
        job_title: 'Backend Engineer',
        match_score: 75,
        gaps: [
          { skill: 'Database Optimization', status: 'MATCHED', description: 'Strong SQL usage in repos' },
          { skill: 'Kubernetes', status: 'HIGH_GAP', description: 'Limited K8s experience visible' },
        ],
      },
    ],
    weekly_insights: 'Keep contributing consistently to maintain growth momentum.',
    language_distribution: langs,
    contribution_calendar: snapshot.contribution_calendar.slice(-84),
    ai_recommendation: {
      title: 'Focus on Cloud & DevOps',
      description: 'Adding container orchestration skills will unlock senior-level opportunities.',
      progress: 72,
      action: 'Start DevOps Track',
    },
    learning_velocity: 1.2,
    ai_readiness: 65,
    promotion_projection_months: 6,
  }
}

export async function runAIAnalysis(snapshot: GitHubSnapshot): Promise<AnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY
  const language_distribution = computeLanguageDistribution(snapshot.languages)

  const context = {
    profile: snapshot.profile,
    repos: snapshot.repos.slice(0, 15),
    starred: snapshot.starred.slice(0, 10),
    languages: snapshot.languages,
    readmes: Object.fromEntries(
      Object.entries(snapshot.readmes).map(([k, v]) => [k, String(v).replace(/[^\w\s.,!?-]/g, ' ').slice(0, 1500)]),
    ),
    total_contributions: snapshot.total_contributions,
  }

  if (!apiKey) {
    const fallback = buildFallbackAnalysis(snapshot)
    return { ...fallback, language_distribution, contribution_calendar: snapshot.contribution_calendar.slice(-84) }
  }

  const openai = new OpenAI({ apiKey })

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are DevCompass AI, an expert developer career analyst. Analyze GitHub activity data and return structured JSON matching the schema. Be specific, actionable, and encouraging. Use realistic scores 0-100 for skill_scores.`,
        },
        {
          role: 'user',
          content: `Analyze this developer's GitHub data:\n${JSON.stringify(context, null, 2)}`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'devcompass_analysis',
          strict: true,
          schema: ANALYSIS_SCHEMA,
        },
      },
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('Empty AI response')

    const parsed = JSON.parse(content) as Omit<AnalysisResult, 'language_distribution' | 'contribution_calendar'>
    return {
      ...parsed,
      language_distribution,
      contribution_calendar: snapshot.contribution_calendar.slice(-84),
    }
  } catch {
    const fallback = buildFallbackAnalysis(snapshot)
    return { ...fallback, language_distribution, contribution_calendar: snapshot.contribution_calendar.slice(-84) }
  }
}

export async function runCareerCoachChat(
  message: string,
  analysis: AnalysisResult | null,
  history: { role: string; content: string }[],
): Promise<string> {
  const topRec = analysis?.career_recommendations[0]?.title || 'system design'
  const fallback = `분석 결과�?바탕?�로 "${topRec}" ?�습???�선 추천?�립?�다.\n\n질문: "${message}"\n\n(OpenAI API ?�결 ?�는 DNA 분석 ?????�세??코칭??받을 ???�습?�다.)`

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey.startsWith('sk-your-')) {
    return fallback
  }

  try {
    const openai = new OpenAI({ apiKey })
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are DevCompass Career Coach. Help developers grow their careers based on their GitHub analysis. Be concise, specific, and actionable. Reply in the same language as the user's message.\n\nDeveloper context: ${JSON.stringify(analysis?.developer_dna || [])} | Archetype: ${analysis?.primary_archetype || 'Unknown'} | Skills: ${JSON.stringify(analysis?.skill_scores || {})}`,
        },
        ...history.slice(-10).map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user', content: message },
      ],
      max_tokens: 1000,
    })

    return response.choices[0]?.message?.content || fallback
  } catch (err) {
    console.error('Career coach OpenAI error:', err)
    return fallback
  }
}
