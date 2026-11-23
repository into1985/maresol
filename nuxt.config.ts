// MARESOL × Memoshome. Nuxt 4, SSR. Demod eemaldatud enne live'i (2026-11-23).
export default defineNuxtConfig({
  compatibilityDate: '2026-11-20',
  devtools: { enabled: false },
  modules: ['@vercel/analytics/nuxt'],
  css: ['~/assets/css/tokens.css', '~/assets/css/base.css'],
  /* Pildi src mallis = tavaline tee public/ kausta, mitte Vite'i import: pilte saab töö käigus vahetada
     (.jpg / .png / .webp), puuduv fail annab ainult 404, mitte komponendi laadimisvea (kasutaja 2026-11-22). */
  vite: { vue: { template: { transformAssetUrls: false } }, optimizeDeps: { include: ['lenis'] } },   /* Lenis eelpakitud: dev ei lae lehte esimesel kasutusel uuesti */
  app: {
    head: {
      htmlAttrs: { lang: 'en-GB' },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'preload', href: '/font/KelmithaCntr-ExtraLight.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        { rel: 'preload', href: '/font/VonticaSans-Regular.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        /* päise sildid ja hero Enquire on esimesel ekraanil (kasutaja 2026-11-23): muidu leiti font alles CSS-ist → varufondi vilksatus */
        { rel: 'preload', href: '/font/LeniaSoft-Medium.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }
      ]
    }
  }
})
