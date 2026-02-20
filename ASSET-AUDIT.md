# Lucy Phonics — Asset Audit

**Date:** 2026-02-20  
**Audited by:** Grace

## Status

| Asset | Done | Total | Status |
|-------|------|-------|--------|
| **Phase 1 audio** | 36/36 | 36 | ✅ Complete |
| **Phase 2 audio** | 0/36 | 36 | ❌ Not started |
| **Phase 3 audio** | 0/36 | 36 | ❌ Not started |
| **All images** | 90/90 | 90 | ✅ Complete |
| **Instruction audio** | 8 | 8 | ✅ Complete |
| **UI sounds** | 3 | 3 | ✅ Complete |
| **Intro recordings** | 6/6 | 6 | ✅ (Phase 1 only) |

**Total usable audio recorded by Will: 53 files**  
**Audio still needed: 72 recordings** (12 phonemes + 60 words for Phases 2+3)  
**Plus 12 introduction recordings** (intro-i, intro-d, intro-h, etc.)

## What Will Recorded (Phase 1 — Complete)

6 phonemes: /m/, /s/, /a/, /t/, /p/, /n/  
30 words: 5 per phoneme (e.g. sun, snake, sock, star, snail for /s/)  
6 introductions: "This is the mmm sound" etc.  
8 instruction phrases: "well done", "brilliant", "listen", etc.  
3 UI sounds: correct, incorrect, tap  

## What's Needed for Phase 2

12 phonemes to record: /i/, /d/, /h/, /b/, /k/, /e/  
30 words:
- /i/: fish, pig, sit, bin, zip  
- /d/: dog, duck, door, drum, dig  
- /h/: hat, hand, house, horse, hill  
- /b/: ball, bed, bus, box, bird  
- /k/: cat, cup, kite, king, cake  
- /e/: egg, elephant, pen, bed, red  

6 introductions (intro-i, intro-d, intro-h, intro-b, intro-k, intro-e)

## What's Needed for Phase 3

6 phonemes to record: /r/, /o/, /g/, /l/, /f/, /u/  
30 words:
- /r/: rain, robot, rocket, rabbit, ring  
- /o/: octopus, orange, otter, ostrich, olive  
- /g/: goat, guitar, grapes, ghost, gorilla  
- /l/: lion, lemon, leaf, ladybug, lamp  
- /f/: fish, flower, frog, fire, feather  
- /u/: umbrella, unicorn, up, underwear, umpire  

6 introductions (intro-r, intro-o, intro-g, intro-l, intro-f, intro-u)

## Recording Approach

Phase 1 recordings were done with the Zoom H6 and processed. Same approach for Phases 2+3.

**Estimated time:** ~30 min per phase (12 phonemes + 30 words + 6 intros = 48 recordings per phase). So ~1 hour total for both phases.

## Deploy Status

- Phase 1 is **deployable now** — all assets present
- Phase 2+3 could use browser TTS as placeholder until Will records
- Deployment target: S3 + CloudFront (no custom domain needed)
