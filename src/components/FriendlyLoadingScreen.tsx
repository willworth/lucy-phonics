import { getImageUrl } from '../utils/content';

export const FriendlyLoadingScreen = () => {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-3xl bg-white/80 p-8 text-center shadow-lg backdrop-blur">
        <img
          src={getImageUrl('img/ui/splash.png')}
          alt="Lucy Phonics loading"
          className="mx-auto h-36 w-36 animate-happy-pulse rounded-3xl object-cover"
        />

        <p className="mt-5 text-2xl font-black text-teal-800" aria-label="Loading Lucy's sounds">
          <span className="animate-bounce-letter [animation-delay:0ms]">L</span>
          <span className="animate-bounce-letter [animation-delay:80ms]">o</span>
          <span className="animate-bounce-letter [animation-delay:160ms]">a</span>
          <span className="animate-bounce-letter [animation-delay:240ms]">d</span>
          <span className="animate-bounce-letter [animation-delay:320ms]">i</span>
          <span className="animate-bounce-letter [animation-delay:400ms]">n</span>
          <span className="animate-bounce-letter [animation-delay:480ms]">g</span>
          <span className="mx-1"> </span>
          <span className="animate-bounce-letter [animation-delay:560ms]">f</span>
          <span className="animate-bounce-letter [animation-delay:640ms]">u</span>
          <span className="animate-bounce-letter [animation-delay:720ms]">n</span>
          <span className="animate-bounce-letter [animation-delay:800ms]">!</span>
        </p>

        <p className="mt-3 text-sm font-semibold text-teal-700">Getting Lucy&apos;s sounds ready ✨</p>
      </section>
    </main>
  );
};
