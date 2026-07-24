-- DevCompass schema (shared Supabase project with 시그널수사 signal_* tables)
-- Run in Supabase SQL Editor after signal_schema.sql

CREATE TABLE IF NOT EXISTS devcompass_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  github_username TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  public_repos INT DEFAULT 0,
  followers INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devcompass_github_tokens (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  scopes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devcompass_github_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_data JSONB NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_devcompass_github_snapshots_user
  ON devcompass_github_snapshots(user_id, synced_at DESC);

CREATE TABLE IF NOT EXISTS devcompass_analysis_results (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  result JSONB NOT NULL,
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devcompass_career_coach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_devcompass_coach_messages_user
  ON devcompass_career_coach_messages(user_id, created_at);

CREATE TABLE IF NOT EXISTS devcompass_learning_roadmap (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devcompass_repo_recommendations (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  repos JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devcompass_job_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_title TEXT,
  match_score INT,
  gaps JSONB,
  job_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devcompass_portfolios (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  format TEXT DEFAULT 'web',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devcompass_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, type)
);

CREATE TABLE IF NOT EXISTS devcompass_university_missions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  missions JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS devcompass_weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  report JSONB NOT NULL,
  UNIQUE(user_id, week_start)
);

-- Row Level Security
ALTER TABLE devcompass_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE devcompass_github_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE devcompass_github_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE devcompass_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE devcompass_career_coach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE devcompass_learning_roadmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE devcompass_repo_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE devcompass_job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE devcompass_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE devcompass_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE devcompass_university_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE devcompass_weekly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "devcompass_users_own_profiles"
  ON devcompass_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "devcompass_users_own_tokens"
  ON devcompass_github_tokens FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "devcompass_users_own_snapshots"
  ON devcompass_github_snapshots FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "devcompass_users_own_analysis"
  ON devcompass_analysis_results FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "devcompass_users_own_coach_messages"
  ON devcompass_career_coach_messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "devcompass_users_own_roadmap"
  ON devcompass_learning_roadmap FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "devcompass_users_own_repo_recs"
  ON devcompass_repo_recommendations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "devcompass_users_own_job_matches"
  ON devcompass_job_matches FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "devcompass_users_own_portfolios"
  ON devcompass_portfolios FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "devcompass_users_own_resumes"
  ON devcompass_resumes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "devcompass_users_own_missions"
  ON devcompass_university_missions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "devcompass_users_own_reports"
  ON devcompass_weekly_reports FOR ALL USING (auth.uid() = user_id);

-- Service role (API server) bypasses RLS
