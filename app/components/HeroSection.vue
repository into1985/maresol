<script setup lang="ts">
/* 1. Hero „Ümbrus", viimistletud (põhilehel 2026-11-22, demo /_demo/hero-refine). Kasutaja Photoshopi kavand 2026-11-22 (uued pildid):
   - ülemine joon (sisu algus): ankur paremal (veerust 11 servani, 4 : 5) ja magamistuba keskel logo all;
   - villa vasakul üleval ülemisel joonel, parem serv = elutoa parem serv, ~1,4 × väike foto (püst; kasutaja 2026-11-22);
   - alumine joon: elutuba vasakult servast (parem serv kaks vahet pealkirjast) ja väike bassein veerus 9 (püst);
   - tekstiplokk alumisest joonest --head-gap võrra kõrgemal; lõik → Enquire sama vahe kui pealkiri → lõik.
   > 1920 px (2026-11-22, demo /_demo/hero-wide A „Hajutus"): välimised fotod nihkuvad --hero-shift võrra servade poole.
   data-depth Faas 5 jaoks: 1 kauge/aeglane … 3 lähedane/kiirem. Fotod ajutised (png, optimeerimata). */
const lead = 'We work with Memoshome, who build homes in Oba and the neighbouring parts of Alanya. Their team is there when you choose and buy, and stays with you after the keys are handed over.'

const photos = [
  { src: '/images/content/hero-apartment.webp', alt: 'A Memoshome residential building in Alanya', w: 1122, h: 1402, cls: 'pa', depth: 1 },
  { src: '/images/content/hero-bedroom.webp', alt: 'A bedroom with a view towards the sea', w: 1586, h: 992, cls: 'pd', depth: 2 },
  { src: '/images/content/hero-villa.webp', alt: 'A Memoshome villa in Alanya', w: 1122, h: 1402, cls: 'pv', depth: 3 },
  { src: '/images/content/hero-livingroom.webp', alt: 'A living room opening onto a terrace above the sea', w: 1586, h: 992, cls: 'pl', depth: 2 },
  { src: '/images/content/hero-pool.webp', alt: 'The pool at a Memoshome project', w: 1122, h: 1402, cls: 'pp', depth: 3 },
]
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-frame">
      <div class="hero-photos">
        <figure v-for="p in photos" :key="p.cls" class="hero-photo photo" :class="p.cls" :data-depth="p.depth">
          <img :src="p.src" :alt="p.alt" :width="p.w" :height="p.h" />
        </figure>
      </div>
      <div class="hero-text">
        <h1 id="hero-title" class="t-display">A home in Alanya, and someone to look after it</h1>
        <div class="hero-lead title-lead">
          <p class="t-body measure">{{ lead }}</p>
          <button class="btn btn--line t-button" type="button" data-enquire>Enquire</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { background: var(--surface); overflow: clip; }
.hero-frame {
  position: relative;
  max-width: var(--hero-max); margin-inline: auto;
  min-height: var(--hero-h);
  display: grid; align-items: end;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  column-gap: var(--gutter);
  padding: var(--frame-y) var(--pad-x-hero) var(--bar-gap);
}
figure { margin: 0; }

.hero-photos { position: absolute; inset: 0; }
.hero-photo { position: absolute; }

/* Ülemine joon */
/* > 1920 px nihkuvad välimised fotod --hero-shift võrra servade poole (bassein pool sellest, magamistuba paigal) */
.pa { top: var(--frame-y); right: 0; left: calc(var(--hero-px) + 10 * var(--hero-step)); aspect-ratio: var(--r-portrait); translate: var(--hero-shift) 0; }
.pd { top: var(--frame-y); left: 50%; translate: -50% 0; width: calc(2 * var(--hero-step)); aspect-ratio: var(--r-screen); }
/* Villa: ülemisel joonel, parem serv = elutoa parem serv (ühine püstjoon), ~1,4 × väike foto; kitsal ekraanil mitte laiem kui elutoa joon */
.pv { top: var(--frame-y); width: min(calc(1.375 * var(--hero-small)), calc(var(--hero-px) + 2 * var(--hero-step) - 2 * var(--gutter))); left: calc(var(--hero-px) + 2 * var(--hero-step) - 2 * var(--gutter)); translate: calc(-100% - var(--hero-shift)) 0; aspect-ratio: var(--r-portrait); }
/* Alumine joon */
.pl { bottom: var(--bar-gap); left: 0; width: calc(var(--hero-px) + 2 * var(--hero-step) - 2 * var(--gutter)); aspect-ratio: var(--r-landscape); translate: calc(-1 * var(--hero-shift)) 0; }
.pp { bottom: var(--bar-gap); left: calc(var(--hero-px) + 8 * var(--hero-step)); width: var(--hero-small); aspect-ratio: var(--r-portrait); translate: calc(var(--hero-shift) / 2) 0; }

.hero-text { position: relative; grid-column: 3 / 11; margin-bottom: var(--head-gap); }
.hero-lead { display: flex; flex-direction: column; align-items: flex-start; gap: calc(2 * var(--title-lead)); }
/* lõik lõpeb hiljemalt veeru 8 lõpus (basseini foto vasakul) */
.hero-lead p { max-width: min(var(--measure), calc(6 * var(--hero-step) - var(--gutter))); text-wrap: balance; }   /* read ühtlase pikkusega, viimane rida ei jää üksi */

/* Telefon ja kitsas tahvel: fotoriba pealkirja kohal (ankur, magamistuba, elutuba) */
@media (max-width: 900px) {
  .hero-frame { min-height: 100svh; grid-template-columns: minmax(0, 1fr); align-content: center; align-items: center; row-gap: var(--head-gap); padding-bottom: var(--frame-y); }
  .hero-photos { position: relative; inset: auto; aspect-ratio: var(--r-landscape); margin-inline: calc(-1 * var(--pad-x-hero)); }
  .hero-text { grid-column: 1 / -1; margin-bottom: 0; }
  .hero-lead p { max-width: var(--measure); }
  .pa { top: 0; left: auto; width: 38%; }
  .pd { top: 8%; left: 30%; translate: none; width: 26%; }
  .pl { bottom: 0; width: 34%; }
  .pv, .pp { display: none; }
}
</style>
