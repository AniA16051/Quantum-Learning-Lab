import React, { useState, useEffect } from 'react'

export default function Sidebar(){
  const [minimized, setMinimized] = useState(false)
  useEffect(()=>{
    const v = localStorage.getItem('sidebar-minimized') === 'true'
    setMinimized(v)
  }, [])
  useEffect(()=>{
    localStorage.setItem('sidebar-minimized', minimized)
  }, [minimized])

  return (
    <aside className={"sidebar" + (minimized? ' minimized':'')} aria-label="Sidebar">
      <nav>
        <ul>
          <li id="gates" className="side-item">Quantum Gates</li>
        </ul>
      </nav>
      <button aria-label="Toggle Sidebar" className="tab-btn" style={{width:'100%', marginTop:8}} onClick={()=>setMinimized(v => !v)}>
        {minimized ? 'Expand' : 'Minimize'}
      </button>
      <style>{`@media (min-width: 900px){ .sidebar{ width:240px; } .sidebar.minimized{ width:64px; } .sidebar.minimized .side-item{ writing-mode: vertical-rl; transform: rotate(180deg); font-size:12px; } }`}</style>
    </aside>
  )
}
