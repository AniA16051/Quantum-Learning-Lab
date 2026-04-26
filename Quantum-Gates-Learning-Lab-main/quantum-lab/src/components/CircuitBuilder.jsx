import React, { useState, useEffect } from 'react';
import { GATES, MULTI_GATES, simulateCircuitState, generateStateLabels } from '../utils/quantum';

const MAX_QUBITS = 3;
const MAX_MOMENTS = 10;

export default function CircuitBuilder() {
  const [numQubits, setNumQubits] = useState(3);
  // Grid format: grid[qubit_index][moment_index] = { gate: 'H', ... } | null
  const [grid, setGrid] = useState(
    Array(MAX_QUBITS).fill(null).map(() => Array(MAX_MOMENTS).fill(null))
  );

  const [draggedGate, setDraggedGate] = useState(null);
  
  // Simulation results
  const [simulation, setSimulation] = useState({ state: [], probabilities: [] });

  useEffect(() => {
    runSimulation();
  }, [grid, numQubits]);

  const runSimulation = () => {
    // Pass current grid to the engine
    const { state, probabilities } = simulateCircuitState(numQubits, grid);
    setSimulation({ state, probabilities });
  };

  const handleDragStart = (e, gateSymbol, isMulti = false) => {
    e.dataTransfer.setData('gateSymbol', gateSymbol);
    e.dataTransfer.setData('isMulti', isMulti);
    setDraggedGate({ symbol: gateSymbol, isMulti });
  };

  const handleDrop = (e, q, m) => {
    e.preventDefault();
    const symbol = e.dataTransfer.getData('gateSymbol');
    const isMulti = e.dataTransfer.getData('isMulti') === 'true';

    setGrid(prev => {
      const newGrid = prev.map(row => [...row]);
      
      if (isMulti) {
        // Find a control qubit (default to row 0 if we are on row 1, etc)
        let control = q === 0 ? 1 : 0;
        newGrid[q][m] = { gate: symbol, control };
        // Clear any overlapping gate on the control slot to make way for the line
        newGrid[control][m] = null;
      } else {
        newGrid[q][m] = { gate: symbol };
      }
      return newGrid;
    });
    setDraggedGate(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeGate = (q, m) => {
    setGrid(prev => {
      const newGrid = prev.map(row => [...row]);
      newGrid[q][m] = null;
      return newGrid;
    });
  };

  const toggleControl = (q, m) => {
      setGrid(prev => {
          const newGrid = prev.map(row => [...row]);
          const gate = newGrid[q][m];
          if (gate && (gate.gate === 'CNOT' || gate.gate === 'CZ')) {
              // cycle through available control qubits
              let nextControl = (gate.control + 1) % numQubits;
              if (nextControl === q) nextControl = (nextControl + 1) % numQubits;
              newGrid[q][m] = { ...gate, control: nextControl };
          }
          return newGrid;
      });
  }

  const clearCircuit = () => {
    setGrid(Array(MAX_QUBITS).fill(null).map(() => Array(MAX_MOMENTS).fill(null)));
  };

  const optimizeCircuit = () => {
    setGrid(prev => {
      const newGrid = prev.map(row => [...row]);

      // Simple optimization: cancel adjacent self-inverse gates horizontally
      for (let q = 0; q < numQubits; q++) {
        for (let m = 0; m < MAX_MOMENTS - 1; m++) {
          const g1 = newGrid[q][m];
          if (g1 && !g1.control && ["H", "X", "Y", "Z"].includes(g1.gate)) {
              // Find next gate in this wire
              let nextM = m + 1;
              while (nextM < MAX_MOMENTS && !newGrid[q][nextM]) nextM++;
              
              if (nextM < MAX_MOMENTS) {
                  const g2 = newGrid[q][nextM];
                  if (g2 && g1.gate === g2.gate && !g2.control) {
                      // Cancel them
                      newGrid[q][m] = null;
                      newGrid[q][nextM] = null;
                  }
              }
          }
        }
      }

      // Compact circuit (shift left)
      for (let q = 0; q < numQubits; q++) {
          let writeIdx = 0;
          for (let m = 0; m < MAX_MOMENTS; m++) {
              if (newGrid[q][m]) {
                  if (writeIdx !== m) {
                      newGrid[q][writeIdx] = newGrid[q][m];
                      newGrid[q][m] = null;
                  }
                  writeIdx++;
              }
          }
      }

      return newGrid;
    });
  };

  // Metrics calculation
  let gateCount = 0;
  let maxDepth = 0;
  for (let m = 0; m < MAX_MOMENTS; m++) {
      let activeInCol = false;
      for (let q = 0; q < numQubits; q++) {
          if (grid[q][m]) {
              gateCount++;
              activeInCol = true;
          }
      }
      if (activeInCol) maxDepth = m + 1;
  }

  const stateLabels = generateStateLabels(numQubits);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-orbitron neon-cyan mb-2">Circuit Builder</h1>
        <p className="text-slate-400 max-w-2xl">
          Construct custom quantum circuits using drag-and-drop. Analyze probabilities, check depth, and use the optimizer to automatically reduce redundancies.
        </p>
      </header>

      {/* Metrics & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-orbitron font-bold">Circuit Width</div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-cyan-400 font-orbitron">{numQubits}Q</span>
            <div className="flex gap-1">
              <button onClick={() => setNumQubits(Math.max(1, numQubits - 1))} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-lg hover:bg-white/10 transition click-pop">-</button>
              <button onClick={() => setNumQubits(Math.min(MAX_QUBITS, numQubits + 1))} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-lg hover:bg-white/10 transition click-pop">+</button>
            </div>
          </div>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-orbitron font-bold">Circuit Depth</div>
          <div className="text-3xl font-bold text-purple-400 font-orbitron">{maxDepth}</div>
        </div>
        <div className="glass-card p-5 rounded-2xl">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-orbitron font-bold">Total Gates</div>
          <div className="text-3xl font-bold text-emerald-400 font-orbitron">{gateCount}</div>
        </div>
        <div className="glass-card p-5 rounded-2xl flex flex-col gap-2 justify-center">
          <button onClick={optimizeCircuit} className="w-full py-2 bg-gradient-to-r from-cyan-600/80 to-purple-600/80 rounded-xl text-xs font-bold text-white hover:scale-105 transition click-pop border border-white/10">
            OPTIMIZE
          </button>
          <button onClick={clearCircuit} className="w-full py-1.5 bg-white/5 rounded-xl text-[10px] uppercase font-bold text-slate-400 hover:text-white transition click-pop">
            CLEAR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gate Palette */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-5">
          <h2 className="text-sm font-orbitron font-bold text-slate-300 mb-5 border-b border-white/5 pb-3 tracking-widest uppercase">Toolbox</h2>
          
          <div className="mb-6">
            <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-tighter">Single Qubit</h3>
            <div className="grid grid-cols-3 gap-2">
              {['H', 'X', 'Y', 'Z', 'S', 'T'].map(symbol => (
                <div
                  key={symbol}
                  draggable
                  onDragStart={(e) => handleDragStart(e, symbol, false)}
                  className="h-10 flex flex-col items-center justify-center rounded-xl bg-white/5 border border-white/5 cursor-grab hover:bg-white/10 hover:border-white/20 active:cursor-grabbing transition click-pop"
                  style={{ borderBottom: `2px solid ${GATES[symbol].color}66` }}
                >
                  <span className="font-orbitron font-bold text-white text-xs">{symbol}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-tighter">Multi Qubit</h3>
            <div className="grid grid-cols-2 gap-2">
              {['CNOT', 'CZ'].map(symbol => (
                <div
                  key={symbol}
                  draggable
                  onDragStart={(e) => handleDragStart(e, symbol, true)}
                  className="h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 cursor-grab hover:bg-white/10 hover:border-white/20 active:cursor-grabbing transition click-pop"
                  style={{ borderBottom: `2px solid ${MULTI_GATES[symbol].color}66` }}
                >
                  <span className="font-orbitron font-bold text-[9px] text-white tracking-tighter">{MULTI_GATES[symbol].name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Circuit Canvas */}
        <div className="lg:col-span-9 glass-card rounded-xl border border-slate-700/50 p-6 overflow-x-auto">
          <h2 className="text-lg font-orbitron text-white mb-6">Composer Grid</h2>
          
          <div className="relative min-w-[600px]" style={{ height: `${numQubits * 60 + 20}px` }}>
            {Array.from({ length: numQubits }).map((_, q) => (
              <div key={q} className="absolute w-full h-[60px] flex items-center" style={{ top: `${q * 60}px` }}>
                {/* Qubit Label */}
                <div className="w-12 shrink-0 font-orbitron text-sm text-cyan-400">
                  |q_{q}⟩
                </div>
                
                {/* The Wire */}
                <div className="absolute left-10 right-0 h-0.5 bg-slate-700 z-0"></div>

                {/* Drop Zones */}
                <div className="flex-1 flex px-2 relative z-10 space-x-2">
                  {Array.from({ length: MAX_MOMENTS }).map((_, m) => {
                    const cell = grid[q][m];
                    const isControl = grid.findIndex((row, idx) => idx !== q && row[m] && row[m].control === q) !== -1;
                    
                    return (
                      <div
                        key={m}
                        onDrop={(e) => handleDrop(e, q, m)}
                        onDragOver={handleDragOver}
                        onClick={() => {
                            if (cell) {
                                if (cell.gate === 'CNOT' || cell.gate === 'CZ') toggleControl(q, m);
                                else removeGate(q, m);
                            }
                        }}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            removeGate(q, m);
                        }}
                        className={`w-12 h-12 shrink-0 flex items-center justify-center relative cursor-pointer
                          ${!cell && !isControl ? 'border border-dashed border-slate-600/50 hover:bg-slate-800' : ''}
                          ${cell ? 'bg-slate-800 border shadow-lg' : ''}
                        `}
                        style={{
                          borderColor: cell ? (GATES[cell.gate]?.color || MULTI_GATES[cell.gate]?.color || '#fff') : undefined
                        }}
                      >
                        {/* Control Dot Logic */}
                        {isControl && !cell && (
                            <div className="w-3 h-3 bg-cyan-400 rounded-full z-20"></div>
                        )}

                        {/* Gate Render */}
                        {cell && (
                          <span className="font-orbitron font-bold text-sm text-white z-20 select-none">
                            {cell.gate === 'CNOT' ? '⊕' : cell.gate === 'CZ' ? 'Z' : cell.gate}
                          </span>
                        )}

                        {/* Vertical connection line for multi qubit gate */}
                        {cell && cell.control !== undefined && (
                          <div className="absolute left-[23px] w-0.5 bg-cyan-500/50 z-0"
                            style={{
                              top: cell.control > q ? '24px' : `${(cell.control - q) * 60 + 24}px`,
                              height: `${Math.abs(cell.control - q) * 60}px`
                            }}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Output Simulation Panel */}
      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-orbitron text-white">System Wavefunction</h2>
          <div className="px-4 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] text-cyan-400 font-bold tracking-widest uppercase">Live Simulation</div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col justify-center">
            <h3 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest">Theoretical Framework</h3>
            <ul className="text-xs text-slate-300 space-y-4">
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">1.</span>
                <span>Circuit starts in the ground state <code className="bg-black/40 px-1.5 py-0.5 rounded text-cyan-400">|{"0".repeat(numQubits)}⟩</code>.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">2.</span>
                <span>Columnar transformations apply unitary matrices to the current state vector.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-bold">3.</span>
                <span>Measurement probability <code className="bg-black/40 px-1.5 py-0.5 rounded text-purple-400">P(x)</code> is the absolute square of the amplitude.</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
             <h3 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest">Amplitudes (α, β)</h3>
             <div className="max-height-[240px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
               {simulation.state.map((amp, i) => {
                 const prob = simulation.probabilities[i];
                 if (prob < 0.0001 && simulation.probabilities.some(p => p > 0.01)) return null; 
                 
                 let cStr = "0";
                 if (Math.abs(amp.r) > 0.001 && Math.abs(amp.i) > 0.001) cStr = `${amp.r.toFixed(3)} ${amp.i >= 0 ? '+' : '-'} ${Math.abs(amp.i).toFixed(3)}i`;
                 else if (Math.abs(amp.r) > 0.001) cStr = `${amp.r.toFixed(3)}`;
                 else if (Math.abs(amp.i) > 0.001) cStr = `${amp.i.toFixed(3)}i`;

                 return (
                   <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 group">
                     <span className="text-purple-400 font-orbitron font-bold text-sm tracking-tighter transition-transform group-hover:scale-110">{stateLabels[i]}</span>
                     <span className="text-slate-400 font-mono text-xs bg-black/20 px-3 py-1 rounded-lg border border-white/5">{cStr}</span>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>

        {simulation.probabilities.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {simulation.probabilities.map((prob, i) => {
              if (prob < 0.0001 && simulation.probabilities.some(p => p > 0.01)) return null; 
              const percent = (prob * 100).toFixed(1);
              return (
                <div key={i} className="flex flex-col items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="text-slate-300 font-orbitron font-bold mb-3 text-sm z-10">{stateLabels[i]}</div>
                  <div className="relative w-full h-1.5 bg-black/40 rounded-full overflow-hidden mb-3 z-10">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="text-2xl font-bold text-white z-10 tracking-tighter">{percent}%</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
