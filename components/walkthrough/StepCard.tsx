'use client';

import React, { useState } from 'react';
import { StepData } from '@/types/explainer';
import { useExplainerStore } from '@/store/useExplainerStore';
import { SNIPPET_REGISTRY } from '@/components/code/SnippetRegistry';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Code2, HelpCircle, CheckCircle2, XCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface StepCardProps {
  step: StepData;
  stepIndex: number;
  totalStepsInChapter: number;
  onNextStep: () => void;
}

export const StepCard: React.FC<StepCardProps> = ({ 
  step, 
  stepIndex, 
  totalStepsInChapter,
  onNextStep 
}) => {
  const { setWorkspaceTab, markStepCompleted } = useExplainerStore();
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const snippet = SNIPPET_REGISTRY[step.codeSnippetId] || SNIPPET_REGISTRY['encoder_py'];

  const handleQuizSubmit = (index: number) => {
    setSelectedQuizIndex(index);
    setQuizSubmitted(true);
    if (step.quiz && index === step.quiz.correctIndex) {
      markStepCompleted(step.id);
    }
  };

  return (
    <article className="space-y-6">
      {/* Step Header */}
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-indigo-950/80 border border-indigo-700 text-indigo-300 font-bold uppercase tracking-wider">
            Step {stepIndex + 1} of {totalStepsInChapter}
          </span>
          <span className="text-slate-400">
            Snippet: <code className="text-cyan-300">{snippet.title}</code>
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
          {step.title}
        </h2>
        <h3 className="text-sm font-semibold text-indigo-400">
          {step.subtitle}
        </h3>
      </div>

      {/* Main Narrative Text */}
      <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
        {step.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      {/* KaTeX Rendered Equations */}
      {step.mathEquations && step.mathEquations.length > 0 && (
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
          <div className="text-xs font-bold uppercase text-indigo-400 tracking-wider font-mono flex items-center space-x-1.5">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
            <span>Mathematical Formulation</span>
          </div>
          <div className="space-y-2 font-mono text-sm text-center text-slate-100 overflow-x-auto py-2">
            {step.mathEquations.map((eq, i) => (
              <div key={i} className="my-1">
                <BlockMath math={eq} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Code Reference Card */}
      <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-200 font-mono uppercase">
              PyTorch Code Snippet & Annotations
            </span>
          </div>
          <button 
            onClick={() => setWorkspaceTab('code')}
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 underline"
          >
            Inspect in Full Code Viewer →
          </button>
        </div>

        <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 font-mono text-xs text-slate-300 space-y-1">
          <div className="text-[10px] text-slate-400 border-b border-slate-800 pb-1 mb-2">
            File: {snippet.filePath}
          </div>
          <div className="text-[11px] text-cyan-300 font-semibold">
            {snippet.description}
          </div>
        </div>
      </div>

      {/* Active Recall Quiz Section */}
      {step.quiz && (
        <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-800/60 rounded-xl space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>Active Recall Checkpoint</span>
          </div>

          <div className="text-sm font-semibold text-slate-100 font-mono">
            {step.quiz.question}
          </div>

          <div className="space-y-2">
            {step.quiz.options.map((option, idx) => {
              const isSelected = selectedQuizIndex === idx;
              const isCorrect = idx === step.quiz?.correctIndex;

              let btnStyle = "bg-slate-900/90 border-slate-800 text-slate-300 hover:border-indigo-600";
              if (quizSubmitted) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-950 border-emerald-500 text-emerald-100 font-bold";
                } else if (isSelected && !isCorrect) {
                  btnStyle = "bg-rose-950 border-rose-500 text-rose-100 font-bold";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleQuizSubmit(idx)}
                  disabled={quizSubmitted}
                  className={`w-full p-3 rounded-lg border text-left text-xs font-mono transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span>
                  {quizSubmitted && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                  {quizSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {quizSubmitted && (
            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
              <div className="font-bold text-indigo-300">Explanation:</div>
              <div>{step.quiz.explanation}</div>
            </div>
          )}
        </div>
      )}

      {/* Next Step Button */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={onNextStep}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-mono text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center space-x-2 transition-all group"
        >
          <span>Continue to Next Step</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </article>
  );
};
