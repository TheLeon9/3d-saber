'use client';

// === IMPORTS ===

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useTheme } from '@/context';
import { SCENES } from '@/data/constants';
import styles from './Scene_Info.module.scss';

// === CONSTANTS ===

const ANIM_MARGIN = 26; // $animation_margin

// ----------------------------------------
// Scene_Info Component
// Scene indicator positioned bottom-left - element icon matching the active scene
// ----------------------------------------
export default function Scene_Info() {
  // State
  const { currentScene, isTransitioning } = useTheme();
  const scene = SCENES[currentScene];

  // Buffered icon — only updates when element is invisible
  const [displayedIcon, setDisplayedIcon] = useState(scene?.element);
  const isFirstRender = useRef(true);

  // Refs
  const iconRef = useRef(null);

  // ----------------------------------------
  // Transition animation — slide left out, swap content, slide left in
  // ----------------------------------------
  useEffect(() => {
    const el = iconRef.current;
    if (!el) return;

    if (isTransitioning) {
      // Phase out — slide left + fade out
      gsap.to(el, {
        x: -ANIM_MARGIN,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      });
    } else {
      // Swap content while invisible, then animate in
      setDisplayedIcon(scene?.element);
    }
  }, [isTransitioning]);

  // Phase in when displayed icon updates (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const el = iconRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { x: -ANIM_MARGIN, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.3, delay: 0.1, ease: 'power2.out' }
    );
  }, [displayedIcon]);

  // ----------------------------------------
  // Render — uses buffered icon, not live scene
  // ----------------------------------------
  return (
    <div className={styles.wrapper}>
      {/* Top decoration - dot then line */}
      <div className={styles.decoration_top}>
        <div className={styles.dot} />
        <div className={styles.line} />
      </div>

      {/* Scene element icon — color handled by CSS (secondary/tertiary) */}
      <div ref={iconRef} className={styles.icon_container}>
        <div
          className={styles.icon}
          style={{
            maskImage: `url('${displayedIcon}')`,
            WebkitMaskImage: `url('${displayedIcon}')`,
          }}
        />
      </div>

      {/* Bottom decoration - line then dot */}
      <div className={styles.decoration_bottom}>
        <div className={styles.line} />
        <div className={styles.dot} />
      </div>
    </div>
  );
}
