// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    DB_URL: '',
    DB_AUTH_TOKEN: '',
    APP_PROTECTION_KEY: '',
  },

  devtools: { enabled: true },

  nitro: {
    preset: "cloudflare-pages",
  },

  modules: ["nitro-cloudflare-dev"],
  compatibilityDate: "2024-07-04"
})