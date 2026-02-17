import { useEffect } from 'react';
import { getImageUrl } from '../utils/content';

interface SessionCompletePageProps {
  onPlayDoneAudio: () => void;
  onPlayAgain: () => void;
  soundsPracticed: string[];
  attempts: number;
}

const FALLING_STARS = Array.from({ length: 16 }, (_, index) => ({
  left: `${6 + index * 6}%`,
  delay: `${index * 140}ms`,
  duration: `${2600 + (index % 4) * 260}ms`
}));

const BOUNCE_LETTERS = ['Y', 'A', 'Y', '!', '✨'];

export const SessionCompletePage = ({
  onPlayDoneAudio,
  onPlayAgain,
  soundsPracticed,
  attempts
}: SessionCompletePageProps) => {
  useEffect(() => {
    onPlayDoneAudio();
  }, [onPlayDoneAudio]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-6 sm:px-8">
      <section className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-amber-100 via-emerald-100 to-cyan-100 p-6 text-center shadow-xl sm:p-10">
        {FALLING_STARS.map((star) => (
          <span
            key={`${star.left}-${star.delay}`}
            className="pointer-events-none absolute -top-8 text-3xl animate-fall-sway"
            style={{ left: star.left, animationDelay: star.delay, animationDuration: star.duration }}
          >
            ⭐
          </span>
        ))}

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 text-5xl font-black text-amber-500 sm:text-6xl">
            {BOUNCE_LETTERS.map((letter, index) => (
              <span key={`${letter}-${index}`} className="animate-bounce-letter" style={{ animationDelay: `${index * 120}ms` }}>
                {letter}
              </span>
            ))}
          </div>

          <img src={getImageUrl('img/ui/star-correct.png')} alt="Great work" className="mx-auto mt-5 h-40 w-40 animate-bounce-grow sm:h-48 sm:w-48" />
          <img src={getImageUrl('img/ui/celebration.png')} alt="Celebration" className="mx-auto mt-4 h-36 w-36 rounded-3xl object-cover animate-happy-pulse sm:h-44 sm:w-44" />

          <h1 className="mt-5 text-4xl font-black text-teal-900 sm:text-5xl">All done!</h1>
          <p className="mt-3 text-xl font-bold text-teal-800 sm:text-2xl">You earned so many sparkly stars today.</p>
          <p className="mt-3 text-base font-semibold text-teal-900 sm:text-lg">
            Sounds practiced: {soundsPracticed.join(', ') || 'none'}.
          </p>
          <p className="mt-1 text-base font-semibold text-teal-900 sm:text-lg">Attempts this session: {attempts}</p>

          <button
            type="button"
            onClick={onPlayAgain}
            className="mx-auto mt-8 inline-flex min-h-[120px] min-w-[260px] items-center justify-center rounded-full bg-teal-700 px-10 text-3xl font-black text-white shadow-lg transition active:scale-95"
          >
            Play again
          </button>
        </div>
      </section>
    </main>
  );
};
