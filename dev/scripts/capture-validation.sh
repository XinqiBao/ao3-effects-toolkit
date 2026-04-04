#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ARTIFACTS="$ROOT/artifacts"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT="${1:-4173}"

mkdir -p "$ARTIFACTS"

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$ROOT" >/tmp/ao3-envelope-server.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT

sleep 1

"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,2600 \
  --screenshot="$ARTIFACTS/index-home.png" \
  "http://127.0.0.1:$PORT/dev/"

"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1600,3400 \
  --screenshot="$ARTIFACTS/validation-states.png" \
  "http://127.0.0.1:$PORT/dev/validation.html"

echo "Saved screenshots to $ARTIFACTS"
