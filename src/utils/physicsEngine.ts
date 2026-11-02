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
  speedLimit?: number | null,
  inclineAngle: number = 0
): PhysicsDerivedValues {
  // Prevent invalid mass or forces
  const safeMass = Math.max(0.1, mass);
  const safeForce = Math.max(0, appliedForce);
  const muS = customMuS ?? material.muS;
  const muK = customMuK ?? material.muK;

  const incline = Math.max(0, Math.min(60, inclineAngle));
  const thetaRad = (incline * Math.PI) / 180;
  const cosTheta = Math.cos(thetaRad);
  const sinTheta = Math.sin(thetaRad);

  // Weight acts straight down: P = m * g
  const weight = safeMass * GRAVITY;
  // Perpendicular component and normal force: N = P_perp = m * g * cos(theta)
  const slopePerpendicularForce = weight * cosTheta;
  const normalForce = slopePerpendicularForce;
  // Parallel gravity component pulling downhill: P_parallel = m * g * sin(theta)
  const slopeParallelForce = weight * sinTheta;

  // Maximum static friction limit: fs_max = mu_s * N
  const maxStaticFriction = muS * normalForce;

  // Kinetic friction: fk = mu_k * N
  const kineticFriction = muK * normalForce;

  // Total driving force along the slope (applied push + downhill gravity):
  const drivingForce = safeForce + slopeParallelForce;

  // Determine actual friction according to motion state:
  const isMoving = currentVelocity > 0.0001;
  const isOvercomingStatic = drivingForce > maxStaticFriction;

  let actualFriction = 0;
  let netHorizontalForce = 0;
  let instantAcceleration = 0;

  if (isMoving) {
    // When in motion, kinetic friction opposes the downhill driving force
    actualFriction = kineticFriction;
    netHorizontalForce = drivingForce - actualFriction;
    instantAcceleration = netHorizontalForce / safeMass;
  } else {
    // When at rest
    if (isOvercomingStatic) {
      // Driving force exceeds static threshold: transitions immediately to kinetic
      actualFriction = kineticFriction;
      netHorizontalForce = drivingForce - actualFriction;
      instantAcceleration = netHorizontalForce / safeMass;
    } else {
      // Static friction exactly balances driving force up to fs_max
      actualFriction = drivingForce;
      netHorizontalForce = 0;
      instantAcceleration = 0;
    }
  }

  const isSpeedLimited = speedLimit !== null && speedLimit !== undefined && speedLimit > 0 && currentVelocity >= speedLimit - 0.05;

  return {
    gravity: GRAVITY,
    normalForce,
    weight,
    slopeParallelForce,
    slopePerpendicularForce,
    maxStaticFriction,
    kineticFriction,
    actualFriction,
    isOvercomingStatic,
    netHorizontalForce,
    instantAcceleration,
    speedLimit,
    isSpeedLimited,
    inclineAngle: incline
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

  const incline = Math.max(0, Math.min(60, state.inclineAngle || 0));
  const thetaRad = (incline * Math.PI) / 180;
  const cosTheta = Math.cos(thetaRad);
  const sinTheta = Math.sin(thetaRad);

  const weight = safeMass * GRAVITY;
  const normalForce = weight * cosTheta;
  const slopeParallelForce = weight * sinTheta;

  const maxStaticFriction = muS * normalForce;
  const kineticFriction = muK * normalForce;

  const drivingForce = state.appliedForce + slopeParallelForce;

  let velocity = state.velocity;
  let position = state.position;
  let distanceTraveled = state.distanceTraveled;
  let hasBrokenStatic = state.hasBrokenStatic;
  let justBrokeStatic = false;
  let acceleration = 0;
  let motionState = state.motionState;

  if (velocity <= 0.00001) {
    // Object was at rest
    if (drivingForce > maxStaticFriction) {
      // OVERCOMES STATIC FRICTION!
      justBrokeStatic = true;
      hasBrokenStatic = true;
      const netForce = drivingForce - kineticFriction;
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
    // Object was already moving: kinetic friction opposes driving force
    const netForce = drivingForce - kineticFriction;
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
