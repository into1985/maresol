<script setup lang="ts">
/* Navbari sildi hover „Rull" (kasutaja 2026-11-23, referents justienlescouhier.be „scroll"): tähed libisevad maskis
   üles ja samad tähed tõusevad alt, tähe kaupa väikese nihkega. Hover käivitub vanemalt (link / nupp), reeglid base.css .roll.
   Ligipääsetav nimi = peidetud terve tekst, tähed aria-hidden.
   Kerning: inline-block tähed kaotavad fondi kerningu (Local Partner oli 1,7 px laiem). Fontide laadimise järel mõõdetakse
   peidetud terviktekstist iga tähe tegelik samm (Range) ja erinevus antakse tähele margin-right'ina em-ides. */
const props = defineProps<{ text: string }>()
const chars = computed(() => [...props.text].map(c => (c === ' ' ? ' ' : c)))
const root = ref<HTMLElement | null>(null)
const sr = ref<HTMLElement | null>(null)
const cs = ref<HTMLElement[]>([])

const kern = () => {
  const node = sr.value?.firstChild
  if (!node || !cs.value.length) return
  const fs = parseFloat(getComputedStyle(sr.value!).fontSize)
  const r = document.createRange()
  const xs: number[] = []
  for (let i = 0; i <= props.text.length; i++) {
    r.setStart(node, Math.min(i, props.text.length - 1)); r.setEnd(node, Math.min(i + 1, props.text.length))
    const b = r.getBoundingClientRect()
    if (!b.width && !b.height) return   /* peidetud (display: none): mõõdetakse, kui nähtavale tuleb */
    xs.push(i < props.text.length ? b.left : b.right)
  }
  cs.value.forEach((el, i) => {
    el.style.marginRight = ''
    if (i === cs.value.length - 1) return
    const d = (xs[i + 1] - xs[i]) - el.getBoundingClientRect().width
    if (Math.abs(d) > .01) el.style.marginRight = (d / fs).toFixed(4) + 'em'
  })
}
let ro: ResizeObserver | null = null
onMounted(() => {
  document.fonts.ready.then(() => {
    kern()
    ro = new ResizeObserver(kern)   /* peidetud nupp (Menu) või kitsas vaade: mõõda uuesti, kui mõõdud muutuvad; tulemus sama, seega silmust pole */
    if (root.value) ro.observe(root.value)
  })
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <span ref="root" class="roll"><span ref="sr" class="sr-only">{{ text }}</span><span class="roll-v" aria-hidden="true"><span v-for="(c, i) in chars" :key="i" ref="cs" class="roll-c" :style="{ '--i': i }" :data-c="c">{{ c }}</span></span></span>
</template>
