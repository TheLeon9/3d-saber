'use client';

// === IMPORTS ===

import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useTheme } from '@/context';
import Katana from './Katana';
import Storm_Rain from './particles/Storm_Rain';
import Sakura_Petals from './particles/Sakura_Petals';
import Bamboo_Leaves from './particles/Bamboo_Leaves';
import Ember_Sparks from './particles/Ember_Sparks';
import Frost_Snow from './particles/Frost_Snow';
import styles from './Scene_Placeholder.module.scss';

// === CONSTANTS ===

const MIN_ZOOM = 1; // Closest camera Z position
const MAX_ZOOM = 2; // Farthest camera Z position
const ZOOM_SPEED = 0.002; // Scroll wheel sensitivity multiplier

// ----------------------------------------
// ZoomHandler — scroll wheel moves camera Z between MIN_ZOOM and MAX_ZOOM
// ----------------------------------------
function ZoomHandler() {
  const { camera, gl } = useThree();

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const newZ = camera.position.z + e.deltaY * ZOOM_SPEED;
      camera.position.z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZ));
    };

    const canvas = gl.domElement;
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [camera, gl]);

  return null;
}

// ----------------------------------------
// RotatableMesh — drag to rotate the mesh only (not the scene)
// ----------------------------------------
function RotatableMesh({ swordColors }) {
  const meshRef = useRef(); // 3D mesh to rotate
  const isDragging = useRef(false); // Whether user is currently dragging
  const prevMouse = useRef({ x: 0, y: 0 }); // Last mouse position for delta calculation
  const velocity = useRef(0); // Y-axis momentum after drag release
  const { gl } = useThree();

  // Smooth momentum when not dragging — Y rotation only
  useFrame(() => {
    if (!meshRef.current || isDragging.current) return;
    velocity.current *= 0.95;
    meshRef.current.rotation.z += velocity.current;
  });

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e) => {
      isDragging.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (!isDragging.current || !meshRef.current) return;
      const dx = (e.clientX - prevMouse.current.x) * 0.01;
      meshRef.current.rotation.z += dx;
      velocity.current = dx;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
    };
  }, [gl]);

  return (
    <group ref={meshRef} rotation={[Math.PI / 2 , 0, 0]}>
      <Suspense fallback={null}>
        <Katana swordColors={swordColors} />
      </Suspense>
    </group>
  );
}

// ----------------------------------------
// Scene_Placeholder Component
// Empty 3D scene container (placeholder)
// Will be replaced by actual Three.js scene later
// ----------------------------------------
export default function Scene_Placeholder() {
  // ----------------------------------------
  // State
  // ----------------------------------------
  const { scene, isLoading, currentScene, swordColors } = useTheme();
  const moonRef = useRef(null); // Decorative moon element for GSAP animation
  const hasAppeared = useRef(false); // Prevents re-triggering the entrance animation

  // ----------------------------------------
  // Appear animation — moon fades in + scales down when loading ends
  // ----------------------------------------
  useEffect(() => {
    if (isLoading || hasAppeared.current) return;
    hasAppeared.current = true;

    gsap.fromTo(
      moonRef.current,
      { opacity: 0, scale: 1.2 },
      { opacity: 0.4, scale: 1, duration: 1, ease: 'power2.out' }
    );
  }, [isLoading]);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={styles.canvas}>
      {/* Background gradient - responds to scene changes via CSS variables */}
      <div className={styles.gradient} />

      {/* Decorative moon - inverse of theme color */}
      <div className={styles.moon_container}>
        <div ref={moonRef} className={styles.moon} />
      </div>

      {/* Three.js particle layer */}
      <div className={styles.three_canvas}>
        <Canvas
          camera={{ position: [0, 0, 2], fov: 60 }}
          gl={{ alpha: true, antialias: false }}
          dpr={[1, 1.5]}
        >
          {/* Katana model — drag to rotate, scroll to zoom */}
          <RotatableMesh swordColors={swordColors} />
          <ZoomHandler />
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 3, 4]} intensity={1} />
          {/* Secondary light for metallic reflections on the blade */}
          <directionalLight position={[-2, 1, -2]} intensity={0.3} />

          {currentScene === 'storm' && (
            <Storm_Rain color={scene.colors.primary} />
          )}
          {currentScene === 'sakura' && (
            <Sakura_Petals color={scene.colors.primary} />
          )}
          {currentScene === 'bamboo' && (
            <Bamboo_Leaves color={scene.colors.primary} />
          )}
          {currentScene === 'ember' && (
            <Ember_Sparks color={scene.colors.primary} />
          )}
          {currentScene === 'frost' && (
            <Frost_Snow color={scene.colors.primary} />
          )}
        </Canvas>
      </div>
    </div>
  );
}
