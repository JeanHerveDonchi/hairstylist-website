<script setup lang="ts">
import { COLORS } from '@/constants/colors'
import ImageCard from './ImageCard.vue'

/**
 * Hairstyle Card Component (List View)
 * 
 * Displays a clickable card with image on left, details on right
 * 
 * Props:
 * - id: Unique hairstyle identifier
 * - imageUrl: Hairstyle image URL
 * - name: Hairstyle name
 * - description: Hairstyle description
 * - price: Starting price
 * - size: Image size in pixels (optional, default 150px for list view)
 */

interface Props {
  id: string
  imageUrl: string
  name: string
  description: string
  price: number
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 260  // Larger default size for list view
})

// Emit click event with hairstyle id
const emit = defineEmits<{
  click: [id: string]
}>()

const handleClick = () => {
  emit('click', props.id)
}
</script>

<template>
  <div 
    @click="handleClick"
    class="
      flex 
      flex-col
      sm:flex-row
      sm:items-center
      gap-8
      p-6 
      cursor-pointer
      items-center
      group
    "
  >
    <!-- Image Card (Left on desktop, Top on mobile) -->
    <div class="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
      <ImageCard 
        :imageUrl="imageUrl" 
        :size="size"
      />
    </div>
    
    <!-- Details (Right on desktop, Bottom on mobile) -->
    <div class="flex flex-col justify-center flex-1 min-w-0 sm:ml-4 text-left max-w-[200px] sm:max-w-none mx-auto sm:mx-0">
      <!-- Hairstyle Name -->
      <h3 
        class="
          text-[18px] md:text-[22px] 
          uppercase 
          font-poppins font-semibold
          mb-3
        "
        :style="{color: COLORS.color_text_main}"
      >
        {{ name }}
      </h3>
      
      <!-- Description -->
      <p 
        class="
          text-[14px] md:text-[16px] 
          font-poppins
          mb-4
          line-clamp-2
        "
        :style="{color: COLORS.color_text_main}"
      >
        {{ description }}
      </p>
      
      <!-- Price -->
      <p 
        class="
          text-[14px] md:text-[18px] 
          font-poppins font-semibold
        "
        :style="{color: COLORS.color_text_main}"
      >
        À partir de ${{ price }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Truncate description to 2 lines */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>