import { useEffect, useMemo, useRef, useState } from 'react';
import type { Sound } from '../types';
import { getImageUrl } from '../utils/content';
import { shuffle } from '../utils/shuffle';
import { ImageChoiceCard } from '../components/ImageChoiceCard';
import { INCORRECT_REPLAY_DELAY_MS } from '../config';

interface RoundOption {
  id: string;
  label: string;
  imageUrl: string;
  wordAudio: string;
  soundId: string;
  correct: boolean;
}

export interface MatchAttemptPayload {
  soundId: string;
  optionsShown: string[];
  tappedOption: string;
  tappedSoundId?: string;
  correct: boolean;
  responseTimeMs: number;
}

interface SoundMatchPageProps {
  sounds: Sound[];
  unlockedSoundIndex: number;
  currentSoundIndex: number;
  totalSounds: number;
  requiredCorrect: number;
  currentCorrectForSound: number;
  optionCount: 2 | 3 | 4;
  onPlayPhoneme: (sound: Sound) => void;
  onPlayWord: (path: string) => void;
  onPlayUi: (name: 'correct' | 'incorrect') => void;
  onAttempt: (payload: MatchAttemptPayload) => Promise<{ unlockedNext: boolean; finishedAll: boolean }>;
}

const CELEBRATION_STARS = [
  { left: '14%', delay: '0ms' },
  { left: '28%', delay: '90ms' },
  { left: '42%', delay: '180ms' },
  { left: '56%', delay: '270ms' },
  { left: '70%', delay: '360ms' },
  { left: '84%', delay: '450ms' }
];

const buildRound = (sound: Sound, allSounds: Sound[], optionCount: number): RoundOption[] => {
  const correctWord = shuffle(sound.exampleWords)[0];
  const distractorCount = Math.max(1, optionCount - 1);

  const distractors = shuffle(
    allSounds
      .flatMap((item) =>
        item.exampleWords.map((word) => ({
          soundId: item.id,
          word
        }))
      )
      .filter((item) => item.soundId !== sound.id)
  )
    .slice(0, distractorCount)
    .map((item) => ({
      id: `${item.soundId}-${item.word.word}`,
      label: item.word.word,
      imageUrl: getImageUrl(item.word.imageAsset),
      wordAudio: item.word.wordAudio,
      soundId: item.soundId,
      correct: false
    }));

  return shuffle([
    {
      id: `${sound.id}-${correctWord.word}`,
      label: correctWord.word,
      imageUrl: getImageUrl(correctWord.imageAsset),
      wordAudio: correctWord.wordAudio,
      soundId: sound.id,
      correct: true
    },
    ...distractors
  ]);
};

export const SoundMatchPage = ({
  sounds,
  unlockedSoundIndex,
  currentSoundIndex,
  totalSounds,
  requiredCorrect,
  currentCorrectForSound,
  optionCount,
  onPlayPhoneme,
  onPlayWord,
  onPlayUi,
  onAttempt
}: SoundMatchPageProps) => {
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [wrongOptionId, setWrongOptionId] = useState<string | null>(null);
  const [correctOptionId, setCorrectOptionId] = useState<string | null>(null);
  const [tappedOptionId, setTappedOptionId] = useState<string | null>(null);
  const [roundToken, setRoundToken] = useState(0);
  const timeoutIdsRef = useRef<number[]>([]);
  const roundStartedAtRef = useRef<number>(Date.now());

  const currentSound = useMemo(() => {
    const clampedIndex = Math.min(unlockedSoundIndex, sounds.length - 1);
    return sounds[clampedIndex];
  }, [sounds, unlockedSoundIndex]);

  const allCompleted = unlockedSoundIndex >= sounds.length - 1 && currentCorrectForSound >= requiredCorrect;

  const options = useMemo(() => buildRound(currentSound, sounds, optionCount), [currentSound, optionCount, roundToken, sounds]);

  const queueTimeout = (fn: () => void, ms: number) => {
    const timeoutId = window.setTimeout(fn, ms);
    timeoutIdsRef.current.push(timeoutId);
  };

  const clearQueuedTimeouts = () => {
    timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutIdsRef.current = [];
  };

  useEffect(() => {
    onPlayPhoneme(currentSound);
    roundStartedAtRef.current = Date.now();
  }, [currentSound, onPlayPhoneme, roundToken]);

  useEffect(
    () => () => {
      clearQueuedTimeouts();
    },
    []
  );

  const handleChoice = async (option: RoundOption) => {
    if (status === 'correct') {
      return;
    }

    onPlayWord(option.wordAudio);
    setTappedOptionId(option.id);
    queueTimeout(() => {
      setTappedOptionId((current) => (current === option.id ? null : current));
    }, 220);

    const responseTimeMs = Math.max(0, Date.now() - roundStartedAtRef.current);
    const attemptPayload: MatchAttemptPayload = {
      soundId: currentSound.id,
      optionsShown: options.map((item) => item.label),
      tappedOption: option.label,
      tappedSoundId: option.soundId,
      correct: option.correct,
      responseTimeMs
    };

    if (option.correct) {
      clearQueuedTimeouts();
      setStatus('correct');
      setWrongOptionId(null);
      setCorrectOptionId(option.id);
      onPlayUi('correct');
      await onAttempt(attemptPayload);

      queueTimeout(() => {
        setStatus('idle');
        setWrongOptionId(null);
        setCorrectOptionId(null);
        setRoundToken((value) => value + 1);
      }, 2500);
      return;
    }

    setStatus('incorrect');
    setWrongOptionId(option.id);
    setCorrectOptionId(null);
    onPlayUi('incorrect');
    await onAttempt(attemptPayload);

    queueTimeout(() => {
      onPlayPhoneme(currentSound);
      roundStartedAtRef.current = Date.now();
    }, INCORRECT_REPLAY_DELAY_MS);

    queueTimeout(() => {
      setStatus('idle');
      setWrongOptionId(null);
    }, INCORRECT_REPLAY_DELAY_MS + 700);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-5 sm:px-8">
      <div className="rounded-3xl bg-white/85 p-5 shadow-lg">
        <header className="mb-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onPlayPhoneme(currentSound)}
            className="rounded-full bg-teal-600 px-5 py-3 text-lg font-bold text-white"
          >
            <img src={getImageUrl('img/ui/ear.png')} alt="Hear sound" className="inline h-6 w-6" /> Hear
          </button>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
              Sound {currentSoundIndex + 1} of {totalSounds}
            </p>
            <p className="text-sm font-semibold text-teal-700">Sound progress</p>
            <p className="text-lg font-black text-teal-900">
              {currentCorrectForSound}/{requiredCorrect}
            </p>
          </div>
        </header>

        <section className="mb-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">Find the sound</p>
          <p className="mt-2 text-7xl font-black text-teal-900">{currentSound.display}</p>
          <p className="mt-2 text-base font-bold text-teal-700">Choices this round: {optionCount}</p>

          <div className="relative mx-auto mt-3 h-24 w-full max-w-sm">
            {status === 'correct'
              ? CELEBRATION_STARS.map((star) => (
                  <span
                    key={`${star.left}-${star.delay}`}
                    className="absolute top-1/2 text-2xl animate-star-burst"
                    style={{ left: star.left, animationDelay: star.delay }}
                  >
                    ✨
                  </span>
                ))
              : null}

            {status === 'correct' ? (
              <img
                src={getImageUrl('img/ui/star-correct.png')}
                alt="Sparkly star"
                className="mx-auto h-20 w-20 animate-bounce-grow"
              />
            ) : null}
          </div>

          {allCompleted ? <p className="mt-2 text-lg font-black text-teal-800">🌟 Phase 1 complete! 🌟</p> : null}
        </section>

        <section className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <ImageChoiceCard
              key={option.id}
              imageUrl={option.imageUrl}
              label={option.label}
              dimmed={status === 'incorrect' && wrongOptionId === option.id}
              wobble={status === 'incorrect' && wrongOptionId === option.id}
              celebrate={status === 'correct' && correctOptionId === option.id}
              disabled={status === 'correct'}
              pressed={tappedOptionId === option.id}
              onSelect={() => void handleChoice(option)}
            />
          ))}
        </section>
      </div>
    </main>
  );
};
