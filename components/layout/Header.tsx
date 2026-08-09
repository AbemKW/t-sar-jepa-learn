'use client';

import React from 'react';
import Link from 'next/link';
import { useExplainerStore } from '@/store/useExplainerStore';
import { CHAPTERS } from '@/components/walkthrough/ChapterData';
import { BookOpen, Presentation, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeChapterId, 
    setActiveChapter, 
    isPresentationMode, 
    togglePresentationMode,
    completedStepIds 
  } = useExplainerStore();

  const totalSteps = CHAPTERS.reduce((acc, ch) => acc + ch.steps.length, 0);
  const completedCount = completedStepIds.size;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const activeChapter = CHAPTERS.find(c => c.id === activeChapterId) || CHAPTERS[0];

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-cyan-500 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-all" />
            </div>
          </div>
          <div>
            <div className="text-sm font-black tracking-wider text-slate-100 uppercase font-mono">
              T-SAR-JEPA <span className="text-cyan-400">LEARN</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              IEEE GRSS DFC 2026 Walkthrough
            </div>
          </div>
        </Link>

        {/* Chapter Selector Dropdown */}
        <div className="relative group">
          <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ch {activeChapter.number}: {activeChapter.title}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          <div className="absolute left-0 top-10 hidden group-hover:block w-72 bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-2xl z-50">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
              Select Walkthrough Chapter
            </div>
            <div className="space-y-1">
              {CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapter(ch.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-all ${
                    activeChapterId === ch.id 
                      ? 'bg-indigo-950/80 border border-indigo-700 text-indigo-200 font-bold' 
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span>Ch {ch.number}: {ch.title}</span>
                  <span className="text-[10px] text-slate-500">{ch.estimatedMinutes}m</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar & Presentation Mode Switch */}
      <div className="flex items-center space-x-6">
        {/* Progress Bar */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-xs font-mono text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-36 h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Mode Toggle */}
        <Link 
          href={isPresentationMode ? '/' : '/presentation'}
          onClick={togglePresentationMode}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-2 border transition-all ${
            isPresentationMode 
              ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/25' 
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <Presentation className="w-4 h-4 text-cyan-300" />
          <span>{isPresentationMode ? 'Walkthrough Mode' : 'IGARSS Presentation Mode'}</span>
        </Link>
      </div>
    </header>
  );
};
