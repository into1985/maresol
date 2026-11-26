<script setup lang="ts">
/* Päringu-overlay „Kaart keskel" (Faas 3 päringu demo A, kinnitatud 2026-11-21). Copy: Enquire · Name ·
   Email or phone · Message · [Send] · teavitusrida + Privacy policy; tänusõnum „Thank you. Your enquiry has been
   received." Vorm on prototüüp (saatmiseta): valideerimine + tänuvaade.
   Kaart lehe keskel, kogu leht (ka päis) tumendatud ja hägune. Fookus kaardil (mitte väljal), Esc / klõps
   tumendusel sulgeb, kerimine lukus, fookus tagasi avajale. X pealkirja real ja paigal; spellcheck välja,
   autofill-taust maha; sõnumiväli kasvab ainult nii palju, kui vaba ruumi jääb (põrand 2 rida).
   Esimene väli „What are you looking for?” (kliendi ettepanek 2026-11-26, valikuline): hiirega oma loend lehe stiilis,
   puutel brauseri select; „Choose one” ainult väljal. Nool suunaga, ilma pööramise animatsioonita.
   ≤ 820 px kõrge: tihedamad vahed. ≤ 700 px lai: täisekraan, foto vormi kohal (kasutaja 2026-11-25).
   Avajad: iga [data-enquire] nupp lehel (päis, menüü, hero, kontakt). */
const open = ref(false)
const sent = ref(false)
const f = reactive({ intent: '', name: '', contact: '', message: '' })
const intents = ['A holiday home for personal use', 'A home with rental income potential', 'An investment property', 'A permanent home in Alanya', 'Just exploring the possibilities']
const err = reactive({ name: '', contact: '' })
const sheet = ref<HTMLElement | null>(null)
/* valikuloend: hiirega oma (lehe stiilis), puutel brauseri select */
const fine = ref(false), lo = ref(false), ai = ref(0)
const lb = ref<HTMLElement | null>(null), pickEl = ref<HTMLElement | null>(null), pickBtn = ref<HTMLElement | null>(null)
const openList = () => { lo.value = true; ai.value = Math.max(0, intents.indexOf(f.intent)); nextTick(() => lb.value?.focus()) }
const closeList = (focus = true) => { lo.value = false; if (focus) pickBtn.value?.focus() }
const choose = (i: number) => { f.intent = intents[i]; closeList() }
const btnKey = (e: KeyboardEvent) => { if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openList() } }
const listKey = (e: KeyboardEvent) => {
  const n = intents.length
  if (e.key === 'ArrowDown') { e.preventDefault(); ai.value = Math.min(n - 1, ai.value + 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); ai.value = Math.max(0, ai.value - 1) }
  else if (e.key === 'Home') { e.preventDefault(); ai.value = 0 }
  else if (e.key === 'End') { e.preventDefault(); ai.value = n - 1 }
  else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(ai.value) }
  else if (e.key === 'Escape') { e.stopPropagation(); closeList() }   /* Esc sulgeb ainult loendi, mitte vormi */
  else if (e.key === 'Tab') closeList(false)
}
const scroller = ref<HTMLElement | null>(null)
const msg = ref<HTMLTextAreaElement | null>(null)
let opener: HTMLElement | null = null

const fit = () => {
  const ta = msg.value, sc = scroller.value
  if (!ta || !sc) return
  ta.style.height = ''
  const floor = ta.getBoundingClientRect().height        /* rows="2" */
  ta.style.height = 'auto'
  let h = Math.max(ta.scrollHeight, floor)
  ta.style.height = h + 'px'
  const over = sc.scrollHeight - sc.clientHeight
  if (over > 0) { h = Math.max(floor, h - over); ta.style.height = Math.floor(h) + 'px' }
}
const setOpen = (v: boolean, from?: HTMLElement | null) => {
  open.value = v
  lo.value = false
  document.documentElement.style.overflow = v ? 'hidden' : ''
  if (v) {
    /* menüüst avades on avaja sulgemisel inert → fookus menüü nupule */
    const menu = from?.closest<HTMLElement>('[role="dialog"][id]')
    opener = (menu && document.querySelector<HTMLElement>(`[aria-controls="${menu.id}"]`)) || from || null
    nextTick(() => { sheet.value?.focus(); fit() })
  }
  else {
    opener?.focus()
    setTimeout(() => { if (!open.value) { sent.value = false; Object.assign(f, { intent: '', name: '', contact: '', message: '' }); Object.assign(err, { name: '', contact: '' }) } }, 300)
  }
}
const validContact = (s: string) => /^\S+@\S+\.\S+$/.test(s.trim()) || s.replace(/\D/g, '').length >= 7
const send = () => {
  err.name = f.name.trim() ? '' : 'Please enter your name.'
  err.contact = !f.contact.trim() ? 'Please enter an email address or phone number.' : validContact(f.contact) ? '' : 'Please check the email address or phone number.'
  nextTick(fit)
  if (err.name || err.contact) return
  sent.value = true
}
const onKey = (e: KeyboardEvent) => {
  if (!open.value) return
  if (e.key === 'Escape') setOpen(false)
  if (e.key === 'Tab' && sheet.value) {   /* fookus jääb dialoogi sisse */
    const els = [...sheet.value.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea')].filter(el => el.offsetParent)
    const first = els[0], last = els[els.length - 1]
    if (e.shiftKey && (document.activeElement === first || document.activeElement === sheet.value)) { e.preventDefault(); last?.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
  }
}
const onClick = (e: MouseEvent) => {
  if (lo.value && !pickEl.value?.contains(e.target as Node)) closeList(false)
  const b = (e.target as HTMLElement).closest<HTMLElement>('[data-enquire]')
  if (b) setOpen(true, b)
}
const onResize = () => { if (open.value) fit() }
onMounted(() => {
  fine.value = matchMedia('(hover: hover) and (pointer: fine)').matches
  window.addEventListener('keydown', onKey); document.addEventListener('click', onClick); window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); window.removeEventListener('resize', onResize); document.documentElement.style.overflow = '' })
</script>

<template>
  <div class="q" :class="{ 'is-open': open }">
    <div class="dim" @click="setOpen(false)" />

    <div ref="sheet" class="sheet" :style="{ '--e': (err.name ? 1 : 0) + (err.contact ? 1 : 0) }" role="dialog" aria-modal="true" aria-labelledby="enq-title" tabindex="-1" :inert="!open">
      <figure class="pic photo"><img src="/images/content/enquire.webp" alt="" width="1586" height="992" decoding="async" fetchpriority="low" /></figure>
      <div class="top">
        <h2 id="enq-title" class="t-h2">Enquire</h2>
        <button class="close" type="button" aria-label="Close" @click="setOpen(false)">
          <svg viewBox="0 0 22 22" aria-hidden="true"><path d="M4 4 18 18M18 4 4 18" /></svg>
        </button>
      </div>

      <div ref="scroller" class="scroll">
        <form v-if="!sent" class="form" novalidate @submit.prevent="send">
          <div class="field">
            <label id="enq-intent-l" class="t-label" for="enq-intent">What are you looking for?</label>
            <span ref="pickEl" class="pick" :class="{ 'is-open': lo }">
              <!-- puutel brauseri / süsteemi valija; „Choose one" ainult väljal, mitte loendis -->
              <select v-if="!fine" id="enq-intent" v-model="f.intent" class="t-body" name="intent" :class="{ 'is-empty': !f.intent }">
                <option value="" disabled hidden>Choose one</option>
                <option v-for="o in intents" :key="o" :value="o">{{ o }}</option>
              </select>
              <!-- hiirega oma loend lehe stiilis -->
              <template v-else>
                <button id="enq-intent" ref="pickBtn" type="button" class="pick-btn t-body" :class="{ 'is-empty': !f.intent }" aria-haspopup="listbox" :aria-expanded="lo" aria-labelledby="enq-intent-l enq-intent" @click="lo ? closeList() : openList()" @keydown="btnKey">{{ f.intent || 'Choose one' }}</button>
                <ul ref="lb" class="pick-list" :class="{ 'is-on': lo }" role="listbox" tabindex="-1" aria-labelledby="enq-intent-l" :aria-activedescendant="lo ? `enq-o${ai}` : undefined" @keydown="listKey">
                  <li v-for="(o, i) in intents" :id="`enq-o${i}`" :key="o" class="t-body" role="option" :aria-selected="f.intent === o" :class="{ 'is-active': ai === i }" @mousemove="ai = i" @click="choose(i)">{{ o }}</li>
                </ul>
              </template>
              <svg class="chev" viewBox="0 0 12 8" aria-hidden="true"><path :d="lo ? 'M1 6.5 6 1.5 11 6.5' : 'M1 1.5 6 6.5 11 1.5'" /></svg>
            </span>
          </div>
          <div class="field" :class="{ 'is-error': err.name }">
            <label class="t-label" for="enq-name">Name</label>
            <input id="enq-name" v-model="f.name" class="t-body" type="text" name="name" autocomplete="name" spellcheck="false" :aria-invalid="err.name ? 'true' : undefined" :aria-describedby="err.name ? 'enq-name-err' : undefined" @input="err.name = ''">
            <p v-if="err.name" id="enq-name-err" class="err t-note">{{ err.name }}</p>
          </div>
          <div class="field" :class="{ 'is-error': err.contact }">
            <label class="t-label" for="enq-contact">Email or phone</label>
            <input id="enq-contact" v-model="f.contact" class="t-body" type="text" name="contact" autocomplete="email" spellcheck="false" :aria-invalid="err.contact ? 'true' : undefined" :aria-describedby="err.contact ? 'enq-contact-err' : undefined" @input="err.contact = ''">
            <p v-if="err.contact" id="enq-contact-err" class="err t-note">{{ err.contact }}</p>
          </div>
          <div class="field">
            <label class="t-label" for="enq-msg">Message</label>
            <textarea id="enq-msg" ref="msg" v-model="f.message" class="t-body" name="message" rows="2" spellcheck="false" @input="fit" />
          </div>
          <div class="send">
            <button class="btn btn--solid t-button" type="submit">Send</button>
            <p class="notice t-note is-soft">We use your details only to reply to your enquiry. <NuxtLink to="/privacy-policy" @click="setOpen(false)">Privacy policy</NuxtLink></p>
          </div>
        </form>
        <p v-else class="thanks t-h3" role="status">Thank you. Your enquiry has been received.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
p, figure, h2 { margin: 0; }
.pic { display: none; }   /* ainult ≤ 700 px */
a { color: inherit; }

/* ---------- tumendus kogu lehe peal (ka päisel) ---------- */
.dim {
  position: fixed; inset: 0; z-index: var(--z-overlay);
  opacity: 0; visibility: hidden; transition: opacity var(--dur-out) var(--ease-ui), visibility 0s linear var(--dur-out);   /* sulgemine --dur-out, avamine nagu enne */
}
.dim { background: var(--dim); backdrop-filter: blur(var(--blur)); -webkit-backdrop-filter: blur(var(--blur)); }
.is-open .dim { opacity: 1; visibility: visible; transition: opacity var(--dur-ui) var(--ease-ui), visibility 0s linear; }

/* ---------- kaart / paneel ---------- */
.sheet {
  position: fixed; inset: 0; margin: auto; height: fit-content; z-index: calc(var(--z-overlay) + 1);
  display: flex; flex-direction: column;
  width: min(100% - 2 * var(--edge), var(--sheet-w)); max-height: calc(100svh - 2 * var(--gap));
  padding: var(--head-gap);
  background: var(--ground); color: var(--ink);
  opacity: 0; visibility: hidden; translate: 0 var(--ov-rise);
  transition: opacity var(--dur-out) var(--ease-ui), visibility 0s linear var(--dur-out), translate 0s linear var(--dur-out);
}
.sheet:focus { outline: none; }
.is-open .sheet { opacity: 1; visibility: visible; translate: none; transition: opacity var(--dur-in) var(--ease-ui), visibility 0s linear, translate var(--dur-in) var(--ease-ui); }   /* Faas 5: kaart tõuseb, sulgemine ainult tuhmub */
/* pealkiri ja X ühel real, X jääb paigale ka siis, kui sisu kerib */
.top { display: flex; justify-content: space-between; align-items: center; gap: var(--gutter); }
.close { display: inline-flex; align-items: center; justify-content: center; min-width: var(--hit); min-height: var(--hit); margin-right: calc(-1 * var(--s-3)); }
.close svg { width: var(--icon); height: var(--icon); fill: none; stroke: currentColor; stroke-width: 1.5; }
.scroll { flex: 1; min-height: 0; overflow: auto; display: flex; flex-direction: column; margin-top: var(--head-gap); }

/* ---------- vorm ---------- */
.form { display: flex; flex-direction: column; gap: var(--gap); }
.field { display: flex; flex-direction: column; }
.field label { color: var(--soft); }
.field input, .field textarea, .field select {
  width: 100%; margin-top: var(--s-2); padding: var(--s-2) 0;
  border: 0; border-bottom: var(--hair) solid var(--rule); border-radius: 0;
  background: none; color: var(--ink); outline: none; resize: none;
  transition: border-color var(--dur-ui) var(--ease-ui);
}
.field input:focus, .field textarea:focus, .field select:focus, .is-error input { border-bottom-color: var(--ink); }
.field textarea { display: block; overflow: auto; }
/* valik: brauseri oma select (telefonis süsteemi valija), kujult nagu teised väljad */
.pick { position: relative; display: block; }
.field select { appearance: none; -webkit-appearance: none; padding-right: calc(var(--icon) + var(--s-2)); cursor: pointer; }
.field select.is-empty, .pick-btn.is-empty { color: var(--soft); }
.pick-btn {
  display: block; width: 100%; margin-top: var(--s-2); padding: var(--s-2) calc(var(--icon) + var(--s-2)) var(--s-2) 0; text-align: left;
  border-bottom: var(--hair) solid var(--rule); color: var(--ink); cursor: pointer; transition: border-color var(--dur-ui) var(--ease-ui);
}
.pick-btn:focus { outline: none; }
.pick.is-open .pick-btn, .pick-btn:hover { border-bottom-color: var(--ink); }
/* loend välja all: lehe pind + peenjoon nagu kontaktikaart; aktiivne rida surface, valitud aktsent */
.pick-list {
  position: absolute; z-index: calc(var(--z-content) + 1); top: 100%; left: 0; right: 0; margin: 0; padding: var(--s-2) 0; list-style: none;
  background: var(--ground); border: var(--hair) solid var(--rule);
  opacity: 0; visibility: hidden; transition: opacity var(--dur-ui) var(--ease-ui), visibility 0s linear var(--dur-ui);
}
.pick-list.is-on { opacity: 1; visibility: visible; transition: opacity var(--dur-ui) var(--ease-ui), visibility 0s linear; }
.pick-list:focus { outline: none; }
.pick-list li { padding: var(--s-2) var(--s-3); cursor: pointer; transition: background-color var(--dur-line) var(--ease-ui), color var(--dur-line) var(--ease-ui); }
.pick-list li.is-active { background: var(--surface); }
.pick-list li[aria-selected="true"] { color: var(--accent); }
.field select option { color: var(--ink); }
.chev { position: absolute; right: 0; top: calc(50% + var(--s-2) / 2); translate: 0 -50%; width: var(--chev-w); height: var(--chev-h); fill: none; stroke: var(--ink); stroke-width: 1.5; pointer-events: none; }   /* välja keskel */
.err { margin-top: var(--s-2); color: var(--ink); }
/* brauseri autofill-taust maha (vormi taust = ground) */
.field input:-webkit-autofill, .field input:-webkit-autofill:hover, .field input:-webkit-autofill:focus, .field textarea:-webkit-autofill {
  -webkit-text-fill-color: var(--ink); caret-color: var(--ink);
  -webkit-box-shadow: inset 0 0 0 1000px var(--ground); box-shadow: inset 0 0 0 1000px var(--ground);
  transition: background-color 9999s ease-in-out 0s;   /* lint-ok: autofill-tausta ülemineku peatamine */
}
.send { display: flex; align-items: center; justify-content: space-between; gap: var(--gutter); margin-top: var(--title-lead); }
.send .btn { flex: none; }
.notice { margin: 0; flex: 1; text-align: right; }   /* teavitus, mitte nõusoleku linnuke: GDPR alus = inimese enda palve */
.notice a { color: inherit; text-decoration-color: var(--accent); text-underline-offset: .25em; transition: color var(--dur-ui) var(--ease-ui), text-decoration-color var(--dur-ui) var(--ease-ui); }
/* hover nagu footeri Privacy policy: joon tuhmub liikumiseta ära, kiri aktsent (kasutaja 2026-11-23) */
@media (hover: hover) and (pointer: fine) { .notice a:hover { color: var(--accent); text-decoration-color: transparent; } }
.thanks { max-width: var(--measure-lead); }

/* ---------- väike või madal ekraan: ilma suurte vahedeta ---------- */
@media (max-height: 820px) {
  .sheet { padding: var(--gap); }
  .scroll { margin-top: var(--gap); }
  .send { margin-top: 0; }
}
@media (max-width: 700px) {
  .sheet {
    inset: 0; margin: 0; width: auto; height: auto; max-height: none; translate: none;   /* täisekraan: tõus paljastaks alt lehte */
    padding: 0 var(--edge) calc(var(--gap) + env(safe-area-inset-bottom));
  }
  /* foto servast servani 16 : 10; lühemal ekraanil madalam, väga madalal kaob (vorm ei keri) */
  .pic { display: block; flex: none; margin-inline: calc(-1 * var(--edge)); height: min(var(--enq-pic-w), 100svh - var(--enq-form) - var(--e, 0) * var(--enq-err)); max-height: var(--enq-pic-max); overflow: hidden; transition: height var(--dur-ui) var(--ease-ui); }   /* veateated võtavad ruumi fotolt */
  .pic img { width: 100%; height: 100%; object-fit: cover; object-position: 60% 62%; }
  .top { padding-top: var(--enq-gap); }
  /* X samas kohas ja sama suure ringiga nagu lehe Menu; fotota sulab ring lehe tooni */
  .close {
    position: absolute; z-index: 1; margin: 0; border-radius: 50%; background: var(--ground);
    width: var(--menu-ring); height: var(--menu-ring); top: var(--bar-top); right: var(--bar-top);
  }
  .scroll { margin-top: var(--enq-gap); }
  .send { margin-top: 0; }
}
</style>
