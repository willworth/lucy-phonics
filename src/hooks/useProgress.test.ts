import { act, renderHook, waitFor } from '@testing-library/react';
import { clear, get } from 'idb-keyval';
import { beforeEach, describe, expect, it } from 'vitest';
import { useProgress } from './useProgress';
import { makeSounds } from '../test/fixtures';

const STORAGE_KEY = 'lucy-progress-v1';

describe('useProgress', () => {
  beforeEach(async () => {
    await clear();
  });

  it('initializes with first sound unlocked', async () => {
    const sounds = makeSounds();
    const { result } = renderHook(() => useProgress(sounds, 2));

    await waitFor(() => expect(result.current.loading).toBe(false));

    const progress = result.current.progress;
    expect(progress).not.toBeNull();
    expect(progress?.schemaVersion).toBe(2);
    expect(progress?.sounds.m.unlocked).toBe(true);
    expect(progress?.sounds.s.unlocked).toBe(false);
  });

  it('records attempts and unlocks next sound at threshold', async () => {
    const sounds = makeSounds();
    const { result } = renderHook(() => useProgress(sounds, 2));

    await waitFor(() => expect(result.current.progress).not.toBeNull());

    await act(async () => {
      await result.current.recordAttempt('m', true);
    });
    let outcome = { unlockedNext: false, finishedAll: false, progress: null };
    await act(async () => {
      outcome = await result.current.recordAttempt('m', true);
    });

    expect(outcome.unlockedNext).toBe(true);
    expect(result.current.progress?.unlockedSoundIndex).toBe(1);
    expect(result.current.progress?.sounds.s.unlocked).toBe(true);
    expect(result.current.progress?.sounds.m.correctStreak).toBe(2);

    const stored = await get<typeof result.current.progress>(STORAGE_KEY);
    expect(stored?.sounds.s.unlocked).toBe(true);
  });

  it('marks sound learned and unlocks next sound', async () => {
    const sounds = makeSounds();
    const { result } = renderHook(() => useProgress(sounds, 3));

    await waitFor(() => expect(result.current.progress).not.toBeNull());

    await act(async () => {
      await result.current.markSoundLearned('m');
    });

    expect(result.current.progress?.sounds.m.correct).toBe(3);
    expect(result.current.progress?.sounds.s.unlocked).toBe(true);
  });

  it('resets one sound and exports progress', async () => {
    const sounds = makeSounds();
    const { result } = renderHook(() => useProgress(sounds, 2));

    await waitFor(() => expect(result.current.progress).not.toBeNull());

    await act(async () => {
      await result.current.recordAttempt('m', true);
      await result.current.resetSound('m');
    });

    const exported = result.current.exportProgress();
    expect(exported?.sounds.m.correct).toBe(0);
    expect(exported?.sounds.m.attempts).toBe(0);
    expect(exported?.sounds.m.correctStreak).toBe(0);
  });
});
