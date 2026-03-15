'use client';

// === IMPORTS ===

import { useRef } from 'react';
import { useTheme } from '@/context';
import { SWORD_PARTS } from '@/data/constants';
import styles from './Color_Picker.module.scss';

// ----------------------------------------
// Color_Picker Component
// Color swatches for each sword part with decorative corner frame
// ----------------------------------------
export default function Color_Picker({ onHoverChange }) {
  // State
  const { swordColors, updateSwordColor, resetSwordColors, playSound } = useTheme();

  // Refs
  const pickerRef = useRef(null);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div
      ref={pickerRef}
      className={styles.picker}
    >
      {/* Katana watermark — subtle blade behind the picker */}
      <div className={styles.katana} />

      {/* Top decoration */}
      <div className={styles.decoration_top_v}>
        <div className={styles.dot} />
        <div className={styles.line} />
      </div>
      <div className={styles.decoration_top_h}>
        <div className={styles.dot} />
        <div className={styles.line} />
      </div>

      {/* Reset Button */}
      <button
        className={styles.reset_btn}
        onClick={() => { playSound('metal'); resetSwordColors(); }}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        aria-label="Reset colors"
      >
        reset
      </button>

      {/* Color inputs */}
      <div className={styles.parts}>
        {Object.entries(SWORD_PARTS).map(([key, part]) => (
          <div
            key={key}
            className={styles.single_part}
            onMouseEnter={() => onHoverChange?.(true)}
            onMouseLeave={() => onHoverChange?.(false)}
          >
            {/* Label - kanji + name — clicks open the color input */}
            <label htmlFor={`color-${key}`} className={styles.text}>
              <span className={styles.kanji}>{part.kanji}</span>
              <p className={styles.name}>{part.label}</p>
            </label>

            {/* Hidden color input + visible circle swatch */}
            <div className={styles.input_wrapper}>
              <input
                id={`color-${key}`}
                type="color"
                value={swordColors[key]}
                onChange={(e) => { playSound('metal'); updateSwordColor(key, e.target.value); }}
                className={styles.input}
              />
              <span
                className={styles.swatch}
                style={{ backgroundColor: swordColors[key] }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom-left corner decoration */}
      <div className={styles.decoration_bottom_v}>
        <div className={styles.line} />
        <div className={styles.dot} />
      </div>
      <div className={styles.decoration_bottom_h}>
        <div className={styles.dot} />
        <div className={styles.line} />
      </div>
    </div>
  );
}
