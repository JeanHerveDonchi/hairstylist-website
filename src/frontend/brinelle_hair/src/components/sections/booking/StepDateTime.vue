<script setup lang="ts">
import DateTimePicker from '@/components/ui/reusable/DateTimePicker.vue'

/**
 * Step 2: Date & Time Selection
 * 
 * Uses the reusable DateTimePicker component
 */

interface Props {
  initialDate?: string | null
  initialTime?: string | null
  hairstyleDuration: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [date: string, time: string],
  dateChanged: [date: string],
}>()

const handleUpdate = (date: string, time: string) => {
  emit('update', date, time)
};

const handleUpdateDate = (date: string): any => {
  emit('dateChanged', date)
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-8">
    <h2 class="text-2xl md:text-3xl font-poppins font-semibold text-[#6E645F] mb-8 text-center">
      Choisissez votre horaire
    </h2>
    
    <!-- DateTime Picker -->
    <DateTimePicker
      :initialDate="initialDate"
      :initialTime="initialTime"
      :hairstyleDuration="hairstyleDuration"
      @update="handleUpdate"
      @dateChanged="handleUpdateDate"
    />
  </div>
</template>

<style scoped></style>