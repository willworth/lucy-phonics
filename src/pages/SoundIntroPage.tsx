import { useEffect, useMemo } from 'react';
import type { Sound } from '../types';
import { getImageUrl } from '../utils/content';

interface SoundIntroPageProps {
  sound: Sound;
  onPlayPhoneme: (sound: Sound) => void;
  onPlayWord: (path: string) => void;
  onPlayIntro: (soundId: string) => void;
  onNext: () => void;
}

export const SoundIntroPage = ({
  sound,
  onPlayPhoneme,
  onPlayWord,
  onPlayIntro,
  onNext
}: SoundIntroPageProps) => {
  const examples = useMemo(() => sound.exampleWords.slice(0, 3), [sound.exampleWords]);

  useEffect(() => {
    onPlayIntro(sound.id);
  }, [sound.id, onPlayIntro]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col overflow-hidden px-4 py-5 sm:px-8">
      <div className="flex h-full flex-1 flex-col rounded-3xl bg-white/85 p-5 shadow-lg">
        <header className="mb-4 flex items-center justify-end">
          <button
            type="button"
            onClick={() => onPlayPhoneme(sound)}
            className="flex min-h-[120px] min-w-[120px] items-center justify-center rounded-full bg-teal-600 shadow active:scale-95"
            aria-label="Replay sound"
          >
            <img src={getImageUrl('img/ui/ear.png')} alt="" className="h-14 w-14" />
          </button>
        </header>

        <section className="mb-6 flex flex-1 items-center justify-center">
          <button
            type="button"
            onClick={() => onPlayPhoneme(sound)}
            className="flex min-h-[220px] w-full max-w-sm items-center justify-center rounded-3xl bg-gradient-to-b from-emerald-300 to-teal-400 px-8 shadow-lg active:scale-95"
            aria-label={`Play ${sound.display} sound`}
          >
            <span className="text-[9rem] font-black leading-none text-teal-950 sm:text-[11rem]">{sound.display}</span>
          </button>
        </section>

        <section className="mb-4 grid grid-cols-3 gap-3 sm:gap-4">
          {examples.map((word) => (
            <button
              key={`${sound.id}-${word.word}`}
              type="button"
              onClick={() => onPlayWord(word.wordAudio)}
              className="flex min-h-[120px] items-center justify-center rounded-2xl bg-white p-2 shadow transition active:scale-95"
              aria-label={`Play ${word.word}`}
            >
              <img src={getImageUrl(word.imageAsset)} alt={word.word} className="h-28 w-full object-contain sm:h-32" />
            </button>
          ))}
        </section>

        <footer className="flex items-center justify-end">
          <button
            type="button"
            onClick={onNext}
            className="flex min-h-[120px] min-w-[120px] items-center justify-center rounded-full bg-emerald-500 shadow active:scale-95"
            aria-label="Next"
          >
            <img src={getImageUrl('img/ui/arrow-next.png')} alt="" className="h-14 w-14" />
          </button>
        </footer>
      </div>
    </main>
  );
};
