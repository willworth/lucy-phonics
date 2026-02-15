import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TapToStartSplash } from './components/TapToStartSplash';
import {
  CORRECT_INSTRUCTION_ROTATION,
  NEXT_ROUND_INSTRUCTION_DELAY_MS,
  REQUIRED_CORRECT,
  TOTAL_MATCH_ROUNDS
} from './config';
import { useAudio } from './hooks/useAudio';
import { useParentGate } from './hooks/useParentGate';
import { useProgress } from './hooks/useProgress';
import { ParentDashboard } from './pages/ParentDashboard';
import { SessionCompletePage } from './pages/SessionCompletePage';
import { SoundGalleryPage } from './pages/SoundGalleryPage';
import { SoundIntroPage } from './pages/SoundIntroPage';
import { SoundMatchPage } from './pages/SoundMatchPage';
import { getImageUrl } from './utils/content';
import { PHASE_ONE_SOUNDS } from './utils/content';

type SessionState = 'splash' | 'intro' | 'gallery' | 'match' | 'complete';
const delay = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

function App() {
  const sounds = useMemo(() => PHASE_ONE_SOUNDS, []);
  const { progress, loading, recordAttempt, resetSound, markSoundLearned, resetAll, exportProgress } =
    useProgress(sounds, REQUIRED_CORRECT);
  const {
    isUnlocked,
    audioError,
    clearAudioError,
    unlock,
    preloadUi,
    preloadInstructions,
    preloadForSound,
    preloadIntro,
    playPhoneme,
    playWord,
    playIntro,
    playUi,
    playInstruction
  } = useAudio();

  const [starting, setStarting] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState>('splash');
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0);
  const [matchRoundsDone, setMatchRoundsDone] = useState(0);
  const [matchInstructionPlayedFor, setMatchInstructionPlayedFor] = useState<Record<string, true>>({});
  const [sessionAttempts, setSessionAttempts] = useState(0);
  const [sessionSoundIds, setSessionSoundIds] = useState<Record<string, true>>({});
  const correctInstructionIndexRef = useRef(0);
  const [parentMode, setParentMode] = useState(false);
  const { gateHandlers, showOverlay } = useParentGate(() => setParentMode(true));

  const isSoundIntroduced = useCallback(
    (index: number) => {
      if (!progress) {
        return false;
      }

      const sound = sounds[Math.max(0, Math.min(index, sounds.length - 1))];
      const soundProgress = progress.sounds[sound.id];
      return (soundProgress?.attempts ?? 0) > 0;
    },
    [progress, sounds]
  );

  const moveToSound = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, sounds.length - 1));
      const sound = sounds[clampedIndex];

      setCurrentSoundIndex(clampedIndex);
      void preloadForSound(sound);
      void preloadIntro(sound.id);
      setSessionState(isSoundIntroduced(clampedIndex) ? 'match' : 'intro');
    },
    [isSoundIntroduced, preloadForSound, preloadIntro, sounds]
  );

  const handleStart = async () => {
    if (starting || !progress) {
      return;
    }

    setStarting(true);
    await unlock();
    await preloadUi();
    await preloadInstructions();

    const activeSoundIndex = Math.min(progress.unlockedSoundIndex, sounds.length - 1);
    moveToSound(activeSoundIndex);
    setStarting(false);
  };

  const handlePlayUi = useCallback(
    (name: 'correct' | 'incorrect') => {
      playUi(name);
      if (name === 'correct') {
        const nextInstruction =
          CORRECT_INSTRUCTION_ROTATION[correctInstructionIndexRef.current % CORRECT_INSTRUCTION_ROTATION.length];
        playInstruction(nextInstruction);
        correctInstructionIndexRef.current =
          (correctInstructionIndexRef.current + 1) % CORRECT_INSTRUCTION_ROTATION.length;
      }
    },
    [playInstruction, playUi]
  );

  const handleAttempt = useCallback(
    async (soundId: string, correct: boolean) => {
      setSessionAttempts((attempts) => attempts + 1);
      setSessionSoundIds((current) => ({ ...current, [soundId]: true }));

      const result = await recordAttempt(soundId, correct);

      if (!correct) {
        return result;
      }

      const nextRoundCount = matchRoundsDone + 1;
      setMatchRoundsDone(nextRoundCount);

      if (nextRoundCount >= TOTAL_MATCH_ROUNDS) {
        setSessionState('complete');
        return result;
      }

      if (result.unlockedNext) {
        const nextSoundIndex = sounds.findIndex((item) => item.id === soundId) + 1;
        if (nextSoundIndex > 0 && nextSoundIndex < sounds.length) {
          moveToSound(nextSoundIndex);
          return result;
        }
      }

      await delay(NEXT_ROUND_INSTRUCTION_DELAY_MS);
      playInstruction('lets-try-another');
      return result;
    },
    [matchRoundsDone, moveToSound, playInstruction, recordAttempt, sounds]
  );

  const handlePlayAgain = useCallback(() => {
    if (!progress) {
      return;
    }

    setMatchRoundsDone(0);
    setSessionAttempts(0);
    setSessionSoundIds({});
    correctInstructionIndexRef.current = 0;
    setMatchInstructionPlayedFor({});
    const activeSoundIndex = Math.min(progress.unlockedSoundIndex, sounds.length - 1);
    moveToSound(activeSoundIndex);
  }, [moveToSound, progress, sounds.length]);

  const handlePlayDoneAudio = useCallback(() => {
    playInstruction('all-done');
  }, [playInstruction]);

  const soundIndex = progress ? Math.min(currentSoundIndex, sounds.length - 1) : 0;
  const activeSound = sounds[soundIndex];
  const activeProgress = progress?.sounds[activeSound.id] ?? { correct: 0, attempts: 0, unlocked: false };

  useEffect(() => {
    if (!progress || !isUnlocked || sessionState !== 'match') {
      return;
    }
    if (matchInstructionPlayedFor[activeSound.id]) {
      return;
    }

    playInstruction('can-you-find');
    setMatchInstructionPlayedFor((current) => ({ ...current, [activeSound.id]: true }));
  }, [activeSound.id, isUnlocked, matchInstructionPlayedFor, playInstruction, progress, sessionState]);

  if (loading || !progress) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-xl font-bold text-teal-800">Loading Lucy's sounds...</p>
      </main>
    );
  }

  if (!isUnlocked || sessionState === 'splash') {
    return <TapToStartSplash onStart={handleStart} />;
  }

  if (parentMode) {
    return (
      <ParentDashboard
        sounds={sounds}
        progress={progress}
        onBack={() => setParentMode(false)}
        onResetSound={resetSound}
        onMarkSoundLearned={markSoundLearned}
        onResetAll={resetAll}
        onExportProgress={exportProgress}
      />
    );
  }

  if (sessionState === 'complete') {
    return (
      <SessionCompletePage
        onPlayDoneAudio={handlePlayDoneAudio}
        onPlayAgain={handlePlayAgain}
        attempts={sessionAttempts}
        soundsPracticed={Object.keys(sessionSoundIds)}
      />
    );
  }

  if (audioError) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <section className="w-full max-w-xl rounded-3xl bg-white/90 p-8 text-center shadow-lg">
          <img src={getImageUrl('img/ui/celebration.png')} alt="" className="mx-auto h-28 w-28 rounded-2xl object-cover opacity-80" />
          <h1 className="mt-4 text-2xl font-black text-teal-900">Something went wrong with audio</h1>
          <p className="mt-2 text-base font-semibold text-teal-700">{audioError}</p>
          <button
            type="button"
            onClick={() => {
              clearAudioError();
              void handleStart();
            }}
            className="mt-6 rounded-full bg-teal-700 px-6 py-3 text-lg font-black text-white"
          >
            Retry
          </button>
        </section>
      </main>
    );
  }

  if (sessionState === 'intro') {
    return (
      <SoundIntroPage
        sound={activeSound}
        onPlayPhoneme={playPhoneme}
        onPlayWord={playWord}
        onPlayIntro={playIntro}
        onNext={() => setSessionState('gallery')}
      />
    );
  }

  if (sessionState === 'gallery') {
    return (
      <SoundGalleryPage
        sound={activeSound}
        onPlayPhoneme={playPhoneme}
        onPlayWord={playWord}
        onNext={() => setSessionState('match')}
      />
    );
  }

  return (
    <div {...gateHandlers}>
      <SoundMatchPage
        sounds={sounds}
        unlockedSoundIndex={soundIndex}
        currentSoundIndex={soundIndex}
        totalSounds={sounds.length}
        requiredCorrect={progress.requiredCorrect}
        currentCorrectForSound={activeProgress.correct}
        onPlayPhoneme={playPhoneme}
        onPlayWord={playWord}
        onPlayUi={handlePlayUi}
        onAttempt={handleAttempt}
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
