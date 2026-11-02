import { Material, PhysicsDerivedValues, PhysicsState } from '../types/physics';

export const GRAVITY = 9.81; // m/s^2 (Standard gravitational acceleration)

/**
 * Computes instantaneous static and derived physics values for given parameters.
 */
export function calculateDerivedPhysics(
  mass: number,
  appliedForce: number,
  material: Material,
  currentVelocity: number = 0,
  customMuS?: number,
  customMuK?: number,
  speedLimit?: number | null
): PhysicsDerivedValues {
  // Prevent invalid mass or forces
  const safeMass = Math.max(0.1, mass);
  const safeForce = Math.max(0, appliedForce);
  const muS = customMuS ?? material.muS;
  const muK = customMuK ?? material.muK;

  // Normal force & Weight on a horizontal surface: N = W = m * g
  const weight = safeMass * GRAVITY;
  const normalForce = weight;

  // Maximum static friction limit: fs_max = mu_s * N
  const maxStaticFriction = muS * normalForce;

  // Kinetic friction: fk = mu_k * N
  const kineticFriction = muK * normalForce;

  // Determine actual friction according to motion state:
  const isMoving = currentVelocity > 0.0001;
  const isOvercomingStatic = safeForce > maxStaticFriction;

  let actualFriction = 0;
  let netHorizontalForce = 0;
  let instantAcceleration = 0;

  if (isMoving) {
    // When in motion, friction is kinetic
    actualFriction = kineticFriction;
    netHorizontalForce = safeForce - actualFriction;
    instantAcceleration = netHorizontalForce / safeMass;
  } else {
    // When at rest
    if (isOvercomingStatic) {
      // Force exceeds threshold: transitions immediately to kinetic
      actualFriction = kineticFriction;
      netHorizontalForce = safeForce - actualFriction;
      instantAcceleration = netHorizontalForce / safeMass;
    } else {
      // Static friction exactly balances applied force up to fs_max
      actualFriction = safeForce;
      netHorizontalForce = 0;
      instantAcceleration = 0;
    }
  }

  const isSpeedLimited = speedLimit !== null && speedLimit !== undefined && speedLimit > 0 && currentVelocity >= speedLimit - 0.05;

  return {
    gravity: GRAVITY,
    normalForce,
    weight,
    maxStaticFriction,
    kineticFriction,
    actualFriction,
    isOvercomingStatic,
    netHorizontalForce,
    instantAcceleration,
    speedLimit,
    isSpeedLimited
  };
}

/**
 * Performs a discrete physics time step simulation
 * dt in seconds (e.g. 0.016s for 60fps)
 */
export function stepPhysics(
  state: PhysicsState,
  material: Material,
  dt: number
): {
  nextState: PhysicsState;
  justBrokeStatic: boolean;
} {
  const scaledDt = dt * state.timeScale;
  const safeMass = Math.max(0.1, state.mass);
  const muS = state.customMuS ?? material.muS;
  const muK = state.customMuK ?? material.muK;

  const normalForce = safeMass * GRAVITY;
  const maxStaticFriction = muS * normalForce;
  const kineticFriction = muK * normalForce;

  let velocity = state.velocity;
  let position = state.position;
  let distanceTraveled = state.distanceTraveled;
  let hasBrokenStatic = state.hasBrokenStatic;
  let justBrokeStatic = false;
  let acceleration = 0;
  let motionState = state.motionState;

  if (velocity <= 0.00001) {
    // Object was at rest
    if (state.appliedForce > maxStaticFriction) {
      // OVERCOMES STATIC FRICTION!
      justBrokeStatic = true;
      hasBrokenStatic = true;
      const netForce = state.appliedForce - kineticFriction;
      acceleration = netForce / safeMass;
      velocity = Math.max(0, velocity + acceleration * scaledDt);
      position += velocity * scaledDt;
      distanceTraveled += velocity * scaledDt;
      motionState = 'accelerating';
    } else {
      // STAYS AT REST
      velocity = 0;
      acceleration = 0;
      motionState = 'rest';
    }
  } else {
    // Object was already moving: kinetic friction always applies
    const netForce = state.appliedForce - kineticFriction;
    acceleration = netForce / safeMass;
    velocity = velocity + acceleration * scaledDt;

    if (velocity <= 0) {
      // Decelerated completely to a stop
      velocity = 0;
      acceleration = 0;
      motionState = 'stopped';
    } else {
      position += velocity * scaledDt;
      distanceTraveled += velocity * scaledDt;
      if (Math.abs(acceleration) < 0.01) {
        motionState = 'constant_speed';
      } else if (acceleration > 0) {
        motionState = 'accelerating';
      } else {
        motionState = 'decelerating';
      }
    }
  }

  // Speed Limit Governor Clamp
  let isSpeedLimited = false;
  if (state.speedLimit !== null && state.speedLimit !== undefined && state.speedLimit > 0) {
    if (velocity >= state.speedLimit) {
      velocity = state.speedLimit;
      isSpeedLimited = true;
      if (acceleration > 0) {
        acceleration = 0;
        motionState = 'constant_speed';
      }
    }
  }

  return {
    nextState: {
      ...state,
      velocity,
      position,
      distanceTraveled,
      acceleration,
      hasBrokenStatic,
      motionState,
      isSpeedLimited,
      simulationTime: state.simulationTime + scaledDt
    },
    justBrokeStatic
  };
}
