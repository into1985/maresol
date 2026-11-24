<script setup lang="ts">
/* „Where is Alanya?" (kasutaja 2026-11-24): asukohakaart Why ja Coast vahel; menüülink „Alanya" viitab siia (id="alanya").
   Kaart: OSM natural=coastline (Overpass), Web Mercator; andmed app/data/alanya-map.json (genereerib _demo/alanya-map/build.py,
   skript ja toorandmed repo-sse ei lähe). OSM-i viidet ei lisata (kasutaja otsus).
   Punktid OSM-i koordinaatidest (place=city/town/village, aeroway=aerodrome AYT / GZP), mitte peast.
   Kaardiala: Antalya ja Gazipaşa samal kaugusel külgservadest. Värvid ja suurused --map-* tokenitest (tokens.css),
   sildid rollidega .t-map-* (base.css).
   v2 (kasutaja 2026-11-24): rannajoon katkeb täppide ümber (mask, täpp jääb õigele kohale); Alanya suurim, teised väiksemad;
   lennujaamad ilma lühenditeta, nimi kaardi tühjal maa-alal juhtjoonega; „Mediterranean Sea" Antalya lahe keskel vesimärgina. */
import map from '~/data/alanya-map.json'

const [, , W, H] = map.viewBox.split(' ').map(Number) as [number, number, number, number]
const pct = (x: number, y: number) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` })
const P = map.points as Record<string, { x: number, y: number }>
const pt = (k: string) => P[k]!

/* sildi asend täpi suhtes: up = kohal keskel, up-start = kohal, algab täpist (rõngas jääb vasakule), right = paremal */
const towns = [
  { key: 'Antalya', at: 'up' },
  { key: 'Alanya', at: 'up-far', main: true },   /* ≥ 10 px kõrgemal kui teised: Oba ja Alanya ei kobardu */
  { key: 'Oba', at: 'right' },
  { key: 'Gazipaşa', at: 'right', m: 'sea' },   /* kohal puutus lennujaama rõngast; paremal on nüüd sama varu kui Antalyal vasakul */
]
/* juhtjoon lennujaamast kaardi tühjale maa-alale (viewBox-ühikutes); silt joone otsas */
/* Gazipaşa juhtjoon: vähemalt 283 ühikut; väiksemal kaardil lõpeb 56 px Alanya täpist kõrgemal (1440 juures sama), et silt ei läheks Alanya nime vastu */
const unit = ref(W / 1300)   /* viewBox-ühikut ühe px kohta, täpsustub measure()-is */
const gzpLine = computed(() => Math.max(283, pt('GZP').y - pt('Alanya').y + 56 * unit.value))
const airports = computed(() => [
  { key: 'AYT', label: 'Antalya Airport', at: 'end-right',
    line: [[pt('AYT').x, pt('AYT').y], [pt('AYT').x + 262, pt('AYT').y]] },   /* otse paremale, ilma jõnksuta (kasutaja 2026-11-24) */
  { key: 'GZP', label: 'Gazipaşa–Alanya Airport', at: 'end-up',
    line: [[pt('GZP').x, pt('GZP').y], [pt('GZP').x, pt('GZP').y - gzpLine.value]] },
])
const end = (a: typeof airports.value[number]) => a.line[a.line.length - 1]!

/* rannajoone katkestus: maski ring iga märgi ümber, raadius px → viewBox-ühikud kaardi tegelikust laiusest */
const fig = ref<HTMLElement | null>(null)
const knock = ref<{ k: string, x: number, y: number, r: number }[]>([])
function measure() {
  const el = fig.value; if (!el) return
  const k = unit.value = W / el.clientWidth
  const gap = parseFloat(getComputedStyle(el).getPropertyValue('--map-knock')) || 0
  knock.value = [...el.querySelectorAll<HTMLElement>('[data-pt]')].filter(m => m.offsetWidth).map(m => {
    const p = pt(m.dataset.pt!); return { k: m.dataset.pt!, x: p.x, y: p.y, r: (m.offsetWidth / 2 + gap) * k }
  })
}
let ro: ResizeObserver | undefined
onMounted(() => { measure(); ro = new ResizeObserver(measure); ro.observe(fig.value!) })
onBeforeUnmount(() => ro?.disconnect())

/* Faas 5 (MOTION.md, demo kinnitatud 2026-11-24): meri, rannajoon ja merenimi paigal; avanevad kohad kahe sündmusena —
   Antalya + lennujaam · Alanya, Oba, Gazipaşa + lennujaam. Täpp ja rannajoone katkestus (maski ring) tuhmuvad koos,
   nimi tuhmub ja tõuseb; lennujaama punktiir avaneb rõngast sildi poole (mask), silt joone järel.
   Tõus on transform, sest siltide asend on translate'is. */
const LEADER = 800
const title = ref<HTMLElement | null>(null)
const leadMasked = ref(0)   /* > 0: mõni juhtjoon on veel maski taga; lõpus mask maha */
type Part = { els: Element[], delay: number, kind: 'fade' | 'rise' | 'line' }
function mapUnit(el: HTMLElement, at: number, parts: Part[]): Unit {
  const T = MOTION.text
  const all = parts.flatMap(p => p.els.map(e => ({ e: e as HTMLElement | SVGElement, delay: p.delay, kind: p.kind })))
  let anims: Animation[] = []
  let masked = false
  const unmask = () => { if (masked) { masked = false; leadMasked.value-- } }
  const finish = () => {
    anims.forEach(a => a.cancel()); anims = []
    all.forEach(({ e, kind }) => e.style.removeProperty(kind === 'line' ? 'stroke-dashoffset' : 'opacity'))
    unmask()
  }
  return {
    el, at, finish,
    hide() {
      all.forEach(({ e, kind }) => { if (kind === 'line') e.style.strokeDashoffset = '1'; else e.style.opacity = '0' })
      if (!masked) { masked = true; leadMasked.value++ }
    },
    play(delay = 0) {
      anims = all.map(({ e, delay: d, kind }) => e.animate(
        kind === 'line' ? [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }]
          : kind === 'rise' ? [{ opacity: 0, transform: `translateY(${T.rise}px)` }, { opacity: 1, transform: 'none' }]
            : [{ opacity: 0 }, { opacity: 1 }],
        { duration: kind === 'line' ? LEADER : T.dur, delay: delay + d, easing: kind === 'line' ? MOTION.photo.ease : T.ease, fill: 'both' }))
      Promise.all(anims.map(a => a.finished)).then(finish).catch(() => {})
    },
  }
}
useReveal(() => {
  const box = fig.value!, S = MOTION.text.step
  const q = (sel: string) => [...box.querySelectorAll(sel)]
  const marks = (k: string) => [...q(`[data-pt="${k}"]`), ...q(`[data-knock="${k}"]`)]
  const place = (k: string, delay: number): Part[] => [{ els: marks(k), delay, kind: 'fade' }, { els: q(`[data-lbl="${k}"]`), delay, kind: 'rise' }]
  const airport = (k: string, delay: number): Part[] => [{ els: marks(k), delay, kind: 'fade' }, { els: q(`[data-lead="${k}"]`), delay, kind: 'line' }, { els: q(`[data-lbl="${k}"]`), delay: delay + 2 * S, kind: 'fade' }]
  const lbl = (k: string) => q(`[data-lbl="${k}"]`)[0] as HTMLElement
  /* Alanya sündmus käivitub, kui täpp on käivitusjoonel; üksuse element on selle kõrgeim silt, et laadimisel juba ekraanil olev silt ei jääks peitu */
  const top = lbl('GZP').offsetWidth ? lbl('GZP') : lbl('Alanya')
  const gap = q('[data-pt="Alanya"]')[0]!.getBoundingClientRect().top - top.getBoundingClientRect().top
  return [
    textUnit([title.value!]),
    mapUnit(lbl('Antalya'), MOTION.trigger, [...place('Antalya', 0), ...airport('AYT', S)]),
    mapUnit(top, MOTION.trigger - gap / innerHeight, [...place('Alanya', 0), ...place('Oba', S), ...place('Gazipaşa', 2 * S), ...airport('GZP', 3 * S)]),
  ]
})
</script>

<template>
  <section id="alanya" class="where sec sec--flush-top" aria-labelledby="where-title">
      <h2 id="where-title" ref="title" class="t-h2 where-title">Where is Alanya?</h2>

      <figure ref="fig" class="map" :style="{ aspectRatio: `${W} / ${H}` }">
        <svg class="map-svg" :viewBox="map.viewBox" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <mask id="map-knock" maskUnits="userSpaceOnUse" x="0" y="0" :width="W" :height="H">
              <rect :width="W" :height="H" fill="white" />
              <circle v-for="c in knock" :key="c.k" :data-knock="c.k" :cx="c.x" :cy="c.y" :r="c.r" fill="black" />
            </mask>
            <!-- avangu mask: punktiir avaneb rõngast sildi poole (kehtib ainult avangu ajal) -->
            <mask id="map-lead" maskUnits="userSpaceOnUse" x="0" y="0" :width="W" :height="H">
              <polyline v-for="a in airports" :key="a.key" :data-lead="a.key" :points="a.line.map(p => p.join(' ')).join(' ')" fill="none" stroke="white" :stroke-width="Math.max(10, 5 * unit)" pathLength="1" stroke-dasharray="1 1" />
            </mask>
            <!-- meri: ülal --map-sea, alla sulandub lehe tausta (kasutaja 2026-11-24) -->
            <linearGradient id="map-sea-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" class="sea-stop" />
              <stop offset=".4" class="sea-stop" />
              <stop offset="1" class="sea-stop sea-stop--end" />
            </linearGradient>
          </defs>
          <!-- meri = raam miinus maa (evenodd): maa all pole merd, servas ei teki silumisjoont; maa = lehe taust -->
          <path class="sea" :d="`M0 0H${W}V${H}H0Z ${map.land}`" fill="url(#map-sea-fade)" fill-rule="evenodd" />
          <path class="coast" :d="map.coast" mask="url(#map-knock)" />
          <polyline v-for="a in airports" :key="a.key" class="leader" :mask="leadMasked ? 'url(#map-lead)' : undefined" :points="a.line.map(p => p.join(' ')).join(' ')" />
        </svg>

        <span class="t-map-sea lbl lbl--sea" :style="pct(pt('sea').x, pt('sea').y)">Mediterranean Sea</span>

        <span v-for="t in towns" :key="t.key" :data-pt="t.key" class="dot" :class="{ 'dot--main': t.main }" :style="pct(pt(t.key).x, pt(t.key).y)" />
        <span v-for="a in airports" :key="a.key" :data-pt="a.key" class="ring" :style="pct(pt(a.key).x, pt(a.key).y)" />

        <span v-for="t in towns" :key="t.key + '-l'" :data-lbl="t.key" class="lbl" :class="[t.main ? 't-map-main' : 't-map-place', `lbl--${t.at}`, t.m && `lbl-m--${t.m}`]" :style="pct(pt(t.key).x, pt(t.key).y)">{{ t.key }}</span>
        <span v-for="a in airports" :key="a.key + '-l'" :data-lbl="a.key" class="t-map-air lbl lbl--air" :class="`lbl--${a.at}`" :style="pct(end(a)[0]!, end(a)[1]!)">{{ a.label }}</span>

        <figcaption class="sr-only">Map of the southern Turkish coast: Antalya and Antalya Airport in the west, Alanya and Oba further east, and Gazipaşa–Alanya Airport east of Alanya.</figcaption>
      </figure>
  </section>
</template>

<style scoped>
figure { margin: 0; }
/* sama telg mis „Why Memoshome" pealkirjal: 5. veerg + --gutter (kasutaja 2026-11-24) */
.where-title { margin-left: calc((100% + var(--gutter)) * 4 / var(--cols) + var(--gutter)); }
.map { position: relative; margin-top: var(--head-gap); }
.map-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.sea-stop { stop-color: var(--map-sea); }
.sea-stop--end { stop-color: var(--map-sea-end); }
.coast { fill: none; stroke: var(--map-coast); stroke-width: var(--hair); vector-effect: non-scaling-stroke; stroke-linejoin: round; }
.leader { fill: none; stroke: var(--map-leader); stroke-width: var(--hair); stroke-dasharray: var(--map-dash); vector-effect: non-scaling-stroke; }

/* täpid ja rõngad keskpunktiga koordinaadil */
.dot, .ring { position: absolute; translate: -50% -50%; border-radius: 50%; }
.dot { width: var(--map-dot); height: var(--map-dot); background: var(--accent); }
.dot--main { width: var(--map-dot-main); height: var(--map-dot-main); box-shadow: 0 0 0 var(--map-halo) var(--map-halo-color); }
.ring { width: var(--map-ring); height: var(--map-ring); border: var(--hair) solid var(--map-leader); background: var(--map-land); }

.lbl { position: absolute; white-space: nowrap; color: var(--ink); }
.lbl--up { translate: -50% calc(-100% - var(--s-3)); }
.lbl--up-far { translate: -50% calc(-100% - 2 * var(--s-3)); }
.lbl--up-start { translate: calc(-1 * var(--s-1)) calc(-100% - var(--s-3)); }
.lbl--right { translate: var(--s-3) -50%; }
.lbl--air { color: var(--map-leader); }
.lbl--end-right { translate: var(--s-2) -50%; }
.lbl--end-up { translate: -50% calc(-100% - var(--s-1)); }
.lbl--sea { translate: -50% -50%; color: var(--map-sea-label); }

.sr-only { position: absolute; width: var(--hair); height: var(--hair); overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

@media (min-width: 901px) {
  .lbl--sea { translate: -50% calc(-50% + max(3.25rem, var(--head-gap))); }
}

@media (max-width: 900px) {
  .where-title { margin-left: 0; }
}

/* telefon: lennujaamu kaardil pole (kasutaja 2026-11-24); nimed ja sõiduajad on kohe järgmises sektsioonis (CoastSection) */
@media (max-width: 700px) {
  .leader, .lbl--air, .ring { display: none; }
  .lbl--up { translate: -50% calc(-100% - var(--s-2)); }
  .lbl--up-far { translate: -50% calc(-100% - 2 * var(--s-2)); }
  .lbl--up-start { translate: calc(-1 * var(--s-1)) calc(-100% - var(--s-2)); }
  .lbl--right { translate: var(--s-2) -50%; }
  .lbl-m--sea { translate: calc(-100% - var(--s-2)) var(--s-2); }   /* paremale ei mahu: alla vasakule merre, rannajoonest lahti */
}
</style>
