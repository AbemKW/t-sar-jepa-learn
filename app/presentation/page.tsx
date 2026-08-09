'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { FlashcardDeck } from '@/components/presentation/FlashcardDeck';
import { TalkingPoints } from '@/components/presentation/TalkingPoints';
import { Award, Layers, Presentation } from 'lucide-react';

export default function PresentationPage() {
  const [tab, setTab] = useState<'flashcards' | 'outline'>('flashcards');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Banner */}
        <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>IEEE GRSS Data Fusion Contest 2026 Presentation Rehearsal</span>
            </div>
            <h1 className="text-2xl font-bold font-mono text-slate-100">
              T-SAR-JEPA Oral Presentation Defense & Rehearsal Hub
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Designed for the 12-minute presentation + 3-minute Q&A session at IGARSS 2026.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl flex space-x-1 font-mono text-xs">
            <button
              onClick={() => setTab('flashcards')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-2 transition-all ${
                tab === 'flashcards'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Rehearsal Flashcards</span>
            </button>

            <button
              onClick={() => setTab('outline')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-2 transition-all ${
                tab === 'outline'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>10-Slide Deck Outline</span>
            </button>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="pt-2">
          {tab === 'flashcards' ? <FlashcardDeck /> : <TalkingPoints />}
        </div>
      </main>
    </div>
  );
}
