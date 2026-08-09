'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useExplainerStore } from '@/store/useExplainerStore';
import { Cpu, Layers, Clock, ShieldCheck, Activity, Eye, Zap } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const { 
    activeDiagramNode, 
    setActiveDiagramNode, 
    contextWindowK, 
    deltaT, 
    maskRatio, 
    unfreezingPhase,
    setWorkspaceTab 
  } = useExplainerStore();

  const handleNodeClick = (nodeId: string, snippetId: string, lines: number[]) => {
    setActiveDiagramNode(nodeId);
    useExplainerStore.getState().setHighlightedLines(lines);
    useExplainerStore.setState({ activeCodeSnippetId: snippetId });
  };

  const isSelected = (id: string) => activeDiagramNode === id;

  return (
    <div className="relative w-full h-full bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            T-SAR-JEPA Dynamic Model DAG Visualizer
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-700 text-indigo-300 font-mono">
            K = {contextWindowK}
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700 text-cyan-300 font-mono">
            Δt = {deltaT}d
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-700 text-amber-300 font-mono">
            Mask = {Math.round(maskRatio * 100)}%
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-mono">
            {unfreezingPhase.toUpperCase()}
          </span>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative flex-1 flex items-center justify-center min-h-[360px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400">
          <defs>
            <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="anomaly-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Connection Paths */}
          {/* Path 1: Patch -> Encoder */}
          <path d="M 120 200 L 220 200" stroke="url(#gradient-line)" strokeWidth="3" strokeDasharray="6 4" className="animate-dash" />
          
          {/* Path 2: Encoder -> Time Add */}
          <path d="M 330 200 L 410 200" stroke="url(#gradient-line)" strokeWidth="3" />
          
          {/* Path 3: Time Encoding -> Add */}
          <path d="M 430 110 L 430 170" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="4 4" />
          
          {/* Path 4: Time Add -> Predictor */}
          <path d="M 450 200 L 520 200" stroke="url(#gradient-line)" strokeWidth="3" />

          {/* Path 5: Predictor -> L2 Loss */}
          <path d="M 640 200 L 700 200" stroke="url(#anomaly-gradient)" strokeWidth="3.5" filter="url(#glow)" />

          {/* Path 6: InSAR Coherence reference (dashed branch) */}
          <path d="M 700 320 L 700 240" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        {/* Nodes Grid */}
        <div className="relative z-10 w-full max-w-4xl grid grid-cols-5 gap-4 items-center px-4">
          
          {/* Node 1: Raw Patch Input */}
          <motion.div 
            whileHover={{ scale: 1.04 }}
            onClick={() => handleNodeClick('patch_extractor', 'patch_extractor_py', [17, 24, 28])}
            className={`cursor-pointer p-3 rounded-lg border transition-all ${
              isSelected('patch_extractor') 
                ? 'bg-indigo-950/90 border-indigo-400 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500' 
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center space-x-2 text-indigo-400 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Patch Input</span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 font-semibold">SAR Amplitude</div>
            <div className="text-[10px] font-mono text-slate-400 mt-1 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
              (1, 224, 224)
            </div>
          </motion.div>

          {/* Node 2: SARJEPAEncoder */}
          <motion.div 
            whileHover={{ scale: 1.04 }}
            onClick={() => handleNodeClick('encoder', 'encoder_py', [36, 39, 46, 50])}
            className={`cursor-pointer p-3 rounded-lg border transition-all ${
              isSelected('encoder') 
                ? 'bg-indigo-950/90 border-indigo-400 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500' 
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center space-x-2 text-indigo-400 mb-1">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Spatial Encoder</span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 font-semibold">ViT-Base / 16</div>
            <div className="text-[10px] font-mono text-cyan-400 mt-1 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
              z ∈ ℝ⁷⁶⁸
            </div>
          </motion.div>

          {/* Node 3: Time Encoding (Top) & Addition */}
          <div className="flex flex-col space-y-4 items-center">
            <motion.div 
              whileHover={{ scale: 1.04 }}
              onClick={() => handleNodeClick('time_enc', 'time_encodings_py', [12, 18, 20])}
              className={`cursor-pointer p-2 rounded-lg border w-full text-center transition-all ${
                isSelected('time_enc') 
                  ? 'bg-cyan-950/90 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-500' 
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-1 text-cyan-400 mb-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase">Time PE γ(Δt)</span>
              </div>
              <div className="text-[10px] font-mono text-slate-300">Sinusoidal PE</div>
            </motion.div>

            <div className="w-8 h-8 rounded-full bg-slate-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 text-xs font-bold font-mono">
              +
            </div>
          </div>

          {/* Node 4: 4-Layer Causal Predictor */}
          <motion.div 
            whileHover={{ scale: 1.04 }}
            onClick={() => handleNodeClick('predictor', 'temporal_predictor_py', [18, 31, 36, 43])}
            className={`cursor-pointer p-3 rounded-lg border transition-all ${
              isSelected('predictor') 
                ? 'bg-amber-950/90 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-500' 
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center space-x-2 text-amber-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Predictor</span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 font-semibold">4-Layer Causal</div>
            <div className="text-[10px] font-mono text-amber-400 mt-1 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
              ẑ_t+1 ∈ ℝ⁷⁶⁸
            </div>
          </motion.div>

          {/* Node 5: L2 Loss & Independent InSAR Ground Truth */}
          <div className="flex flex-col space-y-3">
            <motion.div 
              whileHover={{ scale: 1.04 }}
              onClick={() => handleNodeClick('l2_loss', 'anomaly_scorer_py', [8, 25])}
              className={`cursor-pointer p-3 rounded-lg border transition-all ${
                isSelected('l2_loss') 
                  ? 'bg-rose-950/90 border-rose-400 shadow-lg shadow-rose-500/20 ring-2 ring-rose-500' 
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center space-x-2 text-rose-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">L₂ Latent Loss</span>
              </div>
              <div className="text-[11px] font-mono text-slate-300 font-semibold">Anomaly Score</div>
              <div className="text-[10px] font-mono text-rose-400 mt-1 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                ||ẑ - z||₂
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.04 }}
              onClick={() => handleNodeClick('coherence', 'coherence_py', [9, 12, 18, 25])}
              className={`cursor-pointer p-2 rounded-lg border text-center transition-all ${
                isSelected('coherence') 
                  ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-500' 
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-1 text-emerald-400 mb-0.5">
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase">InSAR Ref γ</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">Offline Ground Truth</div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Footer Info Pill */}
      <div className="mt-2 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-slate-300 font-mono">
            {activeDiagramNode ? `Active Node: ${activeDiagramNode.toUpperCase()}` : 'Click any node to inspect code line annotations'}
          </span>
        </div>
        <button 
          onClick={() => setWorkspaceTab('code')}
          className="text-xs font-mono text-indigo-400 hover:text-indigo-300 underline"
        >
          View Full PyTorch Code →
        </button>
      </div>
    </div>
  );
};
