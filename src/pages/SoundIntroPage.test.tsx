import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SoundIntroPage } from './SoundIntroPage';
import { makeSounds } from '../test/fixtures';

describe('SoundIntroPage', () => {
  it('plays intro on mount and renders only the first 3 examples', () => {
    const sound = makeSounds()[0];
    const onPlayIntro = vi.fn();

    render(
      <SoundIntroPage
        sound={sound}
        onPlayPhoneme={vi.fn()}
        onPlayWord={vi.fn()}
        onPlayIntro={onPlayIntro}
        onNext={vi.fn()}
      />
    );

    expect(onPlayIntro).toHaveBeenCalledWith(sound.id);
    expect(screen.getByRole('button', { name: 'Play moon' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play map' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play milk' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Play monkey' })).not.toBeInTheDocument();
  });

  it('replays phoneme, plays word audio and goes next', () => {
    const sound = makeSounds()[0];
    const onPlayPhoneme = vi.fn();
    const onPlayWord = vi.fn();
    const onNext = vi.fn();

    render(
      <SoundIntroPage
        sound={sound}
        onPlayPhoneme={onPlayPhoneme}
        onPlayWord={onPlayWord}
        onPlayIntro={vi.fn()}
        onNext={onNext}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Replay sound' }));
    fireEvent.click(screen.getByRole('button', { name: 'Play m sound' }));
    expect(onPlayPhoneme).toHaveBeenCalledTimes(2);
    expect(onPlayPhoneme).toHaveBeenLastCalledWith(sound);

    fireEvent.click(screen.getByRole('button', { name: 'Play moon' }));
    expect(onPlayWord).toHaveBeenCalledWith('words/m-moon.mp3');

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
