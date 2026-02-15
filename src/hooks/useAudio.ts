import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';
import type { Sound } from '../types';
import { getAudioUrl } from '../utils/content';

const UI_SOUNDS = {
  correct: getAudioUrl('ui/correct.mp3'),
  incorrect: getAudioUrl('ui/incorrect.mp3'),
  tapStart: getAudioUrl('ui/tap-start.mp3')
};

const INSTRUCTION_AUDIO = [
  'all-done',
  'brilliant',
  'can-you-find',
  'lets-try-another',
  'listen',
  'tap-to-hear',
  'thats-it',
  'well-done'
] as const;

const toFriendlyAudioError = (url: string): string => `Audio failed to load: ${url.split('/').pop() ?? url}`;

export const useAudio = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const cacheRef = useRef<Map<string, Howl>>(new Map());

  const getHowl = useCallback((url: string) => {
    const existing = cacheRef.current.get(url);
    if (existing) {
      return existing;
    }

    const howl = new Howl({
      src: [url],
      preload: true,
      html5: false,
      onloaderror: () => {
        setAudioError((current) => current ?? toFriendlyAudioError(url));
      },
      onplayerror: () => {
        setAudioError((current) => current ?? `Audio playback failed: ${url.split('/').pop() ?? url}`);
      }
    });

    cacheRef.current.set(url, howl);
    return howl;
  }, []);

  const stopAll = useCallback(() => {
    cacheRef.current.forEach((howl) => howl.stop());
  }, []);

  const playUrl = useCallback(
    (url: string) => {
      const howl = getHowl(url);
      stopAll();
      howl.play();
    },
    [getHowl, stopAll]
  );

  const loadHowl = useCallback(
    async (url: string): Promise<void> => {
      const howl = getHowl(url);
      if (howl.state() === 'loaded') {
        return;
      }

      await new Promise<void>((resolve) => {
        const onLoad = () => resolve();
        const onLoadError = () => resolve();
        howl.once('load', onLoad);
        howl.once('loaderror', onLoadError);
        howl.load();
      });
    },
    [getHowl]
  );

  const preloadSequence = useCallback(
    async (urls: string[]) => {
      for (const url of urls) {
        await loadHowl(url);
      }
    },
    [loadHowl]
  );

  const unlock = useCallback(async () => {
    Howler.autoUnlock = true;
    const ctx = Howler.ctx;
    if (ctx && ctx.state !== 'running') {
      await ctx.resume();
    }
    playUrl(UI_SOUNDS.tapStart);
    setIsUnlocked(true);
  }, [playUrl]);

  const playPhoneme = useCallback(
    (sound: Sound) => {
      playUrl(getAudioUrl(sound.phonemeAudio));
    },
    [playUrl]
  );

  const playWord = useCallback(
    (wordAudioPath: string) => {
      playUrl(getAudioUrl(wordAudioPath));
    },
    [playUrl]
  );

  const playIntro = useCallback(
    (soundId: string) => {
      playUrl(getAudioUrl(`introductions/intro-${soundId}.mp3`));
    },
    [playUrl]
  );

  const playInstruction = useCallback(
    (name: string) => {
      playUrl(getAudioUrl(`instructions/${name}.mp3`));
    },
    [playUrl]
  );

  const playUi = useCallback(
    (key: keyof typeof UI_SOUNDS) => {
      playUrl(UI_SOUNDS[key]);
    },
    [playUrl]
  );

  const preloadForSound = useCallback(
    async (sound: Sound) => {
      await preloadSequence([
        getAudioUrl(sound.phonemeAudio),
        ...sound.exampleWords.map((word) => getAudioUrl(word.wordAudio))
      ]);
    },
    [preloadSequence]
  );

  const preloadUi = useCallback(async () => {
    await preloadSequence(Object.values(UI_SOUNDS));
  }, [preloadSequence]);

  const preloadInstructions = useCallback(async () => {
    await preloadSequence(INSTRUCTION_AUDIO.map((name) => getAudioUrl(`instructions/${name}.mp3`)));
  }, [preloadSequence]);

  const preloadIntro = useCallback(
    async (soundId: string) => {
      await preloadSequence([getAudioUrl(`introductions/intro-${soundId}.mp3`)]);
    },
    [preloadSequence]
  );

  const clearAudioError = useCallback(() => setAudioError(null), []);

  useEffect(() => {
    return () => {
      cacheRef.current.forEach((howl) => howl.unload());
      cacheRef.current.clear();
    };
  }, []);

  return {
    isUnlocked,
    audioError,
    clearAudioError,
    unlock,
    preloadUi,
    preloadInstructions,
    preloadForSound,
    preloadIntro,
    playPhoneme,
    playIntro,
    playInstruction,
    playWord,
    playUi
  };
};
