'use client';

import React from 'react';
import { useExplainerStore } from '@/store/useExplainerStore';
import { CHAPTERS } from './ChapterData';
import { BookOpen, CheckCircle2, ChevronRight, Clock } from 'lucide-react';

export const SidebarNav: React.FC = () => {
  const { 
    activeChapterId, 
    setActiveChapter, 
    activeStepId, 
    setActiveStep,
    completedStepIds 
  } = useExplainerStore();

  return (
    <aside className="w-full space-y-4 mb-6">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
        <span className="flex items-center space-x-1.5">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>Walkthrough Curriculum</span>
        </span>
        <span className="text-[10px] text-slate-500 font-normal">8 Chapters</span>
      </div>

      <div className="space-y-2">
        {CHAPTERS.map((ch) => {
          const isCurrentChapter = activeChapterId === ch.id;
          const chapterCompletedCount = ch.steps.filter(s => completedStepIds.has(s.id)).length;
          const isChapterComplete = chapterCompletedCount === ch.steps.length;

          return (
            <div 
              key={ch.id}
              className={`rounded-xl border transition-all ${
                isCurrentChapter 
                  ? 'bg-slate-900 border-slate-700 shadow-md' 
                  : 'bg-slate-950/60 border-slate-900 hover:border-slate-800'
              }`}
            >
              {/* Chapter Header Button */}
              <button
                onClick={() => setActiveChapter(ch.id)}
                className="w-full p-3 text-left flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold ${
                    isCurrentChapter 
                      ? 'bg-indigo-500 text-white' 
                      : isChapterComplete 
                      ? 'bg-emerald-950 border border-emerald-700 text-emerald-300' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {ch.number}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 font-mono">
                      {ch.title}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{ch.estimatedMinutes}m</span>
                      </span>
                      <span>•</span>
                      <span>{ch.steps.length} steps</span>
                    </div>
                  </div>
                </div>

                {isChapterComplete && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </button>

              {/* Steps Accordion */}
              {isCurrentChapter && (
                <div className="px-3 pb-3 space-y-1.5 border-t border-slate-800/60 pt-2">
                  {ch.steps.map((step, idx) => {
                    const isStepActive = activeStepId === step.id;
                    const isStepComplete = completedStepIds.has(step.id);

                    return (
                      <button
                        key={step.id}
                        onClick={() => setActiveStep(step.id, idx, step.codeSnippetId, step.highlightLines, step.activeDiagramNode)}
                        className={`w-full p-2 rounded-lg text-left text-xs font-mono flex items-center justify-between transition-all ${
                          isStepActive 
                            ? 'bg-indigo-950/90 border border-indigo-600 text-indigo-100 font-bold' 
                            : 'hover:bg-slate-800/60 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <ChevronRight className={`w-3 h-3 ${isStepActive ? 'text-indigo-400' : 'text-slate-600'}`} />
                          <span className="truncate">{step.title}</span>
                        </div>
                        {isStepComplete && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
