import { useMemo, useState } from 'react';
import { TapToStartSplash } from './components/TapToStartSplash';
import { useAudio } from './hooks/useAudio';
import { useProgress } from './hooks/useProgress';
import { SoundMatchPage } from './pages/SoundMatchPage';
import { PHASE_ONE_SOUNDS } from './utils/content';

const REQUIRED_CORRECT = 3;

function App() {
  const sounds = useMemo(() => PHASE_ONE_SOUNDS, []);
  const { progress, loading, recordAttempt } = useProgress(sounds, REQUIRED_CORRECT);
  const { isUnlocked, unlock, preloadUi, preloadForSound, playPhoneme, playWord, playUi } = useAudio();
  const [starting, setStarting] = useState(false);

  const handleStart = async () => {
    if (starting) {
      return;
    }
    setStarting(true);
    await unlock();
    preloadUi();
    const activeSoundIndex = progress?.unlockedSoundIndex ?? 0;
    preloadForSound(sounds[Math.min(activeSoundIndex, sounds.length - 1)]);
    setStarting(false);
  };

  if (loading || !progress) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-xl font-bold text-teal-800">Loading Lucy's sounds...</p>
      </main>
    );
  }

  if (!isUnlocked) {
    return <TapToStartSplash onStart={handleStart} />;
  }

  const soundIndex = Math.min(progress.unlockedSoundIndex, sounds.length - 1);
  const activeSound = sounds[soundIndex];
  const activeProgress = progress.sounds[activeSound.id];

  return (
    <SoundMatchPage
      sounds={sounds}
      unlockedSoundIndex={progress.unlockedSoundIndex}
      requiredCorrect={progress.requiredCorrect}
      currentCorrectForSound={activeProgress.correct}
      onPlayPhoneme={playPhoneme}
      onPlayWord={playWord}
      onPlayUi={(name) => playUi(name)}
      onAttempt={recordAttempt}
    />
  );
}

export default App;
