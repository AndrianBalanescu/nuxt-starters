<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  modelValue: string | number | (string | number)[]
  options?: (SelectOption | string)[]
  placeholder?: string
  searchable?: boolean
  multiple?: boolean
  disabled?: boolean
}>(), {
  placeholder: 'Select option…',
  searchable: false,
  multiple: false,
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | number | (string | number)[]): void
  (e: 'change', val: string | number | (string | number)[]): void
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const selectRef = ref<HTMLElement | null>(null)

const normalizedOptions = computed<SelectOption[]>(() => {
  if (!props.options) return []
  return props.options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt }
    }
    return opt
  })
})

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value.trim()) {
    return normalizedOptions.value
  }
  const q = searchQuery.value.toLowerCase()
  return normalizedOptions.value.filter(opt => opt.label.toLowerCase().includes(q))
})

const selectedLabel = computed(() => {
  if (props.multiple) {
    const vals = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
    const matched = normalizedOptions.value.filter(o => vals.includes(o.value))
    return matched.map(m => m.label).join(', ') || props.placeholder
  }
  const matched = normalizedOptions.value.find(o => o.value === props.modelValue)
  return matched ? matched.label : props.placeholder
})

function isSelected(val: string | number) {
  if (props.multiple) {
    const vals = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
    return vals.includes(val)
  }
  return props.modelValue === val
}

function selectOption(opt: SelectOption) {
  if (opt.disabled) return

  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const idx = current.indexOf(opt.value)
    if (idx > -1) {
      current.splice(idx, 1)
    } else {
      current.push(opt.value)
    }
    emit('update:modelValue', current)
    emit('change', current)
  } else {
    emit('update:modelValue', opt.value)
    emit('change', opt.value)
    isOpen.value = false
  }
}

function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function handleClickOutside(e: MouseEvent) {
  if (selectRef.value && !selectRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeyDown)
  }
})
</script>

<template>
  <div 
    ref="selectRef" 
    class="select ohno-custom-select" 
    :class="{ 'is-open': isOpen, 'is-disabled': disabled }"
  >
    <button
      type="button"
      class="select-trigger"
      :disabled="disabled"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggleDropdown"
    >
      <span class="select-label" :class="{ 'is-placeholder': !modelValue && modelValue !== 0 }">
        {{ selectedLabel }}
      </span>
    </button>

    <!-- Custom Popover Dropdown Panel -->
    <div v-if="isOpen" class="select-panel" role="listbox">
      <div v-if="searchable" style="padding: 4px;">
        <input
          type="text"
          class="select-search"
          v-model="searchQuery"
          placeholder="Search options…"
          @click.stop
        />
      </div>

      <div class="select-list">
        <button
          v-for="opt in filteredOptions"
          :key="opt.value"
          type="button"
          class="select-item"
          :class="{ 'is-selected': isSelected(opt.value), 'is-disabled': opt.disabled }"
          :disabled="opt.disabled"
          @click.stop="selectOption(opt)"
        >
          <span>{{ opt.label }}</span>
          <span v-if="isSelected(opt.value)" class="select-check">✓</span>
        </button>

        <div v-if="filteredOptions.length === 0" class="caption" style="padding: 8px 12px; text-align: center;">
          No options found
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ohno-custom-select {
  position: relative;
  width: 100%;
}

.select-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 99999;
  background: var(--o-surface-1, var(--o-bg));
  border: 1px solid var(--o-border-2, var(--o-border));
  border-radius: var(--o-r-md, 8px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--o-border);
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 240px;
  overflow-y: auto;
}

.select-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 10px;
  border-radius: var(--o-r-sm, 4px);
  background: transparent;
  border: none;
  color: var(--o-text);
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.select-item:hover:not(:disabled) {
  background: var(--o-surface-2);
  color: var(--o-accent);
}

.select-item.is-selected {
  background: var(--o-accent-soft, rgba(113, 116, 212, 0.15));
  color: var(--o-accent);
  font-weight: 600;
}

.select-check {
  font-size: 12px;
  color: var(--o-accent);
  font-weight: 700;
}
</style>
