import { create } from 'zustand'
import type { AnalysisResult } from '@/types/analysis'

interface AnalysisState {
  analysis: AnalysisResult | null
  isSyncing: boolean
  isAnalyzing: boolean
  analyzeError: string | null
  lastSyncedAt: string | null
  setAnalysis: (analysis: AnalysisResult | null) => void
  setSyncing: (v: boolean) => void
  setAnalyzing: (v: boolean) => void
  setAnalyzeError: (error: string | null) => void
  setLastSyncedAt: (v: string | null) => void
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  analysis: null,
  isSyncing: false,
  isAnalyzing: false,
  analyzeError: null,
  lastSyncedAt: null,
  setAnalysis: (analysis) => set({ analysis }),
  setSyncing: (isSyncing) => set({ isSyncing }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setAnalyzeError: (analyzeError) => set({ analyzeError }),
  setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt }),
}))
