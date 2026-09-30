<script setup lang="ts">
import { computed } from 'vue'

const themeStore = useThemeStore()

useSeoMeta({
  title: 'Nuxt 3 · ohno Starter Pack',
  description: 'Ultra-lightweight, classless-first Nuxt 3 starter with live token customizer, command palette, and Pinia stores.',
  ogTitle: 'Nuxt 3 · ohno Starter Pack',
  ogDescription: 'Zero config clutter, full semantic design system.'
})

// Only load webfonts when a non-system font family is active.
const fontLinks = computed(() => {
  if (themeStore.font === 'system') return []
  const families: string[] = []
  if (themeStore.font === 'inter') families.push('family=Inter:wght@400;500;600')
  if (themeStore.font === 'mono') families.push('family=JetBrains+Mono:wght@400;500')
  if (themeStore.font === 'bricolage') families.push('family=Bricolage+Grotesque:opsz,wght@12..96,400..700')
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' as const },
    { rel: 'stylesheet', href: `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap` }
  ]
})

useHead(() => ({
  link: [
    ...fontLinks.value
  ],
  script: [
    { src: '/ohno.js', defer: true }
  ]
}))

// Nuxt swaps route DOM on SPA navigation; re-assert the data-* attrs and
// inline CSS vars (theme/look/palette/contrast/density) that ohno.js wrote
// so custom settings don't flash back to defaults between pages.
const nuxtApp = useNuxtApp()
if (import.meta.client) {
  nuxtApp.hook('page:finish', () => {
    themeStore.applyToDom()
  })
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
