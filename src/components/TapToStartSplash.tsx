import { getImageUrl } from '../utils/content';

interface TapToStartSplashProps {
  onStart: () => Promise<void>;
}

export const TapToStartSplash = ({ onStart }: TapToStartSplashProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-3xl bg-white/80 p-8 text-center shadow-lg backdrop-blur">
        <img
          src={getImageUrl('img/ui/splash.png')}
          alt="Tap to start"
          className="mx-auto h-52 w-52 rounded-3xl object-cover"
        />
        <h1 className="mt-5 text-4xl font-black text-teal-800">Lucy Phonics</h1>
        <p className="mt-3 text-lg text-teal-700">Tap once to start and turn on sound.</p>
        <button
          type="button"
          onClick={() => void onStart()}
          className="mt-7 inline-flex h-32 w-32 items-center justify-center rounded-full bg-amber-400 text-2xl font-black text-teal-900 shadow-md transition hover:scale-105 active:scale-95"
        >
          TAP
        </button>
      </div>
    </main>
  );
};
