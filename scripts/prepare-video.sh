#!/bin/sh
# Prepara o vídeo do hero para avançar frame a frame com o scroll e sobe o site de novo.
# Uso (na raiz do projeto):
#   sh scripts/prepare-video.sh /caminho/do/video.mp4
# Sem argumento, usa frontend/public/assets/hero-source.mp4.
# Gera hero.mp4 (todo frame é keyframe = seek instantâneo, sem áudio) e hero.jpg (poster).
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$ROOT/frontend/public/assets"

if [ -n "$1" ]; then
  [ -f "$1" ] || { echo "Arquivo não encontrado: $1"; exit 1; }
  cp "$1" "$DIR/hero-source.mp4"
fi
[ -f "$DIR/hero-source.mp4" ] || { echo "Passe o caminho do vídeo: sh scripts/prepare-video.sh /caminho/do/video.mp4"; exit 1; }

ff() { docker run --rm -v "$DIR:/w" linuxserver/ffmpeg:latest "$@"; }

ff -y -i /w/hero-source.mp4 -an -vf "scale=-2:'min(1280,ih)',fps=30" -c:v libx264 -preset slow -crf 23 \
   -g 1 -pix_fmt yuv420p -movflags +faststart /w/hero.mp4
ff -y -i /w/hero.mp4 -frames:v 1 -q:v 3 /w/hero.jpg

cd "$ROOT" && docker compose up -d --build
echo "Pronto: http://localhost:8000"
