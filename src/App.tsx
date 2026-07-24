import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell, CareerCoachShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import LandingPage from '@/pages/LandingPage'
import DashboardPage from '@/pages/DashboardPage'
import DeveloperDNAPage from '@/pages/DeveloperDNAPage'
import SkillAnalysisPage from '@/pages/SkillAnalysisPage'
import GrowthTimelinePage from '@/pages/GrowthTimelinePage'
import CareerCoachPage from '@/pages/CareerCoachPage'
import LearningRoadmapPage from '@/pages/LearningRoadmapPage'
import RepoRecommendationsPage from '@/pages/RepoRecommendationsPage'
import JobMatchingPage from '@/pages/JobMatchingPage'
import PortfolioPage from '@/pages/PortfolioPage'
import ResumePage from '@/pages/ResumePage'
import GitHubUniversityPage from '@/pages/GitHubUniversityPage'
import WeeklyReportPage from '@/pages/WeeklyReportPage'
import SettingsPage from '@/pages/SettingsPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/developer-dna" element={<DeveloperDNAPage />} />
              <Route path="/skill-analysis" element={<SkillAnalysisPage />} />
              <Route path="/growth-timeline" element={<GrowthTimelinePage />} />
              <Route path="/learning-roadmap" element={<LearningRoadmapPage />} />
              <Route path="/repo-recommendations" element={<RepoRecommendationsPage />} />
              <Route path="/job-matching" element={<JobMatchingPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/github-university" element={<GitHubUniversityPage />} />
              <Route path="/weekly-report" element={<WeeklyReportPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route element={<CareerCoachShell />}>
              <Route path="/career-coach" element={<CareerCoachPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
