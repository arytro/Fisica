import React from 'react';
import { Material, MaterialId, SimulationStatus } from '../types/physics';
import { MATERIALS } from '../data/materials';
import { Play, Pause, RotateCcw, Sliders, Info, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface ControlPanelProps {
  mass: number;
  setMass: (m: number) => void;
  appliedForce: number;
  setAppliedForce: (f: number) => void;
  selectedMaterialId: MaterialId;
  setSelectedMaterialId: (id: MaterialId) => void;
  status: SimulationStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  timeScale: number;
  setTimeScale: (scale: number) => void;
  customMuS?: number;
  setCustomMuS?: (val: number | undefined) => void;
  customMuK?: number;
  setCustomMuK?: (val: number | undefined) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  mass,
  setMass,
  appliedForce,
  setAppliedForce,
  selectedMaterialId,
  setSelectedMaterialId,
  status,
  onStart,
  onPause,
  onReset,
  timeScale,
  setTimeScale
}) => {
  const currentMaterial = MATERIALS[selectedMaterialId];

  const handleForceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAppliedForce(val);
  };

  const handleMassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMass(val);
  };

  const handleMaterialChange = (id: MaterialId) => {
    sound.playClick();
    setSelectedMaterialId(id);
  };

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-sky-900/40 p-5 shadow-xl flex flex-col gap-5 backdrop-blur-md">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-cyan-400 border border-sky-500/20">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-display">Controles del Laboratorio</h2>
            <p className="text-[11px] text-slate-400">Ajusta los parámetros físicos en tiempo real</p>
          </div>
        </div>

        {/* Speed multiplier control */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
          <span className="text-slate-500 px-1.5 hidden sm:inline">Velocidad:</span>
          <button
            onClick={() => { sound.playClick(); setTimeScale(0.5); }}
            className={`px-2 py-0.5 rounded font-mono transition-colors ${
              timeScale === 0.5 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            0.5x
          </button>
          <button
            onClick={() => { sound.playClick(); setTimeScale(1); }}
            className={`px-2 py-0.5 rounded font-mono transition-colors ${
              timeScale === 1 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            1x
          </button>
          <button
            onClick={() => { sound.playClick(); setTimeScale(2); }}
            className={`px-2 py-0.5 rounded font-mono transition-colors ${
              timeScale === 2 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            2x
          </button>
        </div>
      </div>

      {/* Main Sliders Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. Control: Fuerza Aplicada (0 a 200 N) */}
        <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <label htmlFor="applied-force-slider" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fuerza Aplicada (F)</span>
            </label>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-sm text-cyan-300 bg-cyan-950/70 border border-cyan-800/50 px-2.5 py-0.5 rounded-md tabular-nums">
                {appliedForce.toFixed(0)} N
              </span>
              <button
                onClick={() => { sound.playClick(); setAppliedForce(0); }}
                title="Restablecer a 0 N"
                className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                0 N
              </button>
            </div>
          </div>

          <input
            id="applied-force-slider"
            type="range"
            min="0"
            max="200"
            step="1"
            value={appliedForce}
            onChange={handleForceChange}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0 N (Sin empuje)</span>
            <span>100 N</span>
            <span>200 N (Máximo)</span>
          </div>

          {/* Quick Step Buttons */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-500">Paso rápido:</span>
            {[20, 50, 100, 150].map((f) => (
              <button
                key={f}
                onClick={() => { sound.playClick(); setAppliedForce(f); }}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                  appliedForce === f
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {f}N
              </button>
            ))}
          </div>
        </div>

        {/* 2. Control: Masa del Objeto (1 a 50 kg) */}
        <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <label htmlFor="mass-slider" className="text-xs font-semibold text-slate-200">
              Masa del Objeto (m)
            </label>
            <span className="font-mono font-bold text-sm text-sky-300 bg-sky-950/70 border border-sky-800/50 px-2.5 py-0.5 rounded-md tabular-nums">
              {mass.toFixed(0)} kg
            </span>
          </div>

          <input
            id="mass-slider"
            type="range"
            min="1"
            max="50"
            step="1"
            value={mass}
            onChange={handleMassChange}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>1 kg (Ligero)</span>
            <span>25 kg</span>
            <span>50 kg (Pesado)</span>
          </div>

          {/* Quick Mass Presets */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-500">Masa rápida:</span>
            {[5, 10, 20, 40].map((m) => (
              <button
                key={m}
                onClick={() => { sound.playClick(); setMass(m); }}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                  mass === m
                    ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {m}kg
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Selector de Materiales (Hielo, Madera, Cemento, Metal, Goma) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200">
            Superficie de Contacto
          </label>
          <span className="text-[11px] text-slate-400">
            μs = <strong className="text-cyan-300 font-mono">{currentMaterial.muS}</strong>
            {' · '}
            μk = <strong className="text-amber-300 font-mono">{currentMaterial.muK}</strong>
          </span>
        </div>

        {/* Material Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {(Object.keys(MATERIALS) as MaterialId[]).map((id) => {
            const mat = MATERIALS[id];
            const isSelected = selectedMaterialId === id;
            return (
              <button
                key={id}
                onClick={() => handleMaterialChange(id)}
                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 w-full">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: mat.accentColor }}
                  />
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {mat.name.split(' ')[0]}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  μs:{mat.muS} · μk:{mat.muK}
                </div>
              </button>
            );
          })}
        </div>

        {/* Scientific Note on Friction Coefficients */}
        <div className="flex items-start gap-1.5 text-[11px] text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <em>Nota científica:</em> Los coeficientes son valores ilustrativos aproximados de referencia experimental, no constantes universales absolutas del material.
          </span>
        </div>
      </div>

      {/* 4. Action Buttons (INICIAR, PAUSAR, REINICIAR) */}
      <div className="flex items-center gap-3 pt-1 border-t border-slate-800/80">
        
        {status !== 'running' ? (
          <button
            onClick={() => { sound.playClick(); onStart(); }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-emerald-300/40"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>INICIAR SIMULACIÓN</span>
          </button>
        ) : (
          <button
            onClick={() => { sound.playClick(); onPause(); }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-amber-300/40"
          >
            <Pause className="w-4 h-4 fill-slate-950" />
            <span>PAUSAR</span>
          </button>
        )}

        <button
          onClick={() => { sound.playClick(); onReset(); }}
          className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 hover:text-white"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>REINICIAR</span>
        </button>

      </div>

    </div>
  );
};
