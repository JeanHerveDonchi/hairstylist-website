<script setup lang="ts">
import { useImageValidation } from '@/composables/useImageValidation'
import { PLACEHOLDER_CONFIG } from '@/constants/images';
import { computed } from 'vue'

/**
 * Reusable Image Card Component
 * 
 * Props:
 * - imageUrl: Image source URL
 * - size: Square size in pixels (default: 392)
 */

interface Props {
  imageUrl: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 392
})

// Use composable for image validation with loading check
const { hasValidImage, isLoading } = useImageValidation(props.imageUrl)

// Computed styles for dynamic sizing
const cardStyles = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))

const imageStyles = computed(() => ({
  backgroundImage: `url(${props.imageUrl})`
}))
</script>

<template>
  <div 
    class="rounded-[25px] overflow-hidden"
    :style="cardStyles"
  >
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="w-full h-full bg-gray-200 animate-pulse"
    ></div>

    <!-- Valid Image (loaded successfully) -->
    <div
      v-else-if="hasValidImage"
      class="w-full h-full bg-cover bg-center"
      :style="imageStyles"
    ></div>
    
    <!-- Placeholder (image failed to load or empty URL) -->
    <div
      v-else
      class="w-full h-full"
      :style="{ backgroundColor: PLACEHOLDER_CONFIG.color }"
    ></div>
  </div>
</template>

<style scoped></style>