import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';
import type { Sound } from '../types';
import { getAudioUrl } from '../utils/content';

const UI_SOUNDS = {
  correct: getAudioUrl('ui/correct.mp3'),
  incorrect: getAudioUrl('ui/incorrect.mp3'),
  tapStart: getAudioUrl('ui/tap-start.mp3')
};

export const useAudio = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const cacheRef = useRef<Map<string, Howl>>(new Map());

  const getHowl = useCallback((url: string) => {
    const existing = cacheRef.current.get(url);
    if (existing) {
      return existing;
    }

    const howl = new Howl({
      src: [url],
      preload: true,
      html5: false
    });
    cacheRef.current.set(url, howl);
    return howl;
  }, []);

  const playUrl = useCallback(
    (url: string) => {
      const howl = getHowl(url);
      howl.stop();
      howl.play();
    },
    [getHowl]
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

  const playUi = useCallback(
    (key: keyof typeof UI_SOUNDS) => {
      playUrl(UI_SOUNDS[key]);
    },
    [playUrl]
  );

  const preloadForSound = useCallback(
    (sound: Sound) => {
      getHowl(getAudioUrl(sound.phonemeAudio)).load();
      sound.exampleWords.forEach((word) => {
        getHowl(getAudioUrl(word.wordAudio)).load();
      });
    },
    [getHowl]
  );

  const preloadUi = useCallback(() => {
    Object.values(UI_SOUNDS).forEach((url) => getHowl(url).load());
  }, [getHowl]);

  const preloadIntro = useCallback(
    (soundId: string) => {
      getHowl(getAudioUrl(`introductions/intro-${soundId}.mp3`)).load();
    },
    [getHowl]
  );

  useEffect(() => {
    return () => {
      cacheRef.current.forEach((howl) => howl.unload());
      cacheRef.current.clear();
    };
  }, []);

  return {
    isUnlocked,
    unlock,
    preloadUi,
    preloadForSound,
    preloadIntro,
    playPhoneme,
    playIntro,
    playWord,
    playUi
  };
};
