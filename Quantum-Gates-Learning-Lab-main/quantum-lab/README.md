# ⚛️ Quantum Gates Learning Lab

A high-fidelity, interactive educational platform designed to bridge the gap between quantum theory and practical intuition. Built with a premium glassmorphic UI, this lab provides deep dives into quantum mechanics, gate logic, and circuit optimization.

---

## 🛠️ Technology Stack

The project leverages a modern, performance-first stack to deliver a smooth "glass-on-silk" experience:

*   **React 18 & Vite**: Lightning-fast development and optimized production builds.
*   **Tailwind CSS**: A custom design system built with CSS variables for dynamic glassmorphism and responsiveness.
*   **KaTeX Integration**: High-performance LaTeX rendering for complex matrices and ket-notation.
*   **Linear Algebra Engine**: A custom-built JavaScript physics engine (`quantum.js`) that handles state vector transformations, tensor products, and density matrix calculations.
*   **Framer Motion**: Smooth micro-animations for gate dragging and tab transitions.

---

## 🔬 Core Learning Modules

### 1. Quantum Fundamentals Explorer
*   **Purpose**: Introduces students to the building blocks of quantum information.
*   **Components**:
    *   **Qubits & States**: Interactive explanation of |0⟩ and |1⟩ basis states.
    *   **Wavefunction Dashboard**: Real-time visualization of complex amplitudes and probability normalization.
    *   **Vector Space Mapper**: Displays how quantum states are represented as vectors in 2D Hilbert space.

### 2. Quantum Gates Master-Suite
*   **Purpose**: A comprehensive laboratory for analyzing single and multi-qubit operators.
*   **Features**:
    *   **Matrix Dashboard**: Interactive view of Unitary matrices (I, X, Y, Z, H, S, T) using mathematical formatting.
    *   **Mathematical Trace**: Step-by-step outer-product derivation ($|0\rangle\langle 0|$, etc.) showing exactly how the matrix is built from basis projections.
    *   **Input-Output Mapping**: Interactive truth tables demonstrating how basis states transform under each operator.
    *   **Rotational Logic**: Explains the gate's effect on the Bloch Sphere (axis and angle of rotation).

### 3. Integrated Circuit Builder
*   **Purpose**: Move from single gates to complex algorithm design.
*   **Functionality**:
    *   **Drag & Drop Workspace**: Place single and multi-qubit (CNOT, SWAP, CZ, Toffoli) gates on a 3-qubit wire grid.
    *   **Live Simulation**: As gates are added, the state vector $|\psi\rangle$ is recalculated instantly.
    *   **Probability Meter**: Visualizes the measurement outcomes of the final state vector across all 8 computational basis states.

### 4. Circuit Optimization Engine
*   **Purpose**: Teaches the importance of "Clifford" and "T-count" reduction in quantum computing.
*   **Capability**:
    *   **Pattern Recognition**: Automatically detects redundant gate sequences (e.g., $X \cdot X \rightarrow I$).
    *   **Replacement Suggestions**: Highlights opportunities to combine gates (e.g., $H \cdot X \cdot H \rightarrow Z$).
    *   **Efficiency Metrics**: Tracks "Gate Depth" and "T-complexity" to help users design more hardware-friendly circuits.

### 5. Quantum Principles Lab (Superposition & Entanglement)
*   **Purpose**: Deep dive into the non-classical aspects of quantum mechanics.
*   **Key Explorations**:
    *   **Superposition**: Visualizes the phase relationship between $\alpha$ and $\beta$.
    *   **Entanglement (Bell States)**: Demonstrates how a CNOT gate entangles two qubits such that their states can no longer be described independently.
    *   **Measurement**: Interactive "collapse" simulation, showing how probabilistic outcomes follow the Born Rule.

### 6. Pure vs Mixed States Analyzer
*   **Purpose**: Understanding Decoherence and Density Matrices.
*   **Features**:
    *   **State Mixing**: Adjust the "purity" of a state to see how it moves from the surface of the Bloch Sphere into the center.
    *   **Density Matrix Visualization**: Shows the diagonal (population) and off-diagonal (coherence) elements of $\rho$.
    *   **Entropy & Purity calculation**: Computes $Tr(\rho^2)$ and von Neumann entropy $S = -Tr(\rho \ln \rho)$ in real-time.

---

## 📂 Project Structure

```text
quantum-lab/
├── src/
│   ├── components/       # UI Components
│   │   ├── QuantumGates.jsx    # Gate explorer and Optimizer Logic
│   │   ├── CircuitBuilder.jsx  # Interactive wire-grid and simulator
│   │   ├── BlochSphere.jsx     # SU(2) visualization engine
│   │   ├── PureMixedStates.jsx # Coherence and Density matrix UI
│   │   ├── Fundamentals.jsx    # Basic theory and state vectors
│   │   └── MathBlock.jsx       # Reusable KaTeX/LaTeX UI wrapper
│   ├── utils/            # Physics Engine
│   │   └── quantum.js          # Matrix math, Tensors, and Sim Core
│   └── index.css         # Global Glassmorphic Design System
```

---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/your-username/quantum-lab.git

# Install packages
npm install

# Start the dev server
npm run dev
```

---

## 👨‍💻 Author
**Anirudh Ashok**  
*RA2411003010128*

## 📜 License
Educational Project. Build for the future.
