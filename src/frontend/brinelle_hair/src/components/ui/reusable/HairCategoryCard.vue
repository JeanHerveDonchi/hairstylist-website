<script setup lang="ts">
import ImageCard from './ImageCard.vue'

/**
 * Hair Category Card Component
 * 
 * Displays a clickable card with image, category title, and starting price
 * 
 * Props:
 * - imageUrl: Category image URL (passed to ImageCard)
 * - categoryTitle: Title of the category (e.g., "HOMMES", "FEMMES")
 * - startPrice: Starting price for this category
 * - size: Image size in pixels (optional, default handled by ImageCard)
 */

interface Props {
  imageUrl: string
  categoryTitle: string
  startPrice: number
  size?: number
}

const props = defineProps<Props>()

// Emit click event when card is clicked
const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <div 
    @click="handleClick"
    class="
      p-6 
      cursor-pointer 
      transition-transform duration-300 
      hover:scale-105
      active:scale-95
      inline-block
    "
  >
    <!-- Image Card -->
    <ImageCard 
      :imageUrl="imageUrl" 
      :size="size"
    />
    
    <!-- Category Title -->
    <h3 
      class="
        mt-4 
        text-[16px] md:text-[20px] 
        uppercase 
        font-poppins font-semibold 
        text-[#6E645F]
        text-left
      "
    >
      coiffures {{ categoryTitle }}
    </h3>
    
    <!-- Price -->
    <p 
      class="
        mt-2 
        text-[14px] md:text-[18px] 
        font-poppins 
        text-[#6E645F]
        text-left
      "
    >
      À partir de ${{ startPrice }}
    </p>
  </div>
</template>

<style scoped></style>