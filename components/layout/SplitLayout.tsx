'use client';

import React from 'react';
import { useExplainerStore } from '@/store/useExplainerStore';
import { ArchitectureDiagram } from '@/components/visualizers/ArchitectureDiagram';
import { TensorShapeInspector } from '@/components/visualizers/TensorShapeInspector';
import { LatentSpaceCanvas } from '@/components/visualizers/LatentSpaceCanvas';
import { AnomalyScoreCalculator } from '@/components/visualizers/AnomalyScoreCalculator';
import { CodeReader } from '@/components/code/CodeReader';
import { Layout, Box, Activity, BarChart2, Code2 } from 'lucide-react';

interface SplitLayoutProps {
  children: React.ReactNode;
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({ children }) => {
  const { workspaceTab, setWorkspaceTab } = useExplainerStore();

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col lg:flex-row">
      {/* Left Narrative Scrollytelling Stream (42% Width) */}
      <div className="w-full lg:w-[44%] p-6 lg:p-8 overflow-y-auto border-r border-slate-800/80">
        {children}
      </div>

      {/* Right Sticky Interactive Workspace (56% Width) */}
      <div className="w-full lg:w-[56%] p-6 lg:p-8 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] flex flex-col space-y-4">
        {/* Workspace Tab Switcher */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 flex items-center justify-between shadow-lg">
          <div className="flex space-x-1">
            <button
              onClick={() => setWorkspaceTab('diagram')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
                workspaceTab === 'diagram'
                  ? 'bg-indigo-950 border border-indigo-700 text-indigo-200 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layout className="w-3.5 h-3.5 text-indigo-400" />
              <span>Architecture DAG</span>
            </button>

            <button
              onClick={() => setWorkspaceTab('tensor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
                workspaceTab === 'tensor'
                  ? 'bg-cyan-950 border border-cyan-700 text-cyan-200 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tensor Inspector</span>
            </button>

            <button
              onClick={() => setWorkspaceTab('latent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
                workspaceTab === 'latent'
                  ? 'bg-amber-950 border border-amber-700 text-amber-200 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>Latent Sandbox</span>
            </button>

            <button
              onClick={() => setWorkspaceTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 transition-all ${
                workspaceTab === 'code'
                  ? 'bg-emerald-950 border border-emerald-700 text-emerald-200 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>PyTorch Code</span>
            </button>
          </div>

          <div className="text-[10px] font-mono text-slate-500 pr-2 hidden sm:block">
            Auto-Sync Active
          </div>
        </div>

        {/* Viewport Card Container */}
        <div className="flex-1 w-full min-h-[440px]">
          {workspaceTab === 'diagram' && <ArchitectureDiagram />}
          {workspaceTab === 'tensor' && <TensorShapeInspector />}
          {workspaceTab === 'latent' && <LatentSpaceCanvas />}
          {workspaceTab === 'code' && <CodeReader />}
        </div>
      </div>
    </div>
  );
};
