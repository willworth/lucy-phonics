import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FriendlyLoadingScreen } from './components/FriendlyLoadingScreen';
import { InstallPromptBanner } from './components/InstallPromptBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { TapToStartSplash } from './components/TapToStartSplash';
import {
  CORRECT_INSTRUCTION_ROTATION,
  NEXT_ROUND_INSTRUCTION_DELAY_MS,
  REQUIRED_CORRECT,
  TOTAL_MATCH_ROUNDS,
  getOptionCountForCorrectAnswers
} from './config';
import { useAudio } from './hooks/useAudio';
import { useParentGate } from './hooks/useParentGate';
import { useProgress } from './hooks/useProgress';
import { useSessionAnalytics } from './hooks/useSessionAnalytics';
import { ParentDashboard } from './pages/ParentDashboard';
import { SessionCompletePage } from './pages/SessionCompletePage';
import { SoundGalleryPage } from './pages/SoundGalleryPage';
import { SoundIntroPage } from './pages/SoundIntroPage';
import { type MatchAttemptPayload, SoundMatchPage } from './pages/SoundMatchPage';
import type { ProgressState } from './types';
import { getImageUrl, PHASE_ONE_SOUNDS } from './utils/content';
import { getNextSound } from './utils/spaced-repetition';

type SessionState = 'splash' | 'intro' | 'gallery' | 'match' | 'complete';
const delay = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
const MIN_LOADING_MS = import.meta.env.MODE === 'test' ? 0 : 1400;

function App() {
  const sounds = useMemo(() => PHASE_ONE_SOUNDS, []);
  const { progress, loading, recordAttempt, resetSound, markSoundLearned, resetAll, exportProgress } =
    useProgress(sounds, REQUIRED_CORRECT);
  const { sessions, startSession, recordAttempt: recordSessionAttempt, endSession, refreshSessions, exportSessionAnalytics } =
    useSessionAnalytics();
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
  const [minimumLoadingDone, setMinimumLoadingDone] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState>('splash');
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0);
  const [matchRoundsDone, setMatchRoundsDone] = useState(0);
  const [matchInstructionPlayedFor, setMatchInstructionPlayedFor] = useState<Record<string, true>>({});
  const [sessionAttempts, setSessionAttempts] = useState(0);
  const [sessionCorrectAnswers, setSessionCorrectAnswers] = useState(0);
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

  const moveToWeightedSound = useCallback(
    (nextProgress: ProgressState) => {
      const nextSound = getNextSound(sounds, nextProgress);
      const nextSoundIndex = sounds.findIndex((sound) => sound.id === nextSound.id);
      moveToSound(nextSoundIndex >= 0 ? nextSoundIndex : 0);
    },
    [moveToSound, sounds]
  );

  const resetSessionState = useCallback(() => {
    setMatchRoundsDone(0);
    setSessionAttempts(0);
    setSessionCorrectAnswers(0);
    setSessionSoundIds({});
    setMatchInstructionPlayedFor({});
    correctInstructionIndexRef.current = 0;
  }, []);

  const handleStart = async () => {
    if (starting || !progress) {
      return;
    }

    setStarting(true);
    await unlock();
    await preloadUi();
    await preloadInstructions();

    resetSessionState();
    await startSession();
    moveToWeightedSound(progress);
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
    async (payload: MatchAttemptPayload) => {
      setSessionAttempts((attempts) => attempts + 1);
      setSessionSoundIds((current) => ({ ...current, [payload.soundId]: true }));
      recordSessionAttempt(payload);

      const result = await recordAttempt(payload.soundId, payload.correct);

      if (!payload.correct) {
        return result;
      }

      setSessionCorrectAnswers((count) => count + 1);
      const nextRoundCount = matchRoundsDone + 1;
      setMatchRoundsDone(nextRoundCount);

      if (nextRoundCount >= TOTAL_MATCH_ROUNDS) {
        await endSession();
        setSessionState('complete');
        return result;
      }

      if (result.progress) {
        moveToWeightedSound(result.progress);
      }

      await delay(NEXT_ROUND_INSTRUCTION_DELAY_MS);
      playInstruction('lets-try-another');
      return result;
    },
    [endSession, matchRoundsDone, moveToWeightedSound, playInstruction, recordAttempt, recordSessionAttempt]
  );

  const handlePlayAgain = useCallback(async () => {
    if (!progress) {
      return;
    }

    await endSession();
    resetSessionState();
    await startSession();
    moveToWeightedSound(progress);
  }, [endSession, moveToWeightedSound, progress, resetSessionState, startSession]);

  const handlePlayDoneAudio = useCallback(() => {
    playInstruction('all-done');
  }, [playInstruction]);

  useEffect(() => {
    if (!parentMode) {
      return;
    }

    void refreshSessions();
  }, [parentMode, refreshSessions]);

  useEffect(() => {
    return () => {
      void endSession();
    };
  }, [endSession]);

  useEffect(() => {
    const timer = window.setTimeout(() => setMinimumLoadingDone(true), MIN_LOADING_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const soundIndex = progress ? Math.min(currentSoundIndex, sounds.length - 1) : 0;
  const sessionOptionCount = getOptionCountForCorrectAnswers(sessionCorrectAnswers);
  const activeSound = sounds[soundIndex];
  const activeProgress = progress?.sounds[activeSound.id] ?? {
    correct: 0,
    attempts: 0,
    unlocked: false,
    correctStreak: 0,
    lastPracticedAt: null
  };

  const parentHint = (
    <div className="fixed right-3 top-3 z-40 rounded-full bg-white/90 px-3 py-2 text-sm font-bold text-teal-900 shadow">
      👨‍👩‍👧 Parent
    </div>
  );

  const renderPlayShell = (content: ReactNode) => (
    <div className="page-transition" {...gateHandlers}>
      {parentHint}
      {content}
      {showOverlay ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70">
          <p className="rounded-lg bg-slate-950/60 px-5 py-4 text-center text-lg font-semibold text-white">
            Hold 3 seconds to enter parent mode
          </p>
        </div>
      ) : null}
    </div>
  );

  const renderWithGlobalUI = (content: ReactNode) => (
    <>
      {content}
      <OfflineIndicator />
      <InstallPromptBanner />
    </>
  );

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

  if (loading || !progress || !minimumLoadingDone) {
    return renderWithGlobalUI(<FriendlyLoadingScreen />);
  }

  if (!isUnlocked || sessionState === 'splash') {
    return renderWithGlobalUI(<TapToStartSplash onStart={handleStart} />);
  }

  if (parentMode) {
    return renderWithGlobalUI(
      <ParentDashboard
        sounds={sounds}
        progress={progress}
        sessions={sessions}
        onBack={() => setParentMode(false)}
        onResetSound={resetSound}
        onMarkSoundLearned={markSoundLearned}
        onResetAll={resetAll}
        onExportProgress={async () => {
          const progressData = exportProgress();
          if (!progressData) {
            return null;
          }

          const sessionData = await exportSessionAnalytics();
          return {
            progress: progressData,
            sessions: sessionData
          };
        }}
      />
    );
  }

  if (sessionState === 'complete') {
    return renderWithGlobalUI(
      renderPlayShell(
        <SessionCompletePage
          onPlayDoneAudio={handlePlayDoneAudio}
          onPlayAgain={() => void handlePlayAgain()}
          attempts={sessionAttempts}
          soundsPracticed={Object.keys(sessionSoundIds)}
        />
      )
    );
  }

  if (audioError) {
    return renderWithGlobalUI(
      renderPlayShell(
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
      )
    );
  }

  if (sessionState === 'intro') {
    return renderWithGlobalUI(
      renderPlayShell(
        <SoundIntroPage
          sound={activeSound}
          onPlayPhoneme={playPhoneme}
          onPlayWord={playWord}
          onPlayIntro={playIntro}
          onNext={() => setSessionState('gallery')}
        />
      )
    );
  }

  if (sessionState === 'gallery') {
    return renderWithGlobalUI(
      renderPlayShell(
        <SoundGalleryPage
          sound={activeSound}
          onPlayPhoneme={playPhoneme}
          onPlayWord={playWord}
          onNext={() => setSessionState('match')}
        />
      )
    );
  }

  return renderWithGlobalUI(
    renderPlayShell(
      <>
        <SoundMatchPage
          sounds={sounds}
          unlockedSoundIndex={soundIndex}
          currentSoundIndex={soundIndex}
          totalSounds={sounds.length}
          requiredCorrect={progress.requiredCorrect}
          currentCorrectForSound={activeProgress.correct}
          optionCount={sessionOptionCount}
          onPlayPhoneme={playPhoneme}
          onPlayWord={playWord}
          onPlayUi={handlePlayUi}
          onAttempt={handleAttempt}
        />
      </>
    )
  );
}

export default App;
