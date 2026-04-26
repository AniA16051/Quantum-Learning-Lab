import React, { useState } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Fundamentals from './components/Fundamentals';
import QuantumGates from './components/QuantumGates';
import BlochSphere from './components/BlochSphere';
import QuantumPrinciples from './components/QuantumPrinciples';
import PureMixedStates from './components/PureMixedStates';
import Calculators from './components/Calculators';
import Applications from './components/Applications';
import Credits from './components/Credits';
import CircuitBuilder from './components/CircuitBuilder';
import useStore from './store/useStore';

const sectionMap = {
  fundamentals: Fundamentals,
  gates: QuantumGates,
  circuit_builder: CircuitBuilder,
  bloch: BlochSphere,
  principles: QuantumPrinciples,
  states: PureMixedStates,
  calculators: Calculators,
  applications: Applications,
  credits: Credits,
};

function ParticleBackground() {
  return (
    <>
      {/* Animated glowing orbs */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full mix-blend-screen filter blur-[120px] bg-cyan-600/30 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full mix-blend-screen filter blur-[120px] bg-purple-600/30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full mix-blend-screen filter blur-[120px] bg-indigo-600/30 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Animated grid overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-[-40px] bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)] animate-grid-pan"></div>
      </div>
    </>
  );
}

export default function App() {
  const { activeSection, sidebarOpen, toggleSidebar } = useStore();
  const ActiveSection = sectionMap[activeSection] || Fundamentals;

  return (
    <div className="min-h-screen grid-bg relative" style={{ background: '#050a0e' }}>
      <ParticleBackground />

      {/* Mobile menu button */}
      <button
        className="fixed top-6 left-6 z-[60] p-3 rounded-xl glass-card md:hidden flex items-center justify-center group"
        onClick={toggleSidebar}
      >
        <div className="flex flex-col gap-1.5 transition-transform group-hover:scale-110">
          <div className="w-6 h-0.5 bg-cyan-400 rounded-full"></div>
          <div className="w-6 h-0.5 bg-cyan-400 rounded-full opacity-70"></div>
          <div className="w-4 h-0.5 bg-cyan-400 rounded-full"></div>
        </div>
      </button>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className={`main-content relative z-10 ${!sidebarOpen ? 'main-content-expanded' : ''}`}>
        <div className="max-w-[1400px] mx-auto w-full">
          <ActiveSection />
        </div>
      </main>
    </div>
  );
}
