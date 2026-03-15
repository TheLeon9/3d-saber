'use client';

// === IMPORTS ===

import { useEffect, useCallback, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTheme } from '@/context';
import { SCENE_ORDER, SCENES } from '@/data/constants';
import styles from './Scene_Switcher.module.scss';

// === CONSTANTS ===

const SCENE_COUNT = SCENE_ORDER.length;

// ----------------------------------------
// Scene_Switcher Component
// 5 scene dots in horizontal row with shuriken separators
// ----------------------------------------
export default function Scene_Switcher({ onHoverChange }) {
  // ----------------------------------------
  // State
  // ----------------------------------------
  const { currentScene, changeScene, isTransitioning, playSound } = useTheme();
  const currentIndex = SCENE_ORDER.indexOf(currentScene);

  const nameRef = useRef(null);
  const circleRefs = useRef([]);
  const [displayedScene, setDisplayedScene] = useState(currentScene);
  const isFirstRender = useRef(true);
  const isFirstDisplay = useRef(true);
  const isFirstCircle = useRef(true);

  // ----------------------------------------
  // Effects
  // ----------------------------------------

  // Sync with isTransitioning — fade out on true, swap content on false
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isTransitioning) {
      // Phase out
      gsap.to(nameRef.current, {
        opacity: 0,
        y: -5,
        duration: 0.25,
        ease: 'power2.in',
      });
    } else {
      // Swap content while invisible
      setDisplayedScene(currentScene);
    }
  }, [isTransitioning]);

  // Animate title fade in when displayed scene changes
  useEffect(() => {
    if (isFirstDisplay.current) {
      isFirstDisplay.current = false;
      return;
    }
    if (nameRef.current) {
      gsap.to(nameRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        delay: 0.1,
        ease: 'power2.out',
      });
    }
  }, [displayedScene]);

  // Animate active circle opacity when scene changes (skip initial mount)
  useEffect(() => {
    if (isFirstCircle.current) {
      isFirstCircle.current = false;
      return;
    }
    circleRefs.current.forEach((el, i) => {
      if (!el) return;
      const isActive = i === currentIndex;
      gsap.to(el, {
        opacity: isActive ? 1 : 0.6,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  }, [currentIndex]);

  // ----------------------------------------
  // Handlers
  // ----------------------------------------

  // Navigate to a specific scene by index
  const handleNavigate = useCallback(
    (targetIndex) => {
      if (targetIndex === currentIndex || isTransitioning) return;
      playSound('katana');
      changeScene(SCENE_ORDER[targetIndex]);
    },
    [isTransitioning, currentIndex, changeScene]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = ((currentIndex - 1) % SCENE_COUNT + SCENE_COUNT) % SCENE_COUNT;
        handleNavigate(prevIdx);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (currentIndex + 1) % SCENE_COUNT;
        handleNavigate(nextIdx);
      }
    },
    [handleNavigate, currentIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={styles.switcher}>
      {/* Scene subtitle text */}
      <span ref={nameRef} className={styles.scene_name}>
        {SCENES[displayedScene].identity.subtitle}
      </span>

      {/* Horizontal scene selector: dot · — shuriken — · dot */}
      <div className={styles.scene_row}>
        {SCENE_ORDER.map((sceneName, i) => {
          const sceneData = SCENES[sceneName];
          const isActive = i === currentIndex;

          return (
            <div key={sceneName} className={styles.scene_item}>
              {/* Separator before each scene (except the first) */}
              {i > 0 && (
                <div className={styles.separator}>
                  <div className={styles.sep_dot} />
                  <div className={styles.sep_line} />
                  <div className={styles.sep_dot} />
                  <div className={styles.shuriken} />
                </div>
              )}

              {/* Scene circle — colored with yin-yang overlay */}
              <button
                ref={(el) => (circleRefs.current[i] = el)}
                className={`${styles.scene_circle} ${isActive ? styles.scene_circle_active : ''}`}
                style={{
                  backgroundColor: sceneData.colors.primary,
                  '--scene-color': sceneData.colors.primary,
                }}
                onClick={() => handleNavigate(i)}
                onMouseEnter={() => onHoverChange?.(true)}
                onMouseLeave={() => onHoverChange?.(false)}
                disabled={isTransitioning}
                aria-label={`Switch to ${sceneData.identity.subtitle}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
