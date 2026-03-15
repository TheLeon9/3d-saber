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
const FALL_SPEED = 0.005; // Same as sakura
const DRIFT_AMP = 0.015; // Same horizontal drift as ember
const DRIFT_FREQ = 1.5; // Same drift frequency as ember
const PARTICLE_SIZE = 0.06; // Larger to compensate for thin texture
const OPACITY = 1;

// Gold particles
const GOLD_COUNT = 40;
const GOLD_FALL_SPEED = 0.005;
const GOLD_SIZE = 0.02;
const GOLD_COLOR = '#D3AF37';

// === HELPERS ===

// Create a thin elongated rectangle texture for leaf-like particles
function createLeafTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(1, 2, 2, 12);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

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

export default function Bamboo_Leaves({ color = '#7a9e7e' }) {
  const pointsRef = useRef();
  const goldRef = useRef();

  const leafTexture = useMemo(() => createLeafTexture(), []);
  const leafData = useMemo(() => createParticleData(PARTICLE_COUNT), []);
  const goldData = useMemo(() => createParticleData(GOLD_COUNT), []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    const leafGeo = pointsRef.current?.geometry;
    if (leafGeo) animateFalling(leafGeo, leafData.offsets, PARTICLE_COUNT, FALL_SPEED, time);

    const goldGeo = goldRef.current?.geometry;
    if (goldGeo) animateFalling(goldGeo, goldData.offsets, GOLD_COUNT, GOLD_FALL_SPEED, time);
  });

  return (
    <group>
      {/* Leaf particles — rectangle texture */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={leafData.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={PARTICLE_SIZE}
          map={leafTexture}
          transparent
          opacity={OPACITY}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Gold metallic particles */}
      <points ref={goldRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={GOLD_COUNT}
            array={goldData.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={GOLD_COLOR}
          size={GOLD_SIZE}
          transparent
          opacity={0.9}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
