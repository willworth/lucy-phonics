#!/bin/bash
# Generate all Phase 3 images for Lucy Phonics
# Run this once Gemini API quota resets

set -e
cd ~/code/lucy-phonics

SCRIPT="~/.nvm/versions/node/v24.13.0/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py"
BASE_PROMPT="for a children's phonics app. Thick black outlines, bold saturated colors, flat color fill, white background, centered, cute cartoon style, no text, no shadows"

echo "Starting Phase 3 image generation..."
echo "This will generate 30 images (6 sounds × 5 words each)"
echo ""

# /r/ sound
echo "=== Generating /r/ sound images ==="
uv run $SCRIPT --prompt "A simple flat vector icon of rain (water drops falling from cloud) $BASE_PROMPT" --filename "public/img/sounds/r/rain.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a cute robot $BASE_PROMPT" --filename "public/img/sounds/r/robot.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a space rocket $BASE_PROMPT" --filename "public/img/sounds/r/rocket.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a cute rabbit $BASE_PROMPT" --filename "public/img/sounds/r/rabbit.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a ring (jewelry) $BASE_PROMPT" --filename "public/img/sounds/r/ring.png" --resolution 1K

# /o/ sound
echo "=== Generating /o/ sound images ==="
uv run $SCRIPT --prompt "A simple flat vector icon of an octopus $BASE_PROMPT" --filename "public/img/sounds/o/octopus.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of an orange (fruit) $BASE_PROMPT" --filename "public/img/sounds/o/orange.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a cute otter $BASE_PROMPT" --filename "public/img/sounds/o/otter.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of an ostrich $BASE_PROMPT" --filename "public/img/sounds/o/ostrich.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of an olive $BASE_PROMPT" --filename "public/img/sounds/o/olive.png" --resolution 1K

# /g/ sound
echo "=== Generating /g/ sound images ==="
uv run $SCRIPT --prompt "A simple flat vector icon of a goat $BASE_PROMPT" --filename "public/img/sounds/g/goat.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a guitar $BASE_PROMPT" --filename "public/img/sounds/g/guitar.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of grapes $BASE_PROMPT" --filename "public/img/sounds/g/grapes.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a cute ghost $BASE_PROMPT" --filename "public/img/sounds/g/ghost.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a gorilla $BASE_PROMPT" --filename "public/img/sounds/g/gorilla.png" --resolution 1K

# /l/ sound
echo "=== Generating /l/ sound images ==="
uv run $SCRIPT --prompt "A simple flat vector icon of a lion $BASE_PROMPT" --filename "public/img/sounds/l/lion.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a lemon $BASE_PROMPT" --filename "public/img/sounds/l/lemon.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a leaf $BASE_PROMPT" --filename "public/img/sounds/l/leaf.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a ladybug $BASE_PROMPT" --filename "public/img/sounds/l/ladybug.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a lamp $BASE_PROMPT" --filename "public/img/sounds/l/lamp.png" --resolution 1K

# /f/ sound
echo "=== Generating /f/ sound images ==="
uv run $SCRIPT --prompt "A simple flat vector icon of a fish $BASE_PROMPT" --filename "public/img/sounds/f/fish.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a flower $BASE_PROMPT" --filename "public/img/sounds/f/flower.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a frog $BASE_PROMPT" --filename "public/img/sounds/f/frog.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of fire $BASE_PROMPT" --filename "public/img/sounds/f/fire.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a feather $BASE_PROMPT" --filename "public/img/sounds/f/feather.png" --resolution 1K

# /u/ sound
echo "=== Generating /u/ sound images ==="
uv run $SCRIPT --prompt "A simple flat vector icon of an umbrella $BASE_PROMPT" --filename "public/img/sounds/u/umbrella.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of a unicorn $BASE_PROMPT" --filename "public/img/sounds/u/unicorn.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of an up arrow $BASE_PROMPT" --filename "public/img/sounds/u/up.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of underwear $BASE_PROMPT" --filename "public/img/sounds/u/underwear.png" --resolution 1K
uv run $SCRIPT --prompt "A simple flat vector icon of an umpire $BASE_PROMPT" --filename "public/img/sounds/u/umpire.png" --resolution 1K

echo ""
echo "✅ All 30 images generated!"
echo ""
echo "Next steps:"
echo "1. Review images in public/img/sounds/"
echo "2. Run tests: npx vitest run"
echo "3. Git commit and push"
