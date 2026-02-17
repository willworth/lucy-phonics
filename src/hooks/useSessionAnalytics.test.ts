import { act, renderHook, waitFor } from '@testing-library/react';
import { clear } from 'idb-keyval';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSessionAnalytics } from './useSessionAnalytics';

describe('useSessionAnalytics', () => {
  beforeEach(async () => {
    await clear();
    vi.restoreAllMocks();
  });

  it('tracks and persists a session with rounds', async () => {
    const now = vi.spyOn(Date, 'now');
    now
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1100)
      .mockReturnValueOnce(2000)
      .mockReturnValueOnce(3000)
      .mockReturnValueOnce(3100);

    const { result } = renderHook(() => useSessionAnalytics());

    await act(async () => {
      await result.current.startSession();
    });

    act(() => {
      result.current.recordAttempt({
        soundId: 'm',
        optionsShown: ['moon', 'sun'],
        tappedOption: 'moon',
        tappedSoundId: 'm',
        correct: true,
        responseTimeMs: 1234
      });
    });

    await act(async () => {
      await result.current.endSession();
    });

    await waitFor(() => {
      expect(result.current.sessions).toHaveLength(1);
    });

    expect(result.current.sessions[0].rounds).toHaveLength(1);
    expect(result.current.sessions[0].rounds[0].soundId).toBe('m');
  });
});
