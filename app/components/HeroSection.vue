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
  /* mdepth = avangu järjekord telefonis (ülemine paar enne, alumine koos tekstiga) */
  { src: '/images/content/hero-apartment.webp', alt: 'A Memoshome residential building in Alanya', w: 1122, h: 1402, cls: 'pa', depth: 1, mdepth: 3 },
  { src: '/images/content/hero-bedroom.webp', alt: 'A bedroom with a view towards the sea', w: 1586, h: 992, cls: 'pd', depth: 2, mdepth: 2 },
  { src: '/images/content/hero-villa.webp', alt: 'A Memoshome villa in Alanya', w: 1122, h: 1402, cls: 'pv', depth: 3, mdepth: 1 },
  { src: '/images/content/hero-livingroom.webp', alt: 'A living room opening onto a terrace above the sea', w: 1586, h: 992, cls: 'pl', depth: 2, mdepth: 3 },
  { src: '/images/content/hero-pool.webp', alt: 'The pool at a Memoshome project', w: 1122, h: 1402, cls: 'pp', depth: 3, mdepth: 3 },
]

/* Faas 5 (MOTION.md, kinnitatud demo 2026-11-23): avang laadimisel — fotod kaugemad enne (sügavus 1 → 3, samm .15 s),
   pealkiri +.4 s, lead + Enquire +.2 s; kerides fotod sügavuse järgi lehest kiiremini üles. Vilkumise kaitse head'i skriptiga. */
useHead({ script: [{ tagPosition: 'head', innerHTML: INTRO_GUARD }] })
const frame = ref<HTMLElement | null>(null)
const h1 = ref<HTMLElement | null>(null)
const leadEl = ref<HTMLElement | null>(null)
useHeroMotion(() => (frame.value && h1.value && leadEl.value
  ? { figs: [...frame.value.querySelectorAll<HTMLElement>('.hero-photo')], text: [h1.value, leadEl.value] }
  : null))
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div ref="frame" class="hero-frame">
      <div class="hero-photos">
        <figure v-for="p in photos" :key="p.cls" class="hero-photo photo" :class="p.cls" :data-depth="p.depth" :data-mdepth="p.mdepth">
          <img :src="p.src" :alt="p.alt" :width="p.w" :height="p.h" />
        </figure>
      </div>
      <div class="hero-text">
        <h1 id="hero-title" ref="h1" class="t-display t-hero"><span class="hl">A home in Alanya,</span> <span class="hl">and someone to</span> <span class="hl">look after it</span></h1>
        <div ref="leadEl" class="hero-lead title-lead">
          <p class="t-body measure">{{ lead }}</p>
          <button class="btn btn--line btn--arrow t-button" type="button" data-enquire><span class="btn-t">Enquire<span class="btn-a" aria-hidden="true">→</span></span></button>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
/* Avangu algolek enne JS-i (html.mo-intro head'i skriptist; MOTION.photo / MOTION.text väärtused). Eraldi globaalne plokk:
   scoped :global(html.mo-intro) .x neelab järgneva osa ja reegel rakenduks kogu <html>-ile (scale muutis lehe paigutust). */
html.mo-intro .hero .hero-photo { clip-path: inset(100% 0 0 0); }
html.mo-intro .hero .hero-photo img { transform: scale(1.15); }
html.mo-intro .hero .hero-text h1, html.mo-intro .hero .hero-lead { opacity: 0; translate: 0 10px; }   /* lint-ok: = MOTION.text.rise (JS-i algolek, sama väärtus) */
</style>

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

/* Telefon ja kitsas tahvel (kasutaja Photoshopi kavand 2026-11-23): fotopaar ülal (villa | magamistuba), tekst,
   fotopaar all (elutuba | ankur) — fotod raamivad teksti, alumine paar piilub esimese ekraani alt. Pealkiri kolmel
   kindlal real, esimene rida täidab sisulaiuse (--t-hero). Ülemise paari kõrgus sõltub ka ekraani kõrgusest. */
@media (max-width: 900px) {
  .hero-frame { min-height: 0; align-content: start; align-items: start; row-gap: 0; padding-bottom: var(--bar-gap); }
  .hero-photos { display: contents; }
  .hero-photo { position: static; translate: none; width: 100%; }
  .pv { grid-area: 1 / 1 / 2 / 7; width: min(100%, calc(var(--hero-m-top) * 4 / 5)); }
  .pd { grid-area: 1 / 7 / 2 / 13; align-self: center; }
  .hero-text { grid-area: 2 / 1 / 3 / 13; margin-block: var(--head-gap) 0; }
  /* Enquire → alumine paar väiksem vahe (kasutaja 2026-11-23) */
  .pl { grid-area: 3 / 1 / 4 / 8; align-self: end; }
  .pa { grid-area: 3 / 8 / 4 / 13; }
  .pl, .pa { margin-top: var(--title-gap); }
  .pp { display: none; }
  .hero-lead p { max-width: var(--measure); text-wrap: pretty; }   /* telefonis täislaius (measure on laiem kui telefon), tahvlil lugemislaius (kasutaja 2026-11-23) */
  .hl { display: block; }
}
</style>
