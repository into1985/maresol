<script setup lang="ts">
/* 404 / vealeht (2026-11-22). Nuxt kuvab selle iga vea korral; copy on 404 jaoks, muu vea korral sama sõnum.
   Paigutus privacy-lehe päisest: pealkiri t-display, lause t-lead, link nagu päise „Send an enquiry" (tint + aktsentjoon).
   Sisu sisukonteineri vasakul joonel, ekraani kõrguses vertikaalselt keskel; päis ja footer samad mis mujal. */
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()
useHead({ title: 'Page not found | Maresol', meta: [{ name: 'robots', content: 'noindex' }] })
const home = () => clearError({ redirect: '/' })
</script>

<template>
  <SiteHeader />
  <main class="nf">
    <h1 class="t-display">Page not found</h1>
    <p class="t-lead title-lead">The page you were looking for is not here.</p>
    <a class="back t-body" href="/" @click.prevent="home">Back to the homepage <span aria-hidden="true">→</span></a>
  </main>
  <SiteFooter />
  <EnquiryOverlay />
</template>

<style scoped>
h1, p { margin: 0; }
.nf {
  min-height: 100svh;
  display: flex; flex-direction: column; justify-content: center; align-items: flex-start;
  padding: var(--frame-y) var(--pad-x);   /* ülal ja all sama raam nagu hero'l */
}
.back {
  margin-top: var(--head-gap); color: var(--ink);
  text-decoration-line: underline; text-decoration-color: var(--accent); text-decoration-thickness: var(--hair); text-underline-offset: .5em;
}
</style>
