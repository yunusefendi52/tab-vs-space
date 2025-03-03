// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    DB_URL: '',
    DB_AUTH_TOKEN: '',
    APP_PROTECTION_KEY: '',
    TURNSTILE_SECRET_KEY: '',
    public: {
      TURNSTILE_SITE_KEY: '',
    },
  },

  devtools: { enabled: true },

  nitro: {
    preset: "cloudflare-pages",
  },

  modules: ["nitro-cloudflare-dev"],
  compatibilityDate: "2024-07-04",
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [{
        rel: 'stylesheet',
        href: 'https://unpkg.com/simpledotcss@2.3.1/simple.min.css'
      }],
      script: [{
        src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
      }]
    },
  },
})