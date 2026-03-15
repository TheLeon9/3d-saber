'use client';

// === IMPORTS ===

import { useEffect, useRef, useState } from 'react';
import styles from './Custom_Cursor.module.scss';

// ----------------------------------------
// Custom_Cursor Component
// Dot that grows + inverts colors on hover
// giving an "X-ray vision" effect
// ----------------------------------------
export default function Custom_Cursor({ isHovering }) {
  // Refs
  const dotRef = useRef(null);

  // Cursor visibility
  const [isVisible, setIsVisible] = useState(false);

  // Effects: Mouse tracking + lerp animation
  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    // Target mouse position (raw input)
    let mouseX = 0;
    let mouseY = 0;

    // Current animated position (interpolated every frame)
    let dotX = 0;
    let dotY = 0;

    // Lerp factor: higher = faster follow
    const DOT_SPEED = 0.18;

    // ----------------------------------------
    // Mouse move handler
    // ----------------------------------------
    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);
    };

    // ----------------------------------------
    // Visibility handlers
    // ----------------------------------------
    const show = () => setIsVisible(true);
    const hide = () => setIsVisible(false);

    // ----------------------------------------
    // Animation loop (requestAnimationFrame)
    // ----------------------------------------
    let rafId;
    const animate = () => {
      // Smooth interpolation toward mouse position
      dotX += (mouseX - dotX) * DOT_SPEED;
      dotY += (mouseY - dotY) * DOT_SPEED;

      dot.style.transform = `translate(${dotX}px, ${dotY}px)`;

      rafId = requestAnimationFrame(animate);
    };

    // ----------------------------------------
    // Event listeners
    // ----------------------------------------
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', show);
    document.addEventListener('mouseleave', hide);

    // Start animation loop
    rafId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', show);
      document.removeEventListener('mouseleave', hide);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div
      className={`${styles.container} ${isVisible ? styles.visible : ''}`}
    >
      <div
        ref={dotRef}
        className={`${styles.dot} ${isHovering ? styles.hovering : ''}`}
      />
    </div>
  );
}
