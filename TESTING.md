# Testing Lucy Phonics

## Quick Start

```bash
cd ~/code/lucy-phonics
git pull
npm install
npm run dev
```

Opens at `http://localhost:5173`. Use Chrome DevTools mobile emulation (toggle device toolbar → pick a tablet like iPad or Nexus 10) for the intended viewport.

## Test Flow

### 1. Splash Screen
- Tap anywhere → should hear tap sound, app loads first sound

### 2. Sound Introduction (NEW)
- Big letter "m" displayed centre screen
- Your voice plays the intro ("This says mmm! Like mmmmoon!")
- Tap the letter → replays the phoneme
- Tap any picture → plays the word
- Arrow button → advances to gallery

### 3. Sound Gallery (NEW)
- Grid of pictures for the sound
- Tap any picture → hear the word
- Ear button → replay phoneme
- Arrow → advance to matching game

### 4. Sound Match (existing, now integrated)
- "Find the sound" — 4 pictures, tap the one starting with the target sound
- Your instruction audio plays: "can you find..." before rounds
- Correct → rotating "well done" / "that's it" / "brilliant"
- Between rounds → "let's try another"
- 3 correct per sound to unlock next, 4 rounds per session

### 5. Session Complete (NEW)
- Celebration screen with star
- "All done!" audio plays
- "Play again" button resets session

### 6. Parent Dashboard (NEW)
- **Three-finger tap** anywhere → hold 3 seconds → dashboard opens
- Shows per-sound progress (accuracy, attempts, colour-coded)
- Reset / Mark as learned per sound
- Export progress as JSON
- Back button returns to app

## What to Watch For
- Audio timing: do instructions overlap? Is there awkward silence?
- Touch targets: can Lucy hit them easily on the tablet?
- Flow: does intro → gallery → match feel natural?
- Your voice recordings: do they sound right after normalization?

## Build for Deployment
```bash
npm run build    # Output in dist/
npm run preview  # Preview production build locally
```

## PWA Install
The app is a PWA — on Android Chrome, "Add to Home Screen" gives a full-screen app experience. Service worker caches everything for offline use.
