import React, { useState } from 'react';
import { Math as Mth, StepDisplay } from './MathBlock';

// BB84 demo
function BB84Demo() {
  const [step, setStep] = useState(0);
  const [bits] = useState([0, 1, 1, 0, 1, 0, 0, 1]);
  const [aliceBases] = useState([0, 0, 1, 1, 0, 1, 0, 1]); // 0=Z, 1=X
  const [bobBases] = useState([0, 1, 1, 0, 0, 1, 1, 0]);

  const states = bits.map((bit, i) => {
    const base = aliceBases[i];
    if (base === 0) return bit === 0 ? '|0⟩' : '|1⟩';
    return bit === 0 ? '|+⟩' : '|-⟩';
  });

  const matching = aliceBases.map((a, i) => a === bobBases[i]);
  const key = bits.filter((_, i) => matching[i]);

  const phases = [
    { title: 'Alice prepares qubits', desc: 'Alice chooses random bits and random bases (Z or X), then prepares qubits.' },
    { title: 'Alice sends to Bob', desc: 'Alice sends the qubits through the quantum channel.' },
    { title: 'Bob measures', desc: 'Bob chooses random measurement bases for each qubit.' },
    { title: 'Basis comparison', desc: 'Alice and Bob publicly announce their bases (NOT the bits).' },
    { title: 'Sift the key', desc: 'Keep only bits where bases match. These form the secret key.' },
    { title: 'Error check', desc: 'Compare a subset of the key to detect eavesdroppers (Eve).' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {phases.map((p, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`p-3 rounded-lg border text-left transition-all ${
              step === i ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-400' : 'border-slate-700/40 text-slate-400 bg-slate-800/30 hover:bg-slate-700/30'
            }`}>
            <div className="text-xs font-bold">{i + 1}. {p.title}</div>
          </button>
        ))}
      </div>

      <div className="glass-card p-5 mb-4">
        <div className="text-cyan-400 font-bold mb-2">Phase {step + 1}: {phases[step].title}</div>
        <p className="text-slate-400 text-sm mb-4">{phases[step].desc}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="py-2 px-3 text-slate-400 text-left">Bit #</th>
                {bits.map((_, i) => (
                  <th key={i} className="py-2 px-3 text-slate-400 text-center">{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800/50">
                <td className="py-2 px-3 text-slate-400">Alice bit</td>
                {bits.map((b, i) => (
                  <td key={i} className="py-2 px-3 text-center text-cyan-300">{b}</td>
                ))}
              </tr>
              <tr className="border-b border-slate-800/50">
                <td className="py-2 px-3 text-slate-400">Alice basis</td>
                {aliceBases.map((b, i) => (
                  <td key={i} className="py-2 px-3 text-center text-purple-300">{b === 0 ? 'Z' : 'X'}</td>
                ))}
              </tr>
              {step >= 1 && (
                <tr className="border-b border-slate-800/50">
                  <td className="py-2 px-3 text-slate-400">Alice state</td>
                  {states.map((s, i) => (
                    <td key={i} className="py-2 px-3 text-center text-yellow-300">{s}</td>
                  ))}
                </tr>
              )}
              {step >= 2 && (
                <tr className="border-b border-slate-800/50">
                  <td className="py-2 px-3 text-slate-400">Bob basis</td>
                  {bobBases.map((b, i) => (
                    <td key={i} className="py-2 px-3 text-center text-indigo-300">{b === 0 ? 'Z' : 'X'}</td>
                  ))}
                </tr>
              )}
              {step >= 3 && (
                <tr className="border-b border-slate-800/50">
                  <td className="py-2 px-3 text-slate-400">Match?</td>
                  {matching.map((m, i) => (
                    <td key={i} className={`py-2 px-3 text-center ${m ? 'text-green-400' : 'text-red-400'}`}>{m ? 'Y' : 'N'}</td>
                  ))}
                </tr>
              )}
              {step >= 4 && (
                <tr>
                  <td className="py-2 px-3 text-slate-400">Key bit</td>
                  {bits.map((b, i) => (
                    <td key={i} className={`py-2 px-3 text-center font-bold ${matching[i] ? 'text-green-400' : 'text-slate-600'}`}>
                      {matching[i] ? b : '—'}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {step >= 4 && (
          <div className="mt-3 p-3 bg-green-900/20 rounded border border-green-500/20 text-sm">
            <span className="text-slate-400">Secret key: </span>
            <span className="text-green-400 font-bold">{key.join('')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Grover's algorithm visualization
function GroverViz() {
  const [n, setN] = useState(8);
  const [target, setTarget] = useState(5);
  const [iteration, setIteration] = useState(0);

  const optIter = Math.round(Math.PI / 4 * Math.sqrt(n));
  const states = Array.from({ length: n }, (_, i) => {
    const theta = (iteration / (optIter + 0.1)) * Math.PI / 2;
    if (i === target) {
      return Math.sin(theta + Math.asin(1 / Math.sqrt(n)));
    }
    return Math.cos(theta + Math.asin(1 / Math.sqrt(n))) / Math.sqrt(n - 1);
  });

  const maxAmp = Math.max(...states.map(Math.abs));

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Search space size (N)</label>
          <select className="quantum-input" value={n} onChange={e => { setN(parseInt(e.target.value)); setIteration(0); }}>
            {[4, 8, 16, 32].map(v => <option key={v} value={v}>{v} items</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Target index</label>
          <input type="number" className="quantum-input" value={target} min="0" max={n - 1}
            onChange={e => setTarget(Math.min(n-1, parseInt(e.target.value) || 0))} />
        </div>
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-slate-300">Iteration: <span className="text-cyan-400">{iteration}</span> / <span className="text-slate-500">{optIter} optimal</span></div>
          <div className="flex gap-2">
            <button className="btn-neon text-xs py-1 px-3" onClick={() => setIteration(Math.max(0, iteration - 1))}>← Back</button>
            <button className="btn-neon text-xs py-1 px-3" onClick={() => setIteration(Math.min(optIter + 2, iteration + 1))}>Next →</button>
          </div>
        </div>

        {/* Amplitude bars */}
        <div className="flex gap-1 items-end justify-center" style={{ height: '120px' }}>
          {states.map((amp, i) => {
            const absAmp = Math.abs(amp);
            const height = (absAmp / (maxAmp + 0.01)) * 100;
            const isTarget = i === target;
            return (
              <div key={i} className="flex flex-col items-center flex-1" style={{ maxWidth: '40px' }}>
                <div className="text-xs text-slate-500 mb-1" style={{ fontSize: '10px' }}>{amp.toFixed(2)}</div>
                <div
                  className="w-full rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${height}%`,
                    minHeight: '2px',
                    background: isTarget
                      ? 'linear-gradient(to top, #f59e0b, #fbbf24)'
                      : 'linear-gradient(to top, #22d3ee, #6366f1)',
                    boxShadow: isTarget ? '0 0 8px #f59e0b' : undefined,
                  }}
                ></div>
                <div className="text-xs mt-1" style={{ fontSize: '9px', color: isTarget ? '#f59e0b' : '#64748b' }}>
                  {i === target ? '*' : i}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex justify-between text-xs text-slate-500">
          <span>P(target) = <span className="text-yellow-400">{(states[target] ** 2 * 100).toFixed(1)}%</span></span>
          <span>Classical: <span className="text-red-400">{(100 / n).toFixed(1)}%</span></span>
          <span>Speedup: <span className="text-green-400">O(√N)</span></span>
        </div>
      </div>

      <StepDisplay steps={[
        { label: 'Initialize uniform superposition', latex: '|\\psi\\rangle = H^{\\otimes n}|0\\rangle^n = \\frac{1}{\\sqrt{N}}\\sum_{x=0}^{N-1}|x\\rangle' },
        { label: 'Oracle marks target', latex: 'O|x\\rangle = (-1)^{f(x)}|x\\rangle,\\quad f(x_0)=1' },
        { label: 'Diffusion operator (inversion about mean)', latex: 'D = 2|\\psi\\rangle\\langle\\psi| - I' },
        { label: 'Repeat √N times', latex: 'P(\\text{success}) \\approx 1 \\text{ after } \\frac{\\pi}{4}\\sqrt{N} \\text{ iterations}' },
      ]} />
    </div>
  );
}

// Quantum Teleportation
function TeleportationViz() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: '1. Prepare Bell pair',
      desc: 'Alice and Bob share a maximally entangled Bell pair |Φ⁺⟩.',
      circuit: '────[H]────●────\n           │\n────────────X────',
      latex: '|\\Phi^+\\rangle_{AB} = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}',
      note: 'Alice has qubit A, Bob has qubit B',
    },
    {
      title: '2. Alice has unknown qubit |ψ⟩',
      desc: 'Alice receives an unknown qubit |ψ⟩ = α|0⟩ + β|1⟩ that she wants to teleport to Bob.',
      latex: '|\\psi\\rangle_C \\otimes |\\Phi^+\\rangle_{AB} = \\frac{1}{\\sqrt{2}}(\\alpha|0\\rangle + \\beta|1\\rangle)(|00\\rangle + |11\\rangle)',
    },
    {
      title: '3. Alice applies CNOT + H',
      desc: 'Alice applies CNOT (C controls, A as target) then Hadamard on C.',
      latex: '(H \\otimes I) \\cdot CNOT_{CA} \\cdot |\\psi\\rangle_C|\\Phi^+\\rangle_{AB}',
    },
    {
      title: '4. Alice measures her qubits',
      desc: 'Alice measures her two qubits (C and A), getting 00, 01, 10, or 11.',
      latex: '\\frac{1}{2}[|00\\rangle(\\alpha|0\\rangle+\\beta|1\\rangle) + |01\\rangle(\\alpha|1\\rangle+\\beta|0\\rangle) + \\ldots]',
    },
    {
      title: '5. Classical communication',
      desc: 'Alice sends her 2 classical bits to Bob over a classical channel.',
      note: 'This is why teleportation does NOT send information faster than light!',
    },
    {
      title: '6. Bob applies corrections',
      desc: 'Bob applies X and/or Z gates based on Alice\'s bits to recover |ψ⟩.',
      latex: '\\text{If Alice got } \\begin{cases} 00 & \\text{Bob does nothing} \\\\ 01 & \\text{Bob applies X} \\\\ 10 & \\text{Bob applies Z} \\\\ 11 & \\text{Bob applies ZX} \\end{cases}',
      note: 'Bob\'s qubit is now in state |ψ⟩',
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`text-xs px-3 py-1 rounded border transition-all ${
              step === i ? 'border-indigo-400 text-indigo-400 bg-indigo-500/10' : 'border-slate-700 text-slate-400 bg-slate-800/30 hover:bg-slate-700/30'
            }`}>
            Step {i + 1}
          </button>
        ))}
      </div>

      <div className="glass-card p-5">
        <div className="text-indigo-400 font-bold mb-2">{steps[step].title}</div>
        <p className="text-slate-300 text-sm mb-4">{steps[step].desc}</p>
        {steps[step].latex && (
          <div className="bg-slate-900/60 rounded-lg p-3 border border-indigo-500/20 mb-3">
            <Mth block>{steps[step].latex}</Mth>
          </div>
        )}
        {steps[step].note && (
          <div className="p-3 bg-indigo-900/20 rounded border border-indigo-500/20 text-xs text-indigo-300">
            {steps[step].note}
          </div>
        )}
      </div>
    </div>
  );
}

// Shor's Algorithm
function ShorDemo() {
  const [N, setN] = useState(15);
  const [a, setA] = useState(7);

  const factor = (N) => {
    for (let i = 2; i <= Math.sqrt(N); i++) if (N % i === 0) return [i, N / i];
    return null;
  };

  const factors = factor(N);
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);

  // Find period
  const findPeriod = (a, N) => {
    let val = a % N;
    for (let r = 1; r <= N; r++) {
      if (val === 1) return r;
      val = (val * (a % N)) % N;
    }
    return null;
  };

  const r = findPeriod(a, N);
  const candidate1 = r && r % 2 === 0 ? gcd(Math.pow(a, r / 2) - 1, N) : null;
  const candidate2 = r && r % 2 === 0 ? gcd(Math.pow(a, r / 2) + 1, N) : null;

  const shorSteps = [
    { label: '1. Input: N (number to factor)', text: `N = ${N}` },
    { label: '2. Choose random a coprime to N', text: `a = ${a}, gcd(${a}, ${N}) = ${gcd(a, N)}` },
    { label: '3. QFT finds period r of aˣ mod N', text: r ? `Period r = ${r}` : 'No even period found' },
    { label: '4. Compute factors using period', latex: r && r % 2 === 0
      ? `\\gcd(a^{r/2} \\pm 1, N) = \\gcd(${a}^{${r}/2}\\pm 1, ${N})`
      : `r = ${r} (odd — retry with different a)` },
    { label: '5. Result', text: candidate1 && candidate1 > 1 && candidate1 < N
      ? `Factors: ${candidate1} × ${candidate2 || N/candidate1} = ${N}`
      : factors ? `Factors: ${factors[0]} × ${factors[1]} = ${N}` : 'N is prime' },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">N to factor</label>
          <select className="quantum-input" value={N} onChange={e => setN(parseInt(e.target.value))}>
            {[15, 21, 35, 77, 91].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Base a (coprime to N)</label>
          <input type="number" className="quantum-input" value={a} min="2" max={N-1}
            onChange={e => setA(parseInt(e.target.value) || 2)} />
        </div>
      </div>

      <div className="glass-card p-5 mb-4">
        <div className="text-amber-400 font-bold mb-3">Classical vs Quantum</div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-red-900/20 rounded border border-red-500/20">
            <div className="text-red-400 font-bold mb-1">Classical (Trial Division)</div>
            <div className="text-slate-300">Time: O(√N)</div>
            <div className="text-slate-300">For RSA-2048: <span className="text-red-400">10²⁰ operations</span></div>
          </div>
          <div className="p-3 bg-green-900/20 rounded border border-green-500/20">
            <div className="text-green-400 font-bold mb-1">Quantum (Shor's)</div>
            <div className="text-slate-300">Time: O((log N)³)</div>
            <div className="text-slate-300">For RSA-2048: <span className="text-green-400">feasible</span></div>
          </div>
        </div>
      </div>

      <StepDisplay steps={shorSteps} />
    </div>
  );
}

export default function Applications() {
  const [tab, setTab] = useState('bb84');

  const apps = [
    { id: 'bb84', label: 'BB84 Cryptography' },
    { id: 'grover', label: "Grover's Search" },
    { id: 'teleport', label: 'Teleportation' },
    { id: 'shor', label: "Shor's Algorithm" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-orbitron text-2xl font-bold neon-cyan mb-2">Live Applications</h1>
        <p className="text-slate-400 text-sm">Real-world quantum computing demonstrations</p>
      </div>

      <div className="flex flex-wrap border-b border-slate-700/50 mb-6">
        {apps.map(a => (
          <button key={a.id} onClick={() => setTab(a.id)}
            className={`tab-btn ${tab === a.id ? 'tab-active' : ''}`}>
            {a.label}
          </button>
        ))}
      </div>

      {tab === 'bb84' && (
        <div>
          <div className="glass-card-purple p-5 mb-4">
            <div className="text-purple-400 font-bold mb-2">BB84 Quantum Key Distribution</div>
            <p className="text-slate-400 text-sm">The first quantum cryptography protocol (Bennett & Brassard, 1984). Guarantees information-theoretic security based on the laws of quantum mechanics.</p>
          </div>
          <BB84Demo />
        </div>
      )}

      {tab === 'grover' && (
        <div>
          <div className="glass-card p-5 mb-4">
            <div className="text-cyan-400 font-bold mb-2">Grover's Search Algorithm</div>
            <p className="text-slate-400 text-sm">Searches an unsorted database of N items in O(√N) time, vs O(N) classically. Uses amplitude amplification to boost the target state's probability.</p>
          </div>
          <GroverViz />
        </div>
      )}

      {tab === 'teleport' && (
        <div>
          <div className="glass-card p-5 mb-4">
            <div className="text-indigo-400 font-bold mb-2">Quantum Teleportation</div>
            <p className="text-slate-400 text-sm">Transmits an unknown quantum state using entanglement + 2 classical bits. The state is "teleported" without traversing the space in between.</p>
          </div>
          <TeleportationViz />
        </div>
      )}

      {tab === 'shor' && (
        <div>
          <div className="glass-card p-5 mb-4">
            <div className="text-amber-400 font-bold mb-2">Shor's Factoring Algorithm</div>
            <p className="text-slate-400 text-sm">Factors large integers exponentially faster than classical algorithms using the Quantum Fourier Transform (QFT). Threatens current RSA encryption.</p>
          </div>
          <ShorDemo />
        </div>
      )}
    </div>
  );
}
