'use client';

// === IMPORTS ===

import { HAGANE_TEXT, HAGANE_KANJI } from '@/data/constants';
import styles from './Corner_Text.module.scss';

// ----------------------------------------
// Corner_Text Component
// Brand display - top-left corner
// ----------------------------------------
export default function Corner_Text() {
  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={styles.brand}>
      {/* Brand text row */}
      <div className={styles.brand_row}>
        {/* Kanji character */}
        <span className={styles.brand_kanji}>{HAGANE_KANJI}</span>

        {/* Brand name */}
        <h1 className={styles.brand_name}>{HAGANE_TEXT}</h1>
      </div>
    </div>
  );
}
