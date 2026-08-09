'use client';

import React from 'react';
import { useExplainerStore } from '@/store/useExplainerStore';
import { SNIPPET_REGISTRY } from './SnippetRegistry';
import { FileCode, Copy, Check, ExternalLink, HelpCircle } from 'lucide-react';

export const CodeReader: React.FC = () => {
  const { activeCodeSnippetId, highlightedLines } = useExplainerStore();
  const [copied, setCopied] = React.useState(false);

  const snippet = SNIPPET_REGISTRY[activeCodeSnippetId] || SNIPPET_REGISTRY['encoder_py'];

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines = snippet.code.split('\n');

  return (
    <div className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Code Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileCode className="w-5 h-5 text-indigo-400" />
          <div>
            <h4 className="text-xs font-bold text-slate-200 font-mono">
              {snippet.title}
            </h4>
            <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
              <span>file://{snippet.filePath}</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCopy}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1 font-mono transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[10px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[10px]">Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Viewport */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed bg-slate-950 text-slate-300">
        <div className="space-y-0.5">
          {codeLines.map((lineText, idx) => {
            const lineNum = idx + 1;
            const isHighlighted = highlightedLines.includes(lineNum);
            const annotation = snippet.annotations.find(a => a.line === lineNum);

            return (
              <div 
                key={lineNum} 
                className={`group flex items-center justify-between px-2 py-0.5 rounded transition-all ${
                  isHighlighted 
                    ? 'bg-indigo-950/80 border-l-4 border-indigo-400 text-indigo-100 font-semibold shadow-inner' 
                    : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className={`w-8 text-right select-none text-[10px] ${
                    isHighlighted ? 'text-indigo-300 font-bold' : 'text-slate-600'
                  }`}>
                    {lineNum}
                  </span>
                  <span className="whitespace-pre">{lineText}</span>
                </div>

                {annotation && (
                  <div className="relative group/tooltip flex items-center space-x-1 bg-indigo-950/90 border border-indigo-700 text-indigo-300 text-[10px] px-2 py-0.5 rounded shadow">
                    <HelpCircle className="w-3 h-3 text-cyan-400" />
                    <span>{annotation.label}</span>

                    {/* Tooltip popover */}
                    <div className="absolute right-0 bottom-6 hidden group-hover/tooltip:block w-64 p-2.5 bg-slate-900 border border-slate-700 text-slate-200 text-[11px] rounded-lg shadow-2xl z-50">
                      <div className="font-bold text-cyan-300 mb-1">{annotation.label}</div>
                      <div>{annotation.explanation}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
        <span>Language: {snippet.language.toUpperCase()} | PyTorch 2.0+</span>
        <span className="text-slate-400">{snippet.description}</span>
      </div>
    </div>
  );
};
