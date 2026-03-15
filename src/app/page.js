'use client';

// === IMPORTS ===

import { useState, useCallback } from 'react';
import { ThemeProvider, useTheme } from '@/context';
import useCursor from '@/hooks/useCursor';
import styles from './page.module.scss';

// Layout Components
import Main_Layout from '@/components/layout/Main_Layout/Main_Layout';
import Corner_Text from '@/components/layout/Corner_Text/Corner_Text';
import Sword_Info from '@/components/layout/Sword_Info/Sword_Info';

// UI Components
import Loading_Screen from '@/components/ui/Loading_Screen/Loading_Screen';
import Portrait_Overlay from '@/components/ui/Portrait_Overlay/Portrait_Overlay';
import Custom_Cursor from '@/components/ui/Custom_Cursor/Custom_Cursor';
import Mode_Toggle from '@/components/ui/Mode_Toggle/Mode_Toggle';
import Scene_Switcher from '@/components/ui/Scene_Switcher/Scene_Switcher';
import Color_Picker from '@/components/ui/Color_Picker/Color_Picker';
import Sound_Toggle from '@/components/ui/Sound_Toggle/Sound_Toggle';
import Scene_Info from '@/components/ui/Scene_Info/Scene_Info';
import Theme_Overlay from '@/components/ui/Theme_Overlay/Theme_Overlay';

// Scene placeholder
import Scene_Placeholder from '@/components/three/Scene_Placeholder';

// ----------------------------------------
// HomeContent Component
// Main page content — loading screen then UI layout
// ----------------------------------------
function HomeContent() {
  // State
  const { isLoading, setIsLoading } = useTheme();
  const { isHovering, handleHoverChange } = useCursor();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handlers
  const handleLoadComplete = () => {
    setIsLoading(false);
    setIsTransitioning(true);
  };

  // Fires when the reverse slash animation ends, removing the white overlay
  const handleTransitionEnd = useCallback((e) => {
    if (e.target !== e.currentTarget) return;
    setIsTransitioning(false);
  }, []);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <main>
      {/* 3D scene - always mounted so it loads in background */}
      <Scene_Placeholder />

      {/* Cursor */}
      <Custom_Cursor isHovering={isHovering} />

      {/* Portrait orientation warning */}
      <Portrait_Overlay />

      {isLoading ? (
        /* Loader */
        <Loading_Screen onLoadComplete={handleLoadComplete} />
      ) : (
        /* Main Layout - mounts after loading, triggering CSS animations */
        <>
        {/* Reverse slash overlay */}
        {isTransitioning && (
          <div
            className={styles.transition_overlay}
            onAnimationEnd={handleTransitionEnd}
          />
        )}

        {/* Theme transition overlay — wipes top-to-bottom on mode change */}
        <Theme_Overlay />

        <Main_Layout>
          {/* Brand - top-left */}
          <Corner_Text />

          {/* Mode Toggle - top-right */}
          <Mode_Toggle onHoverChange={handleHoverChange} />

          {/* Sword Info - center */}
          <Sword_Info />

          {/* Color Picker - right center */}
          <Color_Picker onHoverChange={handleHoverChange} />

          {/* Scene Info - bottom-left */}
          <Scene_Info />

          {/* Scene Switcher - bottom center */}
          <Scene_Switcher onHoverChange={handleHoverChange} />

          {/* Sound Toggle - bottom-right */}
          <Sound_Toggle onHoverChange={handleHoverChange} />
        </Main_Layout>
        </>
      )}
    </main>
  );
}

// === PAGE ===

export default function Home() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
