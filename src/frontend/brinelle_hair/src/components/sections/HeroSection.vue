<script setup lang="ts">
import { HERO_IMAGES, PLACEHOLDER_CONFIG } from '@/constants/images'
import { useImageValidation } from '@/composables/useImageValidation'

const desktopImageUrl = HERO_IMAGES.desktop
const mobileImageUrl = HERO_IMAGES.mobile

// Use composable for validation (accepts multiple URLs, validates by loading)
const { hasValidImage, isLoading } = useImageValidation(desktopImageUrl, mobileImageUrl)
</script>

<template>
  <section class="w-full h-[720px] relative">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="w-full h-full bg-gray-200 animate-pulse"
    ></div>

    <template v-else>
      <!-- Desktop Image (hidden on mobile) -->
      <div
        v-if="desktopImageUrl && hasValidImage"
        class="hidden md:block w-full h-full bg-cover bg-center"
        :style="{ backgroundImage: `url(${desktopImageUrl})` }"
      ></div>

      <!-- Mobile Image (hidden on desktop) -->
      <div
        v-if="mobileImageUrl && hasValidImage"
        class="block md:hidden w-full h-full bg-cover bg-center"
        :style="{ backgroundImage: `url(${mobileImageUrl})` }"
      ></div>

      <!-- Grey Placeholder (when no valid images) -->
      <div
        v-if="!hasValidImage"
        class="w-full h-full"
        :style="{ backgroundColor: PLACEHOLDER_CONFIG.color }"
      ></div>
    </template>
  </section>
</template>

<style scoped></style>