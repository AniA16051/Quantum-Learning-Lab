import React from 'react';
import useStore from '../store/useStore';

const sections = [
  { id: 'fundamentals', label: 'Fundamentals' },
  { id: 'gates', label: 'Quantum Gates' },
  { id: 'circuit_builder', label: 'Circuit Builder' },
  { id: 'bloch', label: 'Bloch Sphere' },
  { id: 'principles', label: 'Quantum Principles' },
  { id: 'states', label: 'Pure vs Mixed States' },
  { id: 'calculators', label: 'Calculators' },
  { id: 'applications', label: 'Live Applications' },
  { id: 'credits', label: 'Credits' },
];

export default function Sidebar() {
  const { activeSection, setActiveSection, sidebarOpen, toggleSidebar } = useStore();

  return (
    <aside className={`sidebar ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
      {/* Header / Logo */}
      <div className="p-6 flex items-center justify-between">
        {sidebarOpen && (
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-orbitron text-cyan-400 font-bold">Q</div>
             <div className="font-orbitron text-sm font-bold tracking-wider text-slate-200">QUANTUM LAB</div>
          </div>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-cyan-400"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {sidebarOpen ? <path d="M19 12H5M12 19l-7-7 7-7"/> : <path d="M5 12h14M12 5l7 7-7 7"/>}
          </svg>
        </button>
      </div>

      {!sidebarOpen && (
        <div className="flex justify-center py-2">
           <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-orbitron text-cyan-400 font-bold text-lg">Q</div>
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-4 px-3">
        {sections.map((s) => (
          <button
            key={s.id}
            className={`sidebar-item w-full transition-all duration-300 ${activeSection === s.id ? 'sidebar-active click-pop' : 'hover:translate-x-1'} ${!sidebarOpen ? 'justify-center px-0' : ''}`}
            onClick={() => setActiveSection(s.id)}
            title={!sidebarOpen ? s.label : ''}
          >
            {sidebarOpen ? (
              <span className="truncate">{s.label}</span>
            ) : (
              <span className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">
                {s.label.substring(0, 2)}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {sidebarOpen && (
        <div className="absolute bottom-6 left-6 right-6">
          <div className="glass-card p-3 bg-white/5 border-white/5">
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 text-center">Version 1.0</div>
          </div>
        </div>
      )}
    </aside>
  );
}
