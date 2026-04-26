// Quantum math utility functions

export const GATES = {
  I: {
    name: "Identity",
    symbol: "I",
    matrix: [[1, 0], [0, 1]],
    latex: "\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}",
    description: "Does nothing — leaves the qubit unchanged.",
    blochRotation: { axis: "z", angle: 0 },
    color: "#94a3b8",
    outerProduct: {
      formula: "I = |0\\rangle\\langle 0| + |1\\rangle\\langle 1|",
      steps: [
        { label: "Basis outer products", latex: "|0\\rangle\\langle 0| = \\begin{pmatrix}1\\\\0\\end{pmatrix}\\begin{pmatrix}1 & 0\\end{pmatrix} = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}" },
        { label: "", latex: "|1\\rangle\\langle 1| = \\begin{pmatrix}0\\\\1\\end{pmatrix}\\begin{pmatrix}0 & 1\\end{pmatrix} = \\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}" },
        { label: "Sum (completeness relation)", latex: "I = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}+\\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}=\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}" },
      ],
      insight: "This is the completeness relation — any operator can be decomposed over the basis.",
    },
  },
  X: {
    name: "Pauli-X (NOT)",
    symbol: "X",
    matrix: [[0, 1], [1, 0]],
    latex: "\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}",
    description: "Flips |0⟩↔|1⟩. Equivalent to classical NOT gate.",
    blochRotation: { axis: "x", angle: Math.PI },
    color: "#22d3ee",
    outerProduct: {
      formula: "X = |0\\rangle\\langle 1| + |1\\rangle\\langle 0|",
      steps: [
        { label: "Flip outer products", latex: "|0\\rangle\\langle 1| = \\begin{pmatrix}1\\\\0\\end{pmatrix}\\begin{pmatrix}0 & 1\\end{pmatrix} = \\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}" },
        { label: "", latex: "|1\\rangle\\langle 0| = \\begin{pmatrix}0\\\\1\\end{pmatrix}\\begin{pmatrix}1 & 0\\end{pmatrix} = \\begin{pmatrix}0&0\\\\1&0\\end{pmatrix}" },
        { label: "Sum gives NOT gate", latex: "X = \\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}+\\begin{pmatrix}0&0\\\\1&0\\end{pmatrix}=\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}" },
      ],
      insight: "The off-diagonal outer products swap basis states: |0⟩→|1⟩ and |1⟩→|0⟩.",
    },
  },
  Y: {
    name: "Pauli-Y",
    symbol: "Y",
    matrix: [[0, "-i"], ["i", 0]],
    latex: "\\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix}",
    description: "Rotation by π around Y-axis on Bloch sphere.",
    blochRotation: { axis: "y", angle: Math.PI },
    color: "#f59e0b",
    outerProduct: {
      formula: "Y = -i|0\\rangle\\langle 1| + i|1\\rangle\\langle 0|",
      steps: [
        { label: "Scale outer products by imaginary coefficients", latex: "-i|0\\rangle\\langle 1| = -i\\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}=\\begin{pmatrix}0&-i\\\\0&0\\end{pmatrix}" },
        { label: "", latex: "i|1\\rangle\\langle 0| = i\\begin{pmatrix}0&0\\\\1&0\\end{pmatrix}=\\begin{pmatrix}0&0\\\\i&0\\end{pmatrix}" },
        { label: "Sum gives Pauli-Y", latex: "Y = \\begin{pmatrix}0&-i\\\\0&0\\end{pmatrix}+\\begin{pmatrix}0&0\\\\i&0\\end{pmatrix}=\\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}" },
      ],
      insight: "The imaginary phase factors encode a Y-axis rotation; Y = iXZ.",
    },
  },
  Z: {
    name: "Pauli-Z",
    symbol: "Z",
    matrix: [[1, 0], [0, -1]],
    latex: "\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}",
    description: "Phase flip: |1⟩ → -|1⟩. No effect on |0⟩.",
    blochRotation: { axis: "z", angle: Math.PI },
    color: "#6366f1",
    outerProduct: {
      formula: "Z = |0\\rangle\\langle 0| - |1\\rangle\\langle 1|",
      steps: [
        { label: "Diagonal outer products with signs", latex: "|0\\rangle\\langle 0| = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}" },
        { label: "", latex: "-|1\\rangle\\langle 1| = -\\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}=\\begin{pmatrix}0&0\\\\0&-1\\end{pmatrix}" },
        { label: "Difference gives Z", latex: "Z = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}+\\begin{pmatrix}0&0\\\\0&-1\\end{pmatrix}=\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}" },
      ],
      insight: "Z is the difference of the two projectors; it encodes the eigenvalue ±1 for |0⟩ and |1⟩.",
    },
  },
  H: {
    name: "Hadamard",
    symbol: "H",
    matrix: [["1/√2", "1/√2"], ["1/√2", "-1/√2"]],
    latex: "\\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}",
    description: "Creates superposition: |0⟩ → (|0⟩+|1⟩)/√2",
    blochRotation: { axis: "x+z", angle: Math.PI },
    color: "#c084fc",
    outerProduct: {
      formula: "H = \\frac{1}{\\sqrt{2}}\\bigl(|+\\rangle\\langle 0|+|-\\rangle\\langle 1|\\bigr)",
      steps: [
        { label: "Define |+⟩ and |-⟩", latex: "|{+}\\rangle=\\tfrac{1}{\\sqrt{2}}\\begin{pmatrix}1\\\\1\\end{pmatrix},\\quad |{-}\\rangle=\\tfrac{1}{\\sqrt{2}}\\begin{pmatrix}1\\\\-1\\end{pmatrix}" },
        { label: "Alternatively, decompose using computational basis", latex: "H = \\frac{1}{\\sqrt{2}}\\bigl(|0\\rangle\\langle 0|+|0\\rangle\\langle 1|+|1\\rangle\\langle 0|-|1\\rangle\\langle 1|\\bigr)" },
        { label: "Collect into matrix", latex: "H = \\frac{1}{\\sqrt{2}}\\left[\\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}+\\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}+\\begin{pmatrix}0&0\\\\1&0\\end{pmatrix}-\\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}\\right]=\\frac{1}{\\sqrt{2}}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}" },
      ],
      insight: "H maps computational basis to Hadamard (±) basis and vice versa — it is its own inverse: H² = I.",
    },
  },
  S: {
    name: "Phase (S)",
    symbol: "S",
    matrix: [[1, 0], [0, "i"]],
    latex: "\\begin{pmatrix} 1 & 0 \\\\ 0 & i \\end{pmatrix}",
    description: "Quarter turn: adds phase π/2 to |1⟩.",
    blochRotation: { axis: "z", angle: Math.PI / 2 },
    color: "#10b981",
    outerProduct: {
      formula: "S = |0\\rangle\\langle 0| + i|1\\rangle\\langle 1|",
      steps: [
        { label: "Keep |0⟩ unchanged", latex: "|0\\rangle\\langle 0| = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}" },
        { label: "Apply phase i to |1⟩ projector", latex: "i|1\\rangle\\langle 1| = i\\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}=\\begin{pmatrix}0&0\\\\0&i\\end{pmatrix}" },
        { label: "Sum gives S", latex: "S = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}+\\begin{pmatrix}0&0\\\\0&i\\end{pmatrix}=\\begin{pmatrix}1&0\\\\0&i\\end{pmatrix}" },
      ],
      insight: "S = T², since applying a π/4 phase twice gives a π/2 phase. Note S† has phase -i.",
    },
  },
  T: {
    name: "T Gate",
    symbol: "T",
    matrix: [[1, 0], [0, "e^{iπ/4}"]],
    latex: "\\begin{pmatrix} 1 & 0 \\\\ 0 & e^{i\\pi/4} \\end{pmatrix}",
    description: "Eighth turn: adds phase π/4 to |1⟩.",
    blochRotation: { axis: "z", angle: Math.PI / 4 },
    color: "#f472b6",
    outerProduct: {
      formula: "T = |0\\rangle\\langle 0| + e^{i\\pi/4}|1\\rangle\\langle 1|",
      steps: [
        { label: "Keep |0⟩ unchanged", latex: "|0\\rangle\\langle 0| = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}" },
        { label: "Apply phase e^{iπ/4} to |1⟩ projector", latex: "e^{i\\pi/4}|1\\rangle\\langle 1| = e^{i\\pi/4}\\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}=\\begin{pmatrix}0&0\\\\0&e^{i\\pi/4}\\end{pmatrix}" },
        { label: "Sum gives T", latex: "T = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}+\\begin{pmatrix}0&0\\\\0&e^{i\\pi/4}\\end{pmatrix}=\\begin{pmatrix}1&0\\\\0&e^{i\\pi/4}\\end{pmatrix}" },
      ],
      insight: "T is a non-Clifford gate — universal quantum computation requires T together with H and CNOT.",
    },
  },
};

export const MULTI_GATES = {
  CNOT: {
    name: "CNOT (Controlled-X)",
    symbol: "CNOT",
    matrix: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 1, 0],
    ],
    description: "Flips target qubit if control is |1⟩.",
    truthTable: [
      ["00", "00"], ["01", "01"], ["10", "11"], ["11", "10"]
    ],
    color: "#22d3ee",
  },
  CZ: {
    name: "CZ (Controlled-Z)",
    symbol: "CZ",
    matrix: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, -1],
    ],
    description: "Applies Z gate to target qubit if control is |1⟩.",
    truthTable: [
      ["00", "00"], ["01", "01"], ["10", "10"], ["11", "-11"]
    ],
    color: "#6366f1",
  },
  SWAP: {
    name: "SWAP",
    symbol: "SWAP",
    matrix: [
      [1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
    ],
    description: "Swaps the states of two qubits.",
    truthTable: [
      ["00", "00"], ["01", "10"], ["10", "01"], ["11", "11"]
    ],
    color: "#f59e0b",
  },
  Toffoli: {
    name: "Toffoli (CCNOT)",
    symbol: "CCX",
    matrix: [
      [1,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0,0],
      [0,0,1,0,0,0,0,0],
      [0,0,0,1,0,0,0,0],
      [0,0,0,0,1,0,0,0],
      [0,0,0,0,0,1,0,0],
      [0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,1,0],
    ],
    description: "Flips target if BOTH controls are |1⟩. Universal reversible gate.",
    truthTable: [
      ["000","000"],["001","001"],["010","010"],["011","011"],
      ["100","100"],["101","101"],["110","111"],["111","110"]
    ],
    color: "#c084fc",
  },
  Fredkin: {
    name: "Fredkin (CSWAP)",
    symbol: "CSWAP",
    matrix: [
      [1,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0,0],
      [0,0,1,0,0,0,0,0],
      [0,0,0,1,0,0,0,0],
      [0,0,0,0,1,0,0,0],
      [0,0,0,0,0,0,1,0],
      [0,0,0,0,0,1,0,0],
      [0,0,0,0,0,0,0,1],
    ],
    description: "Swaps two qubits if control is |1⟩. Conserves bit count.",
    truthTable: [
      ["000","000"],["001","001"],["010","010"],["011","011"],
      ["100","100"],["101","110"],["110","101"],["111","111"]
    ],
    color: "#10b981",
  },
};

// ─── Circuit Optimization Rules ─────────────────────────────────────────────

// Each rule: { pattern: [gate, gate, ...], result: [gate, ...], description, latex }
export const OPTIMIZATION_RULES = [
  {
    id: "xx_cancel",
    pattern: ["X", "X"],
    result: [],
    description: "X·X = I (self-inverse): two NOT gates cancel.",
    latex: "X \\cdot X = I",
    category: "Cancellation",
  },
  {
    id: "hh_cancel",
    pattern: ["H", "H"],
    result: [],
    description: "H·H = I (self-inverse): two Hadamard gates cancel.",
    latex: "H \\cdot H = I",
    category: "Cancellation",
  },
  {
    id: "zz_cancel",
    pattern: ["Z", "Z"],
    result: [],
    description: "Z·Z = I (self-inverse): two phase-flip gates cancel.",
    latex: "Z \\cdot Z = I",
    category: "Cancellation",
  },
  {
    id: "yy_cancel",
    pattern: ["Y", "Y"],
    result: [],
    description: "Y·Y = I (self-inverse): two Pauli-Y gates cancel.",
    latex: "Y \\cdot Y = I",
    category: "Cancellation",
  },
  {
    id: "ss_to_z",
    pattern: ["S", "S"],
    result: ["Z"],
    description: "S·S = Z: two quarter-turns equal a half-turn (Z).",
    latex: "S^2 = Z",
    category: "Reduction",
  },
  {
    id: "tt_to_s",
    pattern: ["T", "T"],
    result: ["S"],
    description: "T·T = S: two eighth-turns equal a quarter-turn (S).",
    latex: "T^2 = S",
    category: "Reduction",
  },
  {
    id: "hxh_to_z",
    pattern: ["H", "X", "H"],
    result: ["Z"],
    description: "H·X·H = Z: conjugation by H maps X↔Z.",
    latex: "HXH = Z",
    category: "Conjugation",
  },
  {
    id: "hzh_to_x",
    pattern: ["H", "Z", "H"],
    result: ["X"],
    description: "H·Z·H = X: conjugation by H maps Z↔X.",
    latex: "HZH = X",
    category: "Conjugation",
  },
  {
    id: "szs_to_y",
    pattern: ["S", "Z", "S"],
    result: ["Y"],
    description: "S·Z·S† ≈ Y (up to global phase): S conjugates Z to Y.",
    latex: "SZS^\\dagger \\sim Y",
    category: "Conjugation",
  },
  {
    id: "xi_to_x",
    pattern: ["X", "I"],
    result: ["X"],
    description: "X·I = X: identity gates can always be removed.",
    latex: "X \\cdot I = X",
    category: "Identity",
  },
  {
    id: "ix_to_x",
    pattern: ["I", "X"],
    result: ["X"],
    description: "I·X = X: identity gates can always be removed.",
    latex: "I \\cdot X = X",
    category: "Identity",
  },
];

// Apply optimization rules to a single-qubit gate sequence (array of gate symbols)
export function optimizeCircuit(gateSequence) {
  const suggestions = [];
  let current = [...gateSequence];
  let changed = true;
  const maxIter = 20;
  let iter = 0;

  while (changed && iter < maxIter) {
    changed = false;
    iter++;
    for (const rule of OPTIMIZATION_RULES) {
      const pat = rule.pattern;
      for (let i = 0; i <= current.length - pat.length; i++) {
        const slice = current.slice(i, i + pat.length);
        if (slice.join(",") === pat.join(",")) {
          suggestions.push({
            rule,
            position: i,
            before: [...current],
            after: [...current.slice(0, i), ...rule.result, ...current.slice(i + pat.length)],
          });
          current = [...current.slice(0, i), ...rule.result, ...current.slice(i + pat.length)];
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }

  return { optimized: current, suggestions };
}

// Analyse a circuit: count gates, detect cancellation pairs, detect entanglement potential
export function analyzeCircuit(circuit) {
  const gateCounts = {};
  circuit.forEach(g => { gateCounts[g] = (gateCounts[g] || 0) + 1; });

  const depth = circuit.length;
  const hasHadamard = circuit.includes("H");
  const tCount = gateCounts["T"] || 0;

  const pairs = [];
  for (let i = 0; i < circuit.length - 1; i++) {
    const a = circuit[i], b = circuit[i + 1];
    if (a === b && ["X", "Y", "Z", "H"].includes(a)) {
      pairs.push({ index: i, gate: a, reason: `${a}·${a} = I (self-inverse)` });
    }
    if ((a === "T" && b === "T")) pairs.push({ index: i, gate: "T", reason: "T·T = S (reducible)" });
    if ((a === "S" && b === "S")) pairs.push({ index: i, gate: "S", reason: "S·S = Z (reducible)" });
  }

  return {
    depth,
    gateCounts,
    tCount,
    hasHadamard,
    cancelPairs: pairs,
    tComplexity: tCount === 0 ? "Clifford" : tCount <= 3 ? "Low T-count" : "High T-count",
    notes: [
      depth === 0 && "Empty circuit — add gates to begin.",
      hasHadamard && "Contains Hadamard: creates superposition.",
      tCount > 0 && `T-count = ${tCount}. Minimizing T-count is key for fault-tolerant quantum computing.`,
      pairs.length > 0 && `${pairs.length} redundant gate pair(s) found — can be optimized.`,
      depth > 10 && "Deep circuit — consider simplification for real hardware.",
    ].filter(Boolean),
  };
}

// Apply single-qubit gate to a 2D state [alpha, beta]
export function applyGate(gate, alpha, beta) {
  const m = gate.matrix;
  if (typeof m[0][0] === "string") {
    // Simplified for display
    return { alpha, beta };
  }
  const newAlpha = m[0][0] * alpha + m[0][1] * beta;
  const newBeta = m[1][0] * alpha + m[1][1] * beta;
  return { alpha: newAlpha, beta: newBeta };
}

// Convert angles to state vector
export function anglestoState(theta, phi) {
  const cost = Math.cos(theta / 2);
  const sint = Math.sin(theta / 2);
  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  // alpha = cos(θ/2), beta = e^{iφ}sin(θ/2)
  return {
    alpha: cost,
    beta: { re: sint * cosP, im: sint * sinP },
    x: sint * cosP,
    y: sint * sinP,
    z: cost * cost - sint * sint, // cos(θ)
  };
}

// Compute density matrix for pure state
export function pureDensityMatrix(alpha, beta) {
  return [
    [alpha * alpha, alpha * beta],
    [beta * alpha, beta * beta],
  ];
}

// Tensor product of two 2x2 matrices
export function tensorProduct(A, B) {
  const n = A.length;
  const m = B.length;
  const result = Array(n * m).fill(null).map(() => Array(n * m).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < m; k++)
        for (let l = 0; l < m; l++)
          result[i * m + k][j * m + l] = A[i][j] * B[k][l];
  return result;
}

// Matrix multiply
export function matMul(A, B) {
  const n = A.length;
  const p = B[0].length;
  const m = B.length;
  const C = Array(n).fill(null).map(() => Array(p).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < p; j++)
      for (let k = 0; k < m; k++)
        C[i][j] += A[i][k] * B[k][j];
  return C;
}

export function formatComplex(re, im) {
  if (Math.abs(re) < 1e-10 && Math.abs(im) < 1e-10) return "0";
  if (Math.abs(im) < 1e-10) return re.toFixed(3);
  if (Math.abs(re) < 1e-10) return `${im.toFixed(3)}i`;
  return `${re.toFixed(3)} ${im >= 0 ? '+' : '-'} ${Math.abs(im).toFixed(3)}i`;
}

// ─── Circuit Builder Simulation Logic ────────────────────────────────────────

const SQRT1_2 = 1 / Math.SQRT2;

// Real & Imaginary components for gates
export const SIM_GATES = {
  I: [[{r:1,i:0}, {r:0,i:0}], [{r:0,i:0}, {r:1,i:0}]],
  X: [[{r:0,i:0}, {r:1,i:0}], [{r:1,i:0}, {r:0,i:0}]],
  Y: [[{r:0,i:0}, {r:0,i:-1}], [{r:0,i:1}, {r:0,i:0}]],
  Z: [[{r:1,i:0}, {r:0,i:0}], [{r:-1,i:0}, {r:0,i:0}]],
  H: [[{r:SQRT1_2,i:0}, {r:SQRT1_2,i:0}], [{r:SQRT1_2,i:0}, {r:-SQRT1_2,i:0}]],
  S: [[{r:1,i:0}, {r:0,i:0}], [{r:0,i:0}, {r:0,i:1}]],
  T: [[{r:1,i:0}, {r:0,i:0}], [{r:0,i:0}, {r:Math.cos(Math.PI/4), i:Math.sin(Math.PI/4)}]]
};

// Simulate N-qubit state vector (size 2^N)
export function simulateCircuitState(numQubits, grid) {
  // Initialize to |0...0>
  const size = 1 << numQubits;
  let state = new Array(size).fill(null).map(() => ({ r: 0, i: 0 }));
  state[0] = { r: 1, i: 0 };

  const moments = grid[0].length;

  for (let col = 0; col < moments; col++) {
    // Collect gates in this column
    const colOperations = [];
    for (let q = 0; q < numQubits; q++) {
      if (grid[q][col]) {
        colOperations.push({ qubit: q, ...grid[q][col] });
      }
    }

    // Process CNOT/CZ first if present (simple assumption: 1 multigate per col max)
    const multiGate = colOperations.find(op => op.gate === 'CNOT' || op.gate === 'CZ' || op.gate === 'SWAP');
    if (multiGate) {
      state = applyMultiGate(state, numQubits, multiGate);
    }

    // Process single qubit gates
    for (const op of colOperations) {
      if (SIM_GATES[op.gate]) {
        state = applySingleGate(state, numQubits, op.qubit, SIM_GATES[op.gate]);
      }
    }
  }

  // Calculate probabilities
  const probabilities = state.map(amp => amp.r * amp.r + amp.i * amp.i);
  return { state, probabilities };
}

function applySingleGate(state, numQubits, targetQubit, matrix) {
  const newState = new Array(state.length).fill(null).map(() => ({ r: 0, i: 0 }));
  for (let i = 0; i < state.length; i++) {
    const bit = (i >> targetQubit) & 1;
    const flippedIdx = i ^ (1 << targetQubit);
    
    // Matrix multiplication
    const term1 = {
      r: matrix[bit][bit].r * state[i].r - matrix[bit][bit].i * state[i].i,
      i: matrix[bit][bit].r * state[i].i + matrix[bit][bit].i * state[i].r
    };
    
    const term2 = {
      r: matrix[bit][1-bit].r * state[flippedIdx].r - matrix[bit][1-bit].i * state[flippedIdx].i,
      i: matrix[bit][1-bit].r * state[flippedIdx].i + matrix[bit][1-bit].i * state[flippedIdx].r
    };

    newState[i] = { r: term1.r + term2.r, i: term1.i + term2.i };
  }
  return newState;
}

function applyMultiGate(state, numQubits, op) {
  const newState = [...state]; // Copy references (structs are rewritten below)
  
  if (op.gate === 'CNOT') {
    for (let i = 0; i < state.length; i++) {
        if (((i >> op.control) & 1) === 1 && ((i >> op.qubit) & 1) === 0) {
            const flipped = i ^ (1 << op.qubit);
            newState[i] = state[flipped];
            newState[flipped] = state[i];
        } else if (((i >> op.control) & 1) === 0) {
             newState[i] = state[i]; // No change
        }
    }
  } else if (op.gate === 'CZ') {
    for (let i = 0; i < state.length; i++) {
        if (((i >> op.control) & 1) === 1 && ((i >> op.qubit) & 1) === 1) {
             newState[i] = { r: -state[i].r, i: -state[i].i };
        } else {
             newState[i] = state[i];
        }
    }
  }
  return newState;
}

export function generateStateLabels(numQubits) {
  const labels = [];
  const size = 1 << numQubits;
  for (let i = 0; i < size; i++) {
    labels.push("|" + i.toString(2).padStart(numQubits, '0') + "⟩");
  }
  return labels;
}

