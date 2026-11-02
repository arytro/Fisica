import React from 'react';
import { PhysicsDerivedValues } from '../types/physics';
import { LineChart, Info } from 'lucide-react';

interface FrictionGraphProps {
  appliedForce: number;
  derived: PhysicsDerivedValues;
  isMoving: boolean;
}

export const FrictionGraph: React.FC<FrictionGraphProps> = ({
  appliedForce,
  derived,
  isMoving
}) => {
  // Chart dimensions & margins
  const width = 560;
  const height = 280;
  const margin = { top: 25, right: 30, bottom: 45, left: 55 };

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Maximum scales for forces (dynamic based on fs_max or fixed at 200N)
  const maxAxisForce = Math.max(200, derived.maxStaticFriction * 1.25);

  const scaleX = (val: number) => margin.left + (val / maxAxisForce) * plotWidth;
  const scaleY = (val: number) => margin.top + plotHeight - (val / maxAxisForce) * plotHeight;

  const fsMax = derived.maxStaticFriction;
  const fk = derived.kineticFriction;

  // Coordinates of key curve points
  const x0 = scaleX(0);
  const y0 = scaleY(0);

  const xThreshold = scaleX(fsMax);
  const yFsMax = scaleY(fsMax);
  const yFk = scaleY(fk);

  const xEnd = scaleX(maxAxisForce);

  // Current operating point
  const currentX = scaleX(Math.min(maxAxisForce, appliedForce));
  const currentY = scaleY(Math.min(maxAxisForce, derived.actualFriction));

  const isPastThreshold = appliedForce > fsMax;

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-sky-900/40 p-4 sm:p-5 shadow-xl flex flex-col justify-between backdrop-blur-md">
      
      {/* Graph Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <LineChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-display">
              Curva de Fricción en Tiempo Real
            </h3>
            <p className="text-[11px] text-slate-400">
              Fuerza de Fricción (f) vs Fuerza Aplicada (F_app)
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-300">
            {isMoving ? 'Zona Cinética' : isPastThreshold ? 'Ruptura Estática' : 'Zona Estática'}
          </span>
        </div>
      </div>

      {/* SVG Vector Chart */}
      <div className="w-full overflow-x-auto my-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[320px] select-none"
        >
          <defs>
            {/* Gradient for static area */}
            <linearGradient id="staticAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
            </linearGradient>

            {/* Gradient for kinetic area */}
            <linearGradient id="kineticAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal & vertical) */}
          {[0.25, 0.5, 0.75, 1].map((pct) => {
            const forceVal = maxAxisForce * pct;
            const yPos = scaleY(forceVal);
            const xPos = scaleX(forceVal);
            return (
              <g key={pct} opacity={0.15}>
                <line
                  x1={margin.left}
                  y1={yPos}
                  x2={width - margin.right}
                  y2={yPos}
                  stroke="#38bdf8"
                  strokeDasharray="3 3"
                />
                <line
                  x1={xPos}
                  y1={margin.top}
                  x2={xPos}
                  y2={height - margin.bottom}
                  stroke="#38bdf8"
                  strokeDasharray="3 3"
                />
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={width - margin.right}
            y2={height - margin.bottom}
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={height - margin.bottom}
            stroke="#64748b"
            strokeWidth="1.5"
          />

          {/* Axis Labels */}
          <text
            x={width - margin.right}
            y={height - 12}
            textAnchor="end"
            fill="#94a3b8"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="bold"
          >
            Fuerza Aplicada (N) →
          </text>

          <text
            x={-height / 2}
            y={16}
            transform="rotate(-90)"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="bold"
          >
            Fuerza de Fricción (N) →
          </text>

          {/* Static Region Shaded Polygon */}
          <polygon
            points={`${x0},${y0} ${xThreshold},${yFsMax} ${xThreshold},${y0}`}
            fill="url(#staticAreaGrad)"
          />

          {/* Kinetic Region Shaded Polygon */}
          <polygon
            points={`${xThreshold},${y0} ${xThreshold},${yFk} ${xEnd},${yFk} ${xEnd},${y0}`}
            fill="url(#kineticAreaGrad)"
          />

          {/* Vertical boundary line at threshold */}
          <line
            x1={xThreshold}
            y1={margin.top}
            x2={xThreshold}
            y2={height - margin.bottom}
            stroke="#38bdf8"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.4"
          />

          {/* THE PHYSICAL FRICTION CURVE */}
          {/* 1. Static slope line (f_s = F_app) */}
          <line
            x1={x0}
            y1={y0}
            x2={xThreshold}
            y2={yFsMax}
            stroke="#38bdf8"
            strokeWidth="2.5"
          />

          {/* 2. Drop from static maximum to kinetic friction */}
          <line
            x1={xThreshold}
            y1={yFsMax}
            x2={xThreshold}
            y2={yFk}
            stroke="#f43f5e"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* 3. Kinetic friction horizontal plateau (f_k = mu_k * N) */}
          <line
            x1={xThreshold}
            y1={yFk}
            x2={xEnd}
            y2={yFk}
            stroke="#f59e0b"
            strokeWidth="2.5"
          />

          {/* Critical Point Labels */}
          {/* Static Peak Circle */}
          <circle cx={xThreshold} cy={yFsMax} r="4" fill="#38bdf8" stroke="#0b0f19" strokeWidth="2" />
          <text
            x={xThreshold}
            y={yFsMax - 10}
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="bold"
          >
            fs máx = {fsMax.toFixed(1)} N
          </text>

          {/* Kinetic Plateau Point Circle */}
          <circle cx={xThreshold} cy={yFk} r="4" fill="#f59e0b" stroke="#0b0f19" strokeWidth="2" />
          <text
            x={xThreshold + 8}
            y={yFk - 8}
            textAnchor="start"
            fill="#fbbf24"
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="bold"
          >
            fk = {fk.toFixed(1)} N
          </text>

          {/* Dynamic Live Operating Marker (Current State of Simulation) */}
          <g>
            {/* Outer pulse */}
            <circle
              cx={currentX}
              cy={currentY}
              r="9"
              fill={isMoving ? '#10b981' : '#06b6d4'}
              opacity="0.25"
              className="animate-ping"
            />
            {/* Point marker */}
            <circle
              cx={currentX}
              cy={currentY}
              r="5"
              fill={isMoving ? '#10b981' : '#22d3ee'}
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>

          {/* Region Annotations */}
          <text
            x={scaleX(fsMax * 0.45)}
            y={scaleY(fsMax * 0.2)}
            textAnchor="middle"
            fill="#0284c7"
            fontSize="9"
            fontWeight="bold"
            opacity="0.8"
          >
            ZONA ESTÁTICA (fs = F)
          </text>

          <text
            x={scaleX(fsMax + (maxAxisForce - fsMax) * 0.45)}
            y={scaleY(fk * 0.5)}
            textAnchor="middle"
            fill="#d97706"
            fontSize="9"
            fontWeight="bold"
            opacity="0.8"
          >
            ZONA CINÉTICA (fk cte)
          </text>

          {/* Axis Ticks */}
          <text x={margin.left} y={height - margin.bottom + 14} fill="#64748b" fontSize="9" textAnchor="middle">0</text>
          <text x={xThreshold} y={height - margin.bottom + 14} fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">
            {fsMax.toFixed(0)}
          </text>
          <text x={xEnd} y={height - margin.bottom + 14} fill="#64748b" fontSize="9" textAnchor="middle">
            {maxAxisForce.toFixed(0)}
          </text>

          <text x={margin.left - 6} y={yFsMax + 3} fill="#38bdf8" fontSize="9" textAnchor="end" fontWeight="bold">
            {fsMax.toFixed(0)}
          </text>
          <text x={margin.left - 6} y={yFk + 3} fill="#fbbf24" fontSize="9" textAnchor="end" fontWeight="bold">
            {fk.toFixed(0)}
          </text>
        </svg>
      </div>

      {/* Legend & Interpretation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Punto actual: ({appliedForce.toFixed(0)} N, {derived.actualFriction.toFixed(1)} N)</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Nota la caída de resistencia una vez iniciado el movimiento (fk &lt; fs_máx).</span>
        </div>
      </div>

    </div>
  );
};
