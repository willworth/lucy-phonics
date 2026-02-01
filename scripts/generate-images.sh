#!/bin/bash
# Generate all Phase 1 images via OpenAI API
# Run in batches — each image takes ~15-20 seconds
# Usage: bash scripts/generate-images.sh

set -e
cd "$(dirname "$0")/.."

PROMPT_SUFFIX="thick black outlines, bold solid colors, white background, no shading, no gradients, no texture, childrens educational flashcard style, single object centred"

generate() {
  local dir="$1"
  local name="$2"
  local desc="$3"
  
  mkdir -p "$dir"
  if [ -f "$dir/$name.png" ]; then
    echo "SKIP $dir/$name.png (exists)"
    return
  fi
  
  echo "Generating $dir/$name.png ..."
  curl -s https://api.openai.com/v1/images/generations \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d "{
      \"model\": \"gpt-image-1\",
      \"prompt\": \"Simple flat vector illustration of $desc, $PROMPT_SUFFIX\",
      \"n\": 1,
      \"size\": \"1024x1024\",
      \"quality\": \"medium\"
    }" | python3 -c "
import json, sys, base64
resp = json.load(sys.stdin)
if 'data' in resp:
    img = base64.b64decode(resp['data'][0]['b64_json'])
    with open('$dir/$name.png', 'wb') as f:
        f.write(img)
    print(f'  OK ($dir/$name.png, {len(img)} bytes)')
elif 'error' in resp:
    print(f'  ERROR: {resp[\"error\"][\"message\"]}')
else:
    print('  UNKNOWN RESPONSE')
"
}

echo "=== /m/ sound ==="
generate "assets/img/sounds/m" "moon" "a full moon in a dark blue night sky"
generate "assets/img/sounds/m" "monkey" "a cute brown monkey"
generate "assets/img/sounds/m" "map" "a colourful treasure map"
generate "assets/img/sounds/m" "mouse" "a small grey mouse"
generate "assets/img/sounds/m" "milk" "a glass of white milk"

echo "=== /s/ sound ==="
generate "assets/img/sounds/s" "snake" "a green snake coiled up"
generate "assets/img/sounds/s" "sun" "a bright yellow sun with rays"
generate "assets/img/sounds/s" "sock" "a colourful striped sock"
generate "assets/img/sounds/s" "star" "a bright yellow five-pointed star"
generate "assets/img/sounds/s" "snail" "a cute snail with a spiral shell"

echo "=== /a/ sound ==="
generate "assets/img/sounds/a" "apple" "a shiny red apple with a small green leaf"
generate "assets/img/sounds/a" "ant" "a small black ant"
generate "assets/img/sounds/a" "cat" "a friendly orange tabby cat sitting"
generate "assets/img/sounds/a" "hat" "a red baseball cap"
generate "assets/img/sounds/a" "bat" "a cute brown bat with wings spread"

echo "=== /t/ sound ==="
generate "assets/img/sounds/t" "tent" "a red and white camping tent"
generate "assets/img/sounds/t" "tiger" "a friendly orange tiger"
generate "assets/img/sounds/t" "tree" "a green leafy tree"
generate "assets/img/sounds/t" "train" "a colourful toy train"
generate "assets/img/sounds/t" "turtle" "a cute green turtle"

echo "=== /p/ sound ==="
generate "assets/img/sounds/p" "pig" "a cute pink pig"
generate "assets/img/sounds/p" "pan" "a silver frying pan"
generate "assets/img/sounds/p" "penguin" "a black and white penguin"
generate "assets/img/sounds/p" "pink" "a bright pink flower"
generate "assets/img/sounds/p" "puppy" "a cute golden puppy"

echo "=== /n/ sound ==="
generate "assets/img/sounds/n" "nose" "a human nose in profile"
generate "assets/img/sounds/n" "nut" "a brown walnut"
generate "assets/img/sounds/n" "nest" "a birds nest with three blue eggs"
generate "assets/img/sounds/n" "net" "a butterfly net"
generate "assets/img/sounds/n" "nap" "a child sleeping peacefully on a pillow"

echo "=== Distractors ==="
generate "assets/img/distractors" "dog" "a friendly brown dog"
generate "assets/img/distractors" "fish" "an orange goldfish"
generate "assets/img/distractors" "house" "a simple red house with a chimney"
generate "assets/img/distractors" "car" "a red toy car"
generate "assets/img/distractors" "ball" "a colourful beach ball"
generate "assets/img/distractors" "duck" "a yellow rubber duck"
generate "assets/img/distractors" "frog" "a bright green frog"
generate "assets/img/distractors" "key" "a golden key"
generate "assets/img/distractors" "egg" "a white egg"
generate "assets/img/distractors" "cake" "a birthday cake with candles"
generate "assets/img/distractors" "book" "an open colourful book"
generate "assets/img/distractors" "bell" "a golden bell"
generate "assets/img/distractors" "bed" "a cosy bed with a blue blanket"
generate "assets/img/distractors" "cup" "a blue cup of tea"
generate "assets/img/distractors" "door" "a brown wooden door"

echo "=== UI ==="
generate "assets/img/ui" "splash" "a happy sun with a smiling face surrounded by colourful letters"
generate "assets/img/ui" "celebration" "colourful confetti and stars bursting"
generate "assets/img/ui" "ear" "a human ear, simple and clear"
generate "assets/img/ui" "star-correct" "a bright golden sparkle star"
generate "assets/img/ui" "arrow-next" "a simple right-pointing arrow in a circle"

echo ""
echo "=== DONE ==="
echo "Total images:"
find assets/img -name "*.png" | wc -l
