# Recording Session Plan — Phase 2 & 3

**Created:** 2026-02-20 (Friday)  
**Status:** Verified against actual files on disk. Previous reports undercounted your recordings (said ~30, actual is 53). This document is the source of truth.

**What's done:** Phase 1 is 100% complete. You recorded 53 files total — 6 phonemes, 30 words, 6 intros, 8 instructions, 3 UI sounds. All images for all 3 phases are done.

**What's left:** 84 recordings below (2 sessions, ~30 min each).

---

## Setup

- Zoom H6, same as Phase 1
- Save as WAV/MP3
- Naming: `{letter}-{word}.mp3` for words, `{letter}.mp3` for phonemes, `intro-{letter}.mp3` for intros

---

## Session 1: Phase 2 (i, d, h, b, k, e)

### Phonemes (6 recordings)

- [ ] `i.mp3` — the /i/ sound (as in "it")
- [ ] `d.mp3` — the /d/ sound
- [ ] `h.mp3` — the /h/ sound
- [ ] `b.mp3` — the /b/ sound
- [ ] `k.mp3` — the /k/ sound
- [ ] `e.mp3` — the /e/ sound (as in "egg")

### Introductions (6 recordings)

- [ ] `intro-i.mp3` — "This is the ih sound"
- [ ] `intro-d.mp3` — "This is the duh sound"
- [ ] `intro-h.mp3` — "This is the huh sound"
- [ ] `intro-b.mp3` — "This is the buh sound"
- [ ] `intro-k.mp3` — "This is the kuh sound"
- [ ] `intro-e.mp3` — "This is the eh sound"

### Words (30 recordings)

**/ i /** 
- [ ] `i-fish.mp3`
- [ ] `i-pig.mp3`
- [ ] `i-sit.mp3`
- [ ] `i-bin.mp3`
- [ ] `i-zip.mp3`

**/ d /**
- [ ] `d-dog.mp3`
- [ ] `d-duck.mp3`
- [ ] `d-door.mp3`
- [ ] `d-drum.mp3`
- [ ] `d-dig.mp3`

**/ h /**
- [ ] `h-hat.mp3`
- [ ] `h-hand.mp3`
- [ ] `h-house.mp3`
- [ ] `h-horse.mp3`
- [ ] `h-hill.mp3`

**/ b /**
- [ ] `b-ball.mp3`
- [ ] `b-bed.mp3`
- [ ] `b-bus.mp3`
- [ ] `b-box.mp3`
- [ ] `b-bird.mp3`

**/ k /**
- [ ] `k-cat.mp3`
- [ ] `k-cup.mp3`
- [ ] `k-kite.mp3`
- [ ] `k-king.mp3`
- [ ] `k-cake.mp3`

**/ e /**
- [ ] `e-egg.mp3`
- [ ] `e-elephant.mp3`
- [ ] `e-pen.mp3`
- [ ] `e-bed.mp3`
- [ ] `e-red.mp3`

**Session 1 total: 42 recordings**

---

## Session 2: Phase 3 (r, o, g, l, f, u)

### Phonemes (6 recordings)

- [ ] `r.mp3` — the /r/ sound
- [ ] `o.mp3` — the /o/ sound (as in "octopus")
- [ ] `g.mp3` — the /g/ sound
- [ ] `l.mp3` — the /l/ sound
- [ ] `f.mp3` — the /f/ sound
- [ ] `u.mp3` — the /u/ sound (as in "umbrella")

### Introductions (6 recordings)

- [ ] `intro-r.mp3` — "This is the rrr sound"
- [ ] `intro-o.mp3` — "This is the oh sound"
- [ ] `intro-g.mp3` — "This is the guh sound"
- [ ] `intro-l.mp3` — "This is the lll sound"
- [ ] `intro-f.mp3` — "This is the fff sound"
- [ ] `intro-u.mp3` — "This is the uh sound"

### Words (30 recordings)

**/ r /**
- [ ] `r-rain.mp3`
- [ ] `r-robot.mp3`
- [ ] `r-rocket.mp3`
- [ ] `r-rabbit.mp3`
- [ ] `r-ring.mp3`

**/ o /**
- [ ] `o-octopus.mp3`
- [ ] `o-orange.mp3`
- [ ] `o-otter.mp3`
- [ ] `o-ostrich.mp3`
- [ ] `o-olive.mp3`

**/ g /**
- [ ] `g-goat.mp3`
- [ ] `g-guitar.mp3`
- [ ] `g-grapes.mp3`
- [ ] `g-ghost.mp3`
- [ ] `g-gorilla.mp3`

**/ l /**
- [ ] `l-lion.mp3`
- [ ] `l-lemon.mp3`
- [ ] `l-leaf.mp3`
- [ ] `l-ladybug.mp3`
- [ ] `l-lamp.mp3`

**/ f /**
- [ ] `f-fish.mp3`
- [ ] `f-flower.mp3`
- [ ] `f-frog.mp3`
- [ ] `f-fire.mp3`
- [ ] `f-feather.mp3`

**/ u /**
- [ ] `u-umbrella.mp3`
- [ ] `u-unicorn.mp3`
- [ ] `u-up.mp3`
- [ ] `u-underwear.mp3`
- [ ] `u-umpire.mp3`

**Session 2 total: 42 recordings**

---

## After Recording

Drop the files into the lucy-phonics repo:
- Phonemes → `public/audio/phonemes/`
- Words → `public/audio/words/`
- Intros → `public/audio/introductions/`

Tell any agent "recordings are in, wire them up" — they can run the audit script and see what's new.

---

## Blog Post Note

**The overhang angle:** The code cost collapsed to near zero — an AI built the entire app overnight. The blocker is irreducibly human: Will wants Lucy to hear her father's voice, not TTS. The last mile of personalized education isn't computational, it's emotional. This is the pattern across all the avenues — the technology exists, the gap is human adoption/action.

See also: `ASSET-AUDIT.md` in this repo, `memory/2026-02-20.md` in the martha repo.
