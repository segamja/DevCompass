import type { AnalysisResult, Profile } from '@/types/analysis'

export const DEMO_PROFILE: Profile = {
  id: 'demo-user',
  github_username: 'alexc-dev',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexc-dev',
  bio: 'Full-stack developer passionate about AI and open source.',
  public_repos: 42,
  followers: 128,
  created_at: '2020-03-15T00:00:00Z',
}

export const DEMO_ANALYSIS: AnalysisResult = {
  developer_slogan: 'Building autonomous AI agents with robust backend systems',
  developer_dna: ['AI Agent Builder', 'Problem Solver', 'Backend Engineer'],
  primary_archetype: 'AI Agent Builder',
  dna_stability_score: 94,
  career_score: 842,
  skill_scores: {
    Backend: 88,
    Frontend: 72,
    AI: 91,
    Database: 85,
    DevOps: 68,
    Cloud: 74,
    Documentation: 80,
    Collaboration: 86,
  },
  growth_timeline: [
    {
      id: '1', title: 'Python Mastery', period: 'Q1 2022', category: 'Foundation',
      story: 'The bridge from script to architecture. You transitioned from simple automation to building scalable backend logic.',
      tags: ['PYTHON', 'OOP'], icon: 'terminal',
    },
    {
      id: '2', title: 'FastAPI Orchestration', period: 'Q3 2022', category: 'Connectivity',
      story: 'Shifting focus to high-performance APIs. You mastered asynchronous programming and automated documentation flows.',
      tags: ['ASYNCIO', 'Pydantic'], icon: 'api',
    },
    {
      id: '3', title: 'Docker Containerization', period: 'Q1 2023', category: 'Infrastructure',
      story: 'The move to immutable infrastructure. You optimized CI/CD pipelines and ensured reproducible deployments.',
      tags: ['DEVOPS', 'ORCHESTRATION'], icon: 'package',
    },
    {
      id: '4', title: 'React Ecosystem', period: 'Q2 2023', category: 'Full Stack',
      story: 'Bridging the gap to the user. You mastered component lifecycle, state management, and responsive design.',
      tags: ['TYPESCRIPT', 'TAILWIND'], icon: 'web_stories',
    },
    {
      id: '5', title: 'LLM Integration', period: 'Q4 2023', category: 'Intelligence',
      story: 'The leap into generative AI. You began leveraging large language models to automate complex reasoning.',
      tags: ['PROMPT ENG', 'OPENAI'], icon: 'psychology',
    },
    {
      id: '6', title: 'RAG Implementation', period: 'Q1 2024', category: 'Contextual AI',
      story: 'Solving the hallucination problem with vector databases and retrieval-augmented generation.',
      tags: ['PINECONE', 'LANGCHAIN'], icon: 'database',
    },
    {
      id: '7', title: 'AI Agent Architect', period: 'Current', category: 'Autonomy',
      story: 'Designing autonomous systems capable of tool-use, self-correction, and long-term planning.',
      tags: ['AUTONOMY', 'EXECUTION'], icon: 'smart_toy', isCurrent: true,
    },
  ],
  career_story: 'Based on your activity across 14 private and 8 public repositories, your developer DNA shows a heavy specialization in Agentic Workflows and MLOps. Unlike traditional back-end developers, your commit history reveals a deep focus on prompt engineering efficiency, vector database orchestration, and Python-centric distributed systems.',
  tech_stack: {
    primary: ['Python', 'TypeScript', 'LangChain'],
    secondary: ['FastAPI', 'Docker', 'PostgreSQL'],
    exploring: ['Rust', 'LangGraph', 'MCP'],
  },
  strengths: ['Autonomous Agents', 'LLM Fine-tuning', 'Python Architecture'],
  gaps: ['Frontend Polish', 'Cloud Cost Optimization'],
  learning_style: ['Project-based', 'Documentation-first'],
  highlight_projects: [
    { repo_name: 'ai-agent-v2', summary: 'LLM-powered automation agent with tool-use capabilities', key_contribution: 'LangGraph flow design and Supabase integration', stars: 500, language: 'Python' },
    { repo_name: 'distributed-scheduler', summary: 'High-throughput job scheduler with Go concurrency', key_contribution: 'Core scheduling algorithm and Redis-backed queue', stars: 120, language: 'Go' },
    { repo_name: 'devcompass', summary: 'AI developer career platform', key_contribution: 'Full-stack architecture and AI analysis pipeline', stars: 45, language: 'TypeScript' },
  ],
  career_recommendations: [
    { title: 'Master Event Sourcing', priority: 'HIGH', estimated_hours: 12, modules: 4, description: 'Critical for Senior Backend roles' },
    { title: 'Redis Caching Patterns', priority: 'MEDIUM', estimated_hours: 5, modules: 2, description: 'Improve system performance skills' },
    { title: 'Kubernetes Orchestration', priority: 'MEDIUM', estimated_hours: 20, modules: 6, description: 'Cloud-native deployment expertise' },
  ],
  repo_recommendations: [
    { name: 'langgraph', owner: 'langchain-ai', description: 'Build resilient language agents as graphs', stars: 12000, topics: ['ai', 'agents'], match_reason: 'Aligns with your AI Agent Builder DNA', url: 'https://github.com/langchain-ai/langgraph' },
    { name: 'fastapi', owner: 'tiangolo', description: 'Modern Python web framework', stars: 75000, topics: ['python', 'api'], match_reason: 'Matches your backend specialization', url: 'https://github.com/tiangolo/fastapi' },
  ],
  job_match_preview: [
    {
      job_title: 'Senior Backend Engineer',
      match_score: 78,
      gaps: [
        { skill: 'Event-Driven Architecture', status: 'HIGH_GAP', description: 'Low visibility in repos. Need Kafka or RabbitMQ experience.' },
        { skill: 'Database Optimization', status: 'MATCHED', description: 'Strong SQL optimization visible in recent commits.' },
      ],
    },
  ],
  weekly_insights: 'Focus on mastering Distributed Systems and Kubernetes to unlock senior-level job matches.',
  language_distribution: [
    { language: 'Python', percentage: 45, color: '#3776AB' },
    { language: 'TypeScript', percentage: 35, color: '#3178C6' },
    { language: 'Rust', percentage: 20, color: '#DEA584' },
  ],
  contribution_calendar: Array.from({ length: 84 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (83 - i))
    return { date: d.toISOString().split('T')[0], count: Math.floor(Math.random() * 8) }
  }),
  ai_recommendation: {
    title: "You're 12% away from Senior Architect status",
    description: 'Focus on mastering Distributed Systems and Kubernetes orchestration to unlock high-tier job matches.',
    progress: 88,
    action: 'Start Architecture Track',
  },
  learning_velocity: 1.4,
  ai_readiness: 92,
  promotion_projection_months: 4.2,
}

export function enableDemoMode() {
  localStorage.setItem('devcompass_demo', 'true')
}

export function disableDemoMode() {
  localStorage.removeItem('devcompass_demo')
}

export function isDemoMode(): boolean {
  return localStorage.getItem('devcompass_demo') === 'true'
}
