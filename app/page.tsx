'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { SplitLayout } from '@/components/layout/SplitLayout';
import { SidebarNav } from '@/components/walkthrough/SidebarNav';
import { StepCard } from '@/components/walkthrough/StepCard';
import { CHAPTERS } from '@/components/walkthrough/ChapterData';
import { useExplainerStore } from '@/store/useExplainerStore';
import { Award, BookOpen, Clock, Target } from 'lucide-react';

export default function Home() {
  const { 
    activeChapterId, 
    activeStepId, 
    activeStepIndex,
    setActiveStep 
  } = useExplainerStore();

  const currentChapter = CHAPTERS.find(c => c.id === activeChapterId) || CHAPTERS[0];
  const currentStep = currentChapter.steps[activeStepIndex] || currentChapter.steps[0];

  const handleNextStep = () => {
    if (activeStepIndex < currentChapter.steps.length - 1) {
      const nextIdx = activeStepIndex + 1;
      const nextStep = currentChapter.steps[nextIdx];
      setActiveStep(nextStep.id, nextIdx, nextStep.codeSnippetId, nextStep.highlightLines, nextStep.activeDiagramNode);
    } else {
      // Advance to next chapter
      const currentChapterIdx = CHAPTERS.findIndex(c => c.id === activeChapterId);
      if (currentChapterIdx < CHAPTERS.length - 1) {
        const nextChapter = CHAPTERS[currentChapterIdx + 1];
        useExplainerStore.getState().setActiveChapter(nextChapter.id);
        const firstStep = nextChapter.steps[0];
        setActiveStep(firstStep.id, 0, firstStep.codeSnippetId, firstStep.highlightLines, firstStep.activeDiagramNode);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <SplitLayout>
        <div className="space-y-6">
          {/* Chapter Banner */}
          <div className="p-5 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="flex items-center space-x-1.5 text-cyan-400 font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Chapter {currentChapter.number} of {CHAPTERS.length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Est. {currentChapter.estimatedMinutes} min read</span>
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold font-mono text-slate-100">
                {currentChapter.title}
              </h1>
              <p className="text-xs font-mono text-indigo-300 mt-0.5">
                {currentChapter.subtitle}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-300 flex items-start space-x-2">
              <Target className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-400">Cognitive Objective: </span>
                <span>{currentChapter.cognitiveObjective}</span>
              </div>
            </div>
          </div>

          {/* Sidebar Chapter Tree */}
          <SidebarNav />

          {/* Active Step Card */}
          <StepCard 
            step={currentStep}
            stepIndex={activeStepIndex}
            totalStepsInChapter={currentChapter.steps.length}
            onNextStep={handleNextStep}
          />
        </div>
      </SplitLayout>
    </div>
  );
}
