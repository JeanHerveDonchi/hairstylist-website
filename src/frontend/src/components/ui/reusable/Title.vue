<script setup lang="ts">
import { COLORS } from '@/constants/colors';

/**
 * Reusable Title Component
 * 
 * Props:
 * - text: The title text to display
 * - color: Text color (default: COLOR.color_title)
 */

interface Props {
  text: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: COLORS.color_title
})
</script>

<template>
  <h2 
    class="text-[42px] md:text-[64px] uppercase text-center font-poppins px-4 py-8 md:px-8 md:py-16"
    :style="{ color: props.color }"
  >
    {{ props.text }}
  </h2>
</template>

<style scoped></style>