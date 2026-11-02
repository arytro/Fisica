import React, { useState } from 'react';
import { X, Copy, Check, FileSpreadsheet, Download } from 'lucide-react';
import { Material, PhysicsDerivedValues } from '../types/physics';
import { sound } from '../utils/audio';

interface LabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mass: number;
  material: Material;
  appliedForce: number;
  derived: PhysicsDerivedValues;
  velocity: number;
  acceleration: number;
  distanceTraveled: number;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({
  isOpen,
  onClose,
  mass,
  material,
  appliedForce,
  derived,
  velocity,
  acceleration,
  distanceTraveled
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reportText = `================================================
REPORTE DE LABORATORIO DE FÍSICA - FRICTION LAB
Politécnico · Laboratorio de Mecánica y Rozamiento
================================================
Fecha de toma de datos: ${new Date().toLocaleDateString('es-DO')}
Objeto de prueba: Caja rígida de prueba

PARÁMETROS EXPERIMENTALES:
- Masa del objeto (m): ${mass.toFixed(1)} kg
- Gravedad estándar (g): 9.81 m/s²
- Superficie de contacto: ${material.name}
- Coeficiente estático (μs): ${material.muS}
- Coeficiente cinético (μk): ${material.muK}

CÁLCULOS ESTÁTICOS Y NORMAL:
- Fuerza Normal (N = m·g): ${derived.normalForce.toFixed(2)} N
- Peso del objeto (W = m·g): ${derived.weight.toFixed(2)} N
- Fricción estática máxima (fs_máx = μs·N): ${derived.maxStaticFriction.toFixed(2)} N
- Fricción cinética teórica (fk = μk·N): ${derived.kineticFriction.toFixed(2)} N

ESTADO CINEMÁTICO ACTUAL:
- Fuerza horizontal aplicada (F_app): ${appliedForce.toFixed(1)} N
- Fuerza de fricción opuesta (f): ${derived.actualFriction.toFixed(2)} N
- Estado: ${velocity > 0.01 ? 'EN MOVIMIENTO' : 'EN REPOSO'}
- Aceleración instantánea (a): ${acceleration.toFixed(2)} m/s²
- Velocidad actual (v): ${velocity.toFixed(2)} m/s
- Distancia recorrida (d): ${distanceTraveled.toFixed(2)} m
================================================`;

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c1220] border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-cyan-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-white">Datos del Experimento para Informe</h3>
              <p className="text-xs text-slate-400">Formato listo para copiar a tu cuaderno o reporte de física escolar</p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Box */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed selection:bg-cyan-500/30">
            {reportText}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Física Clásica · Leyes de Newton y Rozamiento
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-md shadow-cyan-500/20"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar Reporte'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
