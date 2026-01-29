<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { formatDate } from '@/utils/booking/validations/formatDate'

/**
 * Calendar Component
 * 
 * Month view calendar with:
 * - Month/year navigation
 * - Date selection
 * - Disabled dates (past + unavailable)
 * - Year picker (click on month/year)
 */

interface Props {
  selectedDate?: string | null      // 'YYYY-MM-DD'
  minDate?: Date                    // Minimum selectable date
  maxDate?: Date                    // Maximum selectable date
  unavailableDates?: Set<string>    // Set of unavailable date strings
}

const props = withDefaults(defineProps<Props>(), {
  selectedDate: null,
  minDate: () => new Date(),
  maxDate: () => new Date(2050, 11, 31),
  unavailableDates: () => new Set()
})

const emit = defineEmits<{
  dateSelected: [date: string]
  monthChanged: [year: number, month: number]
}>()

// ==========================================================================
// STATE
// ==========================================================================

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth()) // 0-11
const showYearPicker = ref(false)

// ==========================================================================
// COMPUTED
// ==========================================================================

const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

const dayNames = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']

const currentMonthName = computed(() => monthNames[currentMonth.value])

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  const day = new Date(currentYear.value, currentMonth.value, 1).getDay()
  return day === 0 ? 6 : day - 1 // Convert Sunday=0 to Monday=0
})

const calendarDays = computed(() => {
  const days = []
  const prevMonthDays = firstDayOfMonth.value
  
  // Previous month days (greyed out)
  const prevMonth = currentMonth.value === 0 ? 11 : currentMonth.value - 1
  const prevYear = currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()
  
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const dateString = `${prevYear}-${(prevMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    
    days.push({
      day,
      date: dateString,
      isCurrentMonth: false,
      isDisabled: true
    })
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth.value; day++) {
    const date = new Date(currentYear.value, currentMonth.value, day)
    // Format date properly without timezone issues
    const dateString = `${currentYear.value}-${(currentMonth.value + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    const isPast = date < props.minDate
    const isFuture = date > props.maxDate
    const isUnavailable = props.unavailableDates.has(dateString)
    
    days.push({
      day,
      date: dateString,
      isCurrentMonth: true,
      isDisabled: isPast || isFuture || isUnavailable,
      isSelected: dateString === props.selectedDate,
      isToday: dateString === formatDate(new Date())
    })
  }
  
  // Next month days to fill grid
  const remainingDays = 42 - days.length // 6 rows × 7 days
  for (let day = 1; day <= remainingDays; day++) {
    const nextMonth = currentMonth.value === 11 ? 0 : currentMonth.value + 1
    const nextYear = currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value
    const dateString = `${nextYear}-${(nextMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    
    days.push({
      day,
      date: dateString,
      isCurrentMonth: false,
      isDisabled: true
    })
  }
  
  return days
})

const availableYears = computed(() => {
  const years = []
  const minYear = props.minDate.getFullYear()
  const maxYear = props.maxDate.getFullYear()
  
  for (let year = minYear; year <= maxYear; year++) {
    years.push(year)
  }
  
  return years
})

// ==========================================================================
// METHODS
// ==========================================================================

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  
  emit('monthChanged', currentYear.value, currentMonth.value + 1)
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  
  emit('monthChanged', currentYear.value, currentMonth.value + 1)
}

const selectDate = (day: any) => {
  if (day.isDisabled || !day.isCurrentMonth) return
  
  emit('dateSelected', day.date)
}

const toggleYearPicker = () => {
  showYearPicker.value = !showYearPicker.value
}

const selectYear = (year: number) => {
  currentYear.value = year
  showYearPicker.value = false
  emit('monthChanged', currentYear.value, currentMonth.value + 1)
}

// ==========================================================================
// WATCHERS
// ==========================================================================

watch([currentYear, currentMonth], () => {
  emit('monthChanged', currentYear.value, currentMonth.value + 1)
})
</script>

<template>
  <div class="w-full max-w-sm bg-white rounded-lg p-4">
    <!-- Header: Month/Year Navigation -->
    <div class="flex items-center justify-between mb-4">
      <button
        @click="previousMonth"
        class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Previous month"
      >
        <svg class="w-5 h-5 text-[#6E645F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        @click="toggleYearPicker"
        class="text-lg font-poppins font-semibold text-[#6E645F] hover:text-[#F98B54] transition-colors"
      >
        {{ currentMonthName }} {{ currentYear }}
      </button>
      
      <button
        @click="nextMonth"
        class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Next month"
      >
        <svg class="w-5 h-5 text-[#6E645F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    
    <!-- Year Picker (Dropdown) -->
    <div v-if="showYearPicker" class="mb-4 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
      <button
        v-for="year in availableYears"
        :key="year"
        @click="selectYear(year)"
        class="w-full px-3 py-2 text-left font-poppins rounded hover:bg-[#FFE5D9] transition-colors"
        :class="{
          'bg-[#F98B54] text-white': year === currentYear,
          'text-[#6E645F]': year !== currentYear
        }"
      >
        {{ year }}
      </button>
    </div>
    
    <!-- Day Names -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="day in dayNames"
        :key="day"
        class="text-center text-xs font-poppins font-medium text-[#6E645F] py-2"
      >
        {{ day }}
      </div>
    </div>
    
    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="(day, index) in calendarDays"
        :key="index"
        @click="selectDate(day)"
        class="
          aspect-square
          flex items-center justify-center
          text-sm font-poppins
          rounded-lg
          transition-all duration-200
        "
        :class="{
          // Current month, enabled
          'text-[#6E645F] hover:bg-[#FFE5D9] cursor-pointer': day.isCurrentMonth && !day.isDisabled,
          // Disabled
          'text-[#B4AAA6] cursor-not-allowed': day.isDisabled,
          // Not current month
          'text-gray-300': !day.isCurrentMonth,
          // Selected
          'bg-[#F98B54] text-white font-semibold hover:bg-[#F98B54]': day.isSelected,
          // Today (not selected)
          'border-2 border-[#F98B54]': day.isToday && !day.isSelected
        }"
        :disabled="day.isDisabled"
      >
        {{ day.day }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>