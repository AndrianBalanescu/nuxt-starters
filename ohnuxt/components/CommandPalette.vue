<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted, type Component } from 'vue'
import { 
  Search, 
  Sparkles, 
  Sun, 
  Palette, 
  Plus, 
  Minus, 
  RotateCcw, 
  Copy, 
  Zap, 
  SlidersHorizontal,
  Layout, 
  Terminal,
  Activity,
  Layers,
  Settings
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const toast = useToast()
const counter = useCounterStore()
const { copy } = useClipboard()

const search = ref('')
const selectedIndex = ref(0)
const paletteDialogRef = ref<HTMLDialogElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

interface CommandAction {
  id: string
  title: string
  section: string
  shortcut?: string
  icon: Component
  run: () => void
}

const allActions: CommandAction[] = [
  // Theme Controls
  { id: 'theme-toggle-face', title: 'Toggle Light / Dark Face', section: 'Appearance', icon: Sun, shortcut: 'T L', run: () => { themeStore.toggleLook(); close() } },
  { id: 'theme-glass', title: 'Set Theme: Glass', section: 'Appearance', icon: Sparkles, run: () => { themeStore.theme = 'glass'; close() } },
  { id: 'theme-neutral', title: 'Set Theme: Neutral', section: 'Appearance', icon: Layers, run: () => { themeStore.theme = 'neutral'; close() } },
  { id: 'theme-neu', title: 'Set Theme: Neubrutalism', section: 'Appearance', icon: Layout, run: () => { themeStore.theme = 'neu'; close() } },
  { id: 'theme-term', title: 'Set Theme: Terminal Glow', section: 'Appearance', icon: Terminal, run: () => { themeStore.theme = 'term'; close() } },
  { id: 'theme-oled', title: 'Set Theme: OLED Pure Black', section: 'Appearance', icon: Activity, run: () => { themeStore.theme = 'oled'; close() } },

  // Palettes
  { id: 'pal-indigo', title: 'Set Palette: Indigo (Default)', section: 'Palette', icon: Palette, run: () => { themeStore.palette = 'indigo'; close() } },
  { id: 'pal-ember', title: 'Set Palette: Ember Orange', section: 'Palette', icon: Palette, run: () => { themeStore.palette = 'ember'; close() } },
  { id: 'pal-forest', title: 'Set Palette: Forest Green', section: 'Palette', icon: Palette, run: () => { themeStore.palette = 'forest'; close() } },
  { id: 'pal-mono', title: 'Set Palette: Monochrome', section: 'Palette', icon: Palette, run: () => { themeStore.palette = 'mono'; close() } },

  // Navigation
  { id: 'nav-dash', title: 'Go to Dashboard', section: 'Navigation', icon: Layout, run: () => { navigateTo('/'); close() } },
  { id: 'nav-comp', title: 'Go to Component Showcase', section: 'Navigation', icon: Layers, run: () => { navigateTo('/components'); close() } },
  { id: 'nav-cust', title: 'Go to Design Customizer', section: 'Navigation', icon: SlidersHorizontal, run: () => { navigateTo('/customizer'); close() } },
  { id: 'nav-sett', title: 'Go to Settings', section: 'Navigation', icon: Settings, run: () => { navigateTo('/settings'); close() } },

  // View & Mode
  { id: 'view-focus', title: 'Toggle Focus Canvas (Hide/Show Sidebar)', section: 'View', icon: Sparkles, shortcut: 'F M', run: () => { themeStore.toggleFocusMode(); toast.info(themeStore.focusMode ? 'Focus Canvas Enabled' : 'Sidebar Restored'); close() } },

  // Pinia Actions
  { id: 'pinia-inc', title: 'Increment Pinia Counter (+1)', section: 'State', icon: Plus, run: () => { counter.increment(); toast.success(`Counter is now ${counter.count}`); close() } },
  { id: 'pinia-dec', title: 'Decrement Pinia Counter (-1)', section: 'State', icon: Minus, run: () => { counter.decrement(); toast.info(`Counter is now ${counter.count}`); close() } },
  { id: 'pinia-rst', title: 'Reset Pinia Counter (0)', section: 'State', icon: RotateCcw, run: () => { counter.reset(); toast.info('Counter reset'); close() } },

  // Utilities
  { id: 'util-copy-css', title: 'Copy Generated :root CSS', section: 'Actions', icon: Copy, run: () => { copy(themeStore.generatedCss); toast.success('Copied CSS overrides!'); close() } },
  { id: 'util-modal', title: 'Open Example Modal Dialog', section: 'Actions', icon: Sparkles, run: () => { themeStore.isDemoModalOpen = true; close() } },
  { id: 'util-toast', title: 'Trigger Test Notification Toast', section: 'Actions', icon: Zap, run: () => { toast.success('Raycast command triggered successfully!'); close() } },
  { id: 'util-reset', title: 'Reset All Token Defaults', section: 'Actions', icon: RotateCcw, run: () => { themeStore.resetDefaults(); toast.info('Defaults restored.'); close() } }
]

const filteredActions = computed(() => {
  if (!search.value.trim()) return allActions
  const q = search.value.toLowerCase()
  return allActions.filter(a => 
    a.title.toLowerCase().includes(q) || 
    a.section.toLowerCase().includes(q)
  )
})

watch(filteredActions, () => {
  selectedIndex.value = 0
})

watch(() => themeStore.isCommandPaletteOpen, (isOpen) => {
  if (isOpen) {
    search.value = ''
    selectedIndex.value = 0
    nextTick(() => {
      paletteDialogRef.value?.showModal()
      searchInputRef.value?.focus()
    })
  } else {
    paletteDialogRef.value?.close()
  }
})

function close() {
  themeStore.isCommandPaletteOpen = false
}

function handleKeydown(e: KeyboardEvent) {
  if (!themeStore.isCommandPaletteOpen) return

  if (e.key === 'Escape') {
    close()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (filteredActions.value.length > 0) {
      selectedIndex.value = (selectedIndex.value + 1) % filteredActions.value.length
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (filteredActions.value.length > 0) {
      selectedIndex.value = (selectedIndex.value - 1 + filteredActions.value.length) % filteredActions.value.length
    }
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const target = filteredActions.value[selectedIndex.value]
    if (target) {
      target.run()
    }
  }
}

function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    themeStore.isCommandPaletteOpen = !themeStore.isCommandPaletteOpen
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
  // ohno.js skips ALL of its palette machinery for data-palette-managed
  // dialogs (no duplicate ⌘K binding), but its notch search button still
  // calls this hook — expose ours so that entry point keeps working.
  const el = paletteDialogRef.value as
    | (HTMLDialogElement & { _ohnoOpenPalette?: () => void })
    | null
  if (el) el._ohnoOpenPalette = openViaHook
})

function openViaHook() {
  themeStore.isCommandPaletteOpen = true
}

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<template>
  <dialog 
    ref="paletteDialogRef" 
    class="palette" 
    data-palette-managed
    @cancel="close"
    @click.self="close"
    @keydown="handleKeydown"
  >
    <div class="palette-content">
      <!-- Search Bar -->
      <div class="palette-search">
        <Search :size="16" style="color: var(--o-text-3);" />
        <input 
          ref="searchInputRef"
          v-model="search" 
          class="palette-input" 
          placeholder="Type a command or search actions… (↑ ↓ navigate, ↵ select)" 
          autocomplete="off"
          spellcheck="false"
        >
        <kbd class="palette-kbd">ESC</kbd>
      </div>

      <!-- Actions List -->
      <div class="palette-list">
        <div v-if="filteredActions.length === 0" class="palette-empty">
          No commands found for "{{ search }}"
        </div>

        <template v-else>
          <div 
            v-for="(action, idx) in filteredActions" 
            :key="action.id"
            class="palette-item"
            :class="{ 'is-selected': selectedIndex === idx }"
            @click="action.run()"
            @mouseenter="selectedIndex = idx"
          >
            <component :is="action.icon" :size="16" class="action-icon" />
            <div class="action-details">
              <span class="action-title">{{ action.title }}</span>
              <span class="action-section">{{ action.section }}</span>
            </div>
            <kbd v-if="action.shortcut" class="palette-kbd">{{ action.shortcut }}</kbd>
          </div>
        </template>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.palette-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.palette-empty {
  padding: 24px;
  text-align: center;
  color: var(--o-text-3);
  font-size: 13px;
}

.action-icon {
  flex-shrink: 0;
  color: var(--o-text-2);
}

.palette-item.is-selected .action-icon {
  color: var(--o-accent);
}

.action-details {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
}

.action-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--o-text);
}

.action-section {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--o-text-3);
}

.palette-kbd {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--o-surface-2);
  border: 1px solid var(--o-border);
  color: var(--o-text-2);
  font-family: var(--o-font-mono, monospace);
}
</style>
