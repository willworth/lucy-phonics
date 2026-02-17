import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Sound } from '../types';
import { SoundGalleryPage } from './SoundGalleryPage';

const soundWithFiveWords: Sound = {
  id: 'm',
  locale: 'en-GB',
  type: 'consonant',
  display: 'm',
  phase: 1,
  phonemeAudio: 'phonemes/m.mp3',
  exampleWords: [
    { word: 'moon', imageAsset: 'img/sounds/m/moon.png', wordAudio: 'words/m-moon.mp3', soundPosition: 'start' },
    { word: 'map', imageAsset: 'img/sounds/m/map.png', wordAudio: 'words/m-map.mp3', soundPosition: 'start' },
    { word: 'milk', imageAsset: 'img/sounds/m/milk.png', wordAudio: 'words/m-milk.mp3', soundPosition: 'start' },
    { word: 'monkey', imageAsset: 'img/sounds/m/monkey.png', wordAudio: 'words/m-monkey.mp3', soundPosition: 'start' },
    { word: 'mouse', imageAsset: 'img/sounds/m/mouse.png', wordAudio: 'words/m-mouse.mp3', soundPosition: 'start' }
  ]
};

describe('SoundGalleryPage', () => {
  it('plays gallery instruction on mount and supports replay/next controls', () => {
    const onPlayWord = vi.fn();
    const onPlayPhoneme = vi.fn();
    const onNext = vi.fn();

    render(
      <SoundGalleryPage sound={soundWithFiveWords} onPlayPhoneme={onPlayPhoneme} onPlayWord={onPlayWord} onNext={onNext} />
    );

    expect(onPlayWord).toHaveBeenCalledWith('ui/tap-start.mp3');

    fireEvent.click(screen.getByRole('button', { name: 'Replay sound' }));
    expect(onPlayPhoneme).toHaveBeenCalledWith(soundWithFiveWords);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('plays tapped word and removes bounce class after timeout', () => {
    vi.useFakeTimers();

    const onPlayWord = vi.fn();
    render(
      <SoundGalleryPage sound={soundWithFiveWords} onPlayPhoneme={vi.fn()} onPlayWord={onPlayWord} onNext={vi.fn()} />
    );

    const moonButton = screen.getByRole('button', { name: 'Play moon' });
    fireEvent.click(moonButton);

    expect(onPlayWord).toHaveBeenCalledWith('words/m-moon.mp3');
    expect(moonButton.className).toContain('animate-[bounce_420ms_ease-out_1]');

    act(() => {
      vi.advanceTimersByTime(450);
    });
    expect(screen.getByRole('button', { name: 'Play moon' }).className).not.toContain('animate-[bounce_420ms_ease-out_1]');

    vi.useRealTimers();
  });
});
