import React, { useState } from 'react';
import { Math as Mth } from './MathBlock';

// ─── Matrix Multiplier ──────────────────────────────────────────────────────
function parseMatrix(str) {
  try {
    return str.trim().split('\n').map(row => row.trim().split(/[\s,]+/).map(Number));
  } catch { return null; }
}

function MatrixDisplay({ matrix, color = '#22d3ee' }) {
  if (!matrix || !matrix.length) return null;
  return (
    <div className="flex items-center justify-center">
      <span style={{ color, fontSize: '28px', lineHeight: 1, marginRight: '4px' }}>[</span>
      <div>
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-3">
            {row.map((cell, j) => (
              <span key={j} className="text-slate-200 text-sm text-center" style={{ minWidth: '40px' }}>
                {typeof cell === 'number' ? cell.toFixed(3) : cell}
              </span>
            ))}
          </div>
        ))}
      </div>
      <span style={{ color, fontSize: '28px', lineHeight: 1, marginLeft: '4px' }}>]</span>
    </div>
  );
}

function MatMulCalc() {
  const [aStr, setAStr] = useState('1 0\n0 1');
  const [bStr, setBStr] = useState('0 1\n1 0');
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);

  const compute = () => {
    const A = parseMatrix(aStr);
    const B = parseMatrix(bStr);
    if (!A || !B) return;
    const n = A.length, m = A[0].length, p = B[0].length;
    if (m !== B.length) { setResult(null); setSteps(['Dimension mismatch']); return; }

    const C = Array(n).fill(null).map(() => Array(p).fill(0));
    const newSteps = [];

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < p; j++) {
        const terms = [];
        for (let k = 0; k < m; k++) {
          C[i][j] += A[i][k] * B[k][j];
          terms.push(`${A[i][k]}×${B[k][j]}`);
        }
        newSteps.push({ pos: `C[${i}][${j}]`, formula: terms.join(' + '), value: C[i][j] });
      }
    }

    setResult(C);
    setSteps(newSteps);
  };

  const A = parseMatrix(aStr);
  const B = parseMatrix(bStr);

  return (
    <div className="glass-card p-5">
      <div className="text-cyan-400 font-bold mb-4">Matrix Multiplication A × B</div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[['Matrix A', aStr, setAStr], ['Matrix B', bStr, setBStr]].map(([label, val, setter], i) => (
          <div key={i}>
            <label className="text-xs text-slate-400 block mb-1">{label} (rows by space, cols by newline)</label>
            <textarea
              value={val}
              onChange={e => setter(e.target.value)}
              className="quantum-input"
              rows={4}
              style={{ fontFamily: 'JetBrains Mono', resize: 'vertical' }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-4 items-center flex-wrap">
        {A && <MatrixDisplay matrix={A} color="#22d3ee" />}
        <span className="text-slate-400 text-2xl mx-2">×</span>
        {B && <MatrixDisplay matrix={B} color="#c084fc" />}
        {result && <span className="text-slate-400 text-2xl mx-2">=</span>}
        {result && <MatrixDisplay matrix={result} color="#fbbf24" />}
      </div>

      <button className="btn-neon mb-4" onClick={compute}>Compute Step-by-Step</button>

      {steps.length > 0 && (
        <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50 max-h-48 overflow-y-auto">
          <div className="text-xs text-slate-400 mb-2">Step-by-step:</div>
          {steps.map((s, i) => typeof s === 'string' ? (
            <div key={i} className="text-red-400 text-xs">{s}</div>
          ) : (
            <div key={i} className="text-xs py-1 border-b border-slate-800/50 flex justify-between gap-4">
              <span className="text-slate-400">{s.pos} =</span>
              <span className="text-cyan-300">{s.formula}</span>
              <span className="text-yellow-400">{s.value.toFixed(3)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tensor Product ─────────────────────────────────────────────────────────
function TensorCalc() {
  const [aStr, setAStr] = useState('1\n0');
  const [bStr, setBStr] = useState('0\n1');
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);

  const compute = () => {
    const A = parseMatrix(aStr);
    const B = parseMatrix(bStr);
    if (!A || !B) return;

    const nA = A.length, mA = A[0].length;
    const nB = B.length, mB = B[0].length;
    const C = Array(nA * nB).fill(null).map(() => Array(mA * mB).fill(0));
    const newSteps = [];

    for (let i = 0; i < nA; i++)
      for (let j = 0; j < mA; j++) {
        const block = B.map(bRow => bRow.map(bVal => A[i][j] * bVal));
        newSteps.push({ scale: A[i][j], block: block, pos: `(${i},${j})` });
        for (let k = 0; k < nB; k++)
          for (let l = 0; l < mB; l++)
            C[i * nB + k][j * mB + l] = A[i][j] * B[k][l];
      }

    setResult(C);
    setSteps(newSteps);
  };

  return (
    <div className="glass-card p-5">
      <div className="text-purple-400 font-bold mb-4">Tensor Product A ⊗ B</div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[['Vector/Matrix A', aStr, setAStr], ['Vector/Matrix B', bStr, setBStr]].map(([label, val, setter], i) => (
          <div key={i}>
            <label className="text-xs text-slate-400 block mb-1">{label}</label>
            <textarea
              value={val}
              onChange={e => setter(e.target.value)}
              className="quantum-input"
              rows={4}
              style={{ fontFamily: 'JetBrains Mono', resize: 'vertical' }}
            />
          </div>
        ))}
      </div>

      <button className="btn-purple mb-4" onClick={compute}>Compute Tensor Product</button>

      {result && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-2">Result A ⊗ B:</div>
            <MatrixDisplay matrix={result} color="#c084fc" />
          </div>
          {steps.length > 0 && (
            <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50 overflow-y-auto max-h-48">
              <div className="text-xs text-slate-400 mb-2">Steps:</div>
              {steps.map((s, i) => (
                <div key={i} className="text-xs py-1 border-b border-slate-800/50">
                  <span className="text-slate-500">A{s.pos} = {s.scale}</span>
                  <span className="text-purple-300"> → block scaled by {s.scale}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Modulo Arithmetic ──────────────────────────────────────────────────────
function ModuloCalc() {
  const [base, setBase] = useState('7');
  const [mod, setMod] = useState('15');
  const [exp, setExp] = useState('3');
  const [steps, setSteps] = useState([]);

  const computeModPow = () => {
    const b = parseInt(base), m = parseInt(mod), e = parseInt(exp);
    if (isNaN(b) || isNaN(m) || isNaN(e) || m <= 0) return;
    const newSteps = [];
    let result = 1;
    let base_ = b % m;
    let e_ = e;
    newSteps.push({ text: `Start: result = 1, base = ${b} mod ${m} = ${base_}` });

    while (e_ > 0) {
      if (e_ % 2 === 1) {
        result = (result * base_) % m;
        newSteps.push({ text: `e is odd: result = ${result}, e = ${e_} → ${Math.floor(e_/2)}` });
      } else {
        newSteps.push({ text: `e is even: e = ${e_} → ${Math.floor(e_/2)}` });
      }
      base_ = (base_ * base_) % m;
      e_ = Math.floor(e_ / 2);
    }
    newSteps.push({ text: `Final: ${b}^${e} mod ${m} = ${result}`, highlight: true });
    setSteps(newSteps);
  };

  const period = () => {
    const b = parseInt(base), m = parseInt(mod);
    if (isNaN(b) || isNaN(m) || m <= 0) return null;
    let val = b % m;
    for (let r = 1; r <= m; r++) {
      if (val === 1) return r;
      val = (val * (b % m)) % m;
    }
    return null;
  };

  const r = period();

  return (
    <div className="glass-card p-5">
      <div className="text-emerald-400 font-bold mb-4">Modular Arithmetic (for Shor's Algorithm)</div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Base (a)</label>
          <input className="quantum-input" value={base} onChange={e => setBase(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Exponent (k)</label>
          <input className="quantum-input" value={exp} onChange={e => setExp(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Modulus (N)</label>
          <input className="quantum-input" value={mod} onChange={e => setMod(e.target.value)} />
        </div>
      </div>

      <button className="btn-neon" onClick={computeModPow} style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))', borderColor: 'rgba(16,185,129,0.4)', color: '#10b981' }}>
        Compute aᵏ mod N
      </button>

      {r && (
        <div className="mt-3 p-3 bg-emerald-900/20 rounded border border-emerald-500/20 text-xs">
          <span className="text-slate-400">Period of {base}ˣ mod {mod}: </span>
          <span className="text-emerald-400 font-bold">r = {r}</span>
          <span className="text-slate-500 ml-2">(key for Shor's algorithm)</span>
        </div>
      )}

      {steps.length > 0 && (
        <div className="mt-4 bg-slate-900/60 rounded-lg p-3 border border-slate-700/50 max-h-48 overflow-y-auto">
          {steps.map((s, i) => (
            <div key={i} className={`text-xs py-1 border-b border-slate-800/50 ${s.highlight ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
              {s.text}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <div className="text-xs text-slate-400 mb-2">Powers table: {base}ˣ mod {mod}</div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: Math.min(parseInt(mod) || 0, 12) }, (_, i) => {
            const val = Math.pow(parseInt(base) || 0, i + 1) % (parseInt(mod) || 1);
            return (
              <div key={i} className="text-center p-1 bg-slate-800/40 rounded border border-slate-700/30 text-xs">
                <div className="text-slate-500">x={i+1}</div>
                <div className="text-emerald-400">{val}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Inner/Outer Product ────────────────────────────────────────────────────
function InnerOuterCalc() {
  const [v1, setV1] = useState('0.707\n0.707');
  const [v2, setV2] = useState('0.707\n-0.707');

  const parseVec = s => s.trim().split('\n').map(v => parseFloat(v.trim()) || 0);
  const a = parseVec(v1);
  const b = parseVec(v2);
  const valid = a.length === b.length;

  const inner = valid ? a.reduce((sum, v, i) => sum + v * b[i], 0) : null;
  const outer = valid ? a.map(ai => b.map(bj => ai * bj)) : null;
  const normA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const normB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));

  return (
    <div className="glass-card p-5">
      <div className="text-amber-400 font-bold mb-4">Inner & Outer Product Calculator</div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[['|φ⟩ vector', v1, setV1], ['|ψ⟩ vector', v2, setV2]].map(([label, val, setter], i) => (
          <div key={i}>
            <label className="text-xs text-slate-400 block mb-1">{label} (one component per line)</label>
            <textarea value={val} onChange={e => setter(e.target.value)} className="quantum-input" rows={4}
              style={{ fontFamily: 'JetBrains Mono', resize: 'vertical' }} />
          </div>
        ))}
      </div>

      {!valid && <div className="text-red-400 text-xs mb-3">Vectors must have equal dimensions</div>}

      {valid && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-2">Inner product ⟨φ|ψ⟩</div>
            <div className="p-4 bg-slate-900/60 rounded-lg border border-amber-500/20 text-center">
              <div className="text-2xl font-bold text-amber-400">{inner?.toFixed(4)}</div>
              <div className="text-xs text-slate-500 mt-1">
                {inner !== null && Math.abs(inner) < 0.001 ? '→ Orthogonal states' :
                 inner !== null && Math.abs(inner - 1) < 0.001 ? '→ Same state' :
                 inner !== null ? `→ |P|² = ${(inner * inner).toFixed(4)}` : ''}
              </div>
              {normA > 0 && normB > 0 && inner !== null && (
                <div className="text-xs text-slate-500 mt-1">
                  Cos angle: {(inner / (normA * normB)).toFixed(4)}
                </div>
              )}
            </div>
          </div>
          {outer && (
            <div>
              <div className="text-xs text-slate-400 mb-2">Outer product |ψ⟩⟨φ| ({outer.length}×{outer[0].length})</div>
              <MatrixDisplay matrix={outer} color="#f59e0b" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Calculators() {
  const [tab, setTab] = useState('matmul');

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-orbitron text-2xl font-bold neon-cyan mb-2">Interactive Calculators</h1>
        <p className="text-slate-400 text-sm">Step-by-step quantum math tools</p>
      </div>

      <div className="flex flex-wrap border-b border-slate-700/50 mb-6">
        {[
          ['matmul', 'Matrix Multiply'],
          ['tensor', '⊗ Tensor Product'],
          ['modulo', '% Modular Arithmetic'],
          ['innerout', '⟨|⟩ Inner/Outer Product'],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`tab-btn ${tab === id ? 'tab-active' : ''}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'matmul' && <MatMulCalc />}
      {tab === 'tensor' && <TensorCalc />}
      {tab === 'modulo' && <ModuloCalc />}
      {tab === 'innerout' && <InnerOuterCalc />}
    </div>
  );
}
