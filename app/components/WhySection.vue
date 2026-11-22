<script setup lang="ts">
/* 2. Why we chose Memoshome — uus paigutus kasutaja Photoshopi kavandi järgi (2026-11-22), asendas demo G „Pealkiri üle".
   Suur püstfoto 3 : 4 veergudes 1–4; pealkiri + tekst veergudes 5–9 (vasak serv = Coasti / Homesi püstjoone
   järgne telg: 5. veerg + --gutter); väike ruutfoto 1 : 1 veergudes 11–12.
   Pealkiri + tekst üks plokk (vahe --head-gap), teksti ja väikese foto alaserv = suure foto alaserv. Kui tekst on
   fotost kõrgem, venib suur foto rea kõrguseni (vahekast + absoluutne img).
   Mõlemad fotod ajutised; kasutaja vahetab väikese foto teemaga sobiva vastu (nt ehitusplats). */
const p1 = 'We wanted a partner in Turkey that would still be there after the sale. Memoshome buys the land, develops and builds the homes, sells them, and manages the complexes once the owners have moved in. Since 2000, the company has built 48 projects in and around Alanya.'
const p2 = 'Maresol is run by Skippern Yachts, so our own background is in yachts, where a good boat comes with a management company behind it. A home abroad needs the same: people on the ground who know the building, because they built it.'
</script>

<template>
  <section id="memoshome" class="why sec" aria-labelledby="why-title">
    <div class="why-grid">
      <figure class="why-photo photo">
        <span class="why-ratio r-tall" aria-hidden="true"></span>
        <img src="/images/content/why-complex.webp" alt="A Memoshome villa in Alanya, with its pool and garden terrace" width="1122" height="1402" loading="lazy" decoding="async" />
      </figure>
      <div class="why-main">
        <h2 id="why-title" class="t-h2">Why we chose Memoshome</h2>
        <div class="why-text">
          <p class="t-lead">{{ p1 }}</p>
          <p class="t-body title-lead">{{ p2 }}</p>
        </div>
      </div>
      <figure class="why-small photo">
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

/* pealkiri + tekst üks plokk (vahe --head-gap), joondatud foto alaserva; vaba ruum jääb pealkirja kohale (kasutaja 2026-11-22) */
.why-main { grid-column: 5 / 10; grid-row: 1; padding-left: var(--gutter); display: flex; flex-direction: column; justify-content: flex-end; gap: var(--head-gap); }

.why-small { grid-column: 11 / 13; grid-row: 1; align-self: end; aspect-ratio: 1; }

/* Telefon ja kitsas tahvel: pealkiri, foto, tekst, väike foto üksteise all */
@media (max-width: 900px) {
  .why-grid { grid-template-columns: minmax(0, 1fr); row-gap: var(--head-gap); }
  .why-photo, .why-main, .why-small { grid-column: 1; grid-row: auto; }
  .why-main { display: contents; }
  .why-main h2 { order: -1; }
  .why-photo { width: 78%; }
  .why-small { width: 40%; justify-self: end; }
}
</style>
