import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ImageChoiceCard } from './ImageChoiceCard';

describe('ImageChoiceCard', () => {
  it('shows fallback message when image load fails', () => {
    render(<ImageChoiceCard imageUrl="/missing.png" label="moon" onSelect={vi.fn()} />);

    const image = screen.getByRole('img', { name: 'moon' });
    fireEvent.error(image);

    expect(screen.getByText('Image unavailable')).toBeInTheDocument();
  });
});
