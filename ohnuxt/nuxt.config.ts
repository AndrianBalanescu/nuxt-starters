export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/base.css',
    '~/assets/css/components.css',
    '~/assets/css/customizer.css'
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
        'data-theme': 'glass',
        'data-look': 'dark',
        'data-palette': 'indigo',
        'data-contrast': 'med',
        'data-density': 'regular'
      }
    }
  },
  devtools: {
    enabled: false
  }
})
