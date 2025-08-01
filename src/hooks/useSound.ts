import { useCallback, useRef } from "react";

interface SoundOptions {
  volume?: number;
  playbackRate?: number;
}

export const useSound = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const preloadSound = useCallback((soundName: string, soundPath: string) => {
    if (!audioRefs.current[soundName]) {
      const audio = new Audio(soundPath);
      audio.preload = "auto";
      audio.volume = 0.3; // Volume mặc định
      audioRefs.current[soundName] = audio;
    }
  }, []);

  const playSound = useCallback((soundName: string, options?: SoundOptions) => {
    const audio = audioRefs.current[soundName];
    if (audio) {
      // Reset audio to beginning
      audio.currentTime = 0;

      if (options?.volume !== undefined) {
        audio.volume = options.volume;
      }

      if (options?.playbackRate !== undefined) {
        audio.playbackRate = options.playbackRate;
      }

      // Play with error handling
      audio.play().catch((error) => {
        console.warn("Could not play sound:", error);
      });
    }
  }, []);

  const initializeSounds = useCallback(() => {
    // Preload all calculator sounds
    preloadSound("click", "/sounds/click.mp3");
    preloadSound("number", "/sounds/number-click.mp3");
    preloadSound("operator", "/sounds/operator-click.mp3");
    preloadSound("function", "/sounds/function-click.mp3");
    preloadSound("special", "/sounds/special-click.mp3");
  }, [preloadSound]);

  return {
    playSound,
    initializeSounds,
  };
};
