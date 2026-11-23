<script setup lang="ts">
/* Faas 2.7 „More homes on Maresol", D „Aktsendiriba" (kasutaja 2026-11-22, kinnitatud enne live'i 2026-11-23).
   Sisulaiune --accent riba: ainult loosung t-display + kontuurnupp heledas toonis, vaevu nähtav logomärk paremal all
   (serv lõikab). Kõrgus sisust, sees üleval/all --sec; ≤ 900 px servast servani. Väike nupusilt aktsendil ~3,6 : 1
   (kasutaja valik). Ground-toonis sektsioon: sec--flush-top (Homes annab --sec), Buying samuti sec--flush-top.
   Testvariandid (0, A, B, C) ja lüliti eemaldatud enne live'i (2026-11-23). */
const url = 'https://maresol.eu/'
</script>

<template>
  <section id="more" class="mr sec sec--flush-top" aria-labelledby="more-title">
    <div class="d">
      <svg class="d-mark" viewBox="0 0 382 222" aria-hidden="true" focusable="false"><use href="/assets/maresol-mark.svg#m" /></svg>
      <div class="d-text">
        <h2 id="more-title" class="t-display">Where life finds its place.</h2>
        <a class="btn btn--line btn--arrow t-button" :href="url" target="_blank" rel="noopener noreferrer"><span class="btn-t">See all homes on Maresol<span class="btn-a" aria-hidden="true">→</span></span></a>
      </div>
    </div>
  </section>
</template>

<style scoped>
h2 { margin-block: 0; }

.d { position: relative; overflow: clip; display: flex; align-items: center; justify-content: center; background: var(--accent); color: var(--on-accent); padding: var(--sec) var(--gutter); }
.d-mark { position: absolute; right: 0; bottom: 0; height: var(--mark-h); width: auto; aspect-ratio: 382 / 222; translate: var(--mark-shift) var(--mark-shift); color: var(--mark-on-accent); }
.d-text { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; }
.d-text .btn { margin-top: calc(2 * var(--title-lead)); }   /* sama vahe kui hero lõik → Enquire (kasutaja 2026-11-22) */
.d .btn--line { color: var(--on-accent); }   /* hover: base.css .btn--arrow liikumine; värv jääb (scoped reegel on tugevam kui .btn--arrow:hover) */

@media (max-width: 900px) {
  .d { margin-inline: calc(-1 * var(--pad-x)); padding-inline: var(--pad-x); }   /* servast servani */
}
</style>
