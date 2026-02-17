import { describe, expect, it } from 'vitest';
import {
  CORRECT_INSTRUCTION_ROTATION,
  INCORRECT_REPLAY_DELAY_MS,
  NEXT_ROUND_INSTRUCTION_DELAY_MS,
  REQUIRED_CORRECT,
  SESSION_CONFIG,
  TOTAL_MATCH_ROUNDS,
  getOptionCountForCorrectAnswers
} from './config';

describe('config', () => {
  it('exports expected session constants', () => {
    expect(REQUIRED_CORRECT).toBe(3);
    expect(TOTAL_MATCH_ROUNDS).toBe(10);
    expect(NEXT_ROUND_INSTRUCTION_DELAY_MS).toBe(1800);
    expect(INCORRECT_REPLAY_DELAY_MS).toBe(1000);
    expect(CORRECT_INSTRUCTION_ROTATION).toEqual(['well-done', 'thats-it', 'brilliant']);
    expect(SESSION_CONFIG.optionRamp).toEqual({
      start: 2,
      afterThreeCorrect: 3,
      afterSixCorrect: 4
    });
  });

  it('applies difficulty ramp based on correct answers', () => {
    expect(getOptionCountForCorrectAnswers(0)).toBe(2);
    expect(getOptionCountForCorrectAnswers(2)).toBe(2);
    expect(getOptionCountForCorrectAnswers(3)).toBe(3);
    expect(getOptionCountForCorrectAnswers(5)).toBe(3);
    expect(getOptionCountForCorrectAnswers(6)).toBe(4);
    expect(getOptionCountForCorrectAnswers(10)).toBe(4);
  });
});
