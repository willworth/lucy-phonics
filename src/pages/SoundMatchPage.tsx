import { useEffect, useMemo, useState } from 'react';
import type { Sound } from '../types';
import { getImageUrl } from '../utils/content';
import { shuffle } from '../utils/shuffle';
import { ImageChoiceCard } from '../components/ImageChoiceCard';

interface RoundOption {
  id: string;
  label: string;
  imageUrl: string;
  wordAudio: string;
  soundId: string;
  correct: boolean;
}

interface SoundMatchPageProps {
  sounds: Sound[];
  unlockedSoundIndex: number;
  currentSoundIndex: number;
  totalSounds: number;
  requiredCorrect: number;
  currentCorrectForSound: number;
  onPlayPhoneme: (sound: Sound) => void;
  onPlayWord: (path: string) => void;
  onPlayUi: (name: 'correct' | 'incorrect') => void;
  onAttempt: (soundId: string, correct: boolean) => Promise<{ unlockedNext: boolean; finishedAll: boolean }>;
}

const OPTION_COUNT = 4;

const buildRound = (sound: Sound, allSounds: Sound[]): RoundOption[] => {
  const correctWord = shuffle(sound.exampleWords)[0];
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
    .slice(0, OPTION_COUNT - 1)
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
  onPlayPhoneme,
  onPlayWord,
  onPlayUi,
  onAttempt
}: SoundMatchPageProps) => {
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [wrongOptionId, setWrongOptionId] = useState<string | null>(null);
  const [tappedOptionId, setTappedOptionId] = useState<string | null>(null);
  const [roundToken, setRoundToken] = useState(0);
  const [banner, setBanner] = useState<string>('');

  const currentSound = useMemo(() => {
    const clampedIndex = Math.min(unlockedSoundIndex, sounds.length - 1);
    return sounds[clampedIndex];
  }, [sounds, unlockedSoundIndex]);

  const allCompleted = unlockedSoundIndex >= sounds.length - 1 && currentCorrectForSound >= requiredCorrect;

  const options = useMemo(
    () => buildRound(currentSound, sounds),
    [currentSound, roundToken, sounds]
  );

  useEffect(() => {
    onPlayPhoneme(currentSound);
  }, [currentSound, onPlayPhoneme, roundToken]);

  const handleChoice = async (option: RoundOption) => {
    if (status === 'correct') {
      return;
    }

    onPlayWord(option.wordAudio);
    setTappedOptionId(option.id);
    window.setTimeout(() => {
      setTappedOptionId((current) => (current === option.id ? null : current));
    }, 220);

    if (option.correct) {
      setStatus('correct');
      setWrongOptionId(null);
      onPlayUi('correct');
      const result = await onAttempt(currentSound.id, true);
      if (result.finishedAll) {
        setBanner('Amazing! You finished all Phase 1 sounds!');
      } else if (result.unlockedNext) {
        setBanner('Great work! New sound unlocked.');
      } else {
        setBanner('Great listening!');
      }

      window.setTimeout(() => {
        setStatus('idle');
        setBanner('');
        setRoundToken((value) => value + 1);
      }, 2500);
      return;
    }

    setStatus('incorrect');
    setWrongOptionId(option.id);
    onPlayUi('incorrect');
    await onAttempt(currentSound.id, false);
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
          {banner ? <p className="mt-2 text-xl font-bold text-emerald-700">{banner}</p> : null}
          {status === 'incorrect' ? (
            <p className="mt-2 text-lg font-semibold text-amber-700">Nice try. Tap and listen again.</p>
          ) : null}
          {status === 'correct' ? (
            <img
              src={getImageUrl('img/ui/star-correct.png')}
              alt="Correct"
              className="mx-auto mt-2 h-16 w-16 animate-pop"
            />
          ) : null}
          {allCompleted ? (
            <p className="mt-2 text-lg font-black text-teal-800">Phase 1 complete. Keep practicing for fun!</p>
          ) : null}
        </section>

        <section className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <ImageChoiceCard
              key={option.id}
              imageUrl={option.imageUrl}
              label={option.label}
              dimmed={status === 'incorrect' && wrongOptionId === option.id}
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
