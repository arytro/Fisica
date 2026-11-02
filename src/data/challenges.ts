import { ChallengeQuestion } from '../types/physics';
import { GRAVITY } from '../utils/physicsEngine';

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  // FÁCIL
  {
    id: 'facil-1',
    difficulty: 'facil',
    title: 'Fuerza Normal en el Taller Mecánico',
    scenario: 'En el taller del politécnico, se coloca una caja de herramientas de 10 kg sobre una mesa horizontal de madera.',
    given: {
      mass: 10,
      materialName: 'Madera Cepillada',
      muS: 0.40,
      muK: 0.30
    },
    question: '¿Cuál es el valor de la fuerza normal (N) que ejerce la superficie sobre la caja?',
    targetVariable: 'N',
    unit: 'N',
    correctAnswer: 98.1,
    tolerance: 0.5,
    options: [10.0, 40.0, 98.1, 9.81], // Opción C
    formulaUsed: 'N = m · g',
    explanation: 'En una superficie horizontal sin fuerzas verticales externas adicionales, la fuerza normal equilibra exactamente el peso del objeto (W = m · g).',
    solutionSteps: [
      'Identificar la masa: m = 10 kg',
      'Gravedad estándar: g = 9.81 m/s²',
      'Calcular el peso / normal: N = 10 kg · 9.81 m/s²',
      'Resultado exacto: N = 98.10 N'
    ]
  },
  {
    id: 'facil-2',
    difficulty: 'facil',
    title: 'Umbral de Fricción Estática en Madera',
    scenario: 'Un estudiante necesita mover una caja de 10 kg que reposa sobre madera cepillada (μs = 0.40).',
    given: {
      mass: 10,
      materialName: 'Madera Cepillada',
      muS: 0.40,
      muK: 0.30
    },
    question: '¿Qué fuerza horizontal mínima se debe superar para que la caja empiece a moverse?',
    targetVariable: 'fs_max',
    unit: 'N',
    correctAnswer: 39.24,
    tolerance: 0.3,
    options: [29.43, 39.24, 98.1, 4.0], // Opción B
    formulaUsed: 'fs_máx = μs · N',
    explanation: 'Para iniciar el movimiento, la fuerza aplicada debe ser estrictamente mayor a la fricción estática máxima (fs_máx).',
    solutionSteps: [
      'Calcular la Normal: N = m · g = 10 kg · 9.81 m/s² = 98.1 N',
      'Multiplicar por el coeficiente estático: fs_máx = 0.40 · 98.1 N',
      'Resultado: fs_máx = 39.24 N (cualquier fuerza > 39.24 N vencerá el reposo)'
    ]
  },
  {
    id: 'facil-3',
    difficulty: 'facil',
    title: 'Deslizamiento sobre Hielo',
    scenario: 'En un experimento sobre hielo pulido (μs = 0.10, μk = 0.03), se tiene un bloque de hielo de 20 kg.',
    given: {
      mass: 20,
      materialName: 'Hielo Pulido',
      muS: 0.10,
      muK: 0.03
    },
    question: '¿Cuál es la fricción estática máxima que resiste el bloque antes de deslizarse?',
    targetVariable: 'fs_max',
    unit: 'N',
    correctAnswer: 19.62,
    tolerance: 0.2,
    options: [5.89, 196.2, 2.0, 19.62], // Opción D
    formulaUsed: 'fs_máx = μs · N',
    explanation: 'El bajo coeficiente del hielo (μs = 0.10) permite mover objetos pesados con fuerzas comparativamente muy reducidas.',
    solutionSteps: [
      'Normal: N = m · g = 20 kg · 9.81 m/s² = 196.2 N',
      'Fricción estática máxima: fs_máx = 0.10 · 196.2 N = 19.62 N',
      'Con solo aplicar más de 19.62 N el bloque comenzará a deslizarse.'
    ]
  },

  // INTERMEDIO
  {
    id: 'inter-1',
    difficulty: 'intermedio',
    title: 'Fricción Cinética en Pleno Movimiento',
    scenario: 'Una caja de 15 kg ya se encuentra deslizándose sobre un piso de cemento (μk = 0.50).',
    given: {
      mass: 15,
      materialName: 'Cemento / Hormigón',
      muS: 0.65,
      muK: 0.50
    },
    question: '¿Qué magnitud tiene la fuerza de fricción cinética (fk) que se opone a su movimiento?',
    targetVariable: 'fk',
    unit: 'N',
    correctAnswer: 73.58,
    tolerance: 0.5,
    options: [95.65, 147.15, 73.58, 7.5], // Opción C
    formulaUsed: 'fk = μk · N',
    explanation: 'Una vez que el objeto ya está en movimiento, la fricción que actúa es la cinética, cuyo valor depende únicamente de μk y de la fuerza normal.',
    solutionSteps: [
      'Normal: N = 15 kg · 9.81 m/s² = 147.15 N',
      'Fricción cinética: fk = μk · N = 0.50 · 147.15 N',
      'Resultado: fk = 73.58 N en sentido opuesto al avance'
    ]
  },
  {
    id: 'inter-2',
    difficulty: 'intermedio',
    title: 'Aceleración Neta con Fuerza Aplicada',
    scenario: 'Se aplica una fuerza horizontal continua de 100 N a una caja de 10 kg sobre madera (μs = 0.40, μk = 0.30). La caja ya está en movimiento.',
    given: {
      mass: 10,
      materialName: 'Madera Cepillada',
      muS: 0.40,
      muK: 0.30,
      appliedForce: 100
    },
    question: '¿Cuál es la aceleración (a) resultante que experimenta la caja?',
    targetVariable: 'a',
    unit: 'm/s²',
    correctAnswer: 7.06,
    tolerance: 0.1,
    options: [10.0, 7.06, 6.08, 4.12], // Opción B
    formulaUsed: 'a = (F_aplicada - fk) / m',
    explanation: 'La Segunda Ley de Newton establece que F_resultante = m · a. Como la caja se mueve, la fricción que se opone es la cinética fk.',
    solutionSteps: [
      'Normal: N = 10 kg · 9.81 m/s² = 98.1 N',
      'Fricción cinética: fk = 0.30 · 98.1 N = 29.43 N',
      'Fuerza neta: F_net = 100 N - 29.43 N = 70.57 N',
      'Aceleración: a = 70.57 N / 10 kg = 7.06 m/s²'
    ]
  },
  {
    id: 'inter-3',
    difficulty: 'intermedio',
    title: 'Fricción Adaptativa en Reposo',
    scenario: 'Sobre un piso de metal seco (μs = 0.74, μk = 0.57), hay un bloque de 25 kg. Se le empuja con una fuerza suave de solo 50 N.',
    given: {
      mass: 25,
      materialName: 'Metal / Acero',
      muS: 0.74,
      muK: 0.57,
      appliedForce: 50
    },
    question: '¿Cuánto vale la fuerza de fricción REAL que actúa sobre el bloque en ese instante?',
    targetVariable: 'fs',
    unit: 'N',
    correctAnswer: 50.0,
    tolerance: 0.1,
    options: [181.49, 139.79, 0.0, 50.0], // Opción D
    formulaUsed: 'fs = F_aplicada (cuando F_aplicada ≤ fs_máx)',
    explanation: '¡Concepto clave! La fricción estática real se adapta y equilibra exactamente la fuerza aplicada hasta alcanzar su límite máximo.',
    solutionSteps: [
      'Normal: N = 25 kg · 9.81 m/s² = 245.25 N',
      'Límite estático máximo: fs_máx = 0.74 · 245.25 N = 181.49 N',
      'Comparación: Como 50 N ≤ 181.49 N, el objeto no se mueve.',
      'Por Primera Ley de Newton, la fricción estática real es exactamente 50.0 N.'
    ]
  },

  // DIFÍCIL
  {
    id: 'dificil-1',
    difficulty: 'dificil',
    title: 'Fuerza Crítica para Mover un Neumático de Goma',
    scenario: 'En las prácticas de mecánica automotriz, una pieza de goma antideslizante de 40 kg descansa sobre cemento seco (μs = 0.90, μk = 0.80).',
    given: {
      mass: 40,
      materialName: 'Goma Antideslizante',
      muS: 0.90,
      muK: 0.80
    },
    question: 'Si se aplica una fuerza de 360 N, ¿se moverá el objeto? ¿Cuál es el valor de fs_máx?',
    targetVariable: 'fs_max',
    unit: 'N',
    correctAnswer: 353.16,
    tolerance: 0.5,
    options: [313.92, 353.16, 392.40, 360.00], // Opción B
    formulaUsed: 'fs_máx = μs · m · g',
    explanation: 'Como 360 N es ligeramente mayor que 353.16 N, el objeto SÍ comenzará a deslizarse inmediatamente.',
    solutionSteps: [
      'Normal: N = 40 kg · 9.81 m/s² = 392.40 N',
      'Fricción estática máxima: fs_máx = 0.90 · 392.40 N = 353.16 N',
      'Evaluación: 360 N > 353.16 N. La fuerza aplicada vence el rozamiento estático.'
    ]
  },
  {
    id: 'dificil-2',
    difficulty: 'dificil',
    title: 'Desaceleración por Fricción tras Soltar el Objeto',
    scenario: 'Una caja de 8 kg que se deslizaba sobre madera (μk = 0.30) queda libre de empuje (F_aplicada = 0 N).',
    given: {
      mass: 8,
      materialName: 'Madera Cepillada',
      muS: 0.40,
      muK: 0.30,
      appliedForce: 0
    },
    question: '¿Cuál es la magnitud de la desaceleración que experimenta la caja mientras se frena?',
    targetVariable: '|a|',
    unit: 'm/s²',
    correctAnswer: 2.94,
    tolerance: 0.1,
    options: [9.81, 3.92, 2.94, 1.50], // Opción C
    formulaUsed: '|a| = μk · g',
    explanation: 'Cuando la única fuerza horizontal es la fricción cinética: fk = μk · m · g. Al dividir entre la masa m, la desaceleración resulta independiente de la masa: |a| = μk · g.',
    solutionSteps: [
      'Fuerza neta: F_net = -fk = -μk · m · g',
      'Segunda Ley: a = (-μk · m · g) / m = -μk · g',
      'Magnitud: |a| = 0.30 · 9.81 m/s² = 2.94 m/s²',
      'Dato notable: La desaceleración por fricción pura no depende de la masa del objeto.'
    ]
  },
  {
    id: 'dificil-3',
    difficulty: 'dificil',
    title: 'Velocidad Constante y Equilibrio Dinámico',
    scenario: 'Se desea empujar un contenedor de 30 kg sobre hormigón (μs = 0.65, μk = 0.50) a velocidad exactamente constante (a = 0).',
    given: {
      mass: 30,
      materialName: 'Cemento / Hormigón',
      muS: 0.65,
      muK: 0.50
    },
    question: '¿Qué fuerza aplicada horizontal se debe mantener una vez que ya está en movimiento?',
    targetVariable: 'F_app',
    unit: 'N',
    correctAnswer: 147.15,
    tolerance: 0.5,
    options: [191.30, 294.30, 98.10, 147.15], // Opción D
    formulaUsed: 'F_app = fk = μk · N',
    explanation: 'Para mantener velocidad constante, la aceleración debe ser cero (a = 0). Según la Primera Ley de Newton, la fuerza aplicada debe equilibrar exactamente la fricción cinética fk.',
    solutionSteps: [
      'Condición de velocidad constante: F_neta = F_app - fk = 0  =>  F_app = fk',
      'Normal: N = 30 kg · 9.81 m/s² = 294.30 N',
      'Fricción cinética: fk = 0.50 · 294.30 N = 147.15 N',
      'Fuerza necesaria: F_app = 147.15 N'
    ]
  }
];
