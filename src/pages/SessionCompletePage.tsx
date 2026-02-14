import { useEffect } from 'react';

interface SessionCompletePageProps {
  onPlayDoneAudio: () => void;
  onPlayAgain: () => void;
}

const CONFETTI_DOTS = [
  { top: '10%', left: '8%', delay: '0ms' },
  { top: '18%', left: '78%', delay: '140ms' },
  { top: '25%', left: '45%', delay: '280ms' },
  { top: '38%', left: '18%', delay: '420ms' },
  { top: '42%', left: '88%', delay: '560ms' },
  { top: '60%', left: '30%', delay: '220ms' },
  { top: '66%', left: '70%', delay: '360ms' },
  { top: '74%', left: '14%', delay: '500ms' },
  { top: '80%', left: '84%', delay: '120ms' }
];

export const SessionCompletePage = ({ onPlayDoneAudio, onPlayAgain }: SessionCompletePageProps) => {
  useEffect(() => {
    onPlayDoneAudio();
  }, [onPlayDoneAudio]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-6 sm:px-8">
      <section className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-200 via-teal-100 to-cyan-100 p-6 text-center shadow-xl sm:p-10">
        {CONFETTI_DOTS.map((dot, index) => (
          <span
            key={`${dot.left}-${dot.top}`}
            className="absolute h-5 w-5 rounded-full bg-emerald-400/80 animate-bounce"
            style={{ top: dot.top, left: dot.left, animationDelay: dot.delay, animationDuration: `${1300 + index * 50}ms` }}
          />
        ))}

        <img src="/img/ui/star-correct.png" alt="Great work" className="mx-auto h-40 w-40 animate-pulse sm:h-48 sm:w-48" />
        <img src="/img/ui/celebration.png" alt="Celebration" className="mx-auto mt-4 h-36 w-36 rounded-3xl object-cover sm:h-44 sm:w-44" />

        <h1 className="mt-5 text-4xl font-black text-teal-900 sm:text-5xl">All done!</h1>
        <p className="mt-3 text-xl font-bold text-teal-800 sm:text-2xl">You earned a star today.</p>

        <button
          type="button"
          onClick={onPlayAgain}
          className="mx-auto mt-8 inline-flex min-h-[120px] min-w-[260px] items-center justify-center rounded-full bg-teal-700 px-10 text-3xl font-black text-white shadow-lg transition active:scale-95"
        >
          Play again
        </button>
      </section>
    </main>
  );
};
