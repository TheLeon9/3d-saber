'use client';

// === IMPORTS ===

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import {
  SCENES,
  SCENE_ORDER,
  DEFAULT_SCENE,
  DEFAULT_SWORD_COLORS,
} from '@/data/constants';
import useAudio from '@/hooks/useAudio';

// === CONSTANTS ===

const TRANSITION_DURATION = 600;

// Map scene colors to sword parts
function swordColorsFromScene(colors) {
  return {
    blade: colors.secondary,
    guard: colors.tertiary,
    handle: colors.tertiary,
    pommel: colors.primary,
    scabbard: colors.tertiary,
  };
}

// === CONTEXT ===

const ThemeContext = createContext(null);

// === COMPONENT ===

export function ThemeProvider({ children }) {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [currentScene, setCurrentScene] = useState(DEFAULT_SCENE);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [swordColors, setSwordColors] = useState(DEFAULT_SWORD_COLORS);
  const transitionTimeoutRef = useRef(null);

  // Audio — SFX, ambiance, and scene music management
  const { playSound } = useAudio(isSoundOn, currentScene);

  // Current scene data (all-in-one)
  const scene = useMemo(() => {
    return SCENES[currentScene] ?? SCENES[DEFAULT_SCENE];
  }, [currentScene]);

  // Change scene with transition
  const changeScene = useCallback(
    (newScene) => {
      if (newScene === currentScene || isTransitioning) return;
      if (!SCENES[newScene]) return;

      setIsTransitioning(true);

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = setTimeout(() => {
        setCurrentScene(newScene);

        transitionTimeoutRef.current = setTimeout(() => {
          setIsTransitioning(false);
        }, TRANSITION_DURATION / 2);
      }, TRANSITION_DURATION / 2);
    },
    [currentScene, isTransitioning]
  );

  // Navigate to next scene
  const nextScene = useCallback(() => {
    const currentIndex = SCENE_ORDER.indexOf(currentScene);
    const nextIndex = (currentIndex + 1) % SCENE_ORDER.length;
    changeScene(SCENE_ORDER[nextIndex]);
  }, [currentScene, changeScene]);

  // Navigate to previous scene
  const prevScene = useCallback(() => {
    const currentIndex = SCENE_ORDER.indexOf(currentScene);
    const prevIndex =
      (currentIndex - 1 + SCENE_ORDER.length) % SCENE_ORDER.length;
    changeScene(SCENE_ORDER[prevIndex]);
  }, [currentScene, changeScene]);

  // Theme transition state — overlay-driven toggle
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [pendingDarkMode, setPendingDarkMode] = useState(isDarkMode);

  // Request theme toggle — starts overlay animation before actual switch
  const requestToggleDarkMode = useCallback(() => {
    if (isThemeChanging) return;
    setPendingDarkMode(!isDarkMode);
    setIsThemeChanging(true);
  }, [isDarkMode, isThemeChanging]);

  // Commit theme change — called by Theme_Overlay when animation finishes
  const commitThemeChange = useCallback(() => {
    setIsDarkMode(pendingDarkMode);
    setIsThemeChanging(false);
  }, [pendingDarkMode]);

  // Direct toggle (kept for programmatic use)
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    setIsSoundOn((prev) => !prev);
  }, []);

  // Update a specific sword part color
  const updateSwordColor = useCallback((part, color) => {
    setSwordColors((prev) => ({ ...prev, [part]: color }));
  }, []);

  // Reset sword colors to factory defaults
  const resetSwordColors = useCallback(() => {
    setSwordColors(DEFAULT_SWORD_COLORS);
  }, []);

  // Effects: Sync CSS variables for scene colors and theme mode
  useEffect(() => {
    const root = document.documentElement;

    // Scene colors — only 3 dynamic values
    root.style.setProperty('--color-primary', scene.colors.primary);
    root.style.setProperty('--color-secondary', scene.colors.secondary);
    root.style.setProperty('--color-tertiary', scene.colors.tertiary);

    // Theme mode — CSS handles text/gradient via data-theme selectors
    root.dataset.theme = isDarkMode ? 'dark' : 'light';
  }, [scene, isDarkMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // ----------------------------------------
  // Render
  // ----------------------------------------
  const value = useMemo(
    () => ({
      isLoading,
      setIsLoading,
      currentScene,
      scene,
      isTransitioning,
      changeScene,
      nextScene,
      prevScene,
      isDarkMode,
      toggleDarkMode,
      isThemeChanging,
      pendingDarkMode,
      requestToggleDarkMode,
      commitThemeChange,
      isSoundOn,
      toggleSound,
      swordColors,
      updateSwordColor,
      resetSwordColors,
      playSound,
    }),
    [
      isLoading,
      currentScene,
      scene,
      isTransitioning,
      changeScene,
      nextScene,
      prevScene,
      isDarkMode,
      toggleDarkMode,
      isThemeChanging,
      pendingDarkMode,
      requestToggleDarkMode,
      commitThemeChange,
      isSoundOn,
      toggleSound,
      swordColors,
      updateSwordColor,
      resetSwordColors,
      playSound,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// === HOOK ===

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
