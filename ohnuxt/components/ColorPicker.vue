<script setup lang="ts">
const themeStore = useThemeStore()
</script>

<template>
  <div class="color-picker-grid">
    <label class="color-pick-item">
      <input type="color" v-model="themeStore.customAccent" class="color-swatch-input">
      <span class="color-pick-title">Accent</span>
    </label>

    <label class="color-pick-item">
      <input type="color" v-model="themeStore.customOnAccent" class="color-swatch-input">
      <span class="color-pick-title">On Accent</span>
    </label>

    <label class="color-pick-item">
      <input type="color" v-model="themeStore.customBg" class="color-swatch-input">
      <span class="color-pick-title">Bg</span>
    </label>

    <label class="color-pick-item">
      <input type="color" v-model="themeStore.customSuccess" class="color-swatch-input">
      <span class="color-pick-title">Success</span>
    </label>

    <label class="color-pick-item">
      <input type="color" v-model="themeStore.customWarning" class="color-swatch-input">
      <span class="color-pick-title">Warn</span>
    </label>

    <label class="color-pick-item">
      <input type="color" v-model="themeStore.customDanger" class="color-swatch-input">
      <span class="color-pick-title">Danger</span>
    </label>
  </div>
</template>

<style scoped>
.color-picker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  background: var(--o-surface-2);
  padding: 8px;
  border-radius: var(--o-r-md, 6px);
  border: 1px solid var(--o-border);
}

.color-pick-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.color-swatch-input {
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid var(--o-border);
  border-radius: var(--o-r-sm, 4px);
  background: none;
  cursor: pointer;
}

.color-pick-title {
  font-size: 10px;
  font-weight: 600;
  color: var(--o-text-2);
}
</style>
