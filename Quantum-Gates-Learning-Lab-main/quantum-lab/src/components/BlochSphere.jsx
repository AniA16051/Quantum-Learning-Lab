import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Math as Mth } from './MathBlock';
import useStore from '../store/useStore';
import { GATES } from '../utils/quantum';

function createBlochSphereScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(2.5, 1.5, 2.5);
  camera.lookAt(0, 0, 0);

  // Sphere (wireframe)
  const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee, wireframe: true, opacity: 0.08, transparent: true
  });
  scene.add(new THREE.Mesh(sphereGeo, sphereMat));

  // Solid subtle sphere
  const solidSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x0d1117, transparent: true, opacity: 0.6 })
  );
  scene.add(solidSphere);

  // Axes
  const axisColors = [0x22d3ee, 0xc084fc, 0x6366f1];
  const labels = ['Z', 'X', 'Y'];
  const axisVecs = [
    [new THREE.Vector3(0, 1.4, 0), new THREE.Vector3(0, -1.4, 0)],
    [new THREE.Vector3(1.4, 0, 0), new THREE.Vector3(-1.4, 0, 0)],
    [new THREE.Vector3(0, 0, 1.4), new THREE.Vector3(0, 0, -1.4)],
  ];
  axisVecs.forEach(([p1, p2], idx) => {
    const mat = new THREE.LineBasicMaterial({ color: axisColors[idx], opacity: 0.5, transparent: true });
    const geo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    scene.add(new THREE.Line(geo, mat));
  });

  // Equator circle
  const eqPoints = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    eqPoints.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
  }
  scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(eqPoints),
    new THREE.LineBasicMaterial({ color: 0x22d3ee, opacity: 0.2, transparent: true })
  ));

  // Meridian circles
  for (let phi = 0; phi < Math.PI * 2; phi += Math.PI / 2) {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        Math.sin(theta) * Math.cos(phi),
        Math.cos(theta),
        Math.sin(theta) * Math.sin(phi)
      ));
    }
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0x22d3ee, opacity: 0.1, transparent: true })
    ));
  }

  // State vector arrow
  const arrowDir = new THREE.Vector3(0, 1, 0);
  const arrow = new THREE.ArrowHelper(arrowDir, new THREE.Vector3(0, 0, 0), 1, 0xfbbf24, 0.15, 0.08);
  scene.add(arrow);

  // State point
  const pointGeo = new THREE.SphereGeometry(0.05, 16, 16);
  const pointMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
  const point = new THREE.Mesh(pointGeo, pointMat);
  scene.add(point);

  // Special state markers
  const markerPositions = [
    { pos: [0, 1, 0], color: 0x22d3ee, label: '|0⟩' },
    { pos: [0, -1, 0], color: 0x22d3ee, label: '|1⟩' },
    { pos: [1, 0, 0], color: 0xc084fc, label: '|+⟩' },
    { pos: [-1, 0, 0], color: 0xc084fc, label: '|-⟩' },
  ];
  markerPositions.forEach(({ pos, color }) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 12, 12),
      new THREE.MeshBasicMaterial({ color })
    );
    m.position.set(...pos);
    scene.add(m);
  });

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const dLight = new THREE.DirectionalLight(0x22d3ee, 0.5);
  dLight.position.set(5, 5, 5);
  scene.add(dLight);

  return { renderer, scene, camera, arrow, point };
}

export default function BlochSphere() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const animFrameRef = useRef(null);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const cameraAngle = useRef({ theta: 0.6, phi: 0.5 });

  const { blochTheta, blochPhi, setBlochAngles } = useStore();
  const [thetaDeg, setThetaDeg] = useState(45);
  const [phiDeg, setPhiDeg] = useState(45);
  const [animating, setAnimating] = useState(false);

  const updateState = useCallback((theta, phi) => {
    if (!sceneRef.current) return;
    const { arrow, point } = sceneRef.current;
    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.cos(theta);
    const z = Math.sin(theta) * Math.sin(phi);
    const dir = new THREE.Vector3(x, y, z).normalize();
    arrow.setDirection(dir);
    point.position.set(x, y, z);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    const sceneData = createBlochSphereScene(canvas);
    sceneRef.current = sceneData;
    const { renderer, scene, camera } = sceneData;
    renderer.setSize(width, height);
    sceneData.camera.aspect = width / height;
    sceneData.camera.updateProjectionMatrix();

    updateState(blochTheta, blochPhi);

    let autoRotate = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (!isDragging.current) autoRotate += 0.003;
      const r = 3.5;
      const ca = cameraAngle.current;
      camera.position.set(
        r * Math.sin(ca.theta + autoRotate) * Math.cos(ca.phi),
        r * Math.sin(ca.phi),
        r * Math.cos(ca.theta + autoRotate) * Math.cos(ca.phi)
      );
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    updateState(blochTheta, blochPhi);
  }, [blochTheta, blochPhi]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    cameraAngle.current.theta += dx * 0.01;
    cameraAngle.current.phi = Math.max(-1.4, Math.min(1.4, cameraAngle.current.phi - dy * 0.01));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => { isDragging.current = false; };

  const applyGateToBloch = (gateName) => {
    const t = blochTheta;
    const p = blochPhi;
    let newT = t, newP = p;
    switch (gateName) {
      case 'X': newT = Math.PI - t; newP = p + Math.PI; break;
      case 'Y': newT = Math.PI - t; newP = Math.PI - p; break;
      case 'Z': newT = t; newP = p + Math.PI; break;
      case 'H': newT = Math.PI / 2 - t; newP = p + Math.PI / 2; break;
      case 'S': newT = t; newP = p + Math.PI / 2; break;
      case 'T': newT = t; newP = p + Math.PI / 4; break;
      default: break;
    }
    setAnimating(true);
    let steps = 0;
    const totalSteps = 30;
    const interval = setInterval(() => {
      steps++;
      const frac = steps / totalSteps;
      const interpT = t + (newT - t) * frac;
      const interpP = p + (newP - p) * frac;
      setBlochAngles(interpT % (2 * Math.PI), interpP % (2 * Math.PI));
      if (steps >= totalSteps) {
        clearInterval(interval);
        setAnimating(false);
      }
    }, 16);
  };

  const handleAngleChange = (newTDeg, newPDeg) => {
    const t = (newTDeg / 180) * Math.PI;
    const p = (newPDeg / 180) * Math.PI;
    setThetaDeg(newTDeg);
    setPhiDeg(newPDeg);
    setBlochAngles(t, p);
  };

  const x = Math.sin(blochTheta) * Math.cos(blochPhi);
  const y = Math.cos(blochTheta);
  const z = Math.sin(blochTheta) * Math.sin(blochPhi);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-orbitron text-2xl font-bold neon-cyan mb-2">Bloch Sphere</h1>
        <p className="text-slate-400 text-sm">3D visualization of a qubit's quantum state</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 3D Sphere */}
        <div className="xl:col-span-2">
          <div className="glass-card p-4">
            <div
              className="relative rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
              style={{ height: '420px', background: 'radial-gradient(ellipse at center, #0d1a2a 0%, #050a0e 70%)' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas ref={canvasRef} className="w-full h-full" />

              {/* Axis labels overlay */}
              <div className="absolute top-3 right-3 text-xs text-slate-500 pointer-events-none">
                <div className="flex items-center gap-2 mb-1"><span className="w-3 h-0.5 bg-cyan-400 inline-block"></span> Z-axis</div>
                <div className="flex items-center gap-2 mb-1"><span className="w-3 h-0.5 bg-purple-400 inline-block"></span> X-axis</div>
                <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-indigo-400 inline-block"></span> Y-axis</div>
              </div>

              {/* State labels */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-cyan-400 text-xs font-bold pointer-events-none">|0⟩</div>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-cyan-400 text-xs font-bold pointer-events-none">|1⟩</div>
              <div className="absolute left-3 top-1/2 text-purple-400 text-xs font-bold pointer-events-none">|-⟩</div>
              <div className="absolute right-3 top-1/2 text-purple-400 text-xs font-bold pointer-events-none">|+⟩</div>
              <div className="absolute bottom-2 left-2 text-xs text-slate-600 pointer-events-none">Drag to rotate</div>
            </div>

            {/* Angle sliders */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>θ (theta) — polar</span>
                  <span className="text-cyan-400">{thetaDeg}°</span>
                </div>
                <input type="range" min="0" max="180" value={thetaDeg}
                  onChange={e => handleAngleChange(parseInt(e.target.value), phiDeg)}
                  className="w-full accent-cyan-400" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>φ (phi) — azimuthal</span>
                  <span className="text-purple-400">{phiDeg}°</span>
                </div>
                <input type="range" min="0" max="360" value={phiDeg}
                  onChange={e => handleAngleChange(thetaDeg, parseInt(e.target.value))}
                  className="w-full accent-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls panel */}
        <div className="space-y-4">
          {/* State info */}
          <div className="glass-card p-5">
            <div className="text-cyan-400 text-sm font-bold mb-3">Current State</div>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-slate-900/60 rounded border border-slate-700/50">
                <Mth>{'|\\psi\\rangle = \\cos\\frac{\\theta}{2}|0\\rangle + e^{i\\phi}\\sin\\frac{\\theta}{2}|1\\rangle'}</Mth>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { label: 'x', val: x.toFixed(3), color: 'text-purple-400' },
                  { label: 'y', val: y.toFixed(3), color: 'text-indigo-400' },
                  { label: 'z', val: z.toFixed(3), color: 'text-cyan-400' },
                ].map(v => (
                  <div key={v.label} className="text-center p-2 bg-slate-800/40 rounded">
                    <div className="text-slate-500 text-xs">{v.label}</div>
                    <div className={`${v.color} font-bold`}>{v.val}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-slate-400">
                <div>α = cos(θ/2) = <span className="text-cyan-400">{Math.cos(blochTheta/2).toFixed(3)}</span></div>
                <div>β = e^(iφ)sin(θ/2) = <span className="text-purple-400">{Math.sin(blochTheta/2).toFixed(3)}</span>∠{phiDeg}°</div>
              </div>
            </div>
          </div>

          {/* Gate application */}
          <div className="glass-card p-5">
            <div className="text-sm font-bold text-slate-300 mb-3">Apply Gate → See Rotation</div>
            <div className="grid grid-cols-3 gap-2">
              {['X', 'Y', 'Z', 'H', 'S', 'T'].map(g => (
                <button key={g}
                  onClick={() => applyGateToBloch(g)}
                  disabled={animating}
                  className={`btn-neon text-xs py-2 ${animating ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {g}
                </button>
              ))}
            </div>
            {animating && <div className="text-xs text-yellow-400 mt-2 text-center">Animating...</div>}
          </div>

          {/* Preset states */}
          <div className="glass-card p-5">
            <div className="text-sm font-bold text-slate-300 mb-3">Preset States</div>
            <div className="space-y-2">
              {[
                { label: '|0⟩ (North pole)', t: 0, p: 0, color: 'text-cyan-400' },
                { label: '|1⟩ (South pole)', t: 180, p: 0, color: 'text-cyan-400' },
                { label: '|+⟩ = H|0⟩', t: 90, p: 0, color: 'text-purple-400' },
                { label: '|-⟩ = H|1⟩', t: 90, p: 180, color: 'text-purple-400' },
                { label: '|i⟩ = S|+⟩', t: 90, p: 90, color: 'text-indigo-400' },
              ].map(s => (
                <button key={s.label}
                  onClick={() => handleAngleChange(s.t, s.p)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/40 hover:bg-slate-700/50 border border-slate-700/50 transition-all">
                  <span className={`text-xs ${s.color}`}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Math explanation */}
      <div className="glass-card p-5 mt-6">
        <div className="text-sm font-bold text-slate-300 mb-4">Bloch Sphere Parameterization</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <div className="text-xs text-slate-400 mb-2">State representation</div>
            <Mth block>{'|\\psi\\rangle = \\cos\\frac{\\theta}{2}|0\\rangle + e^{i\\phi}\\sin\\frac{\\theta}{2}|1\\rangle'}</Mth>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <div className="text-xs text-slate-400 mb-2">Bloch vector coordinates</div>
            <Mth block>{'\\vec{n} = (\\sin\\theta\\cos\\phi,\\ \\sin\\theta\\sin\\phi,\\ \\cos\\theta)'}</Mth>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <div className="text-xs text-slate-400 mb-2">Expected values</div>
            <Mth block>{'\\langle X\\rangle = \\sin\\theta\\cos\\phi,\\ \\langle Z\\rangle = \\cos\\theta'}</Mth>
          </div>
        </div>
      </div>
    </div>
  );
}
