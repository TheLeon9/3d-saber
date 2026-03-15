'use client';

// === IMPORTS ===

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useTheme } from '@/context';
import styles from './Theme_Overlay.module.scss';

// ----------------------------------------
// Theme_Overlay Component
// Full-screen overlay that wipes top-to-bottom during dark/light mode switch
// ----------------------------------------
export default function Theme_Overlay() {
  // State
  const { isThemeChanging, pendingDarkMode, commitThemeChange } = useTheme();

  const overlayRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // ----------------------------------------
  // Overlay animation — clipPath wipe from top to bottom
  // ----------------------------------------
  useEffect(() => {
    if (!isThemeChanging) return;

    setVisible(true);
  }, [isThemeChanging]);

  // Animate once the overlay DOM is mounted — progressive mask wipe
  useEffect(() => {
    if (!visible || !overlayRef.current) return;

    const el = overlayRef.current;
    const progress = { value: 0 };

    // Start fully transparent
    el.style.maskImage = 'linear-gradient(to bottom, black -20%, transparent 0%)';
    el.style.webkitMaskImage = 'linear-gradient(to bottom, black -20%, transparent 0%)';

    requestAnimationFrame(() => {
      gsap.to(progress, {
        value: 1,
        duration: 0.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          const pos = progress.value * 120 - 20;
          const mask = `linear-gradient(to bottom, black ${pos}%, transparent ${pos + 20}%)`;
          el.style.maskImage = mask;
          el.style.webkitMaskImage = mask;
        },
        onComplete: () => {
          // Apply the actual theme switch
          commitThemeChange();

          // Remove overlay after the DOM updates with the new theme
          requestAnimationFrame(() => {
            setVisible(false);
          });
        },
      });
    });
  }, [visible]);

  if (!visible) return null;

  // Build the destination gradient based on the pending theme
  const gradient = pendingDarkMode
    ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 20%, #050505), #050505)'
    : 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 45%, #f8f8ff), color-mix(in srgb, var(--color-secondary) 30%, #f8f8ff))';

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      style={{ background: gradient }}
    />
  );
}
