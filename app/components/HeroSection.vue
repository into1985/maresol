<script setup lang="ts">
/* 1. Hero ühe pildiga (kliendi soov, demo A kinnitatud 2026-11-24; asendas viie foto „Ümbruse"):
   - foto 4. veerust sektsiooni parema servani, kõrgus foto suhtest 16 : 10 (püstekraanil 3 : 4, oma kaader);
   - ainult pealkiri ulatub taevasse (tint taevas ≥ 5 : 1, scrim'i pole), lõik + Enquire taustal, nupu alaserv = foto alaserv;
   - ≤ 900 px üksteise all: pealkiri kolmel kindlal real (--t-hero täidab rea), lõik, Enquire, foto sisulaiuses. */
const lead = 'We work with Memoshome, who build homes in Oba and the neighbouring parts of Alanya. Their team is there when you choose and buy, and stays with you after the keys are handed over.'

/* Faas 5 (MOTION.md): avang laadimisel — fotomask, pealkiri +.4 s, lead + Enquire +.2 s. Vilkumise kaitse head'i skriptiga. */
useHead({ script: [{ tagPosition: 'head', innerHTML: INTRO_GUARD }] })
const photo = ref<HTMLElement | null>(null)
const h1 = ref<HTMLElement | null>(null)
const leadEl = ref<HTMLElement | null>(null)
useHeroMotion(() => (photo.value && h1.value && leadEl.value ? { fig: photo.value, text: [h1.value, leadEl.value] } : null))
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-frame">
      <h1 id="hero-title" ref="h1" class="t-display t-hero hero-title">A home in Alanya,<br class="br-m"> and<br class="br-d"> someone to<br class="br-m"> look after it</h1>
      <div ref="leadEl" class="hero-lead">
        <p class="t-body">{{ lead }}</p>
        <button class="btn btn--line btn--arrow t-button" type="button" data-enquire><span class="btn-t">Enquire<span class="btn-a" aria-hidden="true">→</span></span></button>
      </div>
      <figure ref="photo" class="hero-photo photo">
        <picture>
          <source media="(orientation: portrait)" srcset="/images/content/hero-portrait.webp" width="1086" height="1448" />
          <img src="/images/content/hero.webp" alt="The old shipyard and fortress walls of Alanya above the sea" width="1586" height="992" fetchpriority="high" />
        </picture>
      </figure>
    </div>
  </section>
</template>

<style>
/* Avangu algolek enne JS-i (html.mo-intro head'i skriptist; MOTION.photo / MOTION.text väärtused). Eraldi globaalne plokk:
   scoped :global(html.mo-intro) .x neelab järgneva osa ja reegel rakenduks kogu <html>-ile (scale muutis lehe paigutust). */
html.mo-intro .hero .hero-photo { clip-path: inset(100% 0 0 0); }
html.mo-intro .hero .hero-photo img { transform: scale(1.15); }
html.mo-intro .hero .hero-title, html.mo-intro .hero .hero-lead { opacity: 0; translate: 0 10px; }   /* lint-ok: = MOTION.text.rise (JS-i algolek, sama väärtus) */
</style>

<style scoped>
figure, p { margin: 0; }
.hero { background: var(--surface); }
.hero-frame {
  position: relative;
  max-width: var(--hero-max); margin-inline: auto;
  min-height: calc(var(--frame-y) + var(--hero-photo-w) / 1.6 + var(--bar-gap));
  display: grid; grid-template-rows: auto 1fr; row-gap: var(--head-gap);
  padding: calc(var(--frame-y) + var(--head-gap)) var(--pad-x-hero) var(--bar-gap);
}
.hero-title { position: relative; z-index: var(--z-content); }
.br-m { display: none; }
.hero-lead { align-self: end; display: flex; flex-direction: column; align-items: flex-start; gap: calc(2 * var(--title-lead)); width: calc(var(--hero-photo-l) - var(--gutter)); }
.hero-photo { position: absolute; top: var(--frame-y); bottom: var(--bar-gap); left: calc(var(--hero-px) + var(--hero-photo-l)); right: var(--pad-x-hero); }
.hero-photo picture { position: absolute; inset: 0; }
.hero-photo img { object-position: 60% 50%; }
/* suur püstekraan (tahvel püsti > 900 px): püstkaader oma suhtes */
@media (orientation: portrait) {
  .hero-frame { min-height: calc(var(--frame-y) + var(--hero-photo-w) * 4 / 3 + var(--bar-gap)); }
}

@media (max-width: 900px) {
  .hero-frame { min-height: 0; display: flex; flex-direction: column; row-gap: 0; padding-top: var(--frame-y); }
  .br-m { display: inline; }
  .br-d { display: none; }
  .hero-lead { align-self: stretch; width: auto; margin-top: var(--title-lead); }
  .hero-lead p { max-width: var(--measure); text-wrap: pretty; }
  .hero-photo { position: relative; inset: auto; margin-top: var(--head-gap); aspect-ratio: var(--r-screen); }
}
@media (max-width: 900px) and (orientation: portrait) {
  .hero-photo { aspect-ratio: var(--r-tall); }
}
</style>
