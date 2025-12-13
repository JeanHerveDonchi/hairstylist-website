<script setup lang="ts">
import { computed } from 'vue'
import type { TimeSlot } from '@/types/booking.types'

/**
 * Time Slot Picker Component
 * 
 * Grid of time buttons with:
 * - Available/unavailable slots
 * - Selection highlight
 * - Scrollable list
 */

interface Props {
  slots: TimeSlot[]              // Array of time slots with availability
  selectedTime?: string | null   // Currently selected time 'HH:00'
  isLoading?: boolean            // Loading state when fetching slots
}

const props = withDefaults(defineProps<Props>(), {
  selectedTime: null,
  isLoading: false
})

const emit = defineEmits<{
  timeSelected: [time: string]
}>()

// ==========================================================================
// COMPUTED
// ==========================================================================

const formattedSlots = computed(() => {
  return props.slots.map(slot => {
    const [hourStr] = String(slot.time ?? '').split(':')
    // ensure we always have a number (fallback to 0) so `hour` is never undefined
    const hour = Number(hourStr ?? '0') || 0
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    
    return {
      ...slot,
      formatted: `${displayHour}:00 ${period}`
    }
  })
})

// ==========================================================================
// METHODS
// ==========================================================================

const selectTime = (slot: any) => {
  if (!slot.available) return
  
  emit('timeSelected', slot.time)
}
</script>

<template>
  <div class="w-full max-w-xs bg-white rounded-lg p-4">
    <h3 class="text-lg font-poppins font-semibold text-[#6E645F] mb-4">
      Horaires disponibles
    </h3>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F98B54]"></div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="slots.length === 0" class="text-center py-12">
      <p class="text-sm font-poppins text-[#B4AAA6]">
        Aucun horaire disponible pour cette date
      </p>
    </div>
    
    <!-- Time Slots Grid -->
    <div v-else class="time-slots-container space-y-2 max-h-96 overflow-y-auto pr-2">
      <button
        v-for="slot in formattedSlots"
        :key="slot.time"
        @click="selectTime(slot)"
        class="
          w-full
          px-4 py-3
          text-left
          font-poppins
          rounded-lg
          transition-all duration-200
          border-2
        "
        :class="{
          // Available
          'border-gray-200 text-[#6E645F] hover:border-[#F98B54] hover:bg-[#FFE5D9] cursor-pointer': slot.available && selectedTime !== slot.time,
          // Selected
          'border-[#F98B54] bg-[#F98B54] text-white font-semibold': selectedTime === slot.time,
          // Unavailable
          'border-gray-100 bg-gray-50 text-[#B4AAA6] cursor-not-allowed': !slot.available
        }"
        :disabled="!slot.available"
      >
        {{ slot.formatted }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar styling */
.time-slots-container::-webkit-scrollbar {
  width: 6px;
}

.time-slots-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.time-slots-container::-webkit-scrollbar-thumb {
  background: #F98B54;
  border-radius: 10px;
}

.time-slots-container::-webkit-scrollbar-thumb:hover {
  background: #e77d43;
}
</style>