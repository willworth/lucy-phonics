import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SessionCompletePage } from './SessionCompletePage';

describe('SessionCompletePage', () => {
  it('plays completion audio on mount and allows replay', () => {
    const onPlayDoneAudio = vi.fn();
    const onPlayAgain = vi.fn();

    render(
      <SessionCompletePage
        onPlayDoneAudio={onPlayDoneAudio}
        onPlayAgain={onPlayAgain}
        soundsPracticed={['m', 's']}
        attempts={7}
      />
    );

    expect(onPlayDoneAudio).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Sounds practiced: m, s.')).toBeInTheDocument();
    expect(screen.getByText('Attempts this session: 7')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Play again' }));
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it('shows fallback copy when no sounds were practiced', () => {
    render(
      <SessionCompletePage
        onPlayDoneAudio={vi.fn()}
        onPlayAgain={vi.fn()}
        soundsPracticed={[]}
        attempts={0}
      />
    );

    expect(screen.getByText('Sounds practiced: none.')).toBeInTheDocument();
  });
});
