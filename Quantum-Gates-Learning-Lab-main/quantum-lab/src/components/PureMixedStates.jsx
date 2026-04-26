import React, { useState, useRef, useEffect } from 'react';
import { Math as Mth, StepDisplay } from './MathBlock';

function DensityMatrixViz({ rho, label, color }) {
  const max = Math.max(...rho.flat().map(Math.abs), 0.01);
  return (
    <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-700/50">
      <div className="text-xs text-slate-400 mb-3">{label}</div>
      <div className="grid grid-cols-2 gap-1">
        {rho.map((row, i) => row.map((cell, j) => {
          const abs = Math.abs(cell);
          const intensity = abs / max;
          return (
            <div key={`${i}${j}`}
              className="h-12 rounded flex flex-col items-center justify-center border text-xs transition-all duration-500"
              style={{
                background: `${color}${Math.round(intensity * 0x44).toString(16).padStart(2,'0')}`,
                borderColor: `${color}${Math.round(intensity * 0x88).toString(16).padStart(2,'0')}`,
              }}>
              <span className="text-slate-400 text-xs" style={{ fontSize: '9px' }}>ρ_{i}{j}</span>
              <span style={{ color }} className="font-bold">{cell.toFixed(2)}</span>
            </div>
          );
        }))}
      </div>
      <div className="mt-2 text-xs text-center text-slate-500">
        Tr(ρ²) = {rho.map((r,i) => r.map((c,j) => rho[i].reduce((sum, v, k) => sum + v * rho[k][j], 0)).reduce((s,v) => s+v, 0)).reduce((s,v) => s+v, 0).toFixed(3)}
      </div>
    </div>
  );
}

function BlochPointViz({ points, title }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const r = Math.min(W, H) / 2 - 20;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // Sphere circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#22d3ee22';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Equator ellipse
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * 0.3, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#22d3ee15';
    ctx.stroke();

    // Axes
    ctx.strokeStyle = '#22d3ee44';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#22d3ee88';
    ctx.font = '11px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText('|0⟩', cx, cy - r - 5);
    ctx.fillText('|1⟩', cx, cy + r + 15);
    ctx.fillText('|+⟩', cx + r + 5, cy + 4);

    // Points
    points.forEach(({ x, y, z, color, size = 5 }) => {
      // Project 3D to 2D (isometric-ish)
      const px = cx + (x * 0.8 - z * 0.4) * r;
      const py = cy - y * r;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, [points]);

  return (
    <div>
      <div className="text-xs text-slate-400 mb-2">{title}</div>
      <canvas ref={canvasRef} width={200} height={200} className="rounded-lg border border-slate-700/50" />
    </div>
  );
}

export default function PureMixedStates() {
  const [p0, setP0] = useState(70); // probability of |0⟩
  const p1 = 100 - p0;

  const alpha = Math.sqrt(p0 / 100);
  const beta = Math.sqrt(p1 / 100);

  // Pure state density matrix: |ψ⟩⟨ψ|
  const pureDM = [
    [alpha * alpha, alpha * beta],
    [alpha * beta, beta * beta],
  ];

  // Mixed state density matrix: p₀|0⟩⟨0| + p₁|1⟩⟨1|
  const mixedDM = [
    [p0 / 100, 0],
    [0, p1 / 100],
  ];

  const trRho2Pure = pureDM.map((r, i) =>
    r.map((_, j) => pureDM[i].reduce((s, v, k) => s + v * pureDM[k][j], 0))
  ).reduce((s, r) => s + r.reduce((ss, v) => ss + v, 0), 0);

  const trRho2Mixed = mixedDM.map((r, i) =>
    r.map((_, j) => mixedDM[i].reduce((s, v, k) => s + v * mixedDM[k][j], 0))
  ).reduce((s, r) => s + r.reduce((ss, v) => ss + v, 0), 0);

  // Bloch vector for pure state: (2Re(ρ₀₁), 2Im(ρ₀₁), ρ₀₀ - ρ₁₁)
  const blochPure = {
    x: 2 * pureDM[0][1], y: 0, z: pureDM[0][0] - pureDM[1][1],
    color: '#22d3ee', size: 7,
  };

  // Bloch vector for mixed state (always inside sphere for non-pure)
  const mixedRadius = Math.sqrt(
    (mixedDM[0][0] - 0.5) ** 2 * 4
  );
  const blochMixed = {
    x: 0, y: 0, z: mixedDM[0][0] - mixedDM[1][1],
    color: '#f59e0b', size: 7,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-orbitron text-2xl font-bold neon-cyan mb-2">Pure vs Mixed States</h1>
        <p className="text-slate-400 text-sm">Density matrix representation and Bloch sphere visualization</p>
      </div>

      {/* Interactive slider component - Full Width */}
      <div className="glass-card p-10 mb-8 border-b-4 border-cyan-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-1">State Ensemble Control</div>
            <div className="text-slate-500 text-xs">Adjust the classical probability distribution between ground and excited states.</div>
          </div>
          <div className="flex gap-4">
             <div className="px-4 py-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400 font-orbitron font-bold">P₀: {p0}%</div>
             <div className="px-4 py-2 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400 font-orbitron font-bold">P₁: {p1}%</div>
          </div>
        </div>
        <div className="relative h-2 bg-white/5 rounded-full mb-10 overflow-hidden">
           <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300" style={{ width: '100%' }}></div>
           <input type="range" min="1" max="99" value={p0}
            onChange={e => setP0(parseInt(e.target.value))}
            className="absolute top-1/2 -translate-y-1/2 left-0 w-full opacity-0 cursor-pointer h-8 z-10" />
           <div className="absolute top-1/2 -translate-y-1/2 h-6 w-6 bg-white rounded-full border-4 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)] pointer-events-none transition-all duration-300" style={{ left: `calc(${p0}% - 12px)` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
        {/* Pure state Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="glass-card p-8 flex-1 flex flex-col border-t-2 border-cyan-500/30">
            <div className="flex items-center justify-between mb-6">
               <div className="text-cyan-400 font-bold text-xl tracking-tight">Quantum Purity</div>
               <div className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-lg uppercase">Surface State</div>
            </div>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">A perfectly isolated quantum system with zero decoherence. The state is represented by a single vector in Hilbert space.</p>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-8 shadow-inner">
              <Mth block>{`|\\psi\\rangle = ${alpha.toFixed(3)}|0\\rangle + ${beta.toFixed(3)}|1\\rangle`}</Mth>
            </div>
            <div className="flex-1">
               <DensityMatrixViz rho={pureDM} label="Projector ρ = |ψ⟩⟨ψ|" color="#22d3ee" />
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Rank</div>
                  <div className="text-white font-orbitron text-lg">1</div>
               </div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Purity (Tr ρ²)</div>
                  <div className="text-cyan-400 font-orbitron text-lg">{trRho2Pure.toFixed(3)}</div>
               </div>
            </div>
          </div>
          <div className="glass-card p-8 flex flex-col items-center justify-center">
            <BlochPointViz points={[blochPure]} title="Topological Mapping (Pure)" />
            <div className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Definite Bloch Phase</div>
          </div>
        </div>

        {/* Mixed state Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="glass-card p-8 flex-1 flex flex-col border-t-2 border-amber-500/30">
            <div className="flex items-center justify-between mb-6">
               <div className="text-amber-400 font-bold text-xl tracking-tight">Statistical Mixture</div>
               <div className="px-3 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-lg uppercase">Interior State</div>
            </div>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">Represents uncertain knowledge or entanglement with an environment. Described as an ensemble of pure states.</p>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-8 shadow-inner">
              <Mth block>{`\\rho = ${(p0/100).toFixed(3)}|0\\rangle\\langle 0| + ${(p1/100).toFixed(3)}|1\\rangle\\langle 1|`}</Mth>
            </div>
            <div className="flex-1">
               <DensityMatrixViz rho={mixedDM} label="Mixture ρ = Σ pᵢ|ψᵢ⟩⟨ψᵢ|" color="#f59e0b" />
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Entropy</div>
                  <div className="text-white font-orbitron text-lg">{"> 0"}</div>
               </div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Purity (Tr ρ²)</div>
                  <div className="text-amber-400 font-orbitron text-lg">{trRho2Mixed.toFixed(3)}</div>
               </div>
            </div>
          </div>
          <div className="glass-card p-8 flex flex-col items-center justify-center">
            <BlochPointViz points={[blochMixed]} title="Topological Mapping (Mixed)" />
            <div className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Uncertain Bloch Magnitude</div>
          </div>
        </div>
      </div>

      {/* Comparison table + math - Full Width Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6">
          <div className="glass-card p-10 flex-1">
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-8">Structural Comparative Analysis</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-white/5">
                    <th className="text-left py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Characteristic</th>
                    <th className="text-center py-4 text-cyan-400 font-bold text-xs uppercase">Quantum Pure</th>
                    <th className="text-center py-4 text-amber-400 font-bold text-xs uppercase">Statistical Mixed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ['Physical Interpretation', 'Isolated System', 'Environmental Interaction'],
                    ['Mathematical Obj', 'Vector |ψ⟩', 'Operator ρ'],
                    ['Purity Tr(ρ²)', 'Identically 1', 'Less than 1'],
                    ['Bloch Geometries', 'Sphere Surface', 'Sphere Interior'],
                    ['Von Neumann Entropy', 'Stable Zero', 'Non-Zero Growth'],
                  ].map(([prop, pure, mixed], i) => (
                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                      <td className="py-5 text-slate-400 font-medium">{prop}</td>
                      <td className="py-5 text-center text-cyan-200/80">{pure}</td>
                      <td className="py-5 text-center text-amber-200/80">{mixed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
          <div className="glass-card p-10 flex-1">
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-8">Formalist Framework</div>
            <div className="flex-1 flex flex-col justify-center">
               <StepDisplay steps={[
                { label: 'Density Operator', latex: '\\rho = \\sum p_i |\\psi_i\\rangle\\langle\\psi_i|' },
                { label: 'Condition for Purity', latex: '\\rho^2 = \\rho \\implies \\text{Purity} = 1' },
                { label: 'Entropy Definition', latex: 'S(\\rho) = -\\text{Tr}(\\rho \\ln \\rho)' },
                { label: 'Total Disorder', latex: '\\rho_{mix} = \\frac{1}{d} I' },
              ]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
