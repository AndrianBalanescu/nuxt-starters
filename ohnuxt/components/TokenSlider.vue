<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  modelValue: number
  min: number
  max: number
  step?: number
  unit?: string
  format?: (val: number) => string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

const displayValue = computed(() => {
  if (props.format) return props.format(props.modelValue)
  if (props.unit) return `${props.modelValue}${props.unit}`
  return `${props.modelValue}`
})

function onInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<template>
  <div class="token-slider-group">
    <div class="token-slider-header">
      <span class="token-slider-label">{{ label }}</span>
      <span class="token-slider-val">{{ displayValue }}</span>
    </div>
    <input 
      type="range" 
      :min="min" 
      :max="max" 
      :step="step || 1" 
      :value="modelValue" 
      @input="onInput"
      class="token-range-input"
    >
  </div>
</template>

<style scoped>
.token-slider-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.token-slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.token-slider-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--o-text-2);
}

.token-slider-val {
  font-size: 11px;
  font-weight: 600;
  font-family: var(--o-font-mono, monospace);
  color: var(--o-text);
}

.token-range-input {
  width: 100%;
  height: 5px;
  accent-color: var(--o-accent);
}
</style>
