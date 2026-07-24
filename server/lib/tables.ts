/** Shared Supabase project table names (devcompass_ prefix) */
export const TABLES = {
  profiles: 'devcompass_profiles',
  githubTokens: 'devcompass_github_tokens',
  githubSnapshots: 'devcompass_github_snapshots',
  analysisResults: 'devcompass_analysis_results',
  careerCoachMessages: 'devcompass_career_coach_messages',
  learningRoadmap: 'devcompass_learning_roadmap',
  repoRecommendations: 'devcompass_repo_recommendations',
  jobMatches: 'devcompass_job_matches',
  portfolios: 'devcompass_portfolios',
  resumes: 'devcompass_resumes',
  universityMissions: 'devcompass_university_missions',
  weeklyReports: 'devcompass_weekly_reports',
} as const
