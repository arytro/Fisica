import React from 'react';
import { BookOpen, Check, X, ArrowRight, Zap, Shield, Car, Footprints, Flame, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface LearnSectionProps {
  onGoToLab: () => void;
}

export const LearnSection: React.FC<LearnSectionProps> = ({ onGoToLab }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Section Header */}
      <div className="bg-slate-900/90 rounded-2xl border border-sky-900/40 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Módulo de Aprendizaje</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Fundamentos de la Fricción en la Física y la Ingeniería
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Conceptos clave, contrastes físicos y aplicaciones prácticas para estudiantes de politécnico
          </p>
        </div>

        <button
          onClick={() => { sound.playClick(); onGoToLab(); }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shrink-0 shadow-md shadow-cyan-500/20"
        >
          <span>Ir al Simulador</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 1. Diferencias entre Fricción Estática y Cinética (Interactive Comparison Table) */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white font-display flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          1. Fricción Estática vs Fricción Cinética
        </h3>
        <p className="text-xs text-slate-300">
          La principal distinción radica en si existe o no movimiento relativo entre las superficies en contacto.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-3">Característica</th>
                <th className="py-3 px-3 text-cyan-300 bg-cyan-950/20">Fricción Estática (fs)</th>
                <th className="py-3 px-3 text-amber-300 bg-amber-950/20">Fricción Cinética (fk)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-400">Estado de movimiento</td>
                <td className="py-2.5 px-3 bg-cyan-950/10 text-cyan-200">En reposo relativo (v = 0)</td>
                <td className="py-2.5 px-3 bg-amber-950/10 text-amber-200">En deslizamiento activo (v &gt; 0)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-400">Valor de la fuerza</td>
                <td className="py-2.5 px-3 bg-cyan-950/10">Variable (se adapta: fs = F_app)</td>
                <td className="py-2.5 px-3 bg-amber-950/10">Constante (fk = μk · N)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-400">Fórmula matemática</td>
                <td className="py-2.5 px-3 bg-cyan-950/10 font-bold text-cyan-300">fs ≤ μs · N</td>
                <td className="py-2.5 px-3 bg-amber-950/10 font-bold text-amber-300">fk = μk · N</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-400">Magnitud del coeficiente</td>
                <td className="py-2.5 px-3 bg-cyan-950/10">Mayor (μs &gt; μk)</td>
                <td className="py-2.5 px-3 bg-amber-950/10">Menor (μk &lt; μs)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-sans font-medium text-slate-400">Efecto en el objeto</td>
                <td className="py-2.5 px-3 bg-cyan-950/10">Evita que inicie el movimiento</td>
                <td className="py-2.5 px-3 bg-amber-950/10">Frena y desacelera el objeto</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Ejemplos de la Vida Cotidiana */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white font-display flex items-center gap-2">
          <Footprints className="w-4 h-4 text-emerald-400" />
          2. La Fricción en Nuestra Vida Diaria
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Footprints className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Caminar y Correr</h4>
            <p className="text-slate-400">
              Al caminar, el pie empuja el suelo hacia atrás. Gracias a la <strong>fricción estática</strong> entre el calzado y el piso, el suelo responde empujándonos hacia adelante (Tercera Ley de Newton). Sin fricción (como en hielo pulido), resbalaríamos en el mismo sitio.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-sky-500/10 text-cyan-400 border border-sky-500/20">
              <Car className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Frenos y Neumáticos</h4>
            <p className="text-slate-400">
              En los vehículos de motor, las pastillas de freno presionan los discos generando <strong>fricción cinética</strong> para disipar la energía del carro en forma de calor y detenerlo con seguridad.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Fósforos y Clavos</h4>
            <p className="text-slate-400">
              Encender un fósforo requiere raspar la cabeza contra la lija; la fricción genera calor suficiente para iniciar la combustión química. Asimismo, los clavos y tornillos se sostienen en la madera exclusivamente gracias a la fricción estática.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Ventajas y Desventajas de la Fricción */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Ventajas */}
        <div className="bg-slate-900/80 rounded-2xl border border-emerald-950/80 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Check className="w-4 h-4" />
            <span>Ventajas Indispensables</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Permite la tracción de ruedas, cintas transportadoras y calzado.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Posibilita sostener objetos con las manos sin que se escurran.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Detiene vehículos mediante sistemas de frenos mecánicos y de disco.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Mantiene unidas estructuras atornilladas, nudos y clavos.</span>
            </li>
          </ul>
        </div>

        {/* Desventajas */}
        <div className="bg-slate-900/80 rounded-2xl border border-rose-950/80 p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <X className="w-4 h-4" />
            <span>Desventajas y Pérdidas Energéticas</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400">•</span>
              <span>Desgasta piezas mecánicas, engranajes y motores con el tiempo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400">•</span>
              <span>Genera calor no deseado, disipando valiosa energía útil del sistema.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400">•</span>
              <span>Reduce la eficiencia energética de maquinaria, requiriendo lubricantes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400">•</span>
              <span>Limita la velocidad máxima en medios de transporte terrestres y fluidos.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* 4. Resumen de Fórmulas Fundamentales */}
      <div className="bg-slate-900/80 rounded-2xl border border-sky-900/40 p-6 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white font-display flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          4. Fórmulas Fundamentales (Física Clásica)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block font-sans">Fuerza Normal (horizontal)</span>
            <strong className="text-sm text-emerald-300">N = m · g</strong>
            <p className="text-[10px] text-slate-400 font-sans mt-1">m en kg, g = 9.81 m/s²</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block font-sans">Fricción Estática Máxima</span>
            <strong className="text-sm text-cyan-300">fs_máx = μs · N</strong>
            <p className="text-[10px] text-slate-400 font-sans mt-1">Fuerza requerida para mover</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block font-sans">Fricción Cinética</span>
            <strong className="text-sm text-amber-300">fk = μk · N</strong>
            <p className="text-[10px] text-slate-400 font-sans mt-1">Fuerza opositora al deslizar</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block font-sans">Aceleración Neta</span>
            <strong className="text-sm text-sky-300">a = (F_app - fk) / m</strong>
            <p className="text-[10px] text-slate-400 font-sans mt-1">Segunda Ley de Newton</p>
          </div>
        </div>
      </div>

    </div>
  );
};
