<script setup lang="ts">
/* Privacy policy alamleht (2026-11-22). Copy kasutajalt; [nurksulgudes] kohatäited jäävad, kuni Skippern need kinnitab.
   Paigutus lehe olemasolevast keelest: pealkiri t-display, all kuupäev t-note; register = read peenjoontega
   (pealkiri t-h3 1–4 | tekst t-body 5–12, lugemislaius --measure), sama 4 | 8 jaotus nagu Alanya ja Homes.
   „Who we share it with" lõikude rõhusõnad sildiks (t-label), sest body-fondil pole bold-lõiget. */
useSeoMeta({
  title: 'Privacy policy | Maresol',
  description: 'How Maresol, operated by Skippern Yachts AS, collects and uses personal data sent through this page.',
  ogSiteName: 'Maresol',
  ogLocale: 'en_GB'
})
</script>

<template>
  <SiteHeader />
  <main class="pp">
    <header class="pp-head">
      <h1 class="t-display">Privacy policy</h1>
      <p class="t-note is-soft title-lead">Last updated: [date]</p>
    </header>

    <div class="rows">
      <section class="row grid" aria-labelledby="pp-who">
        <h2 id="pp-who" class="t-h3">Who we are</h2>
        <div class="txt t-body">
          <p>Maresol is a brand operated by Skippern Yachts AS (company ID 932 726 874), Pastor Løkens vei 3, 1410 Kolbotn, Norway. Skippern Yachts AS is responsible for the personal data collected through this page.</p>
          <p>Email: <a class="u-link" href="mailto:info@maresol.eu"><span>info@maresol.eu</span></a><br>Phone: <a class="u-link" href="tel:+4790081217"><span>+47 900 81 217</span></a></p>
        </div>
      </section>

      <section class="row grid" aria-labelledby="pp-collect">
        <h2 id="pp-collect" class="t-h3">What we collect</h2>
        <div class="txt t-body">
          <p>You can visit this page without giving us any personal details. When you send an enquiry, we receive the name, the email address or phone number and the message you enter.</p>
          <p>Our hosting provider also records standard technical information, such as your IP address and your browser and device type, to keep the site running and secure.</p>
        </div>
      </section>

      <section class="row grid" aria-labelledby="pp-use">
        <h2 id="pp-use" class="t-h3">How we use it</h2>
        <div class="txt t-body">
          <p>We use your details only to answer your enquiry and to follow it up, for example to suggest homes or to arrange a viewing. We do not add you to a newsletter or send you marketing unless you ask us to.</p>
          <p>We process your details because you asked us to contact you (Article 6(1)(b) GDPR). We process technical information because we have a legitimate interest in a secure and working site (Article 6(1)(f) GDPR).</p>
        </div>
      </section>

      <section class="row grid" aria-labelledby="pp-share">
        <h2 id="pp-share" class="t-h3">Who we share it with</h2>
        <div class="txt t-body">
          <dl class="parties">
            <dt class="t-label">Memoshome</dt>
            <dd>Where it is needed to answer your enquiry, for example to arrange viewings in Alanya, we share your name, contact details and message with our partner Memoshome in Turkey. Turkey is outside the European Economic Area. We share only what your enquiry requires, [under the safeguards required by GDPR].</dd>
            <dt class="t-label">Service providers</dt>
            <dd>Companies that host this site and deliver its emails [(hosting provider), (email service)] process data on our behalf and only on our instructions.</dd>
          </dl>
          <p>We do not sell, trade or rent your personal data.</p>
        </div>
      </section>

      <section class="row grid" aria-labelledby="pp-keep">
        <h2 id="pp-keep" class="t-h3">How long we keep it</h2>
        <div class="txt t-body">
          <p>We keep your enquiry for as long as we are in contact with you, and delete it [24 months] after our last contact, unless the law requires us to keep records for longer, for example after a purchase.</p>
        </div>
      </section>

      <section class="row grid" aria-labelledby="pp-cookies">
        <h2 id="pp-cookies" class="t-h3">Cookies</h2>
        <div class="txt t-body">
          <p>[This page does not use cookies or tracking.]</p>
        </div>
      </section>

      <section class="row grid" aria-labelledby="pp-rights">
        <h2 id="pp-rights" class="t-h3">Your rights</h2>
        <div class="txt t-body">
          <p>You can ask to see the personal data we hold about you, have it corrected or deleted, restrict or object to how we use it, or receive a copy of it. Write to <a class="u-link" href="mailto:info@maresol.eu"><span>info@maresol.eu</span></a>.</p>
          <p>If you believe we handle your data wrongly, you can complain to the Norwegian Data Protection Authority, Datatilsynet (<a class="u-link" href="https://www.datatilsynet.no/" target="_blank" rel="noopener noreferrer"><span>datatilsynet.no</span></a>).</p>
        </div>
      </section>

      <section class="row grid" aria-labelledby="pp-changes">
        <h2 id="pp-changes" class="t-h3">Changes</h2>
        <div class="txt t-body">
          <p>We may update this policy. The date at the top shows when it was last changed.</p>
        </div>
      </section>
    </div>
  </main>
  <SiteFooter />
  <EnquiryOverlay />
</template>

<style scoped>
h1, h2, p, dl, dd { margin: 0; }
a { color: inherit; }

/* ülemine vahe = hero raam (päis + --bar-gap), sisu sisukonteineris */
.pp { padding: var(--frame-y) var(--pad-x) var(--sec); }
.rows { margin-top: var(--head-gap); }
.row { padding-block: var(--head-gap); border-top: var(--hair) solid var(--rule); }
.row:last-child { border-bottom: var(--hair) solid var(--rule); }
.row h2 { grid-column: 1 / 5; }
.txt { grid-column: 5 / 13; max-width: var(--measure); }
.txt > * + * { margin-top: var(--title-lead); }
/* tekstilingid: joon ja hover base.css .u-link (joon kaob vasakult paremale, kiri aktsent; kasutaja 2026-11-23) */

/* osapooled: silt → oma tekst tihedalt, järgmine silt lõiguvahega */
.parties dd { margin-top: var(--s-2); }
.parties dd + dt { margin-top: var(--title-lead); }

@media (max-width: 900px) {
  .row h2, .txt { grid-column: 1; }
}
</style>
