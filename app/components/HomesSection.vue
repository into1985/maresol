<script setup lang="ts">
/* Faas 2.4 „Choosing a home", A „Astmed" (kasutaja Photoshopi kavand 2026-11-22).
   Vasakul pealkiri + lead + joon + hinnalause (1–4), püstjoon, paremal kolm veergu; fotod kõrgenevad
   (1 : 1 → 4 : 5 → 2 : 3), alaservad ühel joonel, fotol teksti pole (kasutaja 2026-11-22); all kategooria + tekst + näide.
   Näide-link Maresolile = kohatäide. Testvariandid (0, B, C) ja lüliti eemaldatud enne live'i (2026-11-23). Fotod ajutised. */
const intro = 'Through Maresol you can choose from new homes Memoshome is still building, where you can buy early and pay in stages, and finished homes across Alanya, ready to use.'
const kinds = [
  { key: 'sea', lines: ['Apartments by', 'the sea'], text: 'Furnished apartments a short walk from the beach, in complexes with pools and a hamam. Easy to use for a few weeks at a time and, where allowed, to rent out while you are away.', cta: 'View apartments', src: '/images/content/apartments.webp', w: 1254, h: 1254, alt: 'Renda Park, a completed Memoshome residential complex in Oba' },
  { key: 'view', lines: ['New homes', 'with a view'], text: 'New complexes on the slopes above Oba and the coast, looking out to the Taurus Mountains and the sea, from one-bedroom apartments to garden and penthouse duplexes, many with smart-home systems.', cta: 'View new homes', src: '/images/content/homes.webp', w: 1122, h: 1402, alt: 'Hermes Garden, a Memoshome residential project in Oba' },
  { key: 'villa', lines: ['Villas on', 'the hill'], text: 'Private houses above Alanya with their own pools, terraces and views across the coast. Room for family and guests, and enough privacy to feel far from the town below.', cta: 'View villas', src: '/images/content/villas.webp', w: 1024, h: 1536, alt: 'Prada Villas, hilltop villas with private infinity pools in Bektaş' },
]

/* Faas 5 (MOTION.md, kasutaja 2026-11-23): pealkiri + lead · joon + hinnalause · kolm fotot rühmana (trigger = kõrgeim foto,
   vasakult paremale .12 s) · kaartide tekstid rühmana (iga kaart tervikuna). ≤ 900 px kaardid üksteise all → iga foto ja tekst oma triggeril. */
const root = ref<HTMLElement | null>(null)
useReveal(() => {
  const r = root.value!
  const q = <T extends HTMLElement>(s: string) => r.querySelector<T>(s)!
  const items = [...r.querySelectorAll<HTMLElement>('.a-item')]
  const photos = items.map(i => photoUnit(i.querySelector<HTMLElement>('.a-photo')!))
  const texts = items.map(i => textUnit([...i.querySelectorAll<HTMLElement>('.a-title, .title-text, .ex')], 0))
  const intro = [textUnit([q('#homes-title'), q('.intro .t-lead')]), textUnit([q('.intro .rule'), q('.intro .is-soft')], 0)]
  if (matchMedia('(max-width: 900px)').matches) return [...intro, ...items.flatMap((_, i) => [photos[i]!, texts[i]!])]
  const tallest = items.map(i => i.querySelector<HTMLElement>('.a-photo')!).sort((x, y) => x.getBoundingClientRect().top - y.getBoundingClientRect().top)[0]
  return [...intro, groupUnit(photos, MOTION.group, tallest), groupUnit(texts)]
})
</script>

<template>
  <section id="homes" ref="root" class="ch sec sec--flush-top" aria-labelledby="homes-title">
    <div class="grid">
      <div class="intro">
        <h2 id="homes-title" class="t-h2">Choosing a home</h2>
        <p class="t-lead title-lead">{{ intro }}</p>
        <span class="rule" aria-hidden="true" />
        <p class="t-body is-soft">Prices range from around €85,000 for a one-bedroom apartment to over €4 million for a villa.</p>
      </div>

      <ul class="kinds a" role="list">
        <li v-for="(k, i) in kinds" :key="k.key" class="a-item" :style="{ '--i': i }">
          <div class="a-top">
            <figure class="photo a-photo">
              <img :src="k.src" :alt="k.alt" :width="k.w" :height="k.h" loading="lazy" decoding="async" />
            </figure>
          </div>
          <h3 class="t-h3 a-title"><span class="ln">{{ k.lines[0] }}</span> <span class="ln">{{ k.lines[1] }}</span></h3>
          <p class="t-body title-text">{{ k.text }}</p>
          <p class="t-body ex"><a class="link u-link" href="#" @click.prevent><span>{{ k.cta }} <span class="arr" aria-hidden="true">→</span></span></a></p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
figure { margin: 0; }
p, h3, ul { margin-block: 0; }
ul { padding: 0; list-style: none; }
.title-lead { margin-top: var(--title-lead); }   /* base.css väärtus; kohalik p-nullimine kirjutas selle üle */
.title-text { margin-top: var(--title-text); }   /* t-h3 → oma tekst, sama mis Ownership */
.grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gutter); }
.photo img { width: 100%; height: 100%; object-fit: cover; display: block; }

.intro { grid-column: 1 / 5; align-self: center; }
.rule { display: block; width: var(--head-gap); margin-block: var(--head-gap) var(--title-lead); border-top: var(--hair) solid var(--rule); }
.kinds { grid-column: 5 / 13; padding-left: var(--gutter); border-left: var(--hair) solid var(--rule); }
.ex { margin-top: var(--title-lead); }
.link { color: var(--accent); cursor: pointer; }   /* joon: base.css .u-link; hoveril siin kiri ink + nool paremale (kasutaja 2026-11-23) */
.arr { display: inline-block; transition: translate var(--dur-line) var(--ease-ui); }
@media (hover: hover) and (pointer: fine) {
  .link:hover { color: var(--ink); }
  .link:hover .arr { translate: var(--arrow-shift) 0; }
}

/* „Astmed": fotod kõrgenevad, alaservad ühel joonel */
.a { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: auto auto auto auto; column-gap: var(--gutter); }
.a-item { display: grid; grid-row: span 4; grid-template-rows: subgrid; }
.a-top { align-self: end; }
.a-photo { position: relative; aspect-ratio: 1; }
.a-item:nth-child(2) .a-photo { aspect-ratio: 4 / 5; }
.a-item:nth-child(3) .a-photo { aspect-ratio: 2 / 3; }
.a-title { margin-top: var(--gap); }   /* foto → oma nimi: üks kaart (--head-gap oli sektsiooni rolli vahe, mõjus pärast --title-text-i liiga suurena) */
/* Kaks rida etteantud kohast (kasutaja 2026-11-22: „the hill" teisele reale nagu teistel), aga ainult kui veerg mahutab
   pikima esimese rea („Apartments by" ≈ 6.15 × t-h3; t-h3 on ≤ 1300 px juures 26 px → 160 px). Kitsamas veerus
   (~900–985 px ekraan) tavaline murdumine, muidu läheks pealkiri kolmele reale. */
.a-title { container-type: inline-size; }   /* NB: mitte .a-item-il — konteiner lülitab subgridi välja */
@container (min-width: 10.25rem) { .a-title .ln { display: block; } }   /* veeru laius, mitte ekraani murdepunkt */

@media (max-width: 900px) {
  .grid { grid-template-columns: minmax(0, 1fr); }
  .intro, .kinds { grid-column: 1; grid-row: auto; }
  .intro > .t-lead { margin-top: var(--title-gap); }   /* pealkiri → lead: ühine mobiilivahe */
  .kinds { padding-left: 0; border-left: 0; margin-top: var(--head-gap); }
  .a { grid-template-columns: minmax(0, 1fr); grid-template-rows: none; row-gap: var(--head-gap); }
  .a-item { display: block; grid-row: auto; }
  .a-title .ln { display: inline; }   /* telefonis tavaline murdumine */
  .a-item .a-photo, .a-item:nth-child(n) .a-photo { aspect-ratio: 1; }   /* mobiilis ruut (kasutaja 2026-11-23) */
}
</style>
