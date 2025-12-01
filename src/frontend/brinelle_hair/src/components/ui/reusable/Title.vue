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
    class="text-[42px] md:text-[64px] uppercase text-center mx-4 my-8 md:mx-8 md:my-16 font-poppins"
    :style="{ color: props.color }"
  >
    {{ props.text }}
  </h2>
</template>

<style scoped></style>