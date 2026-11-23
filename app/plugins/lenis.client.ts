/* Faas 5 K1 — silutud kerimine (referents abeautifulmess.co: Locomotive lerp .05).
   Ainult hiireratas glide'ib (Lenis lerp .05, kordaja 1); puude, klahvid ja ankruhüpped jäävad natiivseks.
   Kerimislukku omavad SiteHeader (menüü) ja EnquiryOverlay: <html> inline overflow: hidden → Lenis peatub,
   vabastusel resize() + start(). Reageerib AINULT luku tegelikule muutusele (resize() nullib glide'i sihi).
   Võrdlus: ?smooth=off, häälestus: ?lerp=.08. Reduced-motion: tavakerimine.
   Lenise CSS-i ei impordita: selle .lenis-stopped { overflow: clip } tühistaks scrollbar-gutter'i. */
import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  const root = document.documentElement
  const params = new URLSearchParams(location.search)
  const lenisRef = shallowRef<Lenis | null>(null)
  if (params.get('smooth') === 'off') return { provide: { lenis: lenisRef } }

  const lerp = Math.min(1, Math.max(.02, parseFloat(params.get('lerp') || '') || .05))
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']
  let lenis: Lenis | null = null
  let observer: MutationObserver | null = null
  let locked = false

  /* natiivne kerimine (klahv, klõps logol, ankur) ei tohi jääda käiva glide'i alla */
  const settle = () => { if (lenis && lenis.isScrolling === 'smooth') (lenis as unknown as { reset(): void }).reset() }
  const onKey = (e: KeyboardEvent) => { if (scrollKeys.includes(e.key)) settle() }
  const syncLock = () => {
    if (!lenis) return
    const now = root.style.overflow === 'hidden'
    if (now === locked) return
    locked = now
    if (locked) lenis.stop()
    else { lenis.resize(); lenis.start() }
  }

  const enable = () => {
    if (lenis) return
    lenis = new Lenis({
      lerp, wheelMultiplier: 1, smoothWheel: true, syncTouch: false, autoRaf: true,
      prevent: node => !!node.closest('[role="dialog"], [data-lenis-prevent]')
    })
    lenisRef.value = lenis
    locked = false
    observer = new MutationObserver(syncLock)
    observer.observe(root, { attributes: true, attributeFilter: ['style'] })
    document.addEventListener('pointerdown', settle, true)
    document.addEventListener('keydown', onKey, true)
    syncLock()
  }
  const disable = () => {
    if (!lenis) return
    observer?.disconnect()
    document.removeEventListener('pointerdown', settle, true)
    document.removeEventListener('keydown', onKey, true)
    lenis.destroy()
    lenis = null
    lenisRef.value = null
  }
  const configure = () => { if (reduced.matches) disable(); else enable() }

  reduced.addEventListener('change', configure)
  configure()
  /* alamlehe vahetusel (privacy-policy ↔ avaleht) uus lehe kõrgus */
  useNuxtApp().hook('page:finish', () => { lenis?.resize() })

  return { provide: { lenis: lenisRef } }
})
