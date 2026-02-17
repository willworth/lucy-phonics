import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProgressState } from '../types';
import { makeSounds } from '../test/fixtures';
import { ParentDashboard } from './ParentDashboard';

const sounds = makeSounds();

const progress: ProgressState = {
  schemaVersion: 1,
  unlockedSoundIndex: 1,
  requiredCorrect: 3,
  sounds: {
    m: { correct: 3, attempts: 4, unlocked: true },
    s: { correct: 1, attempts: 3, unlocked: true }
  }
};

describe('ParentDashboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders summary stats and per-sound statuses', () => {
    render(
      <ParentDashboard
        sounds={sounds}
        progress={progress}
        onBack={vi.fn()}
        onResetSound={vi.fn()}
        onMarkSoundLearned={vi.fn()}
        onResetAll={vi.fn()}
        onExportProgress={() => progress}
      />
    );

    expect(screen.getByText('Total sessions').parentElement).toHaveTextContent('7');
    expect(screen.getByText('Total correct').parentElement).toHaveTextContent('4');
    expect(screen.getByText('Overall accuracy').parentElement).toHaveTextContent('57%');

    expect(screen.getByText('Mastered')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
  });

  it('wires action buttons and reset-all confirmation', () => {
    const onBack = vi.fn();
    const onResetSound = vi.fn();
    const onMarkSoundLearned = vi.fn();
    const onResetAll = vi.fn();

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);

    render(
      <ParentDashboard
        sounds={sounds}
        progress={progress}
        onBack={onBack}
        onResetSound={onResetSound}
        onMarkSoundLearned={onMarkSoundLearned}
        onResetAll={onResetAll}
        onExportProgress={() => progress}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getAllByRole('button', { name: 'Reset' })[0]);
    expect(onResetSound).toHaveBeenCalledWith('m');

    fireEvent.click(screen.getAllByRole('button', { name: 'Mark as learned' })[1]);
    expect(onMarkSoundLearned).toHaveBeenCalledWith('s');

    fireEvent.click(screen.getByRole('button', { name: 'Reset All' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reset All' }));

    expect(confirmSpy).toHaveBeenCalledTimes(2);
    expect(onResetAll).toHaveBeenCalledTimes(1);
  });

  it('exports progress when export data exists', () => {
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);

    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName.toLowerCase() === 'a') {
        return {
          href: '',
          download: '',
          click: clickSpy
        } as unknown as HTMLAnchorElement;
      }
      return originalCreateElement(tagName);
    });

    render(
      <ParentDashboard
        sounds={sounds}
        progress={progress}
        onBack={vi.fn()}
        onResetSound={vi.fn()}
        onMarkSoundLearned={vi.fn()}
        onResetAll={vi.fn()}
        onExportProgress={() => progress}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Export Progress' }));

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    expect(createElementSpy).toHaveBeenCalledWith('a');
  });

  it('does not export when no data is available', () => {
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');

    render(
      <ParentDashboard
        sounds={sounds}
        progress={progress}
        onBack={vi.fn()}
        onResetSound={vi.fn()}
        onMarkSoundLearned={vi.fn()}
        onResetAll={vi.fn()}
        onExportProgress={() => null}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Export Progress' }));

    expect(createObjectURL).not.toHaveBeenCalled();
  });
});
