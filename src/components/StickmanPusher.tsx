import React, { useMemo } from 'react';

interface StickmanPusherProps {
  appliedForce: number;
  velocity: number;
  boxWidth: number;
  boxHeight: number;
  position: number;
  isMoving: boolean;
}

export const StickmanPusher: React.FC<StickmanPusherProps> = ({
  appliedForce,
  velocity,
  boxWidth,
  boxHeight,
  position,
  isMoving
}) => {
  // Speed threshold where stickman can no longer keep hands on crate and starts chasing
  const SPRINT_THRESHOLD = 7.0; // m/s

  const isChasing = (velocity > SPRINT_THRESHOLD) || (appliedForce === 0 && isMoving);
  const isPushing = appliedForce > 0 && !isChasing;
  const isIdle = appliedForce === 0 && !isMoving;

  // Stride animation phase linked to physical position to prevent foot-sliding glitches
  const stridePhase = (position * 12) % (Math.PI * 2);

  // Smooth lag distance behind the crate when chasing
  const lagX = useMemo(() => {
    if (isPushing) return 0;
    if (isChasing) {
      const extraSpeed = Math.max(0, velocity - SPRINT_THRESHOLD);
      return Math.min(60, 20 + extraSpeed * 3.5);
    }
    return 16; // idle distance behind crate
  }, [isPushing, isChasing, velocity]);

  // Exertion factor from applied force (0 to 1)
  const effort = Math.min(1, appliedForce / 150);

  // SVG Stickman Geometry (Height: 64px, Ground at y = 60)
  const groundY = 60;
  
  // Base anchor point of the stickman relative to crate's left edge (x = 0 is crate's left face)
  // Negative X is to the left of the crate
  const stickmanOriginX = -32 - lagX;

  // Body kinematics
  // Lean forward angle: greater when pushing hard or sprinting
  const leanAngle = isPushing
    ? 24 + effort * 14
    : isChasing
    ? 22
    : 4;

  const leanRad = (leanAngle * Math.PI) / 180;

  // Pelvis / Hips position
  const hipsX = stickmanOriginX;
  const hipsY = groundY - 24;

  // Torso / Neck position
  const torsoLength = 18;
  const neckX = hipsX + Math.sin(leanRad) * torsoLength;
  const neckY = hipsY - Math.cos(leanRad) * torsoLength;

  // Head position
  const headRadius = 6.5;
  const headX = neckX + Math.sin(leanRad) * 8;
  const headY = neckY - Math.cos(leanRad) * 8;

  // Arms Kinematics
  // When pushing: Hands reach out to touch the crate's left face (x = 0)
  // When chasing: Arms pump back and forth with stridePhase
  // When idle: Hands at sides
  const shoulderX = neckX;
  const shoulderY = neckY + 4;

  let hand1X: number, hand1Y: number, elbow1X: number, elbow1Y: number;
  let hand2X: number, hand2Y: number, elbow2X: number, elbow2Y: number;

  if (isPushing) {
    // Both hands firmly on crate's left surface (x = -2 to touch crate)
    const targetCrateContactX = -2;
    const contactY = groundY - Math.min(boxHeight * 0.55, 32);

    elbow1X = (shoulderX + targetCrateContactX) / 2 + 1;
    elbow1Y = (shoulderY + contactY) / 2 - 4;
    hand1X = targetCrateContactX;
    hand1Y = contactY - 4;

    elbow2X = (shoulderX + targetCrateContactX) / 2 - 1;
    elbow2Y = (shoulderY + contactY) / 2 + 3;
    hand2X = targetCrateContactX;
    hand2Y = contactY + 3;
  } else if (isChasing) {
    // Sprinting arm swing
    const armSwing = Math.sin(stridePhase);
    elbow1X = shoulderX + Math.cos(armSwing) * 8 + 4;
    elbow1Y = shoulderY + 8;
    hand1X = elbow1X + Math.sin(armSwing) * 9 + 4;
    hand1Y = elbow1Y - 6;

    elbow2X = shoulderX - Math.cos(armSwing) * 8 - 4;
    elbow2Y = shoulderY + 8;
    hand2X = elbow2X - Math.sin(armSwing) * 9 - 4;
    hand2Y = elbow2Y + 4;
  } else {
    // Idle stance
    elbow1X = shoulderX + 4;
    elbow1Y = shoulderY + 8;
    hand1X = shoulderX + 5;
    hand1Y = shoulderY + 16;

    elbow2X = shoulderX - 3;
    elbow2Y = shoulderY + 8;
    hand2X = shoulderX - 3;
    hand2Y = shoulderY + 16;
  }

  // Legs Kinematics
  // When pushing and stationary: braced stance (front leg bent forward, back leg stretched back)
  // When moving: alternating running strides
  // When idle: standing upright
  let foot1X: number, foot1Y: number, knee1X: number, knee1Y: number;
  let foot2X: number, foot2Y: number, knee2X: number, knee2Y: number;

  if (isMoving) {
    const legSwing = Math.sin(stridePhase);
    const legLift = Math.abs(Math.cos(stridePhase));

    // Front / active leg
    knee1X = hipsX + legSwing * 10 + 2;
    knee1Y = hipsY + 12 - legLift * 4;
    foot1X = hipsX + legSwing * 15 + 4;
    foot1Y = groundY - (legSwing < 0 ? legLift * 5 : 0);

    // Back leg
    knee2X = hipsX - legSwing * 10 - 2;
    knee2Y = hipsY + 12 - (1 - legLift) * 4;
    foot2X = hipsX - legSwing * 15 - 4;
    foot2Y = groundY - (legSwing > 0 ? (1 - legLift) * 5 : 0);
  } else if (isPushing) {
    // Braced pushing stance
    knee1X = hipsX + 7;
    knee1Y = hipsY + 12;
    foot1X = hipsX + 11;
    foot1Y = groundY;

    knee2X = hipsX - 10;
    knee2Y = hipsY + 13;
    foot2X = hipsX - 18;
    foot2Y = groundY;
  } else {
    // Idle standing
    knee1X = hipsX + 3;
    knee1Y = hipsY + 12;
    foot1X = hipsX + 3;
    foot1Y = groundY;

    knee2X = hipsX - 3;
    knee2Y = hipsY + 12;
    foot2X = hipsX - 3;
    foot2Y = groundY;
  }

  return (
    <div
      className="absolute bottom-0 right-[100%] pointer-events-none select-none z-10 transition-transform duration-75"
      style={{
        width: '120px',
        height: '70px',
        overflow: 'visible'
      }}
    >
      <svg
        viewBox="-110 0 120 70"
        className="w-[120px] h-[70px] overflow-visible"
      >
        <defs>
          <filter id="sweatGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#38bdf8" />
          </filter>
        </defs>

        {/* Back Leg (Arm/Leg 2 drawn behind torso for depth) */}
        <polyline
          points={`${hipsX},${hipsY} ${knee2X},${knee2Y} ${foot2X},${foot2Y}`}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Back Arm */}
        <polyline
          points={`${shoulderX},${shoulderY} ${elbow2X},${elbow2Y} ${hand2X},${hand2Y}`}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Torso Spine */}
        <line
          x1={hipsX}
          y1={hipsY}
          x2={neckX}
          y2={neckY}
          stroke="#f8fafc"
          strokeWidth="3.6"
          strokeLinecap="round"
        />

        {/* Head */}
        <circle
          cx={headX}
          cy={headY}
          r={headRadius}
          fill="#f8fafc"
          stroke="#0b0f19"
          strokeWidth="1.5"
        />

        {/* Hard Hat / Casco de Seguridad Politécnico (Yellow Industrial Helmet) */}
        <path
          d={`M ${headX - 8} ${headY - 2} Q ${headX} ${headY - 11} ${headX + 7} ${headY - 2} L ${headX + 8} ${headY - 1} L ${headX - 9} ${headY - 1} Z`}
          fill="#eab308"
          stroke="#ca8a04"
          strokeWidth="1"
        />
        {/* Helmet brim */}
        <line
          x1={headX - 9}
          y1={headY - 1}
          x2={headX + 9}
          y2={headY - 1}
          stroke="#ca8a04"
          strokeWidth="1.2"
        />

        {/* Eye / Goggles */}
        <circle
          cx={headX + 3}
          cy={headY + 1}
          r="1.2"
          fill="#0284c7"
        />

        {/* Front Leg */}
        <polyline
          points={`${hipsX},${hipsY} ${knee1X},${knee1Y} ${foot1X},${foot1Y}`}
          fill="none"
          stroke="#f8fafc"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Front Arm */}
        <polyline
          points={`${shoulderX},${shoulderY} ${elbow1X},${elbow1Y} ${hand1X},${hand1Y}`}
          fill="none"
          stroke="#f8fafc"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Exertion / Effort Indicators */}
        {/* 1. Heavy pushing sweat drops when force is high */}
        {isPushing && effort > 0.45 && (
          <g filter="url(#sweatGlow)">
            <circle cx={headX - 5} cy={headY - 8} r="1.5" fill="#38bdf8" className="animate-ping" />
            <path d={`M ${headX - 4} ${headY - 12} Q ${headX - 6} ${headY - 14} ${headX - 8} ${headY - 12}`} stroke="#38bdf8" strokeWidth="1.2" fill="none" />
          </g>
        )}

        {/* 2. Running speed dust / chase lines when sprinting behind box */}
        {isChasing && (
          <g opacity="0.75">
            <line
              x1={stickmanOriginX - 12}
              y1={groundY - 10}
              x2={stickmanOriginX - 24}
              y2={groundY - 10}
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="2 3"
            />
            <line
              x1={stickmanOriginX - 8}
              y1={groundY - 18}
              x2={stickmanOriginX - 20}
              y2={groundY - 18}
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="2 3"
            />
            <text
              x={stickmanOriginX}
              y={headY - 8}
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="8"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              ¡Corre!
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
