export const SESSION_CONFIG = {
  requiredCorrectPerSound: 3,
  totalMatchRounds: 10,
  nextRoundInstructionDelayMs: 1800,
  incorrectReplayDelayMs: 1000,
  optionRamp: {
    start: 2,
    afterThreeCorrect: 3,
    afterSixCorrect: 4
  }
} as const;

export const REQUIRED_CORRECT = SESSION_CONFIG.requiredCorrectPerSound;
export const TOTAL_MATCH_ROUNDS = SESSION_CONFIG.totalMatchRounds;
export const NEXT_ROUND_INSTRUCTION_DELAY_MS = SESSION_CONFIG.nextRoundInstructionDelayMs;
export const INCORRECT_REPLAY_DELAY_MS = SESSION_CONFIG.incorrectReplayDelayMs;

export const CORRECT_INSTRUCTION_ROTATION = ['well-done', 'thats-it', 'brilliant'] as const;

export const getOptionCountForCorrectAnswers = (correctAnswers: number): 2 | 3 | 4 => {
  if (correctAnswers >= 6) {
    return SESSION_CONFIG.optionRamp.afterSixCorrect;
  }

  if (correctAnswers >= 3) {
    return SESSION_CONFIG.optionRamp.afterThreeCorrect;
  }

  return SESSION_CONFIG.optionRamp.start;
};
