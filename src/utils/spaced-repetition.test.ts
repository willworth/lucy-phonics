import { describe, expect, it, vi } from 'vitest';
import type { ProgressState } from '../types';
import { makeSounds } from '../test/fixtures';
import { getNextSound } from './spaced-repetition';

describe('getNextSound', () => {
  it('prioritizes sounds with higher weighted score', () => {
    const sounds = makeSounds();
    const now = new Date('2026-02-18T00:00:00Z').getTime();
    vi.spyOn(Date, 'now').mockReturnValue(now);
    vi.spyOn(Math, 'random').mockReturnValue(0.99);

    const progress: ProgressState = {
      schemaVersion: 2,
      unlockedSoundIndex: 1,
      requiredCorrect: 3,
      sounds: {
        m: {
          correct: 3,
          attempts: 8,
          unlocked: true,
          correctStreak: 4,
          lastPracticedAt: now - 1 * 24 * 60 * 60 * 1000
        },
        s: {
          correct: 1,
          attempts: 8,
          unlocked: true,
          correctStreak: 0,
          lastPracticedAt: now - 5 * 24 * 60 * 60 * 1000
        }
      }
    };

    const next = getNextSound(sounds, progress);
    expect(next.id).toBe('s');
  });
});
