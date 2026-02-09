import rawSounds from '../../content/en/sounds.json';
import type { Sound, SoundsManifest } from '../types';

const soundsManifest = rawSounds as SoundsManifest;

export const PHASE_ONE_SOUNDS: Sound[] = soundsManifest.sounds.filter((sound) => sound.phase === 1);

export const getImageUrl = (imageAsset: string): string => `/${imageAsset}`;
export const getAudioUrl = (audioAsset: string): string => `/audio/${audioAsset}`;
