# Nuxt Minimal — UnoCSS + Pinia Starter

> Lean, high-performance Nuxt 3 starter for agentic development.

## Stack
- **Framework:** Nuxt 3.21
- **CSS:** UnoCSS 66 (Uno, Attributify, Icons, WebFonts presets)
- **State:** Pinia 4
- **Icons:** Lucide (via `@unocss/icons`)
- **Bundler:** Bun

## Quick Start

```bash
# Global alias — works from ANY directory (scaffolds into $PWD/my-new-app):
nux-scaffold my-new-app --lean
cd my-new-app/nuxt-minimal

# Then:
bun install
bun dev          # Start dev server at :3000
bun build        # Production build
bun preview      # Preview production build
```

## Project Structure

```
nuxt-minimal/
├── app.vue              # Entry point (single-file, no pages/ dir)
├── nuxt.config.ts       # Nuxt config (modules: @unocss/nuxt, @pinia/nuxt)
├── uno.config.ts        # UnoCSS config (presets + shortcuts)
├── stores/
│   └── counter.ts       # Demo Pinia store
├── public/
│   └── robots.txt
├── llms.txt             # LLM agent contract
└── AGENTS.md            # This file
```

## UnoCSS Setup

All styling uses UnoCSS utility classes. No custom CSS unless necessary.

### Available Presets
- `presetUno` — Default utility rules
- `presetAttributify` — Class-less utility via attributes (e.g., `<div bg="red/10 text=white">`)
- `presetIcons` — Icon utilities (e.g., `<i class="i-lucide-plus" />`)
- `presetWebFonts` — Google Fonts (Inter, Fira Code)

### Custom Shortcuts (defined in `uno.config.ts`)
- `btn` — Base button layout
- `btn-primary` — Emerald primary variant
- `btn-secondary` — Neutral secondary variant
- `card` — Rounded panel with backdrop blur

### Example Usage
```vue
<template>
  <button class="btn-primary">
    <i class="i-lucide-plus" />
    Add Item
  </button>
  <div class="card p-4">
    <p class="text-lg font-medium">Card content</p>
  </div>
</template>
```

## Pinia Stores

Stores live in `stores/` (auto-imported).

### Example Store (`stores/counter.ts`)
```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() { count.value++ }
  return { count, increment }
})
```

### Usage in Components
```vue
<script setup lang="ts">
const store = useCounterStore()
</script>

<template>
  <div>Count: {{ store.count }}</div>
  <button @click="store.increment()">+1</button>
</template>
```

## Agentic Development Guidelines

1. **Styling:** Use UnoCSS utility classes first. Extend `uno.config.ts` only for repeated patterns.
2. **State:** Add new Pinia stores in `stores/`. Use the Composition API (`defineStore` with setup syntax).
3. **Icons:** Use `<i class="i-lucide-<name>" />` for all icons.
4. **Routing:** This starter uses single-page `app.vue`. Add `pages/` directory if multi-route needed.
5. **TypeScript:** All files should use `lang="ts"` in SFCs.
6. **No Custom CSS:** Prefer utilities. Use `<style>` only for global resets or complex animations.

## LLM Agent Contract

See [`llms.txt`](./llms.txt) for detailed generation rules, constraints, and examples.

## License

MIT
