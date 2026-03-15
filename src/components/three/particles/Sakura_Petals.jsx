'use client';

// === IMPORTS ===

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// === CONSTANTS ===

const PARTICLE_COUNT = 80;
const SPREAD_X = 4; // from -2 to +2
const SPREAD_Z = 4; // from -2 to +2
const HEIGHT = 4; // from -2 to +2
const FALL_SPEED = 0.005; // Slower than ember rise
const DRIFT_AMP = 0.015; // Same horizontal drift as ember
const DRIFT_FREQ = 1.5; // Same drift frequency as ember
const PARTICLE_SIZE = 0.02;
const OPACITY = 1;

// Pink particles
const PINK_COUNT = 40;
const PINK_SIZE = 0.02;
const PINK_COLOR = '#FFC0CB';

// === HELPERS ===

// Generate initial positions and phase offsets for a particle group
function createParticleData(count) {
  const pos = new Float32Array(count * 3);
  const off = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * SPREAD_X;
    pos[i * 3 + 1] = (Math.random() - 0.5) * HEIGHT;
    pos[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
    off[i] = Math.random() * Math.PI * 2;
  }
  return { positions: pos, offsets: off };
}

// Animate a group of falling particles (inverse of ember rising)
function animateFalling(geo, offsets, count, speed, time) {
  const posArray = geo.attributes.position.array;

  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const iy = i * 3 + 1;

    // Fall downward with horizontal drift
    posArray[iy] -= speed;
    posArray[ix] += Math.sin(time * DRIFT_FREQ + offsets[i]) * DRIFT_AMP;

    // Reset to top when particle falls below the field
    if (posArray[iy] < -HEIGHT / 2) {
      posArray[iy] = HEIGHT / 2 + Math.random() * 0.5;
      posArray[ix] = (Math.random() - 0.5) * SPREAD_X;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
    }
  }

  geo.attributes.position.needsUpdate = true;
}

// === COMPONENT ===

export default function Sakura_Petals({ color = '#c45c5c' }) {
  const pointsRef = useRef();
  const pinkRef = useRef();

  const particleData = useMemo(() => createParticleData(PARTICLE_COUNT), []);
  const pinkData = useMemo(() => createParticleData(PINK_COUNT), []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const geo = pointsRef.current?.geometry;
    if (geo) animateFalling(geo, particleData.offsets, PARTICLE_COUNT, FALL_SPEED, time);

    const pinkGeo = pinkRef.current?.geometry;
    if (pinkGeo) animateFalling(pinkGeo, pinkData.offsets, PINK_COUNT, FALL_SPEED, time);
  });

  return (
    <group>
      {/* Main petals */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={particleData.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={PARTICLE_SIZE}
          transparent
          opacity={OPACITY}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Pink particles */}
      <points ref={pinkRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PINK_COUNT}
            array={pinkData.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={PINK_COLOR}
          size={PINK_SIZE}
          transparent
          opacity={0.9}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
