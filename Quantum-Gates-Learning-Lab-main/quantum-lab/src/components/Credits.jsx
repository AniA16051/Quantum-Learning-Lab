import React from 'react';
import { Math as Mth } from './MathBlock';

export default function Credits() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="text-center py-12">
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 mx-auto rounded-full border-2 border-cyan-400/40 flex items-center justify-center" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)' }}>
            <span className="text-5xl animate-float font-orbitron text-cyan-400">Q</span>
          </div>
          <div className="absolute -inset-2 rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: '10s' }}></div>
          <div className="absolute -inset-4 rounded-full border border-purple-500/10 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
        </div>

        <h1 className="font-orbitron text-4xl font-black neon-cyan mb-2">QUANTUM LAB</h1>
        <p className="text-slate-400 text-lg mb-1">Interactive Quantum Computing Learning Platform</p>
        <div className="text-xs text-slate-600 mt-2">v1.0.0 — 2024</div>
      </div>

      {/* Developed by */}
      <div className="max-w-2xl mx-auto w-full px-4 mb-8">
        <div className="glass-card p-8 glow-cyan text-center">
          <div className="text-xs text-cyan-400/60 font-orbitron tracking-widest mb-4">DEVELOPED BY</div>

          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-r from-cyan-900/20 to-transparent rounded-xl border border-cyan-500/20">
              <div className="text-2xl font-bold neon-cyan font-orbitron mb-1">Anirudh Ashok</div>
              <div className="text-slate-400 text-sm font-mono">RA2411003010128</div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-500/30"></div>
              <span className="text-purple-400 text-sm">+</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-500/30"></div>
            </div>

            <div className="p-5 bg-gradient-to-r from-purple-900/20 to-transparent rounded-xl border border-purple-500/20">
              <div className="text-2xl font-bold neon-purple font-orbitron mb-1">Nakul Joshi</div>
              <div className="text-slate-400 text-sm font-mono">RA2411003010099</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech stack */}
      <div className="max-w-4xl mx-auto w-full px-4 mb-8">
        <div className="text-center text-xs font-orbitron text-slate-500 tracking-widest mb-4">BUILT WITH</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'React.js', desc: 'UI Framework', color: '#22d3ee', icon: 'Re' },
            { name: 'Three.js', desc: 'Bloch Sphere 3D', color: '#c084fc', icon: '3D' },
            { name: 'Tailwind CSS', desc: 'Styling', color: '#6366f1', icon: 'TW' },
            { name: 'KaTeX', desc: 'Math Rendering', color: '#f59e0b', icon: '∑' },
            { name: 'Zustand', desc: 'State Management', color: '#10b981', icon: 'Zs' },
            { name: 'Vite', desc: 'Build Tool', color: '#f472b6', icon: 'Vt' },
            { name: 'D3.js', desc: 'Data Visualization', color: '#fb923c', icon: 'D3' },
            { name: 'React KaTeX', desc: 'Math Components', color: '#94a3b8', icon: 'Kx' },
          ].map((t, i) => (
            <div key={i} className="glass-card p-3 text-center hover:-translate-y-1 transition-transform">
              <div className="text-2xl mb-1">{t.icon}</div>
              <div className="text-sm font-bold" style={{ color: t.color }}>{t.name}</div>
              <div className="text-xs text-slate-500 mt-1">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto w-full px-4 mb-8">
        <div className="text-center text-xs font-orbitron text-slate-500 tracking-widest mb-4">FEATURES</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: 'I', title: 'Quantum Fundamentals', desc: 'Ket/bra notation, inner/outer products, tensor products with interactive calculators' },
            { icon: 'II', title: 'Quantum Gates', desc: '7 single-qubit + 5 multi-qubit gates with matrix representations and truth tables' },
            { icon: 'III', title: 'Bloch Sphere', desc: 'Interactive 3D visualization with real-time gate animations and state parameterization' },
            { icon: 'IV', title: 'Quantum Principles', desc: 'Superposition waves, Bell states entanglement, and the 4 postulates of QM' },
            { icon: 'V', title: 'Pure vs Mixed States', desc: 'Density matrix visualization with Bloch sphere comparison and purity calculation' },
            { icon: 'VI', title: 'Interactive Calculators', desc: 'Matrix multiply, tensor products, modular arithmetic, inner/outer product tools' },
            { icon: 'VII', title: 'Live Applications', desc: 'BB84 cryptography, Grover\'s search, quantum teleportation, Shor\'s algorithm' },
            { icon: 'VIII', title: 'LaTeX Math', desc: 'Every equation rendered with KaTeX, including step-by-step derivations' },
          ].map((f, i) => (
            <div key={i} className="glass-card p-4 flex gap-3 hover:border-cyan-500/30 transition-colors">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <div className="text-sm font-bold text-slate-200">{f.title}</div>
                <div className="text-xs text-slate-500 mt-1">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quantum quote */}
      <div className="max-w-2xl mx-auto w-full px-4 mb-12">
        <div className="glass-card-purple p-6 text-center">
          <div className="text-xs text-purple-400/60 mb-3">— FEYNMAN, 1981</div>
          <blockquote className="text-slate-300 text-sm italic leading-relaxed">
            "Nature isn't classical, dammit, and if you want to make a simulation of nature, you'd better make it quantum mechanical."
          </blockquote>
          <div className="mt-4 text-center">
            <Mth>{'|\\psi\\rangle = \\frac{1}{\\sqrt{2}}\\left(|0\\rangle + |1\\rangle\\right)'}</Mth>
          </div>
        </div>
      </div>
    </div>
  );
}
