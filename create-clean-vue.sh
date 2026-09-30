#!/usr/bin/env bash
set -euo pipefail

# create-clean-vue - Ultra-lightweight Vue 3 + Vite + TypeScript Scaffolder
# Zero config clutter: 1 tsconfig, 1 vite.config, no extra dotfiles.

TARGET_DIR="${1:-}"

if [ -z "$TARGET_DIR" ]; then
  echo "Usage: create-clean-vue <project-name> [--no-install]"
  exit 1
fi

NO_INSTALL=false
if [ "${2:-}" = "--no-install" ]; then
  NO_INSTALL=true
fi

# Refuse to scaffold into an existing non-empty directory — the heredocs
# below would silently overwrite package.json/tsconfig/etc.
if [ -e "$TARGET_DIR" ] && [ -n "$(ls -A "$TARGET_DIR" 2>/dev/null)" ]; then
  echo "Error: '$TARGET_DIR' already exists and is not empty — refusing to overwrite." >&2
  echo "Remove it or pick another name." >&2
  exit 1
fi

mkdir -p "$TARGET_DIR/src"

# 1. package.json
cat << 'EOF' > "$TARGET_DIR/package.json"
{
  "name": "PROJECT_NAME",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@types/node": "^22.13.5",
    "@vitejs/plugin-vue": "^5.2.1",
    "@vue/test-utils": "^2.4.6",
    "happy-dom": "^17.4.2",
    "typescript": "^5.7.3",
    "vite": "^6.2.0",
    "vitest": "^3.0.7",
    "vue-tsc": "^2.2.8"
  }
}
EOF

# Replace PROJECT_NAME with folder name (escape sed replacement
# metacharacters, use '|' so odd but legal names can't break the pattern)
DIR_NAME=$(basename "$TARGET_DIR")
SAFE_NAME=$(printf '%s' "$DIR_NAME" | sed -e 's/[&\\|]/\\&/g')
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s|PROJECT_NAME|$SAFE_NAME|g" "$TARGET_DIR/package.json"
else
  sed -i "s|PROJECT_NAME|$SAFE_NAME|g" "$TARGET_DIR/package.json"
fi

# 2. tsconfig.json (Single unified TypeScript config)
cat << 'EOF' > "$TARGET_DIR/tsconfig.json"
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue", "vite.config.ts"]
}
EOF

# 3. vite.config.ts (Combined Vite + Vitest)
cat << 'EOF' > "$TARGET_DIR/vite.config.ts"
/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true
  }
})
EOF

# 4. index.html
cat << 'EOF' > "$TARGET_DIR/index.html"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
EOF

# 5. src/main.ts
cat << 'EOF' > "$TARGET_DIR/src/main.ts"
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
EOF

# 6. src/App.vue
cat << 'EOF' > "$TARGET_DIR/src/App.vue"
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <main class="container">
    <h1>⚡ Clean Vue 3 Starter</h1>
    <p>Zero config clutter. Just pure Vue + TypeScript.</p>
    <button class="btn" @click="count++">
      Count: {{ count }}
    </button>
  </main>
</template>

<style scoped>
.container {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  color: #2c3e50;
}
.btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  background-color: #42b883;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn:hover {
  background-color: #33a06f;
}
</style>
EOF

# 7. src/App.spec.ts
cat << 'EOF' > "$TARGET_DIR/src/App.spec.ts"
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

describe('App', () => {
  it('renders title and increments counter', async () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Clean Vue 3 Starter')
    expect(wrapper.text()).toContain('Count: 0')
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Count: 1')
  })
})
EOF

# 8. .gitignore (generated projects should never stage deps/build output)
cat << 'EOF' > "$TARGET_DIR/.gitignore"
node_modules
dist
coverage
*.local
.DS_Store
EOF

echo "✨ Created clean Vue project in $TARGET_DIR"

if [ "$NO_INSTALL" = false ]; then
  cd "$TARGET_DIR"
  if command -v bun >/dev/null 2>&1; then
    echo "📦 Installing with Bun..."
    bun install
  elif command -v pnpm >/dev/null 2>&1; then
    echo "📦 Installing with pnpm..."
    pnpm install
  elif command -v npm >/dev/null 2>&1; then
    echo "📦 Installing with npm..."
    npm install
  fi
  echo ""
  echo "🚀 Ready! Start dev server:"
  echo "   cd $TARGET_DIR"
  if command -v bun >/dev/null 2>&1; then
    echo "   bun run dev"
  else
    echo "   npm run dev"
  fi
fi
