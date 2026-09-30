import { defineConfig, presetUno, presetIcons, presetAttributify, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500,600,700',
        mono: 'Fira Code:400,600',
      },
    }),
  ],
  shortcuts: [
    ['btn', 'px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 select-none'],
    ['btn-primary', 'btn bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 shadow-sm hover:shadow'],
    ['btn-secondary', 'btn bg-neutral-800 text-neutral-100 hover:bg-neutral-700 active:scale-95 border border-neutral-700'],
    ['card', 'p-6 rounded-xl bg-neutral-900/60 border border-neutral-800 backdrop-blur shadow-lg'],
  ],
})
