<script setup lang="ts">
/* Faas 2.5 „The purchase, handled locally" (demo E „Kolm veergu, suurem foto", kasutaja kavandi järgi 2026-11-21).
   Pealkiri vasakul (veerud 1–4), püstfoto 3 : 4 keskel (5–8), mõlemad lõigud paremal (9–12, lead, vahe --title-lead);
   kolm plokki vertikaalselt keskel. Madalal ekraanil foto kõrgus ≤ ekraan − 2 × --gap (kärbitakse).
   ≤ 900 px üksteise all. More on ground-sektsioon (aktsendiriba sees), seega sec--flush-top: üks --sec vahel. Foto ajutine. */

/* Faas 5 (2026-11-23): rida avaneb ühe sündmusena — foto (K2), pealkiri +.4 s, lõigud +.2 s; ≤ 900 px igaüks oma triggeril */
const title = ref<HTMLElement>(), photo = ref<HTMLElement>(), lead = ref<HTMLElement>(), body = ref<HTMLElement>()
useReveal(() => {
  const pic = photoUnit(photo.value!)
  if (matchMedia('(max-width: 900px)').matches) return [textUnit([title.value!]), textUnit([lead.value!, body.value!]), pic]
  return [groupUnit([pic, textUnit([title.value!, lead.value!, body.value!])], 400, photo.value!)]
})
</script>

<template>
  <section id="buying" class="buy sec sec--flush-top" aria-labelledby="buy-title">
    <div class="grid">
      <h2 ref="title" id="buy-title" class="title t-h2">The purchase, handled locally</h2>
      <figure ref="photo" class="photo r-tall"><img src="/images/content/buy-interior.webp" alt="A furnished living room with a view of the sea in a completed Memoshome apartment in Alanya" width="1122" height="1402" loading="lazy" decoding="async" /></figure>
      <div class="text">
        <p ref="lead" class="t-lead">Buying property in another country means documents, offices and formalities in a language you may not read. Memoshome handles them as part of every sale: it meets you in Alanya, arranges the viewings, and takes you through the paperwork until ownership is transferred into your name.</p>
        <p ref="body" class="t-body title-lead">We stay your point of contact throughout, so you have one person to call whatever the question. Once the purchase is done, Memoshome can furnish the home and take care of it, and that is where ownership begins.</p>
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
  .grid { grid-template-columns: minmax(0, 1fr); row-gap: 0; }   /* base.css .grid row-gap liitus margin'iga (32 px) */
  .title, .photo, .text { grid-column: 1; }
  /* mobiilis pealkiri → lõigud → foto (kasutaja 2026-11-23): pealkiri ja lead koos, foto sulgeb sektsiooni nagu Ownershipi read */
  .text { margin-top: var(--title-gap); }
  .photo { order: 1; margin-top: var(--head-gap); max-height: none; }
}
</style>
