<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const themeStore = useThemeStore()
const toast = useToast()
const modalRef = ref<HTMLDialogElement | null>(null)

watch(() => themeStore.isDemoModalOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      modalRef.value?.showModal()
    })
  } else {
    modalRef.value?.close()
  }
})

function close() {
  themeStore.isDemoModalOpen = false
}

function handleConfirm() {
  toast.success('Action confirmed inside modal!')
  close()
}
</script>

<template>
  <dialog 
    ref="modalRef" 
    class="modal-dialog" 
    @cancel="close"
    @click.self="close"
  >
    <div class="modal-box">
      <!-- Modal Header -->
      <header class="modal-header">
        <div class="modal-title-row">
          <span class="modal-icon">⚡</span>
          <h3 class="modal-title">Nuxt 3 + ohno Starter</h3>
        </div>
        <button class="btn btn-ghost btn-icon btn-sm" @click="close" aria-label="Close modal">✕</button>
      </header>

      <!-- Modal Body -->
      <div class="modal-body">
        <p class="modal-desc">
          Native HTML <code>&lt;dialog&gt;</code> component with backdrop blur, smooth entry transitions, and full keyboard accessibility.
        </p>

        <div class="modal-stat-grid">
          <div class="stat-pill">
            <span class="stat-lbl">Active Theme</span>
            <span class="stat-val">{{ themeStore.theme }}</span>
          </div>
          <div class="stat-pill">
            <span class="stat-lbl">Color Mode</span>
            <span class="stat-val">{{ themeStore.look }}</span>
          </div>
          <div class="stat-pill">
            <span class="stat-lbl">Palette</span>
            <span class="stat-val">{{ themeStore.palette }}</span>
          </div>
        </div>

        <div class="callout callout-info" style="margin-top: 14px;">
          <strong>Pro-tip:</strong> Press <kbd class="kbd-sm">ESC</kbd> or click the backdrop anytime to dismiss this modal.
        </div>
      </div>

      <!-- Modal Footer -->
      <footer class="modal-footer">
        <button class="btn btn-ghost btn-sm" @click="close">Cancel</button>
        <button class="btn btn-primary btn-sm" @click="handleConfirm">Confirm & Action</button>
      </footer>
    </div>
  </dialog>
</template>

<style scoped>
.modal-dialog {
  margin: auto;
  border: 1px solid var(--o-border-2, var(--o-border));
  border-radius: var(--o-r-lg);
  background: var(--o-surface);
  color: var(--o-text);
  padding: 0;
  max-width: 480px;
  width: calc(100vw - 32px);
  box-shadow: var(--o-shadow-lg, 0 20px 40px rgba(0,0,0,0.3));
  overflow: hidden;
}

.modal-dialog::backdrop {
  background: var(--o-backdrop, rgba(0,0,0,0.6));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal-box {
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--o-border);
}

.modal-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-icon {
  font-size: 16px;
}

.modal-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.modal-body {
  padding: 20px;
}

.modal-desc {
  font-size: 13px;
  color: var(--o-text-2);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.modal-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.stat-pill {
  padding: 10px;
  background: var(--o-surface-2);
  border: 1px solid var(--o-border);
  border-radius: var(--o-r-md);
  text-align: center;
}

.stat-lbl {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  color: var(--o-text-3);
  font-weight: 600;
  letter-spacing: 0.04em;
}

.stat-val {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--o-text);
  margin-top: 2px;
  text-transform: capitalize;
}

.callout {
  padding: 10px 14px;
  border-radius: var(--o-r-md);
  font-size: 12px;
  background: var(--o-surface-2);
  border-left: 3px solid var(--o-accent);
  color: var(--o-text-2);
}

.kbd-sm {
  padding: 1px 4px;
  font-size: 10px;
  background: var(--o-surface);
  border: 1px solid var(--o-border);
  border-radius: 3px;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid var(--o-border);
  background: var(--o-surface-2);
}
</style>
