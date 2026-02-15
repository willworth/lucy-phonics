import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProgressState } from './types';

const progress: ProgressState = {
  schemaVersion: 1,
  unlockedSoundIndex: 0,
  requiredCorrect: 3,
  sounds: {
    m: { correct: 0, attempts: 0, unlocked: true },
    s: { correct: 0, attempts: 0, unlocked: false },
    a: { correct: 0, attempts: 0, unlocked: false },
    t: { correct: 0, attempts: 0, unlocked: false },
    p: { correct: 0, attempts: 0, unlocked: false },
    n: { correct: 0, attempts: 0, unlocked: false }
  }
};

vi.mock('./hooks/useProgress', () => ({
  useProgress: () => ({
    progress,
    loading: false,
    recordAttempt: vi.fn(async () => ({ unlockedNext: false, finishedAll: false })),
    resetSound: vi.fn(async () => undefined),
    markSoundLearned: vi.fn(async () => undefined),
    resetAll: vi.fn(async () => undefined),
    exportProgress: vi.fn(() => progress)
  })
}));

vi.mock('./hooks/useAudio', async () => {
  const react = await import('react');
  return {
    useAudio: () => {
      const [isUnlocked, setIsUnlocked] = react.useState(false);
      return {
        isUnlocked,
        audioError: null,
        clearAudioError: vi.fn(),
        unlock: vi.fn(async () => {
          setIsUnlocked(true);
        }),
        preloadUi: vi.fn(async () => undefined),
        preloadInstructions: vi.fn(async () => undefined),
        preloadForSound: vi.fn(async () => undefined),
        preloadIntro: vi.fn(async () => undefined),
        playPhoneme: vi.fn(),
        playIntro: vi.fn(),
        playInstruction: vi.fn(),
        playWord: vi.fn(),
        playUi: vi.fn()
      };
    }
  };
});

import App from './App';

describe('App flow', () => {
  it('moves from splash to intro on tap start', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'TAP' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Play m sound')).toBeInTheDocument();
    });
  });
});
