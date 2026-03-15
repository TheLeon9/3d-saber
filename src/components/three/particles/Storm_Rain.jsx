'use client';

// === IMPORTS ===

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// === CONSTANTS ===

const PARTICLE_COUNT = 200; // Number of rain drops
const SPREAD_X = 4; // Horizontal spread (left-right), from -2 to +2
const SPREAD_Z = 4; // Depth spread (front-back), from -1 to +1
const HEIGHT = 4; // Vertical range of the rain field, from -1 to +1
const FALL_SPEED = 0.10; // How fast drops fall per frame
const PARTICLE_SIZE = 0.02; // Size of each rain drop (larger to compensate for thin texture)
const OPACITY = 1; // Rain transparency (0 = invisible, 1 = full)

// Blue rain accent
const BLUE_COUNT = 80;
const BLUE_COLOR = '#1E90FF';

// === HELPERS ===

// Create a tall thin rectangle texture to make rain streaks instead of squares
function createRainTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(1, 0, 2, 32);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// === COMPONENT ===

// Generate rain positions starting above visible area
function createRainPositions(count) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * SPREAD_X;
    pos[i * 3 + 1] = HEIGHT / 2 + Math.random() * HEIGHT;
    pos[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
  }
  return pos;
}

// Animate rain falling straight down
function animateRain(geo, count) {
  const posArray = geo.attributes.position.array;

  for (let i = 0; i < count; i++) {
    posArray[i * 3 + 1] -= FALL_SPEED;

    if (posArray[i * 3 + 1] < -HEIGHT / 2) {
      posArray[i * 3 + 1] = HEIGHT / 2 + Math.random() * 0.5;
      posArray[i * 3] = (Math.random() - 0.5) * SPREAD_X;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
    }
  }

  geo.attributes.position.needsUpdate = true;
}

export default function Storm_Rain({ color = '#6b7db3' }) {
  const pointsRef = useRef();
  const blueRef = useRef();

  const rainTexture = useMemo(() => createRainTexture(), []);
  const positions = useMemo(() => createRainPositions(PARTICLE_COUNT), []);
  const bluePositions = useMemo(() => createRainPositions(BLUE_COUNT), []);

  useFrame(() => {
    const geo = pointsRef.current?.geometry;
    if (geo) animateRain(geo, PARTICLE_COUNT);

    const blueGeo = blueRef.current?.geometry;
    if (blueGeo) animateRain(blueGeo, BLUE_COUNT);
  });

  return (
    <group>
      {/* Main rain */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={PARTICLE_SIZE}
          map={rainTexture}
          transparent
          opacity={OPACITY}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Blue rain accent */}
      <points ref={blueRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={BLUE_COUNT}
            array={bluePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={BLUE_COLOR}
          size={PARTICLE_SIZE}
          map={rainTexture}
          transparent
          opacity={0.9}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
