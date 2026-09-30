/**
 * ohno.js DOM-scanning contract (llms.txt §scan):
 *
 * Components rendered after boot — client-side routes, v-if sections, the
 * customizer's generated-CSS card — never receive ohno's progressive
 * enhancement (copy buttons, palette wiring, tooltips…) unless `OHNO.scan()`
 * runs again. Every ohno.js initialiser is idempotent / bind-once (palette,
 * actions, popovers, notch all guard their document-level listeners), so
 * re-scanning on every page transition is safe by design.
 *
 * Timing contract (playwright-verified 2026-09-30):
 * `app:mounted` fires while NuxtRoot's Suspense hydration is still in flight
 * — scanning there mutates Vue-owned DOM (initSelects wraps the native
 * <select> in .field) and produces "Hydration children mismatch" console
 * errors. `nuxtApp.isHydrating` flips to false only when the initial
 * hydratingCount reaches 0, immediately BEFORE `app:suspense:resolve` is
 * called (nuxt/dist/app/nuxt.js), so that hook is the first safe scan point.
 * Later navigations render client-side only and are covered by `page:finish`
 * gated on the same flag.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const scan = (): boolean => {
    const ohno = (window as unknown as { OHNO?: { scan?: () => void } }).OHNO
    if (typeof ohno?.scan !== 'function') return false
    ohno.scan()
    return true
  }

  nuxtApp.hook('app:suspense:resolve', () => {
    if (nuxtApp.isHydrating) return
    // ohno.js loads via <defer> in head; it normally precedes the entry
    // module, but if it is still in flight, retry once when resources settle.
    if (!scan()) window.addEventListener('load', () => scan(), { once: true })
  })

  nuxtApp.hook('page:finish', () => {
    if (!nuxtApp.isHydrating) scan()
  })
})
