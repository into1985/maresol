<script setup lang="ts">
/* Footer (tõstetud ContactSectionist 2026-11-22, et sama rida oleks ka /privacy-policy lehel):
   © vasakul (Skippern Yachts AS link → skippern.yachts, sama stiil kui Privacy policy), Privacy policy paremal, joon --rule. Privacy policy lehel link märgitud aria-current. */
const onPolicy = computed(() => useRoute().path === '/privacy-policy')
</script>

<template>
  <footer class="foot">
    <p class="t-note is-soft">© 2026 Maresol, operated by <a href="https://skippern.yachts/" target="_blank" rel="noopener noreferrer">Skippern Yachts AS</a></p>
    <p class="t-note is-soft"><NuxtLink to="/privacy-policy" :aria-current="onPolicy ? 'page' : undefined">Privacy policy</NuxtLink></p>
  </footer>
</template>

<style scoped>
p { margin-block: 0; }
a { color: inherit; }.foot {
  margin-inline: var(--pad-x); padding-block: var(--gap); border-top: var(--hair) solid var(--rule);
  display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--s-2) var(--gutter);
}
</style>
