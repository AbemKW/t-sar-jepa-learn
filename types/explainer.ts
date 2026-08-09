export type ChapterId = 
  | 'ch1_data_foundations'
  | 'ch2_spatial_encoder'
  | 'ch3_time_predictor'
  | 'ch4_stage1_pretrain'
  | 'ch5_stage2_temporal'
  | 'ch6_stage3_unfreezing'
  | 'ch7_evaluation_metrics'
  | 'ch8_presentation_deck';

export interface CodeAnnotation {
  line: number;
  label: string;
  explanation: string;
  tensorShape?: string;
}

export interface CodeSnippet {
  id: string;
  filePath: string;
  title: string;
  description: string;
  language: string;
  code: string;
  annotations: CodeAnnotation[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StepData {
  id: string;
  chapterId: ChapterId;
  title: string;
  subtitle: string;
  content: string;
  mathEquations?: string[];
  codeSnippetId: string;
  highlightLines?: number[];
  activeDiagramNode?: 'patch_extractor' | 'encoder' | 'time_enc' | 'predictor' | 'l2_loss' | 'unfreezing' | 'coherence';
  defaultParams?: {
    contextWindowK?: number;
    deltaT?: number;
    maskRatio?: number;
    anomalyThreshold?: number;
    unfreezingPhase?: 'phase_a' | 'phase_b';
  };
  quiz?: QuizQuestion;
}

export interface ChapterData {
  id: ChapterId;
  number: number;
  title: string;
  subtitle: string;
  cognitiveObjective: string;
  estimatedMinutes: number;
  steps: StepData[];
}

export interface Flashcard {
  id: string;
  category: 'Motivation' | 'Architecture' | 'Math' | 'Validation' | 'Reviewer Q&A';
  question: string;
  answer: string;
  keyEquation?: string;
  slideReference: string;
}
