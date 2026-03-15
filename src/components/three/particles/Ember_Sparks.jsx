'use client';

// === IMPORTS ===

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// === CONSTANTS ===

const PARTICLE_COUNT = 100; // Per group (embers + ash)
const SPREAD_X = 4; // Horizontal spread, from -2 to +2
const SPREAD_Z = 4; // Depth spread, from -2 to +2
const HEIGHT = 4; // Vertical range, from -2 to +2
const RISE_SPEED = 0.01; // Upward speed for embers
const ASH_RISE_SPEED = 0.006; // Slower rise for ash
const DRIFT_AMP = 0.015; // Horizontal drift amplitude
const DRIFT_FREQ = 1.5; // Drift frequency
const EMBER_SIZE = 0.03; // Ember particle size
const ASH_SIZE = 0.025; // Ash particle size
const ASH_COLOR = '#050505'; // Near-black ash

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

// Animate a group of rising particles
function animateRising(geo, offsets, count, speed, time) {
  const posArray = geo.attributes.position.array;

  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const iy = i * 3 + 1;

    // Rise upward with random horizontal drift
    posArray[iy] += speed;
    posArray[ix] += Math.sin(time * DRIFT_FREQ + offsets[i]) * DRIFT_AMP;

    // Reset to bottom when particle goes above the field
    if (posArray[iy] > HEIGHT / 2) {
      posArray[iy] = -HEIGHT / 2 - Math.random() * 2;
      posArray[ix] = (Math.random() - 0.5) * SPREAD_X;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
    }
  }

  geo.attributes.position.needsUpdate = true;
}

// === COMPONENT ===

export default function Ember_Sparks({ color = '#c47a5c' }) {
  const embersRef = useRef();
  const ashRef = useRef();

  // Separate data for each particle group
  const emberData = useMemo(() => createParticleData(PARTICLE_COUNT), []);
  const ashData = useMemo(() => createParticleData(PARTICLE_COUNT), []);

  // Animate both groups — embers rise faster, ash drifts slower
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    const emberGeo = embersRef.current?.geometry;
    if (emberGeo) animateRising(emberGeo, emberData.offsets, PARTICLE_COUNT, RISE_SPEED, time);

    const ashGeo = ashRef.current?.geometry;
    if (ashGeo) animateRising(ashGeo, ashData.offsets, PARTICLE_COUNT, ASH_RISE_SPEED, time);
  });

  return (
    <group>
      {/* Ember particles — scene primary color */}
      <points ref={embersRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={emberData.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={EMBER_SIZE}
          transparent
          opacity={0.9}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Ash particles — near-black */}
      <points ref={ashRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={ashData.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={ASH_COLOR}
          size={ASH_SIZE}
          transparent
          opacity={0.7}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
