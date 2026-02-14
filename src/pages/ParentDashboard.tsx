import type { ProgressState, Sound } from '../types';

interface ParentDashboardProps {
  sounds: Sound[];
  progress: ProgressState;
  onBack: () => void;
  onResetSound: (soundId: string) => void | Promise<void>;
  onMarkSoundLearned: (soundId: string) => void | Promise<void>;
  onResetAll: () => void | Promise<void>;
  onExportProgress: () => ProgressState | null;
}

const getCardStyle = (locked: boolean, mastered: boolean): string => {
  if (locked) {
    return 'border-slate-300 bg-slate-100';
  }

  if (mastered) {
    return 'border-emerald-300 bg-emerald-50';
  }

  return 'border-amber-300 bg-amber-50';
};

export const ParentDashboard = ({
  sounds,
  progress,
  onBack,
  onResetSound,
  onMarkSoundLearned,
  onResetAll,
  onExportProgress
}: ParentDashboardProps) => {
  const totalAttempts = sounds.reduce((sum, sound) => sum + (progress.sounds[sound.id]?.attempts ?? 0), 0);
  const totalCorrect = sounds.reduce((sum, sound) => sum + (progress.sounds[sound.id]?.correct ?? 0), 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const handleExport = () => {
    const data = onExportProgress();
    if (!data) {
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lucy-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetAll = () => {
    const confirmed = window.confirm('Reset all progress? This cannot be undone.');
    if (!confirmed) {
      return;
    }
    void onResetAll();
  };

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-slate-900 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-teal-800">Lucy Phonics — Progress Dashboard</h1>
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-teal-700 px-4 py-2 font-semibold text-teal-800 transition hover:bg-teal-50"
          >
            Back
          </button>
        </header>

        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-600">Total sessions</p>
            <p className="mt-1 text-2xl font-bold text-teal-800">{totalAttempts}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-600">Total correct</p>
            <p className="mt-1 text-2xl font-bold text-teal-800">{totalCorrect}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-600">Overall accuracy</p>
            <p className="mt-1 text-2xl font-bold text-teal-800">{overallAccuracy}%</p>
          </article>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sounds.map((sound) => {
            const soundProgress = progress.sounds[sound.id];
            const correct = soundProgress?.correct ?? 0;
            const attempts = soundProgress?.attempts ?? 0;
            const locked = !soundProgress?.unlocked;
            const mastered = !locked && correct >= progress.requiredCorrect;
            const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

            return (
              <article
                key={sound.id}
                className={`rounded-lg border p-4 shadow-sm ${getCardStyle(locked, mastered)}`}
              >
                <div className="mb-4 flex items-baseline justify-between">
                  <p className="text-4xl font-bold text-teal-800">{sound.display}</p>
                  <p className="text-sm font-medium text-slate-700">
                    {correct}/{progress.requiredCorrect}
                  </p>
                </div>

                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Total attempts:</span> {attempts}
                  </p>
                  <p>
                    <span className="font-medium">Accuracy:</span> {accuracy}%
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    {locked ? 'Locked' : mastered ? 'Mastered' : 'In progress'}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => void onResetSound(sound.id)}
                    className="rounded-md border border-slate-400 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => void onMarkSoundLearned(sound.id)}
                    className="rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
                  >
                    Mark as learned
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <footer className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-md bg-teal-700 px-4 py-2 font-semibold text-white transition hover:bg-teal-800"
          >
            Export Progress
          </button>
          <button
            type="button"
            onClick={handleResetAll}
            className="rounded-md border border-red-600 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-50"
          >
            Reset All
          </button>
        </footer>
      </div>
    </main>
  );
};
