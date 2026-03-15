'use client';

// === IMPORTS ===

import styles from './Main_Layout.module.scss';

// ----------------------------------------
// Main_Layout Component
// Thin fullscreen overlay - children position themselves
// ----------------------------------------
export default function Main_Layout({ children }) {
  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <div className={styles.layout}>
      {/* Children - Others Elements */}
      {children}
    </div>
  );
}
