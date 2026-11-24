<script setup lang="ts">
/* Päis „Telg" (Faas 3 navbari demo A, kinnitatud 2026-11-21) + menüü „Register fotoga" (Faas 3 menüü demo B,
   kinnitatud 2026-11-21). Desktop (> 900 px): lingid vasakul, Maresoli logo keskel, EN / NO + Contact paremal (avab Glenni kaardi, 2026-11-22; enne Enquire).
   Kerides (> 80 px) riba kaob, paremasse nurka jääb „Menu"; logo tagasi ainult lehe ülaosas. ≤ 900 px: logo + „Menu".
   Menüü: täisleht, vasakul foto sektsioonist, kuhu link viib (vahetub päris hiireliigutusel, puhkeolekus aktiivse
   sektsiooni foto; foto sama kõrge kui tekstiplokk), paremal lingid → Glenn (nimi, kontaktid) → Enquire.
   Avatult: logo peidus, Menu asemel ainult X (aria-label Close), EN / NO samal real vasakul, kerimine lukus,
   Esc sulgeb, aktiivne link aktsendiga. Menüülink: brauseri ankruhüpe kohe sihile (AI_KULDREEGLID §17), menüü sulgub.
   ≤ 900 px täisleht nimekirjana, ilma fotota. Enquire ([data-enquire]) avab EnquiryOverlay; menüü Enquire sulgeb enne menüü. NO = koht. */
const links = [
  { id: 'memoshome', label: 'Local Partner', src: '/images/content/local-partner.webp' },
  { id: 'alanya', label: 'Alanya', src: '/images/content/alanya-bay.webp' },
  { id: 'homes', label: 'Homes', src: '/images/content/maersol-residences.webp' },
  { id: 'buying', label: 'Buying', src: '/images/content/buy-home.webp' },
  { id: 'ownership', label: 'Ownership', src: '/images/content/own-home.webp' },
]
/* alamlehel (nt /privacy-policy) viivad sektsioonilingid avalehe ankrutele */
const route = useRoute()
const hrefOf = (id: string) => (route.path === '/' ? '' : '/') + '#' + id
/* logo → selle projekti avaleht; avalehel juba olles viib lehe algusesse */
const toTop = () => { if (route.path === '/') window.scrollTo(0, 0) }
const open = ref(false)
const scrolled = ref(false)
const active = ref('')
const preview = ref(0)

/* Kontaktikaart (demo /_demo/contact-nav A, kinnitatud 2026-11-22): päise „Contact" avab nupu alla Glenni kaardi.
   Sulgub: sama nupp, Esc, klõps väljas, kerimine (riba kaob), menüü avamine. Fookus kaardile, sulgemisel tagasi nupule. */
const card = ref(false)
const trigger = ref<HTMLElement | null>(null)
const cardEl = ref<HTMLElement | null>(null)
const setCard = (v: boolean, refocus = true) => {
  if (card.value === v) return
  card.value = v
  if (v) nextTick(() => cardEl.value?.focus())
  else if (refocus) trigger.value?.focus()
}
const onDocClick = (e: MouseEvent) => {
  if (!card.value) return
  const t = e.target as Node
  if (cardEl.value?.contains(t) || trigger.value?.contains(t)) return
  setCard(false, false)
}

let raf = 0
const check = () => {
  raf = 0
  scrolled.value = window.scrollY > 80
  if (scrolled.value) setCard(false, false)
  let cur = ''
  for (const l of links) { const el = document.getElementById(l.id); if (el && el.getBoundingClientRect().top <= window.innerHeight * .4) cur = l.id }
  active.value = cur
  /* „Menu" taustatundlik (kasutaja 2026-11-23): nupu keskpunkti all foto või tume pind ([data-dark]) → hele kiri */
  const m = menuBtn.value?.getBoundingClientRect()
  if (open.value || !m || !m.width) { onDark.value = false; return }
  const under = document.elementsFromPoint(m.left + m.width / 2, m.top + m.height / 2).find(el => !el.closest('.site-nav'))
  onDark.value = !!under?.closest('.photo, [data-dark]')
}
const menuBtn = ref<HTMLElement | null>(null)
const onDark = ref(false)
const onScroll = () => { if (!raf) raf = requestAnimationFrame(check) }
const setOpen = (v: boolean) => {
  open.value = v
  if (v) setCard(false, false)
  document.documentElement.style.overflow = v ? 'hidden' : ''
  if (!v) onScroll()   /* sulgemisel (ka menüühüppel) Menu värv uue tausta järgi */
  if (v) { const i = links.findIndex(l => l.id === active.value); preview.value = i < 0 ? 0 : i }
}
const onKey = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  if (card.value) setCard(false)
  else if (open.value) setOpen(false)
}
/* foto vahetub ainult päris hiireliigutusel (mitte paigal kursori alla tulnud lingil) */
let last = { x: -1, y: -1 }
const hover = (i: number, e: PointerEvent) => {
  if (e.pointerType !== 'mouse' || (e.clientX === last.x && e.clientY === last.y)) return
  last = { x: e.clientX, y: e.clientY }
  preview.value = i
}
const go = () => setOpen(false)
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('keydown', onKey); document.addEventListener('click', onDocClick); check() })
onBeforeUnmount(() => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey); document.removeEventListener('click', onDocClick); document.documentElement.style.overflow = ''; if (raf) cancelAnimationFrame(raf) })
</script>

<template>
  <div class="site-nav" :class="{ 'is-open': open, 'is-scrolled': scrolled }">
    <header class="site-header">
      <nav class="links" aria-label="Sections">
        <a v-for="l in links" :key="l.id" class="t-label" :href="hrefOf(l.id)" :aria-current="active === l.id ? 'true' : undefined"><RollText :text="l.label" /></a>
      </nav>
      <NuxtLink class="logo" to="/" @click="toTop"><img src="/assets/maresol-logo-header.webp" alt="Maresol" width="213" height="176" /></NuxtLink>
      <div class="actions">
        <p class="lang t-label"><a href="#" aria-current="true" @click.prevent><RollText text="EN" /></a> <span aria-hidden="true">/</span> <a href="#" @click.prevent><RollText text="NO" /></a></p>
        <div class="contact">
          <button ref="trigger" type="button" class="trigger t-label" :aria-expanded="card" aria-controls="contact-card" @click="setCard(!card)"><RollText text="Contact" /></button>
          <div id="contact-card" ref="cardEl" class="card" :class="{ 'is-on': card }" role="dialog" aria-label="Contact Glenn Spydslaug" tabindex="-1" :inert="!card">
            <figure class="card-photo photo"><img src="/images/content/glenn.webp" alt="Glenn Spydslaug" width="1122" height="1402" loading="lazy" decoding="async" /></figure>
            <div class="card-body">
              <p class="t-h3">Glenn Spydslaug</p>
              <p class="t-body is-soft role">Real estate agent</p>
              <p class="reach title-lead">
                <a class="t-body u-link" href="tel:+4745818574"><span>+47 458 18 574</span></a>
                <a class="t-body u-link" href="mailto:contact@maresol.eu"><span>contact@maresol.eu</span></a>
              </p>
              <button class="send t-button u-link" type="button" data-enquire @click="setCard(false, false)"><span>Send an enquiry</span></button>
            </div>
          </div>
        </div>
      </div>
      <p class="open-lang lang t-label"><a href="#" aria-current="true" @click.prevent><RollText text="EN" /></a> <span aria-hidden="true">/</span> <a href="#" @click.prevent><RollText text="NO" /></a></p>
      <button ref="menuBtn" class="menu t-button" :class="{ 'on-dark': onDark && !open }" type="button" :aria-expanded="open" aria-controls="menu-panel" :aria-label="open ? 'Close' : undefined" @click="setOpen(!open)">
        <RollText v-if="!open" text="Menu" />
        <svg v-else class="x" viewBox="0 0 22 22" aria-hidden="true"><path d="M4 4 18 18M18 4 4 18" /></svg>
      </button>
    </header>

    <div id="menu-panel" class="panel" role="dialog" aria-modal="true" aria-label="Menu" :inert="!open">
      <figure class="panel-photo photo" aria-hidden="true">
        <img v-for="(l, i) in links" :key="l.id" :src="l.src" alt="" width="1122" height="1402" loading="lazy" decoding="async" :class="{ 'is-on': preview === i }" />
      </figure>
      <div class="panel-body">
        <nav class="list" aria-label="Sections">
          <a v-for="(l, i) in links" :key="l.id" class="t-menu" :href="hrefOf(l.id)" :aria-current="active === l.id ? 'true' : undefined" @click="go" @pointermove="hover(i, $event)">{{ l.label }}</a>
        </nav>
        <div class="foot">
          <div>
            <p class="t-h3">Glenn Spydslaug</p>
            <p class="reach title-lead">
              <a class="t-body u-link" href="tel:+4745818574"><span>+47 458 18 574</span></a>
              <a class="t-body u-link" href="mailto:contact@maresol.eu"><span>contact@maresol.eu</span></a>
            </p>
          </div>
          <button class="btn btn--line btn--arrow t-button" type="button" data-enquire @click="setOpen(false)"><span class="btn-t">Enquire<span class="btn-a" aria-hidden="true">→</span></span></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
p, figure { margin: 0; }
a { color: inherit; }

/* ---------- päis: ankurdub hero raami servadele (--edge), mitte sisukonteinerile.
   Raam ≤ --hero-max nagu hero (kasutaja 2026-11-22, projekti erand: suurel ekraanil avavaade ühe tervikuna) ---------- */
.site-header {
  position: fixed; inset-inline: 0; top: 0; z-index: var(--z-header);
  max-width: var(--hero-max); margin-inline: auto;
  padding: var(--bar-top) var(--edge);
  display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; column-gap: var(--gutter);
  pointer-events: none;   /* riba tühi ala ei blokeeri lehte; elemendid ise klikitavad */
}
.is-open .site-header { z-index: var(--z-close); }
.site-header > * { grid-row: 1; pointer-events: auto; transition: opacity var(--dur-ui) var(--ease-ui), visibility 0s linear; }
.links { grid-column: 1; display: flex; gap: var(--nav-gap); }
.links a, .lang a { text-decoration: none; }
.logo { grid-column: 2; display: block; height: var(--bar-h); }
.logo img { height: 100%; width: auto; }
.actions { grid-column: 3; justify-self: end; display: flex; align-items: center; gap: var(--gutter); }
.lang { display: flex; gap: var(--s-2); color: var(--soft); }
.lang a[aria-current] { color: var(--ink); }
/* navbari hover (kasutaja 2026-11-23): sildi rull (RollText) + kiri sujuvalt aktsendiks; aktiivsel lingil hoverit ega klikikursorit pole */
.links a, .lang a, .trigger, .menu { transition: color var(--dur-line) var(--ease-ui); }
.links a[aria-current], .lang a[aria-current] { cursor: default; }
@media (hover: hover) and (pointer: fine) { :is(.links a, .lang a, .trigger, .menu):not([aria-current]):hover { color: var(--accent); } }
/* kontakt: tekstilink nagu vasakpoolsed lingid; avatult aktsent */
.contact { position: relative; }
.trigger { min-height: var(--hit); padding-inline: var(--s-2); margin-right: calc(-1 * var(--s-2)); color: var(--ink); }
.trigger[aria-expanded="true"] { color: var(--accent); }
/* kaart nupu all, parem serv = nupu parem serv */
.card {
  position: absolute; top: calc(100% + var(--s-3)); right: 0;
  width: min(calc(100vw - 2 * var(--edge)), calc(var(--sheet-w) * .8));
  display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); column-gap: var(--gap);
  padding: var(--gap); background: var(--ground); border: var(--hair) solid var(--rule);
  opacity: 0; visibility: hidden; pointer-events: none;
  transition: opacity var(--dur-ui) var(--ease-ui), visibility 0s linear var(--dur-ui);
}
.card.is-on { opacity: 1; visibility: visible; pointer-events: auto; transition: opacity var(--dur-ui) var(--ease-ui), visibility 0s linear; }
.card:focus { outline: none; }
.card-photo { aspect-ratio: var(--r-tall); }
.card-photo img { object-position: 50% 20%; }
.card-body { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; }
.role { margin-top: var(--s-1); }
/* päring tekstitegevusena: hero Enquire jääb ainus kastiga nupp */
.send { margin-top: var(--head-gap); min-height: var(--hit); color: var(--ink); }   /* joon ja hover: base.css .u-link */
@media (hover: hover) and (pointer: fine) { .send:hover { color: var(--accent); } }   /* scoped .send värv kirjutas .u-link:hover üle */
.menu { grid-column: 3; justify-self: end; display: none; align-items: center; justify-content: center; min-height: var(--hit); min-width: var(--hit); padding-inline: var(--s-2); margin-right: calc(-1 * var(--s-2)); }
/* fotol / aktsendiribal hele; hover jääb heledaks (aktsent kaoks fotole), tagasiside annab rull */
.site-nav .menu.on-dark, .site-nav .menu.on-dark:hover { color: var(--on-accent); }
.x { width: var(--icon); height: var(--icon); fill: none; stroke: currentColor; stroke-width: 1.5; }
.links a[aria-current], .list a[aria-current] { color: var(--accent); }

/* kerides: riba kaob, jääb ainult Menu */
.is-scrolled .links, .is-scrolled .logo, .is-scrolled .actions { opacity: 0; visibility: hidden; pointer-events: none; transition: opacity var(--dur-ui) var(--ease-ui), visibility 0s linear var(--dur-ui); }
.is-scrolled .menu, .is-open .menu { display: inline-flex; }
/* avatud menüüs logo peidus, ainult X; EN / NO X-iga samal real vasakul */
.is-open .logo { opacity: 0; visibility: hidden; pointer-events: none; }
.open-lang { grid-column: 1; justify-self: start; min-height: var(--hit); align-items: center; display: none; }
.is-open .open-lang { display: flex; }

/* ---------- menüü: täisleht, tuhmub sisse tervikuna ---------- */
.panel {
  position: fixed; inset: 0; z-index: var(--z-overlay);
  background: var(--ground);
  display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--gutter); align-items: center; align-content: center;
  padding: calc(var(--bar-top) + var(--bar-h) + var(--gap)) var(--pad-x);   /* sisu algab X-rea alt, mahub madalasse aknasse */
  overflow: auto;
  opacity: 0; visibility: hidden; transition: opacity var(--dur-out) var(--ease-ui), visibility 0s linear var(--dur-out);
}
.is-open .panel { opacity: 1; visibility: visible; transition: opacity var(--dur-in) var(--ease-ui), visibility 0s linear; }
/* Faas 5: foto ja lingiplokk tõusevad koos (mitte link haaval); sulgemisel ainult tuhmumine, tõus nullitakse pärast seda */
.panel-photo, .panel-body { translate: 0 var(--ov-rise); transition: translate 0s linear var(--dur-out); }
.is-open .panel-photo, .is-open .panel-body { translate: none; transition: translate var(--dur-in) var(--ease-ui); }
/* foto sama kõrge kui tekstiplokk: ülaserv = esimene link, alaserv = Enquire */
.panel-photo { grid-column: 1 / 6; align-self: stretch; position: relative; }
.panel-photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity var(--dur-ui) var(--ease-ui); }
.panel-photo img.is-on { opacity: 1; }
.panel-body { grid-column: 7 / 13; }
.list { display: flex; flex-direction: column; }
.list a { text-decoration: none; align-self: flex-start; transition: color var(--dur-line) var(--ease-ui), translate var(--dur-line) var(--ease-ui); }
/* hover (kasutaja 2026-11-23): kiri sujuvalt --soft ja veidi paremale; aktiivsel lingil hoverit ega klikikursorit pole */
.list a[aria-current] { cursor: default; }
@media (hover: hover) and (pointer: fine) { .list a:not([aria-current]):hover { color: var(--soft); translate: var(--menu-shift) 0; } }
/* vahed tokenitest: lingid → Glenn --head-gap, nimi → kontaktid --title-lead, kontaktid → Enquire --head-gap */
.foot { display: flex; flex-direction: column; align-items: flex-start; gap: var(--head-gap); margin-top: var(--head-gap); }
.title-lead { margin-top: var(--title-lead); }
.reach { display: flex; flex-direction: column; align-items: flex-start; }
/* joon ja hover: base.css .u-link */

@media (max-width: 900px) {
  .site-header { grid-template-columns: auto minmax(0, 1fr) auto; }
  .links, .actions { display: none; }
  .logo { grid-column: 1; }
  .menu { display: inline-flex; }
  .panel { display: block; padding: var(--frame-y) var(--edge) var(--gap); }
  .panel-photo { display: none; }
  .list a { padding-block: var(--menu-pad); }   /* lingid õhulisemad, suurem klikipind (kasutaja 2026-11-23) */
}
</style>
