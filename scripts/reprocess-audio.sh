#!/usr/bin/env zsh
# Reprocess Will's raw AIF recordings → properly normalised MP3s
# The previous processing truncated files. Raw AIFs are intact.

SCRIPT_DIR="${0:a:h}"
RAW_DIR="${SCRIPT_DIR}/../assets/audio/raw"
OUT_BASE="${SCRIPT_DIR}/../assets/audio"

# Mapping: "number:output_path"
MAPPINGS=(
  "1:phonemes/m.mp3"
  "2:phonemes/s.mp3"
  "3:phonemes/a.mp3"
  "4:phonemes/t.mp3"
  "5:phonemes/p.mp3"
  "6:phonemes/n.mp3"
  "7:words/m-moon.mp3"
  "8:words/m-monkey.mp3"
  "9:words/m-map.mp3"
  "10:words/m-mouse.mp3"
  "11:words/m-milk.mp3"
  "12:words/s-snake.mp3"
  "13:words/s-sun.mp3"
  "14:words/s-sock.mp3"
  "15:words/s-star.mp3"
  "16:words/s-snail.mp3"
  "17:words/a-apple.mp3"
  "18:words/a-ant.mp3"
  "19:words/a-cat.mp3"
  "20:words/a-hat.mp3"
  "21:words/a-bat.mp3"
  "22:words/t-tent.mp3"
  "23:words/t-tiger.mp3"
  "24:words/t-tree.mp3"
  "25:words/t-train.mp3"
  "26:words/t-turtle.mp3"
  "27:words/p-pig.mp3"
  "28:words/p-pan.mp3"
  "29:words/p-penguin.mp3"
  "30:words/p-pink.mp3"
  "31:words/p-puppy.mp3"
  "32:words/n-nose.mp3"
  "33:words/n-nut.mp3"
  "34:words/n-nest.mp3"
  "35:words/n-net.mp3"
  "36:words/n-nap.mp3"
  "37:instructions/can-you-find.mp3"
  "38:instructions/tap-to-hear.mp3"
  "39:instructions/listen.mp3"
  "40:instructions/well-done.mp3"
  "41:instructions/thats-it.mp3"
  "42:instructions/brilliant.mp3"
  "43:instructions/lets-try-another.mp3"
  "44:instructions/all-done.mp3"
  "45:introductions/intro-m.mp3"
  "46:introductions/intro-s.mp3"
  "47:introductions/intro-a.mp3"
  "48:introductions/intro-t.mp3"
  "49:introductions/intro-p.mp3"
  "50:introductions/intro-n.mp3"
)

PROCESSED=0
FAILED=0

for entry in "${MAPPINGS[@]}"; do
  num="${entry%%:*}"
  outpath="${entry#*:}"

  # Find exact match: "NUM " or "NUM[" at start of filename (not NUM0, NUM1, etc.)
  rawfile=""
  for candidate in "$RAW_DIR"/*.aif; do
    basename_c="${candidate:t}"
    # Extract the number prefix (everything before first space or bracket)
    filenum="${basename_c%% *}"
    filenum="${filenum%%\[*}"
    if [[ "$filenum" == "$num" ]]; then
      rawfile="$candidate"
      break
    fi
  done

  if [[ -z "$rawfile" ]]; then
    echo "⚠️  Missing raw file for #${num} → ${outpath}"
    FAILED=$((FAILED + 1))
    continue
  fi

  outfull="${OUT_BASE}/${outpath}"
  mkdir -p "$(dirname "$outfull")"

  # Normalise to -16 LUFS, convert to MP3 128kbps mono
  # No silence removal — Will's Zoom H6 recordings are already trimmed
  if ffmpeg -y -i "$rawfile" \
    -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
    -ar 44100 -ac 1 -b:a 128k \
    "$outfull" 2>/dev/null; then
    duration=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$outfull" 2>/dev/null)
    echo "✅ #${num} → ${outpath} (${duration}s)"
    PROCESSED=$((PROCESSED + 1))
  else
    echo "❌ ffmpeg failed for #${num} → ${outpath}"
    FAILED=$((FAILED + 1))
  fi
done

echo ""
echo "Done: ${PROCESSED} processed, ${FAILED} failed"
