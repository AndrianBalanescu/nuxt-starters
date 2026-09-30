<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  RotateCcw, 
  Plus, 
  Minus, 
  Search, 
  PanelRight, 
  Sliders, 
  Sparkles,
} from 'lucide-vue-next'

const counter = useCounterStore()
const toast = useToast()
const themeStore = useThemeStore()

// State for Polymorphic Panel!
const isSidePanelOpen = ref(false)
const isBottomDrawerOpen = ref(false)
const searchFilter = ref('')

interface ProbeRow {
  name: string
  region: string
  latency: string
  status: 'online' | 'syncing' | 'degraded'
  uptime: string
}

const probes = ref<ProbeRow[]>([
  { name: 'auth-gateway-edge', region: 'us-east-1', latency: '14.2 ms', status: 'online', uptime: '99.99%' },
  { name: 'db-replica-frankfurt', region: 'eu-central-1', latency: '22.8 ms', status: 'online', uptime: '99.95%' },
  { name: 'cdn-worker-singapore', region: 'ap-east-1', latency: '68.4 ms', status: 'syncing', uptime: '99.80%' },
  { name: 'background-job-queue', region: 'us-west-2', latency: '28.1 ms', status: 'online', uptime: '100.0%' },
])

const filteredProbes = computed(() => {
  if (!searchFilter.value.trim()) return probes.value
  const q = searchFilter.value.toLowerCase()
  return probes.value.filter(p => p.name.includes(q) || p.region.includes(q))
})

useSeoMeta({
  title: 'Dashboard · Nuxt 3 + ohno Starter',
  description: 'Production-ready dashboard with live KPI metrics, side panels, and bottom drawers.'
})
</script>

<template>
  <div class="col" style="gap: var(--o-s4);">
    
    <!-- Top Header Banner -->
    <header class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
      <div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">System Overview</h1>
        <p class="caption" style="margin: 2px 0 0;">
          Real-time metrics, polymorphic overlay panels, and state hydration.
        </p>
      </div>

      <div class="row" style="gap: 8px;">
        <!-- Side Panel Trigger -->
        <button class="btn btn-outline btn-sm" @click="isSidePanelOpen = true">
          <PanelRight :size="13" style="margin-right: 4px;" />
          Side Panel
        </button>

        <!-- Bottom Drawer Trigger -->
        <button class="btn btn-subtle btn-sm" @click="isBottomDrawerOpen = true">
          <Sliders :size="13" style="margin-right: 4px;" />
          Bottom Sheet
        </button>

        <!-- Command Palette Trigger -->
        <button class="btn btn-primary btn-sm" @click="themeStore.isCommandPaletteOpen = true">
          <Sparkles :size="13" style="margin-right: 4px;" />
          ⌘K Commands
        </button>
      </div>
    </header>

    <!-- KPI STAT CARDS IN A CSS GRID -->
    <section class="kpi-grid" aria-label="Key Performance Indicators">
      
      <!-- STAT CARD 1: Pinia Counter -->
      <DataStatCard 
        label="Pinia Reactive Count" 
        :value="counter.count" 
        badge-text="State"
        badge-variant="accent"
      >
        <template #footer>
          <span class="caption">Double: {{ counter.doubleCount }}</span>
          <div class="row" style="gap: 4px;">
            <button class="btn btn-sm btn-ghost" @click="counter.decrement()" title="Decrement">
              <Minus :size="12" />
            </button>
            <button class="btn btn-sm btn-primary" @click="counter.increment()" title="Increment">
              <Plus :size="12" />
            </button>
            <button class="btn btn-sm btn-subtle" @click="counter.reset()" title="Reset">
              <RotateCcw :size="12" />
            </button>
          </div>
        </template>
      </DataStatCard>

      <!-- STAT CARD 2: P95 Latency -->
      <DataStatCard 
        label="Edge Latency (P95)" 
        value="18.4 ms" 
        badge-text="Optimal"
        badge-variant="success"
        caption="Global 12-region distribution"
      />

      <!-- STAT CARD 3: Active Theme -->
      <ClientOnly>
      <DataStatCard
        label="Design Look"
        :value="themeStore.theme"
        :badge-text="themeStore.look.toUpperCase()"
        badge-variant="accent"
      >
        <template #footer>
          <span class="caption">Palette: {{ themeStore.palette }}</span>
          <button class="btn btn-sm btn-subtle" @click="themeStore.toggleLook()">Toggle Face</button>
        </template>
      </DataStatCard>
      </ClientOnly>

      <!-- STAT CARD 4: Uptime SLA -->
      <DataStatCard 
        label="30-Day SLA Uptime" 
        value="99.98%" 
        badge-text="Passed"
        badge-variant="success"
      >
        <template #footer>
          <progress class="progress" value="99" max="100" style="width: 100%; margin-top: 4px;"></progress>
        </template>
      </DataStatCard>

    </section>

    <!-- DATA TABLE CARD -->
    <section class="card" style="padding: var(--o-s4);">
      <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <div>
          <div style="font-weight: 700; font-size: 14px;">Live Edge Probe Health</div>
          <span class="caption">Real-time status checks across global synthetic nodes</span>
        </div>

        <div class="input-box" style="max-width: 220px;">
          <span class="icon-left">
            <Search :size="13" />
          </span>
          <input class="input" style="height: 28px; font-size: 11px;" v-model="searchFilter" placeholder="Filter node or region…" aria-label="Filter node or region">
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>Probe Node</th>
              <th>Region</th>
              <th>Latency</th>
              <th>Status</th>
              <th>30-Day SLA</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="probe in filteredProbes" :key="probe.name">
              <td style="font-weight: 600;">{{ probe.name }}</td>
              <td><code>{{ probe.region }}</code></td>
              <td>{{ probe.latency }}</td>
              <td>
                <span 
                  class="badge" 
                  :class="probe.status === 'online' ? 'badge-success' : (probe.status === 'syncing' ? 'badge-accent' : 'badge-danger')"
                >
                  <span class="badge-dot"></span>{{ probe.status }}
                </span>
              </td>
              <td>{{ probe.uptime }}</td>
              <td style="text-align: right;">
                <button class="btn btn-sm btn-ghost" @click="toast.info(`Inspecting probe ${probe.name}`)">Inspect</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ═══════════════ UNIFIED OVERLAYS PANEL (RIGHT SLIDE-OVER) ═══════════════ -->
    <AppPanel 
      v-model="isSidePanelOpen" 
      position="right"
      title="Node Telemetry Inspector"
      size="460px"
    >
      <div class="col" style="gap: 16px;">
        <p class="caption">
          Polymorphic <code>&lt;AppPanel position="right"&gt;</code> configured as a side panel.
        </p>

        <div class="card" style="padding: 14px;">
          <strong style="font-size: 13px;">Selected Region: us-east-1</strong>
          <div class="stat-row" style="margin-top: 8px;">
            <div class="caption">Ingest: 1,420 req/s</div>
            <div class="caption">Egress: 84 MB/s</div>
          </div>
        </div>

        <ThemeCustomizer :compact="true" :show-actions="false" />
      </div>

      <template #footer>
        <button class="btn btn-ghost btn-sm" @click="isSidePanelOpen = false">Close</button>
        <button class="btn btn-primary btn-sm" @click="toast.success('Settings applied'); isSidePanelOpen = false">
          Save Changes
        </button>
      </template>
    </AppPanel>

    <!-- ═══════════════ UNIFIED OVERLAYS PANEL (BOTTOM SHEET) ═══════════════ -->
    <AppPanel 
      v-model="isBottomDrawerOpen" 
      position="bottom"
      title="Quick Diagnostic Bottom Sheet"
      size="65vh"
    >
      <div class="col" style="gap: 14px;">
        <p class="caption">
          The same polymorphic <code>&lt;AppPanel position="bottom"&gt;</code> configured as a bottom sheet.
        </p>

        <div class="kpi-grid">
          <DataStatCard label="Memory" value="482 MB" badge-text="Normal" badge-variant="success" />
          <DataStatCard label="Event Loop" value="0.4 ms" badge-text="Healthy" badge-variant="success" />
          <DataStatCard label="Active Tasks" value="142" badge-text="Optimal" badge-variant="accent" />
        </div>

        <div class="row" style="justify-content: flex-end; gap: 8px;">
          <button class="btn btn-sm btn-outline" @click="toast.info('Diagnostics run completed')">Run Full Probe</button>
        </div>
      </div>
    </AppPanel>

  </div>
</template>
