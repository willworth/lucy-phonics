# Assets Guide — What's Needed for Phase 1 MVP

Everything listed here. Check items off as you go.

---

## Images (50 total)

Generate using this prompt template (Gemini, ChatGPT, or whatever has included gen):

> "Simple flat vector illustration of a [OBJECT], thick black outlines, bold solid colors, white background, no shading, no gradients, no texture, childrens educational flashcard style, single object centred"

Save as PNG, 1024×1024. Drop into the folders below.

### /m/ sound — `assets/img/sounds/m/`
- [ ] moon.png
- [ ] monkey.png
- [ ] map.png
- [ ] mouse.png
- [ ] milk.png

### /s/ sound — `assets/img/sounds/s/`
- [ ] snake.png
- [ ] sun.png
- [ ] sock.png
- [ ] star.png
- [ ] snail.png

### /a/ sound — `assets/img/sounds/a/`
- [ ] apple.png
- [ ] ant.png
- [ ] cat.png
- [ ] hat.png
- [ ] bat.png (the animal, not cricket bat — less ambiguous)

### /t/ sound — `assets/img/sounds/t/`
- [ ] tent.png
- [ ] tiger.png
- [ ] tree.png
- [ ] train.png
- [ ] turtle.png

### /p/ sound — `assets/img/sounds/p/`
- [ ] pig.png
- [ ] pan.png (frying pan)
- [ ] penguin.png
- [ ] pink.png (pink paint splash or pink flower)
- [ ] puppy.png

### /n/ sound — `assets/img/sounds/n/`
- [ ] nose.png
- [ ] nut.png (walnut or acorn)
- [ ] nest.png
- [ ] net.png (butterfly net or fishing net)
- [ ] nap.png (child sleeping — might be tricky, could swap for "nine" or "nail")

### Distractor images — `assets/img/distractors/`

These appear as wrong answers in matching games. Pick objects that DON'T start with m, s, a, t, p, or n:

- [ ] dog.png
- [ ] fish.png
- [ ] house.png
- [ ] car.png
- [ ] ball.png
- [ ] duck.png
- [ ] frog.png
- [ ] key.png
- [ ] egg.png
- [ ] cake.png
- [ ] book.png
- [ ] bell.png
- [ ] bed.png
- [ ] cup.png
- [ ] door.png

### UI images — `assets/img/ui/`

- [ ] splash.png (something fun and inviting — animal, sun, whatever Lucy likes)
- [ ] celebration.png (stars, confetti, party — for "all done" screen)
- [ ] ear.png (for the "replay sound" button)
- [ ] star-correct.png (small star/sparkle for correct answer feedback)
- [ ] arrow-next.png (simple forward arrow for parent to advance)

---

## Audio (50 clips)

Full recording script is in `RECORDING-SCRIPT.md`. Summary:

**Equipment:** Zoom H6, quiet room, ~15cm from mic
**Format:** WAV, 44.1kHz (Martha converts to MP3 after)
**Time:** ~15-20 minutes total

### Quick reference

| # | Type | Count |
|---|------|-------|
| 1-6 | Isolated phonemes (/m/, /s/, /a/, /t/, /p/, /n/) | 6 |
| 7-36 | Example words with emphasis (mmmmoon, ssssnake, etc.) | 30 |
| 37-44 | Instruction phrases ("Can you find the...", "Well done!", etc.) | 8 |
| 45-50 | Sound introductions ("This says mmm! Like mmmmoon!") | 6 |

**After recording:** Send WAV files to martha@agentmail.to or scp to server. Martha processes (trim, normalise to -16 LUFS, convert to MP3, build sprite sheet).

### Save audio to — `assets/audio/raw/`

Just dump all WAVs in there, named roughly (e.g., `01-m.wav`, `07-moon.wav`, etc.). Martha will organise.

---

## Folder Structure

Create these directories (or Martha will on the server):

```
assets/
├── audio/
│   └── raw/           ← dump WAV recordings here
├── img/
│   ├── samples/       ← style samples (already done)
│   ├── sounds/
│   │   ├── m/
│   │   ├── s/
│   │   ├── a/
│   │   ├── t/
│   │   ├── p/
│   │   └── n/
│   ├── distractors/
│   └── ui/
```

---

## Priority Order

1. **Images** — Can do right now on your phone/laptop with included AI image gen
2. **Audio** — Next time you've got 20 quiet minutes with the H6
3. **Both can happen in parallel with Claude Code building the app scaffolding**

Once images + audio are in the repo, everything gets wired together.

---

*50 images + 50 audio clips = 100 assets total for Phase 1 MVP*
