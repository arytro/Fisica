import React from 'react';
import { PhysicsDerivedValues } from '../types/physics';
import { ArrowUpRight, Activity, Zap, Anchor, ShieldCheck, Gauge, CheckCircle2, Lock } from 'lucide-react';

interface PhysicalIndicatorsProps {
  appliedForce: number;
  derived: PhysicsDerivedValues;
  velocity: number;
  acceleration: number;
}

export const PhysicalIndicators: React.FC<PhysicalIndicatorsProps> = ({
  appliedForce,
  derived,
  velocity,
  acceleration
}) => {
  const isMoving = velocity > 0.001;

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      
      {/* 1. Fuerza Aplicada */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium">F. Aplicada</span>
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="mt-2">
          <div className="font-mono font-bold text-xl text-cyan-300 tabular-nums">
            {appliedForce.toFixed(1)} <span className="text-xs font-normal text-slate-400 font-sans">N</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            F_app horizontal
          </div>
        </div>
      </div>

      {/* 2. Fricción Actual (Estática o Cinética) */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium">F. Fricción</span>
          <Anchor className="w-3.5 h-3.5 text-rose-400" />
        </div>
        <div className="mt-2">
          <div className="font-mono font-bold text-xl text-rose-300 tabular-nums">
            {derived.actualFriction.toFixed(1)} <span className="text-xs font-normal text-slate-400 font-sans">N</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isMoving ? 'bg-amber-400' : 'bg-cyan-400'}`} />
            <span>{isMoving ? 'Cinética (fk)' : 'Estática (fs)'}</span>
          </div>
        </div>
      </div>

      {/* 3. Fricción Estática Máxima */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium">fs Máxima</span>
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="mt-2">
          <div className="font-mono font-bold text-xl text-amber-300 tabular-nums">
            {derived.maxStaticFriction.toFixed(1)} <span className="text-xs font-normal text-slate-400 font-sans">N</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Umbral de ruptura
          </div>
        </div>
      </div>

      {/* 4. Fuerza Normal */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium">F. Normal</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="mt-2">
          <div className="font-mono font-bold text-xl text-emerald-300 tabular-nums">
            {derived.normalForce.toFixed(1)} <span className="text-xs font-normal text-slate-400 font-sans">N</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
            N = m·g (9.81 m/s²)
          </div>
        </div>
      </div>

      {/* 5. Aceleración */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium">Aceleración</span>
          <Activity className="w-3.5 h-3.5 text-sky-400" />
        </div>
        <div className="mt-2">
          <div className={`font-mono font-bold text-xl tabular-nums ${acceleration > 0 ? 'text-sky-300' : acceleration < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            {acceleration.toFixed(2)} <span className="text-xs font-normal text-slate-400 font-sans">m/s²</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            a = F_neta / m
          </div>
        </div>
      </div>

      {/* 6. Velocidad y Estado */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium">Velocidad</span>
          <Gauge className="w-3.5 h-3.5 text-teal-400" />
        </div>
        <div className="mt-2">
          <div className="font-mono font-bold text-xl text-teal-300 tabular-nums">
            {velocity.toFixed(2)} <span className="text-xs font-normal text-slate-400 font-sans">m/s</span>
          </div>
          <div className="text-[10px] mt-0.5 font-bold flex items-center gap-1">
            {isMoving ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> EN MOVIMIENTO
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> EN REPOSO
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
