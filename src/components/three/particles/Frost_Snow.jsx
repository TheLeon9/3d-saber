'use client';

// === IMPORTS ===

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// === CONSTANTS ===

// Snow streaks — like rain but bigger and slower
const SNOW_COUNT = 100;
const SNOW_FALL_SPEED = 0.008; // Slower than rain
const SNOW_SIZE = 0.06; // Bigger than rain

// Blue flakes — same animation as ember but falling (inverse)
const FLAKE_COUNT = 10;
const FLAKE_FALL_SPEED = 0.005; // Same as sakura/bamboo
const FLAKE_DRIFT_AMP = 0.015; // Same horizontal drift as ember
const FLAKE_DRIFT_FREQ = 1.5; // Same drift frequency as ember
const FLAKE_SIZE = 0.04;
const BLUE_COLOR = '#00BFFF'; // Light blue accent

// Shared
const SPREAD_X = 4; // from -2 to +2
const SPREAD_Z = 4; // from -2 to +2
const HEIGHT = 4; // from -2 to +2

// === COMPONENT ===

export default function Frost_Snow({ color = '#f8f8ff' }) {
  const snowRef = useRef();
  const flakeRef = useRef();

  // Snow particles — init above visible area like rain
  const snowPositions = useMemo(() => {
    const pos = new Float32Array(SNOW_COUNT * 3);
    for (let i = 0; i < SNOW_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * SPREAD_X;
      pos[i * 3 + 1] = HEIGHT / 2 + Math.random() * HEIGHT;
      pos[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
    }
    return pos;
  }, []);

  // Blue flakes — random phase offsets for wobble
  const { flakePositions, flakeOffsets } = useMemo(() => {
    const pos = new Float32Array(FLAKE_COUNT * 3);
    const off = new Float32Array(FLAKE_COUNT);
    for (let i = 0; i < FLAKE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * SPREAD_X;
      pos[i * 3 + 1] = (Math.random() - 0.5) * HEIGHT;
      pos[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
      off[i] = Math.random() * Math.PI * 2;
    }
    return { flakePositions: pos, flakeOffsets: off };
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Animate snow streaks — straight down like rain
    const snowGeo = snowRef.current?.geometry;
    if (snowGeo) {
      const posArray = snowGeo.attributes.position.array;
      for (let i = 0; i < SNOW_COUNT; i++) {
        posArray[i * 3 + 1] -= SNOW_FALL_SPEED;

        if (posArray[i * 3 + 1] < -HEIGHT / 2) {
          posArray[i * 3 + 1] = HEIGHT / 2 + Math.random() * 0.5;
          posArray[i * 3] = (Math.random() - 0.5) * SPREAD_X;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
        }
      }
      snowGeo.attributes.position.needsUpdate = true;
    }

    // Animate blue flakes — inverse ember (falling with horizontal drift)
    const flakeGeo = flakeRef.current?.geometry;
    if (flakeGeo) {
      const posArray = flakeGeo.attributes.position.array;
      for (let i = 0; i < FLAKE_COUNT; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;

        posArray[iy] -= FLAKE_FALL_SPEED;
        posArray[ix] += Math.sin(time * FLAKE_DRIFT_FREQ + flakeOffsets[i]) * FLAKE_DRIFT_AMP;

        if (posArray[iy] < -HEIGHT / 2) {
          posArray[iy] = HEIGHT / 2 + Math.random() * 0.5;
          posArray[ix] = (Math.random() - 0.5) * SPREAD_X;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
        }
      }
      flakeGeo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Snow streaks — white, rectangle texture, like slow rain */}
      <points ref={snowRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={SNOW_COUNT}
            array={snowPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={SNOW_SIZE}
          transparent
          opacity={0.9}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Blue flakes — small dots, cherry blossom style drift */}
      <points ref={flakeRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={FLAKE_COUNT}
            array={flakePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={BLUE_COLOR}
          size={FLAKE_SIZE}
          transparent
          opacity={0.8}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
