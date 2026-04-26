import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export function Math({ children, block = false }) {
  try {
    if (block) return <BlockMath math={children} />;
    return <InlineMath math={children} />;
  } catch {
    return <span className="text-red-400 text-xs">Math render error</span>;
  }
}

export function MatrixDisplay({ matrix, scale = 1 }) {
  return (
    <div className="matrix-wrap" style={{ fontSize: `${scale}em` }}>
      <div className="matrix-bracket-left text-cyan-400" style={{ fontSize: `${1.5 + matrix.length * 0.2}em` }}>⌈<br />
        {matrix.slice(1, -1).map((_, i) => <span key={i}>|<br /></span>)}
        ⌊
      </div>
      <div className="matrix-cells px-2">
        {matrix.map((row, i) => (
          <div key={i} className="matrix-row">
            {row.map((cell, j) => (
              <div key={j} className="matrix-cell text-slate-200 text-sm min-w-[36px] text-center py-1">
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="matrix-bracket-right text-cyan-400" style={{ fontSize: `${1.5 + matrix.length * 0.2}em` }}>⌉<br />
        {matrix.slice(1, -1).map((_, i) => <span key={i}>|<br /></span>)}
        ⌋
      </div>
    </div>
  );
}

export function StepDisplay({ steps }) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xs text-cyan-400 flex-shrink-0 mt-1">
            {i + 1}
          </div>
          <div className="flex-1">
            {step.label && <div className="text-xs text-slate-400 mb-1">{step.label}</div>}
            <div className="bg-slate-900/50 rounded p-3 border border-slate-700/50">
              {step.latex ? <Math block>{step.latex}</Math> : <span className="text-slate-200 text-sm">{step.text}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
