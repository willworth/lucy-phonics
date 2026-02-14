import { useMemo, useState } from 'react';
import { TapToStartSplash } from './components/TapToStartSplash';
import { useAudio } from './hooks/useAudio';
import { useParentGate } from './hooks/useParentGate';
import { useProgress } from './hooks/useProgress';
import { ParentDashboard } from './pages/ParentDashboard';
import { SoundMatchPage } from './pages/SoundMatchPage';
import { PHASE_ONE_SOUNDS } from './utils/content';

const REQUIRED_CORRECT = 3;

function App() {
  const sounds = useMemo(() => PHASE_ONE_SOUNDS, []);
  const { progress, loading, recordAttempt, resetSound, markSoundLearned, resetAll, exportProgress } =
    useProgress(sounds, REQUIRED_CORRECT);
  const { isUnlocked, unlock, preloadUi, preloadForSound, playPhoneme, playWord, playUi } = useAudio();
  const [starting, setStarting] = useState(false);
  const [parentMode, setParentMode] = useState(false);
  const { gateHandlers, showOverlay } = useParentGate(() => setParentMode(true));

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

  if (parentMode) {
    return (
      <div {...gateHandlers}>
        <ParentDashboard
          sounds={sounds}
          progress={progress}
          onBack={() => setParentMode(false)}
          onResetSound={resetSound}
          onMarkSoundLearned={markSoundLearned}
          onResetAll={resetAll}
          onExportProgress={exportProgress}
        />
        {showOverlay ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70">
            <p className="rounded-lg bg-slate-950/60 px-5 py-4 text-center text-lg font-semibold text-white">
              Hold 3 seconds to enter parent mode
            </p>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div {...gateHandlers}>
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
      {showOverlay ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70">
          <p className="rounded-lg bg-slate-950/60 px-5 py-4 text-center text-lg font-semibold text-white">
            Hold 3 seconds to enter parent mode
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default App;
