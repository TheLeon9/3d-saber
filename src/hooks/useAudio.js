'use client';

// === IMPORTS ===

import { useRef, useEffect, useCallback } from 'react';

// === CONSTANTS ===

// Toggle SFX — one-shot sounds triggered by UI interactions
const SOUNDS = {
  ambiance: '/audio/ambiance.mp3', // Looping background atmosphere
  chime: '/audio/toggle/chime.mp3', // Theme toggle feedback
  gong: '/audio/toggle/gong.mp3', // Sound toggle feedback (always plays)
  katana: '/audio/toggle/katana.mp3', // Scene change slash
  metal: '/audio/toggle/hammer.mp3', // Sword customization hit
};

// Scene-specific background music — loops while a scene is active (supports multiple layers)
// Each track can be a string (looping) or { src, interval: [min, max], volume? } for spaced repeats
const SCENE_MUSIC = {
  sakura: ['/audio/scene/sakura/birds.mp3', '/audio/scene/sakura/chime.mp3'], // Birds + wind chimes
  bamboo: ['/audio/scene/bamboo/nature.mp3', { src: '/audio/scene/bamboo/bamboo.mp3', interval: [5000, 8000] }], // Nature loop + sporadic bamboo cracks
  ember: ['/audio/scene/ember/fire.mp3', '/audio/scene/ember/volcano.mp3'], // Crackling fire + volcano rumble
  storm: ['/audio/scene/storm/rain.mp3', { src: '/audio/scene/storm/thunder.mp3', volume: 0.3 }], // Rain + louder thunder
  frost: [{ src: '/audio/scene/frost/snow.mp3', volume: 0.3 }, { src: '/audio/scene/frost/owl.mp3', interval: [5000, 8000] }, { src: '/audio/scene/frost/wolf.mp3', interval: [5000, 8000], volume: 0.3 }], // Wind + sporadic owl & wolf calls
};

const AMBIANCE_VOLUME = 0.08; // Global ambiance level
const SCENE_VOLUME = 0.2; // Scene music level
const SFX_VOLUME = 0.4; // One-shot SFX level
const FADE_DURATION = 800; // Crossfade duration in ms between scene tracks

// === HOOK ===

export default function useAudio(isSoundOn, currentScene) {
  // Refs — persist Audio instances across renders
  const audioRefs = useRef({});
  const sceneMusicRef = useRef([]); // Array of active scene Audio tracks
  const intervalTimersRef = useRef([]); // Timeout IDs for interval-based tracks
  const fadeRef = useRef(null);
  const isSoundOnRef = useRef(isSoundOn);

  // Keep ref in sync so callbacks always read latest value
  useEffect(() => {
    isSoundOnRef.current = isSoundOn;
  }, [isSoundOn]);

  // Preload all Audio objects once
  useEffect(() => {
    Object.entries(SOUNDS).forEach(([name, src]) => {
      if (!audioRefs.current[name]) {
        const audio = new Audio(src);
        if (name === 'ambiance') {
          audio.loop = true;
          audio.volume = AMBIANCE_VOLUME;
        } else {
          audio.volume = SFX_VOLUME;
        }
        audioRefs.current[name] = audio;
      }
    });
  }, []);

  // ----------------------------------------
  // Ambiance — start/stop based on isSoundOn
  // ----------------------------------------
  useEffect(() => {
    const ambiance = audioRefs.current.ambiance;
    if (!ambiance) return;

    if (isSoundOn) {
      ambiance.play().catch(() => {});
    } else {
      ambiance.pause();
      ambiance.currentTime = 0;
    }
  }, [isSoundOn]);

  // ----------------------------------------
  // Scene music — crossfade on scene change
  // ----------------------------------------
  useEffect(() => {
    const sources = SCENE_MUSIC[currentScene];
    const prevTracks = sceneMusicRef.current;

    // Clear any ongoing fade
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);

    // Clear interval timers from previous scene
    intervalTimersRef.current.forEach((id) => clearTimeout(id));
    intervalTimersRef.current = [];

    // Fade out all previous scene tracks
    if (prevTracks.length > 0) {
      const fadeOut = () => {
        let stillFading = false;
        prevTracks.forEach((track) => {
          if (track.volume > 0.01) {
            track.volume = Math.max(0, track.volume - SCENE_VOLUME / (FADE_DURATION / 16));
            stillFading = true;
          } else {
            track.pause();
            track.currentTime = 0;
            track.volume = SCENE_VOLUME;
          }
        });
        if (stillFading) fadeRef.current = requestAnimationFrame(fadeOut);
      };
      fadeOut();
    }

    // No music for this scene
    if (!sources) {
      sceneMusicRef.current = [];
      return;
    }

    // Create and start all scene tracks
    const newTracks = [];
    const newTimers = [];

    sources.forEach((entry) => {
      const isObject = typeof entry === 'object';
      const src = isObject ? entry.src : entry;
      const trackVolume = (isObject && entry.volume) || SCENE_VOLUME;
      const music = new Audio(src);
      music.volume = 0;
      // Store target volume on the element for fade/toggle logic
      music._targetVolume = trackVolume;

      if (isObject && entry.interval) {
        // Interval track — plays once, waits random delay, repeats
        const [min, max] = entry.interval;
        const scheduleNext = () => {
          const delay = min + Math.random() * (max - min);
          const timerId = setTimeout(() => {
            if (!isSoundOnRef.current) {
              scheduleNext();
              return;
            }
            music.currentTime = 0;
            music.volume = trackVolume;
            music.play().catch(() => {});
            music.onended = scheduleNext;
          }, delay);
          newTimers.push(timerId);
          intervalTimersRef.current = newTimers;
        };
        scheduleNext();
      } else {
        // Looping track — standard crossfade behavior
        music.loop = true;
      }

      newTracks.push(music);
    });

    sceneMusicRef.current = newTracks;

    if (isSoundOn) {
      // Only auto-play looping tracks, interval tracks handle their own playback
      const loopingTracks = newTracks.filter((t) => t.loop);
      loopingTracks.forEach((music) => music.play().catch(() => {}));

      // Fade in looping tracks
      const fadeIn = () => {
        let stillFading = false;
        loopingTracks.forEach((music) => {
          const target = music._targetVolume;
          if (music.volume < target - 0.01) {
            music.volume = Math.min(target, music.volume + target / (FADE_DURATION / 16));
            stillFading = true;
          } else {
            music.volume = target;
          }
        });
        if (stillFading) fadeRef.current = requestAnimationFrame(fadeIn);
      };
      fadeIn();
    }
  }, [currentScene]); // eslint-disable-line react-hooks/exhaustive-deps

  // ----------------------------------------
  // Scene music — respond to sound toggle
  // ----------------------------------------
  useEffect(() => {
    const tracks = sceneMusicRef.current;
    if (tracks.length === 0) return;

    tracks.forEach((music) => {
      if (isSoundOn) {
        // Only resume looping tracks, interval tracks handle their own playback
        if (music.loop) {
          music.volume = music._targetVolume;
          music.play().catch(() => {});
        }
      } else {
        music.pause();
        music.currentTime = 0;
      }
    });
  }, [isSoundOn]);

  // ----------------------------------------
  // Play a one-shot SFX
  // Gong always plays (toggle feedback), others only when sound is ON
  // ----------------------------------------
  const playSound = useCallback((name) => {
    if (name !== 'gong' && !isSoundOnRef.current) return;

    const audio = audioRefs.current[name];
    if (!audio) return;

    // Reset to start so rapid fires overlap correctly
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);

    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
      sceneMusicRef.current.forEach((music) => {
        music.pause();
        music.currentTime = 0;
      });
      intervalTimersRef.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  return { playSound };
}
