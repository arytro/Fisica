import React, { useMemo } from 'react';
import { Material, MotionState } from '../types/physics';
import { ArrowRight, MoveRight, Flame, ShieldAlert, Sparkles, Gauge } from 'lucide-react';

interface PhysicsStageProps {
  mass: number;
  appliedForce: number;
  actualFriction: number;
  normalForce: number;
  weight: number;
  maxStaticFriction: number;
  kineticFriction: number;
  isOvercomingStatic: boolean;
  velocity: number;
  acceleration: number;
  position: number;
  distanceTraveled: number;
  motionState: MotionState;
  material: Material;
  showStaticBreachedAlert: boolean;
  speedLimit?: number | null;
  isSpeedLimited?: boolean;
}

export const PhysicsStage: React.FC<PhysicsStageProps> = ({
  mass,
  appliedForce,
  actualFriction,
  normalForce,
  weight,
  maxStaticFriction,
  kineticFriction,
  isOvercomingStatic,
  velocity,
  acceleration,
  position,
  distanceTraveled,
  motionState,
  material,
  showStaticBreachedAlert,
  speedLimit,
  isSpeedLimited
}) => {
  // Arrow scale factors (pixels per Newton)
  const maxArrowLength = 140;
  const forceScale = 0.65;

  const appliedArrowWidth = Math.min(maxArrowLength, Math.max(16, appliedForce * forceScale));
  const frictionArrowWidth = Math.min(maxArrowLength, Math.max(14, actualFriction * forceScale));
  const normalArrowHeight = Math.min(100, Math.max(20, (normalForce / 500) * 80 + 20));
  const weightArrowHeight = normalArrowHeight;

  // Box dimensions based on mass (subtly grows with mass for physical realism)
  const boxWidth = Math.round(70 + (mass / 50) * 35); // 70px to 105px
  const boxHeight = Math.round(55 + (mass / 50) * 25); // 55px to 80px

  // Normalized visual track position (wrapped within 0 to 100% of visible viewport track)
  const visualXPercent = useMemo(() => {
    // Loop smoothly across track (offset of 15% to 75%)
    const trackSpan = 60; // percent
    const cycle = (position * 15) % trackSpan;
    return 15 + cycle;
  }, [position]);

  const isMoving = velocity > 0.01;

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-950 via-[#0c1322] to-slate-950 border border-sky-950/60 p-4 sm:p-6 overflow-hidden shadow-2xl shadow-cyan-950/20 select-none">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-40 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-1/4 w-96 h-40 bg-sky-600/5 blur-3xl pointer-events-none rounded-full" />

      {/* Stage Header Info / Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <span className="text-slate-500">Superficie activa:</span>
            <span className="font-semibold text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: material.accentColor }} />
              {material.name}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>μs = <strong className="text-cyan-300 font-mono">{material.muS.toFixed(2)}</strong></span>
            <span>·</span>
            <span>μk = <strong className="text-amber-300 font-mono">{material.muK.toFixed(2)}</strong></span>
          </div>
        </div>

        {/* Motion State & Speed Limit Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {speedLimit && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all ${
              isSpeedLimited
                ? 'bg-amber-500/25 border-amber-400 text-amber-200 animate-pulse shadow-md shadow-amber-500/20'
                : 'bg-slate-900/90 border-slate-700 text-slate-300'
            }`}>
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tope: {speedLimit} m/s {isSpeedLimited ? '· [REGULADO]' : ''}</span>
            </div>
          )}

          {isMoving ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-pulse">
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              <span>EN MOVIMIENTO ({velocity.toFixed(2)} m/s)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>EN REPOSO (v = 0.00 m/s)</span>
            </div>
          )}

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 text-xs font-mono">
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            <span>d = {distanceTraveled.toFixed(2)} m</span>
          </div>
        </div>
      </div>

      {/* Speed Limit Governor Alert Banner */}
      {isSpeedLimited && (
        <div className="absolute top-16 right-6 z-30 transition-all duration-300">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-200 text-xs font-bold font-mono shadow-lg shadow-amber-500/10">
            <Gauge className="w-4 h-4 text-amber-400 animate-spin" />
            <span>LÍMITE ALCANZADO ({speedLimit} m/s) - REGULADOR ACTIVO</span>
          </div>
        </div>
      )}

      {/* Breached Static Friction Notification Banner */}
      {showStaticBreachedAlert && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 transition-all duration-300">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/30 border border-white/40 animate-bounce">
            <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
            <span>¡EL OBJETO HA SUPERADO LA FRICCIÓN ESTÁTICA!</span>
          </div>
        </div>
      )}

      {/* 2.5D Physical Simulation Arena */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl bg-[#070b14] border border-slate-800/80 overflow-hidden flex flex-col justify-end">
        
        {/* Lab Background Grid and Depth Horizon */}
        <div className="absolute inset-0 lab-grid-bg opacity-30" />
        
        {/* Upper Wall Depth Shadow */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

        {/* Metric ruler backdrop on the laboratory back wall */}
        <div className="absolute top-12 left-0 right-0 flex justify-between px-6 opacity-25 text-[10px] font-mono text-cyan-400 select-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-3 w-px bg-cyan-400" />
              <span>{i * 2}m</span>
            </div>
          ))}
        </div>

        {/* 2.5D Stage Runway & Surface Area */}
        <div className="relative w-full z-10">

          {/* Crate Object Container with dynamic position */}
          <div
            className="absolute bottom-14 transition-transform duration-75 will-change-transform"
            style={{
              left: `${visualXPercent}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {/* VECTOR ARROWS - Centered on Crate */}
            
            {/* 1. Normal Force Arrow (UP - Emerald) */}
            <div
              className="absolute left-1/2 bottom-[100%] -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-150"
              style={{ height: `${normalArrowHeight}px` }}
            >
              <div className="text-[10px] font-mono font-bold text-emerald-400 whitespace-nowrap bg-slate-950/90 px-1.5 py-0.5 rounded border border-emerald-500/30 mb-0.5 shadow-sm">
                N = {normalForce.toFixed(1)} N
              </div>
              <div className="w-0.5 flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400" />
              <div className="w-0 h-0 border-x-4 border-x-transparent border-b-6 border-b-emerald-400 -mt-1 rotate-180" />
            </div>

            {/* 2. Weight / Gravity Arrow (DOWN - Violet) */}
            <div
              className="absolute left-1/2 top-[100%] -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-150 z-20"
              style={{ height: `${weightArrowHeight}px` }}
            >
              <div className="w-0.5 flex-1 bg-gradient-to-b from-indigo-500 to-violet-400" />
              <div className="w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-violet-400 -mb-1" />
              <div className="text-[10px] font-mono font-bold text-violet-300 whitespace-nowrap bg-slate-950/90 px-1.5 py-0.5 rounded border border-violet-500/30 mt-0.5 shadow-sm">
                P = {weight.toFixed(1)} N
              </div>
            </div>

            {/* 3. Applied Force Arrow (RIGHT - Electric Cyan) */}
            {appliedForce > 0 && (
              <div
                className="absolute top-1/2 left-[100%] -translate-y-1/2 flex items-center pointer-events-none transition-all duration-100 z-20"
                style={{ width: `${appliedArrowWidth}px` }}
              >
                <div className="h-1 flex-1 bg-gradient-to-r from-sky-500 to-cyan-300 shadow-sm shadow-cyan-400" />
                <div className="w-0 h-0 border-y-4 border-y-transparent border-l-6 border-l-cyan-300 -ml-1" />
                <div className="text-[10px] font-mono font-bold text-cyan-300 whitespace-nowrap bg-slate-950/90 px-1.5 py-0.5 rounded border border-cyan-400/40 ml-1.5 shadow-sm">
                  F_app = {appliedForce.toFixed(0)} N
                </div>
              </div>
            )}

            {/* 4. Friction Force Arrow (LEFT - Amber/Red) */}
            {actualFriction > 0 && (
              <div
                className="absolute top-1/2 right-[100%] -translate-y-1/2 flex items-center flex-row-reverse pointer-events-none transition-all duration-100 z-20"
                style={{ width: `${frictionArrowWidth}px` }}
              >
                <div className="h-1 flex-1 bg-gradient-to-l from-amber-500 to-rose-400 shadow-sm shadow-rose-400/50" />
                <div className="w-0 h-0 border-y-4 border-y-transparent border-r-6 border-r-rose-400 -mr-1" />
                <div className="text-[10px] font-mono font-bold text-rose-300 whitespace-nowrap bg-slate-950/90 px-1.5 py-0.5 rounded border border-rose-500/40 mr-1.5 shadow-sm">
                  {isMoving ? 'fk' : 'fs'} = {actualFriction.toFixed(1)} N
                </div>
              </div>
            )}

            {/* Movement Direction Indicator Badge */}
            {isMoving && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[9px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full whitespace-nowrap animate-pulse shadow-md">
                <span>Avance</span>
                <MoveRight className="w-3 h-3 text-emerald-400" />
              </div>
            )}

            {/* 2.5D Crate Visual Graphic */}
            <div
              className="relative cursor-pointer transition-transform group"
              style={{
                width: `${boxWidth}px`,
                height: `${boxHeight}px`
              }}
            >
              {/* Box Top 2.5D Facet */}
              <div
                className="absolute -top-3 left-2 right-0 h-3 rounded-t-sm bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 border-t border-r border-amber-300/40"
                style={{
                  transform: 'skewX(-45deg)',
                  transformOrigin: 'bottom left'
                }}
              />

              {/* Box Right 2.5D Facet */}
              <div
                className="absolute top-0 -right-3 bottom-0 w-3 rounded-r-sm bg-gradient-to-b from-amber-800 to-amber-950 border-r border-b border-black/50"
                style={{
                  transform: 'skewY(-45deg)',
                  transformOrigin: 'top left'
                }}
              />

              {/* Box Front Face (Main body) */}
              <div className="w-full h-full rounded-md bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 border border-amber-500/50 shadow-xl flex flex-col justify-between p-1.5 relative overflow-hidden">
                
                {/* Wood planks or metal reinforcing texture */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_8px,rgba(0,0,0,0.4)_8px,rgba(0,0,0,0.4)_10px)]" />

                {/* Diagonal reinforcement braces */}
                <div className="absolute inset-2 border border-amber-900/40 pointer-events-none" />

                {/* Top crate label */}
                <div className="flex items-center justify-between z-10">
                  <span className="text-[9px] font-mono font-bold text-amber-200/90 bg-amber-950/70 px-1 py-0.5 rounded">
                    FR-LAB
                  </span>
                  <span className="text-[8px] font-mono text-amber-300/70">
                    #BOX
                  </span>
                </div>

                {/* Center Mass Badge */}
                <div className="text-center z-10 my-auto">
                  <div className="text-xs sm:text-sm font-extrabold font-mono text-white tracking-tight drop-shadow">
                    {mass} kg
                  </div>
                  <div className="text-[8px] font-semibold text-amber-200/80 uppercase">
                    Objeto de Prueba
                  </div>
                </div>

                {/* Bottom Handle / Grip */}
                <div className="w-8 h-1 bg-amber-950/80 rounded mx-auto border border-amber-500/30 z-10" />
              </div>

              {/* Crate Dynamic Drop Shadow */}
              <div
                className="absolute -bottom-2 left-1 right-1 h-3 bg-black/60 rounded-full blur-[2px] -z-10 transition-all"
                style={{
                  width: `${boxWidth + 6}px`
                }}
              />

              {/* Sliding friction sparks / dust particles (when moving) */}
              {isMoving && (
                <div className="absolute -bottom-1 -left-4 flex gap-1 pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 animate-ping" />
                  <span className="w-1 h-1 rounded-full bg-amber-400/80 animate-pulse delay-75" />
                  <span className="w-2 h-0.5 bg-slate-400/60 rounded -rotate-12" />
                </div>
              )}
            </div>

          </div>

          {/* Physical Track Surface Layer (2.5D Isometric Ground) */}
          <div className="relative w-full h-14 overflow-hidden border-t-2 border-slate-700/80">
            
            {/* Surface Texture based on selected material */}
            <div
              className="absolute inset-0 transition-all duration-300"
              style={{
                background: material.surfacePattern,
                opacity: 0.85
              }}
            />

            {/* Perspective Depth Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70 pointer-events-none" />

            {/* Subtle Surface Texture Highlights */}
            {material.id === 'hielo' && (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.4)_0%,_transparent_70%)] pointer-events-none" />
            )}

            {/* Track Tick Marks */}
            <div className="absolute bottom-1 left-0 right-0 flex justify-between px-4 opacity-40 text-[9px] font-mono text-slate-300">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="h-1.5 w-0.5 bg-slate-300" />
                </div>
              ))}
            </div>

            {/* Surface Label Badge in bottom right corner */}
            <div className="absolute bottom-2 right-4 z-10 flex items-center gap-2 px-2.5 py-1 rounded bg-slate-950/80 border border-slate-700/60 text-[10px] text-slate-300 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: material.accentColor }} />
              <span className="font-semibold text-white">{material.name}</span>
              <span className="text-slate-400 font-mono">μs: {material.muS} | μk: {material.muK}</span>
            </div>

          </div>

          {/* Under-Track Industrial Foundation */}
          <div className="w-full h-4 bg-gradient-to-b from-slate-900 to-black border-t border-slate-800" />
        </div>

      </div>

      {/* Free-Body Diagram Legend Banner */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-400">
          <span className="text-[11px] font-semibold text-slate-300">Diagrama de Cuerpo Libre:</span>
          
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-cyan-400 rounded-sm" />
            <span>Fuerza Aplicada (F_app)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-rose-400 rounded-sm" />
            <span>Fuerza de Fricción (f)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-400 rounded-sm" />
            <span>Fuerza Normal (N)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-violet-400 rounded-sm" />
            <span>Peso / Gravedad (P = mg)</span>
          </div>
        </div>

        {/* Quick summary comparison */}
        <div className="text-[11px] font-mono text-slate-400">
          Umbral estático: <strong className="text-cyan-300 font-bold">{maxStaticFriction.toFixed(1)} N</strong>
          {' '}| Fricción cinética: <strong className="text-amber-300 font-bold">{kineticFriction.toFixed(1)} N</strong>
        </div>
      </div>

    </div>
  );
};
