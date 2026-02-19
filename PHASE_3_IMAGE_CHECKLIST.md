# Phase 3 Image Generation Checklist

**Status:** Content structure complete, images blocked by Gemini API quota

## What's Done ✅
- ✅ Created Phase 3 directories (r/, o/, g/, l/, f/, u/)
- ✅ Added Phase 3 to phases metadata in sounds.json
- ✅ Added all 6 Phase 3 sound entries to sounds.json
- ✅ Updated content.ts to export PHASE_TWO_SOUNDS and PHASE_THREE_SOUNDS
- ✅ Validated JSON structure

## What's Blocked ❌
**Gemini API quota exhausted** - Free tier daily limit reached for `gemini-3-pro-image`

## Images Needed (30 total)

### /r/ sound (5 images)
```bash
# Save to: public/img/sounds/r/
- [ ] rain.png     - Rain drops falling from cloud
- [ ] robot.png    - Cute robot
- [ ] rocket.png   - Space rocket
- [ ] rabbit.png   - Cute rabbit
- [ ] ring.png     - Ring (jewelry)
```

### /o/ sound (5 images)
```bash
# Save to: public/img/sounds/o/
- [ ] octopus.png  - Octopus
- [ ] orange.png   - Orange (fruit)
- [ ] otter.png    - Otter
- [ ] ostrich.png  - Ostrich
- [ ] olive.png    - Olive
```

### /g/ sound (5 images)
```bash
# Save to: public/img/sounds/g/
- [ ] goat.png     - Goat
- [ ] guitar.png   - Guitar
- [ ] grapes.png   - Grapes
- [ ] ghost.png    - Ghost
- [ ] gorilla.png  - Gorilla
```

### /l/ sound (5 images)
```bash
# Save to: public/img/sounds/l/
- [ ] lion.png     - Lion
- [ ] lemon.png    - Lemon
- [ ] leaf.png     - Leaf
- [ ] ladybug.png  - Ladybug
- [ ] lamp.png     - Lamp
```

### /f/ sound (5 images)
```bash
# Save to: public/img/sounds/f/
- [ ] fish.png     - Fish
- [ ] flower.png   - Flower
- [ ] frog.png     - Frog
- [ ] fire.png     - Fire
- [ ] feather.png  - Feather
```

### /u/ sound (5 images)
```bash
# Save to: public/img/sounds/u/
- [ ] umbrella.png  - Umbrella
- [ ] unicorn.png   - Unicorn
- [ ] up.png        - Up arrow
- [ ] underwear.png - Underwear
- [ ] umpire.png    - Umpire
```

## Image Style Requirements (CRITICAL)
- Flat vector/cartoon icon style
- THICK black outlines (3-4px equivalent)
- Bold, saturated, simple colors (no gradients)
- White/off-white background
- Single object, centered, filling frame
- Child-friendly, cute, simple
- Square format: 1024x1024
- PNG format

**Reference existing images:** Check `public/img/sounds/m/` for style match

## Generation Command Template

Once quota resets, use this command for each image:

```bash
cd ~/code/lucy-phonics

uv run ~/.nvm/versions/node/v24.13.0/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py \
  --prompt "A simple flat vector icon of a [OBJECT] for a children's phonics app. Thick black outlines, bold saturated colors, flat color fill, white background, centered, cute cartoon style, no text, no shadows" \
  --filename "public/img/sounds/[letter]/[word].png" \
  --resolution 1K
```

## Next Steps

1. **Wait for quota reset** (~24 hours from last attempt: ~Feb 20 14:40 GMT+1)
2. **Generate all 30 images** using command above
3. **Run tests:** `cd ~/code/lucy-phonics && npx vitest run`
4. **Git commit and push**

## Alternative Options

If quota issues persist:
- Use a different image generation service (DALL-E, Stability AI)
- Commission artwork manually
- Use temporary placeholder images
- Upgrade to paid Gemini API tier
