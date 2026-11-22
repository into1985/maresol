<script setup lang="ts">
/* Faas 2.5 „The purchase, handled locally" (demo E „Kolm veergu, suurem foto", kasutaja kavandi järgi 2026-11-21).
   Pealkiri vasakul (veerud 1–4), püstfoto 3 : 4 keskel (5–8), mõlemad lõigud paremal (9–12, lead, vahe --title-lead);
   kolm plokki vertikaalselt keskel. Madalal ekraanil foto kõrgus ≤ ekraan − 2 × --gap (kärbitakse).
   ≤ 900 px üksteise all. More on ground-sektsioon (aktsendiriba sees), seega sec--flush-top: üks --sec vahel. Foto ajutine. */
</script>

<template>
  <section id="buying" class="buy sec sec--flush-top" aria-labelledby="buy-title">
    <div class="grid">
      <h2 id="buy-title" class="title t-h2">The purchase, handled locally</h2>
      <figure class="photo r-tall"><img src="/images/content/buy-interior.webp" alt="A furnished living room with a view of the sea in a completed Memoshome apartment in Alanya" width="1122" height="1402" loading="lazy" decoding="async" /></figure>
      <div class="text">
        <p class="t-lead">Buying property in another country means documents, offices and formalities in a language you may not read. Memoshome handles them as part of every sale: it meets you in Alanya, arranges the viewings, and takes you through the paperwork until ownership is transferred into your name.</p>
        <p class="t-body title-lead">We stay your point of contact throughout, so you have one person to call whatever the question. Once the purchase is done, Memoshome can furnish the home and take care of it, and that is where ownership begins.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
figure { margin: 0; }
p { margin-block: 0; }
.title-lead { margin-top: var(--title-lead); }   /* base.css väärtus; kohalik p-nullimine kirjutas selle üle */
.grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gutter); align-items: center; }
.title { grid-column: 1 / 5; }
.photo { grid-column: 5 / 9; max-height: calc(100svh - 2 * var(--gap)); }
.photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.text { grid-column: 9 / 13; }

@media (max-width: 900px) {
  .grid { grid-template-columns: minmax(0, 1fr); }
  .title, .photo, .text { grid-column: 1; }
  .photo { margin-top: var(--head-gap); max-height: none; }
  .text { margin-top: var(--head-gap); }
}
</style>
