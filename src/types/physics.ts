export type MaterialId = 'hielo' | 'madera' | 'cemento' | 'metal' | 'goma';

export interface Material {
  id: MaterialId;
  name: string;
  description: string;
  muS: number; // Coeficiente de fricción estática
  muK: number; // Coeficiente de fricción cinética
  color: string;
  surfacePattern: string;
  accentColor: string;
  realWorldContext: string;
}

export type SimulationStatus = 'idle' | 'running' | 'paused';
export type MotionState = 'rest' | 'accelerating' | 'constant_speed' | 'decelerating' | 'stopped';

export interface PhysicsState {
  mass: number; // kg (1 a 50)
  appliedForce: number; // N (0 a 200)
  materialId: MaterialId;
  customMuS?: number;
  customMuK?: number;
  position: number; // meters (for animation translation)
  velocity: number; // m/s
  acceleration: number; // m/s^2
  simulationTime: number; // seconds
  status: SimulationStatus;
  motionState: MotionState;
  hasBrokenStatic: boolean;
  distanceTraveled: number; // meters
  timeScale: number; // 0.5, 1, 2
  speedLimit: number | null; // null = sin límite, or 10, 25, 50 m/s
  isSpeedLimited?: boolean; // true if currently clamped at governor
  inclineAngle?: number; // degrees (0 = plano horizontal, > 0 = cuesta abajo)
}

export interface VisibilityFilters {
  includeMass: boolean; // Si false: masa se fija en predeterminada (10 kg)
  includeGravity: boolean; // Si false: se ocultan flechas verticales (P y N)
  showAppliedForce: boolean; // Flecha de Fuerza Aplicada en el cubo
  showFriction: boolean; // Flecha de Fricción hacia atrás en el cubo
  showNetForce: boolean; // Flecha de Fuerza Neta (ΣF) resultante en el cubo
}

export interface PhysicsDerivedValues {
  gravity: number; // 9.81 m/s^2
  normalForce: number; // N = m * g * cos(theta)
  weight: number; // P = m * g
  slopeParallelForce: number; // P_parallel = m * g * sin(theta) (fuerza cuesta abajo)
  slopePerpendicularForce: number; // P_perp = m * g * cos(theta)
  maxStaticFriction: number; // fs_max = mu_s * N
  kineticFriction: number; // fk = mu_k * N
  actualFriction: number; // Current friction opposing force or motion
  isOvercomingStatic: boolean; // total driving force > maxStaticFriction
  netHorizontalForce: number; // F_net = F_drive - friction
  instantAcceleration: number; // a = F_net / m
  speedLimit?: number | null;
  isSpeedLimited?: boolean;
  inclineAngle: number;
}

export type Difficulty = 'facil' | 'intermedio' | 'dificil';

export interface ChallengeQuestion {
  id: string;
  difficulty: Difficulty;
  title: string;
  scenario: string;
  given: {
    mass: number;
    materialName: string;
    muS: number;
    muK: number;
    appliedForce?: number;
  };
  question: string;
  targetVariable: string;
  unit: string;
  correctAnswer: number;
  tolerance: number; // acceptable delta
  options: number[]; // multiple choice options
  explanation: string;
  formulaUsed: string;
  solutionSteps: string[];
}
