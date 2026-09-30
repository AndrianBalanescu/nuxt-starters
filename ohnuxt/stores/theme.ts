import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'

export type Theme = 'neutral' | 'glass' | 'neu' | 'term' | 'oled'
export type Look = 'dark' | 'light'
export type Palette = 'indigo' | 'ember' | 'forest' | 'mono'
export type Contrast = 'low' | 'med' | 'high'
export type Density = 'dense' | 'regular' | 'large'
export type FontFamily = 'system' | 'inter' | 'mono' | 'bricolage'

export const fontMap: Record<FontFamily, string> = {
  system: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  inter: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
  bricolage: "'Bricolage Grotesque', system-ui, sans-serif"
}

export const paletteBaseColors: Record<Palette, string> = {
  indigo: '#7174d4',
  ember: '#f97316',
  forest: '#10b981',
  mono: '#888888'
}

export const useThemeStore = defineStore('theme', () => {
  // ---- storage-key unification -------------------------------------
  // ohno.js persists `ohno-*` (hyphen); this store historically used
  // `ohno_*` (snake), so theme changes made in one system were invisible to
  // the other. Copy legacy snake values over once, then drop them so both
  // sides read/write the same entries. (`ohno_font` stays snake on purpose:
  // ohno.js owns `ohno-font` for a different value — the font JSON map.)
  if (typeof localStorage !== 'undefined') {
    for (const k of ['theme', 'look', 'palette', 'contrast', 'density']) {
      try {
        const modern = `ohno-${k}`
        const legacy = `ohno_${k}`
        const legacyValue = localStorage.getItem(legacy)
        if (legacyValue !== null && localStorage.getItem(modern) === null) {
          localStorage.setItem(modern, legacyValue)
        }
        if (legacyValue !== null) localStorage.removeItem(legacy)
      } catch {
        // storage unavailable (private mode / disabled) — defaults apply
      }
    }
  }

  // `initOnMounted: true` is the real VueUse option for "read persisted
  // values after hydration" (the previous `{ immediate: false }` was ignored
  // — not a useStorage option — and the hand-rolled onMounted re-read that
  // compensated for it has been removed).

  // Core presets
  const theme = useStorage<Theme>('ohno-theme', 'glass', undefined, { initOnMounted: true, writeDefaults: false })
  const look = useStorage<Look>('ohno-look', 'dark', undefined, { initOnMounted: true, writeDefaults: false })
  const palette = useStorage<Palette>('ohno-palette', 'indigo', undefined, { initOnMounted: true, writeDefaults: false })
  const contrast = useStorage<Contrast>('ohno-contrast', 'med', undefined, { initOnMounted: true, writeDefaults: false })
  const density = useStorage<Density>('ohno-density', 'regular', undefined, { initOnMounted: true, writeDefaults: false })
  const font = useStorage<FontFamily>('ohno_font', 'system', undefined, { initOnMounted: true, writeDefaults: false })
  const notch = useStorage<boolean>('ohno_notch', true, undefined, { initOnMounted: true, writeDefaults: false })
  const focusMode = useStorage<boolean>('ohno_focus_mode', false, undefined, { initOnMounted: true, writeDefaults: false })

  // Sliders & Scales
  const radiusScale = useStorage<number>('ohno_radius_scale', 100, undefined, { initOnMounted: true, writeDefaults: false })
  const spaceScale = useStorage<number>('ohno_space_scale', 100, undefined, { initOnMounted: true, writeDefaults: false })
  const borderWidth = useStorage<number>('ohno_border_width', 1, undefined, { initOnMounted: true, writeDefaults: false })
  const chroma = useStorage<number>('ohno_chroma', 100, undefined, { initOnMounted: true, writeDefaults: false })
  const shadowScale = useStorage<number>('ohno_shadow_scale', 100, undefined, { initOnMounted: true, writeDefaults: false })
  const speed = useStorage<number>('ohno_speed_ms', 150, undefined, { initOnMounted: true, writeDefaults: false })

  // Custom Color Hex Overrides (optional)
  const customAccent = useStorage<string>('ohno_custom_accent', '', undefined, { initOnMounted: true, writeDefaults: false })
  const customOnAccent = useStorage<string>('ohno_custom_on_accent', '', undefined, { initOnMounted: true, writeDefaults: false })
  const customBg = useStorage<string>('ohno_custom_bg', '', undefined, { initOnMounted: true, writeDefaults: false })
  const customSuccess = useStorage<string>('ohno_custom_success', '', undefined, { initOnMounted: true, writeDefaults: false })
  const customWarning = useStorage<string>('ohno_custom_warning', '', undefined, { initOnMounted: true, writeDefaults: false })
  const customDanger = useStorage<string>('ohno_custom_danger', '', undefined, { initOnMounted: true, writeDefaults: false })

  // View state
  const isCommandPaletteOpen = ref(false)
  const isDemoModalOpen = ref(false)

  // Active Effective Accent Color
  const effectiveAccent = computed(() => {
    const raw = customAccent.value || paletteBaseColors[palette.value] || '#7174d4'
    if (chroma.value === 100) return raw
    return `color-mix(in srgb, ${raw} ${chroma.value}%, #808080)`
  })

  // Single source of truth for every inline override var applyToDom() writes.
  // [name, value | null] - null clears the inline override so the stylesheet
  // default applies. generatedCss exports the same entries, so the customizer
  // copy action can never drift from what is actually applied to the DOM.
  function overrideVars(): Array<[string, string | null]> {
    const out: Array<[string, string | null]> = []

    // Accent Modulation (Chroma + Custom Accent)
    if (customAccent.value || chroma.value !== 100) {
      const acc = effectiveAccent.value
      out.push(['--o-accent', acc])
      out.push(['--o-accent-hover', `color-mix(in srgb, ${acc} 85%, black)`])
      out.push(['--o-accent-soft', `color-mix(in srgb, ${acc} 15%, transparent)`])
    } else {
      out.push(['--o-accent', null], ['--o-accent-hover', null], ['--o-accent-soft', null])
    }

    out.push(['--o-on-accent', customOnAccent.value || null])
    out.push(['--o-bg', customBg.value || null])
    out.push(['--o-green', customSuccess.value || null])
    out.push(['--o-yellow', customWarning.value || null])
    out.push(['--o-red', customDanger.value || null])

    // Border Width & Radius
    out.push(['--o-bw', `${borderWidth.value}px`])
    const rFactor = radiusScale.value / 100
    out.push(['--o-r-sm', `${4 * rFactor}px`])
    out.push(['--o-r-md', `${8 * rFactor}px`])
    out.push(['--o-r-lg', `${12 * rFactor}px`])

    // Spacing
    const sFactor = spaceScale.value / 100
    out.push(['--o-s2', `${8 * sFactor}px`])
    out.push(['--o-s3', `${12 * sFactor}px`])
    out.push(['--o-s4', `${16 * sFactor}px`])

    // Shadows
    const s = shadowScale.value / 100
    out.push(['--o-shadow-sm', `0 ${Math.round(1 * s)}px ${Math.round(2 * s)}px rgba(0,0,0,${(0.1 * s).toFixed(2)})`])
    out.push(['--o-shadow-md', `0 ${Math.round(4 * s)}px ${Math.round(12 * s)}px rgba(0,0,0,${(0.15 * s).toFixed(2)})`])
    out.push(['--o-shadow-lg', `0 ${Math.round(10 * s)}px ${Math.round(25 * s)}px rgba(0,0,0,${(0.25 * s).toFixed(2)})`])

    // Speed & Font
    out.push(['--o-speed', `${(speed.value / 1000).toFixed(2)}s`])
    out.push(['--o-font-sans', fontMap[font.value]])
    return out
  }

  function applyToDom() {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    root.setAttribute('data-theme', theme.value)
    root.setAttribute('data-look', look.value)
    root.setAttribute('data-palette', palette.value)
    root.setAttribute('data-contrast', contrast.value)
    root.setAttribute('data-density', density.value)

    for (const [name, value] of overrideVars()) {
      if (value === null) root.style.removeProperty(name)
      else root.style.setProperty(name, value)
    }
  }

  function toggleLook() {
    look.value = look.value === 'dark' ? 'light' : 'dark'
  }

  function toggleFocusMode() {
    focusMode.value = !focusMode.value
  }

  // Single reactive DOM sync path: coalesced to one apply per animation frame,
  // so slider drags never rewrite CSS variables more than once per frame.
  let rafPending = false
  if (typeof window !== 'undefined') {
    watch(
      [
        theme,
        look,
        palette,
        contrast,
        density,
        font,
        notch,
        radiusScale,
        spaceScale,
        borderWidth,
        chroma,
        shadowScale,
        speed,
        customAccent,
        customOnAccent,
        customBg,
        customSuccess,
        customWarning,
        customDanger
      ],
      () => {
        if (rafPending) return
        rafPending = true
        requestAnimationFrame(() => {
          rafPending = false
          applyToDom()
        })
      },
      { immediate: true }
    )
  }

  function clearCustomColors() {
    customAccent.value = ''
    customOnAccent.value = ''
    customBg.value = ''
    customSuccess.value = ''
    customWarning.value = ''
    customDanger.value = ''
    chroma.value = 100
  }

  function resetDefaults() {
    theme.value = 'glass'
    look.value = 'dark'
    palette.value = 'indigo'
    contrast.value = 'med'
    density.value = 'regular'
    font.value = 'system'
    radiusScale.value = 100
    spaceScale.value = 100
    borderWidth.value = 1
    chroma.value = 100
    shadowScale.value = 100
    speed.value = 150
    notch.value = true
    focusMode.value = false
    clearCustomColors()
  }

  // Mirror of the inline overrides applyToDom() writes, exported as a paste-
  // ready `:root` block (source: overrideVars() — same code path as apply).
  const generatedCss = computed(() => {
    const vars = overrideVars()
      .filter((entry): entry is [string, string] => entry[1] !== null)
      .map(([name, value]) => `  ${name}: ${value};`)
    return [
      `/* ohnuxt theme export — theme=${theme.value} look=${look.value} palette=${palette.value} contrast=${contrast.value} density=${density.value} */`,
      `/* html attributes: data-theme="${theme.value}" data-look="${look.value}" data-palette="${palette.value}" data-contrast="${contrast.value}" data-density="${density.value}" */`,
      ':root {',
      ...vars,
      '}',
    ].join('\n')
  })

  return {
    theme,
    look,
    palette,
    contrast,
    density,
    font,
    notch,
    focusMode,
    radiusScale,
    spaceScale,
    borderWidth,
    chroma,
    shadowScale,
    speed,
    customAccent,
    customOnAccent,
    customBg,
    customSuccess,
    customWarning,
    customDanger,
    isCommandPaletteOpen,
    isDemoModalOpen,
    effectiveAccent,
    generatedCss,
    applyToDom,
    toggleLook,
    toggleFocusMode,
    clearCustomColors,
    resetDefaults
  }
})
