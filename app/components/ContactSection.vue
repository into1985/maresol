<script setup lang="ts">
/* Faas 2.8 „Start with a conversation" + footer. LUKUS E2 (kasutaja Photoshopi kavand, 2026-11-22;
   asendas C „Kiri, inimene kõrval"). Copy Glenni minavormis.
   Kolm veergu: pealkiri t-h2 + lause t-lead (1–5) | foto 3:4 (6–9) | allkiri (10–12): nimi t-h3, roll tihedalt all,
   telefon + e-post, täidetud Enquire. Tekst ja allkiri foto suhtes vertikaalselt keskel.
   NB: lause t-lead on katsetus — kasutaja võib tahta tagasi t-h3 (tuletada meelde).
   Footer: SiteFooter.vue (© vasakul, Privacy policy → /privacy-policy paremal). Share puudub (see ei ole listing).
   Foto images/glenn.webp (päikeseprillideta portree oleks parem, küsida Glennilt). */

/* Faas 5 (2026-11-23): rida ühe sündmusena nagu Purchase — portree K2, pealkiri +.4 s, lause +.2 s, allkiri plokina +.2 s.
   Footer paigal (lehe viimane rida, kõrgel ekraanil 85 % joont ei saavutaks). ≤ 900 px järjekord pealkiri + lause, foto, allkiri; igaüks oma triggeril. */
const title = ref<HTMLElement>(), lead = ref<HTMLElement>(), photo = ref<HTMLElement>(), sign = ref<HTMLElement>()
useReveal(() => {
  const pic = photoUnit(photo.value!)
  if (matchMedia('(max-width: 900px)').matches) return [textUnit([title.value!, lead.value!]), pic, textUnit([sign.value!])]
  return [groupUnit([pic, textUnit([title.value!, lead.value!, sign.value!])], 400, photo.value!)]
})
</script>

<template>
  <section id="contact" class="contact" aria-labelledby="contact-title">
    <div class="sec body">
      <div class="grid">
        <div class="text">
          <h2 ref="title" id="contact-title" class="t-h2">Start with a conversation</h2>
          <p ref="lead" class="t-lead title-lead note">Every home is different, and so is what people want from one. If you are thinking about Alanya, I am happy to talk it through, whether you already have something in mind or are just starting to look.</p>
        </div>
        <figure ref="photo" class="portrait photo r-tall"><img src="/images/content/glenn.webp" alt="Glenn Spydslaug, real estate agent at Maresol" width="1122" height="1402" loading="lazy" decoding="async" /></figure>
        <div ref="sign" class="sign">
          <p class="t-h3">Glenn Spydslaug</p>
          <p class="t-body is-soft role">Real estate agent</p>
          <p class="reach title-lead">
            <a class="t-body u-link" href="tel:+4745818574"><span>+47 458 18 574</span></a>
            <a class="t-body u-link u-link--icon" href="https://wa.me/4745818574" target="_blank" rel="noopener noreferrer"><span>Message on WhatsApp</span><WaIcon /></a>
            <a class="t-body u-link" href="mailto:contact@maresol.eu"><span>contact@maresol.eu</span></a>
          </p>
          <button class="btn btn--solid t-button" type="button" data-enquire>Enquire</button>
        </div>
      </div>
    </div>
    <SiteFooter />
  </section>
</template>

<style scoped>
figure { margin: 0; }
p, h2 { margin-block: 0; }
.title-lead { margin-top: var(--title-lead); }   /* base.css väärtus; kohalik p-nullimine kirjutas selle üle */
a { color: inherit; }
.contact { background: var(--surface); }   /* jätkab Visit-foto all algavat riba; footer samal pinnal (kasutaja 2026-11-22) */
.grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gutter); }
.photo img { width: 100%; height: 100%; object-fit: cover; display: block; }

.body { padding-bottom: var(--head-gap); }
.note { max-width: var(--measure-lead); }
.text { grid-column: 1 / 6; align-self: center; }
.portrait { grid-column: 6 / 10; }
.sign { grid-column: 10 / 13; align-self: center; }
.role { margin-top: var(--s-1); }   /* nimi ja roll üks plokk */
.reach { display: flex; flex-direction: column; align-items: flex-start; }
.sign .btn { margin-top: var(--head-gap); }


@media (max-width: 900px) {
  .grid { grid-template-columns: minmax(0, 1fr); }
  .text, .portrait, .sign { grid-column: 1; }
  .text > .note { margin-top: var(--title-gap); }   /* pealkiri → lead: ühine mobiilivahe */
  /* telefonis foto pealkirja + lause ja maakleri nime vahel (kasutaja 2026-11-23) */
  .portrait { width: 60%; margin-top: var(--head-gap); }
  .sign { margin-top: var(--head-gap); }
}
</style>
