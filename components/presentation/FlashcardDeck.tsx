'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard } from '@/types/explainer';
import { RotateCw, ChevronLeft, ChevronRight, CheckCircle2, Award } from 'lucide-react';

const FLASHCARDS: Flashcard[] = [
  {
    id: 'fc1',
    category: 'Motivation',
    question: 'Why does single-channel SAR amplitude prediction succeed where raw signal reconstruction fails?',
    answer: 'Raw pixel-space reconstruction is corrupted by speckle noise and phase decorrelation over time. Operating in latent representation space (z ∈ ℝ⁷⁶⁸) discards high-frequency pixel noise while capturing semantic temporal surface changes.',
    keyEquation: 'A(t) = ||ẑ_{t+1} - z_{t+1}||₂',
    slideReference: 'Slide 2: Motivation & Core Problem'
  },
  {
    id: 'fc2',
    category: 'Architecture',
    question: 'What is the role of Sinusoidal Time Encodings γ(Δt) in the temporal predictor?',
    answer: 'Satellite revisit intervals are irregular (ranging from 1 to 14 days). Continuous sinusoidal time encodings map temporal deltas into 768-dim space, conditioning the causal transformer on exact elapsed days between passes.',
    keyEquation: 'x = z_{\\text{context}} + \\gamma(\\Delta t)',
    slideReference: 'Slide 5: Stage 2 Temporal Transformer'
  },
  {
    id: 'fc3',
    category: 'Math',
    question: 'How does Stage 3 Progressive Encoder Unfreezing achieve a 50x validation loss improvement?',
    answer: 'By jointly fine-tuning the spatial encoder and temporal predictor end-to-end, spatial representations adapt to optimize temporal predictability, aligning spatial feature extraction with time-series forecasting.',
    keyEquation: '\\text{Phase A (4 blocks + norm)} \\rightarrow \\text{Phase B (Full Unfreezing)}',
    slideReference: 'Slide 4: Pipeline Architecture'
  },
  {
    id: 'fc4',
    category: 'Validation',
    question: 'What quantitative ROC-AUC score does T-SAR-JEPA achieve against InSAR coherence pseudo-GT?',
    answer: 'T-SAR-JEPA achieves 77.0% ROC-AUC compared to unsupervised baselines (PaDiM 52.1%, RX Detector 49.8%, Linear AR 51.4%) which perform at near random-chance.',
    keyEquation: '\\text{ROC-AUC} = 77.0\\% \\quad (p < 0.001)',
    slideReference: 'Slide 6: Quantitative Benchmarks'
  },
  {
    id: 'fc5',
    category: 'Reviewer Q&A',
    question: 'Peer Reviewer Q: How does T-SAR-JEPA prevent representation collapse without negative pairs?',
    answer: 'Stage 1 utilizes spatial LoMaR masking with multi-scale gradient feature targets and an EMA target encoder (momentum 0.996). Temporal predictor training uses mean-squared error on fixed-norm latent targets, avoiding collapse without expensive negative pairs.',
    keyEquation: '\\theta_{\\text{EMA}} \\leftarrow m \\theta_{\\text{EMA}} + (1-m) \\theta_{\\text{online}}',
    slideReference: 'Reviewer Defense Q&A'
  }
];

export const FlashcardDeck: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const card = FLASHCARDS[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % FLASHCARDS.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between font-mono text-xs text-slate-400">
        <span className="flex items-center space-x-1.5 text-cyan-400 font-bold">
          <Award className="w-4 h-4" />
          <span>Flashcard {currentIndex + 1} of {FLASHCARDS.length}</span>
        </span>
        <span className="px-2.5 py-0.5 rounded bg-indigo-950 border border-indigo-700 text-indigo-300 font-bold">
          {card.category}
        </span>
      </div>

      {/* Card Flips */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer min-h-[320px] bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-8 flex flex-col justify-between shadow-2xl transition-all relative overflow-hidden group"
      >
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-3">
          <span>{card.slideReference}</span>
          <span className="flex items-center space-x-1 text-indigo-400 group-hover:text-indigo-300">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Click to Flip Card</span>
          </span>
        </div>

        <div className="py-6 my-auto">
          {!isFlipped ? (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase text-slate-400 font-mono tracking-wider">
                Question / Prompt
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-mono leading-relaxed">
                {card.question}
              </h3>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase text-emerald-400 font-mono tracking-wider">
                Answer / Defense Response
              </div>
              <p className="text-sm font-mono text-slate-200 leading-relaxed">
                {card.answer}
              </p>
              {card.keyEquation && (
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300">
                  Key Equation: {card.keyEquation}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-3 border-t border-slate-800">
          <span>Mode: Rehearsal Flashcard</span>
          <span>{isFlipped ? 'Side B (Answer)' : 'Side A (Question)'}</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between font-mono">
        <button
          onClick={handlePrev}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs flex items-center space-x-2 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Card</span>
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-indigo-500/25"
        >
          <span>Next Card</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
