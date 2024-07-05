<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const title = 'Tab vs Space'
const description = 'Vote for your empty space, is it tab or space'
useHead({
  title: title,
  meta: [{
    name: 'description',
    content: description,
  }],
})
const ogImage = 'https://tab-vs-space.pages.dev/assets/ogimage.png'
useSeoMeta({
  ogTitle: title,
  ogDescription: description,
  ogLocale: 'en-US',
  ogImageType: 'image/png',
  ogImage: ogImage,
  ogImageAlt: description,
  ogImageHeight: 675,
  ogImageWidth: 1200,
  
  // Twitter
  twitterTitle: title,
  twitterDescription: description,
  twitterSite: '@yunusefendi52',
  twitterCard: 'summary_large_image',
  twitterImage: ogImage,
  twitterImageAlt: description,
})
</script>