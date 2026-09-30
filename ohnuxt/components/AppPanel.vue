<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

export type PanelPosition = 'right' | 'left' | 'bottom' | 'top' | 'center'

const props = withDefaults(defineProps<{
  modelValue: boolean
  position?: PanelPosition
  title?: string
  size?: string
  backdrop?: boolean
  dismissible?: boolean
  showHandle?: boolean
  showClose?: boolean
}>(), {
  position: 'right',
  backdrop: true,
  dismissible: true,
  showClose: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}>()

const isVertical = computed(() => props.position === 'top' || props.position === 'bottom')
const isHorizontal = computed(() => props.position === 'left' || props.position === 'right')
const isCenter = computed(() => props.position === 'center')

const defaultSize = computed(() => {
  if (props.size) return props.size
  if (isVertical.value) return '70vh'
  if (isHorizontal.value) return '420px'
  return '520px'
})

const transitionName = computed(() => {
  switch (props.position) {
    case 'right': return 'panel-slide-right'
    case 'left': return 'panel-slide-left'
    case 'bottom': return 'panel-slide-bottom'
    case 'top': return 'panel-slide-top'
    case 'center':
    default:
      return 'panel-pop-center'
  }
})

function close() {
  if (!props.dismissible) return
  emit('update:modelValue', false)
  emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (props.modelValue && props.dismissible && e.key === 'Escape') {
    close()
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      emit('open')
    } else {
      document.body.style.overflow = ''
    }
  }
})

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="scrim-fade">
      <div 
        v-if="modelValue" 
        class="unified-panel-scrim" 
        :class="[
          'scrim-align-' + position,
          { 'no-backdrop': !backdrop }
        ]"
        @click.self="close"
      >
        <Transition :name="transitionName">
          <aside 
            v-if="modelValue" 
            class="unified-panel-sheet"
            :class="'panel-pos-' + position"
            :style="{
              width: isHorizontal ? `min(${defaultSize}, 100vw)` : (isCenter ? `min(${defaultSize}, calc(100vw - 32px))` : '100%'),
              maxHeight: isVertical ? defaultSize : '100vh'
            }"
          >
            <!-- Optional Grab Handle for Bottom Sheet -->
            <div 
              v-if="position === 'bottom' && showHandle !== false" 
              class="panel-handle-bar" 
              @click="close"
            >
              <span class="panel-handle"></span>
            </div>

            <!-- Panel Header -->
            <div class="panel-header">
              <div class="panel-title-wrap">
                <slot name="header">
                  <h3 class="panel-title">{{ title || 'Panel' }}</h3>
                </slot>
              </div>
              <button 
                v-if="showClose" 
                class="btn btn-ghost btn-icon btn-sm" 
                @click="close" 
                aria-label="Close panel"
              >
                <X :size="14" />
              </button>
            </div>

            <!-- Panel Body -->
            <div class="panel-body">
              <slot />
            </div>

            <!-- Optional Panel Footer -->
            <div v-if="$slots.footer" class="panel-footer">
              <slot name="footer" />
            </div>
          </aside>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.unified-panel-scrim {
  position: fixed;
  inset: 0;
  background: var(--o-backdrop, rgba(0, 0, 0, 0.6));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
}

.scrim-align-right { justify-content: flex-end; align-items: stretch; }
.scrim-align-left { justify-content: flex-start; align-items: stretch; }
.scrim-align-bottom { justify-content: center; align-items: flex-end; }
.scrim-align-top { justify-content: center; align-items: flex-start; }
.scrim-align-center { justify-content: center; align-items: center; }

.no-backdrop {
  background: transparent;
  backdrop-filter: none;
}

.unified-panel-sheet {
  background: var(--o-bg) !important;
  color: var(--o-text) !important;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--o-border);
  z-index: 10001;
  max-width: 100vw;
  overflow: hidden;
}

/* Position-Specific Geometries */
.panel-pos-right {
  top: 0;
  bottom: 0;
  border-left: 1px solid var(--o-border-2, var(--o-border));
}

.panel-pos-left {
  top: 0;
  bottom: 0;
  border-right: 1px solid var(--o-border-2, var(--o-border));
}

.panel-pos-bottom {
  max-width: 880px;
  border-top-left-radius: var(--o-r-lg, 16px);
  border-top-right-radius: var(--o-r-lg, 16px);
  border-top: 1px solid var(--o-border-2, var(--o-border));
  border-left: 1px solid var(--o-border);
  border-right: 1px solid var(--o-border);
}

.panel-pos-top {
  max-width: 880px;
  border-bottom-left-radius: var(--o-r-lg, 16px);
  border-bottom-right-radius: var(--o-r-lg, 16px);
  border-bottom: 1px solid var(--o-border-2, var(--o-border));
}

.panel-pos-center {
  border-radius: var(--o-r-lg, 16px);
  border: 1px solid var(--o-border-2, var(--o-border));
  max-height: calc(100vh - 48px);
}

/* Handle Bar for Bottom Sheets */
.panel-handle-bar {
  display: flex;
  justify-content: center;
  padding: 8px 0 4px;
  cursor: pointer;
  background: var(--o-surface-2) !important;
}

.panel-handle {
  width: 36px;
  height: 4px;
  border-radius: 9999px;
  background: var(--o-border-2, var(--o-border));
}

/* Header, Body, Footer */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-bottom: 1px solid var(--o-border);
  background: var(--o-surface-2) !important;
}

.panel-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--o-text);
}

.panel-body {
  padding: 18px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--o-s3, 12px);
}

.panel-footer {
  padding: 12px 18px;
  border-top: 1px solid var(--o-border);
  background: var(--o-surface-2) !important;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

/* Transitions */
.scrim-fade-enter-active,
.scrim-fade-leave-active {
  transition: opacity 0.2s ease;
}
.scrim-fade-enter-from,
.scrim-fade-leave-to {
  opacity: 0;
}

.panel-slide-right-enter-active,
.panel-slide-right-leave-active,
.panel-slide-left-enter-active,
.panel-slide-left-leave-active,
.panel-slide-bottom-enter-active,
.panel-slide-bottom-leave-active,
.panel-slide-top-enter-active,
.panel-slide-top-leave-active,
.panel-pop-center-enter-active,
.panel-pop-center-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.panel-slide-right-enter-from,
.panel-slide-right-leave-to {
  transform: translateX(100%);
}

.panel-slide-left-enter-from,
.panel-slide-left-leave-to {
  transform: translateX(-100%);
}

.panel-slide-bottom-enter-from,
.panel-slide-bottom-leave-to {
  transform: translateY(100%);
}

.panel-slide-top-enter-from,
.panel-slide-top-leave-to {
  transform: translateY(-100%);
}

.panel-pop-center-enter-from,
.panel-pop-center-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
