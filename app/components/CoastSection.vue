<script setup lang="ts">
/* Faas 2.3 „Oba and the coast around it", A „Kaks poolt" (kasutaja Photoshopi kavand 2026-11-22).
   Veerud nagu Homes („Choosing a home"): vasak 1–4 | parem 5–12 püstjoonega. Vasakul pealkiri üleval,
   lennujaamad all (nimi t-label, aeg t-body — kasutaja: aeg ei saa eraldi suurust ega värvi); paremal foto 16 : 10 + lõigud.
   Testvariandid (0 kaart, B, C) ja lüliti eemaldatud enne live'i (2026-11-23). Foto ajutine. */
const airports = [
  { name: 'Gazipaşa–Alanya Airport', time: 'About 30 to 45 minutes' },
  { name: 'Antalya Airport', time: 'About two hours' },
]
const p1 = 'Oba is an established part of Alanya, a few kilometres east of the town centre, with the sea on one side and the Taurus foothills on the other. It is a place people live in, not only a holiday area: supermarkets, pharmacies, banks and bakeries sit alongside the cafés and restaurants, and there is a market every Monday.'
const p2 = 'A promenade follows the beach for walking, running and cycling. Gyms, tennis and padel courts are close by, and the Alanyum shopping centre covers what the local shops do not. Depending on the home, much of this is within walking distance.'
const note = 'Times by car vary with traffic and with where the home is. Transport from either airport can be arranged.'
</script>

<template>
  <section id="alanya" class="cs sec sec--flush-top" aria-labelledby="coast-title">
    <div class="grid">
      <div class="a-left">
        <h2 id="coast-title" class="t-h2">Oba and the coast around it</h2>
        <div>
          <span class="rule" aria-hidden="true" />
          <div v-for="a in airports" :key="a.name" class="a-air">
            <p class="t-label">{{ a.name }}</p>
            <p class="t-body">{{ a.time }}</p>
          </div>
          <p class="t-note is-soft title-lead">{{ note }}</p>
        </div>
      </div>
      <div class="a-right">
        <figure class="photo a-photo"><img src="/images/content/alanya.webp" alt="The seafront promenade in Alanya, lined with palms and benches above the sea" width="1586" height="992" loading="lazy" decoding="async" /></figure>
        <p class="t-lead a-p1">{{ p1 }}</p>
        <p class="t-body title-lead">{{ p2 }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
p { margin-block: 0; }
figure { margin: 0; }
.title-lead { margin-top: var(--title-lead); }   /* base.css väärtus; kohalik p-nullimine kirjutas selle üle */
.grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gutter); }
.photo img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* veerud = Homes („Choosing a home"): vasak 1–4, parem 5–12 püstjoone ja --gutter vahega */
.a-left { grid-column: 1 / 5; display: flex; flex-direction: column; justify-content: space-between; gap: var(--head-gap); }
.a-right { grid-column: 5 / 13; padding-left: var(--gutter); border-left: var(--hair) solid var(--rule); }
.a-photo { aspect-ratio: var(--r-screen); }   /* 16 : 10 (kasutaja 2026-11-22) */
.rule { display: block; width: var(--head-gap); margin-bottom: var(--title-lead); border-top: var(--hair) solid var(--rule); }   /* = Homes .intro .rule (ülemine vahe tuleb .a-left gap'ist) */
.a-air { display: grid; gap: var(--s-1); }
.a-air + .a-air { margin-top: var(--title-lead); }
.a-p1 { margin-top: var(--head-gap); }

@media (max-width: 900px) {
  .grid { grid-template-columns: minmax(0, 1fr); row-gap: var(--head-gap); }
  .a-left, .a-right { grid-column: 1; }
  .a-right { padding-left: 0; border-left: 0; }
}
</style>
