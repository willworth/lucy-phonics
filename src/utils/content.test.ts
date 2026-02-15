import fs from 'node:fs';
import path from 'node:path';
import rawSounds from '../../content/en/sounds.json';
import { PHASE_ONE_SOUNDS, getAudioUrl, getImageUrl } from './content';

describe('content manifest', () => {
  it('contains required fields and only existing assets for phase 1', () => {
    const projectRoot = process.cwd();
    const sounds = rawSounds.sounds.filter((sound) => sound.phase === 1);

    expect(PHASE_ONE_SOUNDS).toHaveLength(sounds.length);

    for (const sound of sounds) {
      expect(sound.id.length).toBeGreaterThan(0);
      expect(sound.display.length).toBeGreaterThan(0);
      expect(sound.exampleWords).toHaveLength(5);

      const phonemePath = path.join(projectRoot, 'assets/audio', sound.phonemeAudio);
      expect(fs.existsSync(phonemePath)).toBe(true);

      for (const word of sound.exampleWords) {
        const imagePath = path.join(projectRoot, 'assets', word.imageAsset);
        const wordAudioPath = path.join(projectRoot, 'assets/audio', word.wordAudio);

        expect(fs.existsSync(imagePath)).toBe(true);
        expect(fs.existsSync(wordAudioPath)).toBe(true);
      }
    }
  });

  it('builds base-aware URLs', () => {
    expect(getImageUrl('img/ui/ear.png')).toContain('img/ui/ear.png');
    expect(getAudioUrl('words/m-moon.mp3')).toContain('audio/words/m-moon.mp3');
  });
});
