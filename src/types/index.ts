export interface ExampleWord {
  word: string;
  imageAsset: string;
  wordAudio: string;
  soundPosition: 'start' | 'middle' | 'end';
}

export interface Sound {
  id: string;
  locale: string;
  type: string;
  display: string;
  phase: number;
  phonemeAudio: string;
  pronunciationTip?: string;
  exampleWords: ExampleWord[];
}

export interface SoundsManifest {
  locale: string;
  schemaVersion: number;
  phases: Record<string, { name: string; description: string; sounds: string[] }>;
  sounds: Sound[];
}

export interface SoundProgress {
  correct: number;
  attempts: number;
  unlocked: boolean;
  correctStreak: number;
  lastPracticedAt: number | null;
}

export interface ProgressState {
  schemaVersion: 2;
  unlockedSoundIndex: number;
  requiredCorrect: number;
  sounds: Record<string, SoundProgress>;
}

export interface SessionRoundAnalytics {
  soundId: string;
  optionsShown: string[];
  tappedOption: string;
  tappedSoundId?: string;
  correct: boolean;
  responseTimeMs: number;
  timestamp: number;
}

export interface SessionAnalytics {
  sessionId: string;
  startedAt: number;
  endedAt: number;
  rounds: SessionRoundAnalytics[];
}
