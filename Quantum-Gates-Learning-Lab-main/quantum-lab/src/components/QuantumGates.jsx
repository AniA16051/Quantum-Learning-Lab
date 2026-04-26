import React, { useState, useRef, useCallback } from 'react';
import { Math as Mth, StepDisplay } from './MathBlock';
import { GATES, MULTI_GATES } from '../utils/quantum';

// ─── Circuit SVG helpers ────────────────────────────────────────────────────

function CircuitDiagram({ gateSymbol, color = '#22d3ee' }) {
  return (
    <svg width="200" height="60" viewBox="0 0 200 60">
      <line x1="0" y1="30" x2="200" y2="30" stroke="#334155" strokeWidth="1.5" />
      <rect x="70" y="15" width="60" height="30" rx="4" fill={`${color}22`} stroke={color} strokeWidth="1.5" />
      <text x="100" y="34" textAnchor="middle" fill={color} fontSize="16" fontFamily="JetBrains Mono">{gateSymbol}</text>
      <circle cx="20" cy="30" r="4" fill={color} opacity="0.5" />
      <circle cx="180" cy="30" r="4" fill={color} opacity="0.5" />
    </svg>
  );
}

function CNOTCircuit() {
  return (
    <svg width="200" height="90" viewBox="0 0 200 90">
      <line x1="0" y1="25" x2="200" y2="25" stroke="#334155" strokeWidth="1.5" />
      <line x1="0" y1="65" x2="200" y2="65" stroke="#334155" strokeWidth="1.5" />
      <circle cx="100" cy="25" r="6" fill="#22d3ee" />
      <line x1="100" y1="25" x2="100" y2="65" stroke="#22d3ee" strokeWidth="1.5" />
      <circle cx="100" cy="65" r="10" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
      <line x1="100" y1="55" x2="100" y2="75" stroke="#22d3ee" strokeWidth="1.5" />
      <line x1="90" y1="65" x2="110" y2="65" stroke="#22d3ee" strokeWidth="1.5" />
      <text x="10" y="20" fill="#64748b" fontSize="11">Control</text>
      <text x="10" y="60" fill="#64748b" fontSize="11">Target</text>
    </svg>
  );
}

function SWAPCircuit() {
  return (
    <svg width="200" height="90" viewBox="0 0 200 90">
      <line x1="0" y1="25" x2="200" y2="25" stroke="#334155" strokeWidth="1.5" />
      <line x1="0" y1="65" x2="200" y2="65" stroke="#334155" strokeWidth="1.5" />
      <line x1="100" y1="25" x2="100" y2="65" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="94" y="29" fill="#f59e0b" fontSize="16">×</text>
      <text x="94" y="69" fill="#f59e0b" fontSize="16">×</text>
    </svg>
  );
}

function ToffoliCircuit() {
  return (
    <svg width="200" height="110" viewBox="0 0 200 110">
      {[20, 55, 90].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="200" y2={y} stroke="#334155" strokeWidth="1.5" />
      ))}
      <circle cx="100" cy="20" r="5" fill="#c084fc" />
      <circle cx="100" cy="55" r="5" fill="#c084fc" />
      <line x1="100" y1="20" x2="100" y2="90" stroke="#c084fc" strokeWidth="1.5" />
      <circle cx="100" cy="90" r="10" fill="none" stroke="#c084fc" strokeWidth="1.5" />
      <line x1="100" y1="80" x2="100" y2="100" stroke="#c084fc" strokeWidth="1.5" />
      <line x1="90" y1="90" x2="110" y2="90" stroke="#c084fc" strokeWidth="1.5" />
      <text x="10" y="15" fill="#64748b" fontSize="9">C₁</text>
      <text x="10" y="50" fill="#64748b" fontSize="9">C₂</text>
      <text x="10" y="85" fill="#64748b" fontSize="9">T</text>
    </svg>
  );
}

// ─── Truth table ─────────────────────────────────────────────────────────────

function TruthTable({ gate, isMulti = false }) {
  if (isMulti) {
    const g = MULTI_GATES[gate];
    return (
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            <th className="px-3 py-2 text-slate-400 text-left border-b border-slate-700">Input</th>
            <th className="px-3 py-2 text-slate-400 text-left border-b border-slate-700">Output</th>
          </tr>
        </thead>
        <tbody>
          {g.truthTable.map(([inp, out], i) => (
            <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
              <td className="px-3 py-2 text-cyan-300 font-mono">|{inp}⟩</td>
              <td className="px-3 py-2 text-purple-300 font-mono">|{out}⟩</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  const rows = [
    { input: '|0⟩', output: () => {
      const m = GATES[gate]?.matrix;
      if (!m) return '—';
      const a = m[0][0], b = m[0][1];
      if (a === 0 && b === 1) return '|1⟩';
      if (a === 1 && b === 0) return '|0⟩';
      if (a === b) return '(|0⟩+|1⟩)/√2';
      if (typeof a === 'string') return 'phase|0⟩';
      return `${a}|0⟩+${b}|1⟩`;
    }},
    { input: '|1⟩', output: () => {
      const m = GATES[gate]?.matrix;
      if (!m) return '—';
      const a = m[1][0], b = m[1][1];
      if (a === 1 && b === 0) return '|0⟩';
      if (a === 0 && b === 1) return '|1⟩';
      if (a === '-1' || b === -1) return '-|1⟩';
      if (a === b) return '(|0⟩-|1⟩)/√2';
      if (typeof a === 'string') return 'phase|1⟩';
      return `${a}|0⟩+${b}|1⟩`;
    }},
  ];
  return (
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr>
          <th className="px-3 py-2 text-slate-400 text-left border-b border-slate-700">Input</th>
          <th className="px-3 py-2 text-slate-400 text-left border-b border-slate-700">Output</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
            <td className="px-3 py-2 text-cyan-300 font-mono">{r.input}</td>
            <td className="px-3 py-2 text-purple-300 font-mono">{r.output()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Matrix block ─────────────────────────────────────────────────────────────

function MatrixBlock({ matrix, color = '#22d3ee' }) {
  return (
    <div className="flex items-center justify-center gap-1 py-2">
      <span style={{ color }} className="text-3xl leading-none select-none">⌈<br />{matrix.length > 2 ? <>|<br /></> : ''}{matrix.length > 4 ? <>|<br />|<br />|<br /></> : ''}⌊</span>
      <div className="space-y-2 px-2">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-4">
            {row.map((cell, j) => (
              <span key={j} className="text-slate-200 text-sm text-center" style={{ minWidth: '36px' }}>{cell}</span>
            ))}
          </div>
        ))}
      </div>
      <span style={{ color }} className="text-3xl leading-none select-none">⌉<br />{matrix.length > 2 ? <>|<br /></> : ''}{matrix.length > 4 ? <>|<br />|<br />|<br /></> : ''}⌋</span>
    </div>
  );
}

// ─── Gate simulator ───────────────────────────────────────────────────────────

function GateSimulator({ gateName }) {
  const [alpha, setAlpha] = useState('1');
  const [beta, setBeta] = useState('0');
  const g = GATES[gateName];
  if (!g) return null;
  const a = parseFloat(alpha) || 0;
  const b = parseFloat(beta) || 0;
  const m = g.matrix;
  const newA = (typeof m[0][0] === 'number' && typeof m[0][1] === 'number') ? m[0][0] * a + m[0][1] * b : null;
  const newB = (typeof m[1][0] === 'number' && typeof m[1][1] === 'number') ? m[1][0] * a + m[1][1] * b : null;
  const valid = newA !== null && newB !== null;
  return (
    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
      <div className="text-xs text-slate-400 mb-3">State Transformer</div>
      <div className="flex gap-3 mb-3">
        <div>
          <label className="text-xs text-slate-500 block mb-1">α</label>
          <input className="quantum-input" value={alpha} onChange={e => setAlpha(e.target.value)} style={{ width: '80px' }} />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">β</label>
          <input className="quantum-input" value={beta} onChange={e => setBeta(e.target.value)} style={{ width: '80px' }} />
        </div>
        <div className="flex items-end text-xs text-slate-400 mb-2">→ {gateName} →</div>
      </div>
      {valid ? (
        <div className="text-sm">
          <span className="text-slate-400">Result: </span>
          <span className="text-cyan-400">{newA.toFixed(3)}</span>
          <span className="text-slate-400">|0⟩ + </span>
          <span className="text-purple-400">{newB.toFixed(3)}</span>
          <span className="text-slate-400">|1⟩</span>
        </div>
      ) : (
        <div className="text-xs text-slate-500">Complex matrix — see full derivation below</div>
      )}
    </div>
  );
}

// ─── Outer product derivations ────────────────────────────────────────────────

const outerProductDerivations = {
  X: {
    title: 'X = |1⟩⟨0| + |0⟩⟨1|',
    explanation: 'X swaps |0⟩ and |1⟩. The outer product |1⟩⟨0| maps |0⟩→|1⟩, and |0⟩⟨1| maps |1⟩→|0⟩.',
    steps: [
      { label: 'Outer product |1⟩⟨0|', latex: '|1\\rangle\\langle 0| = \\begin{pmatrix}0\\\\1\\end{pmatrix}\\begin{pmatrix}1 & 0\\end{pmatrix} = \\begin{pmatrix}0&0\\\\1&0\\end{pmatrix}' },
      { label: 'Outer product |0⟩⟨1|', latex: '|0\\rangle\\langle 1| = \\begin{pmatrix}1\\\\0\\end{pmatrix}\\begin{pmatrix}0 & 1\\end{pmatrix} = \\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}' },
      { label: 'Sum gives X', latex: 'X = |1\\rangle\\langle 0| + |0\\rangle\\langle 1| = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}' },
      { label: 'Verify: X|0⟩', latex: 'X|0\\rangle = (|1\\rangle\\langle 0|)|0\\rangle + (|0\\rangle\\langle 1|)|0\\rangle = |1\\rangle + 0 = |1\\rangle' },
    ],
  },
  Z: {
    title: 'Z = |0⟩⟨0| − |1⟩⟨1|',
    explanation: 'Z leaves |0⟩ unchanged and flips the sign of |1⟩. This is encoded using the projectors onto each basis state.',
    steps: [
      { label: 'Projector onto |0⟩', latex: '|0\\rangle\\langle 0| = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}' },
      { label: 'Projector onto |1⟩ with sign', latex: '-|1\\rangle\\langle 1| = -\\begin{pmatrix}0&0\\\\0&1\\end{pmatrix} = \\begin{pmatrix}0&0\\\\0&-1\\end{pmatrix}' },
      { label: 'Sum gives Z', latex: 'Z = |0\\rangle\\langle 0| - |1\\rangle\\langle 1| = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}' },
      { label: 'Verify: Z|1⟩', latex: 'Z|1\\rangle = (|0\\rangle\\langle 0|)|1\\rangle - (|1\\rangle\\langle 1|)|1\\rangle = 0 - |1\\rangle = -|1\\rangle' },
    ],
  },
  Y: {
    title: 'Y = −i|1⟩⟨0| + i|0⟩⟨1|',
    explanation: 'Y combines a bit-flip with a phase factor. Each transition picks up a complex coefficient from the imaginary unit i.',
    steps: [
      { label: 'Term for |0⟩→i|1⟩', latex: 'i|1\\rangle\\langle 0| = i\\begin{pmatrix}0&0\\\\1&0\\end{pmatrix} = \\begin{pmatrix}0&0\\\\i&0\\end{pmatrix}' },
      { label: 'Term for |1⟩→−i|0⟩', latex: '-i|0\\rangle\\langle 1| = -i\\begin{pmatrix}0&1\\\\0&0\\end{pmatrix} = \\begin{pmatrix}0&-i\\\\0&0\\end{pmatrix}' },
      { label: 'Sum gives Y', latex: 'Y = i|1\\rangle\\langle 0| - i|0\\rangle\\langle 1| = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}' },
      { label: 'Verify: Y|0⟩', latex: 'Y|0\\rangle = i|1\\rangle\\langle 0||0\\rangle = i|1\\rangle' },
    ],
  },
  H: {
    title: 'H = (|0⟩+|1⟩)⟨0| / √2 + (|0⟩−|1⟩)⟨1| / √2',
    explanation: 'H maps |0⟩ to |+⟩ and |1⟩ to |−⟩. We encode this as a sum of outer products with the two Hadamard basis states.',
    steps: [
      { label: 'H maps |0⟩ → |+⟩ = (|0⟩+|1⟩)/√2', latex: 'H = |+\\rangle\\langle 0| + |-\\rangle\\langle 1|' },
      { label: 'Expand |+⟩⟨0|', latex: '|+\\rangle\\langle 0| = \\frac{1}{\\sqrt{2}}\\begin{pmatrix}1\\\\1\\end{pmatrix}\\begin{pmatrix}1&0\\end{pmatrix} = \\frac{1}{\\sqrt{2}}\\begin{pmatrix}1&0\\\\1&0\\end{pmatrix}' },
      { label: 'Expand |−⟩⟨1|', latex: '|-\\rangle\\langle 1| = \\frac{1}{\\sqrt{2}}\\begin{pmatrix}1\\\\-1\\end{pmatrix}\\begin{pmatrix}0&1\\end{pmatrix} = \\frac{1}{\\sqrt{2}}\\begin{pmatrix}0&1\\\\0&-1\\end{pmatrix}' },
      { label: 'Sum gives H', latex: 'H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}' },
    ],
  },
  S: {
    title: 'S = |0⟩⟨0| + i|1⟩⟨1|',
    explanation: 'S leaves |0⟩ unchanged and adds a π/2 phase to |1⟩. This is a diagonal gate built from projectors with phase coefficients.',
    steps: [
      { label: 'Projector onto |0⟩ (no change)', latex: '|0\\rangle\\langle 0| = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}' },
      { label: 'Projector onto |1⟩ with phase i', latex: 'i|1\\rangle\\langle 1| = i\\begin{pmatrix}0&0\\\\0&1\\end{pmatrix} = \\begin{pmatrix}0&0\\\\0&i\\end{pmatrix}' },
      { label: 'Sum gives S', latex: 'S = |0\\rangle\\langle 0| + i|1\\rangle\\langle 1| = \\begin{pmatrix}1&0\\\\0&i\\end{pmatrix}' },
      { label: 'Note: S = T²', latex: 'S = e^{i\\pi/2}|1\\rangle\\langle 1| + |0\\rangle\\langle 0|,\\quad S = T^2' },
    ],
  },
  T: {
    title: 'T = |0⟩⟨0| + e^{iπ/4}|1⟩⟨1|',
    explanation: 'T is the π/8 phase gate. It is the square root of S, adding a phase of π/4 to the |1⟩ component only.',
    steps: [
      { label: 'Projector onto |0⟩ (no change)', latex: '|0\\rangle\\langle 0| = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}' },
      { label: 'Projector onto |1⟩ with phase e^{iπ/4}', latex: 'e^{i\\pi/4}|1\\rangle\\langle 1| = \\begin{pmatrix}0&0\\\\0&e^{i\\pi/4}\\end{pmatrix}' },
      { label: 'Sum gives T', latex: 'T = |0\\rangle\\langle 0| + e^{i\\pi/4}|1\\rangle\\langle 1| = \\begin{pmatrix}1&0\\\\0&e^{i\\pi/4}\\end{pmatrix}' },
      { label: 'T is √S: T² = S, T⁴ = Z, T⁸ = I', latex: 'T^2 = S,\\quad T^4 = Z,\\quad T^8 = I' },
    ],
  },
  I: {
    title: 'I = |0⟩⟨0| + |1⟩⟨1|',
    explanation: 'The identity is the completeness relation — projectors onto all basis states sum to the identity operator.',
    steps: [
      { label: 'Completeness relation', latex: 'I = \\sum_i |i\\rangle\\langle i| = |0\\rangle\\langle 0| + |1\\rangle\\langle 1|' },
      { label: 'Projector onto |0⟩', latex: '|0\\rangle\\langle 0| = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}' },
      { label: 'Projector onto |1⟩', latex: '|1\\rangle\\langle 1| = \\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}' },
      { label: 'Sum gives I', latex: 'I = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix} + \\begin{pmatrix}0&0\\\\0&1\\end{pmatrix} = \\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}' },
    ],
  },
};

const gateSteps = {
  X: [
    { label: 'Pauli-X matrix', latex: 'X = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}' },
    { label: 'Apply to |0⟩', latex: 'X|0\\rangle = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}\\begin{pmatrix}1\\\\0\\end{pmatrix} = \\begin{pmatrix}0\\\\1\\end{pmatrix} = |1\\rangle' },
    { label: 'Apply to |1⟩', latex: 'X|1\\rangle = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}\\begin{pmatrix}0\\\\1\\end{pmatrix} = \\begin{pmatrix}1\\\\0\\end{pmatrix} = |0\\rangle' },
  ],
  H: [
    { label: 'Hadamard matrix', latex: 'H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix}1 & 1 \\\\ 1 & -1\\end{pmatrix}' },
    { label: 'Apply to |0⟩ → superposition', latex: 'H|0\\rangle = \\frac{1}{\\sqrt{2}}\\begin{pmatrix}1\\\\1\\end{pmatrix} = |+\\rangle' },
    { label: 'Apply to |1⟩ → superposition', latex: 'H|1\\rangle = \\frac{1}{\\sqrt{2}}\\begin{pmatrix}1\\\\-1\\end{pmatrix} = |-\\rangle' },
    { label: 'H is its own inverse', latex: 'H^2 = I \\quad (H H = I)' },
  ],
  Z: [
    { label: 'Pauli-Z matrix', latex: 'Z = \\begin{pmatrix}1 & 0 \\\\ 0 & -1\\end{pmatrix}' },
    { label: 'Apply to |0⟩ (unchanged)', latex: 'Z|0\\rangle = \\begin{pmatrix}1\\\\0\\end{pmatrix} = |0\\rangle' },
    { label: 'Apply to |1⟩ (phase flip)', latex: 'Z|1\\rangle = \\begin{pmatrix}0\\\\-1\\end{pmatrix} = -|1\\rangle' },
  ],
  Y: [
    { label: 'Pauli-Y matrix', latex: 'Y = \\begin{pmatrix}0 & -i \\\\ i & 0\\end{pmatrix}' },
    { label: 'Apply to |0⟩', latex: 'Y|0\\rangle = i|1\\rangle' },
    { label: 'Apply to |1⟩', latex: 'Y|1\\rangle = -i|0\\rangle' },
  ],
  S: [
    { label: 'Phase gate matrix', latex: 'S = \\begin{pmatrix}1 & 0 \\\\ 0 & i\\end{pmatrix}' },
    { label: 'Effect on |0⟩', latex: 'S|0\\rangle = |0\\rangle' },
    { label: 'Effect on |1⟩ (adds π/2 phase)', latex: 'S|1\\rangle = i|1\\rangle = e^{i\\pi/2}|1\\rangle' },
    { label: 'S = T²', latex: 'S = T^2 = \\begin{pmatrix}1&0\\\\0&e^{i\\pi/2}\\end{pmatrix}' },
  ],
  T: [
    { label: 'T gate matrix', latex: 'T = \\begin{pmatrix}1 & 0 \\\\ 0 & e^{i\\pi/4}\\end{pmatrix}' },
    { label: 'Effect on |0⟩', latex: 'T|0\\rangle = |0\\rangle' },
    { label: 'Effect on |1⟩', latex: 'T|1\\rangle = e^{i\\pi/4}|1\\rangle' },
    { label: 'Useful for: T = √S', latex: 'T^2 = S, \\quad T^4 = Z, \\quad T^8 = I' },
  ],
  I: [
    { label: 'Identity matrix', latex: 'I = \\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix}' },
    { label: 'Effect on any state', latex: 'I|\\psi\\rangle = |\\psi\\rangle' },
  ],
};

// ─── Outer Product Panel ──────────────────────────────────────────────────────

function OuterProductPanel({ gateName }) {
  const data = outerProductDerivations[gateName];
  if (!data) return null;
  return (
    <div className="glass-card p-5">
      <div className="text-sm font-bold text-slate-300 mb-1">Outer Product Construction</div>
      <div className="text-xs text-slate-500 mb-1 font-mono">{data.title}</div>
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">{data.explanation}</p>
      <StepDisplay steps={data.steps} />
    </div>
  );
}

// ─── Circuit Builder ──────────────────────────────────────────────────────────

const BUILDER_GATES = [
  { id: 'H',    label: 'H',    color: '#c084fc', qubitWidth: 1 },
  { id: 'X',    label: 'X',    color: '#22d3ee', qubitWidth: 1 },
  { id: 'Y',    label: 'Y',    color: '#f59e0b', qubitWidth: 1 },
  { id: 'Z',    label: 'Z',    color: '#6366f1', qubitWidth: 1 },
  { id: 'S',    label: 'S',    color: '#10b981', qubitWidth: 1 },
  { id: 'T',    label: 'T',    color: '#f472b6', qubitWidth: 1 },
  { id: 'I',    label: 'I',    color: '#94a3b8', qubitWidth: 1 },
  { id: 'CNOT', label: 'CX',   color: '#22d3ee', qubitWidth: 2 },
  { id: 'SWAP', label: 'SWAP', color: '#f59e0b', qubitWidth: 2 },
  { id: 'CZ',   label: 'CZ',   color: '#6366f1', qubitWidth: 2 },
];

const NUM_QUBITS = 3;
const NUM_SLOTS  = 8;
const CELL_W     = 64;
const CELL_H     = 56;
const LABEL_W    = 48;
const PAD        = 16;

// Apply the circuit gate sequence to the state vector classically
function applyCircuitGate(stateVec, gateId, qubit, numQubits) {
  const dim = 1 << numQubits;
  const newState = [...stateVec];

  if (gateId === 'H') {
    const s = 1 / Math.sqrt(2);
    const newS = [...stateVec];
    for (let i = 0; i < dim; i++) {
      const bit = (i >> (numQubits - 1 - qubit)) & 1;
      const j = i ^ (1 << (numQubits - 1 - qubit)); // flipped
      if (bit === 0) {
        newS[i] = s * (stateVec[i] + stateVec[j]);
      } else {
        newS[i] = s * (stateVec[j] - stateVec[i]);
      }
    }
    return newS;
  }
  if (gateId === 'X') {
    for (let i = 0; i < dim; i++) {
      const bit = (i >> (numQubits - 1 - qubit)) & 1;
      if (bit === 0) {
        const j = i | (1 << (numQubits - 1 - qubit));
        newState[i] = stateVec[j];
        newState[j] = stateVec[i];
      }
    }
    return newState;
  }
  if (gateId === 'Z') {
    for (let i = 0; i < dim; i++) {
      const bit = (i >> (numQubits - 1 - qubit)) & 1;
      newState[i] = bit === 1 ? -stateVec[i] : stateVec[i];
    }
    return newState;
  }
  if (gateId === 'CNOT' && qubit + 1 < numQubits) {
    const ctrl = numQubits - 1 - qubit;
    const tgt  = numQubits - 1 - (qubit + 1);
    for (let i = 0; i < dim; i++) {
      if ((i >> ctrl) & 1) {
        const j = i ^ (1 << tgt);
        if (i < j) { newState[i] = stateVec[j]; newState[j] = stateVec[i]; }
      }
    }
    return newState;
  }
  if (gateId === 'SWAP' && qubit + 1 < numQubits) {
    const q1 = numQubits - 1 - qubit;
    const q2 = numQubits - 1 - (qubit + 1);
    for (let i = 0; i < dim; i++) {
      const b1 = (i >> q1) & 1;
      const b2 = (i >> q2) & 1;
      if (b1 !== b2) {
        const j = i ^ (1 << q1) ^ (1 << q2);
        if (i < j) { newState[i] = stateVec[j]; newState[j] = stateVec[i]; }
      }
    }
    return newState;
  }
  if (gateId === 'CZ' && qubit + 1 < numQubits) {
    const ctrl = numQubits - 1 - qubit;
    const tgt  = numQubits - 1 - (qubit + 1);
    for (let i = 0; i < dim; i++) {
      if (((i >> ctrl) & 1) && ((i >> tgt) & 1)) {
        newState[i] = -stateVec[i];
      }
    }
    return newState;
  }
  return newState;
}

function runCircuit(gates, numQubits) {
  const dim = 1 << numQubits;
  let state = Array(dim).fill(0);
  state[0] = 1; // |000...⟩
  for (let slot = 0; slot < NUM_SLOTS; slot++) {
    for (let q = 0; q < numQubits; q++) {
      const g = gates[q]?.[slot];
      if (g && g.primary) {
        state = applyCircuitGate(state, g.id, q, numQubits);
      }
    }
  }
  return state;
}

function StateVector({ state, numQubits }) {
  const labels = Array.from({ length: 1 << numQubits }, (_, i) =>
    '|' + i.toString(2).padStart(numQubits, '0') + '⟩'
  );
  const maxP = Math.max(...state.map(v => v * v));
  return (
    <div className="space-y-1.5">
      {state.map((amp, i) => {
        const prob = (amp * amp * 100).toFixed(1);
        const pct  = maxP > 0 ? (amp * amp) / maxP * 100 : 0;
        return (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="font-mono text-slate-400 w-10 flex-shrink-0">{labels[i]}</span>
            <div className="flex-1 bg-slate-800 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, background: amp >= 0 ? 'linear-gradient(90deg,#22d3ee,#6366f1)' : 'linear-gradient(90deg,#f59e0b,#ef4444)' }}
              />
            </div>
            <span className={`w-10 text-right flex-shrink-0 ${amp < 0 ? 'text-amber-400' : 'text-cyan-400'}`}>{prob}%</span>
          </div>
        );
      })}
    </div>
  );
}

function CircuitBuilder() {
  // gates[qubit][slot] = { id, primary, span } | null
  const emptyGrid = () =>
    Array.from({ length: NUM_QUBITS }, () => Array(NUM_SLOTS).fill(null));

  const [gates, setGates] = useState(emptyGrid());
  const [dragging, setDragging] = useState(null); // { id, qubitWidth }
  const [hovered, setHovered] = useState(null);   // { qubit, slot }
  const [dragOver, setDragOver] = useState(null);

  const state = runCircuit(gates, NUM_QUBITS);

  const canPlace = useCallback((gateId, qubitWidth, qubit, slot) => {
    if (qubit < 0 || qubit + qubitWidth > NUM_QUBITS) return false;
    if (slot < 0 || slot >= NUM_SLOTS) return false;
    for (let q = qubit; q < qubit + qubitWidth; q++) {
      if (gates[q][slot] !== null) return false;
    }
    return true;
  }, [gates]);

  const placeGate = useCallback((gateId, qubitWidth, qubit, slot) => {
    if (!canPlace(gateId, qubitWidth, qubit, slot)) return;
    const ng = gates.map(row => [...row]);
    for (let q = qubit; q < qubit + qubitWidth; q++) {
      ng[q][slot] = { id: gateId, primary: q === qubit, span: qubitWidth };
    }
    setGates(ng);
  }, [gates, canPlace]);

  const removeGate = useCallback((qubit, slot) => {
    const cell = gates[qubit]?.[slot];
    if (!cell) return;
    const ng = gates.map(row => [...row]);
    // find topmost qubit of this gate
    let top = qubit;
    for (let q = qubit; q >= 0; q--) {
      if (ng[q][slot]?.id === cell.id && ng[q][slot]?.primary === false) top = q;
      if (ng[q][slot]?.primary) { top = q; break; }
    }
    for (let q = top; q < top + cell.span; q++) {
      if (ng[q]) ng[q][slot] = null;
    }
    setGates(ng);
  }, [gates]);

  const clearAll = () => setGates(emptyGrid());

  const svgW = LABEL_W + NUM_SLOTS * CELL_W + PAD;
  const svgH = NUM_QUBITS * CELL_H + PAD;

  const gateColor = id => BUILDER_GATES.find(g => g.id === id)?.color ?? '#22d3ee';
  const gateLabel = id => BUILDER_GATES.find(g => g.id === id)?.label ?? id;

  const handleDragStart = (e, gate) => {
    setDragging(gate);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleCellDragOver = (e, qubit, slot) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOver({ qubit, slot });
  };

  const handleCellDrop = (e, qubit, slot) => {
    e.preventDefault();
    if (dragging) {
      placeGate(dragging.id, dragging.qubitWidth, qubit, slot);
    }
    setDragging(null);
    setDragOver(null);
  };

  const isDragHighlight = (qubit, slot) => {
    if (!dragging || !dragOver) return false;
    const { qubit: dq, slot: ds } = dragOver;
    return slot === ds && qubit >= dq && qubit < dq + dragging.qubitWidth;
  };

  const canDropHere = (qubit, slot) => {
    if (!dragging || !dragOver) return false;
    const { qubit: dq, slot: ds } = dragOver;
    if (slot !== ds || qubit !== dq) return false;
    return canPlace(dragging.id, dragging.qubitWidth, dq, ds);
  };

  return (
    <div>
      {/* Palette */}
      <div className="glass-card p-4 mb-4">
        <div className="text-xs text-slate-400 mb-3">Drag gates onto the circuit</div>
        <div className="flex flex-wrap gap-2">
          {BUILDER_GATES.map(gate => (
            <div
              key={gate.id}
              draggable
              onDragStart={e => handleDragStart(e, gate)}
              className="cursor-grab active:cursor-grabbing select-none rounded-lg border px-3 py-2 text-xs font-bold font-mono transition-all hover:scale-105"
              style={{
                borderColor: gate.color,
                color: gate.color,
                background: `${gate.color}18`,
                minWidth: 40,
                textAlign: 'center',
              }}
              title={gate.qubitWidth > 1 ? `${gate.label} (${gate.qubitWidth}-qubit)` : gate.label}
            >
              {gate.label}
              {gate.qubitWidth > 1 && (
                <span className="ml-1 text-slate-500 text-[9px]">{gate.qubitWidth}q</span>
              )}
            </div>
          ))}
          <button
            onClick={clearAll}
            className="rounded-lg border border-red-500/40 text-red-400 bg-red-500/10 px-3 py-2 text-xs font-bold hover:bg-red-500/20 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Circuit grid */}
      <div className="glass-card p-4 mb-4 overflow-x-auto">
        <div className="text-xs text-slate-400 mb-3">Circuit (3 qubits × 8 slots)</div>
        <svg
          width={svgW}
          height={svgH}
          style={{ display: 'block', minWidth: svgW }}
        >
          {/* Qubit lines and labels */}
          {Array.from({ length: NUM_QUBITS }, (_, q) => {
            const cy = q * CELL_H + CELL_H / 2;
            return (
              <g key={q}>
                <text x={8} y={cy + 4} fill="#64748b" fontSize={11} fontFamily="JetBrains Mono">q{q}</text>
                <line
                  x1={LABEL_W} y1={cy}
                  x2={LABEL_W + NUM_SLOTS * CELL_W} y2={cy}
                  stroke="#1e293b" strokeWidth={2}
                />
              </g>
            );
          })}

          {/* Drop cells */}
          {Array.from({ length: NUM_QUBITS }, (_, q) =>
            Array.from({ length: NUM_SLOTS }, (_, s) => {
              const cx = LABEL_W + s * CELL_W;
              const cy = q * CELL_H;
              const highlight = isDragHighlight(q, s);
              const canDrop = canDropHere(q, s);
              const hasGate = gates[q][s] !== null;
              return (
                <rect
                  key={`cell-${q}-${s}`}
                  x={cx + 4} y={cy + 4}
                  width={CELL_W - 8} height={CELL_H - 8}
                  rx={6}
                  fill={highlight ? (canDrop ? '#22d3ee18' : '#ef444418') : 'transparent'}
                  stroke={highlight ? (canDrop ? '#22d3ee60' : '#ef444460') : 'transparent'}
                  strokeWidth={1.5}
                  style={{ cursor: hasGate ? 'default' : 'crosshair' }}
                  onDragOver={e => handleCellDragOver(e, q, s)}
                  onDrop={e => handleCellDrop(e, q, s)}
                  onDragLeave={() => setDragOver(null)}
                />
              );
            })
          )}

          {/* Slot index labels */}
          {Array.from({ length: NUM_SLOTS }, (_, s) => (
            <text
              key={`slot-${s}`}
              x={LABEL_W + s * CELL_W + CELL_W / 2}
              y={NUM_QUBITS * CELL_H + 14}
              textAnchor="middle"
              fill="#334155"
              fontSize={9}
              fontFamily="JetBrains Mono"
            >
              {s + 1}
            </text>
          ))}

          {/* Rendered gates */}
          {Array.from({ length: NUM_QUBITS }, (_, q) =>
            Array.from({ length: NUM_SLOTS }, (_, s) => {
              const cell = gates[q][s];
              if (!cell || !cell.primary) return null;
              const cx = LABEL_W + s * CELL_W + CELL_W / 2;
              const cy = q * CELL_H + CELL_H / 2;
              const color = gateColor(cell.id);
              const label = gateLabel(cell.id);
              const isMulti = cell.span > 1;
              const totalH = cell.span * CELL_H - 8;

              if (isMulti) {
                // multi-qubit gate rendering
                const topY = q * CELL_H + 4;
                const midY = topY + totalH / 2;
                return (
                  <g
                    key={`gate-${q}-${s}`}
                    onClick={() => removeGate(q, s)}
                    style={{ cursor: 'pointer' }}
                    title="Click to remove"
                  >
                    <rect
                      x={cx - CELL_W / 2 + 8} y={topY}
                      width={CELL_W - 16} height={totalH}
                      rx={6}
                      fill={`${color}28`} stroke={color} strokeWidth={1.5}
                    />
                    {/* vertical wire segment */}
                    <line
                      x1={cx} y1={q * CELL_H + CELL_H / 2}
                      x2={cx} y2={(q + cell.span - 1) * CELL_H + CELL_H / 2}
                      stroke={color} strokeWidth={1} strokeDasharray="3 2"
                    />
                    <text x={cx} y={midY + 4} textAnchor="middle" fill={color} fontSize={11} fontFamily="JetBrains Mono" fontWeight="bold">
                      {label}
                    </text>
                  </g>
                );
              }

              // single-qubit gate
              return (
                <g
                  key={`gate-${q}-${s}`}
                  onClick={() => removeGate(q, s)}
                  style={{ cursor: 'pointer' }}
                  title="Click to remove"
                >
                  <rect
                    x={cx - 18} y={cy - 16}
                    width={36} height={32}
                    rx={5}
                    fill={`${color}28`} stroke={color} strokeWidth={1.5}
                  />
                  <text x={cx} y={cy + 5} textAnchor="middle" fill={color} fontSize={13} fontFamily="JetBrains Mono" fontWeight="bold">
                    {label}
                  </text>
                </g>
              );
            })
          )}
        </svg>
        <p className="text-xs text-slate-600 mt-2">Click a gate on the circuit to remove it.</p>
      </div>

      {/* State vector output */}
      <div className="glass-card p-4">
        <div className="text-xs font-bold text-slate-300 mb-3">Output State (starting from |000⟩)</div>
        <StateVector state={state} numQubits={NUM_QUBITS} />
      </div>
    </div>
  );
}

// ─── Circuit Optimizer ────────────────────────────────────────────────────────

const OPTIMIZATION_RULES = [
  {
    id: 'hh',
    name: 'H·H = I',
    pattern: ['H', 'H'],
    result: 'I (identity — cancel both)',
    saving: 2,
    latex: 'H^2 = I \\implies HH\\,|\\psi\\rangle = |\\psi\\rangle',
    color: '#c084fc',
    level: 'high',
  },
  {
    id: 'xx',
    name: 'X·X = I',
    pattern: ['X', 'X'],
    result: 'I (identity — cancel both)',
    saving: 2,
    latex: 'X^2 = I \\implies XX\\,|\\psi\\rangle = |\\psi\\rangle',
    color: '#22d3ee',
    level: 'high',
  },
  {
    id: 'zz',
    name: 'Z·Z = I',
    pattern: ['Z', 'Z'],
    result: 'I (identity — cancel both)',
    saving: 2,
    latex: 'Z^2 = I',
    color: '#6366f1',
    level: 'high',
  },
  {
    id: 'yy',
    name: 'Y·Y = I',
    pattern: ['Y', 'Y'],
    result: 'I (identity — cancel both)',
    saving: 2,
    latex: 'Y^2 = I',
    color: '#f59e0b',
    level: 'high',
  },
  {
    id: 'ss',
    name: 'S·S = Z',
    pattern: ['S', 'S'],
    result: 'Replace with single Z gate',
    saving: 1,
    latex: 'S^2 = Z',
    color: '#10b981',
    level: 'medium',
  },
  {
    id: 'tt',
    name: 'T·T = S',
    pattern: ['T', 'T'],
    result: 'Replace with single S gate',
    saving: 1,
    latex: 'T^2 = S',
    color: '#f472b6',
    level: 'medium',
  },
  {
    id: 'tttt',
    name: 'T⁴ = Z',
    pattern: ['T', 'T', 'T', 'T'],
    result: 'Replace with single Z gate',
    saving: 3,
    latex: 'T^4 = Z',
    color: '#f472b6',
    level: 'medium',
  },
  {
    id: 'hxh',
    name: 'H·X·H = Z',
    pattern: ['H', 'X', 'H'],
    result: 'Replace with single Z gate',
    saving: 2,
    latex: 'HXH = Z',
    color: '#c084fc',
    level: 'medium',
  },
  {
    id: 'hzh',
    name: 'H·Z·H = X',
    pattern: ['H', 'Z', 'H'],
    result: 'Replace with single X gate',
    saving: 2,
    latex: 'HZH = X',
    color: '#c084fc',
    level: 'medium',
  },
  {
    id: 'xzx',
    name: 'X·Z·X = -Z',
    pattern: ['X', 'Z', 'X'],
    result: 'Replace with Z (global phase ignorable)',
    saving: 2,
    latex: 'XZX = -Z \\approx Z \\text{ (global phase)}',
    color: '#22d3ee',
    level: 'low',
  },
  {
    id: 'cnot_cnot',
    name: 'CNOT·CNOT = I',
    pattern: ['CNOT', 'CNOT'],
    result: 'Cancel both CNOT gates',
    saving: 2,
    latex: 'CNOT^2 = I',
    color: '#22d3ee',
    level: 'high',
  },
  {
    id: 'swap_swap',
    name: 'SWAP·SWAP = I',
    pattern: ['SWAP', 'SWAP'],
    result: 'Cancel both SWAP gates',
    saving: 2,
    latex: 'SWAP^2 = I',
    color: '#f59e0b',
    level: 'high',
  },
];

function analyzeSequence(seq) {
  const s = seq.trim().toUpperCase();
  const tokens = s.split(/[\s,·*]+/).filter(Boolean);
  const found = [];
  const coverage = new Set();

  for (const rule of OPTIMIZATION_RULES) {
    const pat = rule.pattern;
    for (let i = 0; i <= tokens.length - pat.length; i++) {
      const slice = tokens.slice(i, i + pat.length);
      if (slice.join(',') === pat.join(',')) {
        const alreadyCovered = slice.some((_, k) => coverage.has(i + k));
        if (!alreadyCovered) {
          found.push({ rule, index: i, tokens: slice });
          slice.forEach((_, k) => coverage.add(i + k));
        }
      }
    }
  }

  // Gate count analysis
  const gateCount = {};
  tokens.forEach(t => { gateCount[t] = (gateCount[t] || 0) + 1; });

  // Circuit depth (simplified: count unique sequential layers)
  const depth = tokens.length;
  const totalSaving = found.reduce((a, f) => a + f.rule.saving, 0);
  const optimizedDepth = depth - totalSaving;

  return { tokens, found, gateCount, depth, optimizedDepth, totalSaving };
}

function CircuitOptimizer() {
  const [seq, setSeq] = useState('H X H H Z T T S S');
  const [analyzed, setAnalyzed] = useState(null);

  const run = () => setAnalyzed(analyzeSequence(seq));

  const levelColor = lvl =>
    lvl === 'high' ? 'text-green-400 border-green-500/40 bg-green-500/10'
    : lvl === 'medium' ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    : 'text-slate-400 border-slate-500/40 bg-slate-500/10';

  return (
    <div>
      {/* Input */}
      <div className="glass-card p-5 mb-4">
        <div className="text-sm font-bold text-slate-300 mb-1">Gate Sequence Analyzer</div>
        <p className="text-xs text-slate-500 mb-3">
          Enter a sequence of gates (space or comma separated). Supported: H, X, Y, Z, S, T, I, CNOT, SWAP, CZ
        </p>
        <div className="flex gap-3">
          <input
            className="quantum-input flex-1 font-mono"
            value={seq}
            onChange={e => setSeq(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder="e.g. H X H T T Z Z"
          />
          <button
            onClick={run}
            className="px-5 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-sm font-bold hover:bg-cyan-500/30 transition-colors"
          >
            Analyze
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {['H X H', 'T T T T', 'CNOT CNOT', 'H Z H X X', 'S S Z Z', 'H H X H H'].map(ex => (
            <button
              key={ex}
              onClick={() => { setSeq(ex); setAnalyzed(analyzeSequence(ex)); }}
              className="px-2 py-1 rounded text-xs font-mono border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors bg-slate-800/40"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {analyzed && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Gate Count', val: analyzed.depth, color: 'text-cyan-400' },
              { label: 'Optimizations', val: analyzed.found.length, color: 'text-purple-400' },
              { label: 'Gates Saved', val: analyzed.totalSaving, color: 'text-green-400' },
              { label: 'Optimized Depth', val: analyzed.optimizedDepth, color: 'text-amber-400' },
            ].map(s => (
              <div key={s.label} className="glass-card p-3 text-center">
                <div className={`text-2xl font-bold font-orbitron ${s.color}`}>{s.val}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Token display */}
          <div className="glass-card p-4 mb-4">
            <div className="text-xs text-slate-400 mb-3">Parsed sequence</div>
            <div className="flex flex-wrap gap-2">
              {analyzed.tokens.map((t, i) => {
                const match = analyzed.found.find(f => i >= f.index && i < f.index + f.rule.pattern.length);
                const color = match ? match.rule.color : '#475569';
                return (
                  <span
                    key={i}
                    className="px-2 py-1 rounded font-mono text-xs font-bold border"
                    style={{ borderColor: `${color}60`, color, background: `${color}18` }}
                    title={match ? match.rule.name : t}
                  >
                    {t}
                  </span>
                );
              })}
            </div>
            {analyzed.tokens.length === 0 && (
              <p className="text-xs text-slate-600">No valid gate tokens found.</p>
            )}
          </div>

          {/* Optimization opportunities */}
          {analyzed.found.length > 0 ? (
            <div className="space-y-3 mb-4">
              <div className="text-xs font-bold text-slate-300">Optimization Opportunities</div>
              {analyzed.found.map((f, i) => (
                <div key={i} className="glass-card p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="text-sm font-bold" style={{ color: f.rule.color }}>{f.rule.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{f.rule.result}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs border flex-shrink-0 ${levelColor(f.rule.level)}`}>
                      -{f.rule.saving} gate{f.rule.saving > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="bg-slate-900/60 rounded p-2 border border-slate-700/40">
                    <Mth block>{f.rule.latex}</Mth>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-4 mb-4 text-center text-slate-500 text-sm">
              No optimization opportunities found in this sequence.
            </div>
          )}

          {/* Gate frequency */}
          <div className="glass-card p-4">
            <div className="text-xs font-bold text-slate-300 mb-3">Gate Frequency</div>
            <div className="space-y-2">
              {Object.entries(analyzed.gateCount).map(([g, cnt]) => {
                const gDef = BUILDER_GATES.find(b => b.id === g);
                const color = gDef?.color ?? '#475569';
                return (
                  <div key={g} className="flex items-center gap-3 text-xs">
                    <span className="font-mono w-12 flex-shrink-0" style={{ color }}>{g}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${(cnt / analyzed.depth) * 100}%`, background: color }}
                      />
                    </div>
                    <span className="text-slate-400 w-6 text-right">{cnt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Reference rules */}
      <div className="glass-card p-4 mt-4">
        <div className="text-xs font-bold text-slate-300 mb-3">Optimization Rule Reference</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {OPTIMIZATION_RULES.map(r => (
            <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
              <span className="text-xs font-mono" style={{ color: r.color }}>{r.name}</span>
              <span className={`text-xs px-2 rounded border ${levelColor(r.level)}`}>
                -{r.saving}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function QuantumGates() {
  const [tab, setTab] = useState('single');
  const [selectedGate, setSelectedGate] = useState('H');
  const [selectedMulti, setSelectedMulti] = useState('CNOT');

  const tabs = [
    { id: 'single',    label: 'Single Qubit' },
    { id: 'multi',     label: 'Multi Qubit' },
    { id: 'special',   label: 'Special Gates' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-orbitron text-2xl font-bold neon-cyan mb-2">Quantum Gates</h1>
        <p className="text-slate-400 text-sm">Matrix representations, outer product derivations, circuit builder & optimizer</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-700/50 mb-6 gap-0">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`tab-btn click-pop ${tab === t.id ? 'tab-active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Single Qubit ── */}
      {tab === 'single' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(GATES).map(g => (
              <button key={g} onClick={() => setSelectedGate(g)}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all click-pop ${
                  selectedGate === g
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 glow-cyan'
                    : 'border-slate-700 text-slate-400 bg-slate-800/40 hover:border-slate-500'
                }`}
                style={{ minWidth: '56px' }}>
                {g}
              </button>
            ))}
          </div>

          {GATES[selectedGate] && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
              <div className="flex flex-col gap-6">
                {/* Info card */}
                <div className="glass-card p-6 flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xl shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                      style={{ background: `${GATES[selectedGate].color}22` }}>
                      {selectedGate}
                    </div>
                    <div>
                      <div className="text-cyan-400 font-bold text-lg">{GATES[selectedGate].name}</div>
                      <div className="text-slate-400 text-sm whitespace-pre-wrap">{GATES[selectedGate].description}</div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">Matrix Representation</div>
                    <div className="bg-white/5 rounded-xl p-6 border border-white/5 shadow-inner">
                      <Mth block>{GATES[selectedGate].latex}</Mth>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">Circuit Logic</div>
                    <div className="flex justify-center p-4 bg-white/5 rounded-xl border border-white/5">
                       <CircuitDiagram gateSymbol={selectedGate} color={GATES[selectedGate].color} />
                    </div>
                  </div>
                </div>

                {/* Truth table */}
                <div className="glass-card p-6">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-300 mb-4">Input-Output Mapping</div>
                  <div className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
                    <TruthTable gate={selectedGate} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {/* Step by step */}
                <div className="glass-card p-6 flex-1">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-300 mb-5">Mathematical Trace</div>
                  <StepDisplay steps={gateSteps[selectedGate] || [{ text: 'Standard unitary transformation.' }]} />
                </div>

                {/* Outer product derivation */}
                <div className="contents">
                  <OuterProductPanel gateName={selectedGate} />
                </div>

                {/* Simulator */}
                <div className="glass-card p-6">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-300 mb-4">State Interaction</div>
                  <GateSimulator gateName={selectedGate} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Multi Qubit ── */}
      {tab === 'multi' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(MULTI_GATES).map(g => (
              <button key={g} onClick={() => setSelectedMulti(g)}
                className={`px-4 py-2 rounded-lg text-sm border transition-all click-pop ${
                  selectedMulti === g
                    ? 'border-purple-400 text-purple-400 bg-purple-500/10'
                    : 'border-slate-700 text-slate-400 bg-slate-800/40 hover:border-slate-500'
                }`}>
                {g}
              </button>
            ))}
          </div>

          {MULTI_GATES[selectedMulti] && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6">
                <div className="glass-card p-10 flex-grow flex flex-col justify-center border-t-2 border-purple-500/30">
                  <div className="text-purple-400 font-bold text-2xl mb-4 tracking-tight">{MULTI_GATES[selectedMulti].name}</div>
                  <div className="text-slate-400 text-base mb-8 leading-relaxed opacity-90">{MULTI_GATES[selectedMulti].description}</div>
                  
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-4">Core Implementation</div>
                  <div className="flex justify-center p-10 bg-black/20 rounded-3xl border border-white/5 shadow-2xl">
                    {selectedMulti === 'CNOT' && <CNOTCircuit />}
                    {selectedMulti === 'SWAP' && <SWAPCircuit />}
                    {selectedMulti === 'Toffoli' && <ToffoliCircuit />}
                    {!['CNOT','SWAP','Toffoli'].includes(selectedMulti) && (
                      <div className="text-sm text-slate-500 font-mono italic opacity-50 px-10 py-4">Circuit Schematic: {selectedMulti}</div>
                    )}
                  </div>
                </div>
                <div className="glass-card p-10">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-300 mb-6 font-orbitron">Logical Truth Projection</div>
                  <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                    <TruthTable gate={selectedMulti} isMulti />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
                <div className="glass-card p-10 flex-grow flex flex-col">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-300 mb-6 font-orbitron">
                    Unitary Matrix ({MULTI_GATES[selectedMulti].matrix.length}² entries)
                  </div>
                  <div className="bg-white/5 rounded-3xl p-10 border border-white/5 flex-grow flex items-center justify-center overflow-x-auto shadow-inner">
                    <MatrixBlock matrix={MULTI_GATES[selectedMulti].matrix} color={MULTI_GATES[selectedMulti].color} />
                  </div>
                </div>

                {selectedMulti === 'CNOT' && (
                  <div className="glass-card p-10">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-300 mb-6">Quantum Entanglement Derivation</div>
                    <StepDisplay steps={[
                      { label: 'System operator logic', latex: 'CNOT = |0\\rangle\\langle 0| \\otimes I + |1\\rangle\\langle 1| \\otimes X' },
                      { label: 'Hilbert expansion', latex: '= \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}\\otimes I + \\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}\\otimes X' },
                      { label: 'Canonical 4×4 form', latex: 'CNOT = \\begin{pmatrix}1&0&0&0\\\\0&1&0&0\\\\0&0&0&1\\\\0&0&1&0\\end{pmatrix}' },
                    ]} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Special Gates ── */}
      {tab === 'special' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <div className="text-cyan-400 font-bold mb-3">Controlled Gates</div>
            <p className="text-slate-400 text-sm mb-4">A controlled gate applies a unitary U to the target qubit only if the control qubit is |1⟩.</p>
            <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
              <Mth block>{'CU = |0\\rangle\\langle 0| \\otimes I + |1\\rangle\\langle 1| \\otimes U'}</Mth>
            </div>
          </div>
          <div className="glass-card p-5">
            <div className="text-purple-400 font-bold mb-3">Universal Gate Sets</div>
            <p className="text-slate-400 text-sm mb-4">Any unitary operation can be decomposed into:</p>
            <ul className="space-y-2 text-xs text-slate-300">
              {['CNOT + single qubit rotations', 'H + T + CNOT', 'Toffoli + Hadamard'].map((s, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-cyan-400">▸</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-5">
            <div className="text-emerald-400 font-bold mb-3">Gate Decomposition Example</div>
            <p className="text-slate-400 text-sm mb-3">Toffoli gate decomposition using CNOT and single-qubit gates:</p>
            <StepDisplay steps={[
              { latex: 'CCX = (I \\otimes I \\otimes H) \\cdot (I \\otimes CNOT) \\cdot (I \\otimes I \\otimes T^\\dagger)' },
              { text: '→ ~15 CNOT + single qubit gates' },
            ]} />
          </div>
          <div className="glass-card p-5">
            <div className="text-amber-400 font-bold mb-3">Gate Properties</div>
            <div className="space-y-2 text-xs">
              {[
                { p: 'Unitary',     v: 'U†U = UU† = I' },
                { p: 'Hermitian',   v: 'U† = U (Pauli gates)' },
                { p: 'Involutory',  v: 'U² = I (H, X, Y, Z)' },
                { p: 'Phase gates', v: 'S = T², Z = S²' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-slate-800/50">
                  <span className="text-slate-400">{r.p}</span>
                  <span className="text-amber-300 font-mono">{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* The Circuit Builder has been consolidated to the Main Navigation Menu */}
    </div>
  );
}
