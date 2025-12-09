<script setup lang="ts">
import { computed } from 'vue'
import type { BookingStepConfig } from '@/types/booking.types'

/**
 * Visual Stepper Component
 * 
 * Displays progress through booking steps
 * Shows which steps are complete, current, and upcoming
 */

interface Props {
  steps: BookingStepConfig[]
  currentStep: number
}

const props = defineProps<Props>()

// Determine step status for styling
const getStepStatus = (stepNumber: number) => {
  if (stepNumber < props.currentStep) {
    return 'completed'
  } else if (stepNumber === props.currentStep) {
    return 'current'
  } else {
    return 'upcoming'
  }
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto px-6 py-8">
    <!-- Stepper Container -->
    <div class="flex items-center justify-between">
      <template v-for="(step, index) in steps" :key="step.step">
        <!-- Step Circle and Label -->
        <div class="flex flex-col items-center flex-1">
          <!-- Step Circle -->
          <div 
            class="
              w-12 h-12 
              rounded-full 
              flex items-center justify-center 
              font-poppins font-semibold text-lg
              transition-all duration-300
              mb-3
            "
            :class="{
              // Completed step
              'bg-[#F98B54] text-white': getStepStatus(step.step) === 'completed',
              // Current step
              'bg-[#F98B54] text-white ring-4 ring-[#F98B54] ring-opacity-30': getStepStatus(step.step) === 'current',
              // Upcoming step
              'bg-gray-200 text-gray-500': getStepStatus(step.step) === 'upcoming'
            }"
          >
            <!-- Show checkmark for completed, number otherwise -->
            <span v-if="getStepStatus(step.step) === 'completed'">✓</span>
            <span v-else>{{ step.step }}</span>
          </div>
          
          <!-- Step Label -->
          <p 
            class="
              text-center 
              text-sm md:text-base 
              font-poppins 
              uppercase
              max-w-[120px]
              transition-colors duration-300
            "
            :class="{
              'text-[#F98B54] font-semibold': getStepStatus(step.step) === 'current',
              'text-gray-700': getStepStatus(step.step) === 'completed',
              'text-gray-400': getStepStatus(step.step) === 'upcoming'
            }"
          >
            {{ step.title }}
          </p>
        </div>
        
        <!-- Connector Line (not after last step) -->
        <div 
          v-if="index < steps.length - 1"
          class="
            flex-1 
            h-1 
            mx-4
            transition-colors duration-300
            -mt-12
          "
          :class="{
            'bg-[#F98B54]': step.step < currentStep,
            'bg-gray-200': step.step >= currentStep
          }"
        ></div>
      </template>
    </div>
  </div>
</template>

<style scoped></style>