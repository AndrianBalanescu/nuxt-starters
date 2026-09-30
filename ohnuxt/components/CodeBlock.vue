<script setup lang="ts">
import { Copy, Check } from 'lucide-vue-next'

const props = defineProps<{
  code: string
  title?: string
  lang?: string
}>()

const toast = useToast()
const { copy, copied } = useClipboard()

function handleCopy() {
  copy(props.code)
  toast.success('Code copied to clipboard!')
}
</script>

<template>
  <div class="code-block-card">
    <div v-if="title || $slots.header" class="code-block-header">
      <span class="code-block-title">{{ title }}</span>
      <button class="btn btn-sm btn-outline" @click="handleCopy">
        <Check v-if="copied" :size="12" style="color: var(--o-green); margin-right: 4px;" />
        <Copy v-else :size="12" style="margin-right: 4px;" />
        <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
      </button>
    </div>
    <pre class="code" :data-lang="lang"><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.code-block-card {
  display: flex;
  flex-direction: column;
}

.code-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.code-block-title {
  font-size: var(--o-fs-xs, 10px);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--o-text-3);
  font-weight: 600;
}
</style>
