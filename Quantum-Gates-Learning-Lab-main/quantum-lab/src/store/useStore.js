import { create } from 'zustand';

const useStore = create((set) => ({
  activeSection: 'fundamentals',
  setActiveSection: (section) => set({ activeSection: section }),

  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // Bloch sphere state
  blochTheta: Math.PI / 4,
  blochPhi: Math.PI / 4,
  setBlochAngles: (theta, phi) => set({ blochTheta: theta, blochPhi: phi }),

  // Selected gate
  selectedGate: 'H',
  setSelectedGate: (gate) => set({ selectedGate: gate }),

  // Superposition slider
  superpositionAngle: Math.PI / 4,
  setSuperpositionAngle: (angle) => set({ superpositionAngle: angle }),
}));

export default useStore;
