import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TapToStartSplash } from './components/TapToStartSplash';
import { useAudio } from './hooks/useAudio';
import { useParentGate } from './hooks/useParentGate';
import { useProgress } from './hooks/useProgress';
import { ParentDashboard } from './pages/ParentDashboard';
import { SessionCompletePage } from './pages/SessionCompletePage';
import { SoundGalleryPage } from './pages/SoundGalleryPage';
import { SoundIntroPage } from './pages/SoundIntroPage';
import { SoundMatchPage } from './pages/SoundMatchPage';
import { PHASE_ONE_SOUNDS } from './utils/content';

const REQUIRED_CORRECT = 3;
const TOTAL_MATCH_ROUNDS = 4;
const CORRECT_INSTRUCTION_ROTATION = ['well-done', 'thats-it', 'brilliant'] as const;

type SessionState = 'splash' | 'intro' | 'gallery' | 'match' | 'complete';

function App() {
  const sounds = useMemo(() => PHASE_ONE_SOUNDS, []);
  const { progress, loading, recordAttempt, resetSound, markSoundLearned, resetAll, exportProgress } =
    useProgress(sounds, REQUIRED_CORRECT);
  const {
    isUnlocked,
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
      preloadForSound(sound);
      preloadIntro(sound.id);
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
    preloadUi();
    preloadInstructions();

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

      // Delay "let's try another" so it doesn't overlap the congratulatory audio
      window.setTimeout(() => {
        playInstruction('lets-try-another');
      }, 1800);
      return result;
    },
    [matchRoundsDone, moveToSound, playInstruction, recordAttempt, sounds]
  );

  const handlePlayAgain = useCallback(() => {
    if (!progress) {
      return;
    }

    setMatchRoundsDone(0);
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
    return <SessionCompletePage onPlayDoneAudio={handlePlayDoneAudio} onPlayAgain={handlePlayAgain} />;
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
