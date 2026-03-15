'use client';

// === IMPORTS ===

import { useTheme } from '@/context';
import styles from './Sound_Toggle.module.scss';

// ----------------------------------------
// Sound_Toggle Component
// Mute / unmute ambient sounds - gong icon framed by decorative lines
// ----------------------------------------
export default function Sound_Toggle({ onHoverChange }) {
  // State
  const { isSoundOn, toggleSound, playSound } = useTheme();

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div
      className={`${styles.wrapper} ${isSoundOn ? styles.active : ''}`}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      {/* Top decoration - dot then line */}
      <div className={styles.decoration_top}>
        <div className={styles.dot} />
        <div className={styles.line} />
      </div>

      {/* Toggle button + sound waves */}
      <div className={styles.toggle_row}>
        {/* Sound waves — dots when muted, animated bars when active */}
        <div className={`${styles.sound_waves} ${isSoundOn ? styles.sound_waves_active : ''}`}>
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </div>

        <button
          className={styles.toggle}
          onClick={() => { playSound('gong'); toggleSound(); }}
          aria-label={isSoundOn ? 'Mute sound' : 'Unmute sound'}
        >
          <div className={`${styles.icon} ${isSoundOn ? styles.icon_active : styles.icon_mute}`} />
        </button>
      </div>

      {/* Bottom decoration - line then dot */}
      <div className={styles.decoration_bottom}>
        <div className={styles.line} />
        <div className={styles.dot} />
      </div>
    </div>
  );
}
