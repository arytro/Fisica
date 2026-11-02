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
}

export interface PhysicsDerivedValues {
  gravity: number; // 9.81 m/s^2
  normalForce: number; // N = m * g
  weight: number; // N = m * g
  maxStaticFriction: number; // fs_max = mu_s * N
  kineticFriction: number; // fk = mu_k * N
  actualFriction: number; // Current friction opposing force or motion
  isOvercomingStatic: boolean; // appliedForce > maxStaticFriction
  netHorizontalForce: number; // F_net = F_applied - friction
  instantAcceleration: number; // a = F_net / m
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
