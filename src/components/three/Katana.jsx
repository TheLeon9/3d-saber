'use client';

// === IMPORTS ===

import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// === CONSTANTS ===

const MODEL_PATH = '/models/katana_scene.glb';

// Node name → swordColors key + material properties
const NODE_MAP = {
  Blade:              { colorKey: 'blade',    metalness: 0.9, roughness: 0.2 },
  Guard_End_Piece:    { colorKey: 'guard',    metalness: 0.7, roughness: 0.4 },
  Guard_Handguard:    { colorKey: 'guard',    metalness: 0.7, roughness: 0.4 },
  Guard_Hilt:         { colorKey: 'guard',    metalness: 0.7, roughness: 0.4 },
  Guard_Hilt_2:       { colorKey: 'guard',    metalness: 0.7, roughness: 0.4 },
  Guard_Scaabbard:    { colorKey: 'guard',    metalness: 0.7, roughness: 0.4 },
  Guard_Scaabbard_2:  { colorKey: 'guard',    metalness: 0.7, roughness: 0.4 },
  Handle:             { colorKey: 'handle',   metalness: 0.1, roughness: 0.8 },
  Pommel:             { colorKey: 'pommel',   metalness: 0.6, roughness: 0.3 },
  Sheath:             { colorKey: 'scabbard', metalness: 0.2, roughness: 0.6 },
};

// === COMPONENT ===

// GLB katana model — each part receives its color from the color picker
export default function Katana({ swordColors }) {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef();

  // ----------------------------------------
  // Clone shared materials so each mesh can be colored independently
  // ----------------------------------------
  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;
      if (NODE_MAP[child.name] && !child.userData._materialCloned) {
        child.material = child.material.clone();
        child.userData._materialCloned = true;
      }
    });
  }, [scene]);

  // ----------------------------------------
  // Apply dynamic colors when swordColors change
  // ----------------------------------------
  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;

      const mapping = NODE_MAP[child.name];
      if (!mapping) return;

      const color = swordColors[mapping.colorKey];
      if (child.material) {
        child.material.color.set(color);
        child.material.metalness = mapping.metalness;
        child.material.roughness = mapping.roughness;
        child.material.needsUpdate = true;
      }
    });
  }, [swordColors, scene]);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <group ref={groupRef} scale={0.16} position={[-0.1, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
