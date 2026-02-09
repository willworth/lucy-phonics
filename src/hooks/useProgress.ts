import { useCallback, useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import type { ProgressState, Sound } from '../types';

const STORAGE_KEY = 'lucy-progress-v1';

const createInitialProgress = (sounds: Sound[], requiredCorrect: number): ProgressState => {
  const soundProgress = Object.fromEntries(
    sounds.map((sound, index) => [
      sound.id,
      {
        correct: 0,
        attempts: 0,
        unlocked: index === 0
      }
    ])
  );

  return {
    schemaVersion: 1,
    unlockedSoundIndex: 0,
    requiredCorrect,
    sounds: soundProgress
  };
};

export const useProgress = (sounds: Sound[], requiredCorrect = 3) => {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const stored = await get<ProgressState>(STORAGE_KEY);
      if (stored && stored.schemaVersion === 1) {
        setProgress(stored);
      } else {
        const initial = createInitialProgress(sounds, requiredCorrect);
        await set(STORAGE_KEY, initial);
        setProgress(initial);
      }
      setLoading(false);
    };

    void load();
  }, [requiredCorrect, sounds]);

  const recordAttempt = useCallback(
    async (soundId: string, correct: boolean) => {
      if (!progress) {
        return { unlockedNext: false, finishedAll: false };
      }

      const current = progress.sounds[soundId];
      const updatedSound = {
        ...current,
        attempts: current.attempts + 1,
        correct: correct ? current.correct + 1 : current.correct
      };

      const next = {
        ...progress,
        sounds: {
          ...progress.sounds,
          [soundId]: updatedSound
        }
      };

      let unlockedNext = false;
      const currentIndex = sounds.findIndex((sound) => sound.id === soundId);
      const shouldUnlock =
        correct &&
        updatedSound.correct >= progress.requiredCorrect &&
        progress.unlockedSoundIndex === currentIndex &&
        currentIndex + 1 < sounds.length;

      if (shouldUnlock) {
        const nextSoundId = sounds[currentIndex + 1]?.id;
        if (nextSoundId) {
          next.sounds[nextSoundId] = {
            ...next.sounds[nextSoundId],
            unlocked: true
          };
          next.unlockedSoundIndex = currentIndex + 1;
          unlockedNext = true;
        }
      }

      const finishedAll =
        correct &&
        updatedSound.correct >= progress.requiredCorrect &&
        currentIndex === sounds.length - 1;

      setProgress(next);
      await set(STORAGE_KEY, next);

      return { unlockedNext, finishedAll };
    },
    [progress, sounds]
  );

  return { progress, loading, recordAttempt };
};
