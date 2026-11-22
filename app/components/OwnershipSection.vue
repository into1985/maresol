<script setup lang="ts">
/* Faas 2.6 „A complete ownership experience" (viimistletud 2026-11-22, demo /_demo/ownership-refine).
   Pealkiri, lead, read ja märkus vasakus veerus (1–7); foto paremal (8–13) algab pealkirja ülaservast,
   kõrgus ≤ 78 svh, kleepub ja kerib kaasa kogu vasaku veeru ulatuses (lõpus allkiri märkuse joonel).
   Foto ja allkiri vahetuvad aktiivse rea järgi: kerimisel keskjoon, hiirega päris liigutusel.
   Telefonis foto iga rea juures. Fotod images/content/ (1122 × 1402). */
const items = [
  { key: 'arrive', name: 'Before you arrive', text: 'A transfer from the airport whatever time you land, the home cleaned and ready, and groceries in the fridge when you walk in.', src: '/images/content/arrive-home.webp', alt: 'A traveller with a suitcase walking to a car waiting with its door open at the airport' },
  { key: 'there', name: 'While you are there', text: 'Where the complex has the facilities, massage and hamam treatments can be arranged with staff who visit.', src: '/images/content/own-there.webp', alt: 'A therapist preparing a massage table on a terrace above the sea' },
  { key: 'away', name: 'While you are away', text: "Regular inspections and upkeep, and Memoshome's own team for repairs, from plumbing and electrics to air conditioning and the garden.", src: '/images/content/own-away.webp', alt: 'A property manager checking her notes by the pool while a gardener tends the lawn' },
  { key: 'rent', name: 'If you rent it out', text: 'Help organising lettings, cleaning and changeovers between guests, and the practical side of hosting.', src: '/images/content/own-rent.webp', alt: 'A bright living room and dining table set for guests, with open doors to a terrace and the hills' },
  { key: 'year', name: 'All year', text: 'The owner app shows your bills, payments, property expenses and rental income in one place. You can order services through it, and reach the team around the clock if something urgent comes up.', src: '/images/content/owner-app.webp', alt: 'An owner checking bills and payments in the owner app on his phone, on a terrace above the bay' },
]
const active = ref(0)
let last = { x: -1, y: -1 }
const onMove = (i: number, e: PointerEvent) => {
  if (e.pointerType !== 'mouse' || (e.clientX === last.x && e.clientY === last.y)) return
  last = { x: e.clientX, y: e.clientY }
  active.value = i
}
const rows = ref<HTMLElement[]>([])
let raf = 0
const pickByScroll = () => {
  raf = 0
  const mid = window.innerHeight * .6   /* vahetusjoon 60 %: „All year" vahetub, kui foto on veel kleepunud (keskjoonel alles pärast sticky lõppu, 70 % juures read 2–3 enne kleepumist) */
  let best = 0
  rows.value.forEach((el, i) => { if (el.getBoundingClientRect().top <= mid) best = i })
  const end = rows.value.length - 1
  if (end >= 0 && rows.value[end]!.getBoundingClientRect().bottom <= window.innerHeight && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) best = end
  if (best !== active.value) active.value = best
}
const onScroll = () => { if (!raf) raf = requestAnimationFrame(pickByScroll) }
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); pickByScroll() })
onBeforeUnmount(() => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) })
</script>

<template>
  <section id="ownership" class="own sec sec--flush-top" aria-labelledby="own-title">
    <div class="grid">
      <div class="text">
        <h2 id="own-title" class="t-h2">A complete ownership experience</h2>
        <p class="t-lead title-lead">Most of what a home abroad needs happens while you are somewhere else.</p>
        <ul class="list" role="list">
          <li v-for="(it, i) in items" :key="it.key" ref="rows" class="row" :class="{ 'is-active': active === i }" @pointermove="onMove(i, $event)">
            <h3 class="t-h3">{{ it.name }}</h3>
            <p class="t-body row-text">{{ it.text }}</p>
            <figure class="inline photo r-landscape"><img :src="it.src" :alt="it.alt" width="1122" height="1402" loading="lazy" decoding="async" /></figure>
          </li>
        </ul>
        <p class="note t-note is-soft">Services vary from property to property and are confirmed for each home.</p>
      </div>
      <div class="stage-col" aria-hidden="true">
        <figure class="stage">
          <div class="frame photo r-portrait">
            <img v-for="(it, i) in items" :key="it.key" :src="it.src" alt="" :class="{ 'is-on': active === i }" width="1122" height="1402" loading="lazy" decoding="async" />
          </div>
          <figcaption class="cap t-label">
            <span v-for="(it, i) in items" :key="it.key" :class="{ 'is-on': active === i }">{{ it.name }}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
figure { margin: 0; }
p, h2, h3, ul { margin-block: 0; }
ul { padding: 0; list-style: none; }
.title-lead { margin-top: var(--title-lead); }
.grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gutter); }

.text { grid-column: 1 / 7; }
.list { margin-top: var(--head-gap); }
.row { padding-block: var(--gap); border-top: var(--hair) solid var(--rule); transition: border-top-color var(--dur-ui) var(--ease-ui); }
.row:last-child { border-bottom: var(--hair) solid var(--rule); }
.row.is-active { border-top-color: var(--ink); }
.row-text { margin-top: var(--title-text); }
.inline { display: none; }
.note { padding-top: var(--gap); }

/* veerg venib kogu vasaku veeru kõrguseks → sticky kerib kaasa kuni märkuse jooneni */
.stage-col { grid-column: 8 / 13; }
.stage { position: sticky; top: var(--head-gap); width: min(100%, var(--sticky-photo-w)); }
.frame { display: grid; }
.frame > img { grid-area: 1 / 1; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity var(--dur-ui) var(--ease-ui); }
.frame > img.is-on { opacity: 1; }
.cap { display: grid; margin-top: var(--s-3); }
.cap > span { grid-area: 1 / 1; opacity: 0; transition: opacity var(--dur-ui) var(--ease-ui); }
.cap > span.is-on { opacity: 1; }

@media (max-width: 900px) {
  .grid { grid-template-columns: minmax(0, 1fr); }
  .text { grid-column: 1; }
  .row.is-active { border-top-color: var(--rule); }
  .inline { display: block; min-height: 0; margin-top: var(--title-lead); }   /* block + min-height 0: 3 : 2 kärbe (cover), mitte püstfoto loomulik kõrgus */
  .stage-col { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .frame > img, .cap > span, .row { transition: none; }
}
</style>
