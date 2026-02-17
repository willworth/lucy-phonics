import { useCallback, useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import type { ProgressState, Sound, SoundProgress } from '../types';

const STORAGE_KEY = 'lucy-progress-v1';

interface LegacySoundProgress {
  correct: number;
  attempts: number;
  unlocked: boolean;
}

interface LegacyProgressState {
  schemaVersion: 1;
  unlockedSoundIndex: number;
  requiredCorrect: number;
  sounds: Record<string, LegacySoundProgress>;
}

const createSoundProgress = (unlocked: boolean): SoundProgress => ({
  correct: 0,
  attempts: 0,
  unlocked,
  correctStreak: 0,
  lastPracticedAt: null
});

const createInitialProgress = (sounds: Sound[], requiredCorrect: number): ProgressState => {
  const soundProgress = Object.fromEntries(sounds.map((sound, index) => [sound.id, createSoundProgress(index === 0)]));

  return {
    schemaVersion: 2,
    unlockedSoundIndex: 0,
    requiredCorrect,
    sounds: soundProgress
  };
};

const migrateProgress = (stored: ProgressState | LegacyProgressState, sounds: Sound[], requiredCorrect: number): ProgressState => {
  if (stored.schemaVersion === 2) {
    return {
      ...stored,
      requiredCorrect,
      sounds: Object.fromEntries(
        sounds.map((sound, index) => {
          const existing = stored.sounds[sound.id];
          return [
            sound.id,
            {
              correct: existing?.correct ?? 0,
              attempts: existing?.attempts ?? 0,
              unlocked: existing?.unlocked ?? index === 0,
              correctStreak: existing?.correctStreak ?? 0,
              lastPracticedAt: existing?.lastPracticedAt ?? null
            }
          ];
        })
      )
    };
  }

  return {
    schemaVersion: 2,
    unlockedSoundIndex: stored.unlockedSoundIndex,
    requiredCorrect,
    sounds: Object.fromEntries(
      sounds.map((sound, index) => {
        const existing = stored.sounds[sound.id];
        return [
          sound.id,
          {
            correct: existing?.correct ?? 0,
            attempts: existing?.attempts ?? 0,
            unlocked: existing?.unlocked ?? index === 0,
            correctStreak: 0,
            lastPracticedAt: null
          }
        ];
      })
    )
  };
};

export const useProgress = (sounds: Sound[], requiredCorrect = 3) => {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const stored = await get<ProgressState | LegacyProgressState>(STORAGE_KEY);
      if (stored && (stored.schemaVersion === 1 || stored.schemaVersion === 2)) {
        const migrated = migrateProgress(stored, sounds, requiredCorrect);
        setProgress(migrated);
        await set(STORAGE_KEY, migrated);
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
        return { unlockedNext: false, finishedAll: false, progress: null as ProgressState | null };
      }

      const current = progress.sounds[soundId];
      const updatedSound: SoundProgress = {
        ...current,
        attempts: current.attempts + 1,
        correct: correct ? current.correct + 1 : current.correct,
        correctStreak: correct ? current.correctStreak + 1 : 0,
        lastPracticedAt: Date.now()
      };

      const next: ProgressState = {
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

      return { unlockedNext, finishedAll, progress: next };
    },
    [progress, sounds]
  );

  const resetSound = useCallback(
    async (soundId: string) => {
      if (!progress) {
        return;
      }

      const existing = progress.sounds[soundId];
      if (!existing) {
        return;
      }

      const next = {
        ...progress,
        sounds: {
          ...progress.sounds,
          [soundId]: {
            ...existing,
            correct: 0,
            attempts: 0,
            correctStreak: 0,
            lastPracticedAt: null
          }
        }
      };

      setProgress(next);
      await set(STORAGE_KEY, next);
    },
    [progress]
  );

  const markSoundLearned = useCallback(
    async (soundId: string) => {
      if (!progress) {
        return;
      }

      const existing = progress.sounds[soundId];
      if (!existing) {
        return;
      }

      const soundIndex = sounds.findIndex((sound) => sound.id === soundId);
      if (soundIndex < 0) {
        return;
      }

      const next = {
        ...progress,
        sounds: {
          ...progress.sounds,
          [soundId]: {
            ...existing,
            correct: progress.requiredCorrect,
            unlocked: true,
            correctStreak: Math.max(existing.correctStreak, progress.requiredCorrect),
            lastPracticedAt: Date.now()
          }
        }
      };

      if (soundIndex < sounds.length - 1 && progress.unlockedSoundIndex <= soundIndex) {
        const nextSoundId = sounds[soundIndex + 1]?.id;
        if (nextSoundId) {
          next.sounds[nextSoundId] = {
            ...next.sounds[nextSoundId],
            unlocked: true
          };
          next.unlockedSoundIndex = soundIndex + 1;
        }
      }

      setProgress(next);
      await set(STORAGE_KEY, next);
    },
    [progress, sounds]
  );

  const resetAll = useCallback(async () => {
    const initial = createInitialProgress(sounds, requiredCorrect);
    setProgress(initial);
    await set(STORAGE_KEY, initial);
  }, [requiredCorrect, sounds]);

  const exportProgress = useCallback(() => progress, [progress]);

  return { progress, loading, recordAttempt, resetSound, markSoundLearned, resetAll, exportProgress };
};
