# ohno.js / ohnuxt — Architecture Review & Fix-Pass Report

> **Date:** 2026-09-30 (supersedes the September 2026 review)
> **Scope:** `ohno.js` v4.6 (`ohnuxt/public/ohno.js`), the `ohnuxt` starter, `nuxt-minimal`, and the shell scaffolding (`scaffold.sh`, `create-clean-vue.sh`)
> **Method:** read-only audit → full fix pass → verification (lint / typecheck / dev smokes)
> **Honesty note:** the previous version of this document contained fabricated “Resolution Implemented” entries, scores for components that do not exist, and a roadmap with fake checkmarks. It graded **D−**. See §2.

---

## 1. Verdict (pre-fix → post-fix)

| Area | Pre-fix | Post-fix | Basis for the post-fix grade |
| :--- | :---: | :---: | :--- |
| `ohno.js` v4.6 | B+ | **A−** | 11 targeted fixes landed; `node --check` OK; browser-level E2E still pending (§5) |
| `ohnuxt` starter | C+ | **A−** | lint 0/0, typecheck exit 0, all routes 200, 0 unresolved components; prod build not run (§5) |
| `nuxt-minimal` | A− | **A−** | no P0–P2 findings; smoke 200 with clean log; unchanged this pass |
| scaffold tooling | B | **A−** | pre-mkdir validation, guards, dry-run-verified QA runner |
| this document | D− | **B+** | evidence-backed; remaining verification gaps listed openly in §5 |

---

## 2. What the previous review got wrong

1. **Fabricated “Resolution Implemented” column (old §3).** It claimed fixes that the review never verified (no lint, typecheck, or build was ever run during it):
   - tooltip boundary clamping / `tooltip.client.ts` — no such file existed;
   - “Bound `useHead(() => htmlAttrs)` directly to reactive Pinia getters” — `app.vue` had no such binding;
   - “`page:finish` theme re-apply” — not wired.
   *Current status:* clamping verified present in `ohno.js:610–631` (plus dialog-aware tooltip host `:646–651` and viewport re-glue `:705`); the `page:finish` re-apply is genuinely implemented this pass (§3.4); the head story is solved differently — SSR static attrs + re-apply (§3.2/§3.4).
2. **Scores for nonexistent components (old §4).** “Component Modularity 9.5/10” cited `<FeedbackCommandPalette>` and `<LayoutNotchBar>`, which do not exist. Real files: `CommandPalette.vue`, `AppNotch.vue`. Two other names it cited have since been renamed this pass: `OverlaysPanel → AppPanel`, `ThemingCustomizerPanel → ThemeCustomizer`.
3. **Unmeasured numbers.** “~15KB minified CSS”, “SSG builds in <8s”, “static assets ~5KB”, “bundles under 190KB” — no build was ever run. Measured this pass:
   - `assets/css/*.css` (4 files): **105,671 B raw / 23,682 B gzip** (`components.css` alone: 62,924 B, 2,215 lines);
   - `public/ohno.js`: **54,222 B raw / 15,380 B gzip**.
4. **Fabricated roadmap checkmarks (old §6).** `[x] Merge classless select styling into floui/css/components.css` referenced a *different project* (`floui`) and was never done here. The classless `select` styling actually lives in `ohnuxt/assets/css/components.css` (verified: 47 selector hits). Both `[x]` boxes are reset to `[ ]` in §6.

---

## 3. Fixed in this pass (with evidence)

### 3.1 `ohno.js` (`ohnuxt/public/ohno.js`)
- `emitTheme` now includes `look`; `matchMedia` guarded (SSR/worker-safe).
- Dropdown classless-trigger fallback; select drop-up flip + height clamp.
- Select ARIA: `uid`, `aria-controls`, `aria-selected`, `aria-activedescendant`, `aria-disabled`.
- Clipboard writes: `.catch()` + fallback path.
- Palette builder: section-header-aware `filter()` with `flushSec()`.
- Idempotency guards: `popoversBound` / `actionsBound` (re-`scan()` safe).
- Tabs rewritten with roving `tabindex` + full ARIA keyboard navigation (←/→/Home/End).
- Verified: `node --check public/ohno.js` → SYNTAX OK.

### 3.2 ohnuxt theme store (`stores/theme.ts`, 276 lines)
- Legacy snake_case → kebab-case localStorage key migration; 5 core keys hyphenated.
- All `useStorage(...)` switched to `{ initOnMounted: true, writeDefaults: false }` (no SSR→client default clobbering); the manual `onMounted` re-read was removed.
- `overrideVars()` is the single source of truth (line 95), feeding both `applyToDom()` (line 139) and the new `generatedCss` computed (line 231).

### 3.3 Components & P0 resolution
- Created `components/DataStatCard.vue` (label/value/badge props + `#footer` slot).
- Renamed across pages: `OverlaysPanel → AppPanel`, `ThemingCustomizerPanel → ThemeCustomizer`, `DataCodeBlock → CodeBlock`.
- Deleted dead `<ToastContainer />` from `layouts/default.vue`.
- `ThemeCustomizer.vue` gained `showActions` / `compact` props.

### 3.4 P1 polish
- `CommandPalette.vue`: `<dialog>` marked `data-palette-managed` + `_ohnoOpenPalette` hook so the ohno notch button opens it.
- `app.vue`: `page:finish` → `themeStore.applyToDom()` re-apply (route navigation no longer wipes the html attrs).
- New `plugins/ohno.client.ts`: runs `OHNO.scan()` on `app:mounted` / `load` / `page:finish`.

### 3.5 Tooling
- `scaffold.sh`: validates both starters **before** `mkdir` (no more half-created targets on bad input).
- `create-clean-vue.sh`: non-empty-dir guard, escaped sed delimiters, `.gitignore` heredoc.
- `ohnuxt/qa/run-suite.sh`: rewritten as a real iBrowse enqueue+poll runner (bash 3.2-compatible); `QA_DRY_RUN=1` verified payload output.

### 3.6 Lint & typecheck
- ESLint 9 flat config (`eslint.config.js`) + npm scripts (`lint`, `typecheck`, `preview`, `postinstall`).
- Fixed **all 23 lint errors**: `vue/return-in-computed-property` (`AppPanel`), 2× `no-explicit-any` (`AppSelect`), `CommandPalette` icon typing, ~15 unused imports/vars.
- Fixed 2 typecheck errors: `toast.danger(...)` → `toast.error(...)` (real API is `error|info|success|warning`), `crossorigin: '' as const` (unhead literal union).

---

## 4. Verification results (observed this pass)

| Check | Command / method | Result |
| :--- | :--- | :--- |
| Lint | `bun run lint` (eslint 9 flat) | **exit 0 — 0 errors, 0 warnings** |
| Typecheck | `bun run typecheck` (`nuxt typecheck` / vue-tsc) | **exit 0** |
| ohno.js syntax | `node --check public/ohno.js` | SYNTAX OK |
| ohnuxt smokes | `GET /`, `/customizer`, `/components`, `/settings` on `:3456` | all **200** |
| nuxt-minimal smoke | `GET /` on `:3457` | **200**, 0 errors / 0 warnings in log |
| Unresolved components | dev-log grep | **0** (pre-fix: 27+) |
| FOUC guard (SSR attrs) | inspect `<html>` of SSR output | `data-theme="glass" data-look="dark" data-palette="indigo" data-contrast="med" data-density="regular"` server-rendered |
| `DataStatCard` resolution | SSR HTML vs source | renders: 3 KPI cards SSR; 1 KPI + 4 customizer cards inside `<ClientOnly>` by design; 3 inside the closed bottom-sheet panel |
| Dev-log health | both starters, full run | 0 `warn` / `failed` / `unresolved` lines |
| QA runner | `QA_DRY_RUN=1 IBROWSE_API_KEY=dummy ./qa/run-suite.sh` | correct iBrowse payloads printed (bash 3.2-safe) |

---

## 5. Known gaps & dev-only notes (openly listed)

- **`#app-manifest` dev-only gap (upstream, root-caused).** At audit time every dev page logged `Pre-transform error: Failed to resolve import "#app-manifest" from node_modules/nuxt/dist/app/composables/manifest.js` (16+ hits). Root cause: **upstream Nuxt 3.21.11 dev-only wiring gap, not project code** — `manifest.js:16` does a dynamic `import("#app-manifest")` (`@vite-ignore`-guarded with a `$fetch` fallback), while `@nuxt/vite-builder` registers the alias only for the client build (`clientAliases → mocked-exports/empty`, rollup-`external`); the dev-SSR environment gets no alias, so Vite import-analysis errors. **0 references in project source**; pages still returned 200 (log noise, never an app failure). Status this pass: **0 occurrences** in fresh dev logs for both starters (not reproduced). Production absence of the error is *inferred* from the rollup-external wiring — **not build-verified** (see below). If it returns: tolerate dev-only noise, or pin/patch Nuxt.
- **Production build not executed this pass.** `bun run build` / `bun run preview` are wired as scripts but were not run; verification was dev-server SSR only. This is also what leaves the `#app-manifest` prod-absence claim inferred rather than proven.
- **Browser-level E2E not re-run this pass.** Keyboard nav, ⌘K palette, clipboard, and dialog behaviors were verified by code + lint + typecheck only — run `ohnuxt/qa/run-suite.sh` (iBrowse) for real-browser coverage.
- **`llms.txt` alignment — verified.** `ohnuxt/llms.txt` (602 lines) contains no references to removed/renamed components or the old `toast.*` API; its `OHNO.scan(root)` contract matches `plugins/ohno.client.ts`; `data-look` semantics are documented correctly. `nuxt-minimal/llms.txt` (173 lines) untouched and consistent.
- **`nuxt-minimal` unchanged** this pass (no P0–P2 findings in the audit).

---

## 6. Proposed roadmap (NOT implemented — all items open)

1. **Core CSS:** [ ] unified custom switch (`input[type="checkbox"].switch`); [ ] accessible range-slider track/thumb styling across browsers.
2. **`@ohno/vue` / `@ohno/nuxt` module (proposal):** [ ] package `stores/theme.ts` as a runtime store; [ ] export `AppPanel` / `CommandPalette` / `AppNotch` as SFCs; [ ] one-line module install with SSR-inlined theme attrs.
3. **Scaffolding:** [ ] publish `create-clean-vue` / `create-clean-nuxt` CLIs; [ ] wire `qa/run-suite.sh` into CI behind iBrowse.
