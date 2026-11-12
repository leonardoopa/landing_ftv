#!/bin/sh
# Prepara o vídeo do hero para avançar frame a frame com o scroll.
# Uso: coloque o original em frontend/public/assets/hero-source.mp4 e rode:
#   sh scripts/prepare-video.sh
# Gera hero.mp4 (todo frame é keyframe = seek instantâneo, sem áudio) e hero.jpg (poster).
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)/frontend/public/assets"
SRC="${1:-hero-source.mp4}"
[ -f "$DIR/$SRC" ] || { echo "Não achei $DIR/$SRC"; exit 1; }

ff() { docker run --rm -v "$DIR:/w" linuxserver/ffmpeg:latest "$@"; }

ff -y -i "/w/$SRC" -an -vf "scale=-2:'min(1280,ih)',fps=30" -c:v libx264 -preset slow -crf 23 \
   -g 1 -pix_fmt yuv420p -movflags +faststart /w/hero.mp4
ff -y -i /w/hero.mp4 -frames:v 1 -q:v 3 /w/hero.jpg
echo "Pronto. Agora: docker compose up -d --build"
