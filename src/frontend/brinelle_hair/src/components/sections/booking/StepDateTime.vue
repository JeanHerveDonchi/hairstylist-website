<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAvailability } from '@/composables/useAvailability'

/**
 * Step 2: Date & Time Selection
 * 
 * SIMPLIFIED VERSION - Full calendar/time picker to be built next
 * For now: basic date/time inputs for testing flow
 */

interface Props {
  initialDate?: string | null
  initialTime?: string | null
  hairstyleDuration: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [date: string, time: string]
}>()

const { getAvailableSlotsForDate } = useAvailability()

// ==========================================================================
// STATE
// ==========================================================================

const selectedDate = ref(props.initialDate || '')
const selectedTime = ref(props.initialTime || '')
const availableSlots = ref<string[]>([])

// ==========================================================================
// LOAD AVAILABLE SLOTS
// ==========================================================================

watch(selectedDate, (newDate) => {
  if (newDate) {
    const slots = getAvailableSlotsForDate(newDate)
    availableSlots.value = slots.filter(s => s.available).map(s => s.time)
  }
})

// ==========================================================================
// EMIT UPDATES
// ==========================================================================

watch([selectedDate, selectedTime], ([date, time]) => {
  if (date && time) {
    emit('update', date, time)
  }
})
</script>

<template>
  <div class="max-w-2xl mx-auto px-6 py-8">
    <h2 class="text-2xl md:text-3xl font-poppins font-semibold text-[#6E645F] mb-8 text-center">
      Choisissez votre horaire
    </h2>
    
    <div class="space-y-6">
      <!-- Date Input (Temporary - will be calendar) -->
      <div>
        <label class="block text-sm font-poppins font-medium text-[#6E645F] mb-2">
          Date *
        </label>
        <input
          v-model="selectedDate"
          type="date"
          :min="new Date().toISOString().split('T')[0]"
          class="
            w-full px-4 py-3 border border-gray-300 rounded-lg
            font-poppins
            focus:outline-none focus:ring-2 focus:ring-[#F98B54] focus:border-transparent
          "
        />
      </div>
      
      <!-- Time Slot Selection (Temporary - will be time picker) -->
      <div v-if="selectedDate">
        <label class="block text-sm font-poppins font-medium text-[#6E645F] mb-2">
          Heure *
        </label>
        <select
          v-model="selectedTime"
          class="
            w-full px-4 py-3 border border-gray-300 rounded-lg
            font-poppins
            focus:outline-none focus:ring-2 focus:ring-[#F98B54] focus:border-transparent
          "
        >
          <option value="">Sélectionnez une heure</option>
          <option v-for="slot in availableSlots" :key="slot" :value="slot">
            {{ slot }}
          </option>
        </select>
      </div>
      
      <!-- Info Message -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-800 font-poppins">
          📅 Calendrier interactif à venir dans la prochaine itération
        </p>
        <p class="text-xs text-blue-600 font-poppins mt-2">
          Durée estimée: {{ hairstyleDuration }} minutes
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>