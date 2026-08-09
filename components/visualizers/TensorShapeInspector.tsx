'use client';

import React, { useState } from 'react';
import { useExplainerStore } from '@/store/useExplainerStore';
import { ChevronRight, Box, Sliders } from 'lucide-react';

interface TensorStep {
  stage: string;
  expression: string;
  shape: string;
  description: string;
  pythonModule: string;
}

export const TensorShapeInspector: React.FC = () => {
  const { contextWindowK, updateParameters } = useExplainerStore();
  const [batchSize, setBatchSize] = useState<number>(32);

  const steps: TensorStep[] = [
    {
      stage: '1. Raw SAR Patch Stack',
      expression: 'x_raw',
      shape: `[${batchSize}, 1, 224, 224]`,
      description: 'Single-channel SAR backscatter amplitude image patch',
      pythonModule: 'data/patch_extractor.py',
    },
    {
      stage: '2. ViT 16x16 Patch Projection',
      expression: 'patch_embed(x_raw)',
      shape: `[${batchSize}, 196, 768]`,
      description: '14x14 = 196 spatial tokens of dimension 768',
      pythonModule: 'models/encoder.py',
    },
    {
      stage: '3. CLS Token Prepending',
      expression: 'torch.cat([cls_token, x], dim=1)',
      shape: `[${batchSize}, 197, 768]`,
      description: '196 spatial tokens + 1 learnable CLS token',
      pythonModule: 'models/encoder.py',
    },
    {
      stage: '4. Spatial Mean Pooling',
      expression: 'x[:, 1:, :].mean(dim=1)',
      shape: `[${batchSize}, 768]`,
      description: 'Mean-pools 196 spatial tokens into a single vector z',
      pythonModule: 'models/encoder.py',
    },
    {
      stage: '5. Temporal Context Window',
      expression: 'stack_context(z, K)',
      shape: `[${batchSize}, ${contextWindowK}, 768]`,
      description: `Sequence of K=${contextWindowK} consecutive temporal embeddings`,
      pythonModule: 'data/temporal_dataset.py',
    },
    {
      stage: '6. Sinusoidal Time PE Addition',
      expression: 'context + time_enc(t)',
      shape: `[${batchSize}, ${contextWindowK}, 768]`,
      description: 'Adds continuous relative timestamp embeddings',
      pythonModule: 'models/time_encodings.py',
    },
    {
      stage: '7. Predictor Forecast',
      expression: 'predictor(context, time_enc)',
      shape: `[${batchSize}, 768]`,
      description: 'Forecasted target latent vector z_hat at step t+1',
      pythonModule: 'models/temporal_predictor.py',
    },
    {
      stage: '8. L2 Latent Anomaly Score',
      expression: 'torch.norm(z_hat - z_target, p=2, dim=-1)',
      shape: `[${batchSize}]`,
      description: 'Scalar L2 prediction error distance per sample',
      pythonModule: 'inference/anomaly_scorer.py',
    },
  ];

  return (
    <div className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between overflow-y-auto">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <Box className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              PyTorch 5D Tensor Shape Transformation Inspector
            </h3>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-mono">Batch Size B:</span>
              <select 
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs rounded px-1 py-0.5"
              >
                <option value={1}>1</option>
                <option value={16}>16</option>
                <option value={32}>32</option>
                <option value={64}>64</option>
                <option value={128}>128</option>
              </select>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-slate-400 font-mono">Window K:</span>
              <select 
                value={contextWindowK}
                onChange={(e) => updateParameters({ contextWindowK: Number(e.target.value) })}
                className="bg-slate-900 border border-slate-700 text-indigo-300 font-mono text-xs rounded px-1 py-0.5"
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={7}>7</option>
                <option value={9}>9</option>
              </select>
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{step.stage}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 pl-5">
                  {step.expression}
                </div>
                <div className="text-[10px] text-slate-500 pl-5">
                  {step.description}
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end md:self-auto">
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  {step.pythonModule}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800 shadow-sm">
                  {step.shape}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 font-mono flex items-center justify-between">
        <span>Total Trainable Param Dimensions: 86M (ViT Encoder) + 14M (Predictor)</span>
        <span className="text-emerald-400">Memory: ~1.2 GB VRAM</span>
      </div>
    </div>
  );
};
