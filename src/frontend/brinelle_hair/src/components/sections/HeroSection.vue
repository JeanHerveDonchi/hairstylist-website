<script setup lang="ts">
import { HERO_IMAGES } from '@/constants/images'

const desktopImageUrl = HERO_IMAGES.desktop
const mobileImageUrl = HERO_IMAGES.mobile

// Check if we have any images
const hasImages = desktopImageUrl || mobileImageUrl
</script>

<template>
  <section class="w-full h-[720px] relative">
    <!-- Desktop Image (hidden on mobile) -->
    <div
      v-if="desktopImageUrl"
      class="hidden md:block w-full h-full bg-cover bg-center"
      :style="{ backgroundImage: `url(${desktopImageUrl})` }"
    ></div>

    <!-- Mobile Image (hidden on desktop) -->
    <div
      v-if="mobileImageUrl"
      class="block md:hidden w-full h-full bg-cover bg-center"
      :style="{ backgroundImage: `url(${mobileImageUrl})` }"
    ></div>

    <!-- Grey Placeholder (when no images at all) -->
    <div
      v-if="!hasImages"
      class="w-full h-full bg-gray-300"
    ></div>
  </section>
</template>

<style scoped></style>