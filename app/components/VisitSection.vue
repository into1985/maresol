<script setup lang="ts">
/* „Come and see Alanya for yourself" (kasutaja kavand 2026-11-21). Paus Ownershipi ja Contacti vahel.
   Desktop (kasutaja 2026-11-22): foto sisulaiuses raamis 16 : 10 (--r-screen), kõrgus kahaneb laiusega.
   Lause (kasutaja 2026-11-22): üleval vasakul taeva peal (foto ainus rahulik ala), t-display (hero roll,
   lehe algus ↔ lõpp), kaks rida „Come and see Alanya / for yourself." Desktopil õrn ülemine scrim (kontrast), püstkaadril pole.
   Püstekraan ja ≤ 900 px: servast servani 100svh, püstkaader visit-alanya-portrait (taevas üleval).
   Fotod ajutiselt png (kasutaja). Foto vahetusel: vasak ülaosa peab jääma rahulikuks. */

/* Faas 5 (2026-11-23, muudetud samal päeval kasutaja loal): foto paigal — täislaiuses paus, mitte veerus olev sisufoto
   (sama reegel mis More'i ribal). Avaneb ainult lause (koos scrim'iga, mis on h2 ::before). */
const title = ref<HTMLElement>()
useReveal(() => [textUnit([title.value!])])
</script>

<template>
  <section id="visit" class="visit" aria-labelledby="visit-title">
    <div class="visit-frame">
      <picture class="visit-photo photo">
        <source media="(orientation: portrait)" srcset="/images/content/visit-alanya-portrait.webp" width="941" height="1672" />
        <img src="/images/content/visit-alanya.webp" alt="Alanya Castle walls above the sea at sunset" width="1586" height="992" loading="lazy" decoding="async" />
      </picture>
      <h2 ref="title" id="visit-title" class="visit-title t-display"><span class="ln">Come and see Alanya</span> <span class="ln">for yourself.</span></h2>
    </div>
  </section>
</template>

<style scoped>
h2 { margin: 0; }
/* foto alumine --sec ulatub kontakti surface-ribasse (kasutaja kavand 2026-11-22): riba algab --sec võrra foto alaservast kõrgemal,
   foto all kontaktini veel --sec → võrdne rütm. Leht lõpeb samal pinnal kui hero. */
.visit { padding-inline: var(--pad-x); color: var(--on-photo); background: linear-gradient(to bottom, transparent calc(100% - var(--sec)), var(--surface) 0); }
.visit-frame { position: relative; aspect-ratio: var(--r-screen); overflow: clip; }
.visit-photo { position: absolute; inset: 0; display: block; }
.visit-photo img { width: 100%; height: 100%; object-fit: cover; object-position: 70% center; display: block; }
.visit-title { position: relative; z-index: var(--z-content); padding: var(--head-gap); }   /* külg = ülemine vahe (kasutaja 2026-11-23) */
.visit-title .ln { display: block; }
/* rõhtkaadri taevas on teksti all ~2,7 : 1 → õrn matt must scrim tekstile ankurdatud, täislaiuses, sujub alla läbipaistvaks */
.visit-title::before { content: ''; position: absolute; inset: 0 0 calc(-1 * var(--sec)) 0; z-index: -1; background: linear-gradient(to bottom, var(--scrim-mid), var(--scrim-end)); }

/* püstekraan ja ≤ 900 px: servast servani, ekraani kõrgune, püstkaader */
@media (max-width: 900px), (orientation: portrait) {
  .visit { padding-inline: 0; }
  .visit-frame { aspect-ratio: auto; min-height: 100svh; }
  .visit-photo img { object-position: center; }
  .visit-title { padding: var(--frame-y) var(--pad-x); }
  .visit-title::before { display: none; }   /* püstkaadri taevas tumedam: ~4,4 : 1 ilma scrim'ita */
}
</style>
