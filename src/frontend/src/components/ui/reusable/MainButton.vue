<script setup lang="ts">
import { COLORS } from '@/constants/colors'
import { computed, onMounted } from 'vue'

/**
 * Reusable Main Button Component
 * 
 * Props:
 * - text: Button text (required)
 * - background: Background color in HEX format (default: color_primary)
 * - borderRadius: Border radius in px (default: 30)
 * - fontSize: Font size in px (default: 24)
 * - capitalized: Uppercase text (default: true)
 * - fontBold: Bold/semibold text (default: true)
 */

interface Props {
  text: string
  background?: string
  borderRadius?: number
  fontSize?: number
  capitalized?: boolean
  fontBold?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  background: COLORS.color_primary,
  borderRadius: 30,
  fontSize: 24,
  capitalized: true,
  fontBold: true
})

const emit = defineEmits<{
  click: []
}>()

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

onMounted(() => {
  if (!HEX_COLOR_REGEX.test(props.background)) {
    throw new Error(
      `MainButton: Invalid hex color format "${props.background}". Expected format: #RRGGBB or #RGB`
    )
  }
})

const handleClick = () => {
  emit('click')
}

const hoverBackgroundColor = computed(() => {
  let hex = props.background.replace('#', '')
  
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('')
  }
  
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  const darkenedR = Math.floor(r * 0.85)
  const darkenedG = Math.floor(g * 0.85)
  const darkenedB = Math.floor(b * 0.85)
  
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(darkenedR)}${toHex(darkenedG)}${toHex(darkenedB)}`
})
</script>

<template>
  <button
    @click="handleClick"
    class="px-8 py-4 font-poppins transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] m-4"
    :class="{
      'uppercase': capitalized,
      'font-semibold': fontBold,
      'font-normal': !fontBold
    }"
    :style="{
      backgroundColor: background,
      borderRadius: `${borderRadius}px`,
      fontSize: `${fontSize}px`,
      color: COLORS.color_text_sub,
      '--hover-bg': hoverBackgroundColor
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