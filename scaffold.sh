#!/usr/bin/env bash
# ==============================================================================
# scaffold.sh — One-shot starter scaffolder for nuxt-minimal & ohnuxt
#
# Scaffolds into YOUR CURRENT DIRECTORY (not the script's location).
#
# Usage (from any terminal, any cwd):
#   nux-scaffold <project-name> [--lean] [--appkit] [--no-install]
#
#   --lean        Copy nuxt-minimal (Nuxt 3 + UnoCSS + Pinia)
#   --appkit      Copy ohnuxt (Nuxt 3 + ohno UI + Pinia + VueUse)
#   (no flag)     Copy both starters
#   --no-install  Skip the automatic `bun install`
#
# Examples (cwd: ~/Projects/bunijs/laya):
#   nux-scaffold classapp            -> ~/Projects/bunijs/laya/classapp/{nuxt-minimal,ohnuxt}
#   nux-scaffold classapp --lean     -> ~/Projects/bunijs/laya/classapp/nuxt-minimal
# ==============================================================================

set -euo pipefail

# Starters live HERE (fixed source, independent of cwd).
# Overridable via NUX_STARTERS_ROOT for other machines/checkouts.
STARTERS_ROOT="${NUX_STARTERS_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"

require_starter() {
  local dir="$STARTERS_ROOT/$1"
  if [ ! -d "$dir" ]; then
    echo "error: starter '$1' not found at $dir" >&2
    echo "Set NUX_STARTERS_ROOT to the directory containing nuxt-minimal/ and ohnuxt/" >&2
    exit 1
  fi
}

TARGET="${1:-}"

if [ -z "$TARGET" ]; then
  echo "Usage: nux-scaffold <project-name> [--lean] [--appkit] [--no-install]"
  echo "  --lean        nuxt-minimal (Nuxt 3 + UnoCSS + Pinia)"
  echo "  --appkit      ohnuxt (Nuxt 3 + ohno UI + Pinia + VueUse)"
  echo "  (none)        both starters"
  echo "  --no-install  skip bun install"
  echo ""
  echo "Scaffolds into \$PWD/<project-name> (your current directory)."
  exit 1
fi

shift
LEAN=false
APPKIT=false
AUTO_INSTALL=true
for flag in "$@"; do
  case "$flag" in
    --lean)        LEAN=true ;;
    --appkit)      APPKIT=true ;;
    --no-install)  AUTO_INSTALL=false ;;
  esac
done

if [ "$LEAN" = false ] && [ "$APPKIT" = false ]; then
  LEAN=true
  APPKIT=true
fi

# Validate the selected starters BEFORE touching the filesystem — a missing
# starter must not leave a half-created $DEST behind.
if [ "$LEAN" = true ]; then require_starter "nuxt-minimal"; fi
if [ "$APPKIT" = true ]; then require_starter "ohnuxt"; fi

# Resolve target relative to the CURRENT working directory.
# Absolute paths stay absolute; relative paths are anchored at $PWD.
if [[ "$TARGET" = /* ]]; then
  DEST="$TARGET"
else
  DEST="$PWD/$TARGET"
fi
DEST="$(mkdir -p "$DEST" && cd "$DEST" && pwd)"

copy_starter() {
  local src="$STARTERS_ROOT/$1"
  local dest="$DEST/$2"
  echo "Copying $2 -> $dest"
  rsync -a \
    --exclude 'node_modules' \
    --exclude '.nuxt' \
    --exclude '.output' \
    --exclude 'dist' \
    --exclude '.git' \
    "$src/" "$dest"
  echo "  done."
}

if [ "$LEAN" = true ]; then
  require_starter "nuxt-minimal"
  copy_starter "nuxt-minimal" "nuxt-minimal"
fi

if [ "$APPKIT" = true ]; then
  require_starter "ohnuxt"
  copy_starter "ohnuxt" "ohnuxt"
fi

echo ""
echo "Scaffold complete at $DEST"
echo ""

if [ "$AUTO_INSTALL" = true ]; then
  echo "Installing dependencies..."
  for dir in "$DEST"/*/; do
    dir="${dir%/}"
    if [ -f "$dir/package.json" ]; then
      echo "  bun install in $(basename "$dir")"
      (cd "$dir" && bun install > /dev/null 2>&1) || echo "  ! bun install failed in $dir (run it manually)"
    fi
  done
  echo ""
fi

echo "Next steps:"
for dir in "$DEST"/*/; do
  dir="${dir%/}"
  if [ -f "$dir/package.json" ]; then
    echo "  cd $dir && bun dev"
  fi
done