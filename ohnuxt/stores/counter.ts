import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useCounterStore = defineStore('counter', () => {
  // Persisted so the demo counter survives reloads (QA 01: "persists across
  // page reloads"). Same pattern as stores/theme.ts: initOnMounted reads the
  // stored value after hydration (SSR renders the default 0 first — no
  // hydration mismatch), writeDefaults:false never seeds storage with defaults.
  const count = useStorage<number>('ohno-counter', 0, undefined, { initOnMounted: true, writeDefaults: false })
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  function decrement() {
    if (count.value > 0) count.value--
  }

  function reset() {
    count.value = 0
  }

  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset,
  }
})
