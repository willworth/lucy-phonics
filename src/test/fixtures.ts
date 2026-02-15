import type { Sound } from '../types';

export const makeSounds = (): Sound[] => [
  {
    id: 'm',
    locale: 'en-GB',
    type: 'consonant',
    display: 'm',
    phase: 1,
    phonemeAudio: 'phonemes/m.mp3',
    exampleWords: [
      { word: 'moon', imageAsset: 'img/sounds/m/moon.png', wordAudio: 'words/m-moon.mp3', soundPosition: 'start' },
      { word: 'map', imageAsset: 'img/sounds/m/map.png', wordAudio: 'words/m-map.mp3', soundPosition: 'start' },
      { word: 'milk', imageAsset: 'img/sounds/m/milk.png', wordAudio: 'words/m-milk.mp3', soundPosition: 'start' },
      { word: 'monkey', imageAsset: 'img/sounds/m/monkey.png', wordAudio: 'words/m-monkey.mp3', soundPosition: 'start' }
    ]
  },
  {
    id: 's',
    locale: 'en-GB',
    type: 'consonant',
    display: 's',
    phase: 1,
    phonemeAudio: 'phonemes/s.mp3',
    exampleWords: [
      { word: 'sun', imageAsset: 'img/sounds/s/sun.png', wordAudio: 'words/s-sun.mp3', soundPosition: 'start' },
      { word: 'sock', imageAsset: 'img/sounds/s/sock.png', wordAudio: 'words/s-sock.mp3', soundPosition: 'start' },
      { word: 'snake', imageAsset: 'img/sounds/s/snake.png', wordAudio: 'words/s-snake.mp3', soundPosition: 'start' },
      { word: 'star', imageAsset: 'img/sounds/s/star.png', wordAudio: 'words/s-star.mp3', soundPosition: 'start' }
    ]
  }
];
