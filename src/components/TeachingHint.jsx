import React from 'react'

export default function TeachingHint(){
  return (
    <div className="glass-card" aria-label="Teaching Hint" style={{marginBottom:12}}>
      <strong>Teaching Hint:</strong> Click a gate derivation or a circuit tile to see a quick pop visual and a short note. This helps students connect algebraic structure with circuit behavior.
      <span style={{marginLeft:8, fontFamily:'JetBrains Mono', color:'#93c5fd'}}>Tip: Use the left panel to explore steps; use the optimizer to see how patterns reduce gates.</span>
    </div>
  )
}
