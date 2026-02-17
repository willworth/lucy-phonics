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
    optionCount: 2 as const,
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
  it('shows sound progress indicator and respects option count', () => {
    const props = makeProps();
    render(<SoundMatchPage {...props} />);

    expect(screen.getByText('Sound 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Choices this round: 2')).toBeInTheDocument();

    const allLabels = ['moon', 'map', 'milk', 'monkey', 'sun', 'sock', 'snake', 'star'];
    const visibleLabels = allLabels.filter((label) => screen.queryByText(label));
    expect(visibleLabels).toHaveLength(2);
  });

  it('handles incorrect choice with gentle feedback', async () => {
    const props = makeProps();
    render(<SoundMatchPage {...props} />);

    const wrongCandidates = ['sun', 'sock', 'snake', 'star'];
    const wrongLabel = wrongCandidates.find((label) => screen.queryByText(label));
    expect(wrongLabel).toBeTruthy();

    fireEvent.click(screen.getByText(wrongLabel ?? 'sun'));

    expect(props.onPlayUi).toHaveBeenCalledWith('incorrect');
    await waitFor(() => {
      expect(props.onAttempt).toHaveBeenCalledWith('m', false);
    });
  });

  it('handles correct choice with celebration star', async () => {
    const props = makeProps();
    render(<SoundMatchPage {...props} />);

    const correctCandidates = ['moon', 'map', 'milk', 'monkey'];
    const correctLabel = correctCandidates.find((label) => screen.queryByText(label));
    expect(correctLabel).toBeTruthy();

    fireEvent.click(screen.getByText(correctLabel ?? 'moon'));

    await waitFor(() => {
      expect(props.onPlayUi).toHaveBeenCalledWith('correct');
      expect(screen.getByRole('img', { name: 'Sparkly star' })).toBeInTheDocument();
    });
  });
});
