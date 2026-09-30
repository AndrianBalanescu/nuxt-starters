<script setup lang="ts">
import { RotateCcw, Copy } from 'lucide-vue-next'

const themeStore = useThemeStore()
const toast = useToast()
const { copy } = useClipboard()

function handleCopyCss() {
  const tokens = ['--o-accent', '--o-bg', '--o-text', '--o-bw', '--o-r-md', '--o-speed']
  const lines = tokens
    .map(t => `  ${t}: ${getComputedStyle(document.documentElement).getPropertyValue(t).trim()};`)
    .filter(l => !l.endsWith(': ;'))
  copy(`:root {\n${lines.join('\n')}\n}`)
  toast.success('Active :root CSS copied to clipboard!')
}

function handleResetAll() {
  themeStore.resetDefaults()
  toast.info('Theme defaults restored.')
}

useSeoMeta({
  title: 'Design Customizer · Nuxt 3 + ohno Starter',
  description: 'Tweak design tokens live on real UI components with Pinia reactivity and zero config clutter.'
})
</script>

<template>
  <div class="col" style="gap: var(--o-s4);">
    <!-- Header -->
    <header class="row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
      <div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Design Token Customizer</h1>
        <p class="caption" style="margin: 2px 0 0;">
          Tweak design tokens live. Changes persist automatically in <code>localStorage</code>.
        </p>
      </div>

      <div class="row" style="gap: 8px;">
        <button class="btn btn-outline btn-sm" @click="handleResetAll">
          <RotateCcw :size="12" style="margin-right: 4px;" />
          Reset All
        </button>
        <button class="btn btn-primary btn-sm" @click="handleCopyCss">
          <Copy :size="12" style="margin-right: 4px;" />
          Copy CSS
        </button>
      </div>
    </header>

    <!-- 2-Column Grid -->
    <div class="cust-grid">
      <!-- Left: Live Preview -->
      <div class="preview-col">
        
        <!-- KPI Row -->
        <ClientOnly>
        <div class="kpi-grid">
          <DataStatCard label="Active Theme" :value="themeStore.theme" :badge-text="themeStore.look.toUpperCase()" badge-variant="accent" />
          <DataStatCard label="Palette Accent" :value="themeStore.palette" badge-text="Active" badge-variant="success" />
          <DataStatCard label="Border Radius" :value="`${themeStore.radiusScale}%`" badge-text="Scaled" badge-variant="accent" />
          <DataStatCard label="Shadow Depth" :value="`${themeStore.shadowScale}%`" badge-text="Elevation" badge-variant="success" />
        </div>
        </ClientOnly>

        <!-- Sample UI Preview Card -->
        <section class="card" style="padding: var(--o-s4);">
          <div class="row" style="justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--o-border); padding-bottom: 6px; margin-bottom: 14px;">
            <h3 style="margin: 0; font-size: 15px;">Live Element Preview</h3>
            <span class="caption">Elements reflect tokens in real-time</span>
          </div>

          <div class="col" style="gap: 16px;">
            <div class="preview-cluster">
              <button class="btn btn-primary">Primary action</button>
              <button class="btn">Default</button>
              <button class="btn btn-outline">Outline</button>
              <button class="btn btn-ghost">Ghost</button>
              <button class="btn btn-danger">Danger</button>
            </div>

            <div class="preview-cluster">
              <span class="badge badge-accent">Accent badge</span>
              <span class="badge badge-success"><span class="badge-dot"></span>Operational</span>
              <span class="badge badge-warning">Degraded</span>
              <span class="chip">reactive-token</span>
            </div>

            <div class="row" style="gap: 12px; flex-wrap: wrap;">
              <input class="input" style="max-width: 240px;" placeholder="Input placeholder…">
              <select class="input" style="max-width: 200px;">
                <option>Select Option A</option>
                <option>Select Option B</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Code Block -->
        <div class="card export-card" style="padding: var(--o-s3);">
          <CodeBlock 
            title="Generated :root CSS Overrides"
            :code="themeStore.generatedCss"
            lang="css"
          />
        </div>
      </div>

      <!-- Right: Sticky Control Panel -->
      <aside class="card" id="panel" style="padding: 0;">
        <ThemeCustomizer :show-actions="false" />
      </aside>
    </div>
  </div>
</template>
