/**
 * ohno.js DOM-scanning contract (llms.txt §scan):
 *
 * Components rendered after boot — client-side routes, v-if sections, the
 * customizer's generated-CSS card — never receive ohno's progressive
 * enhancement (copy buttons, palette wiring, tooltips…) unless `OHNO.scan()`
 * runs again. Every ohno.js initialiser is idempotent / bind-once (palette,
 * actions, popovers, notch all guard their document-level listeners), so
 * re-scanning on every page transition is safe by design.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const scan = () => {
    const ohno = (window as unknown as { OHNO?: { scan?: () => void } }).OHNO
    if (typeof ohno?.scan === 'function') ohno.scan()
  }

  nuxtApp.hook('app:mounted', () => {
    scan()
    // ohno.js is loaded with `defer`; if it ever resolves after hydration,
    // re-scan once when all resources are in.
    window.addEventListener('load', scan, { once: true })
  })

  // Fresh route DOM needs a fresh scan.
  nuxtApp.hook('page:finish', scan)
})
