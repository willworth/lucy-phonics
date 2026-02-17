import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TapToStartSplash } from './TapToStartSplash';

describe('TapToStartSplash', () => {
  it('shows splash content and starts when tapped', () => {
    const onStart = vi.fn(async () => undefined);

    render(<TapToStartSplash onStart={onStart} />);

    expect(screen.getByRole('heading', { name: 'Lucy Phonics' })).toBeInTheDocument();
    expect(screen.getByText('Tap once to start and turn on sound.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'TAP' }));
    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
