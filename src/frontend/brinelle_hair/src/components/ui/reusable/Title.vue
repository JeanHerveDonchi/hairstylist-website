<script setup lang="ts">
/**
 * Reusable Title Component
 * 
 * Props:
 * - text: The title text to display
 * - color: Text color (default: #AB9C93)
 */

interface Props {
  text: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: '#AB9C93'
})
</script>

<template>
  <h2 
    class="text-[64px] uppercase text-center mx-4 my-6 md:mx-8 md:my-8 font-poppins"
    :style="{ color: props.color }"
  >
    {{ props.text }}
  </h2>
</template>

<style scoped></style>