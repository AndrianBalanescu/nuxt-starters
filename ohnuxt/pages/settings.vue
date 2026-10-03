<script setup lang="ts">
import { ref } from 'vue'
import { Save, Bell, Palette } from 'lucide-vue-next'

const toast = useToast()

const emailNotifs = ref(true)
const securityAlerts = ref(true)

function saveSettings() {
  toast.success('Preferences saved successfully!')
}

useSeoMeta({
  title: 'Settings · Nuxt 4 + ohno Starter',
  description: 'Manage preferences, notification triggers, and theme settings.'
})
</script>

<template>
  <div class="col" style="gap: var(--o-s4); max-width: 800px;">
    <!-- Header -->
    <header class="row" style="justify-content: space-between; align-items: center;">
      <div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Preferences &amp; Settings</h1>
        <p class="caption" style="margin: 2px 0 0;">Manage your workspace preferences and appearance.</p>
      </div>
      <button class="btn btn-primary btn-sm" @click="saveSettings">
        <Save :size="13" style="margin-right: 4px;" />
        Save Changes
      </button>
    </header>

    <!-- Notification Settings Card -->
    <section class="card" style="padding: var(--o-s4);">
      <div class="row" style="align-items: center; gap: 8px; border-bottom: 1px solid var(--o-border); padding-bottom: 8px; margin-bottom: 14px;">
        <Bell :size="16" style="color: var(--o-accent);" />
        <h3 style="margin: 0; font-size: 15px;">Notification Preferences</h3>
      </div>

      <div class="col" style="gap: 12px;">
        <label class="row" style="justify-content: space-between; align-items: center;">
          <div class="col" style="gap: 2px;">
            <span style="font-size: 13px; font-weight: 600;">Email Reports</span>
            <span class="caption">Receive daily digest of synthetic probe uptime.</span>
          </div>
          <input type="checkbox" class="check" v-model="emailNotifs">
        </label>

        <label class="row" style="justify-content: space-between; align-items: center;">
          <div class="col" style="gap: 2px;">
            <span style="font-size: 13px; font-weight: 600;">Incident Alerts</span>
            <span class="caption">Trigger emergency toast and notification banners.</span>
          </div>
          <input type="checkbox" class="check" v-model="securityAlerts">
        </label>
      </div>
    </section>

    <!-- Appearance Integration Card -->
    <section class="card" style="padding: var(--o-s4);">
      <div class="row" style="align-items: center; gap: 8px; border-bottom: 1px solid var(--o-border); padding-bottom: 8px; margin-bottom: 14px;">
        <Palette :size="16" style="color: var(--o-accent);" />
        <h3 style="margin: 0; font-size: 15px;">Theme &amp; Brand Tokens</h3>
      </div>

      <ThemeCustomizer :show-actions="false" :compact="true" />
    </section>
  </div>
</template>
