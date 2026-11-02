/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { PhysicsStage } from './components/PhysicsStage';
import { ControlPanel } from './components/ControlPanel';
import { PhysicalIndicators } from './components/PhysicalIndicators';
import { FrictionGraph } from './components/FrictionGraph';
import { ExplainModal } from './components/ExplainModal';
import { ChallengeMode } from './components/ChallengeMode';
import { LearnSection } from './components/LearnSection';
import { LabReportModal } from './components/LabReportModal';
import { SimpleSimulatorView } from './components/SimpleSimulatorView';
import { MATERIALS } from './data/materials';
import { MaterialId, PhysicsState, SimulationStatus, MotionState } from './types/physics';
import { calculateDerivedPhysics, stepPhysics } from './utils/physicsEngine';
import { sound } from './utils/audio';
import { Compass, Sparkles, BookOpen, Trophy, HelpCircle, Layers } from 'lucide-react';

export default function App() {
  // Navigation tab: 'lab' | 'desafio' | 'aprende'
  const [activeTab, setActiveTab] = useState<'lab' | 'desafio' | 'aprende'>('lab');

  // Simple Mode toggle: defaults to true on entry for a clean, non-overwhelming initial experience
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(true);

  // Modal states (preserves simulator state when opened/closed)
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Core Simulation Parameters
  const [mass, setMass] = useState<number>(10); // kg
  const [appliedForce, setAppliedForce] = useState<number>(0); // N
  const [materialId, setMaterialId] = useState<MaterialId>('madera');
  const [timeScale, setTimeScale] = useState<number>(1);
  const [speedLimit, setSpeedLimit] = useState<number | null>(null); // null = sin límite, or 10, 25, 50 m/s

  // Kinematic Simulation State
  const [status, setStatus] = useState<SimulationStatus>('idle');
  const [position, setPosition] = useState<number>(0); // meters
  const [velocity, setVelocity] = useState<number>(0); // m/s
  const [acceleration, setAcceleration] = useState<number>(0); // m/s^2
  const [distanceTraveled, setDistanceTraveled] = useState<number>(0);
  const [motionState, setMotionState] = useState<MotionState>('rest');
  const [hasBrokenStatic, setHasBrokenStatic] = useState<boolean>(false);
  const [showStaticBreachedAlert, setShowStaticBreachedAlert] = useState<boolean>(false);

  // Alert timer ref
  const alertTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active Material object
  const activeMaterial = useMemo(() => MATERIALS[materialId] || MATERIALS.madera, [materialId]);

  // Derived real-time physics values
  const derived = useMemo(() => {
    return calculateDerivedPhysics(mass, appliedForce, activeMaterial, velocity, undefined, undefined, speedLimit);
  }, [mass, appliedForce, activeMaterial, velocity, speedLimit]);

  // Trigger alert banner helper
  const triggerBreachedAlert = useCallback(() => {
    sound.playBreakStatic();
    setShowStaticBreachedAlert(true);
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    alertTimerRef.current = setTimeout(() => {
      setShowStaticBreachedAlert(false);
    }, 3500);
  }, []);

  // When applied force or material changes while at rest, check if it directly overcomes static friction
  useEffect(() => {
    if (status === 'running' && velocity <= 0.001) {
      if (appliedForce > derived.maxStaticFriction) {
        triggerBreachedAlert();
      }
    }
  }, [appliedForce, derived.maxStaticFriction, status, velocity, triggerBreachedAlert]);

  // State ref for smooth, high-fps requestAnimationFrame loop without stale closures
  const stateRef = useRef<PhysicsState>({
    mass,
    appliedForce,
    materialId,
    position,
    velocity,
    acceleration,
    simulationTime: 0,
    status,
    motionState,
    hasBrokenStatic,
    distanceTraveled,
    timeScale,
    speedLimit
  });

  // Sync state ref on prop changes
  useEffect(() => {
    stateRef.current.mass = mass;
    stateRef.current.appliedForce = appliedForce;
    stateRef.current.materialId = materialId;
    stateRef.current.status = status;
    stateRef.current.timeScale = timeScale;
    stateRef.current.speedLimit = speedLimit;
  }, [mass, appliedForce, materialId, status, timeScale, speedLimit]);

  // Continuous physics integration loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dtMs = currentTime - lastTime;
      lastTime = currentTime;

      // Limit dt to avoid spiral of death if tab was inactive (clamp to max 0.05s)
      const dt = Math.min(dtMs / 1000, 0.05);

      if (stateRef.current.status === 'running') {
        const { nextState, justBrokeStatic } = stepPhysics(
          stateRef.current,
          activeMaterial,
          dt
        );

        stateRef.current = nextState;

        // Sync React render states
        setPosition(nextState.position);
        setVelocity(nextState.velocity);
        setAcceleration(nextState.acceleration);
        setDistanceTraveled(nextState.distanceTraveled);
        setMotionState(nextState.motionState);
        setHasBrokenStatic(nextState.hasBrokenStatic);

        // Update audio hum based on velocity
        sound.updateSlidingHum(nextState.velocity);

        if (justBrokeStatic) {
          triggerBreachedAlert();
        }
      } else {
        sound.updateSlidingHum(0);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      sound.updateSlidingHum(0);
    };
  }, [activeMaterial, triggerBreachedAlert]);

  // Handler: Start Simulation
  const handleStart = () => {
    setStatus('running');
    stateRef.current.status = 'running';

    // If starting and force already exceeds static threshold from rest, trigger alert
    if (velocity <= 0.001 && appliedForce > derived.maxStaticFriction) {
      triggerBreachedAlert();
    }
  };

  // Handler: Pause Simulation
  const handlePause = () => {
    setStatus('paused');
    stateRef.current.status = 'paused';
  };

  // Handler: Reset Simulation
  const handleReset = () => {
    setStatus('idle');
    stateRef.current.status = 'idle';
    stateRef.current.position = 0;
    stateRef.current.velocity = 0;
    stateRef.current.acceleration = 0;
    stateRef.current.distanceTraveled = 0;
    stateRef.current.simulationTime = 0;
    stateRef.current.motionState = 'rest';
    stateRef.current.hasBrokenStatic = false;

    setPosition(0);
    setVelocity(0);
    setAcceleration(0);
    setDistanceTraveled(0);
    setMotionState('rest');
    setHasBrokenStatic(false);
    setShowStaticBreachedAlert(false);
    sound.updateSlidingHum(0);
  };

  // Preset scenarios to impress students and teachers
  const applyPreset = (presetName: string) => {
    sound.playClick();
    handleReset();
    if (presetName === 'umbral-madera') {
      setMass(10);
      setMaterialId('madera');
      setAppliedForce(42); // Just above fs_max (39.24 N)
      handleStart();
    } else if (presetName === 'hielo-facil') {
      setMass(15);
      setMaterialId('hielo');
      setAppliedForce(20); // Well above fs_max (14.7 N)
      handleStart();
    } else if (presetName === 'goma-pesada') {
      setMass(30);
      setMaterialId('goma');
      setAppliedForce(180); // Stays at rest! fs_max is ~264.8 N
    } else if (presetName === 'desaceleracion') {
      setMass(10);
      setMaterialId('cemento');
      setAppliedForce(120);
      handleStart();
      // After gaining speed, user can drop force to 0 to observe friction braking
    }
  };

  if (isSimpleMode) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans p-4 sm:p-6 lg:p-8 selection:bg-cyan-500/30 selection:text-cyan-200">
        <SimpleSimulatorView
          mass={mass}
          setMass={setMass}
          appliedForce={appliedForce}
          setAppliedForce={setAppliedForce}
          materialId={materialId}
          setMaterialId={setMaterialId}
          activeMaterial={activeMaterial}
          derived={derived}
          velocity={velocity}
          acceleration={acceleration}
          position={position}
          distanceTraveled={distanceTraveled}
          motionState={motionState}
          showStaticBreachedAlert={showStaticBreachedAlert}
          status={status}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onEnterFullLab={() => setIsSimpleMode(false)}
          onOpenExplain={() => setIsExplainOpen(true)}
          speedLimit={speedLimit}
          setSpeedLimit={setSpeedLimit}
        />

        {/* Explain Modal accessible from Simple Mode */}
        <ExplainModal
          isOpen={isExplainOpen}
          onClose={() => setIsExplainOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. Header with Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExplain={() => setIsExplainOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onToggleSimpleMode={() => setIsSimpleMode(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* SUBTITLE BANNER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-950/40 pb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-white flex items-center gap-2">
              <span>FRICTION LAB</span>
              <span className="text-cyan-400 font-normal text-sm sm:text-base">— Laboratorio de Fricción</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Explora, experimenta y descubre las fuerzas que controlan el movimiento.
            </p>
          </div>

          {/* Quick Demo Presets Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
            <button
              onClick={() => { sound.playClick(); setIsSimpleMode(true); }}
              className="px-3 py-1 rounded-lg bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 hover:text-white hover:bg-cyan-900 whitespace-nowrap transition-all font-bold flex items-center gap-1.5 shadow-sm"
              title="Activar vista simple"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>SIMPLE</span>
            </button>
            <span className="text-[11px] text-slate-500 hidden xl:inline ml-1">Experimentos:</span>
            <button
              onClick={() => applyPreset('umbral-madera')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 whitespace-nowrap transition-colors"
            >
              Ruptura en Madera (10 kg)
            </button>
            <button
              onClick={() => applyPreset('hielo-facil')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 whitespace-nowrap transition-colors"
            >
              Deslizamiento en Hielo
            </button>
            <button
              onClick={() => applyPreset('goma-pesada')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 whitespace-nowrap transition-colors"
            >
              Goma Pesada (30 kg)
            </button>
          </div>
        </div>

        {/* TAB CONTENT: 1. LABORATORIO PRINCIPAL */}
        {activeTab === 'lab' && (
          <div className="flex flex-col gap-6">
            
            {/* Live Physical Indicators Bar */}
            <PhysicalIndicators
              appliedForce={appliedForce}
              derived={derived}
              velocity={velocity}
              acceleration={acceleration}
            />

            {/* 2.5D Physical Sandbox Canvas */}
            <PhysicsStage
              mass={mass}
              appliedForce={appliedForce}
              actualFriction={derived.actualFriction}
              normalForce={derived.normalForce}
              weight={derived.weight}
              maxStaticFriction={derived.maxStaticFriction}
              kineticFriction={derived.kineticFriction}
              isOvercomingStatic={derived.isOvercomingStatic}
              velocity={velocity}
              acceleration={acceleration}
              position={position}
              distanceTraveled={distanceTraveled}
              motionState={motionState}
              material={activeMaterial}
              showStaticBreachedAlert={showStaticBreachedAlert}
              speedLimit={speedLimit}
              isSpeedLimited={derived.isSpeedLimited}
            />

            {/* Bottom Row: Control Panel + Real-time Friction Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Corner Control Deck (7 columns on desktop) */}
              <div className="lg:col-span-7 flex">
                <ControlPanel
                  mass={mass}
                  setMass={setMass}
                  appliedForce={appliedForce}
                  setAppliedForce={setAppliedForce}
                  selectedMaterialId={materialId}
                  setSelectedMaterialId={setMaterialId}
                  status={status}
                  onStart={handleStart}
                  onPause={handlePause}
                  onReset={handleReset}
                  timeScale={timeScale}
                  setTimeScale={setTimeScale}
                  speedLimit={speedLimit}
                  setSpeedLimit={setSpeedLimit}
                />
              </div>

              {/* Real-time SVG Graph (5 columns on desktop) */}
              <div className="lg:col-span-5 flex">
                <FrictionGraph
                  appliedForce={appliedForce}
                  derived={derived}
                  isMoving={velocity > 0.001}
                />
              </div>

            </div>

          </div>
        )}

        {/* TAB CONTENT: 2. MODO DESAFÍO */}
        {activeTab === 'desafio' && (
          <ChallengeMode onReturnToLab={() => setActiveTab('lab')} />
        )}

        {/* TAB CONTENT: 3. SECCIÓN APRENDE */}
        {activeTab === 'aprende' && (
          <LearnSection onGoToLab={() => setActiveTab('lab')} />
        )}

      </main>

      {/* Floating Explain Modal (Preserves experiment state) */}
      <ExplainModal
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
      />

      {/* Lab Report Modal */}
      <LabReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        mass={mass}
        material={activeMaterial}
        appliedForce={appliedForce}
        derived={derived}
        velocity={velocity}
        acceleration={acceleration}
        distanceTraveled={distanceTraveled}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 mt-auto text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>FRICTION LAB · Desarrollado para presentación en Politécnico de República Dominicana</span>
          <span className="font-mono text-[11px] text-slate-400">g = 9.81 m/s² · Leyes de Newton y Rozamiento</span>
        </div>
      </footer>

    </div>
  );
}
