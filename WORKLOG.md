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
