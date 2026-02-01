# Lucy Phonics — Spec v2

**Date:** 2026-02-01
**Status:** Revised after Gemini + GPT review. For Will's final sign-off before build.

---

## What We're Building

A Progressive Web App that teaches Lucy (age 3, bilingual English/Spanish in Spain) to recognise and distinguish English speech sounds. Methodology: Mentava-informed synthetic phonics — phonemic awareness first, blending later when developmentally ready.

**Primary device:** Android tablet. Secondary: iPhone.
**Primary objective:** Phoneme discrimination — can she hear that /b/ and /d/ are different sounds? Letters appear on screen as shapes associated with sounds, but we never speak letter names, only phonemes. The letter is a visual anchor, not the learning target.

---

## Critical Design Decision: Phonemes First, Letters Second

Both reviewers flagged this. We need to be explicit:

- **We are teaching sound discrimination**, not letter-sound mapping (yet).
- Letters appear on screen as a visual shape associated with a sound, but they're secondary to pictures and audio.
- We NEVER say "this is the letter M" — we say "this says /m/!"
- Option to toggle letters off entirely (parent setting), showing only a mouth/ear icon + pictures.
- Letter-sound mapping becomes the goal in Phase 2, once phonemic awareness is solid.

**Question for Will:** Do you want letters visible from the start (as shapes, never named), or hidden by default with pictures only? My instinct: visible but small — the shape becomes familiar through association without being the focus.

---

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Vite + React + TypeScript | |
| Styling | Tailwind CSS | |
| Audio | **Howler.js** | Handles iOS AudioContext unlocking, sprite sheets, preloading. Much better than raw Web Audio for this use case. |
| PWA | vite-plugin-pwa | Stale-while-revalidate for media assets. Content-hashed filenames for cache busting. |
| Storage | **IndexedDB** (via idb-keyval or Dexie) | NOT localStorage. Survives better, async, supports migrations. |
| Hosting | Vercel (free tier) | HTTPS, global CDN, monorepo support. |
| Images | AI-generated flat vector | Consistent prompt style across all assets. |

### Monorepo Placement

In the existing Turborepo monorepo at `sites/lucy-phonics/`. Shares ESLint, Prettier, TS configs. Vercel handles monorepo deploys natively (set root directory). No standalone repo overhead.

---

## Audio System (new section — both reviewers flagged this)

### iOS Audio Unlock

iOS Safari/PWAs block AudioContext until user interaction. This is non-negotiable.

**Solution:** App opens with a full-screen "tap to start" splash. First tap:
1. Initialises Howler.js audio context
2. Preloads Phase 1 phoneme sprites + UI sounds
3. Transitions to the activity screen

This is invisible to Lucy — she just sees a big colourful button to press. But it solves the iOS audio gate.

### Preload Strategy

| Priority | What | When |
|----------|------|------|
| Immediate | UI SFX (correct/incorrect) + current sound's phoneme | On audio unlock |
| Next | Current sound's 5 example word clips + images | Before activity starts |
| Background | Next sound's assets | During idle moments |
| Lazy | All remaining sounds | On first install, progressively |

### Audio Sprite Sheets

Bundle all phonemes into a single sprite sheet (one file, indexed by timestamp offsets). Howler.js handles this natively. Reduces HTTP requests, improves load time.

### Tap-to-Sound Target

- **Goal:** <150ms from tap to audible sound after first decode.
- **First play of any sound:** May be slower (~300ms) due to decode. Acceptable.
- **iOS background resume:** Howler handles AudioContext re-activation on return from background. Test this explicitly.

### Recording Spec

| Parameter | Value |
|-----------|-------|
| Source | Will's voice via Zoom H6 |
| Format (recording) | WAV, 44.1kHz, mono |
| Format (delivery) | MP3 128kbps mono (broad compat) + AAC as fallback |
| Normalisation | **-16 LUFS** (mobile-optimised loudness) |
| Processing | Martha handles: normalise, trim silence, convert, build sprites |

**Clips needed for MVP:**

| Type | Count | Example |
|------|-------|---------|
| Isolated phonemes | 6 | /m/, /s/, /a/, /t/, /p/, /n/ |
| Example words (emphasised) | ~30 | "mmmmoon", "ssssnake" |
| Instruction phrases | ~8 | "Can you find the /s/?", "Well done!", "Tap to hear!" |
| UI SFX: correct | 1 | Gentle chime |
| UI SFX: try again | 1 | Silence or very subtle tone |
| **Total** | **~46 clips** | **~20-30 min recording session** |

**Question for Will:** Are you comfortable recording the instruction phrases too ("Can you find the /s/?") or would you prefer those as TTS with your voice only for phonemes and words? One voice throughout is ideal.

---

## Performance & Storage Budget (new section)

| Metric | Target |
|--------|--------|
| Total offline payload (MVP) | **≤30 MB** |
| Time to interactive (after install) | **<2 seconds** on tablet |
| Tap-to-sound latency | **<150ms** (post-decode) |
| Storage (progress data) | **<1 MB** |

### Cache Strategy

- **Core (always cached):** App shell, UI SFX, Phase 1 audio + images (~15 MB)
- **Progressive:** Phase 2+ assets cached as they unlock
- **If storage evicted:** App still works online. Progress preserved in IndexedDB (more resilient than cache storage). On next online visit, assets re-cache.

### Scaling Note

Full 44-sound set with all comparison pairs + images: estimated ~80-100 MB. Handle via lazy loading — only cache unlocked phases. Never try to cache everything at once.

---

## Content Architecture

### File Structure

```
sites/lucy-phonics/
├── public/
│   └── manifest.json
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── SplashScreen.tsx      # "Tap to start" (audio unlock)
│   │   ├── SoundIntro.tsx        # Phase 1: meet a sound
│   │   ├── SoundGallery.tsx      # Tap pictures, hear words
│   │   ├── SoundMatch.tsx        # Pick the right picture
│   │   ├── SoundFind.tsx         # Find the sound from 4 options
│   │   ├── SessionComplete.tsx   # "All done!" endpoint
│   │   └── ParentDashboard.tsx   # Hidden stats screen
│   ├── audio/
│   │   └── AudioManager.ts      # Howler.js wrapper
│   ├── data/
│   │   └── useProgress.ts       # IndexedDB state management
│   └── types.ts
├── content/
│   ├── en/
│   │   ├── sounds.json           # Sound definitions + metadata
│   │   └── pairs.json            # Comparison pair definitions
│   └── es/                       # (empty, ready for Spanish)
│       ├── sounds.json
│       └── pairs.json
└── assets/
    ├── audio/
    │   ├── phonemes/             # Isolated sounds
    │   ├── words/                # Example words
    │   └── ui/                   # SFX + instruction phrases
    └── img/
        ├── sounds/               # Per-sound example images
        └── ui/                   # App chrome, icons
```

### Data Model

```typescript
interface SoundSet {
  locale: 'en-GB' | 'es-ES';     // i18n-ready from day one
  schemaVersion: 1;
  sounds: Sound[];
  comparisonPairs: ComparisonPair[];
}

interface Sound {
  id: string;                      // "m", "sh", "ae"
  locale: 'en-GB' | 'es-ES';
  type: 'consonant' | 'short-vowel' | 'long-vowel' | 'digraph' | 'r-controlled';
  display: string;                 // Visual on screen: "m", "sh"
  phase: 1 | 2 | 3 | 4 | 5 | 6;
  phonemeAudio: string;            // Sprite ID or file ref
  pronunciationTip?: string;       // For parent: "Say mmm, not muh"
  exampleWords: ExampleWord[];
}

interface ExampleWord {
  word: string;                    // "moon"
  imageAsset: string;              // Content-hashed path
  wordAudio: string;               // "mmmmoon" emphasised
  soundPosition: 'start' | 'middle' | 'end';
}

interface ComparisonPair {
  soundA: string;
  soundB: string;
  difficulty: 'easy' | 'medium' | 'hard';
  minimalPairs: { wordA: string; wordB: string; imageA: string; imageB: string; }[];
}
```

### Persistence Model

```typescript
interface PersistedState {
  schemaVersion: 1;
  contentVersion: string;          // "2026-02-01-a" — for migrations
  locale: 'en-GB' | 'es-ES';
  progress: Progress;
}

interface Progress {
  soundsIntroduced: string[];
  soundAccuracy: {
    [soundId: string]: {
      // Rolling window, not lifetime total
      recentAttempts: { correct: boolean; timestamp: number; }[];  // Last 15
      introduced: string;          // ISO date
      parentMarkedLearned: boolean;
    };
  };
  currentPhase: number;
  sessionsCompleted: number;
  totalTimeMs: number;
  readinessTestPassed: boolean;
  lastSessionDate: string;
}
```

**Migration strategy:** On app load, check `schemaVersion`. If old, run migration function. Never delete progress — only transform.

**Export/import:** Parent dashboard has "Export progress" button (downloads JSON file). "Import" button to restore on a new device. No accounts, no cloud sync.

---

## Activity Design (revised)

### Splash Screen (Audio Unlock)

Full screen. Big friendly image (sun, animal, something appealing). Big pulsing circle: "TAP!"
On tap: initialise audio, preload, transition. Takes <1 second.

### 1. Sound Introduction

- Large letter (or mouth icon if letters-off mode) in centre
- 3 big example pictures below
- Tap letter/icon → plays phoneme
- Tap any picture → plays word with emphasis
- Audio: "/m/! Like mmmoon!" (emphasise the sound)
- **No right/wrong.** Pure exploration. She taps, she hears.
- Auto-advances to gallery after ~30 seconds OR parent taps forward arrow

### 2. Sound Gallery

- 3×3 grid of pictures for one sound
- Tap any → hear word with emphasis
- "Repeat sound" button: big ear icon in corner → replays the phoneme
- Still no right/wrong. Building familiarity.

### 3. Sound Match (first game)

- Audio plays: "Can you find the /s/?"
- Two large pictures appear (one correct, one phonologically controlled distractor)
- **Correct:** Satisfying animation (stars, bounce), happy chime, brief celebration
- **Wrong:** Picture fades to 50% opacity. No animation, no sound. Correct answer subtly highlights. Boring. (Gemini insight: toddlers tap wrong ON PURPOSE if the wrong-answer animation is fun)
- **Repeat button (ear icon):** Always available to replay the sound
- **Distractor selection:** Phonologically controlled — easy pairs first (m vs s), harder later (b vs d). Never a vocabulary test.

### 4. Sound Find (harder)

- Same as Sound Match but with 3-4 options
- Unlocks after Sound Match accuracy is sufficient
- Same feedback rules: exciting correct, boring incorrect

### Session Flow

A session is a **content queue**, not a timer:
1. If new sound to introduce: Sound Intro → Sound Gallery (1 sound)
2. 4-6 Sound Match rounds (mixing known sounds)
3. 1-2 Sound Find rounds (if unlocked)
4. **"All Done!" screen** — big celebration animation, stops offering interactions

**Total: ~2-3 minutes of content.** Queue empties, session ends naturally. No frustration from a timer cutting her off mid-activity, but also no infinite scrolling.

### Unlock Logic (revised per GPT feedback)

**Old:** 3 correct in a row → learned. **Too brittle for toddlers.**

**New:**
- Rolling window of last 15 attempts per sound
- Sound "recognised" when: ≥10 attempts AND ≥70% correct in the window
- **Guessing detection:** If responses are <500ms (too fast to listen), don't count them
- **Parent override:** "Mark as learned" button in parent dashboard
- **Parent override:** "Reset" button if a sound needs revisiting
- All Phase 1 sounds recognised → Phase 2 unlocks (with celebration)

---

## Parent Dashboard

### Access

**Three-finger tap** anywhere on screen (toddlers don't do multi-touch intentionally). Shows for 3 seconds: "Hold to enter parent mode." Hold → dashboard opens.

Alternative: shake device (accelerometer) → same flow.

### Contents

- Sounds introduced: visual grid showing which sounds, colour-coded by confidence
- Per-sound accuracy (rolling window, last 15 attempts)
- Total sessions / total time
- "Mark as learned" / "Reset" per sound
- "Export progress" button (JSON download)
- "Import progress" button
- Toggle: letters visible / hidden
- Toggle: locale (en-GB / es-ES) — for future
- Readiness test trigger (emoji pairs)

---

## Image Assets

### Style: Flat Vector, Consistent Prompt

All AI-generated in one batch with a locked prompt:

> "Simple flat vector illustration of a [object], thick black outlines, bold solid colors, white background, no shading, no gradients, no texture, children's educational style, single object centred"

**Why flat vector:** Masks AI inconsistency (Gemini insight). Clear on small screens. Works in bright sunlight. Unmistakable objects.

### Curation Checklist (per image)

Before accepting any generated image:
- [ ] Is the object immediately recognisable to a 3-year-old?
- [ ] Could it be confused with another object in the set?
- [ ] Is it culturally familiar? (No American-specific objects Lucy wouldn't know)
- [ ] Is it visually distinct from other images at the same size?

### MVP Count

- 5 example images × 6 sounds = 30 images
- ~15 distractor images for matching games
- ~5 UI images (splash, celebration, ear icon, etc.)
- **Total: ~50 images**

---

## Bilingual Architecture (built now, populated later)

- `content/en/sounds.json` and `content/es/sounds.json` — separate sound sets
- Locale selector in parent dashboard (not accessible to Lucy)
- Same UI, different content. No mixing languages in one session.
- Spanish phonics is near 1:1 letter-sound, so the data model works even better for it.
- **Not building Spanish content now.** Just ensuring the structure supports it without refactoring.

**Question for Will:** For Spanish, would you want Noelia to record the audio? Or a neutral Spanish speaker? This is a future question but worth thinking about.

---

## Hosting & Deployment

- **URL:** `lucyphonics.vercel.app` (no custom domain — she can't read the URL)
- **Deploy:** Push to monorepo → Vercel auto-deploys from `sites/lucy-phonics/`
- **Privacy:** Zero analytics, zero tracking, zero external calls. Fully offline after first load.
- **HTTPS:** Included via Vercel (required for service worker)

---

## Implementation Plan

### Phase 1: Preparation (Martha — this week)

| Task | Output |
|------|--------|
| Generate 50 flat vector images (AI batch) | `assets/img/` |
| Build `content/en/sounds.json` for Phase 1 (6 sounds) | Content manifest |
| Build `content/en/pairs.json` (empty for MVP, structure ready) | Pairs manifest |
| Prepare recording script for Will | List of exactly what to say, in order |

### Phase 2: Recording (Will — 30 min session)

| Task | Notes |
|------|-------|
| Record 46 audio clips on Zoom H6 | Following the script Martha prepares |
| Transfer files to server (USB/email/whatever) | Raw WAVs |

### Phase 3: Audio Processing (Martha)

| Task | Output |
|------|--------|
| Normalise all clips to -16 LUFS | Consistent volume |
| Trim silence, convert to MP3 128kbps mono | Web-ready |
| Build Howler.js sprite sheet | Single file + offset map |

### Phase 4: Build (Claude Code on MacBook)

| Task | Notes |
|------|-------|
| Scaffold Vite + React + TS + Tailwind in monorepo | `sites/lucy-phonics/` |
| Install Howler.js, vite-plugin-pwa, idb-keyval | Dependencies |
| Build components: Splash, SoundIntro, Gallery, Match, Find, SessionComplete, ParentDashboard | Core UI |
| Integrate content JSON + audio sprites + images | Wire it all together |
| PWA config: manifest, service worker, cache strategy | Offline support |
| Test on Android tablet + iPhone Safari | Real devices |

### Phase 5: Ship & Test (Will + Lucy)

| Task | Notes |
|------|-------|
| Deploy to Vercel | Push and done |
| Install on tablet home screen | Add to home screen |
| First session with Lucy | Observe, don't intervene |
| Feedback → iterate | What worked? What confused her? |

---

## Open Questions for Will

### Must Answer Before Build

1. **Letters visible or hidden by default?** Visible-but-small (my recommendation) or pictures-only with letters as a parent toggle?

2. **Your voice for everything?** Phonemes, example words, AND instruction phrases ("Can you find the /s/?")? Or instructions via TTS? One voice throughout is better.

3. **Android tablet model?** Need to test on the actual device. What is it?

4. **Monorepo confirmed?** Placing in `sites/lucy-phonics/` alongside willworth.dev etc.?

### Can Decide Later

5. **Spanish audio voice** — Noelia? Neutral speaker? Future question.

6. **Art style** — I'll generate 5 sample images in the flat vector style and send them for approval before doing the full batch.

7. **Session length tuning** — Start with 4-6 rounds per session, adjust based on Lucy's actual attention span.

---

## Success Criteria (unchanged)

MVP is successful if:
- Lucy voluntarily opens it and plays for 2-3 minutes
- She can pick the right picture from 2 options after a few sessions
- Will and Lucy enjoy it as a shared activity
- It works offline on the tablet

---

## What Changed from v1

| Area | v1 | v2 (this) |
|------|-----|-----------|
| Audio library | Raw Web Audio / HTML5 | Howler.js (iOS unlock, sprites) |
| Storage | localStorage | IndexedDB with schema versioning |
| Wrong-answer feedback | Shake animation | Fade to boring (no reward) |
| Unlock logic | 3 correct in a row | Rolling window of 15, ≥70%, guessing detection |
| Cache strategy | "Cache everything" | Budgeted: ≤30MB MVP, progressive loading |
| i18n | Mentioned as future | Architected now (locale field, content dirs) |
| Parent gate | Long press corner | Three-finger tap + hold |
| Letters on screen | Always shown | Configurable (parent toggle) |
| Content format | TypeScript interfaces | JSON manifests in `content/` directory |
| Repo | Standalone | Monorepo (`sites/lucy-phonics/`) |
| Primary objective | Mixed | Explicit: phoneme discrimination first |
| Session duration | Timer-based | Content queue (natural endpoint) |

---

*Spec v2 — revised with Gemini + GPT feedback. Ready for Will's final review.*
