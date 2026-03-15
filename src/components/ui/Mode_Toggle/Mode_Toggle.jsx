'use client';

// === IMPORTS ===

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useTheme } from '@/context';
import styles from './Mode_Toggle.module.scss';

// ----------------------------------------
// Mode_Toggle Component
// Switches between dark and light mode - lantern icon framed by decorative lines
// ----------------------------------------
export default function Mode_Toggle({ onHoverChange }) {
  // State
  const { isDarkMode, requestToggleDarkMode, playSound } = useTheme();

  // Buffered mode — only updates when indicator is invisible
  const [displayedDark, setDisplayedDark] = useState(isDarkMode);
  const isFirstRender = useRef(true);
  const isAnimating = useRef(false);

  // Refs
  const indicatorRef = useRef(null);

  // ----------------------------------------
  // Appear animation — indicator scales in after decorations (CSS animation conflicts with GSAP toggle)
  // ----------------------------------------
  useEffect(() => {
    gsap.fromTo(
      indicatorRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 0.6, duration: 0.4, delay: 0.8, ease: 'power2.out' }
    );
  }, []);

  // ----------------------------------------
  // Animated toggle — indicator exits upward, overlay wipes, then indicator returns
  // ----------------------------------------
  const handleToggle = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    // Play chime SFX and start theme overlay transition
    playSound('chime');
    requestToggleDarkMode();

    // Phase out — slide up out of view + fade
    gsap.to(indicatorRef.current, {
      y: -80,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
    });
  }, [requestToggleDarkMode]);

  // When isDarkMode changes, swap the displayed icon and animate in
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setDisplayedDark(isDarkMode);
  }, [isDarkMode]);

  // Phase in when displayed mode updates (skip first render)
  const isFirstDisplay = useRef(true);
  useEffect(() => {
    if (isFirstDisplay.current) {
      isFirstDisplay.current = false;
      return;
    }

    const el = indicatorRef.current;

    // Slide in from above
    gsap.fromTo(
      el,
      { y: -80, opacity: 0 },
      {
        y: 0,
        opacity: 0.6,
        duration: 0.3,
        delay: 0.1,
        ease: 'power2.out',
        onComplete: () => {
          isAnimating.current = false;
        },
      }
    );
  }, [displayedDark]);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      {/* Top decoration - dot then line */}
      <div className={styles.decoration_top}>
        <div className={styles.dot} />
        <div className={styles.line} />
      </div>

      {/* Toggle button */}
      <button
        className={styles.toggle}
        onClick={handleToggle}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div
          className={`${styles.icon} ${isDarkMode ? styles.icon_dark : styles.icon_light}`}
        />
      </button>

      {/* Bottom decoration - line then dot */}
      <div className={styles.decoration_bottom}>
        <div className={styles.line} />
        <div className={styles.dot} />
      </div>

      {/* Sun/Moon indicator - animated on toggle */}
      <div
        ref={indicatorRef}
        className={`${styles.mode_indicator} ${displayedDark ? styles.indicator_dark : styles.indicator_light}`}
      />
    </div>
  );
}
