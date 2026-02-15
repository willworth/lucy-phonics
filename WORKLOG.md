# Work Log

## 2026-02-01

### 18:00 — Project created
- New private repo: github.com:willworth/lucy-phonics
- Mentava PDF analysed → `mentava-analysis.md`
- README + initial spec written

### 19:00 — Spec v2
- Incorporated Gemini + GPT review feedback
- Key changes: Howler.js, IndexedDB, rolling-window unlock, i18n architecture
- Emailed to Will for review

### 19:30 — Content prep
- `content/en/sounds.json` — Phase 1 data manifest (6 sounds, 30 words)
- `RECORDING-SCRIPT.md` — 50 clips for Will to record on Zoom H6
- `ASSETS-GUIDE.md` — Full asset checklist with folders and prompt template

### 19:58 — Sample images
- Generated 5 sample images via OpenAI API (gpt-image-1): moon, snake, apple, tent, pig
- Flat vector style, thick outlines, white background
- Cost: ~38 cents for 5

### 20:30 — Full image batch
- Generating all ~50 images (30 example words + 15 distractors + 5 UI)
- Batch processing in groups to avoid timeouts
- Estimated cost: ~$4

### Audio prep notes for Will
- Record WAV, 44.1kHz, mono on Zoom H6
- Send raw files — Martha normalises to -16 LUFS, converts to MP3 128kbps mono
- OR if Will wants to pre-process: `ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 44100 -ac 1 -b:a 128k output.mp3`
## Image Generation Run — 2026-02-02 10:19

- 10:19:33 — ✅ assets/img/sounds/m/monkey.png — OK 1233510 bytes (total: 1 generated)
- 10:19:54 — ✅ assets/img/sounds/m/map.png — OK 1113215 bytes (total: 2 generated)
- 10:20:17 — ✅ assets/img/sounds/m/mouse.png — OK 1132135 bytes (total: 3 generated)
- 10:20:39 — ✅ assets/img/sounds/m/milk.png — OK 1029403 bytes (total: 4 generated)
- 10:21:02 — ✅ assets/img/sounds/s/sun.png — OK 1070092 bytes (total: 5 generated)
- 10:21:24 — ✅ assets/img/sounds/s/sock.png — OK 1051704 bytes (total: 6 generated)
- 10:21:44 — ✅ assets/img/sounds/s/star.png — OK 1049895 bytes (total: 7 generated)
- 10:22:05 — ✅ assets/img/sounds/s/snail.png — OK 1181047 bytes (total: 8 generated)
- 10:22:26 — ✅ assets/img/sounds/a/ant.png — OK 1051212 bytes (total: 9 generated)
- 10:22:47 — ✅ assets/img/sounds/a/cat.png — OK 1216978 bytes (total: 10 generated)
- 10:23:11 — ✅ assets/img/sounds/a/hat.png — OK 1215450 bytes (total: 11 generated)
- 10:23:33 — ✅ assets/img/sounds/a/bat.png — OK 1079376 bytes (total: 12 generated)
- 10:23:54 — ✅ assets/img/sounds/t/tiger.png — OK 1111216 bytes (total: 13 generated)
- 10:24:17 — ✅ assets/img/sounds/t/tree.png — OK 1231081 bytes (total: 14 generated)
- 10:24:38 — ✅ assets/img/sounds/t/train.png — OK 1005951 bytes (total: 15 generated)
- 10:24:59 — ✅ assets/img/sounds/t/turtle.png — OK 1302500 bytes (total: 16 generated)
- 10:25:22 — ✅ assets/img/sounds/p/pan.png — OK 1062459 bytes (total: 17 generated)
- 10:25:43 — ✅ assets/img/sounds/p/penguin.png — OK 1005467 bytes (total: 18 generated)
- 10:26:12 — ✅ assets/img/sounds/p/pink.png — OK 1103460 bytes (total: 19 generated)
- 10:26:34 — ✅ assets/img/sounds/p/puppy.png — OK 1090673 bytes (total: 20 generated)
- 10:26:59 — ✅ assets/img/sounds/n/nose.png — OK 1188939 bytes (total: 21 generated)
- 10:27:25 — ✅ assets/img/sounds/n/nut.png — OK 1281326 bytes (total: 22 generated)
- 10:27:44 — ✅ assets/img/sounds/n/nest.png — OK 1054219 bytes (total: 23 generated)
- 10:28:10 — ✅ assets/img/sounds/n/net.png — OK 1130235 bytes (total: 24 generated)
- 10:28:36 — ✅ assets/img/sounds/n/nap.png — OK 1096998 bytes (total: 25 generated)
- 10:28:58 — ✅ assets/img/distractors/dog.png — OK 1170709 bytes (total: 26 generated)
- 10:29:21 — ✅ assets/img/distractors/fish.png — OK 1076217 bytes (total: 27 generated)
- 10:29:45 — ✅ assets/img/distractors/house.png — OK 1060389 bytes (total: 28 generated)
- 10:30:06 — ✅ assets/img/distractors/car.png — OK 1088650 bytes (total: 29 generated)
- 10:30:30 — ✅ assets/img/distractors/ball.png — OK 1066625 bytes (total: 30 generated)
- 10:30:49 — ✅ assets/img/distractors/duck.png — OK 1113230 bytes (total: 31 generated)
- 10:31:10 — ✅ assets/img/distractors/frog.png — OK 1182940 bytes (total: 32 generated)
- 10:31:33 — ✅ assets/img/distractors/key.png — OK 1047704 bytes (total: 33 generated)
- 10:31:53 — ✅ assets/img/distractors/egg.png — OK 1064543 bytes (total: 34 generated)
- 10:32:18 — ✅ assets/img/distractors/cake.png — OK 985148 bytes (total: 35 generated)
- 10:32:39 — ✅ assets/img/distractors/book.png — OK 1034195 bytes (total: 36 generated)
- 10:33:01 — ✅ assets/img/distractors/bell.png — OK 1130371 bytes (total: 37 generated)
- 10:33:24 — ✅ assets/img/distractors/bed.png — OK 1104290 bytes (total: 38 generated)
- 10:33:50 — ✅ assets/img/distractors/cup.png — OK 787231 bytes (total: 39 generated)
- 10:34:15 — ✅ assets/img/distractors/door.png — OK 964761 bytes (total: 40 generated)
- 10:34:39 — ✅ assets/img/ui/splash.png — OK 1253004 bytes (total: 41 generated)
- 10:35:00 — ✅ assets/img/ui/celebration.png — OK 1143950 bytes (total: 42 generated)
- 10:35:21 — ✅ assets/img/ui/ear.png — OK 1065561 bytes (total: 43 generated)
- 10:35:49 — ✅ assets/img/ui/star-correct.png — OK 1003798 bytes (total: 44 generated)
- 10:36:12 — ✅ assets/img/ui/arrow-next.png — OK 976130 bytes (total: 45 generated)
- 10:36:17 — 🏁 COMPLETE — Generated: 45 | Skipped: 5 | Errors: 0

- 10:36:17 — Total images on disk: 55

## 2026-02-15

### 15:20 — KAL-1074 audit implementation pass (Codex)
- Added test/tooling stack: Vitest + coverage, Testing Library, jsdom, fake-indexeddb, ESLint flat config.
- Added 6 test files covering `useProgress`, `useAudio`, `content`, `shuffle`, `SoundMatchPage`, and high-level `App` flow.
- Fixed base URL handling for image/audio asset helpers and replaced hardcoded `/img/...` usages across components/pages.
- Improved audio robustness: overlap protection, preload sequencing, and audio error state with retry UX.
- Added UX updates: 1.8s instruction delay, sound progress indicator (`Sound X of Y`), image fallback card state, session completion summary.
- Extracted app constants into `src/config.ts`; updated PWA `start_url`/`scope` to respect base path.
- Verification passed: `npm run lint`, `npm test`, `npm run build`.

### 16:40 — KAL-1074 follow-up polish pass (Codex)
- Added subtle page transition animation (`.page-transition`) for intro/gallery/match/complete/error views.
- Added discoverable parent entry hint badge (still gated by 3-finger hold).
- Expanded asset validation test to assert full 55 PNG image set and required instruction/intro/UI audio files.
- Added `ImageChoiceCard` fallback regression test for broken image loads.
- Re-ran verification: `npm run lint`, `npm test`, `npm run build` all passed.
