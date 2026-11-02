import React, { useState } from 'react';
import { X, HelpCircle, Layers, ArrowRight, CheckCircle2, ChevronRight, ChevronDown, Sparkles, Scale, Activity, Smile, MessageCircleQuestion } from 'lucide-react';
import { sound } from '../utils/audio';

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FaqItem {
  id: string;
  question: string;
  shortAnswer: string;
  kidFriendlyExplanation: string;
  example: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'p-peso',
    question: '¿Por qué el número P= (Peso) cambia cuando cambio la masa del objeto?',
    shortAnswer: 'Porque P es el Peso, y el Peso es qué tan fuerte el planeta Tierra jala a la caja hacia el suelo.',
    kidFriendlyExplanation: 'Imagina que la masa son bloques de juguete que metes dentro de la caja. La Tierra funciona como un imán gigante que atrae cada bloque hacia el centro del planeta con la gravedad (9.81). Si le metes más masa (más bloques), ¡la Tierra la jala con más fuerza hacia abajo! Por eso la fórmula es Peso = masa × 9.81. Si la caja tiene 10 kg, la Tierra la jala con 98.1 N. Si le pones 50 kg, ¡la jala con 490.5 N!',
    example: 'Es como cuando cargas una mochila vacía (pesa poco) contra una llena de libros pesados (la Tierra la jala hacia abajo y te cansa los hombros).'
  },
  {
    id: 'simbolos',
    question: '¿Qué significa cada letra y símbolo raro en la pantalla? (Diccionario sin enredos)',
    shortAnswer: 'Son las iniciales que los científicos usan para no escribir nombres tan largos.',
    kidFriendlyExplanation: `Aquí tienes la lista en español claro:
• m (Masa): Cuánta materia tiene la caja (en kilogramos, kg). Como cuando te subes a una báscula.
• F o F_app (Fuerza aplicada): El empujón que le das a la caja con tus propias manos hacia adelante.
• P o W (Peso / Gravedad): El tirón hacia abajo que hace el planeta Tierra.
• N (Fuerza Normal): ¡El suelo sosteniendo la caja! Si el piso fuera de papel mojado, se rompería. Como es un piso firme, empuja hacia arriba para que la caja no se hunda.
• fs (Fricción Estática): El freno invisible cuando la caja está quietecita. ¡Se adapta a tu empuje!
• fk (Fricción Cinética): El raspón constante cuando la caja ya va patinando por el suelo.
• μ (Mu - la letra griega rara): Mide qué tan resbaloso o áspero es el suelo. Hielo = 0.1 (muy resbaloso), Madera = 0.4 (normal), Goma = 0.9 (se pega casi como goma de mascar).
• a (Aceleración): El "arranque" o qué tan rápido gana velocidad la caja cada segundo.
• v (Velocidad): Qué tan rápido se va moviendo en metros por segundo.`,
    example: 'Todos los símbolos son simplemente las fuerzas que están peleando entre sí en la caja.'
  },
  {
    id: 'friccion-inteligente',
    question: 'Duda curiosa: ¿Por qué si empujo con 5 N la fricción no me empuja con 50 N de golpe?',
    shortAnswer: 'Porque si la fricción fuera mayor que tu empuje estando quieta, ¡la caja se movería sola hacia ti!',
    kidFriendlyExplanation: '¡Piénsalo un segundo! Si la caja está en reposo y tú la empujas con un dedito suave (5 N), si la fricción respondiera con 50 N hacia atrás, la caja saldría volando hacia atrás como empujada por un fantasma. La fricción estática es "inteligente": solo hace la fuerza exacta necesaria para que la caja no se mueva (si empujas con 5 N, frena con 5 N; si empujas con 20 N, frena con 20 N) hasta que llega a su límite máximo.',
    example: 'Es como un portero de fútbol: solo estira las manos donde viene el balón, no se lanza a la tribuna vacía.'
  },
  {
    id: 'dificil-arrancar',
    question: '¿Por qué cuesta mucho más empezar a mover la caja que mantenerla patinando?',
    shortAnswer: 'Porque cuando está quieta, las asperezas del piso encajan como piezas de Lego.',
    kidFriendlyExplanation: 'Aunque un piso de madera parezca liso, bajo un microscopio parece una cordillera de montañas con picos y valles. Cuando la caja pasa un tiempo apoyada, sus piquitos caen dentro de los huecos del piso y se traban fuertemente. Para arrancarla tienes que "desatorar" todas esas trabas de golpe (fricción estática máxima). Pero una vez que ya va patinando rápido, va "esquiando" por encima de los picos y no le da tiempo a encajar tanto, por eso la resistencia baja a la fricción cinética (fk).',
    example: 'Por eso cuando empujas un carro o un sofá, das un quejido al principio, pero luego que rueda ya se empuja con menos esfuerzo.'
  },
  {
    id: 'manos-calientes',
    question: 'Duda curiosa: ¿Por qué se calientan las manos cuando las frotas rápido en un día frío?',
    shortAnswer: '¡Por la fricción cinética!',
    kidFriendlyExplanation: 'Al frotar una mano contra la otra a toda velocidad, las pequeñas asperezas de tu piel chocan millones de veces. La fricción se opone a ese movimiento y transforma la energía de tus músculos en calor térmico. ¡Lo mismo pasa con los frenos de los carros, que se ponen al rojo vivo si frenas muy fuerte!',
    example: 'O como cuando los cavernícolas frotaban dos palitos de madera hasta que la fricción producía fuego.'
  },
  {
    id: 'area-contacto',
    question: 'Duda de genio: Si pongo la caja de lado para que toque menos suelo, ¿se mueve más fácil?',
    shortAnswer: '¡Sorprendentemente no! La fricción sigue valiendo exactamente lo mismo.',
    kidFriendlyExplanation: 'Parece mentira, pero en la física real la fricción no depende del tamaño de la base. Si acuestas la caja, hay más superficie tocando el suelo pero el peso se reparte más suave. Si paras la caja de canto, toca menos área pero todo el peso cae en un espacio chiquito y se clava más hondo. Al final, las dos cosas se cancelan exactamente y la fuerza de fricción es idéntica.',
    example: 'Solo importa qué tanto pesa la caja y de qué material está hecho el suelo.'
  }
];

export const ExplainModal: React.FC<ExplainModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'intro' | 'estatica' | 'cinetica' | 'conceptos' | 'ejemplo' | 'faq'>('intro');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('p-peso');

  // Interactive mini-calculator within modal for quick student experimentation
  const [calcMass, setCalcMass] = useState<number>(10);
  const [calcMuS, setCalcMuS] = useState<number>(0.4);
  const [calcMuK, setCalcMuK] = useState<number>(0.3);

  const calcN = calcMass * 9.81;
  const calcFsMax = calcMuS * calcN;
  const calcFk = calcMuK * calcN;

  if (!isOpen) return null;

  const toggleFaq = (id: string) => {
    sound.playClick();
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c1220] border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base sm:text-lg font-bold font-display text-white">
                Guía Científica: ¿Cómo Funciona la Fricción?
              </h2>
              <p className="text-xs text-slate-400">
                Fundamentos físicos, fórmulas y explicaciones sencillas para cualquier estudiante
              </p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-4 sm:px-6 overflow-x-auto gap-1.5 py-2">
          {[
            { id: 'intro', label: '1. ¿Qué es?' },
            { id: 'estatica', label: '2. Fricción Estática' },
            { id: 'cinetica', label: '3. Fricción Cinética' },
            { id: 'conceptos', label: '4. Fórmulas' },
            { id: 'ejemplo', label: '5. Ejemplo Real' },
            { id: 'faq', label: '★ Preguntas Frecuentes (Para Niños)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { sound.playClick(); setActiveTab(tab.id as typeof activeTab); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed">
          
          {/* TAB 1: INTRODUCCIÓN */}
          {activeTab === 'intro' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <h3 className="text-base font-bold text-cyan-300 font-display mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  ¿Qué es la fuerza de fricción o rozamiento?
                </h3>
                <p>
                  La <strong>fricción</strong> es una fuerza de contacto que se opone al movimiento relativo (o al intento de movimiento) entre dos superficies en contacto.
                </p>
                <p className="mt-2 text-slate-300">
                  A escala macroscópica las superficies parecen lisas, pero a nivel microscópico todas las superficies reales presentan rugosidades, crestas y valles. Cuando dos cuerpos se tocan, estas asperezas microscópicas encajan entre sí e interactúan mediante enlaces electromagnéticos moleculares, generando resistencia mecánica al deslizamiento.
                </p>
              </div>

              {/* Microscopic visual representation */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/40 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-full sm:w-1/2 p-4 bg-slate-900/90 rounded-lg border border-slate-800 text-center">
                  <div className="text-xs font-mono text-cyan-300 mb-2 font-bold">Vista Microscópica de Contacto</div>
                  <svg viewBox="0 0 280 80" className="w-full h-20 mx-auto">
                    <path
                      d="M 10 20 L 40 20 L 55 35 L 75 22 L 95 38 L 120 20 L 145 35 L 170 22 L 195 38 L 220 20 L 250 20 L 250 5 L 10 5 Z"
                      fill="#0284c7"
                      opacity="0.8"
                    />
                    <path
                      d="M 10 40 L 40 40 L 55 35 L 75 48 L 95 38 L 120 50 L 145 35 L 170 48 L 195 38 L 220 50 L 250 50 L 250 65 L 10 65 Z"
                      fill="#475569"
                      opacity="0.8"
                    />
                    <circle cx="55" cy="35" r="3" fill="#fbbf24" className="animate-ping" />
                    <circle cx="95" cy="38" r="3" fill="#fbbf24" className="animate-ping" />
                    <circle cx="145" cy="35" r="3" fill="#fbbf24" className="animate-ping" />
                    <circle cx="195" cy="38" r="3" fill="#fbbf24" className="animate-ping" />
                  </svg>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Las asperezas de la caja (azul) traban mecánicamente con las del suelo (gris).
                  </p>
                </div>

                <div className="w-full sm:w-1/2 space-y-2">
                  <h4 className="text-sm font-semibold text-white">Puntos Fundamentales:</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span><strong>Siempre es paralela</strong> a las superficies en contacto.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span><strong>Siempre se opone</strong> al sentido del deslizamiento o tendencia al movimiento.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span><strong>Depende de la fuerza normal (N)</strong> y de los materiales involucrados (μ).</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FRICCIÓN ESTÁTICA */}
          {activeTab === 'estatica' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <h3 className="text-base font-bold text-cyan-300 font-display mb-1">
                  Fricción Estática (fs)
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Actúa cuando los cuerpos están en reposo mutuo y existe una fuerza que intenta ponerlos en movimiento.
                </p>

                <div className="p-3 rounded-lg bg-slate-950 border border-cyan-800/40 text-center font-mono my-3">
                  <span className="text-xs text-slate-400 block mb-1">FÓRMULA FUNDAMENTAL:</span>
                  <span className="text-lg font-bold text-cyan-300">
                    fs ≤ μs · N
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">
                    Límite máximo de ruptura: <strong className="text-white">fs_máx = μs · N</strong>
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <p>
                    <strong>¡El comportamiento autoajustable de la fricción estática!</strong>
                  </p>
                  <p>
                    La fricción estática <strong>no tiene un valor fijo</strong>. Se adapta exactamente a la fuerza aplicada:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-2 text-center">
                    <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Sin empuje (F = 0)</span>
                      <strong className="text-cyan-400 font-mono">fs = 0 N</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Empuje suave (F = 15 N)</span>
                      <strong className="text-cyan-400 font-mono">fs = 15 N</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Alcanza el límite</span>
                      <strong className="text-amber-400 font-mono">fs = fs_máx</strong>
                    </div>
                  </div>
                  <p>
                    Solo cuando la fuerza aplicada supera estrictamente a <strong>fs_máx</strong>, el objeto vence el estado de reposo y comienza a acelerar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FRICCIÓN CINÉTICA */}
          {activeTab === 'cinetica' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <h3 className="text-base font-bold text-amber-300 font-display mb-1">
                  Fricción Cinética (fk)
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Actúa cuando las superficies ya se encuentran en movimiento relativo de deslizamiento.
                </p>

                <div className="p-3 rounded-lg bg-slate-950 border border-amber-800/40 text-center font-mono my-3">
                  <span className="text-xs text-slate-400 block mb-1">FÓRMULA FUNDAMENTAL:</span>
                  <span className="text-lg font-bold text-amber-300">
                    fk = μk · N
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">
                    (Valor constante mientras la superficie y la normal no cambien)
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-white">¿Por qué casi siempre μk &lt; μs?</h4>
                  <p>
                    Cuando el objeto ya está en movimiento, las asperezas microscópicas no tienen suficiente tiempo para asentarse profundamente unas dentro de otras antes de ser golpeadas y saltar.
                  </p>
                  <p>
                    Por esta razón física:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
                    <li>Es mucho más difícil <strong>comenzar</strong> a mover una caja pesada que <strong>mantenerla</strong> en movimiento.</li>
                    <li>Una vez superado el umbral estático, la resistencia cae repentinamente al nivel de la fricción cinética (fk).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONCEPTOS CLAVE */}
          {activeTab === 'conceptos' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <h4 className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5 mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    Coeficiente de Fricción (μ)
                  </h4>
                  <p className="text-xs text-slate-300">
                    Es un número adimensional (sin unidades) que mide qué tan áspero es el contacto entre los materiales.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <h4 className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-1.5 mb-1">
                    <Scale className="w-3.5 h-3.5" />
                    Fuerza Normal (N)
                  </h4>
                  <p className="text-xs text-slate-300">
                    Fuerza perpendicular que la superficie ejerce sobre el cuerpo para sostenerlo. En plano horizontal: <code className="text-emerald-400 font-mono">N = m · g</code>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <h4 className="text-xs font-bold text-violet-300 font-mono flex items-center gap-1.5 mb-1">
                    <Activity className="w-3.5 h-3.5" />
                    Masa (m) y Gravedad (g)
                  </h4>
                  <p className="text-xs text-slate-300">
                    La masa en kg determina la inercia del cuerpo. Usamos la aceleración estándar terrestre: <code className="text-violet-300 font-mono">g = 9.81 m/s²</code>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <h4 className="text-xs font-bold text-sky-300 font-mono flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Aceleración (a)
                  </h4>
                  <p className="text-xs text-slate-300">
                    Segunda Ley de Newton: <code className="text-sky-300 font-mono">a = (F_app - fk) / m</code>.
                  </p>
                </div>
              </div>

              {/* Calculator */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800/40 mt-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Calculadora de Apoyo en Tiempo Real:
                  </span>
                  <span className="text-[11px] font-mono text-cyan-300">g = 9.81 m/s²</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Masa (m): {calcMass} kg</label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={calcMass}
                      onChange={(e) => setCalcMass(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">μs: {calcMuS.toFixed(2)}</label>
                    <input
                      type="range"
                      min="0.05"
                      max="1.0"
                      step="0.05"
                      value={calcMuS}
                      onChange={(e) => setCalcMuS(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">μk: {calcMuK.toFixed(2)}</label>
                    <input
                      type="range"
                      min="0.02"
                      max="0.9"
                      step="0.05"
                      value={calcMuK}
                      onChange={(e) => setCalcMuK(Number(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs pt-2 border-t border-slate-800">
                  <div className="p-2 rounded bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">Normal (N = mg)</span>
                    <strong className="text-emerald-300">{calcN.toFixed(1)} N</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">fs máx (μs · N)</span>
                    <strong className="text-cyan-300">{calcFsMax.toFixed(1)} N</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">fk (μk · N)</span>
                    <strong className="text-amber-300">{calcFk.toFixed(1)} N</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EJEMPLO COTIDIANO */}
          {activeTab === 'ejemplo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <h3 className="text-base font-bold text-white font-display mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Ejemplo Práctico: Empujar un Mueble Pesado
                </h3>
                <p className="text-xs text-slate-300 mb-3">
                  Imagina que estás en tu casa o en el taller del politécnico y necesitas mover un mueble de 20 kg sobre piso de madera (μs = 0.40, μk = 0.30):
                </p>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono shrink-0">
                      1
                    </div>
                    <div>
                      <strong className="text-white">Paso 1: Empujas suavemente con 20 N.</strong>
                      <p className="text-slate-400 mt-0.5">
                        El mueble no se mueve. La fricción estática responde inmediatamente con exactamente <strong>20 N</strong> en sentido contrario. Suma de fuerzas horizontales = 0.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono shrink-0">
                      2
                    </div>
                    <div>
                      <strong className="text-white">Paso 2: Empujas con más fuerza: 60 N.</strong>
                      <p className="text-slate-400 mt-0.5">
                        El límite estático es: fs_máx = 0.40 · (20 kg · 9.81 m/s²) = <strong>78.48 N</strong>. Como 60 N &lt; 78.48 N, el mueble sigue completamente quieto. La fricción ahora vale 60 N.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono shrink-0">
                      3
                    </div>
                    <div>
                      <strong className="text-white">Paso 3: ¡Das un empujón fuerte de 85 N!</strong>
                      <p className="text-slate-400 mt-0.5">
                        Como 85 N &gt; 78.48 N, <strong>rompes la fricción estática</strong>. El mueble se desbloquea y comienza a moverse. En ese instante, la fricción cae a la cinética: fk = 0.30 · 196.2 N = <strong>58.86 N</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono shrink-0">
                      4
                    </div>
                    <div>
                      <strong className="text-white">Paso 4: ¡Sensación de alivio al deslizar!</strong>
                      <p className="text-slate-400 mt-0.5">
                        Notas que mantenerlo en movimiento requiere mucha menos fuerza que la que necesitaste para arrancarlo, porque la fricción cinética (58.86 N) es menor que la estática máxima (78.48 N).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PREGUNTAS FRECUENTES DESPLEGABLES (PARA NIÑOS Y PRINCIPIANTES) */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <MessageCircleQuestion className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                      <span>Preguntas Curiosas y Dudas Frecuentes</span>
                      <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/80 border border-amber-800/50 px-2 py-0.5 rounded-full">
                        Explicado para Niños
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Toca o haz clic en cualquier pregunta para ver la respuesta súper fácil y sin enredos
                    </p>
                  </div>
                </div>
              </div>

              {/* Accordion List */}
              <div className="space-y-2.5">
                {FAQ_ITEMS.map((item) => {
                  const isOpenItem = expandedFaq === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isOpenItem
                          ? 'bg-slate-900/90 border-cyan-500/40 shadow-md shadow-cyan-950/30'
                          : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/40'
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(item.id)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-2.5">
                          <Smile className={`w-4 h-4 shrink-0 ${isOpenItem ? 'text-cyan-400' : 'text-slate-400'}`} />
                          <span className={`text-xs sm:text-sm font-bold ${isOpenItem ? 'text-cyan-300' : 'text-slate-200'}`}>
                            {item.question}
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpenItem ? 'rotate-180 text-cyan-400' : ''}`} />
                      </button>

                      {isOpenItem && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-slate-800/60 space-y-2.5 bg-slate-950/40 animate-fadeIn">
                          <p className="font-semibold text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-900/40">
                            💡 En pocas palabras: {item.shortAnswer}
                          </p>
                          <div className="text-slate-300 whitespace-pre-line leading-relaxed pl-1">
                            {item.kidFriendlyExplanation}
                          </div>
                          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 italic">
                            🎯 <strong>Ejemplo en la vida real:</strong> {item.example}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            FRICTION LAB · República Dominicana · Politécnico
          </span>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-bold text-xs hover:brightness-110 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            ¡Entendido, volver al experimento!
          </button>
        </div>

      </div>
    </div>
  );
};
