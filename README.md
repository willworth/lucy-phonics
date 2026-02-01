# Lucy Phonics — Learn to Read

A touch-based phonics app for Lucy (age 3, bilingual English/Spanish) running on iPhone.

## The Goal

Help Lucy learn to read using evidence-based synthetic phonics — sounds first, not letter names. Smart introduction order. No confusing abstractions. Just a three-year-old tapping things on a phone and learning that marks on a screen are sounds, and sounds make words.

## Technical Approach: PWA (Progressive Web App)

**Why PWA, not a native app:**
- No App Store, no Apple Developer account needed
- Add to iPhone home screen → looks and feels like an app
- Works offline (service worker caches everything)
- Touch-first by design
- Will can build and host it himself (fits in the monorepo or standalone)
- Easy to iterate — push changes, Lucy gets them next time she opens it

**Stack (recommended):**
- Vite + React (or plain HTML/JS — simplicity wins)
- Web Audio API for letter sounds
- Touch events (big tap targets, swipe gestures)
- Service worker for offline support
- Hosted anywhere (Vercel, own server, even localhost tunneled)

## Phonics Methodology

### Synthetic Phonics (UK approach, post-Rose Review 2006)

The gold standard for early reading. Core principles:

1. **Sounds (phonemes), not letter names.** The letter 'b' is /b/ not "bee". The letter 's' is /s/ not "ess". Letter names come later — they confuse early readers.

2. **Introduction order matters.** Start with letters that let you build words quickly:
   - **Group 1:** s, a, t, p, i, n → makes: sat, pin, tap, nap, pan, sit, tip, tan, ant, etc.
   - **Group 2:** c/k, e, h, r, m, d
   - **Group 3:** g, o, u, l, f, b
   - **Group 4:** j, z, w, v, y, x
   - **Group 5:** digraphs — sh, ch, th, ng, ai, ee, etc.
   (This is the Jolly Phonics order — widely validated)

3. **Blending from day one.** As soon as Lucy knows s, a, t → she blends "sat". Reading = blending sounds. Not memorising whole words.

4. **Common confusions to address early:**
   - b / d (mirror pair — the big one)
   - p / q (mirror pair)
   - m / n (similar sounds)
   - Strategy: introduce them far apart in sequence, then explicitly contrast later

### Bilingual Consideration (English + Spanish)

Lucy is bilingual. Spanish phonics is much more regular (near 1:1 letter-sound mapping).
English is the hard one. Options:
- **Start with English phonics** (harder, benefits from early start)
- **Spanish phonics in parallel** (reinforces the concept, builds confidence)
- **Don't mix in the same session** (keep language contexts separate)

This needs research — Will may have views from the PDF resources.

## App Design Principles (for a 3-year-old)

- **Giant touch targets.** Minimum 80px, ideally 120px+
- **No text instructions.** Audio + visual only. She can't read yet (that's the point).
- **Immediate audio feedback.** Tap a letter → hear the sound instantly
- **Short sessions.** 3-5 minutes max. Attention span of a 3-year-old is ~5 mins for structured activity.
- **No failure states.** Wrong answer → gentle redirect, not "wrong!" buzzer
- **Celebration for correct.** Subtle — animation, sparkle, happy sound. Not overwhelming.
- **Portrait orientation.** How kids hold phones.
- **No scrolling.** Everything visible on one screen at a time.
- **Chunked progression.** Master 2-3 sounds → unlock blending with those sounds → next sounds

## Activity Types (brainstorm)

### Phase 1: Individual Sounds
- **Sound Introduction:** Big letter appears, plays sound, animated mouth shape
- **Sound Recognition:** "Which one says /s/?" — tap the right letter from 2-3 options
- **Sound Matching:** Hear a sound → tap the letter that makes it

### Phase 2: Blending (after ~6 sounds)
- **Word Building:** Letters appear in sequence, each plays its sound, then blends: s...a...t → "sat"
- **Picture Match:** Hear/see a blended word → tap the matching picture
- **Sound Segmenting:** See a picture (e.g., cat) → tap the sounds in order: /c/ /a/ /t/

### Phase 3: Confusable Pairs
- **b vs d Contrast:** Explicit side-by-side, "this one says /b/, this one says /d/"
- **Sorting Game:** Hear a sound → drag to the correct letter (two options)

## Methodology: Mentava + Jolly Phonics Hybrid

Based on analysis of the Mentava Alphabet Sounds PDF (see `mentava-analysis.md`):

**Phase 1 — Sound Recognition (Mentava):** Introduce sounds one at a time with images.
No reading yet. Build phonemic awareness.

**Phase 2 — Sound Discrimination (Mentava):** Confusable sound pairs (b/d, s/sh, e/i, etc.)
using minimal pairs. This is Mentava's strongest contribution.

**Phase 3 — Readiness Test:** Emoji pair test (🐶🐟 vs 🐟🐶) to check left-to-right
comprehension. If she can't distinguish these, she's not ready for blending.

**Phase 4 — Blending (Jolly Phonics order):** Once ready, introduce s,a,t,p,i,n and
start blending words. This is where Jolly Phonics' ordering is superior.

## Resources

- `Mentava Alphabet Sound.pdf` — 42MB phonics picture book (in this directory)
- `mentava-analysis.md` — Full analysis of methodology, sound order, comparison pairs
- Mentava (company): https://mentava.com
- Jolly Phonics: https://jollylearning.co.uk/
- Letters and Sounds (UK DfE framework): freely available

## Status

- [x] Project directory created
- [x] Initial methodology research (Jolly Phonics)
- [x] Mentava PDF obtained and analysed
- [x] Hybrid methodology defined (Mentava awareness → Jolly Phonics blending)
- [ ] Technical spike: minimal PWA with Phase 1 sounds
- [ ] Audio recording: clean phoneme recordings without schwa (Will's voice ideal)
- [ ] UI/UX wireframes for 3-year-old interaction
- [ ] Prototype: Phase 1 sound recognition (first 6 sounds)

## Open Questions

1. **English first, Spanish first, or parallel?** Will's instinct + PDF resources will guide this
2. **Audio source:** Record Will saying the sounds? TTS? Professional phonics audio clips?
3. **Art style:** Simple illustrations for word-picture matching. Generate? Stock? Minimal?
4. **Progress tracking:** Worth building, or just let Will observe and advance manually?
5. **Where to host:** Vercel (easy), or self-hosted on the Linux box via Tailscale?

---

*Created 2026-02-01. This is a real project, not a side-thought.*
