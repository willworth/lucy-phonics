import rawSounds from '../../content/en/sounds.json';
import type { Sound, SoundsManifest } from '../types';

const soundsManifest = rawSounds as SoundsManifest;
const withBaseUrl = (path: string): string => `${import.meta.env.BASE_URL}${path}`.replace(/([^:]\/)\/+/g, '$1');

export const PHASE_ONE_SOUNDS: Sound[] = soundsManifest.sounds.filter((sound) => sound.phase === 1);

export const getImageUrl = (imageAsset: string): string => withBaseUrl(imageAsset);
export const getAudioUrl = (audioAsset: string): string => withBaseUrl(`audio/${audioAsset}`);
