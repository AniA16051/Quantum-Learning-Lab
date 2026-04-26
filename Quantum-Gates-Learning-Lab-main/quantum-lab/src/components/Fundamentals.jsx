import React, { useState } from 'react';
import { Math as Mth, StepDisplay } from './MathBlock';

const topics = [
  {
    id: 'ket',
    title: 'Ket Notation |ψ⟩',
    icon: '|',
    color: 'cyan',
    latex: '|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle',
    desc: 'A ket |ψ⟩ represents the quantum state of a system. It is a column vector in a complex Hilbert space. For a qubit, it is a superposition of |0⟩ and |1⟩.',
    steps: [
      { label: 'Column vector form', latex: '|\\psi\\rangle = \\begin{pmatrix}\\alpha \\\\ \\beta\\end{pmatrix}' },
      { label: 'With |0⟩ and |1⟩ basis', latex: '|0\\rangle = \\begin{pmatrix}1\\\\0\\end{pmatrix}, \\quad |1\\rangle = \\begin{pmatrix}0\\\\1\\end{pmatrix}' },
      { label: 'Normalization condition', latex: '|\\alpha|^2 + |\\beta|^2 = 1' },
    ],
  },
  {
    id: 'bra',
    title: 'Bra Notation ⟨ψ|',
    icon: '⟨',
    color: 'purple',
    latex: '\\langle\\psi| = (|\\psi\\rangle)^\\dagger = (\\alpha^* \\quad \\beta^*)',
    desc: 'A bra ⟨ψ| is the Hermitian conjugate (conjugate transpose) of the ket. It is a row vector in the dual Hilbert space.',
    steps: [
      { label: 'Row vector form', latex: '\\langle\\psi| = \\begin{pmatrix}\\alpha^* & \\beta^*\\end{pmatrix}' },
      { label: 'Conjugate transpose', latex: '\\langle\\psi| = (|\\psi\\rangle)^\\dagger' },
      { label: 'Example with |0⟩', latex: '\\langle 0| = (1 \\quad 0), \\quad \\langle 1| = (0 \\quad 1)' },
    ],
  },
  {
    id: 'inner',
    title: 'Inner Product ⟨φ|ψ⟩',
    icon: '⟨|⟩',
    color: 'blue',
    latex: '\\langle\\phi|\\psi\\rangle = \\phi_0^*\\psi_0 + \\phi_1^*\\psi_1',
    desc: 'The inner product gives a scalar that represents the "overlap" between two states. It is related to the probability of measuring |φ⟩ when the system is in state |ψ⟩.',
    steps: [
      { label: 'Definition', latex: '\\langle\\phi|\\psi\\rangle = \\sum_i \\phi_i^* \\psi_i' },
      { label: 'Orthonormality', latex: '\\langle 0|0\\rangle = 1, \\quad \\langle 1|1\\rangle = 1, \\quad \\langle 0|1\\rangle = 0' },
      { label: 'Born rule: probability', latex: 'P(\\phi) = |\\langle\\phi|\\psi\\rangle|^2' },
    ],
  },
  {
    id: 'outer',
    title: 'Outer Product |ψ⟩⟨φ|',
    icon: '|⟩⟨|',
    color: 'green',
    latex: '|\\psi\\rangle\\langle\\phi| = \\begin{pmatrix}\\psi_0\\phi_0^* & \\psi_0\\phi_1^* \\\\ \\psi_1\\phi_0^* & \\psi_1\\phi_1^*\\end{pmatrix}',
    desc: 'The outer product creates a matrix (operator) from two vectors. It represents a projection or transformation in Hilbert space.',
    steps: [
      { label: 'Projection onto |0⟩', latex: '|0\\rangle\\langle 0| = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}' },
      { label: 'Projection onto |1⟩', latex: '|1\\rangle\\langle 1| = \\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}' },
      { label: 'Completeness relation', latex: '|0\\rangle\\langle 0| + |1\\rangle\\langle 1| = I' },
    ],
  },
  {
    id: 'tensor',
    title: 'Tensor Product ⊗',
    icon: '⊗',
    color: 'orange',
    latex: '|\\psi\\rangle \\otimes |\\phi\\rangle = |\\psi\\phi\\rangle',
    desc: 'The tensor product combines two quantum systems into a composite system. For two qubits, it creates a 4-dimensional state space.',
    steps: [
      { label: '2-qubit state', latex: '|0\\rangle \\otimes |1\\rangle = |01\\rangle = \\begin{pmatrix}0\\\\1\\\\0\\\\0\\end{pmatrix}' },
      { label: 'General case', latex: '|a\\rangle \\otimes |b\\rangle = \\begin{pmatrix}a_0b_0\\\\a_0b_1\\\\a_1b_0\\\\a_1b_1\\end{pmatrix}' },
      { label: 'Bell state (entangled)', latex: '|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}' },
    ],
  },
];

const colorMap = {
  cyan: { badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', accent: 'text-cyan-400', card: 'border-cyan-500/20' },
  purple: { badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30', accent: 'text-purple-400', card: 'border-purple-500/20' },
  blue: { badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', accent: 'text-indigo-400', card: 'border-indigo-500/20' },
  green: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', accent: 'text-emerald-400', card: 'border-emerald-500/20' },
  orange: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', accent: 'text-amber-400', card: 'border-amber-500/20' },
};

function InnerProductCalc() {
  const [a0, setA0] = useState('1');
  const [a1, setA1] = useState('0');
  const [b0, setB0] = useState('1');
  const [b1, setB1] = useState('0');

  const result = () => {
    const r = parseFloat(a0) * parseFloat(b0) + parseFloat(a1) * parseFloat(b1);
    return isNaN(r) ? '—' : r.toFixed(4);
  };

  return (
    <div className="glass-card p-4 mt-4">
      <div className="text-cyan-400 text-sm font-bold mb-3">Inner Product Calculator ⟨φ|ψ⟩</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-slate-400 mb-2">|φ⟩ components</div>
          <div className="flex gap-2 items-center mb-2">
            <span className="text-xs text-slate-500 w-4">φ₀</span>
            <input className="quantum-input" value={a0} onChange={e => setA0(e.target.value)} />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-500 w-4">φ₁</span>
            <input className="quantum-input" value={a1} onChange={e => setA1(e.target.value)} />
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-2">|ψ⟩ components</div>
          <div className="flex gap-2 items-center mb-2">
            <span className="text-xs text-slate-500 w-4">ψ₀</span>
            <input className="quantum-input" value={b0} onChange={e => setB0(e.target.value)} />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-500 w-4">ψ₁</span>
            <input className="quantum-input" value={b1} onChange={e => setB1(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-slate-900/60 rounded-lg border border-cyan-500/20 text-center">
        <span className="text-slate-400 text-sm">⟨φ|ψ⟩ = </span>
        <span className="text-cyan-400 text-lg font-bold">{result()}</span>
      </div>
    </div>
  );
}

function TensorProductCalc() {
  const [a0, setA0] = useState('1');
  const [a1, setA1] = useState('0');
  const [b0, setB0] = useState('0');
  const [b1, setB1] = useState('1');

  const compute = () => {
    const av = [parseFloat(a0) || 0, parseFloat(a1) || 0];
    const bv = [parseFloat(b0) || 0, parseFloat(b1) || 0];
    return [av[0]*bv[0], av[0]*bv[1], av[1]*bv[0], av[1]*bv[1]];
  };

  const res = compute();
  const labels = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];

  return (
    <div className="glass-card p-4 mt-4">
      <div className="text-purple-400 text-sm font-bold mb-3">Tensor Product |ψ⟩ ⊗ |φ⟩</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-slate-400 mb-2">|ψ⟩ = α|0⟩ + β|1⟩</div>
          <div className="flex gap-2 items-center mb-2">
            <span className="text-xs text-slate-500 w-4">α</span>
            <input className="quantum-input" value={a0} onChange={e => setA0(e.target.value)} />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-500 w-4">β</span>
            <input className="quantum-input" value={a1} onChange={e => setA1(e.target.value)} />
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-2">|φ⟩ = γ|0⟩ + δ|1⟩</div>
          <div className="flex gap-2 items-center mb-2">
            <span className="text-xs text-slate-500 w-4">γ</span>
            <input className="quantum-input" value={b0} onChange={e => setB0(e.target.value)} />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-500 w-4">δ</span>
            <input className="quantum-input" value={b1} onChange={e => setB1(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-slate-900/60 rounded-lg border border-purple-500/20">
        <div className="text-xs text-slate-400 mb-2">Result: |ψ⊗φ⟩</div>
        <div className="grid grid-cols-4 gap-2">
          {res.map((v, i) => (
            <div key={i} className="text-center p-2 bg-purple-900/20 rounded border border-purple-500/20">
              <div className="text-xs text-slate-400">{labels[i]}</div>
              <div className="text-purple-300 text-sm font-bold">{v.toFixed(3)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Fundamentals() {
  const [activeTopic, setActiveTopic] = useState('ket');
  const topic = topics.find(t => t.id === activeTopic);
  const clr = colorMap[topic.color];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-orbitron text-2xl font-bold neon-cyan mb-2">Quantum Fundamentals</h1>
        <p className="text-slate-400 text-sm">Core mathematical notation of quantum mechanics</p>
      </div>

      {/* Topic Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {topics.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTopic(t.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border click-pop ${
              activeTopic === t.id
                ? `${colorMap[t.color].badge} border-current shadow-lg scale-105`
                : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Concept Analysis */}
          <div className={`glass-card p-8 flex-1 flex flex-col justify-center border-l-4 ${clr.card}`}>
            <div className={`text-2xl font-bold mb-4 tracking-tight ${clr.accent}`}>{topic.title}</div>
            <p className="text-slate-300 text-sm leading-relaxed mb-8 opacity-90">{topic.desc}</p>
            <div className="bg-white/5 rounded-2xl p-8 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                 <div className="text-8xl font-orbitron">{topic.icon}</div>
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-4">Core Definition</div>
              <Mth block>{topic.latex}</Mth>
            </div>
          </div>

          {/* Derivation Steps */}
          <div className="glass-card p-8">
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-6">Logical Traversal</div>
            <StepDisplay steps={topic.steps} />
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Tools & Visualizers */}
          <div className="contents">
            {activeTopic === 'inner' && <InnerProductCalc />}
            {activeTopic === 'tensor' && <TensorProductCalc />}
            {(activeTopic === 'ket' || activeTopic === 'bra') && (
              <div className="glass-card p-8 flex-1">
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-300 mb-6">Normalization Engine</div>
                <NormCalc />
              </div>
            )}
            {activeTopic === 'outer' && <OuterProductCalc />}
          </div>

          {/* Theoretical Context */}
          <div className="glass-card p-8">
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-300 mb-4">Postulates & Syntax</div>
            <div className="space-y-1">
              {[
                { l: 'Hilbert Space', r: '|ψ⟩ ∈ ℋ' },
                { l: 'Dual Space', r: '⟨ψ| ∈ ℋ*' },
                { l: 'Adjoint Operation', r: '† (dag)' },
                { l: 'Inner Product', r: '⟨φ|ψ⟩' },
                { l: 'Outer Product', r: '|ψ⟩⟨φ|' },
                { l: 'Completeness', r: 'Σ |i⟩⟨i| = I' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 text-xs">{r.l}</span>
                  <span className="text-cyan-400 font-mono text-xs">{r.r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NormCalc() {
  const [alpha, setAlpha] = useState('0.707');
  const [beta, setBeta] = useState('0.707');
  const a = parseFloat(alpha) || 0;
  const b = parseFloat(beta) || 0;
  const norm = Math.sqrt(a * a + b * b);
  const isNorm = Math.abs(norm - 1) < 0.01;

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">α (alpha)</label>
          <input className="quantum-input" value={alpha} onChange={e => setAlpha(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">β (beta)</label>
          <input className="quantum-input" value={beta} onChange={e => setBeta(e.target.value)} />
        </div>
      </div>
      <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">|α|² + |β|²</span>
          <span className={isNorm ? 'text-green-400' : 'text-red-400'}>{(a*a + b*b).toFixed(4)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">‖|ψ⟩‖ (norm)</span>
          <span className="text-cyan-400">{norm.toFixed(4)}</span>
        </div>
        <div className={`text-xs mt-2 p-2 rounded ${isNorm ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
          {isNorm ? 'Valid quantum state (normalized)' : 'Not a valid quantum state — normalization required'}
        </div>
        {!isNorm && norm > 0 && (
          <div className="text-xs text-slate-400 mt-2">
            Normalized: α={((a/norm)).toFixed(4)}, β={((b/norm)).toFixed(4)}
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-xs text-slate-400 mb-2">Probability visualization</div>
        <div className="flex gap-2 items-center mb-1">
          <span className="text-xs text-slate-500 w-16">P(|0⟩)</span>
          <div className="flex-1 bg-slate-800 rounded-full h-2">
            <div className="prob-bar" style={{ width: `${Math.min(100, a*a/(a*a+b*b+0.0001)*100)}%` }}></div>
          </div>
          <span className="text-xs text-cyan-400 w-12 text-right">{(a*a/(a*a+b*b+0.0001)*100).toFixed(1)}%</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-slate-500 w-16">P(|1⟩)</span>
          <div className="flex-1 bg-slate-800 rounded-full h-2">
            <div className="prob-bar" style={{ width: `${Math.min(100, b*b/(a*a+b*b+0.0001)*100)}%`, background: 'linear-gradient(90deg, #c084fc, #6366f1)' }}></div>
          </div>
          <span className="text-xs text-purple-400 w-12 text-right">{(b*b/(a*a+b*b+0.0001)*100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

function OuterProductCalc() {
  const [a0, setA0] = useState('1');
  const [a1, setA1] = useState('0');
  const [b0, setB0] = useState('1');
  const [b1, setBeta1] = useState('0');

  const av = [parseFloat(a0)||0, parseFloat(a1)||0];
  const bv = [parseFloat(b0)||0, parseFloat(b1)||0];
  const mat = [
    [av[0]*bv[0], av[0]*bv[1]],
    [av[1]*bv[0], av[1]*bv[1]],
  ];

  return (
    <div className="glass-card p-5">
      <div className="text-emerald-400 text-sm font-bold mb-4">Outer Product |ψ⟩⟨φ| Calculator</div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-400 mb-2">|ψ⟩</div>
          <div className="flex gap-2 mb-2 items-center">
            <span className="text-xs text-slate-500 w-4">ψ₀</span>
            <input className="quantum-input" value={a0} onChange={e => setA0(e.target.value)} />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-500 w-4">ψ₁</span>
            <input className="quantum-input" value={a1} onChange={e => setA1(e.target.value)} />
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-2">⟨φ|</div>
          <div className="flex gap-2 mb-2 items-center">
            <span className="text-xs text-slate-500 w-4">φ₀</span>
            <input className="quantum-input" value={b0} onChange={e => setB0(e.target.value)} />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-500 w-4">φ₁</span>
            <input className="quantum-input" value={b1} onChange={e => setBeta1(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="p-3 bg-slate-900/60 rounded-lg border border-emerald-500/20">
        <div className="text-xs text-slate-400 mb-3">Resulting matrix |ψ⟩⟨φ|:</div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-emerald-400 text-2xl">⌈</span>
          <div>
            {mat.map((row, i) => (
              <div key={i} className="flex gap-6">
                {row.map((cell, j) => (
                  <span key={j} className="text-slate-200 text-sm text-center min-w-[50px]">{cell.toFixed(3)}</span>
                ))}
              </div>
            ))}
          </div>
          <span className="text-emerald-400 text-2xl">⌋</span>
        </div>
      </div>
    </div>
  );
}
