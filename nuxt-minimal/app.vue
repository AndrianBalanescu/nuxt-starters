<script setup lang="ts">
useHead({
  title: 'Nuxt Minimal — UnoCSS + Pinia',
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 gap-8">
    <div class="max-w-2xl w-full flex flex-col gap-8">
      <!-- Header -->
      <header class="flex flex-col gap-2">
        <h1 class="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
          Nuxt 3 Minimal Starter
        </h1>
        <p class="text-neutral-400">
          A clean, lean Nuxt 3 boilerplate with <span class="text-emerald-400">UnoCSS</span> and <span class="text-teal-400">Pinia</span>.
        </p>
      </header>

      <!-- Feature Badges -->
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 rounded-full text-xs bg-emerald-950/50 text-emerald-300 border border-emerald-800">Nuxt 3</span>
        <span class="px-3 py-1 rounded-full text-xs bg-teal-950/50 text-teal-300 border border-teal-800">UnoCSS 66</span>
        <span class="px-3 py-1 rounded-full text-xs bg-indigo-950/50 text-indigo-300 border border-indigo-800">Pinia 4</span>
        <span class="px-3 py-1 rounded-full text-xs bg-neutral-900/50 text-neutral-300 border border-neutral-800">Bun</span>
      </div>

      <!-- Counter Card (Pinia Demo) -->
      <main class="card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div class="flex flex-col gap-1">
            <span class="text-sm text-neutral-400 uppercase tracking-wider">Pinia Store Demo</span>
            <div class="flex items-baseline gap-4">
              <span class="text-5xl font-bold tabular-nums text-white">{{ useCounterStore().count }}</span>
              <span class="text-neutral-400 text-sm">× 2 = {{ useCounterStore().doubleCount }}</span>
            </div>
          </div>

          <div class="flex gap-3">
            <button class="btn-secondary" aria-label="Decrement counter" @click="useCounterStore().decrement()">
              <i class="i-lucide-minus" />
            </button>
            <button class="btn-secondary" aria-label="Reset counter" @click="useCounterStore().reset()">
              <i class="i-lucide-rotate-ccw" />
            </button>
            <button class="btn-primary" aria-label="Increment counter" @click="useCounterStore().increment()">
              <i class="i-lucide-plus" />
            </button>
          </div>
        </div>
      </main>

      <!-- UnoCSS Playground -->
      <section class="card">
        <h2 class="text-lg font-semibold text-neutral-200 mb-4 flex items-center gap-2">
          <i class="i-lucide-wand-2 text-emerald-400" />
          UnoCSS Utilities
        </h2>
        <p class="text-sm text-neutral-400 mb-4">
          UnoCSS generates utility classes on the fly. No build step, no bloat.
          Try adding more utilities right in the template!
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Example 1: Flexbox -->
          <div class="p-4 rounded-lg bg-neutral-800/40 border border-neutral-700/50">
            <span class="text-xs font-mono text-emerald-400">flex items-center gap-2</span>
            <div class="mt-2 flex items-center gap-2">
              <div class="w-6 h-6 bg-emerald-500 rounded-full" />
              <div class="w-6 h-6 bg-teal-500 rounded-full" />
              <div class="w-6 h-6 bg-indigo-500 rounded-full" />
            </div>
          </div>

          <!-- Example 2: Animation -->
          <div class="p-4 rounded-lg bg-neutral-800/40 border border-neutral-700/50">
            <span class="text-xs font-mono text-emerald-400">animate-pulse</span>
            <div class="mt-2 w-full h-8 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 rounded animate-pulse" />
          </div>

          <!-- Example 3: Typography -->
          <div class="p-4 rounded-lg bg-neutral-800/40 border border-neutral-700/50">
            <span class="text-xs font-mono text-emerald-400">font-mono text-sm</span>
            <p class="mt-2 font-mono text-sm text-teal-300">
              let hello = 'world'
            </p>
          </div>
        </div>
      </section>
    </div>

    <footer class="text-xs text-neutral-400 mt-4">
      Built with ❤️ by Nuxt + UnoCSS + Pinia
    </footer>
  </div>
</template>

<style>
body {
  margin: 0;
}
</style>
