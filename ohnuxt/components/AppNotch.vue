<script setup lang="ts">
import { ref, h, defineAsyncComponent } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { 
  Palette as PaletteIcon,
  Search, 
  Menu, 
  Copy, 
  RotateCcw, 
  Sparkles,
  Sun,
  Moon 
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const toast = useToast()
const { copy } = useClipboard()
const ThemeCustomizer = defineAsyncComponent(() => import('~/components/ThemeCustomizer.vue'))
const CustomizerPlaceholder = () => h('div', { style: 'width:320px;height:240px;' })

const isAppearanceOpen = ref(false)
const isMenuOpen = ref(false)
const notchRef = ref<HTMLElement | null>(null)

onClickOutside(notchRef, () => {
  isAppearanceOpen.value = false
  isMenuOpen.value = false
})

function toggleAppearance() {
  isAppearanceOpen.value = !isAppearanceOpen.value
  isMenuOpen.value = false
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  isAppearanceOpen.value = false
}

function handleCopyCss() {
  const tokens = ['--o-accent', '--o-bg', '--o-text', '--o-bw', '--o-r-md', '--o-speed']
  const lines = tokens
    .map(t => `  ${t}: ${getComputedStyle(document.documentElement).getPropertyValue(t).trim()};`)
    .filter(l => !l.endsWith(': ;'))
  copy(`:root {\n${lines.join('\n')}\n}`)
  toast.success('Active :root CSS copied to clipboard!')
  isMenuOpen.value = false
}

function handleReset() {
  themeStore.resetDefaults()
  toast.info('Theme reset to defaults.')
  isMenuOpen.value = false
}
</script>

<template>
  <aside 
    v-if="themeStore.notch" 
    ref="notchRef" 
    class="hardware-notch" 
    aria-label="Quick controls notch"
  >
    <!-- Left Inverted Notch Ear -->
    <span class="notch-ear notch-ear-left"></span>

    <!-- Notch Core Container -->
    <div class="notch-core">
      <!-- 🎨 1. THEME & APPEARANCE ICON BUTTON -->
      <div style="position: relative;">
        <button
          class="btn btn-ghost btn-icon btn-sm notch-icon-btn"
          :class="{ 'is-active': isAppearanceOpen }"
          @click="toggleAppearance"
          aria-label="Appearance and Token Customizer"
          data-tip="Appearance & Token Customizer"
          data-pos="bottom"
        >
          <PaletteIcon :size="13" />
        </button>

        <!-- EMBEDDED MODULAR THEME CUSTOMIZER PANEL -->
        <div v-if="isAppearanceOpen" class="appearance-panel-wrapper">
          <ThemeCustomizer
            @close="isAppearanceOpen = false"
            :placeholder="CustomizerPlaceholder"
          />
        </div>
      </div>

      <!-- 🔍 2. ⌘K COMMAND PALETTE ICON BUTTON -->
      <button
        class="btn btn-ghost btn-icon btn-sm notch-icon-btn"
        @click="themeStore.isCommandPaletteOpen = true"
        aria-label="Open Command Palette"
        data-tip="Command Palette (⌘K)"
        data-pos="bottom"
      >
        <Search :size="13" />
      </button>

      <!-- ☰ 3. BURGER MENU ICON BUTTON -->
      <div style="position: relative;">
        <button
          class="btn btn-ghost btn-icon btn-sm notch-icon-btn"
          :class="{ 'is-active': isMenuOpen }"
          @click="toggleMenu"
          aria-label="Quick Actions Menu"
          data-tip="Quick Actions Menu"
          data-pos="bottom"
        >
          <Menu :size="13" />
        </button>

        <!-- BURGER MENU POPOVER -->
        <div v-if="isMenuOpen" class="notch-popover notch-popover-right">
          <div class="popover-heading">Quick Actions</div>
          <button class="popover-btn" @click="handleCopyCss">
            <span class="row" style="align-items: center; gap: 6px;">
              <Copy :size="12" />
              <span>Copy :root CSS</span>
            </span>
          </button>
          <button class="popover-btn" @click="themeStore.toggleLook(); isMenuOpen = false">
            <span class="row" style="align-items: center; gap: 6px;">
              <Moon v-if="themeStore.look === 'light'" :size="12" />
              <Sun v-else :size="12" />
              <span>Toggle Dark/Light Face</span>
            </span>
          </button>
          <button class="popover-btn" @click="themeStore.toggleFocusMode(); isMenuOpen = false">
            <span class="row" style="align-items: center; gap: 6px;">
              <Sparkles :size="12" />
              <span>{{ themeStore.focusMode ? 'Exit Focus Canvas' : 'Toggle Focus Canvas' }}</span>
            </span>
          </button>
          <button class="popover-btn" @click="themeStore.isDemoModalOpen = true; isMenuOpen = false">
            <span class="row" style="align-items: center; gap: 6px;">
              <Sparkles :size="12" />
              <span>Open Modal</span>
            </span>
          </button>
          <button class="popover-btn" @click="handleReset">
            <span class="row" style="align-items: center; gap: 6px;">
              <RotateCcw :size="12" />
              <span>Reset Defaults</span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Right Inverted Notch Ear -->
    <span class="notch-ear notch-ear-right"></span>
  </aside>
</template>

<style scoped>
.hardware-notch {
  position: fixed;
  top: 0;
  top: env(safe-area-inset-top, 0px); /* mobile: clear the OS status bar; desktop env() = 0px (flush, QA-02 assert intact) */
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999 !important;
  display: inline-flex;
  align-items: flex-start;
  user-select: none;
}

/* Central Notch Body hanging down from top edge */
.notch-core {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 28px;
  padding: 0 8px;
  background: var(--o-surface-2, #1a1a1e) !important;
  color: var(--o-text) !important;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-left: 1px solid var(--o-border);
  border-right: 1px solid var(--o-border);
  border-bottom: 1px solid var(--o-border);
  border-top: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
}

/* Inverted Corner Ears for Real Hardware Cutout Look */
.notch-ear {
  width: 8px;
  height: 8px;
  position: relative;
  overflow: hidden;
}

.notch-ear-left::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 16px;
  height: 16px;
  border-top-right-radius: 8px;
  box-shadow: 4px -4px 0 0 var(--o-surface-2, #1a1a1e);
}

.notch-ear-right::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 16px;
  height: 16px;
  border-top-left-radius: 8px;
  box-shadow: -4px -4px 0 0 var(--o-surface-2, #1a1a1e);
}

.notch-icon-btn {
  /* 24x24 minimum: WCAG 2.5.8 target size (was 22x22) */
  height: 24px !important;
  width: 24px !important;
  padding: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: var(--o-r-sm, 4px) !important;
  color: var(--o-text-2) !important;
  transition: all 0.15s ease !important;
}

.notch-icon-btn:hover,
.notch-icon-btn.is-active {
  color: var(--o-text) !important;
  background: var(--o-surface-3, rgba(255, 255, 255, 0.1)) !important;
}

/* Popover Panel Wrapper */
.appearance-panel-wrapper {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 340px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--o-border);
  border-radius: var(--o-r-lg, 12px);
  z-index: 999999 !important;
  animation: popIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes popIn {
  from { opacity: 0; transform: translate(-50%, -6px) scale(0.97); }
  to { opacity: 1; transform: translate(-50%, 0) scale(1); }
}

.notch-popover {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 170px;
  padding: 4px;
  background: var(--o-bg) !important;
  color: var(--o-text) !important;
  opacity: 1 !important;
  border: 1px solid var(--o-border-2, var(--o-border));
  border-radius: var(--o-r-md, 8px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--o-border);
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 999999 !important;
}

.notch-popover-right {
  left: auto;
  right: 0;
}

.popover-heading {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--o-text-3);
  padding: 4px 6px 2px;
}

.popover-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 8px;
  border-radius: var(--o-r-sm, 4px);
  background: transparent;
  border: none;
  color: var(--o-text);
  font-size: 11px;
  text-align: left;
  cursor: pointer;
}

.popover-btn:hover {
  background: var(--o-surface-2);
  color: var(--o-accent-text);
}
</style>
