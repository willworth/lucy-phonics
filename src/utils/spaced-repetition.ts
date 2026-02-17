import type { ProgressState, Sound } from '../types';

const FALLBACK_DAYS_SINCE_PRACTICE = 7;

const getDaysSincePractice = (lastPracticedAt: number | null): number => {
  if (!lastPracticedAt) {
    return FALLBACK_DAYS_SINCE_PRACTICE;
  }

  const elapsedMs = Date.now() - lastPracticedAt;
  return Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));
};

const getErrorRate = (attempts: number, correct: number): number => {
  if (attempts <= 0) {
    return 0;
  }

  const wrong = Math.max(0, attempts - correct);
  return wrong / attempts;
};

export const getNextSound = (sounds: Sound[], progress: ProgressState): Sound => {
  const unlockedSounds = sounds.filter((sound) => progress.sounds[sound.id]?.unlocked);
  const candidates = unlockedSounds.length > 0 ? unlockedSounds : sounds;

  const scored = candidates.map((sound) => {
    const soundProgress = progress.sounds[sound.id];
    const attempts = soundProgress?.attempts ?? 0;
    const correct = soundProgress?.correct ?? 0;
    const correctStreak = soundProgress?.correctStreak ?? 0;
    const daysSincePractice = getDaysSincePractice(soundProgress?.lastPracticedAt ?? null);
    const errorRate = getErrorRate(attempts, correct);

    const score = daysSincePractice * 2 + errorRate * 10 - correctStreak;
    const weight = Math.max(1, score + 5);

    return { sound, weight };
  });

  const totalWeight = scored.reduce((sum, item) => sum + item.weight, 0);
  let threshold = Math.random() * totalWeight;

  for (const item of scored) {
    threshold -= item.weight;
    if (threshold <= 0) {
      return item.sound;
    }
  }

  return scored[scored.length - 1]?.sound ?? sounds[0];
};
