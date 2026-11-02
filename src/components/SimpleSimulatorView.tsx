import React from 'react';
import { ArrowRight, Compass, HelpCircle, Play, Pause, RotateCcw, Zap, Sparkles } from 'lucide-react';
import { Material, MaterialId, MotionState, PhysicsDerivedValues, SimulationStatus } from '../types/physics';
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
  onOpenExplain
}) => {
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
              Prueba empujar la caja y cambiar de superficie
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
