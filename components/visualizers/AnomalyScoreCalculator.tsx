'use client';

import React from 'react';
import { useExplainerStore } from '@/store/useExplainerStore';
import { Sliders, Award, BarChart2, CheckCircle2 } from 'lucide-react';

export const AnomalyScoreCalculator: React.FC = () => {
  const { anomalyThreshold, updateParameters } = useExplainerStore();

  return (
    <div className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Evaluation Metrics & Anomaly Threshold Sandbox
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-mono">
            IEEE DFC 2026 Winner
          </span>
        </div>

        {/* Anomaly Threshold Slider */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-200 font-semibold flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-rose-400" />
              <span>Anomaly Detection Threshold:</span>
            </span>
            <span className="font-mono text-rose-300 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
              L₂ Error Threshold = {anomalyThreshold.toFixed(2)}
            </span>
          </div>
          <input 
            type="range"
            min="0.05"
            max="0.40"
            step="0.01"
            value={anomalyThreshold}
            onChange={(e) => updateParameters({ anomalyThreshold: parseFloat(e.target.value) })}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>High Sensitivity (0.05)</span>
            <span>Optimal Precision (0.15)</span>
            <span>Strict High Confidence (0.40)</span>
          </div>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* ROC-AUC */}
          <div className="p-3 bg-indigo-950/40 border border-indigo-800/80 rounded-lg">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
              ROC-AUC Score
            </div>
            <div className="text-2xl font-extrabold text-indigo-200 font-mono">
              77.0%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              vs Unsupervised Baselines ~50.0% (Random Chance)
            </div>
          </div>

          {/* Permutation Test */}
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-lg">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Permutation Test
            </div>
            <div className="text-2xl font-extrabold text-emerald-200 font-mono">
              99.9%
            </div>
            <div className="text-[10px] text-emerald-400/90 mt-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>p &lt; 0.001 (1000 Shuffles)</span>
            </div>
          </div>

          {/* Geometry Independence */}
          <div className="p-3 bg-cyan-950/40 border border-cyan-800/80 rounded-lg">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
              Geometry Pearson |ρ|
            </div>
            <div className="text-2xl font-extrabold text-cyan-200 font-mono">
              &lt; 0.11
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Independent of Orbit Angle
            </div>
          </div>
        </div>

        {/* Benchmark Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>Method Benchmark Comparison (Capella SAR Dataset)</span>
            <span className="text-[10px] font-mono text-slate-400">IEEE GRSS DFC 2026</span>
          </div>
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-1.5 font-semibold">Method</th>
                <th className="py-1.5 font-semibold">Modality</th>
                <th className="py-1.5 font-semibold text-right">ROC-AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr className="bg-indigo-950/50 text-indigo-200 font-bold">
                <td className="py-2">T-SAR-JEPA (Ours)</td>
                <td className="py-2 text-slate-400">Single Amplitude</td>
                <td className="py-2 text-right text-emerald-400">77.0%</td>
              </tr>
              <tr>
                <td className="py-1.5">PaDiM Baseline</td>
                <td className="py-1.5 text-slate-500">Single Amplitude</td>
                <td className="py-1.5 text-right text-slate-400">52.1%</td>
              </tr>
              <tr>
                <td className="py-1.5">RX Detector</td>
                <td className="py-1.5 text-slate-500">Single Amplitude</td>
                <td className="py-1.5 text-right text-slate-400">49.8%</td>
              </tr>
              <tr>
                <td className="py-1.5">Linear Autoregressive</td>
                <td className="py-1.5 text-slate-500">Single Amplitude</td>
                <td className="py-1.5 text-right text-slate-400">51.4%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <span className="flex items-center space-x-1">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Paper Citation: Woldesenbet & Woldesenbet (IGARSS 2026)</span>
        </span>
        <span className="text-indigo-400">Apache 2.0 Open Source</span>
      </div>
    </div>
  );
};
