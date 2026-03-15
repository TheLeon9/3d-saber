'use client';

// === IMPORTS ===

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useTheme } from '@/context';
import { SCENES } from '@/data/constants';
import styles from './Sword_Info.module.scss';

// ----------------------------------------
// Sword_Info Component
// Displays sword title (kanji + romaji) and lore description
// ----------------------------------------
export default function Sword_Info() {
  // State
  const { currentScene, isTransitioning } = useTheme();
  const scene = SCENES[currentScene];

  // Buffered scene — only updates when text is invisible
  const [displayedScene, setDisplayedScene] = useState(scene);
  const isFirstRender = useRef(true);

  // Refs for individually animated elements
  const titleKanjiRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const kanjiRef = useRef(null);

  // ----------------------------------------
  // Transition animation — staggered slide out/in for text, fade for kanji
  // ----------------------------------------
  useEffect(() => {
    if (!titleKanjiRef.current) return;

    const animEls = [titleKanjiRef.current, titleRef.current, textRef.current];

    if (isTransitioning) {
      // Phase out — slide up + fade out with stagger
      animEls.forEach((el, i) => {
        gsap.to(el, {
          y: -10,
          opacity: 0,
          duration: 0.25,
          delay: i * 0.04,
          ease: 'power2.in',
        });
      });

      // Background kanji — fade out with delay
      gsap.to(kanjiRef.current, {
        opacity: 0,
        duration: 0.25,
        delay: 0.4,
        ease: 'power2.in',
      });
    } else {
      // Swap content while invisible
      setDisplayedScene(scene);
    }
  }, [isTransitioning]);

  // Phase in when displayed scene updates (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const animEls = [titleKanjiRef.current, titleRef.current, textRef.current];
    // Target opacities matching CSS values
    const targetOpacities = [1, 1, 1];

    // Phase in — slide from above + fade in with stagger
    animEls.forEach((el, i) => {
      gsap.fromTo(
        el,
        { y: -10, opacity: 0 },
        {
          y: 0,
          opacity: targetOpacities[i],
          duration: 0.3,
          delay: 0.1 + i * 0.04,
          ease: 'power2.out',
        }
      );
    });

    // Background kanji — simple fade in to $less_less_opacity
    gsap.fromTo(
      kanjiRef.current,
      { opacity: 0 },
      { opacity: 0.4, duration: 0.3, delay: 0.1, ease: 'power2.out' }
    );
  }, [displayedScene]);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={styles.info}>
      {/* Title section */}
      <div className={styles.title_block}>
        {/* Kanji title */}
        <h2 ref={titleKanjiRef} className={styles.title_kanji}>
          {displayedScene.identity.title}
        </h2>

        {/* Dot + line decoration */}
        <div className={styles.decoration}>
          <div className={styles.dot} />
          <div className={styles.line} />
        </div>

        {/* Romanized name */}
        <h2 ref={titleRef} className={styles.title}>
          {displayedScene.identity.romaji}
        </h2>

        {/* Separator */}
        <div className={styles.separator} />
      </div>

      {/* Description section */}
      <div className={styles.description_block}>
        <p ref={textRef} className={styles.text}>
          {displayedScene.identity.description}
        </p>
      </div>

      {/* Kanji Decoration */}
      <span ref={kanjiRef} className={styles.description_kanji}>
        {displayedScene.identity.kanji}
      </span>
    </div>
  );
}
