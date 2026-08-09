'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sliders, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const LatentSpaceCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [varWeight, setVarWeight] = useState<number>(1.0);
  const [covWeight, setCovWeight] = useState<number>(1.0);
  const [collapseState, setCollapseState] = useState<'healthy' | 'collapsed'>('healthy');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Generate points based on varWeight and covWeight
      const isCollapsed = varWeight < 0.2;
      if (isCollapsed && collapseState !== 'collapsed') {
        setCollapseState('collapsed');
      } else if (!isCollapsed && collapseState !== 'healthy') {
        setCollapseState('healthy');
      }

      const numPoints = 40;
      const spread = isCollapsed ? 4 : 80 * Math.max(0.2, varWeight);
      const skew = covWeight < 0.2 ? 0.8 : 0.0;

      ctx.fillStyle = isCollapsed ? '#ef4444' : '#38bdf8';
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2 + t * 0.2;
        let px = centerX + Math.cos(angle) * spread;
        let py = centerY + Math.sin(angle * (1 - skew)) * spread;

        ctx.beginPath();
        ctx.arc(px, py, isCollapsed ? 4 : 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Target vs Predicted Vectors
      const targetX = centerX + 90;
      const targetY = centerY - 50;
      const predX = centerX + 90 + Math.sin(t) * (isCollapsed ? 2 : 15);
      const predY = centerY - 50 + Math.cos(t) * (isCollapsed ? 2 : 15);

      // Draw Target z (Green)
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(targetX, targetY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6ee7b7';
      ctx.font = '11px monospace';
      ctx.fillText('z_target (Actual)', targetX + 10, targetY + 4);

      // Draw Predicted z_hat (Amber)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(predX, predY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde68a';
      ctx.fillText('ẑ_pred (Forecast)', predX + 10, predY - 8);

      // Draw L2 Distance Error line
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(targetX, targetY);
      ctx.lineTo(predX, predY);
      ctx.stroke();
      ctx.setLineDash([]);

      const l2Dist = Math.hypot(predX - targetX, predY - targetY).toFixed(2);
      ctx.fillStyle = '#f87171';
      ctx.font = '10px monospace';
      ctx.fillText(`L₂ Error = ${l2Dist}`, (targetX + predX) / 2 - 25, (targetY + predY) / 2 - 8);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [varWeight, covWeight, collapseState]);

  return (
    <div className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <span>2D/3D Latent Vector Space & Representation Collapse Sandbox</span>
          </h3>
          <div className="flex items-center space-x-2">
            {collapseState === 'collapsed' ? (
              <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300 text-xs font-mono flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>REPRESENTATION COLLAPSE!</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-mono flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Healthy Vector Variance</span>
              </span>
            )}
          </div>
        </div>

        {/* Canvas Viewport */}
        <div className="relative w-full h-[260px] bg-slate-900/90 rounded-lg border border-slate-800 overflow-hidden">
          <canvas 
            ref={canvasRef} 
            width={550} 
            height={260} 
            className="w-full h-full block" 
          />
        </div>

        {/* Sliders Controls */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Variance Weight (std_coeff):</span>
              <span className="font-mono text-cyan-300 font-bold">{varWeight.toFixed(1)}</span>
            </div>
            <input 
              type="range"
              min="0.0"
              max="2.5"
              step="0.1"
              value={varWeight}
              onChange={(e) => setVarWeight(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">
              Set to 0.0 to observe representation collapse (all vectors shrink to a single point).
            </p>
          </div>

          <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Covariance Weight (cov_coeff):</span>
              <span className="font-mono text-amber-300 font-bold">{covWeight.toFixed(1)}</span>
            </div>
            <input 
              type="range"
              min="0.0"
              max="2.5"
              step="0.1"
              value={covWeight}
              onChange={(e) => setCovWeight(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">
              Controls dimension decorrelation to prevent redundant features.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <span>VicReg Objective: L = λ·MSE(ẑ, z) + μ·Var(z) + ν·Cov(z)</span>
        <button 
          onClick={() => { setVarWeight(1.0); setCovWeight(1.0); }}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Sliders</span>
        </button>
      </div>
    </div>
  );
};
