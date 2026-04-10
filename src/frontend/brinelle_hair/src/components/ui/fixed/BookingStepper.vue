<script setup lang="ts">
import type { BookingStepConfig } from '@/types/booking.types'

/**
 * Visual Stepper Component
 *
 * Displays progress through booking steps
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
  <div class="w-full max-w-4xl mx-auto px-6 py-12">
    <!-- Stepper Container -->
    <div class="flex items-center justify-between relative">
      <template v-for="(step, index) in steps" :key="step.step">
        <!-- Step Item -->
        <div class="flex flex-col items-center flex-1 relative z-10">
          <!-- Step Label (Above Circle) -->
          <p
            class="
              text-center
              text-[14px]
              font-poppins
              font-normal
              max-w-[140px]
              mb-3
              transition-colors duration-300
            "
            :class="{
              'text-[#F98B54]': getStepStatus(step.step) === 'current' || getStepStatus(step.step) === 'completed',
              'text-[#B4AAA6]': getStepStatus(step.step) === 'upcoming'
            }"
          >
            {{ step.title }}
          </p>

          <!-- Step Circle -->
          <div
            class="
              w-10 h-10
              rounded-full
              flex items-center justify-center
              font-poppins font-normal text-base
              transition-all duration-300
            "
            :class="{
              // Completed step
              'bg-[#F98B54] text-white': getStepStatus(step.step) === 'completed',
              // Current step
              'bg-[#F98B54] text-white ring-4 ring-[#F98B54] ring-opacity-20': getStepStatus(step.step) === 'current',
              // Upcoming step
              'bg-[#B4AAA6] text-white': getStepStatus(step.step) === 'upcoming'
            }"
          >
            <!-- Show checkmark for completed, number otherwise -->
            <span v-if="getStepStatus(step.step) === 'completed'">✓</span>
            <span v-else>{{ step.step }}</span>
          </div>
        </div>

        <!-- Connector Line (not after last step) -->
        <div
          v-if="index < steps.length - 1"
          class="
            flex-1
            h-[2px]
            mx-1
            transition-colors duration-300
            -mb-10
            relative
            z-0
          "
          :class="{
            'bg-[#F98B54]': step.step < currentStep,
            'bg-[#B4AAA6]': step.step >= currentStep
          }"
        ></div>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
