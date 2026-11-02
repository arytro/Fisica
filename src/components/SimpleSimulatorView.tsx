import React from 'react';
import { ArrowRight, Compass, HelpCircle, Play, Pause, RotateCcw, Zap, Sparkles, Gauge, CheckSquare, Mountain, Sliders, Scale } from 'lucide-react';
import { Material, MaterialId, MotionState, PhysicsDerivedValues, SimulationStatus, VisibilityFilters } from '../types/physics';
import { MATERIALS } from '../data/materials';
import { PhysicsStage } from './PhysicsStage';
import { FrictionGraph } from './FrictionGraph';
import { sound } from '../utils/audio';

interface SimpleSimulatorViewProps {
  mass: number;
  setMass: (m: number) => void;
  appliedForce: number;
  setAppliedForce: (f: number) => void;
  materialId: MaterialId;
  setMaterialId: (id: MaterialId) => void;
  activeMaterial: Material;
  derived: PhysicsDerivedValues;
  velocity: number;
  acceleration: number;
  position: number;
  distanceTraveled: number;
  motionState: MotionState;
  showStaticBreachedAlert: boolean;
  status: SimulationStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onEnterFullLab: () => void;
  onOpenExplain: () => void;
  speedLimit: number | null;
  setSpeedLimit: (lim: number | null) => void;
  inclineAngle: number;
  setInclineAngle: (angle: number) => void;
  visibilityFilters: VisibilityFilters;
  setVisibilityFilters: React.Dispatch<React.SetStateAction<VisibilityFilters>>;
}

export const SimpleSimulatorView: React.FC<SimpleSimulatorViewProps> = ({
  mass,
  setMass,
  appliedForce,
  setAppliedForce,
  materialId,
  setMaterialId,
  activeMaterial,
  derived,
  velocity,
  acceleration,
  position,
  distanceTraveled,
  motionState,
  showStaticBreachedAlert,
  status,
  onStart,
  onPause,
  onReset,
  onEnterFullLab,
  onOpenExplain,
  speedLimit,
  setSpeedLimit,
  inclineAngle,
  setInclineAngle,
  visibilityFilters,
  setVisibilityFilters
}) => {
  // Preset handlers
  const handlePresetForcesOnly = () => {
    sound.playClick();
    setVisibilityFilters({
      includeMass: false, // Automatically locks to default 10 kg
      includeGravity: false, // Hides vertical P and N
      showAppliedForce: true,
      showFriction: true,
      showNetForce: true // Net Force active
    });
  };

  const handlePresetAll = () => {
    sound.playClick();
    setVisibilityFilters({
      includeMass: true,
      includeGravity: true,
      showAppliedForce: true,
      showFriction: true,
      showNetForce: true
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-5 py-2 animate-fadeIn">
      
      {/* Top Bar with Brand, EXPLÍCAME and prominent "INGRESAR AL LABORATORIO COMPLETO" */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-xl">
        
        {/* Brand & Mode Tag */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold text-lg border border-cyan-300/30">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-tight text-white">
                FRICTION<span className="text-cyan-400">LAB</span>
              </span>
              <span className="text-[10px] font-bold text-cyan-300 uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/50">
                Inicio Simple
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Elige qué fuerzas tomar en cuenta, prueba la cuesta abajo y cambia de superficie
            </p>
          </div>
        </div>

        {/* Action Buttons: Explícame & Ingresar */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={() => { sound.playClick(); onOpenExplain(); }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>EXPLÍCAME</span>
          </button>

          <button
            onClick={() => { sound.playClick(); onEnterFullLab(); }}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-cyan-200/60 cursor-pointer"
            title="Ingresa para ver el modo desafío, fórmulas avanzadas y reportes"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>INGRESAR AL LABORATORIO COMPLETO</span>
            <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </button>
        </div>

      </div>

      {/* CUADRO: ¿QUÉ TOMAR EN CUENTA? (FILTRO DE FUERZAS, VARIABLES Y MODO CUESTA) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md flex flex-col gap-3.5">
        
        {/* Card Header & Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>¿Qué tomar en cuenta?</span>
                <span className="text-[10px] font-normal text-cyan-300/80 lowercase font-sans">
                  (destacha lo que quieras ignorar)
                </span>
              </h3>
            </div>
          </div>

          {/* Quick Presets Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePresetForcesOnly}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-950/90 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-cyan-500/10"
              title="Solo muestra Fuerza Aplicada, Fricción y Fuerza Neta, con masa fija de 10 kg y sin gravedad"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>⚡ Solo Suma de Fuerzas</span>
            </button>

            <button
              onClick={handlePresetAll}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            >
              <span>Ver Todo</span>
            </button>
          </div>
        </div>

        {/* Checkboxes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          
          {/* 1. Masa */}
          <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
            visibilityFilters.includeMass
              ? 'bg-slate-800/70 border-cyan-500/50 text-white shadow-sm'
              : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-70'
          }`}>
            <input
              type="checkbox"
              checked={visibilityFilters.includeMass}
              onChange={(e) => {
                sound.playClick();
                setVisibilityFilters(prev => ({ ...prev, includeMass: e.target.checked }));
              }}
              className="mt-0.5 rounded accent-cyan-400 cursor-pointer w-4 h-4"
            />
            <div className="flex flex-col text-xs leading-tight">
              <span className="font-bold">Masa</span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {visibilityFilters.includeMass ? `${mass} kg (ajustable)` : '10 kg predeterminada'}
              </span>
            </div>
          </label>

          {/* 2. Gravedad (P y N) */}
          <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
            visibilityFilters.includeGravity
              ? 'bg-slate-800/70 border-violet-500/50 text-white shadow-sm'
              : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-70'
          }`}>
            <input
              type="checkbox"
              checked={visibilityFilters.includeGravity}
              onChange={(e) => {
                sound.playClick();
                setVisibilityFilters(prev => ({ ...prev, includeGravity: e.target.checked }));
              }}
              className="mt-0.5 rounded accent-violet-400 cursor-pointer w-4 h-4"
            />
            <div className="flex flex-col text-xs leading-tight">
              <span className="font-bold">Gravedad</span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {visibilityFilters.includeGravity ? 'Peso (P) y Normal (N)' : 'Ocultar eje vertical'}
              </span>
            </div>
          </label>

          {/* 3. Fuerza Aplicada */}
          <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
            visibilityFilters.showAppliedForce
              ? 'bg-slate-800/70 border-sky-500/50 text-white shadow-sm'
              : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-70'
          }`}>
            <input
              type="checkbox"
              checked={visibilityFilters.showAppliedForce}
              onChange={(e) => {
                sound.playClick();
                setVisibilityFilters(prev => ({ ...prev, showAppliedForce: e.target.checked }));
              }}
              className="mt-0.5 rounded accent-sky-400 cursor-pointer w-4 h-4"
            />
            <div className="flex flex-col text-xs leading-tight">
              <span className="font-bold text-cyan-300">Fuerza aplicada</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Flecha empuje adelante</span>
            </div>
          </label>

          {/* 4. Fricción */}
          <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
            visibilityFilters.showFriction
              ? 'bg-slate-800/70 border-rose-500/50 text-white shadow-sm'
              : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-70'
          }`}>
            <input
              type="checkbox"
              checked={visibilityFilters.showFriction}
              onChange={(e) => {
                sound.playClick();
                setVisibilityFilters(prev => ({ ...prev, showFriction: e.target.checked }));
              }}
              className="mt-0.5 rounded accent-rose-400 cursor-pointer w-4 h-4"
            />
            <div className="flex flex-col text-xs leading-tight">
              <span className="font-bold text-rose-300">Fricción</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Flecha para detrás</span>
            </div>
          </label>

          {/* 5. Fuerza Neta Resultante (ΣF) */}
          <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
            visibilityFilters.showNetForce
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 shadow-md shadow-emerald-500/10'
              : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-70'
          }`}>
            <input
              type="checkbox"
              checked={visibilityFilters.showNetForce}
              onChange={(e) => {
                sound.playClick();
                setVisibilityFilters(prev => ({ ...prev, showNetForce: e.target.checked }));
              }}
              className="mt-0.5 rounded accent-emerald-400 cursor-pointer w-4 h-4"
            />
            <div className="flex flex-col text-xs leading-tight">
              <span className="font-bold text-emerald-300">Fuerza Neta (ΣF)</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Flecha suma resultante</span>
            </div>
          </label>

        </div>

        {/* MODO CUESTA (PLANO INCLINADO CUESTA ABAJO) */}
        <div className="pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-200">Terreno / Inclinación:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { sound.playClick(); setInclineAngle(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                inclineAngle === 0
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-400/80 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>📏 Plano Horizontal (0°)</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setInclineAngle(inclineAngle > 0 ? inclineAngle : 20); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                inclineAngle > 0
                  ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-extrabold shadow-md shadow-cyan-500/30'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>📐 Modo Cuesta Abajo</span>
            </button>

            {inclineAngle > 0 && (
              <div className="flex items-center gap-1 bg-slate-950/90 border border-slate-800 p-1 rounded-xl">
                {[10, 20, 30].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => { sound.playClick(); setInclineAngle(deg); }}
                    className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      inclineAngle === deg
                        ? 'bg-cyan-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* The Central Simulator Stage (Box, Vectors & Surface) */}
      <div className="w-full">
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
          inclineAngle={inclineAngle}
          slopeParallelForce={derived.slopeParallelForce}
          netForce={derived.netHorizontalForce}
          visibilityFilters={visibilityFilters}
        />
      </div>

      {/* Grid: Left = Material Selector & Motion Controls; Right = Real-Time Friction Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Column: Cambios de Materiales y Control de Fuerza (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md gap-4">
          
          {/* Cambios de Materiales */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <span>Cambiar Superficie:</span>
              </label>
              <span className="text-xs text-cyan-400 font-mono">
                {activeMaterial.name.split(' ')[0]} (μs: {activeMaterial.muS} · μk: {activeMaterial.muK})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(Object.keys(MATERIALS) as MaterialId[]).map((id) => {
                const mat = MATERIALS[id];
                const isSelected = materialId === id;
                return (
                  <button
                    key={id}
                    onClick={() => { sound.playClick(); setMaterialId(id); }}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-400 shadow-md shadow-cyan-500/20 text-white font-bold scale-[1.02]'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: mat.accentColor }}
                    />
                    <span className="text-xs truncate w-full">{mat.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-400 font-mono">μs:{mat.muS}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Applied Force Slider & Value */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Empuje / Fuerza Aplicada:</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-cyan-300 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded">
                  {appliedForce} N
                </span>
                <button
                  onClick={() => { sound.playClick(); setAppliedForce(0); }}
                  className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                >
                  0 N
                </button>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={appliedForce}
              onChange={(e) => setAppliedForce(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 N (Suelto)</span>
              <span>100 N</span>
              <span>200 N (Fuerte)</span>
            </div>
          </div>

          {/* Masa Control or Fixed Status */}
          {visibilityFilters.includeMass ? (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Masa del Objeto:</span>
                </span>
                <span className="font-mono font-bold text-sm text-cyan-300 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded">
                  {mass} kg
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 kg (Ligera)</span>
                <span>25 kg</span>
                <span>50 kg (Pesada)</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-400">
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                <span>Masa:</span>
              </span>
              <span className="font-mono text-cyan-300/80 bg-slate-900 px-2 py-0.5 rounded border border-slate-700/60 text-[11px]">
                10 kg (Fija predeterminada)
              </span>
            </div>
          )}

          {/* Selector de Límite de Velocidad (Governor) */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>LÍMITE:</span>
            </div>
            <div className="flex items-center gap-1">
              {[
                { label: 'Sin límite', val: null },
                { label: '10 m/s', val: 10 },
                { label: '25 m/s', val: 25 },
                { label: '50 m/s', val: 50 },
              ].map((item) => {
                const active = speedLimit === item.val;
                return (
                  <button
                    key={item.label}
                    onClick={() => { sound.playClick(); setSpeedLimit(item.val); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Essential Play / Pause / Reset Buttons */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2.5">
            {status !== 'running' ? (
              <button
                onClick={() => { sound.playClick(); onStart(); }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-[1.01] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>INICIAR</span>
              </button>
            ) : (
              <button
                onClick={() => { sound.playClick(); onPause(); }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-[1.01] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5 fill-slate-950" />
                <span>PAUSAR</span>
              </button>
            )}

            <button
              onClick={() => { sound.playClick(); onReset(); }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>REINICIAR</span>
            </button>
          </div>

        </div>

        {/* Right Column: Cuadro de Curva de Fricción en Tiempo Real (6 cols) */}
        <div className="lg:col-span-6 flex">
          <FrictionGraph
            appliedForce={appliedForce}
            derived={derived}
            isMoving={velocity > 0.001}
          />
        </div>

      </div>

    </div>
  );
};
