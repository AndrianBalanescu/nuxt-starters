<script setup lang="ts">
/**
 * Dashboard metric card — label + big value + optional badge/caption and a
 * footer slot for inline controls. Used by the dashboard, customizer and
 * components showcase pages.
 */
defineProps<{
  label: string
  value: string | number
  badgeText?: string
  badgeVariant?: 'accent' | 'success' | 'warning' | 'danger'
  caption?: string
}>()
</script>

<template>
  <div class="card data-stat-card">
    <div class="data-stat-head row">
      <span class="caption data-stat-label">{{ label }}</span>
      <span
        v-if="badgeText"
        class="badge"
        :class="`badge-${badgeVariant || 'accent'}`"
      >{{ badgeText }}</span>
    </div>

    <div class="data-stat-value">{{ value }}</div>

    <span v-if="caption" class="caption data-stat-caption">{{ caption }}</span>

    <div v-if="$slots.footer" class="data-stat-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.data-stat-card {
  gap: 6px;
  padding: var(--o-s4);
  justify-content: center;
}

.data-stat-head {
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.data-stat-label {
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.data-stat-value {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--o-text);
  font-variant-numeric: tabular-nums;
}

.data-stat-caption {
  color: var(--o-text-3);
}

.data-stat-footer {
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
