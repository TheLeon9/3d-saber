'use client';

// === IMPORTS ===

import Image from 'next/image';
import { HAGANE_TEXT } from '@/data/constants';
import styles from './Portrait_Overlay.module.scss';

// ----------------------------------------
// Rotate Phone SVG Icon
// ----------------------------------------
const RotateIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Phone in portrait */}
    <rect
      x="30"
      y="20"
      width="30"
      height="50"
      rx="4"
      stroke="currentColor"
      strokeWidth="2"
      opacity="0.3"
    />
    <circle cx="45" cy="64" r="2" fill="currentColor" opacity="0.3" />

    {/* Phone in landscape */}
    <rect
      x="55"
      y="45"
      width="50"
      height="30"
      rx="4"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="99" cy="60" r="2" fill="currentColor" />

    {/* Rotation arrow */}
    <path
      d="M50 35 C60 25, 75 30, 70 45"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M68 39 L70 46 L63 44" fill="currentColor" />
  </svg>
);

// ----------------------------------------
// Portrait_Overlay Component
// Shows on mobile portrait orientation
// ----------------------------------------
export default function Portrait_Overlay() {
  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={styles.overlay}>
      {/* Header kanji */}
      <h2 className={styles.header}>{HAGANE_TEXT}</h2>

      {/* Corner shurikens */}
      <div className={`${styles.shuriken} ${styles.top_left}`} />
      <div className={`${styles.shuriken} ${styles.top_right}`} />
      <div className={`${styles.shuriken} ${styles.bottom_left}`} />
      <div className={`${styles.shuriken} ${styles.bottom_right}`} />

      {/* Content */}
      <div className={styles.content}>
        <RotateIcon className={styles.icon} />
        <p className={styles.text}>
          For a better experience, please rotate your phone to landscape
        </p>
      </div>

      {/* Footer image */}
      <div className={styles.footer_img_cont}>
        <div className={styles.footer_img} />
      </div>
    </div>
  );
}
