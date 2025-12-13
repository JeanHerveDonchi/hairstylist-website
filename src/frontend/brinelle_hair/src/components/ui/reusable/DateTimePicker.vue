<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAvailability } from '@/composables/useAvailability'
import { formatDate } from '@/utils/booking/validations/formatDate'
import Calendar from './Calendar.vue'
import TimeSlotPicker from './TimeSlotPicker.vue'
import type { TimeSlot } from '@/types/booking.types'

/**
 * DateTime Picker Component
 * 
 * Complete reusable date and time selection with:
 * - Calendar view (month navigation)
 * - Time slot selection
 * - Availability integration
 * - Selected display
 */

interface Props {
  initialDate?: string | null
  initialTime?: string | null
  minDate?: Date
  maxDate?: Date
  hairstyleDuration?: number  // For slot validation (future use)
}

const props = withDefaults(defineProps<Props>(), {
  initialDate: null,
  initialTime: null,
  minDate: () => {
    // Default to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  },
  maxDate: () => new Date(2050, 11, 31),
  hairstyleDuration: 60
})

const emit = defineEmits<{
  update: [date: string, time: string]
}>()

const { 
  getAvailableSlotsForDate, 
  getAvailableDatesForMonth, 
  loadMonthAvailability 
} = useAvailability()

// ==========================================================================
// STATE
// ==========================================================================

const selectedDate = ref<string | null>(props.initialDate)
const selectedTime = ref<string | null>(props.initialTime)
const availableTimeSlots = ref<TimeSlot[]>([])
const unavailableDates = ref<Set<string>>(new Set())
const isLoadingSlots = ref(false)
const currentMonth = ref(new Date().getMonth() + 1)
const currentYear = ref(new Date().getFullYear())

// ==========================================================================
// COMPUTED
// ==========================================================================

const formattedSelection = computed(() => {
  if (!selectedDate.value) return null
  
  // Parse date as local time (not UTC)
  const parts = selectedDate.value.split('-')
  const year = Number(parts[0]) || new Date().getFullYear()
  const month = Number(parts[1]) || 1
  const day = Number(parts[2]) || 1
  const date = new Date(year, month - 1, day)
  
  const dateStr = date.toLocaleDateString('fr-CA', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  if (!selectedTime.value) return dateStr
  
  // Provide a default value for hour to avoid possible 'undefined'
  const [hour = 0] = selectedTime.value.split(':').map(Number)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  
  return `${dateStr} à ${displayHour}:00 ${period}`
})

// ==========================================================================
// METHODS
// ==========================================================================

const handleDateSelected = async (date: string) => {
  selectedDate.value = date
  selectedTime.value = null // Reset time when date changes
  
  // Load time slots for selected date
  isLoadingSlots.value = true
  
  // Simulate loading (in real app, this might be an API call)
  await new Promise(resolve => setTimeout(resolve, 300))
  
  availableTimeSlots.value = getAvailableSlotsForDate(date)
  isLoadingSlots.value = false
}

const handleTimeSelected = (time: string) => {
  selectedTime.value = time
  
  // Emit update when both date and time are selected
  if (selectedDate.value && selectedTime.value) {
    emit('update', selectedDate.value, selectedTime.value)
  }
}

const handleMonthChanged = async (year: number, month: number) => {
  currentYear.value = year
  currentMonth.value = month
  
  // Load availability for new month
  await loadMonthAvailability(year, month)
  
  // Update unavailable dates set
  const allDates = getAvailableDatesForMonth(year, month)
  
  // Get all dates in month
  const daysInMonth = new Date(year, month, 0).getDate()
  const allDatesInMonth = new Set<string>()
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = formatDate(new Date(year, month - 1, day))
    allDatesInMonth.add(date)
  }
  
  // Unavailable = all dates - available dates
  unavailableDates.value = new Set(
    [...allDatesInMonth].filter(date => !allDates.has(date))
  )
}

// ==========================================================================
// LIFECYCLE
// ==========================================================================

onMounted(async () => {
  // Load current month on mount
  await handleMonthChanged(currentYear.value, currentMonth.value)
  
  // If initial date provided, load its time slots
  if (selectedDate.value) {
    availableTimeSlots.value = getAvailableSlotsForDate(selectedDate.value)
  }
})
</script>

<template>
  <div class="w-full">
    <!-- Calendar and Time Slots (Side by Side) -->
    <div class="flex flex-col lg:flex-row gap-6 items-start justify-center">
      <!-- Calendar -->
      <Calendar
        :selectedDate="selectedDate"
        :minDate="minDate"
        :maxDate="maxDate"
        :unavailableDates="unavailableDates"
        @dateSelected="handleDateSelected"
        @monthChanged="handleMonthChanged"
      />
      
      <!-- Time Slots (Only show when date selected) -->
      <TimeSlotPicker
        v-if="selectedDate"
        :slots="availableTimeSlots"
        :selectedTime="selectedTime"
        :isLoading="isLoadingSlots"
        @timeSelected="handleTimeSelected"
      />
      
      <!-- Placeholder when no date selected -->
      <div
        v-else
        class="w-full max-w-xs bg-gray-50 rounded-lg p-8 flex items-center justify-center"
      >
        <p class="text-sm font-poppins text-[#B4AAA6] text-center">
          Sélectionnez une date pour voir les horaires disponibles
        </p>
      </div>
    </div>
    
    <!-- Selected DateTime Display -->
    <div
      v-if="formattedSelection"
      class="mt-6 p-4 bg-[#FFE5D9] rounded-lg text-center"
    >
      <p class="text-sm font-poppins text-[#6E645F] mb-1">
        Rendez-vous sélectionné:
      </p>
      <p class="text-lg font-poppins font-semibold text-[#F98B54] capitalize">
        {{ formattedSelection }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>