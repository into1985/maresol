/* Faas 5 lehe motion-sõnavara (MOTION.md). Referents abeautifulmess.co, kinnitatud väärtused (Why demo, B, 2026-11-23).
   K2 foto: mask figure'il alt üles + foto settib raamis. Tekst: üksus (pealkiri + lähiplokk), opacity + väike tõus.
   K3 drift: kõrvalfoto liigub kerimisel kiiremini, sektsiooni keskel nihe 0 (ainult hiir > 900 px + Lenis).

   Käivitus: üksuse ülaserv 85 % vh (fotod ekraani alaserv), üks kord. Kerimissündmusel (Lenis kirjutab natiivse scroll'i) kontrollitakse ootel
   üksusi: ekraanil → mängib, üle hüpatud (alaserv ekraani kohal, nt menüühüpe) → kohe lõppolekusse.
   Laadimisel juba nähtav üksus jääb lõppolekusse (ankur / keskelt laadimine: sisu ei vilgu ega jää peitu).
   Reduced-motion: midagi ei peideta. Lõpus inline-stiilid maha (lõppolek = staatiline leht). */

export const MOTION = {
  trigger: .85,
  photoTrigger: 1,   /* fotod alustavad ekraani alaservas: kõvera aeglane algus kulub sisenemisele (referentsis käivitus enne ekraani + .4 s), kasutaja 2026-11-23 */
  photo: { mask: 1600, zoom: 2400, from: 1.15, lead: 250, ease: 'cubic-bezier(.76,0,.24,1)' },
  text: { dur: 1600, rise: 10, step: 200, ease: 'cubic-bezier(.25,1,.5,1)' },
  drift: .1,
  group: 120,   /* rühma samm (Homes kaardid, kasutaja 2026-11-23) */
  intro: { title: 400, cap: 2500 },   /* hero avang: pealkiri +.4 s; valmisoleku lagi */
}

/* Hero vilkumise kaitse: head'i inline-skript enne CSS-i; 4 s varulahendus → data-mo-late = staatiline */
export const INTRO_GUARD = "(function(){var h=document.documentElement;if(location.hash||matchMedia('(prefers-reduced-motion: reduce)').matches)return;h.classList.add('mo-intro');setTimeout(function(){if(h.classList.contains('mo-intro')){h.classList.remove('mo-intro');h.setAttribute('data-mo-late','')}},4000)})()"

/* Hero: ajapõhine avang laadimisel — foto (mask + suum), siis pealkiri ja lead. get() annab foto ja tekstielemendid järjekorras.
   Kerimisnihet pole (kuni 2026-11-24 viis fotot sügavuse järgi; nüüd üks foto, millele ulatub pealkiri). */
export function useHeroMotion(get: () => { fig: HTMLElement; text: HTMLElement[] } | null) {
  const P = MOTION.photo, T = MOTION.text, I = MOTION.intro
  let parts: { fig: HTMLElement; text: HTMLElement[] } | null = null
  const root = () => document.documentElement

  const animate = (el: HTMLElement, kf: Keyframe[], o: KeyframeAnimationOptions, ...props: string[]) => {
    const a = el.animate(kf, { ...o, fill: 'both' })
    track(el, [...(anims.get(el) ?? []), a])
    a.finished.then(() => { a.cancel(); props.forEach(p => el.style.removeProperty(p)) }).catch(() => {})
  }
  const play = () => {
    if (!parts) return
    const { fig, text } = parts
    const img = fig.querySelector('img') as HTMLImageElement
    fig.style.clipPath = 'inset(100% 0 0 0)'; img.style.transform = `scale(${P.from})`
    animate(fig, [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }], { duration: P.mask, easing: P.ease }, 'clip-path')
    animate(img, [{ transform: `scale(${P.from})` }, { transform: 'scale(1)' }], { duration: P.zoom, delay: -P.lead, easing: P.ease }, 'transform')
    text.forEach((e, i) => {
      e.style.opacity = '0'; e.style.translate = `0 ${T.rise}px`
      animate(e, [{ opacity: 0, translate: `0 ${T.rise}px` }, { opacity: 1, translate: '0 0' }], { duration: T.dur, delay: I.title + i * T.step, easing: T.ease }, 'opacity', 'translate')
    })
  }

  onMounted(async () => {
    parts = get()
    if (!parts || !root().classList.contains('mo-intro')) return   /* ankur, reduced, hilinenud → staatiline */
    const ready = Promise.all([document.fonts.ready, (parts.fig.querySelector('img') as HTMLImageElement).decode().catch(() => {})])
    await Promise.race([ready, new Promise(r => setTimeout(r, I.cap))])
    if (!root().classList.contains('mo-intro')) return
    /* inline-algolek enne klassi eemaldamist (vilkumata); taastatud kerimisasend hero all → avangut pole */
    const past = parts.fig.closest('section')!.getBoundingClientRect().bottom <= 0
    if (!past) play()
    root().classList.remove('mo-intro')
  })
  onBeforeUnmount(() => {
    if (parts) [parts.fig, ...parts.text, parts.fig.querySelector('img') as HTMLElement].forEach(stop)
    parts?.fig.style.removeProperty('clip-path')
    root().classList.remove('mo-intro')
  })
}

export type Unit = { el: HTMLElement; at?: number; hide(): void; play(delay?: number): void; finish(): void }   /* at = käivituspiir (osa vh), vaikimisi MOTION.trigger */

const anims = new WeakMap<HTMLElement, Animation[]>()
const track = (el: HTMLElement, a: Animation[]) => anims.set(el, a)
const stop = (el: HTMLElement) => { anims.get(el)?.forEach(a => a.cancel()); anims.delete(el) }

/* K2: raam (overflow clip) + sees liikuv element; vaikimisi img, More-ribal logomärgi svg */
export function photoUnit(fig: HTMLElement, inner?: HTMLElement | SVGElement): Unit {
  const img = (inner ?? fig.querySelector('img')) as HTMLElement
  const P = MOTION.photo
  const finish = () => {
    stop(fig); stop(img)
    fig.style.removeProperty('clip-path'); img.style.removeProperty('transform')
  }
  return {
    el: fig,
    at: MOTION.photoTrigger,
    hide() { fig.style.clipPath = 'inset(100% 0 0 0)'; img.style.transform = `scale(${P.from})` },
    async play(delay = 0) {
      if (img instanceof HTMLImageElement) { img.loading = 'eager'; try { await img.decode() } catch {} }
      const a = fig.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }], { duration: P.mask, delay, easing: P.ease, fill: 'both' })
      const b = img.animate([{ transform: `scale(${P.from})` }, { transform: 'scale(1)' }], { duration: P.zoom, delay: delay - P.lead, easing: P.ease, fill: 'both' })
      track(fig, [a]); track(img, [b])
      a.finished.then(() => { a.cancel(); fig.style.removeProperty('clip-path') }).catch(() => {})
      b.finished.then(() => { b.cancel(); img.style.removeProperty('transform') }).catch(() => {})
    },
    finish,
  }
}

/* Tekst: elemendid järjest (samm vaikimisi .2 s; 0 = plokk tervikuna), trigger = esimene element */
export function textUnit(els: HTMLElement[], step: number = MOTION.text.step): Unit {
  const T = MOTION.text
  const finish = () => els.forEach(el => { stop(el); el.style.removeProperty('opacity'); el.style.removeProperty('translate') })
  return {
    el: els[0]!,
    hide() { els.forEach(el => { el.style.opacity = '0'; el.style.translate = `0 ${T.rise}px` }) },
    play(delay = 0) {
      els.forEach((el, i) => {
        const a = el.animate([{ opacity: 0, translate: `0 ${T.rise}px` }, { opacity: 1, translate: '0 0' }], { duration: T.dur, delay: delay + i * step, easing: T.ease, fill: 'both' })
        track(el, [a])
        a.finished.then(() => { a.cancel(); el.style.removeProperty('opacity'); el.style.removeProperty('translate') }).catch(() => {})
      })
    },
    finish,
  }
}

/* Rühm: mitu üksust ühe käivitusega (trigger vaikimisi esimene), järjest sammuga (Homes: kaardid vasakult paremale .12 s) */
export function groupUnit(units: Unit[], step: number = MOTION.group, trigger?: HTMLElement): Unit {
  return {
    el: trigger ?? units[0]!.el,
    at: units[0]!.at,
    hide() { units.forEach(u => u.hide()) },
    play(delay = 0) { units.forEach((u, i) => u.play(delay + i * step)) },
    finish() { units.forEach(u => u.finish()) },
  }
}

/* Üksused ühe sektsiooni kohta. build() kutsutakse onMounted'is (DOM olemas). */
export function useReveal(build: () => Unit[]) {
  let pending: Unit[] = []
  let all: Unit[] = []
  let raf = 0
  const check = () => {
    raf = 0
    pending = pending.filter(u => {
      const r = u.el.getBoundingClientRect()
      if (r.top >= innerHeight * (u.at ?? MOTION.trigger)) return true
      if (r.bottom < 0) u.finish()   /* üle hüpatud */
      else u.play()
      return false
    })
    if (!pending.length) removeEventListener('scroll', onScroll)
  }
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(check) }
  let alive = true
  onMounted(async () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    /* asukoht loetakse alles valmis paigutusest: onMounted'i hetkel võib CSS (dev) ja fondid olla rakendamata
       (Why foto mõõdeti 635 px, tegelik 1048 px → arvati nähtavaks ja jäi staatiliseks) */
    if (document.readyState !== 'complete') await new Promise(r => addEventListener('load', r, { once: true }))
    await document.fonts.ready
    await new Promise(r => { requestAnimationFrame(r); setTimeout(r, 100) })
    if (!alive) return
    all = build()
    /* juba ekraanil näha (ankur, keskelt laadimine, varakult keritud, kõrge ekraan) → jääb staatiliseks;
       nähtavat sisu ei peideta, ka mitte ekraani alumises 15 %-s (Coast: otseankrul lennujaamad seal) */
    pending = all.filter(u => u.el.getBoundingClientRect().top >= innerHeight)
    pending.forEach(u => u.hide())
    if (pending.length) addEventListener('scroll', onScroll, { passive: true })
  })
  onBeforeUnmount(() => { alive = false; removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); all.forEach(u => u.finish()) })
}

/* K3: el liigub (ankru keskpunkt − ekraani kese) × k. Ankur = paigal püsiv ümbris (mitte el ise). */
export function useDrift(get: () => { el: HTMLElement; anchor: HTMLElement } | null, k = MOTION.drift) {
  const nuxt = useNuxtApp() as unknown as { $lenis?: Ref<unknown> }
  let mq: MediaQueryList | null = null
  let raf = 0
  let t: { el: HTMLElement; anchor: HTMLElement } | null = null
  const on = () => !!(mq?.matches && nuxt.$lenis?.value)
  const update = () => {
    raf = 0
    if (!t) return
    if (!on()) { t.el.style.removeProperty('translate'); return }
    const r = t.anchor.getBoundingClientRect()
    t.el.style.translate = `0 ${((r.top + r.height / 2 - innerHeight / 2) * k).toFixed(2)}px`
  }
  const req = () => { if (!raf) raf = requestAnimationFrame(update) }
  onMounted(() => {
    mq = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px) and (prefers-reduced-motion: no-preference)')
    t = get()
    addEventListener('scroll', req, { passive: true }); addEventListener('resize', req); mq.addEventListener('change', req)
    req()
  })
  onBeforeUnmount(() => {
    removeEventListener('scroll', req); removeEventListener('resize', req); mq?.removeEventListener('change', req)
    cancelAnimationFrame(raf); t?.el.style.removeProperty('translate')
  })
}
