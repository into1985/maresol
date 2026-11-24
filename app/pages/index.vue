<script setup lang="ts">
// MARESOL × Memoshome — avaleht. Sektsioonid lisatakse Faas 2-s ükshaaval (kinnitatud demo järel).
import jsonld from '~/data/jsonld.json'

const title = 'Homes in Alanya, Built and Managed by Memoshome | Maresol'
const description = 'Memoshome builds homes in Oba and around Alanya, and looks after them once they are yours. Four selected projects, and how buying and owning work in Turkey.'
const share = 'Homes built by Memoshome in Oba and around Alanya, with a local team that stays with you after the purchase.'

useSeoMeta({
  title,
  description,
  ogType: 'website',
  ogSiteName: 'Maresol',
  ogLocale: 'en_GB',
  ogTitle: 'A home in Alanya, and someone to look after it',
  ogDescription: share,
  ogImage: '/maresol-Open-Graphic.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'A Memoshome residential project in Alanya, with the sea in the background',
  twitterCard: 'summary_large_image',
  twitterTitle: 'A home in Alanya, and someone to look after it',
  twitterDescription: share,
  twitterImage: '/maresol-Open-Graphic.jpg'
})

// canonical + og:url lisatakse, kui domeen on kinnitatud (copy „Open items")
useHead({
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonld) }]
})
</script>

<template>
  <SiteHeader />
  <main>
    <HeroSection />
    <WhySection />
    <WhereSection />
    <CoastSection />
    <HomesSection />
    <MoreSection />
    <PurchaseSection />
    <OwnershipSection />
    <VisitSection />
    <ContactSection />
  </main>
  <EnquiryOverlay />
</template>
