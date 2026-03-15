'use client';

// === IMPORTS ===

import { useState, useEffect, useCallback } from 'react';
import { HAGANE_TEXT } from '@/data/constants';
import styles from './Loading_Screen.module.scss';

// === CONSTANTS ===

const EXIT_DELAY = 3500;

// ----------------------------------------
// Loading_Screen Component
// ----------------------------------------
export default function Loading_Screen({ onLoadComplete }) {
  // ----------------------------------------
  // State
  // ----------------------------------------
  const [isExiting, setIsExiting] = useState(false);

  // ----------------------------------------
  // Handlers
  // ----------------------------------------

  // Fires when the slash flash animation ends, then unmounts the loading screen
  // Only unmount after the vertical grow finishes (second animation)
  const handleFlashEnd = useCallback(
    (e) => {
      if (e.animationName.includes('slashGrow')) onLoadComplete();
    },
    [onLoadComplete]
  );

  // ----------------------------------------
  // Effects
  // ----------------------------------------

  // Start exit animation after a brief display period
  useEffect(() => {
    const timer = setTimeout(() => setIsExiting(true), EXIT_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={styles.container}>
      {/* Background image */}
      <div className={styles.background_img_cont}>
        <div className={styles.background_img} />
      </div>

      {/* Front image */}
      <div className={styles.front_img_cont}>
        <div className={styles.front_img} />
      </div>

      {/* Title */}
      <div className={styles.title_cont}>
        <h2 className={styles.title}>{HAGANE_TEXT}</h2>
      </div>

      {/* Notice */}
      <div className={styles.notice_cont}>
        <p className={styles.notice}>
          we use ambient sound to make your experience more immersive
        </p>
      </div>

      {/* Corner shurikens */}
      <div className={`${styles.shuriken} ${styles.top_left}`} />
      <div className={`${styles.shuriken} ${styles.top_right}`} />
      <div className={`${styles.shuriken} ${styles.bottom_left}`} />
      <div className={`${styles.shuriken} ${styles.bottom_right}`} />

      {/* Slash flash exit animation */}
      {isExiting && (
        <>
          <div
            className={styles.flash_line_left}
            onAnimationEnd={handleFlashEnd}
          />
          <div
            className={styles.flash_line_right}
            onAnimationEnd={handleFlashEnd}
          />
        </>
      )}
    </div>
  );
}
