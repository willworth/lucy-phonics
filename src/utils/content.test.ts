import fs from 'node:fs';
import path from 'node:path';
import rawSounds from '../../content/en/sounds.json';
import { PHASE_ONE_SOUNDS, getAudioUrl, getImageUrl } from './content';

const REQUIRED_INSTRUCTION_AUDIO = [
  'all-done',
  'brilliant',
  'can-you-find',
  'lets-try-another',
  'listen',
  'tap-to-hear',
  'thats-it',
  'well-done'
];

describe('content manifest', () => {
  it('contains required fields and only existing assets for phase 1', () => {
    const projectRoot = process.cwd();
    const sounds = rawSounds.sounds.filter((sound) => sound.phase === 1);

    expect(PHASE_ONE_SOUNDS).toHaveLength(sounds.length);

    for (const sound of sounds) {
      expect(sound.id.length).toBeGreaterThan(0);
      expect(sound.display.length).toBeGreaterThan(0);
      expect(sound.exampleWords).toHaveLength(5);

      const phonemePath = path.join(projectRoot, 'public/audio', sound.phonemeAudio);
      expect(fs.existsSync(phonemePath)).toBe(true);

      for (const word of sound.exampleWords) {
        const imagePath = path.join(projectRoot, 'public', word.imageAsset);
        const wordAudioPath = path.join(projectRoot, 'public/audio', word.wordAudio);

        expect(fs.existsSync(imagePath)).toBe(true);
        expect(fs.existsSync(wordAudioPath)).toBe(true);
      }
    }
  });

  it('builds base-aware URLs', () => {
    const imageUrl = getImageUrl('img/ui/ear.png');
    const audioUrl = getAudioUrl('words/m-moon.mp3');

    expect(imageUrl).toContain('img/ui/ear.png');
    expect(audioUrl).toContain('audio/words/m-moon.mp3');
    expect(imageUrl.includes('//')).toBe(false);
    expect(audioUrl.includes('//')).toBe(false);
  });

  it('contains expected static media set', () => {
    const projectRoot = process.cwd();
    const imageRoot = path.join(projectRoot, 'public/img');
    const audioRoot = path.join(projectRoot, 'public/audio');
    const allPngs = fs
      .readdirSync(imageRoot, { recursive: true })
      .filter((entry) => typeof entry === 'string' && entry.endsWith('.png'));

    expect(allPngs.length).toBeGreaterThanOrEqual(55);

    for (const sound of PHASE_ONE_SOUNDS) {
      const introFile = path.join(audioRoot, 'introductions', `intro-${sound.id}.mp3`);
      expect(fs.existsSync(introFile)).toBe(true);
    }

    for (const instruction of REQUIRED_INSTRUCTION_AUDIO) {
      const instructionFile = path.join(audioRoot, 'instructions', `${instruction}.mp3`);
      expect(fs.existsSync(instructionFile)).toBe(true);
    }

    const uiFiles = ['correct.mp3', 'incorrect.mp3', 'tap-start.mp3'].map((name) =>
      path.join(audioRoot, 'ui', name)
    );
    for (const uiFile of uiFiles) {
      expect(fs.existsSync(uiFile)).toBe(true);
    }
  });
});
