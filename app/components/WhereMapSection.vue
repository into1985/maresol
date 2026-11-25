<script setup lang="ts">
/* „Where is Alanya?" kaart v2 (kasutaja 2026-11-25, demo /_demo/where-map). Vana kaart WhereSection.vue on tagavaraks:
   tagasi saab, kui pages/index.vue-s panna <WhereMapSection /> asemele <WhereSection />.
   Menüülink „Alanya" viitab siia (id="alanya"). Kaart: OSM natural=coastline (Overpass), Web Mercator; andmed
   app/data/alanya-map.json (sama mis vanal). OSM-i viidet ei lisata (kasutaja otsus). Kaart on illustratiivne:
   Oba on rannajoont mööda Alanyast eemale nihutatud, et suured mummud ei kattuks.
   Meri = rannikuäärsed rõhtjooned (canvas), mitte pind. Mõõtkava proovitud ja eemaldatud (parem nurk läks kirjuks).
   Värvid ja suurused --map-* / --map2-* tokenitest (tokens.css), sildid rollidega .t-map-* (base.css). */
import map from '~/data/alanya-map.json'

const [, , W, H] = map.viewBox.split(' ').map(Number) as [number, number, number, number]
const pct = (x: number, y: number) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` })
const P = map.points as Record<string, { x: number, y: number }>
const pt = (k: string) => P[k]!

/* sildi asend mummu suhtes */
const towns = [
  { key: 'Antalya', at: 'up-left' },
  { key: 'Alanya', at: 'up-far', main: true },
  { key: 'Oba', at: 'right' },
  { key: 'Gazipaşa', at: 'left', m: 'sea' },   /* vasakul merel, rannajoonest lahti (kasutaja 2026-11-25): paremal jäi kaardi serva */
]
/* lennujaama silt rõnga kohal, juhtjooneta (kasutaja 2026-11-25) */
const unit = ref(W / 1300)   /* viewBox-ühikut ühe px kohta, täpsustub measure()-is */

/* Oba: päriselt ~3 km Alanyast, suured mummud kattuksid. Nihutatakse rannajoont mööda itta, kuni ümbriste vahe on OBA_GAP px
   (kaart on illustratiivne, kasutaja 2026-11-25); kaugus rannajoonest jääb samaks kui päris Obal. */
const OBA_GAP = 10
const coastPts = map.coast.split('M').filter(Boolean).map(p => p.replace(/Z/g, '').trim().split(/[L ]+/).map(Number)).flatMap(n => Array.from({ length: n.length / 2 }, (_, i) => ({ x: n[2 * i]!, y: n[2 * i + 1]! })))
const dist = (a: { x: number, y: number }, b: { x: number, y: number }) => Math.hypot(a.x - b.x, a.y - b.y)
const obaI = coastPts.reduce((best, p, i) => (dist(p, pt('Oba')) < dist(coastPts[best]!, pt('Oba')) ? i : best), 0)
const east = coastPts[obaI + 1]!.x > coastPts[obaI - 1]!.x ? 1 : -1
const obaMin = ref(52)   /* px, täpsustub measure()-is */
const oba = computed(() => {
  const need = obaMin.value * unit.value, A = pt('Alanya'), O = pt('Oba'), c0 = coastPts[obaI]!
  const off = { x: O.x - c0.x, y: O.y - c0.y }
  let prev = O
  for (let i = obaI; coastPts[i]; i += east) {
    const p = { x: coastPts[i]!.x + off.x, y: coastPts[i]!.y + off.y }
    if (dist(p, A) >= need) {
      const a = dist(prev, A), t = Math.min(1, Math.max(0, (need - a) / (dist(p, A) - a || 1)))
      return { x: prev.x + (p.x - prev.x) * t, y: prev.y + (p.y - prev.y) * t }
    }
    prev = p
  }
  return O
})
/* Gazipaşa lennujaama rõngas: väikesel kaardil nihkub juhtjoont mööda üles, et ei kattuks Gazipaşa ümbrisega */
const ringMin = ref(22)
const gzp = computed(() => {
  const G = pt('Gazipaşa'), R = pt('GZP'), need = ringMin.value * unit.value, dx = R.x - G.x
  return { x: R.x, y: Math.min(R.y, G.y - Math.sqrt(Math.max(0, need * need - dx * dx))) }
})
const pos = (k: string) => (k === 'Oba' ? oba.value : k === 'GZP' ? gzp.value : pt(k))
const airports = [{ key: 'AYT', label: 'Antalya Airport' }, { key: 'GZP', label: 'Gazipaşa–Alanya\nAirport' }]
/* Antalya lennujaama rõnga kaugus Antalya täpist px: silt ei lähe kitsal kaardil Antalya mummu ega nime peale */
const aytGap = computed(() => `${(pt('AYT').x - pt('Antalya').x) / unit.value}px`)
/* Gazipaşa lennujaam: sildi vasak serv ei lähe kitsal kaardil üle rannajoone */
const gzpGap = computed(() => `${11 + 0.0214 * (W / unit.value)}px`)

/* rannajoone katkestus: maski ring iga märgi ümber, raadius px → viewBox-ühikud kaardi tegelikust laiusest */
const fig = ref<HTMLElement | null>(null)
const knock = ref<{ k: string, x: number, y: number, r: number }[]>([])
function measure() {
  const el = fig.value; if (!el) return
  const k = unit.value = W / el.clientWidth
  const px = (n: string) => parseFloat(getComputedStyle(el).getPropertyValue(n)) * parseFloat(getComputedStyle(document.documentElement).fontSize)
  ringMin.value = (px('--map2-dot') + px('--map-ring')) / 2 + px('--map2-halo') + 3
  obaMin.value = (px('--map2-dot') + px('--map2-dot-main')) / 2 + px('--map2-halo') + px('--map2-halo-main') + OBA_GAP
  const gap = parseFloat(getComputedStyle(el).getPropertyValue('--map-knock')) || 0
  knock.value = [...el.querySelectorAll<HTMLElement>('[data-pt]')].filter(m => m.offsetWidth).map(m => {
    const p = pos(m.dataset.pt!); return { k: m.dataset.pt!, x: p.x, y: p.y, r: (m.offsetWidth / 2 + gap) * k }
  })
}
/* Teekonnad lennujaam ↔ Alanya (kasutaja 2026-11-25): kaarjas punktiir, nool mõlemas otsas, sõiduaeg keskel.
   px-koordinaadid siltide tegelikust asukohast, sest otsad toetuvad tekstile; ≤ 700 px lennujaamu ja teekonda pole. */
const ROUTE = { gap: 18, tip: 4, head: 8, half: 3.2, text: 10 }
type Pt = { x: number, y: number }
const ROUTES = [{ k: 'AYT', time: '~ 2 h' }, { k: 'GZP', time: '30–45 min' }]
type Route = { lines: string[], heads: string[], text: Pt, full: string }
const routes = ref<Record<string, Route>>({})
function drawRoute() {
  const el = fig.value; if (!el) return
  const box = el.getBoundingClientRect()
  /* asukoht ilma avangu nihketa (transform) */
  const rect = (sel: string) => { const e = el.querySelector<HTMLElement>(sel)!, r = e.getBoundingClientRect(), m = new DOMMatrix(getComputedStyle(e).transform); return { l: r.left - box.left - m.m41, t: r.top - box.top - m.m42, w: r.width, h: r.height } }
  const A = rect('[data-lbl="Alanya"]'), ayt = rect('[data-lbl="AYT"]'), gzp = rect('[data-lbl="GZP"]')
  if (!ayt.w) { routes.value = {}; return }
  const mid = (r: typeof A) => ({ x: r.l + r.w / 2, y: r.t + r.h / 2 })
  /* Antalya lennujaama sildi kõrvalt Alanya nime kohale keskele */
  const a0 = { x: ayt.l + ayt.w + ROUTE.gap, y: mid(ayt).y }, a3 = { x: mid(A).x, y: A.t - ROUTE.tip }, ad = a3.x - a0.x
  /* Alanya nime paremast küljest Gazipaşa lennujaama sildi kohale */
  const g0 = { x: A.l + A.w + ROUTE.gap * .7, y: mid(A).y }, g3 = { x: mid(gzp).x, y: gzp.t - ROUTE.tip }, gx = g3.x - g0.x, gy = g3.y - g0.y
  routes.value = {
    AYT: curve([a0, { x: a0.x + ad * .32, y: a0.y - ad * .1 }, { x: a0.x + ad * .72, y: a0.y - ad * .04 }, a3], rect('[data-time="AYT"]')),
    GZP: curve([g0, { x: g0.x + gx * .55, y: g0.y - gy * .05 }, { x: g0.x + gx * .94, y: g0.y + gy * .45 }, g3], rect('[data-time="GZP"]'), true),
  }
}
/* back: joonistub lõpust alguse poole (maski tee tagurpidi; negatiivset dashoffset'i vanem Safari ei toeta) */
function curve(P: Pt[], tx: { w: number, h: number }, back = false): Route {
  const at = (t: number): Pt => { const u = 1 - t, f = (k: 'x' | 'y') => u * u * u * P[0]![k] + 3 * u * u * t * P[1]![k] + 3 * u * t * t * P[2]![k] + t * t * t * P[3]![k]; return { x: f('x'), y: f('y') } }
  const N = 240, pts = Array.from({ length: N + 1 }, (_, i) => at(i / N))
  const len = [0]; for (let i = 1; i <= N; i++) len[i] = len[i - 1]! + dist(pts[i]!, pts[i - 1]!)
  const L = len[N]!, m = len.findIndex(v => v >= L / 2), mid = pts[m]!
  const free = (p: Pt) => Math.abs(p.x - mid.x) > tx.w / 2 + ROUTE.text || Math.abs(p.y - mid.y) > tx.h / 2 + ROUTE.text * .6
  const d = (list: Pt[]) => list.length < 2 ? '' : 'M' + list.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L')
  /* joon lõpeb noolepea taga */
  const body = pts.map((p, i) => ({ p, i })).filter(q => len[q.i]! > ROUTE.head && len[q.i]! < L - ROUTE.head)
  const left = body.filter(q => q.i < m && free(q.p)).map(q => q.p), right = body.filter(q => q.i > m && free(q.p)).map(q => q.p)
  const head = (tip: Pt, from: Pt) => {
    const n = dist(tip, from), ux = (tip.x - from.x) / n, uy = (tip.y - from.y) / n, B = { x: tip.x - ux * ROUTE.head, y: tip.y - uy * ROUTE.head }, C = { x: tip.x - ux * ROUTE.head * .72, y: tip.y - uy * ROUTE.head * .72 }
    return [tip, { x: B.x - uy * ROUTE.half, y: B.y + ux * ROUTE.half }, C, { x: B.x + uy * ROUTE.half, y: B.y - ux * ROUTE.half }].map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
  }
  const full = d(back ? [...pts].reverse() : pts)
  return { lines: [d(left.reverse()), d(right)], heads: [head(P[0]!, pts[len.findIndex(v => v >= ROUTE.head)]!), head(P[3]!, pts[len.findIndex(v => v >= L - ROUTE.head)]!)], text: mid, full }
}
/* Vesi (kasutaja 2026-11-25): gradiendi asemel horisontaalsed heledad jooned, tihedamad ranniku ääres ja kaovad merele.
   Canvas, sest joonevahe ja -paksus on px-des igal kaardi laiusel ning läbipaistvus muutub piki joont.
   Läbipaistvus = kaugus rannikust; läänerannikul kitsam riba (HATCH.west). Sildid jäävad joontest vabaks. */
const HATCH = { gap: 3.75, width: .8, peak: .27, reach: .165, west: .4, clear: 16 }
const sea = ref<HTMLCanvasElement | null>(null)
function drawSea() {
  const el = fig.value, cv = sea.value; if (!el || !cv) return
  const w = el.clientWidth, h = el.clientHeight, dpr = window.devicePixelRatio || 1
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr)
  const c = cv.getContext('2d')!, k = w / W
  c.setTransform(dpr, 0, 0, dpr, 0, 0)
  c.strokeStyle = getComputedStyle(cv).color; c.lineWidth = HATCH.width
  /* ainult merel: raam miinus maa */
  const clip = new Path2D()
  clip.addPath(new Path2D(`M0 0H${W}V${H}H0Z ${map.land}`), new DOMMatrix().scale(k, h / H))
  c.save(); c.clip(clip, 'evenodd')

  /* kauguse võrk rannajooneni (px), vahepealne bilineaarselt */
  const cell = 16, gw = Math.ceil(w / cell) + 2, gh = Math.ceil(h / cell) + 2, grid = new Float32Array(gw * gh)
  const ax = pt('Antalya').x * k
  const rough = coastPts.filter((_, i) => i % 3 === 0)   /* kauguse jaoks piisab igast kolmandast punktist */
  const seg = rough.slice(1).map((b, i) => { const a = rough[i]!; return [a.x * k, a.y * k, (b.x - a.x) * k, (b.y - a.y) * k, (a.x + b.x) / 2 * k < ax ? 1 / HATCH.west : 1] as const }).filter(q => Math.hypot(q[2], q[3]) < 160)
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
    const x = i * cell, y = j * cell; let m = 1e9
    for (const [sx, sy, dx, dy, f] of seg) {
      const t = Math.max(0, Math.min(1, ((x - sx) * dx + (y - sy) * dy) / (dx * dx + dy * dy || 1)))
      const ex = x - sx - dx * t, ey = y - sy - dy * t, d = Math.sqrt(ex * ex + ey * ey) * f
      if (d < m) m = d
    }
    grid[j * gw + i] = m
  }
  const far = (x: number, y: number) => {
    const gx = Math.max(0, Math.min(gw - 2, x / cell)), gy = Math.max(0, Math.min(gh - 2, y / cell)), i = gx | 0, j = gy | 0, u = gx - i, v = gy - j, o = j * gw + i
    return (grid[o]! * (1 - u) + grid[o + 1]! * u) * (1 - v) + (grid[o + gw]! * (1 - u) + grid[o + gw + 1]! * u) * v
  }
  /* sildid merel: joon tuhmub sildi ümber ära */
  const box = el.getBoundingClientRect()
  const free = [...el.querySelectorAll<HTMLElement>('[data-lbl="Gazipaşa"], .lbl--sea')].filter(e => e.offsetWidth).map(e => { const r = e.getBoundingClientRect(); return [r.left - box.left, r.top - box.top, r.right - box.left, r.bottom - box.top] as const })
  const open = (x: number, y: number) => free.reduce((m, [l, t, r, b]) => {
    const ex = Math.max(l - x, 0, x - r), ey = Math.max(t - y, 0, y - b); if (ex > 40 || ey > 40) return m; const d = Math.sqrt(ex * ex + ey * ey); return Math.min(m, Math.max(0, Math.min(1, (d - 2) / HATCH.clear)))
  }, 1)
  /* läänerannik vaibub lõuna poole (näidisel sama): kaardi vasak kolmandik, 30–70 % kõrgusest */
  const clamp = (v: number) => Math.max(0, Math.min(1, v))
  /* paremal all jooned vaiksemad: 72 → 92 % kõrgusest kuni 30 % tugevuseni (kasutaja 2026-11-25) */
  const calm = (x: number, y: number) => (1 - clamp((y / h - .3) / .4) * clamp((.45 - x / w) / .2)) * (1 - .7 * clamp((y / h - .72) / .2) * clamp((x / w - .45) / .1))
  let n = 7
  const rnd = () => { n = (n * 16807) % 2147483647; return n / 2147483647 }   /* sama muster igal joonistamisel */
  const reach = Math.max(44, w * HATCH.reach), step = 8
  const inks = Array.from({ length: 48 }, () => new Path2D())   /* sama läbipaistvusega jupid ühe joonistusega */
  for (let y = HATCH.gap / 2; y < h; y += HATCH.gap) {
    const base = y + (rnd() - .5) * .9, phase = rnd() * 6.3, wave = .25 + rnd() * .45, len = 90 + rnd() * 120
    let x = -rnd() * 120
    while (x < w) {
      const run = 50 + rnd() * 210, hand = .6 + rnd() * .4, edge = .78 + rnd() * .42, dy = (rnd() - .5) * .7
      for (let p = x; p < x + run; p += step) {
        const q = Math.min(p + step, x + run), mx = (p + q) / 2
        const t = far(mx, base) / (reach * edge)
        if (t >= 1) continue
        const ends = Math.min(1, (mx - x) / 14, (x + run - mx) / 14)   /* joone otsad peenenevad */
        const a = HATCH.peak * hand * Math.pow(1 - t, 1.35) * ends * open(mx, base) * calm(mx, base)
        if (a < .012) continue
        const ink = inks[Math.min(47, Math.round(a / HATCH.peak * 47))]!
        ink.moveTo(p, base + dy + Math.sin(p / len * 6.3 + phase) * wave); ink.lineTo(q, base + dy + Math.sin(q / len * 6.3 + phase) * wave)
      }
      x += run + rnd() * 10 - 4
    }
  }
  inks.forEach((p, i) => { c.globalAlpha = i / 47 * HATCH.peak; c.stroke(p) })
  c.restore()
}

let ro: ResizeObserver | undefined
let raf = 0
let near = false, io: IntersectionObserver | undefined   /* jooned joonistatakse alles siis, kui kaart on kuni poole ekraani kaugusel: hero avangut ei segata */
const layout = () => { measure(); cancelAnimationFrame(raf); raf = requestAnimationFrame(() => nextTick(() => { drawRoute(); if (near) drawSea() })) }
onMounted(() => { layout(); ro = new ResizeObserver(layout); ro.observe(fig.value!); io = new IntersectionObserver(([e]) => { if (!e!.isIntersecting) return; io!.disconnect(); near = true; layout() }, { rootMargin: '50%' }); io.observe(fig.value!); document.fonts.ready.then(layout) })
onBeforeUnmount(() => { ro?.disconnect(); io?.disconnect(); cancelAnimationFrame(raf) })

/* Faas 5 (MOTION.md, demo kinnitatud 2026-11-24): meri, rannajoon ja merenimi paigal; avanevad kohad kahe sündmusena —
   Antalya + lennujaam · Alanya, Oba, Gazipaşa + lennujaam. Täpp ja rannajoone katkestus (maski ring) tuhmuvad koos,
   nimi tuhmub ja tõuseb; lennujaamad samamoodi.
   Tõus on transform, sest siltide asend on translate'is. */
const title = ref<HTMLElement | null>(null)
/* Teekondade joonistumine (kasutaja kinnitas 2026-11-25, MOTION.md): punktiir avaneb maski tagant lennujaamast Alanya poole; algusnool kohe, sõiduaeg joone keskel, lõpunool joone lõpus */
const DRAW = { AYT: { dur: 1600, delay: 0 }, GZP: { dur: 1000, delay: 800 }, head: 400, time: .4, tip: .75, ease: 'cubic-bezier(.45,0,.35,1)' }
const drawing = ref(false)
type Part = { els: Element[], delay: number, kind: 'fade' | 'rise' | 'line', dur?: number }
function mapUnit(el: HTMLElement, at: number, parts: Part[]): Unit {
  const T = MOTION.text
  const all = parts.flatMap(p => p.els.map(e => ({ e: e as HTMLElement | SVGElement, delay: p.delay, kind: p.kind, dur: p.dur })))
  let anims: Animation[] = []
  const finish = () => {
    anims.forEach(a => a.cancel()); anims = []
    all.forEach(({ e, kind }) => e.style.removeProperty(kind === 'line' ? 'stroke-dashoffset' : 'opacity'))
    if (all.some(a => a.kind === 'line')) drawing.value = false
  }
  return {
    el, at, finish,
    hide() {
      all.forEach(({ e, kind }) => { if (kind === 'line') e.style.strokeDashoffset = '1'; else e.style.opacity = '0' })
      if (all.some(a => a.kind === 'line')) drawing.value = true
    },
    play(delay = 0) {
      anims = all.map(({ e, delay: d, kind, dur }) => e.animate(
        kind === 'line' ? [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }] : kind === 'rise' ? [{ opacity: 0, transform: `translateY(${T.rise}px)` }, { opacity: 1, transform: 'none' }]
          : [{ opacity: 0 }, { opacity: 1 }],
        { duration: dur ?? T.dur, delay: delay + d, easing: kind === 'line' ? DRAW.ease : T.ease, fill: 'both' }))
      Promise.all(anims.map(a => a.finished)).then(finish).catch(() => {})
    },
  }
}
useReveal(() => {
  const box = fig.value!, S = MOTION.text.step
  const q = (sel: string) => [...box.querySelectorAll(sel)]
  const marks = (k: string) => [...q(`[data-pt="${k}"]`), ...q(`[data-knock="${k}"]`)]
  const place = (k: string, delay: number): Part[] => [{ els: marks(k), delay, kind: 'fade' }, { els: q(`[data-lbl="${k}"]`), delay, kind: 'rise' }]
  const airport = (k: string, delay: number): Part[] => [{ els: marks(k), delay, kind: 'fade' }, { els: q(`[data-lbl="${k}"]`), delay, kind: 'rise' }]
  const draw = (k: 'AYT' | 'GZP'): Part[] => {
    const D = DRAW[k], first = k === 'AYT' ? 0 : 1   /* algusnool = lennujaama ots */
    return [
      { els: q(`[data-draw="${k}"]`), delay: D.delay, kind: 'line', dur: D.dur },
      { els: q(`[data-head="${k}-${first}"]`), delay: D.delay, kind: 'fade', dur: DRAW.head },
      { els: q(`[data-time="${k}"]`), delay: D.delay + D.dur * DRAW.time, kind: 'fade', dur: 2 * DRAW.head },
      { els: q(`[data-head="${k}-${1 - first}"]`), delay: D.delay + D.dur * DRAW.tip, kind: 'fade', dur: DRAW.head },
    ]
  }
  const lbl = (k: string) => q(`[data-lbl="${k}"]`)[0] as HTMLElement
  /* Alanya sündmus käivitub, kui täpp on käivitusjoonel; üksuse element on selle kõrgeim silt, et laadimisel juba ekraanil olev silt ei jääks peitu */
  const top = lbl('Alanya')
  const gap = q('[data-pt="Alanya"]')[0]!.getBoundingClientRect().top - top.getBoundingClientRect().top
  return [
    textUnit([title.value!]),
    mapUnit(lbl('Antalya'), MOTION.trigger, [...place('Antalya', 0), ...airport('AYT', S)]),
    mapUnit(top, MOTION.trigger - gap / innerHeight, [...place('Alanya', 0), ...place('Oba', S), ...place('Gazipaşa', 2 * S), ...airport('GZP', 3 * S), ...draw('AYT'), ...draw('GZP')]),
  ]
})
</script>

<template>
  <section id="alanya" class="where sec sec--flush-top" aria-labelledby="where-title">
      <h2 id="where-title" ref="title" class="t-h2 where-title">Where is Alanya?</h2>

      <figure ref="fig" class="map" :style="{ aspectRatio: `${W} / ${H}` }">
        <canvas ref="sea" class="map-sea" aria-hidden="true"></canvas>
        <svg class="map-svg" :viewBox="map.viewBox" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <mask id="map-knock" maskUnits="userSpaceOnUse" x="0" y="0" :width="W" :height="H">
              <rect :width="W" :height="H" fill="white" />
              <circle v-for="c in knock" :key="c.k" :data-knock="c.k" :cx="c.x" :cy="c.y" :r="c.r" fill="black" />
            </mask>
          </defs>
          <path class="coast" :d="map.coast" mask="url(#map-knock)" />
        </svg>

        <svg class="route" aria-hidden="true">
          <defs>
            <mask v-for="(r, k) in routes" :id="`route-${k}`" :key="k" maskUnits="userSpaceOnUse" x="-200" y="-400" width="4000" height="3000">
              <path :d="r.full" :data-draw="k" fill="none" stroke="white" stroke-width="12" pathLength="1" stroke-dasharray="1 1" />
            </mask>
          </defs>
          <template v-for="(r, k) in routes" :key="k">
            <g :mask="drawing ? `url(#route-${k})` : undefined"><path v-for="(l, i) in r.lines" :key="i" :d="l" class="route-l" /></g>
            <polygon v-for="(p, i) in r.heads" :key="i" :data-head="`${k}-${i}`" :points="p" class="route-h" />
          </template>
        </svg>
        <span v-for="r in ROUTES" :key="r.k" :data-time="r.k" aria-hidden="true" class="t-map-time lbl route-t" :style="routes[r.k] ? { left: `${routes[r.k]!.text.x}px`, top: `${routes[r.k]!.text.y}px` } : { visibility: 'hidden' }">{{ r.time }}</span>

        <span class="t-map-sea lbl lbl--sea" :style="pct(pt('sea').x, pt('sea').y)">Mediterranean Sea</span>

        <span v-for="t in towns" :key="t.key" :data-pt="t.key" class="dot" :class="{ 'dot--main': t.main }" :style="pct(pos(t.key).x, pos(t.key).y)" />
        <span v-for="a in airports" :key="a.key" :data-pt="a.key" class="ring" :style="pct(pos(a.key).x, pos(a.key).y)" />

        <span v-for="t in towns" :key="t.key + '-l'" :data-lbl="t.key" class="lbl" :class="[t.main ? 't-map-main' : 't-map-place', `lbl--${t.at}`, t.m && `lbl-m--${t.m}`]" :style="pct(pos(t.key).x, pos(t.key).y)">{{ t.key }}</span>
        <span v-for="a in airports" :key="a.key + '-l'" :data-lbl="a.key" class="t-map-air t-map-air--lines lbl lbl--air" :class="`lbl--${a.key}`" :style="{ ...pct(pos(a.key).x, pos(a.key).y), '--map-air-gap': a.key === 'AYT' ? aytGap : gzpGap }">{{ a.label }}</span>

        <figcaption class="sr-only">Map of the southern Turkish coast: Antalya and Antalya Airport in the west, Alanya and Oba further east, and Gazipaşa–Alanya Airport east of Alanya. By road, Alanya is about two hours from Antalya Airport and 30 to 45 minutes from Gazipaşa–Alanya Airport.</figcaption>
      </figure>
  </section>
</template>

<style scoped>
figure { margin: 0; }
/* sama telg mis „Why Memoshome" pealkirjal: 5. veerg + --gutter (kasutaja 2026-11-24) */
.where-title { margin-left: calc((100% + var(--gutter)) * 4 / var(--cols) + var(--gutter)); }
.map { position: relative; margin-top: var(--head-gap); }
.map-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.map-sea { position: absolute; inset: 0; width: 100%; height: 100%; display: block; color: var(--ink); pointer-events: none; }
.coast { fill: none; stroke: var(--map-coast); stroke-width: var(--hair); vector-effect: non-scaling-stroke; stroke-linejoin: round; }

/* täpid ja rõngad keskpunktiga koordinaadil */
.dot, .ring { position: absolute; translate: -50% -50%; border-radius: 50%; }
.dot { width: var(--map2-dot); height: var(--map2-dot); background: var(--accent); box-shadow: 0 0 0 var(--map2-halo) var(--map-halo-color); }
.dot--main { width: var(--map2-dot-main); height: var(--map2-dot-main); box-shadow: 0 0 0 var(--map2-rim) var(--ground), 0 0 0 var(--map2-halo-main) var(--map-halo-color); }
.ring { width: var(--map-ring); height: var(--map-ring); border: var(--hair) solid var(--map-leader); background: var(--map-land); }

.lbl { position: absolute; white-space: nowrap; color: var(--ink); }
.lbl--up-far { translate: -50% calc(-100% - var(--map2-r-main) - var(--s-2)); }
.lbl--right { translate: calc(var(--map2-r) + var(--s-2)) calc(-50% - var(--map2-oba-up)); }   /* kitsamal kaardil veidi kõrgemal: ruum Gazipaşa lennujaama sildile */
.lbl--up-left { translate: calc(-100% - var(--map2-r) - var(--s-1)) calc(-50% - var(--map2-r) - var(--s-2) - var(--s-0)); }
.lbl--AYT { translate: max(-50%, calc(var(--map2-r) + var(--s-0) - var(--map-air-gap))) calc(-100% - var(--map-ring) / 2 - var(--s-1)); }
.lbl--GZP { translate: max(-50%, calc(-1 * var(--map-air-gap))) calc(-100% - var(--map-ring) / 2 - var(--s-1)); }
.lbl--left { translate: calc(-100% - var(--map2-r) - var(--s-4) - var(--s-2)) -50%; }
.lbl--air { color: var(--map-leader); white-space: pre; text-align: center; }
.lbl--sea { translate: -50% calc(-50% + var(--map2-sea-drop)); color: var(--map-sea-label); }

/* teekond: kaardi px-koordinaadid, võib ulatuda kaardi ülaservast välja */
.route { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.route-l { fill: none; stroke: var(--ink); stroke-width: var(--hair); stroke-dasharray: var(--map2-dash); }
.route-h { fill: var(--ink); }
.route-t { translate: -50% -50%; }

.sr-only { position: absolute; width: var(--hair); height: var(--hair); overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

@media (max-width: 900px) {
  .where-title { margin-left: 0; }
}

/* telefon: lennujaamu kaardil pole (kasutaja 2026-11-24); nimed ja sõiduajad on kohe järgmises sektsioonis (CoastSection) */
@media (max-width: 700px) {
  .lbl--air, .ring, .route, .route-t { display: none; }
  .lbl--up-left { translate: -50% calc(-100% - var(--map2-r) - var(--s-2)); }   /* vasakul läheks ekraani serva */
  .lbl-m--sea { translate: calc(-100% - var(--map2-r) - var(--s-1)) var(--s-1); }   /* paremale ei mahu: alla vasakule merre, rannajoonest lahti */
}
</style>
