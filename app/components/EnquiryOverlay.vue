<script setup lang="ts">
/* Päringu-overlay „Kaart keskel" (Faas 3 päringu demo A, kinnitatud 2026-11-21). Copy: Enquire · Name ·
   Email or phone · Message · [Send] · teavitusrida + Privacy policy; tänusõnum „Thank you. Your enquiry has been
   received." Vorm on prototüüp (saatmiseta): valideerimine + tänuvaade.
   Kaart lehe keskel, kogu leht (ka päis) tumendatud ja hägune. Fookus kaardil (mitte väljal), Esc / klõps
   tumendusel sulgeb, kerimine lukus, fookus tagasi avajale. X pealkirja real ja paigal; spellcheck välja,
   autofill-taust maha; sõnumiväli kasvab ainult nii palju, kui vaba ruumi jääb (põrand 2 rida).
   ≤ 820 px kõrge: tihedamad vahed. ≤ 700 px lai: täisekraan, pealkiri X-i real.
   Avajad: iga [data-enquire] nupp lehel (päis, menüü, hero, kontakt). */
const open = ref(false)
const sent = ref(false)
const f = reactive({ name: '', contact: '', message: '' })
const err = reactive({ name: '', contact: '' })
const sheet = ref<HTMLElement | null>(null)
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
  document.documentElement.style.overflow = v ? 'hidden' : ''
  if (v) {
    /* menüüst avades on avaja sulgemisel inert → fookus menüü nupule */
    const menu = from?.closest<HTMLElement>('[role="dialog"][id]')
    opener = (menu && document.querySelector<HTMLElement>(`[aria-controls="${menu.id}"]`)) || from || null
    nextTick(() => { sheet.value?.focus(); fit() })
  }
  else {
    opener?.focus()
    setTimeout(() => { if (!open.value) { sent.value = false; Object.assign(f, { name: '', contact: '', message: '' }); Object.assign(err, { name: '', contact: '' }) } }, 300)
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
    const els = [...sheet.value.querySelectorAll<HTMLElement>('a[href], button, input, textarea')].filter(el => el.offsetParent)
    const first = els[0], last = els[els.length - 1]
    if (e.shiftKey && (document.activeElement === first || document.activeElement === sheet.value)) { e.preventDefault(); last?.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
  }
}
const onClick = (e: MouseEvent) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>('[data-enquire]')
  if (b) setOpen(true, b)
}
const onResize = () => { if (open.value) fit() }
onMounted(() => {
  window.addEventListener('keydown', onKey); document.addEventListener('click', onClick); window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); window.removeEventListener('resize', onResize); document.documentElement.style.overflow = '' })
</script>

<template>
  <div class="q" :class="{ 'is-open': open }">
    <div class="dim" @click="setOpen(false)" />

    <div ref="sheet" class="sheet" role="dialog" aria-modal="true" aria-labelledby="enq-title" tabindex="-1" :inert="!open">
      <div class="top">
        <h2 id="enq-title" class="t-h2">Enquire</h2>
        <button class="close" type="button" aria-label="Close" @click="setOpen(false)">
          <svg viewBox="0 0 22 22" aria-hidden="true"><path d="M4 4 18 18M18 4 4 18" /></svg>
        </button>
      </div>

      <div ref="scroller" class="scroll">
        <form v-if="!sent" class="form" novalidate @submit.prevent="send">
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
a { color: inherit; }

/* ---------- tumendus kogu lehe peal (ka päisel) ---------- */
.dim {
  position: fixed; inset: 0; z-index: var(--z-overlay);
  opacity: 0; visibility: hidden; transition: opacity var(--dur-ui) var(--ease-ui), visibility 0s linear var(--dur-ui);
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
  opacity: 0; visibility: hidden; transition: opacity var(--dur-ui) var(--ease-ui), visibility 0s linear var(--dur-ui);
}
.sheet:focus { outline: none; }
.is-open .sheet { opacity: 1; visibility: visible; transition: opacity var(--dur-ui) var(--ease-ui), visibility 0s linear; }
/* pealkiri ja X ühel real, X jääb paigale ka siis, kui sisu kerib */
.top { display: flex; justify-content: space-between; align-items: center; gap: var(--gutter); }
.close { display: inline-flex; align-items: center; justify-content: center; min-width: var(--hit); min-height: var(--hit); margin-right: calc(-1 * var(--s-3)); }
.close svg { width: var(--icon); height: var(--icon); fill: none; stroke: currentColor; stroke-width: 1.5; }
.scroll { flex: 1; min-height: 0; overflow: auto; display: flex; flex-direction: column; margin-top: var(--head-gap); }

/* ---------- vorm ---------- */
.form { display: flex; flex-direction: column; gap: var(--gap); }
.field { display: flex; flex-direction: column; }
.field label { color: var(--soft); }
.field input, .field textarea {
  width: 100%; margin-top: var(--s-2); padding: var(--s-2) 0;
  border: 0; border-bottom: var(--hair) solid var(--rule); border-radius: 0;
  background: none; color: var(--ink); outline: none; resize: none;
  transition: border-color var(--dur-ui) var(--ease-ui);
}
.field input:focus, .field textarea:focus, .is-error input { border-bottom-color: var(--ink); }
.field textarea { display: block; overflow: auto; }
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
    inset: 0; margin: 0; width: auto; height: auto; max-height: none;
    padding: var(--bar-top) var(--edge) calc(var(--gap) + env(safe-area-inset-bottom));
  }
  .scroll { margin-top: var(--gap); }
  .send { margin-top: 0; }
}
</style>
