import { create } from 'zustand';
import { ChapterId } from '@/types/explainer';

interface ExplainerState {
  activeChapterId: ChapterId;
  activeStepId: string;
  activeStepIndex: number;
  activeDiagramNode: string | null;
  activeCodeSnippetId: string;
  highlightedLines: number[];
  
  // Interactive Parameters
  contextWindowK: number;
  deltaT: number;
  maskRatio: number;
  anomalyThreshold: number;
  unfreezingPhase: 'phase_a' | 'phase_b';
  
  // View Modes & UI toggles
  workspaceTab: 'diagram' | 'tensor' | 'latent' | 'code';
  isPresentationMode: boolean;
  activeFlashcardIndex: number;
  completedStepIds: Set<string>;

  // Actions
  setActiveChapter: (chapterId: ChapterId) => void;
  setActiveStep: (stepId: string, index: number, snippetId: string, lines?: number[], node?: string | null) => void;
  setActiveDiagramNode: (node: string | null) => void;
  setHighlightedLines: (lines: number[]) => void;
  setWorkspaceTab: (tab: 'diagram' | 'tensor' | 'latent' | 'code') => void;
  updateParameters: (params: Partial<{
    contextWindowK: number;
    deltaT: number;
    maskRatio: number;
    anomalyThreshold: number;
    unfreezingPhase: 'phase_a' | 'phase_b';
  }>) => void;
  markStepCompleted: (stepId: string) => void;
  togglePresentationMode: () => void;
  setFlashcardIndex: (index: number) => void;
}

export const useExplainerStore = create<ExplainerState>((set) => ({
  activeChapterId: 'ch1_data_foundations',
  activeStepId: 'step_1_1',
  activeStepIndex: 0,
  activeDiagramNode: 'patch_extractor',
  activeCodeSnippetId: 'coherence_py',
  highlightedLines: [],

  contextWindowK: 7,
  deltaT: 14,
  maskRatio: 0.7,
  anomalyThreshold: 0.15,
  unfreezingPhase: 'phase_a',

  workspaceTab: 'diagram',
  isPresentationMode: false,
  activeFlashcardIndex: 0,
  completedStepIds: new Set(['step_1_1']),

  setActiveChapter: (chapterId) => set({ activeChapterId: chapterId }),
  
  setActiveStep: (stepId, index, snippetId, lines = [], node: string | null = null) => 
    set((state) => ({
      activeStepId: stepId,
      activeStepIndex: index,
      activeCodeSnippetId: snippetId,
      highlightedLines: lines,
      activeDiagramNode: node,
      completedStepIds: new Set([...Array.from(state.completedStepIds), stepId]),
    })),

  setActiveDiagramNode: (node) => set({ activeDiagramNode: node }),
  
  setHighlightedLines: (lines) => set({ highlightedLines: lines }),
  
  setWorkspaceTab: (tab) => set({ workspaceTab: tab }),

  updateParameters: (params) => set((state) => ({ ...state, ...params })),

  markStepCompleted: (stepId) => 
    set((state) => ({
      completedStepIds: new Set([...Array.from(state.completedStepIds), stepId]),
    })),

  togglePresentationMode: () => set((state) => ({ isPresentationMode: !state.isPresentationMode })),

  setFlashcardIndex: (index) => set({ activeFlashcardIndex: index }),
}));
