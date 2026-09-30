<script setup lang="ts">
import { 
  Sun, 
  Moon, 
  RotateCcw, 
  Copy, 
  Sliders, 
  X,
  Type
} from 'lucide-vue-next'
import type { 
  Theme, 
  Palette, 
  Contrast, 
  Density, 
  FontFamily 
} from '~/stores/theme'

withDefaults(
  defineProps<{
    /** Inline embedding: hide the Reset / Copy CSS footer actions */
    showActions?: boolean
    /** Inline embedding: hide the close affordance (no drawer to return to) */
    compact?: boolean
  }>(),
  { showActions: true, compact: false }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const themeStore = useThemeStore()
const toast = useToast()
const { copy } = useClipboard()

function handleCopyCss() {
  copy(themeStore.generatedCss)
  toast.success('Generated :root CSS copied to clipboard!')
  emit('close')
}

function handleReset() {
  themeStore.resetDefaults()
  toast.info('Theme reset to defaults.')
}

const themeTips: Record<Theme, string> = {
  neutral: 'Neutral · Clean unadorned baseline',
  glass: 'Glass · Translucent blur glassmorphism',
  neu: 'Neu · High-contrast neubrutalist borders & shadows',
  term: 'Terminal · Retro phosphor glow & dark canvas',
  oled: 'OLED · Pitch black battery saver & high contrast'
}

const paletteTips: Record<Palette, string> = {
  indigo: 'Indigo · Modern purple accent (#7174d4)',
  ember: 'Ember · Warm electric orange (#f97316)',
  forest: 'Forest · Emerald botanical green (#10b981)',
  mono: 'Mono · Subtle neutral monochrome (#888888)'
}

const contrastTips: Record<Contrast, string> = {
  low: 'Low · Subtle, soft border contrast',
  med: 'Medium · Balanced standard contrast',
  high: 'High · Crisp accessibility contrast'
}

const densityTips: Record<Density, string> = {
  dense: 'Dense · Compact UI spacing & smaller buttons',
  regular: 'Regular · Default spacious comfort padding',
  large: 'Large · Touch-friendly roomy component sizing'
}

const fontTips: Record<FontFamily, string> = {
  system: 'System UI · Native OS font',
  inter: 'Inter · Modern tech sans-serif',
  mono: 'JetBrains Mono · Crisp monospaced code font',
  bricolage: 'Bricolage Grotesque · Expressive editorial sans'
}
</script>

<template>
  <div class="customizer-card" :class="{ 'is-compact': compact }">
    <!-- Header -->
    <div class="customizer-header">
      <div class="row" style="align-items: center; gap: 6px;">
        <Sliders :size="13" style="color: var(--o-accent);" />
        <span style="font-weight: 700; font-size: 12px; letter-spacing: -0.01em;">Design Tokens</span>
      </div>
      <button
        v-if="!compact"
        class="btn btn-ghost btn-icon btn-sm close-btn"
        aria-label="Close appearance customizer"
        data-tip="Close appearance customizer"
        data-pos="left"
        @click="emit('close')"
      >
        <X :size="13" />
      </button>
    </div>

    <!-- Scrollable Body -->
    <div class="customizer-body">
      <!-- 1. FACE (DARK / LIGHT) - 1 ROW 2 PILLS -->
      <div class="panel-group">
        <div class="panel-label">Face (Color Mode)</div>
        <div class="pill-grid grid-2">
          <button
            class="pill-btn"
            :class="{ 'is-active': themeStore.look === 'dark' }"
            data-tip="Switch to Dark appearance"
            data-pos="top"
            @click="themeStore.look = 'dark'"
          >
            <Moon :size="11" />
            <span>Dark</span>
          </button>
          <button
            class="pill-btn"
            :class="{ 'is-active': themeStore.look === 'light' }"
            data-tip="Switch to Light appearance"
            data-pos="top"
            @click="themeStore.look = 'light'"
          >
            <Sun :size="11" />
            <span>Light</span>
          </button>
        </div>
      </div>

      <!-- 2. STRUCTURAL THEME - 1 ROW 5 PILLS -->
      <div class="panel-group">
        <div class="panel-label">Structural Theme</div>
        <div class="pill-grid grid-5">
          <button
            v-for="t in (['neutral', 'glass', 'neu', 'term', 'oled'] as Theme[])"
            :key="t"
            class="pill-btn"
            :class="{ 'is-active': themeStore.theme === t }"
            :data-tip="themeTips[t]"
            data-pos="top"
            @click="themeStore.theme = t"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <!-- 3. ACCENT PALETTE - 1 ROW 4 PILLS -->
      <div class="panel-group">
        <div class="panel-label">Accent Palette</div>
        <div class="pill-grid grid-4">
          <button
            v-for="p in (['indigo', 'ember', 'forest', 'mono'] as Palette[])"
            :key="p"
            class="pill-btn"
            :class="{ 'is-active': themeStore.palette === p }"
            :data-tip="paletteTips[p]"
            data-pos="top"
            @click="themeStore.palette = p"
          >
            <span class="notch-dot" :class="'swatch-' + p"></span>
            <span>{{ p }}</span>
          </button>
        </div>
      </div>

      <!-- 4. CONTRAST - 1 ROW 3 PILLS -->
      <div class="panel-group">
        <div class="panel-label">Contrast</div>
        <div class="pill-grid grid-3">
          <button
            v-for="c in (['low', 'med', 'high'] as Contrast[])"
            :key="c"
            class="pill-btn"
            :class="{ 'is-active': themeStore.contrast === c }"
            :data-tip="contrastTips[c]"
            data-pos="top"
            @click="themeStore.contrast = c"
          >
            {{ c }}
          </button>
        </div>
      </div>

      <!-- 5. DENSITY - 1 ROW 3 PILLS -->
      <div class="panel-group">
        <div class="panel-label">Density</div>
        <div class="pill-grid grid-3">
          <button
            v-for="d in (['dense', 'regular', 'large'] as Density[])"
            :key="d"
            class="pill-btn"
            :class="{ 'is-active': themeStore.density === d }"
            :data-tip="densityTips[d]"
            data-pos="top"
            @click="themeStore.density = d"
          >
            {{ d }}
          </button>
        </div>
      </div>

      <!-- 6. REUSABLE COLOR PICKERS -->
      <div class="panel-group">
        <div class="panel-label">Color Hex Overrides</div>
        <ColorPicker />
      </div>

      <!-- 7. REUSABLE TOKEN SLIDERS -->
      <div class="panel-group">
        <div class="panel-label">Scales & Geometry</div>
        <div class="col" style="gap: 8px;">
          <TokenSlider
            label="Radius Scale"
            v-model="themeStore.radiusScale"
            :min="0"
            :max="200"
            unit="%"
            data-tip="Adjust border radius from sharp 0px to 200% pill corners"
            data-pos="top"

          />
          <TokenSlider
            label="Spacing Scale"
            v-model="themeStore.spaceScale"
            :min="50"
            :max="150"
            unit="%"
            data-tip="Scale global margin and padding tokens (--o-s1 to --o-s6)"
            data-pos="top"

          />
          <TokenSlider
            label="Chroma / Saturation"
            v-model="themeStore.chroma"
            :min="0"
            :max="100"
            unit="%"
            data-tip="Vividness of accent colors from 0% grayscale to 100% full intensity"
            data-pos="top"

          />
          <TokenSlider
            label="Border Width"
            v-model="themeStore.borderWidth"
            :min="0"
            :max="4"
            unit="px"
            data-tip="Stroke thickness for all cards, buttons, and inputs"
            data-pos="top"

          />
          <TokenSlider
            label="Shadow Scale"
            v-model="themeStore.shadowScale"
            :min="0"
            :max="200"
            unit="%"
            data-tip="Depth and opacity of elevation drop shadows"
            data-pos="top"

          />
          <TokenSlider
            label="Animation Speed"
            v-model="themeStore.speed"
            :min="0"
            :max="400"
            :step="25"
            unit="ms"
            data-tip="Transition and micro-interaction duration"
            data-pos="top"

          />
        </div>
      </div>

      <!-- 8. FONT FAMILY - 1 ROW 4 PILLS -->
      <div class="panel-group">
        <div class="panel-label">Typography</div>
        <div class="pill-grid grid-4">
          <button
            v-for="f in (['system', 'inter', 'mono', 'bricolage'] as FontFamily[])"
            :key="f"
            class="pill-btn"
            :class="{ 'is-active': themeStore.font === f }"
            :data-tip="fontTips[f]"
            data-pos="top"
            @click="themeStore.font = f"
          >
            <Type :size="10" />
            <span style="text-transform: capitalize;">{{ f }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div v-if="showActions" class="customizer-footer">
      <button 
        class="btn btn-outline btn-sm footer-btn" 
        data-tip="Reset all design tokens to default glass values"
        data-pos="top"
        @click="handleReset"
      >
        <RotateCcw :size="11" />
        <span>Reset</span>
      </button>
      <button 
        class="btn btn-primary btn-sm footer-btn" 
        data-tip="Copy compiled :root CSS stylesheet to clipboard"
        data-pos="top"
        @click="handleCopyCss"
      >
        <Copy :size="11" />
        <span>Copy CSS</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.customizer-card {
  background: var(--o-bg) !important;
  color: var(--o-text) !important;
  border: 1px solid var(--o-border-2, var(--o-border));
  border-radius: var(--o-r-lg, 12px);
  display: flex;
  flex-direction: column;
  max-height: 82vh;
  box-shadow: var(--o-shadow-lg);
  overflow: hidden;
  user-select: none;
}

.customizer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--o-border);
  background: var(--o-surface-1, var(--o-bg));
  flex-shrink: 0;
}

.close-btn {
  width: 24px !important; /* WCAG 2.5.8 minimum target (was 22) */
  height: 24px !important;
  padding: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.customizer-body {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  flex: 1;
}

.panel-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.panel-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--o-text-3);
}

/* Equal 1-Row Pill Grids */
.pill-grid {
  display: grid;
  gap: 4px;
  width: 100%;
}

.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }
.grid-5 { grid-template-columns: repeat(5, 1fr); }

.pill-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 5px 2px;
  border-radius: var(--o-r-sm, 4px);
  border: 1px solid var(--o-border);
  background: var(--o-surface-1, transparent);
  color: var(--o-text-2);
  font-size: 10.5px;
  font-weight: 600;
  text-transform: capitalize;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.pill-btn:hover {
  background: var(--o-surface-2);
  color: var(--o-text);
  border-color: var(--o-border-2, var(--o-border));
}

.pill-btn.is-active {
  background: var(--o-accent);
  color: var(--o-on-accent, #ffffff);
  border-color: var(--o-accent);
  box-shadow: 0 1px 4px color-mix(in srgb, var(--o-accent) 40%, transparent);
}

.notch-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.swatch-indigo { background: #7174d4; }
.swatch-ember  { background: #f97316; }
.swatch-forest { background: #10b981; }
.swatch-mono   { background: #888888; }

.customizer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid var(--o-border);
  background: var(--o-surface-1, var(--o-bg));
  flex-shrink: 0;
}

.footer-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  font-size: 11px;
}
</style>
