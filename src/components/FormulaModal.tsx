import React, { useEffect, useState } from 'react';
import { 
  X, 
  Calculator, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Mountain, 
  CheckCircle2, 
  HelpCircle, 
  Scale, 
  Gauge, 
  Compass,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Material, MotionState, PhysicsDerivedValues, VisibilityFilters } from '../types/physics';
import { sound } from '../utils/audio';

interface FormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  appliedForce: number;
  mass: number;
  effectiveMass: number;
  activeMaterial: Material;
  derived: PhysicsDerivedValues;
  velocity: number;
  acceleration: number;
  motionState: MotionState;
  inclineAngle: number;
  visibilityFilters: VisibilityFilters;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({
  isOpen,
  onClose,
  appliedForce,
  mass,
  effectiveMass,
  activeMaterial,
  derived,
  velocity,
  acceleration,
  motionState,
  inclineAngle,
  visibilityFilters
}) => {
  const [activeTab, setActiveTab] = useState<'step_by_step' | 'kid_friendly'>('step_by_step');
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Active variables based on user checklist
  const isMassActive = visibilityFilters.includeMass;
  const isGravityActive = visibilityFilters.includeGravity;
  const isAppliedForceActive = visibilityFilters.showAppliedForce;
  const isFrictionActive = visibilityFilters.showFriction;
  const isNetForceActive = visibilityFilters.showNetForce;
  const isSlopeActive = inclineAngle > 0;

  // Numerical values considering active filters
  const currentMass = effectiveMass; // 10 kg if disabled, or user's mass
  const currentFapp = isAppliedForceActive ? appliedForce : 0;
  const currentSlopeForce = isSlopeActive ? derived.slopeParallelForce : 0;
  const currentDriveForce = currentFapp + currentSlopeForce;

  // Normal force
  const normalForce = derived.normalForce;
  const maxStaticFriction = derived.maxStaticFriction;
  const kineticFriction = derived.kineticFriction;

  // Actual friction considered by filter
  let actualFrictionValue = 0;
  let frictionStatusNote = '';

  if (!isFrictionActive) {
    actualFrictionValue = 0;
    frictionStatusNote = 'Fricción desactivada: superficie tratada como ideal sin rozamiento (f = 0 N).';
  } else {
    actualFrictionValue = derived.actualFriction;
    if (velocity > 0.001) {
      frictionStatusNote = 'En movimiento: actúa la fricción cinética (f = fk = μk · N).';
    } else if (derived.isOvercomingStatic) {
      frictionStatusNote = '¡Empuje supera el umbral estático! Rompe el reposo y pasa a fricción cinética (fk).';
    } else {
      frictionStatusNote = `En reposo: la fricción estática (fs = ${derived.actualFriction.toFixed(1)} N) equilibra exactamente el empuje sin dejar que se mueva.`;
    }
  }

  // Net force and acceleration
  const netForce = isFrictionActive ? derived.netHorizontalForce : currentDriveForce;
  const calculatedAcc = isMassActive || !isGravityActive 
    ? (netForce / currentMass) 
    : (netForce / currentMass);

  // Algebraic formula string generation matching selections
  let formulaSymbols = '';
  let formulaWithValues = '';

  if (isSlopeActive) {
    if (isAppliedForceActive && isFrictionActive) {
      formulaSymbols = 'ΣF = (F_aplicada + P_paralelo) - f';
      formulaWithValues = `ΣF = (${currentFapp.toFixed(1)} N + ${currentSlopeForce.toFixed(1)} N) - ${actualFrictionValue.toFixed(1)} N = ${netForce.toFixed(1)} N`;
    } else if (isAppliedForceActive && !isFrictionActive) {
      formulaSymbols = 'ΣF = F_aplicada + P_paralelo';
      formulaWithValues = `ΣF = ${currentFapp.toFixed(1)} N + ${currentSlopeForce.toFixed(1)} N = ${netForce.toFixed(1)} N`;
    } else if (!isAppliedForceActive && isFrictionActive) {
      formulaSymbols = 'ΣF = P_paralelo - f';
      formulaWithValues = `ΣF = ${currentSlopeForce.toFixed(1)} N - ${actualFrictionValue.toFixed(1)} N = ${netForce.toFixed(1)} N`;
    } else {
      formulaSymbols = 'ΣF = P_paralelo';
      formulaWithValues = `ΣF = ${currentSlopeForce.toFixed(1)} N`;
    }
  } else {
    // Horizontal
    if (isAppliedForceActive && isFrictionActive) {
      formulaSymbols = 'ΣF = F_aplicada - f';
      formulaWithValues = `ΣF = ${currentFapp.toFixed(1)} N - ${actualFrictionValue.toFixed(1)} N = ${netForce.toFixed(1)} N`;
    } else if (isAppliedForceActive && !isFrictionActive) {
      formulaSymbols = 'ΣF = F_aplicada';
      formulaWithValues = `ΣF = ${currentFapp.toFixed(1)} N (Sin fricción opuesta)`;
    } else if (!isAppliedForceActive && isFrictionActive) {
      formulaSymbols = 'ΣF = - f (o 0 si está quieto)';
      formulaWithValues = `ΣF = - ${actualFrictionValue.toFixed(1)} N (Frenado)`;
    } else {
      formulaSymbols = 'ΣF = 0 N';
      formulaWithValues = 'ΣF = 0 N (No hay fuerzas horizontales activas)';
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Card */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-cyan-950/60 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/20 font-black">
              <Calculator className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold font-display text-white tracking-wide">
                  FÓRMULA Y CÁLCULO PASO A PASO
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Adaptado a tus selecciones
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cálculo en vivo de la fuerza total neta (ΣF) y el resultado físico resultante
              </p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Mode Badges Bar */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0">
          <span className="text-slate-400 font-semibold shrink-0">Tus parámetros actuales:</span>
          
          {/* Surface */}
          <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 font-mono shrink-0">
            {activeMaterial.name} (μs={activeMaterial.muS}, μk={activeMaterial.muK})
          </span>

          {/* Mass */}
          <span className={`px-2 py-0.5 rounded-md border font-mono shrink-0 ${
            isMassActive 
              ? 'bg-cyan-950/60 border-cyan-700/50 text-cyan-200' 
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            Masa: {currentMass} kg {isMassActive ? '(Ajustable)' : '(Fija 10 kg)'}
          </span>

          {/* Slope */}
          <span className={`px-2 py-0.5 rounded-md border font-mono shrink-0 ${
            isSlopeActive 
              ? 'bg-amber-950/60 border-amber-700/50 text-amber-200' 
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            {isSlopeActive ? `📐 Cuesta ${inclineAngle}°` : '📏 Plano 0°'}
          </span>

          {/* Applied Force Filter */}
          <span className={`px-2 py-0.5 rounded-md border font-mono shrink-0 ${
            isAppliedForceActive 
              ? 'bg-sky-950/60 border-sky-700/50 text-sky-200' 
              : 'bg-rose-950/40 border-rose-800 text-rose-400'
          }`}>
            Fuerza empuje: {isAppliedForceActive ? `${appliedForce} N` : 'Destachada (0 N)'}
          </span>

          {/* Friction Filter */}
          <span className={`px-2 py-0.5 rounded-md border font-mono shrink-0 ${
            isFrictionActive 
              ? 'bg-rose-950/60 border-rose-700/50 text-rose-200' 
              : 'bg-amber-950/40 border-amber-800 text-amber-300'
          }`}>
            Fricción: {isFrictionActive ? 'Activa' : 'Ignorada (0 N)'}
          </span>
        </div>

        {/* View Mode Switcher Tabs */}
        <div className="px-4 sm:px-5 pt-3 pb-1 flex items-center justify-between border-b border-slate-800 bg-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { sound.playClick(); setActiveTab('step_by_step'); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'step_by_step'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Paso a Paso con Tus Números</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setActiveTab('kid_friendly'); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'kid_friendly'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Explicación Sencilla para Estudiantes</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center text-xs text-slate-400 font-mono">
            Estado: <span className="ml-1 font-bold text-white uppercase">{motionState === 'rest' ? 'En Reposo' : 'En Movimiento'}</span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* HERO FORMULA CARD (Live Highlight) */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                FÓRMULA RESULTANTE PARA TU COMBINACIÓN
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                2da Ley de Newton: <span className="text-emerald-400 font-bold">a = ΣF / m</span>
              </span>
            </div>

            {/* Formula Expression */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-center my-2 shadow-inner">
              <div className="text-lg sm:text-2xl font-mono font-black tracking-wide text-white flex items-center justify-center gap-2 flex-wrap">
                <span className="text-emerald-400">{formulaSymbols.split('=')[0]?.trim()}</span>
                <span className="text-slate-500">=</span>
                <span className="text-cyan-300">{formulaSymbols.split('=')[1]?.trim()}</span>
              </div>
              <div className="mt-2 text-xs sm:text-sm font-mono text-emerald-300 font-bold bg-emerald-950/40 border border-emerald-800/40 py-1.5 px-3 rounded-lg inline-block">
                {formulaWithValues}
              </div>
            </div>

            {/* Acceleration Result Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/60 text-xs">
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Fuerza Neta Total (ΣF):</span>
                <span className="text-sm font-black font-mono text-emerald-400">{netForce.toFixed(1)} N</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Masa en cálculo (m):</span>
                <span className="text-sm font-black font-mono text-cyan-300">{currentMass} kg</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Aceleración resultante (a):</span>
                <span className="text-sm font-black font-mono text-amber-400">{calculatedAcc.toFixed(2)} m/s²</span>
              </div>
            </div>
          </div>

          {/* TAB 1: STEP BY STEP BREAKDOWN */}
          {activeTab === 'step_by_step' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Desglose Paso a Paso con Valores Reales</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  Valores actualizados al instante según tus deslizadores
                </span>
              </div>

              {/* PASO 1: Identificar datos y constantes */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-black text-xs flex items-center justify-center border border-cyan-500/30">
                      1
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      Identificar variables y datos de entrada
                    </h4>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold">Datos conocidos</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono mt-3">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-sans">Masa (m):</span>
                    <span className="text-cyan-300 font-bold">{currentMass} kg</span>
                    <span className="text-[9px] text-slate-500 block font-sans mt-0.5">
                      {isMassActive ? 'Ajustada por usuario' : 'Predeterminada'}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-sans">Gravedad (g):</span>
                    <span className="text-violet-300 font-bold">9.81 m/s²</span>
                    <span className="text-[9px] text-slate-500 block font-sans mt-0.5">Constante terrestre</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-sans">Inclinación (θ):</span>
                    <span className="text-amber-300 font-bold">{inclineAngle}°</span>
                    <span className="text-[9px] text-slate-500 block font-sans mt-0.5">
                      {inclineAngle === 0 ? 'Horizontal' : 'Cuesta abajo'}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-sans">Superficie:</span>
                    <span className="text-white font-bold">{activeMaterial.name}</span>
                    <span className="text-[9px] text-slate-500 block font-sans mt-0.5">
                      μs={activeMaterial.muS} · μk={activeMaterial.muK}
                    </span>
                  </div>
                </div>
              </div>

              {/* PASO 2: Fuerzas que empujan a favor */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 font-black text-xs flex items-center justify-center border border-sky-500/30">
                      2
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      Calcular las fuerzas que empujan hacia adelante (a favor del movimiento)
                    </h4>
                  </div>
                  <span className="text-[10px] text-sky-400 font-mono font-bold">Empuje (+x)</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 mt-2">
                  {/* Fuerza aplicada */}
                  <div className="flex items-start justify-between gap-3 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/80">
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span>Fuerza Aplicada por el usuario (F_app):</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {isAppliedForceActive 
                          ? 'Empuje externo directo regulado por el control.' 
                          : 'Destachada en la casilla: se asume F_app = 0 N.'}
                      </p>
                    </div>
                    <div className="font-mono font-bold text-sm text-cyan-300 shrink-0">
                      {currentFapp.toFixed(1)} N
                    </div>
                  </div>

                  {/* Componente Cuesta si inclinada */}
                  {isSlopeActive && (
                    <div className="flex items-start justify-between gap-3 bg-amber-950/20 p-2.5 rounded-lg border border-amber-800/40">
                      <div>
                        <div className="font-semibold text-amber-200 flex items-center gap-1.5">
                          <Mountain className="w-3.5 h-3.5 text-amber-400" />
                          <span>Componente del Peso cuesta abajo (P_paralelo):</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Fórmula: <code className="text-amber-300 font-mono">P_paralelo = m · g · sen(θ)</code> = {currentMass} · 9.81 · sen({inclineAngle}°)
                        </p>
                      </div>
                      <div className="font-mono font-bold text-sm text-amber-300 shrink-0">
                        + {currentSlopeForce.toFixed(1)} N
                      </div>
                    </div>
                  )}

                  {/* Total Empuje */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-sky-950/40 border border-sky-800/50 text-xs font-mono">
                    <span className="text-sky-300 font-bold font-sans">Total fuerzas impulsoras (F_empuje):</span>
                    <span className="text-sky-200 font-bold text-sm">
                      {currentFapp.toFixed(1)} {isSlopeActive ? `+ ${currentSlopeForce.toFixed(1)}` : ''} = {currentDriveForce.toFixed(1)} N
                    </span>
                  </div>
                </div>
              </div>

              {/* PASO 3: Normal y Fricción Opositora */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 font-black text-xs flex items-center justify-center border border-rose-500/30">
                      3
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      Calcular la Fuerza Normal y la Resistencia de Fricción
                    </h4>
                  </div>
                  <span className="text-[10px] text-rose-400 font-mono font-bold">Oposición (-x)</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 mt-2">
                  {/* Normal Force calculation */}
                  <div className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-violet-300">
                        1. Fuerza Normal (N):
                      </span>
                      <span className="font-mono font-bold text-violet-300">
                        N = {normalForce.toFixed(1)} N
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">
                      {isSlopeActive 
                        ? `N = m · g · cos(θ) = ${currentMass} · 9.81 · cos(${inclineAngle}°) = ${normalForce.toFixed(1)} N`
                        : `N = Peso = m · g = ${currentMass} · 9.81 = ${normalForce.toFixed(1)} N`
                      }
                    </p>
                  </div>

                  {/* Static vs Kinetic Limits */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] font-sans">Umbral Estático Máximo (fs_max):</span>
                      <span className="text-rose-400 font-bold">fs_max = μs · N = {maxStaticFriction.toFixed(1)} N</span>
                      <span className="text-[10px] text-slate-500 block font-sans mt-0.5">
                        {activeMaterial.muS} × {normalForce.toFixed(1)} N
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] font-sans">Fricción Cinética en Deslizamiento (fk):</span>
                      <span className="text-amber-400 font-bold">fk = μk · N = {kineticFriction.toFixed(1)} N</span>
                      <span className="text-[10px] text-slate-500 block font-sans mt-0.5">
                        {activeMaterial.muK} × {normalForce.toFixed(1)} N
                      </span>
                    </div>
                  </div>

                  {/* Friction decision */}
                  <div className={`p-3 rounded-xl border text-xs ${
                    !isFrictionActive 
                      ? 'bg-slate-900/70 border-slate-700 text-slate-400'
                      : derived.isOvercomingStatic || velocity > 0.001
                        ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                        : 'bg-cyan-950/30 border-cyan-800/60 text-cyan-200'
                  }`}>
                    <div className="flex items-center justify-between font-mono font-bold text-sm mb-1">
                      <span>Fricción Actuando Real (f):</span>
                      <span>{actualFrictionValue.toFixed(1)} N</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {frictionStatusNote}
                    </p>
                  </div>
                </div>
              </div>

              {/* PASO 4: Suma total de fuerzas (Fuerza Neta) */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs flex items-center justify-center border border-emerald-500/30">
                      4
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      Suma de fuerzas horizontales: Calcular la Fuerza Neta (ΣF)
                    </h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">Fuerza Neta</span>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-800/60 p-3.5 rounded-xl text-xs space-y-2">
                  <div className="font-mono text-sm sm:text-base font-bold text-white flex items-center justify-between flex-wrap gap-2">
                    <span>ΣF = (Fuerzas a favor) - (Fuerzas en contra)</span>
                  </div>
                  
                  <div className="font-mono text-emerald-300 text-sm font-bold bg-slate-950/60 p-2 rounded-lg border border-emerald-900/50">
                    ΣF = {currentDriveForce.toFixed(1)} N - {actualFrictionValue.toFixed(1)} N = <span className="text-white underline">{netForce.toFixed(1)} N</span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-sans mt-1 leading-relaxed">
                    {netForce > 0.05 ? (
                      <>
                        <span className="text-emerald-400 font-bold">¡Fuerza Neta Positiva!</span> Hay un excedente de <strong className="text-white">{netForce.toFixed(1)} N</strong> empujando el cubo hacia adelante, lo que causará que acelere en esa dirección.
                      </>
                    ) : netForce < -0.05 ? (
                      <>
                        <span className="text-rose-400 font-bold">Fuerza Neta Negativa.</span> La resistencia de fricción es mayor que el empuje, por lo que el objeto está perdiendo velocidad (frenando).
                      </>
                    ) : (
                      <>
                        <span className="text-cyan-400 font-bold">Fuerza Neta Igual a Cero (Equilibrio).</span> Las fuerzas se anulan exactamente. Según la 1ra Ley de Newton, el objeto permanece en reposo o continúa a velocidad constante.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* PASO 5: Resultado final (Aceleración y Movimiento) */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center border border-amber-500/30">
                      5
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      Resultado Final: Aceleración por la 2da Ley de Newton
                    </h4>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">Resultado</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-2">
                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Fórmula de Aceleración:</span>
                      <div className="text-sm font-mono font-bold text-amber-300 my-1">
                        a = ΣF / m
                      </div>
                      <div className="font-mono text-xs text-white">
                        a = {netForce.toFixed(1)} N / {currentMass} kg = <strong className="text-amber-400 text-sm">{calculatedAcc.toFixed(2)} m/s²</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Efecto en el Cubo:</span>
                      <div className="font-bold text-white text-sm my-1 flex items-center gap-1.5">
                        <Gauge className="w-4 h-4 text-cyan-400" />
                        <span>Velocidad actual: {velocity.toFixed(2)} m/s</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {motionState === 'rest' 
                          ? 'El cubo no se mueve porque la fricción estática igualó al empuje.'
                          : motionState === 'accelerating'
                          ? 'El cubo está ganando velocidad hacia la derecha a razón de ' + calculatedAcc.toFixed(2) + ' m/s cada segundo.'
                          : motionState === 'decelerating'
                          ? 'El cubo se desliza pero frenando hasta detenerse.'
                          : 'El cubo se desplaza de forma uniforme.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: EXPLICACIÓN SENCILLA PARA NIÑOS Y ESTUDIANTES */}
          {activeTab === 'kid_friendly' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-300 text-sm">¿Cómo entender esta fórmula sin enredarte?</h4>
                  <p className="text-slate-300 mt-1 leading-relaxed">
                    Imagina que la caja está en medio de un juego de tirar la cuerda. Por un lado empujas tú (y la pendiente si hay bajada), y por el otro lado la superficie agarra la caja para que no avance (la fricción).
                  </p>
                </div>
              </div>

              {/* Cards explicativas tipo cuento/juego */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                
                {/* 1. Empuje */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-sky-900/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
                    1
                  </div>
                  <h4 className="font-bold text-white text-sm">El Empuje (F_app + Cuesta)</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Es la fuerza que empuja hacia adelante. Si estás en una cuesta inclinada, la gravedad te regala un empujoncito extra hacia abajo gratis.
                  </p>
                  <div className="pt-2 border-t border-slate-800 font-mono text-cyan-300 font-bold text-xs">
                    Tu empuje actual: {currentDriveForce.toFixed(1)} N
                  </div>
                </div>

                {/* 2. El Agarre */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-rose-900/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
                    2
                  </div>
                  <h4 className="font-bold text-white text-sm">El Agarre (Fricción f)</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Es como un pegamento invisible entre la caja y el suelo. En reposo se resiste con todo lo que tiene hasta su límite ({maxStaticFriction.toFixed(1)} N). Si lo superas, la caja empieza a patinar.
                  </p>
                  <div className="pt-2 border-t border-slate-800 font-mono text-rose-300 font-bold text-xs">
                    Fricción actual: {actualFrictionValue.toFixed(1)} N
                  </div>
                </div>

                {/* 3. La Fuerza Neta */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-emerald-900/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                    3
                  </div>
                  <h4 className="font-bold text-white text-sm">Lo que Sobra (Fuerza Neta ΣF)</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Es simplemente: <em>Empuje menos Resistencia</em>. Si sobra fuerza hacia adelante (ΣF &gt; 0), el objeto gana velocidad. Si es cero, ¡no se mueve!
                  </p>
                  <div className="pt-2 border-t border-slate-800 font-mono text-emerald-300 font-bold text-xs">
                    Fuerza sobrante: {netForce.toFixed(1)} N
                  </div>
                </div>

              </div>

              {/* Preguntas rápidas sobre la selección activa */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  ¿Por qué la fórmula cambia cuando marcas o desmarcas casillas?
                </h4>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-bold text-cyan-300">¿Qué pasa si desmarcas la Fricción?</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Al quitar la fricción, asumimos un suelo perfecto de hielo espacial sin ningún rozamiento (f = 0 N). Cualquier fuerza mínima moverá la caja indefinidamente.
                    </p>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-bold text-amber-300">¿Qué pasa si activas el Modo Cuesta?</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Al inclinar la rampa, una parte del peso del objeto (P_paralelo = m · g · sen θ) ayuda a empujarlo hacia abajo, sumándose directamente a tu fuerza aplicada.
                    </p>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-bold text-violet-300">¿Qué pasa si desmarcas la Masa?</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Para simplificar tus cálculos, el simulador fija la masa en un valor redondo estándar de 10 kg, así no tienes que preocuparte por cambiar el peso.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 text-center sm:text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Los números y la fórmula cambian en tiempo real al mover controles en el simulador.</span>
          </span>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
          >
            Entendido, volver al simulador
          </button>
        </div>

      </div>

    </div>
  );
};
