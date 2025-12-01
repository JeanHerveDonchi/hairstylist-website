<script setup lang="ts">
import { COLORS } from '@/constants/colors';
import { computed, onMounted } from 'vue'

/**
 * Reusable Main Button Component
 * 
 * Props:
 * - text: Button text (required)
 * - background: Background color in HEX format (default: color_primary)
 * - onClick: Click handler function (optional)
 */

interface Props {
  text: string
  background?: string
}

const props = withDefaults(defineProps<Props>(), {
  background: COLORS.color_primary
})

// Emit for click events (Vue way of handling events from child to parent)
const emit = defineEmits<{
  click: []
}>()

// Regex to validate hex color format (#RGB or #RRGGBB)
const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

// Validate background color on mount
onMounted(() => {
  if (!HEX_COLOR_REGEX.test(props.background)) {
    throw new Error(
      `MainButton: Invalid hex color format "${props.background}". ` +
      `Expected format: #RRGGBB or #RGB`
    )
  }
})

const handleClick = () => {
  emit('click')
}

// Darken the background color on hover (reduce brightness by ~15%)
const hoverBackgroundColor = computed(() => {
  // Convert hex to RGB
  let hex = props.background.replace('#', '')
  
  // Handle shorthand hex (#RGB -> #RRGGBB)
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('')
  }
  
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  // Darken by 15% (multiply by 0.85)
  const darkenedR = Math.floor(r * 0.85)
  const darkenedG = Math.floor(g * 0.85)
  const darkenedB = Math.floor(b * 0.85)
  
  // Convert back to hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(darkenedR)}${toHex(darkenedG)}${toHex(darkenedB)}`
})
</script>

<template>
  <button
    @click="handleClick"
    class="
      px-8 py-4 
      rounded-[25px]
      font-poppins font-semibold 
      text-[18px] md:text-[24px] 
      uppercase 
      transition-all duration-300 
      hover:scale-[1.02]
      active:scale-[0.98]
      m-4
    "
    :style="{
      backgroundColor: background,
      '--hover-bg': hoverBackgroundColor,
      color: COLORS.color_text_sub
    }"
  >
    {{ text }}
  </button>
</template>

<style scoped>
button:hover {
  background-color: var(--hover-bg);
}
</style>