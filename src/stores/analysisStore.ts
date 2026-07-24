import { create } from 'zustand'
import type { AnalysisResult } from '@/types/analysis'

interface AnalysisState {
  analysis: AnalysisResult | null
  isSyncing: boolean
  isAnalyzing: boolean
  lastSyncedAt: string | null
  setAnalysis: (analysis: AnalysisResult | null) => void
  setSyncing: (v: boolean) => void
  setAnalyzing: (v: boolean) => void
  setLastSyncedAt: (v: string | null) => void
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  analysis: null,
  isSyncing: false,
  isAnalyzing: false,
  lastSyncedAt: null,
  setAnalysis: (analysis) => set({ analysis }),
  setSyncing: (isSyncing) => set({ isSyncing }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt }),
}))
