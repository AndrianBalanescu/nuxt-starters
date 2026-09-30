<script setup lang="ts">
import { paletteBaseColors } from '~/stores/theme'

const themeStore = useThemeStore()

// Store defaults are '' = "no override, use the theme fallback", but
// <input type="color"> only accepts #rrggbb — assigning '' makes Chromium
// log `The specified value "" does not conform to the required format`
// once per input. Display a valid hex instead; '' semantics stay intact
// in the store (generatedCss keeps reading `custom* || fallback`).
type CustomKey =
  | 'customAccent'
  | 'customOnAccent'
  | 'customBg'
  | 'customSuccess'
  | 'customWarning'
  | 'customDanger'

const HEX = /^#[0-9a-fA-F]{6}$/
const FALLBACK: Record<Exclude<CustomKey, 'customAccent'>, string> = {
  customOnAccent: '#e4e4e8',
  customBg: '#131316',
  customSuccess: '#4ba97a',
  customWarning: '#cea839',
  customDanger: '#dd696d'
}

function displayValue(key: CustomKey): string {
  const stored = themeStore[key]
  if (HEX.test(stored)) return stored
  if (key === 'customAccent') return paletteBaseColors[themeStore.palette] ?? '#7174d4'
  if (key === 'customBg' && themeStore.look === 'light') return '#9294a4'
  return FALLBACK[key]
}

function pick(key: CustomKey, e: Event) {
  const value = (e.target as HTMLInputElement).value
  if (HEX.test(value)) themeStore[key] = value
}
</script>

<template>
  <div class="color-picker-grid">
    <label class="color-pick-item">
      <input type="color" :value="displayValue('customAccent')" class="color-swatch-input" @input="pick('customAccent', $event)">
      <span class="color-pick-title">Accent</span>
    </label>

    <label class="color-pick-item">
      <input type="color" :value="displayValue('customOnAccent')" class="color-swatch-input" @input="pick('customOnAccent', $event)">
      <span class="color-pick-title">On Accent</span>
    </label>

    <label class="color-pick-item">
      <input type="color" :value="displayValue('customBg')" class="color-swatch-input" @input="pick('customBg', $event)">
      <span class="color-pick-title">Bg</span>
    </label>

    <label class="color-pick-item">
      <input type="color" :value="displayValue('customSuccess')" class="color-swatch-input" @input="pick('customSuccess', $event)">
      <span class="color-pick-title">Success</span>
    </label>

    <label class="color-pick-item">
      <input type="color" :value="displayValue('customWarning')" class="color-swatch-input" @input="pick('customWarning', $event)">
      <span class="color-pick-title">Warn</span>
    </label>

    <label class="color-pick-item">
      <input type="color" :value="displayValue('customDanger')" class="color-swatch-input" @input="pick('customDanger', $event)">
      <span class="color-pick-title">Danger</span>
    </label>
  </div>
</template>

<style scoped>
.color-picker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  background: var(--o-surface-2);
  padding: 8px;
  border-radius: var(--o-r-md, 6px);
  border: 1px solid var(--o-border);
}

.color-pick-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.color-swatch-input {
  width: 24px; /* WCAG 2.5.8 minimum target (was 22) */
  height: 24px;
  padding: 0;
  border: 1px solid var(--o-border);
  border-radius: var(--o-r-sm, 4px);
  background: none;
  cursor: pointer;
}

.color-pick-title {
  font-size: 10px;
  font-weight: 600;
  color: var(--o-text-2);
}
</style>
