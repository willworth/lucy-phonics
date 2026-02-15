import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SoundMatchPage } from './SoundMatchPage';
import { makeSounds } from '../test/fixtures';

const makeProps = () => {
  const sounds = makeSounds();
  return {
    sounds,
    unlockedSoundIndex: 0,
    currentSoundIndex: 0,
    totalSounds: sounds.length,
    requiredCorrect: 3,
    currentCorrectForSound: 1,
    onPlayPhoneme: vi.fn(),
    onPlayWord: vi.fn(),
    onPlayUi: vi.fn(),
    onAttempt: vi.fn(async (_soundId: string, correct: boolean) => ({
      unlockedNext: false,
      finishedAll: correct
    }))
  };
};

describe('SoundMatchPage', () => {
  it('shows sound progress indicator and includes one correct option', () => {
    const props = makeProps();
    render(<SoundMatchPage {...props} />);

    expect(screen.getByText('Sound 1 of 2')).toBeInTheDocument();

    const options = ['moon', 'map', 'milk', 'monkey'];
    const present = options.some((label) => screen.queryByText(label));
    expect(present).toBe(true);
  });

  it('handles incorrect choice with feedback banner', async () => {
    const props = makeProps();
    render(<SoundMatchPage {...props} />);

    const wrongCandidates = ['sun', 'sock', 'snake', 'star'];
    const wrongLabel = wrongCandidates.find((label) => screen.queryByText(label));
    expect(wrongLabel).toBeTruthy();

    fireEvent.click(screen.getByText(wrongLabel ?? 'sun'));

    expect(props.onPlayUi).toHaveBeenCalledWith('incorrect');
    await waitFor(() => {
      expect(screen.getByText('Nice try. Tap and listen again.')).toBeInTheDocument();
    });
  });

  it('handles correct choice with success banner', async () => {
    const props = makeProps();
    render(<SoundMatchPage {...props} />);

    const correctCandidates = ['moon', 'map', 'milk', 'monkey'];
    const correctLabel = correctCandidates.find((label) => screen.queryByText(label));
    expect(correctLabel).toBeTruthy();

    fireEvent.click(screen.getByText(correctLabel ?? 'moon'));

    await waitFor(() => {
      expect(props.onPlayUi).toHaveBeenCalledWith('correct');
      expect(screen.getByText('Amazing! You finished all Phase 1 sounds!')).toBeInTheDocument();
    });
  });
});
