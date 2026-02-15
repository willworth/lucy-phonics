# Lucy Phonics 🔤🎧

A Progressive Web App that teaches young children to recognise and distinguish English speech sounds. Built for a bilingual 3-year-old learning to read.

**Methodology:** Synthetic phonics (sounds first, not letter names) informed by Mentava and Jolly Phonics research. Phonemic awareness before blending — can she hear that /b/ and /d/ are different sounds?

## How It Works

1. **Sound Introduction** — A new phoneme is presented with dad's voice: _"This says mmm! Like mmmmoon!"_
2. **Sound Gallery** — Tap pictures to hear example words for that sound
3. **Sound Matching** — _"Find the sound!"_ — pick the correct image from four options
4. **Progression** — 3 correct matches unlocks the next sound. 4 rounds per session.

All audio is real voice recordings (no TTS). All images are AI-generated flat vector illustrations with a consistent style.

## Phase 1 Sounds

Six sounds chosen for maximum early word-building potential:

| Sound | Example words |
|-------|--------------|
| /m/ | moon, monkey, map, mouse, milk |
| /s/ | sun, sock, star, snail, snake |
| /a/ | ant, cat, hat, bat, apple |
| /t/ | tiger, tree, train, turtle, tap |
| /p/ | pan, penguin, pink, puppy, pie |
| /n/ | nose, nut, nest, net, nap |

## Running Locally

```bash
git clone https://github.com/willworth/lucy-phonics.git
cd lucy-phonics
npm install
npm run dev
```

Opens at `http://localhost:5173`.

### On a tablet or phone (local network)

```bash
npx vite --host
```

Then visit `http://<your-computer-ip>:5173` from the device. Both must be on the same WiFi network.

### Build for production

```bash
npm run build    # Output in dist/
npm run preview  # Preview the production build
```

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Vite + React + TypeScript |
| Styling | Tailwind CSS |
| Audio | Howler.js |
| PWA | vite-plugin-pwa (offline-capable) |
| Storage | IndexedDB via idb-keyval |
| Testing | Vitest + Testing Library |

## Design Principles

- **Giant touch targets** — minimum 80px, designed for small fingers on tablets
- **No text instructions** — audio and visual only (she can't read yet — that's the point)
- **No failure states** — wrong answers get gentle redirection, not buzzers
- **Short sessions** — 3–5 minutes, matching a 3-year-old's attention span
- **Offline-first** — service worker caches everything after first load

## Parent Dashboard

Three-finger tap and hold anywhere opens the parent dashboard showing per-sound progress, accuracy stats, and options to reset or export data.

## Tests

```bash
npm test         # Run all tests
npm run lint     # ESLint
```

## Project Structure

```
src/
  App.tsx                    # Session state machine
  config.ts                  # Game constants
  hooks/
    useAudio.ts              # Howler.js wrapper, preloading, overlap protection
    useProgress.ts           # IndexedDB progress tracking
  pages/
    SoundIntroPage.tsx       # "This says mmm!"
    SoundGalleryPage.tsx     # Tap pictures, hear words
    SoundMatchPage.tsx       # Core matching game
    SessionCompletePage.tsx  # Celebration screen
    ParentDashboard.tsx      # Progress stats
  components/
    ImageChoiceCard.tsx      # Tappable image with fallback
    TapToStartSplash.tsx     # iOS audio unlock gate
content/
  en/sounds.json             # Sound/word/asset manifest
assets/
  audio/                     # Voice recordings (phonemes, words, instructions)
  img/                       # AI-generated illustrations
```

## Audio Recording

All phoneme, word, and instruction audio was recorded on a Zoom H6, processed with FFmpeg loudness normalisation (`loudnorm`), and converted to MP3. See `RECORDING-SCRIPT.md` for the full list of 50 clips.

## Licence

Private project — not open for contributions. Public for portfolio visibility.
