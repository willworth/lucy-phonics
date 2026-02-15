import { useEffect, useMemo, useRef, useState } from 'react';
import type { Sound } from '../types';
import { getImageUrl } from '../utils/content';

interface SoundGalleryPageProps {
  sound: Sound;
  onPlayPhoneme: (sound: Sound) => void;
  onPlayWord: (path: string) => void;
  onNext: () => void;
}

const TAP_TO_HEAR_INSTRUCTION_AUDIO = 'ui/tap-start.mp3';
const TAP_BOUNCE_MS = 420;

export const SoundGalleryPage = ({ sound, onPlayPhoneme, onPlayWord, onNext }: SoundGalleryPageProps) => {
  const examples = useMemo(() => sound.exampleWords.slice(0, 5), [sound.exampleWords]);
  const [bouncingId, setBouncingId] = useState<string | null>(null);
  const bounceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    onPlayWord(TAP_TO_HEAR_INSTRUCTION_AUDIO);
  }, [sound.id, onPlayWord]);

  useEffect(() => {
    return () => {
      if (bounceTimeoutRef.current !== null) {
        window.clearTimeout(bounceTimeoutRef.current);
      }
    };
  }, []);

  const handleWordTap = (wordKey: string, wordAudio: string) => {
    onPlayWord(wordAudio);
    setBouncingId(wordKey);

    if (bounceTimeoutRef.current !== null) {
      window.clearTimeout(bounceTimeoutRef.current);
    }

    bounceTimeoutRef.current = window.setTimeout(() => {
      setBouncingId((current) => (current === wordKey ? null : current));
    }, TAP_BOUNCE_MS);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col overflow-hidden px-4 py-5 sm:px-8">
      <div className="flex h-full flex-1 flex-col rounded-3xl bg-white/85 p-5 shadow-lg">
        <header className="mb-3 flex items-start justify-between">
          <div className="rounded-2xl bg-emerald-100 px-5 py-2 text-4xl font-black text-teal-900">{sound.display}</div>
          <button
            type="button"
            onClick={() => onPlayPhoneme(sound)}
            className="flex min-h-[120px] min-w-[120px] items-center justify-center rounded-full bg-teal-600 shadow active:scale-95"
            aria-label="Replay sound"
          >
            <img src={getImageUrl('img/ui/ear.png')} alt="" className="h-14 w-14" />
          </button>
        </header>

        <section className="grid flex-1 grid-cols-6 grid-rows-3 gap-3 pb-4 sm:gap-4">
          {examples.map((word, index) => {
            const wordKey = `${sound.id}-${word.word}`;
            const layout = index === 4 ? 'col-start-2 col-span-4 row-start-3' : 'col-span-3';

            return (
              <button
                key={wordKey}
                type="button"
                onClick={() => handleWordTap(wordKey, word.wordAudio)}
                className={`flex min-h-[120px] w-full items-center justify-center rounded-2xl bg-white p-2 shadow transition active:scale-95 ${layout} ${
                  bouncingId === wordKey ? 'animate-[bounce_420ms_ease-out_1]' : ''
                }`}
                aria-label={`Play ${word.word}`}
              >
                <img src={getImageUrl(word.imageAsset)} alt={word.word} className="h-28 w-full object-contain sm:h-32" />
              </button>
            );
          })}
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
