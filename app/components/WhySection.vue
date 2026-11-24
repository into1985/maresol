<script setup lang="ts">
/* 2. Why Memoshome (copy uuendatud 2026-11-24) —uus paigutus kasutaja Photoshopi kavandi järgi (2026-11-22), asendas demo G „Pealkiri üle".
   Suur püstfoto 3 : 4 veergudes 1–4; pealkiri + tekst veergudes 5–9 (vasak serv = Coasti / Homesi püstjoone
   järgne telg: 5. veerg + --gutter); väike ruutfoto 1 : 1 veergudes 11–12.
   Pealkiri + tekst üks plokk (vahe --head-gap), teksti ja väikese foto alaserv = suure foto alaserv. Kui tekst on
   fotost kõrgem, venib suur foto rea kõrguseni (vahekast + absoluutne img).
   Mõlemad fotod ajutised; kasutaja vahetab väikese foto teemaga sobiva vastu (nt ehitusplats). */
const lead = 'Buying a home abroad is easier when the people who built it are still there after the sale.'
const body = [
  'Memoshome develops and builds its own projects, sells the homes and continues managing the complexes once owners move in. That means there is a local team on the ground who already knows the property, the building and how everything works.',
  'Since 2000, Memoshome has completed 48 projects in and around Alanya, giving owners something especially valuable when buying abroad: continuity before, during and after the purchase.',
  'Maresol brings this together for its clients, backed by Skippern Yachts and its experience with long-term ownership and management.'
]

/* Faas 5 (MOTION.md, kinnitatud demo B 2026-11-23): suur foto · pealkiri + tekst · väike foto oma triggeril;
   väike foto liigub kerimisel kiiremini (ankur = ruudustik, keskel nihe 0 → alaservad ühel joonel). */
const grid = ref<HTMLElement | null>(null)
const big = ref<HTMLElement | null>(null)
const small = ref<HTMLElement | null>(null)
const title = ref<HTMLElement | null>(null)
const text = ref<HTMLElement | null>(null)
useReveal(() => [photoUnit(big.value!), textUnit([title.value!, text.value!]), photoUnit(small.value!)])
useDrift(() => (small.value && grid.value ? { el: small.value, anchor: grid.value } : null))
</script>

<template>
  <section id="memoshome" class="why sec" aria-labelledby="why-title">
    <div ref="grid" class="why-grid">
      <figure ref="big" class="why-photo photo">
        <span class="why-ratio r-tall" aria-hidden="true"></span>
        <img src="/images/content/why-complex.webp" alt="A Memoshome villa in Alanya, with its pool and garden terrace" width="1122" height="1402" loading="lazy" decoding="async" />
      </figure>
      <div class="why-main">
        <h2 id="why-title" ref="title" class="t-h2">Why Memoshome</h2>
        <div ref="text" class="why-text">
          <p class="t-lead">{{ lead }}</p>
          <p v-for="(para, i) in body" :key="i" class="t-body title-lead">{{ para }}</p>
        </div>
      </div>
      <figure ref="small" class="why-small photo">
        <img src="/images/content/developing.webp" alt="A Memoshome building site on the hillside in Alanya, with concrete pumps at work" width="1254" height="1254" loading="lazy" decoding="async" />
      </figure>
    </div>
  </section>
</template>

<style scoped>
figure { margin: 0; }
p { margin-block: 0; }
.title-lead { margin-top: var(--title-lead); }   /* base.css väärtus; kohalik p-nullimine kirjutas selle üle */
.why-grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gutter); }

.why-photo { grid-column: 1 / 5; grid-row: 1; position: relative; }
.why-ratio { display: block; }
.why-photo img { position: absolute; inset: 0; }

/* pealkiri + tekst üks plokk, joondatud foto alaserva; vaba ruum jääb pealkirja kohale (kasutaja 2026-11-22).
   Vahe pealkiri → oma lõik = --title-lead nagu Homes'is (kasutaja 2026-11-24; enne --head-gap) */
.why-main { grid-column: 5 / 10; grid-row: 1; padding-left: var(--gutter); display: flex; flex-direction: column; justify-content: flex-end; gap: var(--title-lead); }

.why-small { grid-column: 11 / 13; grid-row: 1; align-self: end; aspect-ratio: 1; }
/* kerimisnihe (useDrift, 2D translate murdosa-pikslites): oma kiht, muidu joonistati foto igal kaadril ümber ja
   vana asukoha servadesse jäid rõhtsad jutid (kasutaja 2026-11-23). Sama tingimus mis useDrift-il. */
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .why-small { will-change: translate; }
}

/* Telefon ja kitsas tahvel: pealkiri, foto, tekst, väike foto üksteise all */
@media (max-width: 900px) {
  .why-grid { grid-template-columns: minmax(0, 1fr); }
  .why-photo { margin-top: var(--title-gap); }   /* pealkiri → foto: ühine mobiilivahe */
  .why-text, .why-small { margin-top: var(--head-gap); }
  .why-photo, .why-main, .why-small { grid-column: 1; grid-row: auto; }
  .why-main { display: contents; }
  .why-main h2 { order: -1; }
  /* suur foto täislaiuses 3 : 4, sama mis Buying (kasutaja 2026-11-23; enne 78 %) */
  .why-small { width: 40%; justify-self: start; will-change: auto; }   /* telefonis nihet pole → kihti pole vaja */   /* vasakul (kasutaja 2026-11-23) */
}
</style>
