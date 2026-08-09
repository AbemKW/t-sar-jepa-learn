'use client';

import React from 'react';
import { Presentation, CheckCircle2, Clock } from 'lucide-react';

interface SlideAssertion {
  slideNum: number;
  assertionHeadline: string;
  talkingPoints: string[];
  timing: string;
}

const SLIDE_DECK: SlideAssertion[] = [
  {
    slideNum: 1,
    assertionHeadline: 'T-SAR-JEPA: Self-Supervised Temporal Anomaly Detection in SAR Amplitude Stacks via Latent Prediction',
    talkingPoints: [
      'Introduce the IEEE GRSS Data Fusion Contest 2026 challenge.',
      'Explain single-channel SAR amplitude operational focus.',
      'Highlight 3-stage modular pipeline.'
    ],
    timing: '00:00 - 01:15'
  },
  {
    slideNum: 2,
    assertionHeadline: 'Pixel-Level SAR Reconstruction Fails to Capture Temporal Anomalies Due to Speckle & Phase Noise',
    talkingPoints: [
      'Contrast raw pixel space vs latent representation space.',
      'Demonstrate how high-frequency noise causes high false-positive rates in pixel reconstruction.',
      'Introduce JEPA joint embedding paradigm.'
    ],
    timing: '01:15 - 02:30'
  },
  {
    slideNum: 3,
    assertionHeadline: 'T-SAR-JEPA Predicts Future Latent States Using Only Single-Channel SAR Amplitude',
    talkingPoints: [
      'Clarify that InSAR coherence is used strictly for evaluation ground-truth.',
      'Walk through single-channel patch input tensor shapes.',
      'Define target latent prediction vector z_hat.'
    ],
    timing: '02:30 - 03:45'
  },
  {
    slideNum: 4,
    assertionHeadline: 'A 3-Stage Progressive Pipeline Adapts Spatial Encoders and Trains Causal Temporal Transformers',
    talkingPoints: [
      'Stage 1: Domain Adaptation (LoMaR spatial masking).',
      'Stage 2: Temporal Predictor (4-layer causal transformer).',
      'Stage 3: End-to-End Progressive Unfreezing.'
    ],
    timing: '03:45 - 05:00'
  },
  {
    slideNum: 5,
    assertionHeadline: 'Causal Masking & Sinusoidal Time Encodings Enable Accurate t+1 Latent Forecasting',
    talkingPoints: [
      'Explain irregular revisit intervals (1 to 14 days).',
      'Demonstrate continuous sinusoidal time encodings gamma(delta t).',
      'Show per-head attention weight matrices.'
    ],
    timing: '05:00 - 06:15'
  },
  {
    slideNum: 6,
    assertionHeadline: 'T-SAR-JEPA Outperforms Unsupervised Baselines by +23.9% ROC-AUC on Capella SAR Data',
    talkingPoints: [
      'Present main quantitative benchmark table.',
      'Highlight 77.0% ROC-AUC vs PaDiM 52.1% & RX 49.8%.',
      'Show ROC curves across AOIs.'
    ],
    timing: '06:15 - 07:30'
  },
  {
    slideNum: 7,
    assertionHeadline: 'Context Window K=7 with Sinusoidal Time Encoding Achieves Optimal Latent Predictability',
    talkingPoints: [
      'Ablation analysis across window sizes K in {3, 5, 7, 9}.',
      'Time encoding ablation comparison (Sinusoidal vs CTLPE vs Linear).',
      'Justify K=7 design choice.'
    ],
    timing: '07:30 - 08:45'
  },
  {
    slideNum: 8,
    assertionHeadline: 'Spatial Coherence Validation Confirms Non-Random Anomaly Localization (p < 0.001)',
    talkingPoints: [
      'Explain 1000-shuffle spatial permutation test.',
      'Present true spatial score 99.9% vs null distribution.',
      'Show geometry independence correlation |rho| < 0.11.'
    ],
    timing: '08:45 - 10:00'
  },
  {
    slideNum: 9,
    assertionHeadline: 'Latent Prediction Errors Faithfully Localize Surface Changes Across Hawaii, LA, & Pilbara AOIs',
    talkingPoints: [
      'Qualitative spatial map visual comparison grid.',
      'Show SAR amplitude input -> T-SAR-JEPA error map -> InSAR coherence GT.',
      'Highlight cross-region generalization.'
    ],
    timing: '10:00 - 11:15'
  },
  {
    slideNum: 10,
    assertionHeadline: 'Self-Supervised JEPA Latent Forecasting Unlocks Robust Anomaly Detection Without InSAR Phase',
    talkingPoints: [
      'Recap 3 main contributions.',
      'Open-source repository & citation info.',
      'Transition to 3-minute Q&A defense.'
    ],
    timing: '11:15 - 12:00'
  }
];

export const TalkingPoints: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono">
        <div className="flex items-center space-x-2">
          <Presentation className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            10-Slide Assertion-Evidence Presentation Deck Outline
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">12 Min Presentation Timing</span>
      </div>

      <div className="space-y-3">
        {SLIDE_DECK.map((slide) => (
          <div 
            key={slide.slideNum}
            className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-2"
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-700 text-indigo-300 font-bold">
                Slide {slide.slideNum}
              </span>
              <span className="text-slate-400 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{slide.timing}</span>
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-100 font-mono leading-snug">
              {slide.assertionHeadline}
            </h4>

            <div className="space-y-1 pl-2 border-l-2 border-slate-800 pt-1">
              {slide.talkingPoints.map((pt, i) => (
                <div key={i} className="text-xs font-mono text-slate-400 flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
