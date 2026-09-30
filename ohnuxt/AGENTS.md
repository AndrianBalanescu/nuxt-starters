# AGENTS.md — Nuxt 3 + ohno + Pinia Workspace Rules (BINDING)

## 🛑 MANDATORY: Always Consult `llms.txt` First
Before adding any custom CSS classes, wrapper components, or inline styles:
1. **Read [`llms.txt`](./llms.txt):** It is the complete machine-facing contract for all `ohno` design tokens, classless primitives, and semantic modifiers.
2. **The Golden Rule:** **If a style or behavior is in `llms.txt`, use native HTML and ohno tokens.** Never invent ad-hoc CSS classes, duplicate JavaScript event listeners, or custom container components for things `ohno` handles natively.

---

## 1. Stack Contract
- **Runtime & Package Manager:** `bun` only. Never run `npm` or `pnpm` without explicit instruction.
- **Framework:** Nuxt 3 with file-based routing (`pages/`) and layouts (`layouts/`).
- **Styling & Design System:** **ohno** classless-first UI kit (`assets/css/{tokens,base,components,customizer}.css`).
  - *Hard Rule:* Use ohno CSS custom properties (`--o-bg`, `--o-surface`, `--o-text`, `--o-border`, `--o-accent`, `--o-s1`..`--o-s8`, `--o-r-sm`..`--o-r-lg`, `--o-shadow-md`).
  - *Cascade Rule:* Respect `@layer tokens, base, components`. Do NOT write rogue unlayered `<style scoped>` that collide with tokens.
- **Iconography:** `lucide-vue-next` for crisp, lightweight, tree-shakeable SVG icons.
- **State Management:** Pinia setup stores (`defineStore('id', () => { ... })`) with `@vueuse/core` `useStorage` for automatic `localStorage` persistence.
- **Toasts:** Use `const toast = useToast()` which delegates directly to `window.OHNO.toast()` — zero DOM container overhead.

---

## 2. Directory & Flat Component Architecture

All reusable Vue components live directly in `components/` with clean, natural naming (zero deeply nested 1-file subdirectories):

```text
components/
├── AppNotch.vue          # Top-bezel 3-icon hardware notch (<AppNotch />)
├── AppModal.vue          # Accessible <dialog> wrapper (<AppModal />)
├── AppPanel.vue          # Polymorphic drawer/sheet (<AppPanel />)
├── AppSelect.vue         # Custom searchable dropdown (<AppSelect />)
├── CommandPalette.vue    # Raycast ⌘K overlay (<CommandPalette />)
├── ThemeCustomizer.vue   # Token & appearance customizer (<ThemeCustomizer />)
├── TokenSlider.vue       # Range slider control (<TokenSlider />)
├── ColorPicker.vue       # Hex color picker grid (<ColorPicker />)
└── CodeBlock.vue         # Code snippet box with copy (<CodeBlock />)
```

### Polymorphic Panel Usage (`<AppPanel>`):
```vue
<!-- Right slide-over panel -->
<AppPanel
  v-model="isOpen"
  title="Inspector Panel"
  position="right"
  width="420px"
>
  <p>Content goes here.</p>
  <template #footer="{ close }">
    <button class="btn btn-primary btn-sm" @click="close">Save</button>
  </template>
</AppPanel>

<!-- Bottom sheet on mobile / touch -->
<AppPanel
  v-model="isSheetOpen"
  title="Actions"
  position="bottom"
  height="360px"
>
  <p>Bottom sheet content.</p>
</AppPanel>
```

---

## 3. Semantic Forms & Native HTML Elements

Always prefer native HTML tags over wrapper components when possible:
- **Buttons:** `<button class="btn btn-primary">Submit</button>`
- **Selects:** `<select v-model="role"><option>Admin</option></select>` (automatically styled by ohnocss tokens)
- **Switches:** `<input type="checkbox" role="switch" v-model="enabled" />`
- **Sliders:** `<input type="range" min="0" max="100" v-model="val" />`
- **Tooltips:** `<button data-tip="Click to refresh" data-pos="top">↻</button>`

---

## 4. Behavioral Rules for AI Agents
- **Always check `ohno.llm.txt`** before creating any new component or writing CSS.
- Keep `tsconfig.json` unified (single tsconfig, zero dotfile sprawl).
- Use `useToast()` composable for all notification triggers (`toast.success()`, `toast.info()`, `toast.warning()`, `toast.error()`).
- Verify full static generation with `bun run generate` before completing any task.
