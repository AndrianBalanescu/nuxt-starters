<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Search, 
  Star, 
  PanelRight, 
  Sliders, 
  Sparkles, 
} from 'lucide-vue-next'

const toast = useToast()
const themeStore = useThemeStore()

// State
const textInput = ref('Sample text input')
const searchFilter = ref('')
const selectedRole = ref('editor')
const isNotifications = ref(true)
const planChoice = ref('pro')
const sliderVal = ref(65)
const isLoadingBtn = ref(false)

const isSidePanelOpen = ref(false)
const isBottomDrawerOpen = ref(false)

// Sample Table Data
interface TableRow {
  id: string
  name: string
  role: string
  email: string
  status: 'active' | 'pending' | 'suspended'
  lastSeen: string
}

const tableData = ref<TableRow[]>([
  { id: '1', name: 'Alexandru Popescu', role: 'Architect', email: 'alex@example.com', status: 'active', lastSeen: '2m ago' },
  { id: '2', name: 'Elena Rostova', role: 'Lead Frontend', email: 'elena@example.com', status: 'active', lastSeen: '14m ago' },
  { id: '3', name: 'Marcus Chen', role: 'DevOps Engineer', email: 'marcus@example.com', status: 'pending', lastSeen: '1h ago' },
  { id: '4', name: 'Sarah Jenkins', role: 'QA Automation', email: 'sarah@example.com', status: 'suspended', lastSeen: '2d ago' },
])

const filteredTable = computed(() => {
  if (!searchFilter.value) return tableData.value
  const q = searchFilter.value.toLowerCase()
  return tableData.value.filter(r => 
    r.name.toLowerCase().includes(q) || 
    r.role.toLowerCase().includes(q) ||
    r.email.toLowerCase().includes(q)
  )
})

function triggerLoading() {
  isLoadingBtn.value = true
  setTimeout(() => {
    isLoadingBtn.value = false
    toast.success('Async button action resolved!')
  }, 1200)
}

useSeoMeta({
  title: 'Component Showcase · Nuxt 4 + ohno Starter',
  description: 'Complete suite of reusable buttons, forms, tables, side panels, and bottom sheets.'
})
</script>

<template>
  <div class="col" style="gap: var(--o-s4);">
    
    <!-- Header -->
    <header class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
      <div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Component Showcase</h1>
        <p class="caption" style="margin: 2px 0 0;">
          Pure semantic HTML + ohno tokens. Zero utility bloat.
        </p>
      </div>

      <div class="row" style="gap: 8px;">
        <button class="btn btn-outline btn-sm" @click="isSidePanelOpen = true">
          <PanelRight :size="13" style="margin-right: 4px;" />
          Open Side Panel
        </button>
        <button class="btn btn-subtle btn-sm" @click="isBottomDrawerOpen = true">
          <Sliders :size="13" style="margin-right: 4px;" />
          Open Bottom Sheet
        </button>
        <button class="btn btn-primary btn-sm" @click="themeStore.isDemoModalOpen = true">
          <Sparkles :size="13" style="margin-right: 4px;" />
          Open Modal
        </button>
      </div>
    </header>

    <!-- 1. BUTTONS & CONTROLS -->
    <section class="card" style="padding: var(--o-s4);">
      <div class="row" style="justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--o-border); padding-bottom: 6px; margin-bottom: 12px;">
        <h3 style="margin: 0; font-size: 15px;">1. Buttons &amp; Action Triggers</h3>
        <span class="caption">Styles, loading states, icon buttons</span>
      </div>

      <div class="preview-cluster">
        <button class="btn btn-primary" @click="toast.success('Primary button clicked!')">Primary</button>
        <button class="btn" @click="toast.info('Default button clicked!')">Default</button>
        <button class="btn btn-outline">Outline</button>
        <button class="btn btn-subtle">Subtle</button>
        <button class="btn btn-ghost">Ghost</button>
        <button class="btn btn-danger" @click="toast.error('Danger triggered!')">Danger</button>
        <button class="btn btn-sm">Small</button>
        <button class="btn btn-lg">Large</button>
        <button class="btn btn-icon" title="Favorite">
          <Star :size="13" />
        </button>
        <button 
          class="btn" 
          :class="{ 'is-loading': isLoadingBtn }"
          @click="triggerLoading"
        >
          {{ isLoadingBtn ? 'Processing' : 'Click for Spinner' }}
        </button>
        <button class="btn" disabled>Disabled</button>
      </div>
    </section>

    <!-- 2. BADGES & CHIPS -->
    <section class="card" style="padding: var(--o-s4);">
      <div class="row" style="justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--o-border); padding-bottom: 6px; margin-bottom: 12px;">
        <h3 style="margin: 0; font-size: 15px;">2. Badges, Indicators &amp; Status Pills</h3>
        <span class="caption">Feedback dots and removable tags</span>
      </div>

      <div class="preview-cluster">
        <span class="badge">Default</span>
        <span class="badge badge-accent">Accent</span>
        <span class="badge badge-success"><span class="badge-dot"></span>Active</span>
        <span class="badge badge-warning"><span class="badge-dot"></span>Warning</span>
        <span class="badge badge-danger"><span class="badge-dot"></span>Failed</span>
        
        <span class="chip">nuxt-4 <button type="button" class="chip-remove" @click="toast.info('Removed chip')">×</button></span>
        <span class="chip">ohno-ui <button type="button" class="chip-remove" @click="toast.info('Removed chip')">×</button></span>
        <span class="chip">pinia-store <button type="button" class="chip-remove" @click="toast.info('Removed chip')">×</button></span>

        <kbd>⌘ K</kbd>
        <kbd>Shift + ↵</kbd>
      </div>
    </section>

    <!-- 3. FORMS & INPUTS -->
    <section class="card" style="padding: var(--o-s4);">
      <div class="row" style="justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--o-border); padding-bottom: 6px; margin-bottom: 12px;">
        <h3 style="margin: 0; font-size: 15px;">3. Form Controls &amp; Inputs</h3>
        <span class="caption">Two-way reactive Vue bindings</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
        <div class="field">
          <label class="label">Project Title</label>
          <input class="input" v-model="textInput" placeholder="Enter title…">
          <span class="hint">Active: {{ textInput }}</span>
        </div>

        <div class="field">
          <label class="label">Search Input with Icon</label>
          <div class="input-box">
            <span class="icon-left"><Search :size="13" /></span>
            <input class="input" v-model="searchFilter" placeholder="Filter rows…">
          </div>
        </div>

        <div class="field">
          <label class="label">User Role (Native Classless &lt;select&gt;)</label>
          <select v-model="selectedRole">
            <option value="admin">Administrator</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div class="field">
          <label class="label">User Role (Custom Ohno Select)</label>
          <AppSelect
            v-model="selectedRole"
            :options="[
              { value: 'admin', label: 'Administrator' },
              { value: 'editor', label: 'Editor' },
              { value: 'viewer', label: 'Viewer' }
            ]"
            searchable
          />
        </div>

        <div class="field">
          <label class="label">Validation Error State</label>
          <input class="input is-error" value="invalid-token">
          <span class="error">Bearer prefix required</span>
        </div>
      </div>

      <div class="preview-cluster" style="margin-top: 16px; gap: 24px; flex-wrap: wrap; align-items: center; border-top: 1px solid var(--o-border); padding-top: 14px;">
        <!-- Native & Classless Switch Toggles -->
        <label class="row" style="align-items: center; gap: 8px; cursor: pointer;">
          <input type="checkbox" role="switch" v-model="isNotifications">
          <span style="font-size: 13px; font-weight: 500;">Live Streaming ({{ isNotifications ? 'ON' : 'OFF' }})</span>
        </label>

        <!-- Checkbox -->
        <label class="row" style="align-items: center; gap: 8px; cursor: pointer;">
          <input type="checkbox" checked>
          <span style="font-size: 13px;">Auto-sync records</span>
        </label>

        <!-- Radio Group -->
        <div class="row" style="align-items: center; gap: 12px;">
          <label class="row" style="align-items: center; gap: 6px; cursor: pointer;">
            <input type="radio" name="p_choice" value="free" v-model="planChoice">
            <span style="font-size: 13px;">Free Tier</span>
          </label>
          <label class="row" style="align-items: center; gap: 6px; cursor: pointer;">
            <input type="radio" name="p_choice" value="pro" v-model="planChoice">
            <span style="font-size: 13px;">Pro Tier</span>
          </label>
        </div>

        <!-- Range Slider -->
        <div class="col" style="gap: 4px; min-width: 180px; flex: 1;">
          <div class="row" style="justify-content: space-between; font-size: 11px; font-weight: 600;">
            <span>Volume / Throttle</span>
            <span>{{ sliderVal }}%</span>
          </div>
          <input type="range" min="0" max="100" v-model="sliderVal">
        </div>
      </div>
    </section>

    <!-- 4. DATA TABLE -->
    <section class="card" style="padding: var(--o-s4);">
      <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <div>
          <h3 style="margin: 0; font-size: 15px;">4. Native Data Table</h3>
          <span class="caption">Semantic table with real-time filtering</span>
        </div>

        <input 
          class="input" 
          style="max-width: 200px; height: 26px; font-size: 11px;" 
          v-model="searchFilter" 
          placeholder="Search team…"
        >
      </div>

      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Last Active</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredTable" :key="row.id">
              <td style="font-weight: 600;">{{ row.name }}</td>
              <td><code>{{ row.role }}</code></td>
              <td>{{ row.email }}</td>
              <td>
                <span 
                  class="badge" 
                  :class="row.status === 'active' ? 'badge-success' : (row.status === 'pending' ? 'badge-warning' : 'badge-danger')"
                >
                  <span class="badge-dot"></span>{{ row.status }}
                </span>
              </td>
              <td style="font-size: 11px; color: var(--o-text-3);">{{ row.lastSeen }}</td>
              <td style="text-align: right;">
                <button class="btn btn-sm btn-ghost" @click="toast.info(`Inspected ${row.name}`)">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Polymorphic Side Panel Demo -->
    <AppPanel v-model="isSidePanelOpen" position="right" title="Component Inspector" size="440px">
      <div class="col" style="gap: 12px;">
        <p class="caption">
          Slide-over panel rendered using the single polymorphic <code>&lt;AppPanel position="right"&gt;</code> component.
        </p>
        <ThemeCustomizer :compact="true" :show-actions="false" />
      </div>
    </AppPanel>

    <!-- Polymorphic Bottom Drawer Demo -->
    <AppPanel v-model="isBottomDrawerOpen" position="bottom" title="Mobile &amp; Desktop Bottom Sheet" size="60vh">
      <div class="col" style="gap: 12px;">
        <p class="caption">
          Bottom sheet rendered from the exact same polymorphic <code>&lt;AppPanel position="bottom"&gt;</code> component.
        </p>
        <div class="row" style="justify-content: flex-end; gap: 8px;">
          <button class="btn btn-primary btn-sm" @click="isBottomDrawerOpen = false">Dismiss</button>
        </div>
      </div>
    </AppPanel>

  </div>
</template>
