import { act, renderHook, waitFor } from '@testing-library/react';
import type { Sound } from '../types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const counters = vi.hoisted(() => ({
  playCalls: 0,
  stopCalls: 0
}));

vi.mock('howler', () => {
  class Howl {
    private src: string[];
    private onloaderror?: () => void;
    private onplayerror?: () => void;
    private onLoad: (() => void) | null = null;
    private onLoadError: (() => void) | null = null;

    constructor(opts: { src: string[]; onloaderror?: () => void; onplayerror?: () => void }) {
      this.src = opts.src;
      this.onloaderror = opts.onloaderror;
      this.onplayerror = opts.onplayerror;
    }

    stop() {
      counters.stopCalls += 1;
    }

    play() {
      counters.playCalls += 1;
      if (this.src[0]?.includes('broken')) {
        this.onplayerror?.();
      }
    }

    load() {
      if (this.src[0]?.includes('broken')) {
        this.onloaderror?.();
        this.onLoadError?.();
        return;
      }
      this.onLoad?.();
    }

    unload() {}

    state() {
      return 'unloaded';
    }

    once(event: string, cb: () => void) {
      if (event === 'load') {
        this.onLoad = cb;
      }
      if (event === 'loaderror') {
        this.onLoadError = cb;
      }
    }
  }

  return {
    Howl,
    Howler: {
      autoUnlock: false,
      ctx: {
        state: 'suspended',
        resume: vi.fn(async () => undefined)
      }
    }
  };
});

import { useAudio } from './useAudio';

const sampleSound: Sound = {
  id: 'm',
  locale: 'en-GB',
  type: 'consonant',
  display: 'm',
  phase: 1,
  phonemeAudio: 'phonemes/m.mp3',
  exampleWords: [
    { word: 'moon', imageAsset: 'img/sounds/m/moon.png', wordAudio: 'words/m-moon.mp3', soundPosition: 'start' }
  ]
};

describe('useAudio', () => {
  beforeEach(() => {
    counters.playCalls = 0;
    counters.stopCalls = 0;
  });

  it('unlocks and plays tap-start audio', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.unlock();
    });

    expect(result.current.isUnlocked).toBe(true);
    expect(counters.playCalls).toBeGreaterThan(0);
  });

  it('preloads sound audio and stops active sounds before next play', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.preloadForSound(sampleSound);
    });

    act(() => {
      result.current.playPhoneme(sampleSound);
      result.current.playWord('words/m-moon.mp3');
    });

    expect(counters.stopCalls).toBeGreaterThan(0);
  });

  it('captures playback errors into audioError', async () => {
    const { result } = renderHook(() => useAudio());

    act(() => {
      result.current.playWord('broken.mp3');
    });

    await waitFor(() => {
      expect(result.current.audioError).toContain('Audio playback failed');
    });

    act(() => {
      result.current.clearAudioError();
    });

    expect(result.current.audioError).toBeNull();
  });
});
