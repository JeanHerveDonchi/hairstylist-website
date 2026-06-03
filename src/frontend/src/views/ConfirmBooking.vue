<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { BookingStep } from '@/types/booking.types'
import { fetchHairstyleById } from '@/services/hairstyle.service'
import { useBookingStepper } from '@/composables/useBookingStepper'
import { useAvailability } from '@/composables/useAvailability'
import type { HairStyle } from '@/types/hairstyle.types'
import BookingStepper from '@/components/ui/fixed/BookingStepper.vue'
import StepUserInfo from '@/components/sections/booking/StepUserInfo.vue'
import StepDateTime from '@/components/sections/booking/StepDateTime.vue'
import StepConfirmation from '@/components/sections/booking/StepConfirmation.vue'
import MainButton from '@/components/ui/reusable/MainButton.vue'
import Title from '@/components/ui/reusable/Title.vue'
import Toast from '@/components/ui/reusable/Toast.vue'

/**
 * Main Booking Page
 *
 * Handles the complete booking flow with stepper
 * Route: /confirmer-rendez-vous/:hairstyleId
 */

const route = useRoute()
const hairstyleId = route.params.hairstyleId as string

// Hairstyle state
const hairstyle = ref<HairStyle | null>(null)
const isLoadingHairstyle = ref(true)
const hairstyleError = ref<string | null>(null)

// Fetch hairstyle by ID
onMounted(async () => {
  isLoadingHairstyle.value = true
  try {
    const h = await fetchHairstyleById(hairstyleId)
    if (!h) throw new Error('Hairstyle not found')
    hairstyle.value = h
  } catch (err: unknown) {
    hairstyleError.value = (err as Error).message || 'Failed to load hairstyle'
  } finally {
    isLoadingHairstyle.value = false
  }
})

// Initialize stepper
const {
  currentStep,
  bookingData,
  steps,
  canProceed,
  nextStep,
  previousStep,
  updateUserInfo,
  updateDateTime,
  updateDate,
  updateTime,
  submitBooking,
  toastMessage,
} = useBookingStepper(hairstyleId, hairstyle)

const { revalidateSlots } = useAvailability()

// ==========================================================================
// NAVIGATION HANDLERS
// ==========================================================================

const handleNext = async () => {
  // Special validation for Step 2 (DateTime) - revalidate slots
  if (currentStep.value === BookingStep.DateTime) {
    if (bookingData.value.selectedDate && bookingData.value.selectedTime) {
      const validation = await revalidateSlots(
        bookingData.value.selectedDate,
        bookingData.value.selectedTime,
        bookingData.value.hairstyleDuration
      )

      if (!validation.isValid) {
        alert(validation.message || 'Ce créneau n\'est plus disponible')
        return
      }
    }
  }

  nextStep()
}

const handleBack = () => {
  previousStep()
}

const handleConfirm = async () => {
  await submitBooking()
}
</script>

<template>
  <div class="min-h-screen bg-white pb-16">
    <!-- Page Title -->
    <Title text="CONFIRMER MON RENDEZ-VOUS" />

    <div v-if="isLoadingHairstyle" class="px-6 py-16 text-center">
      <p class="text-[20px] font-poppins text-[#6E645F]">
        Chargement de la coiffure...
      </p>
    </div>

    <div v-else-if="hairstyleError" class="px-6 py-16 text-center">
      <p class="text-[20px] font-poppins text-[#6E645F]">
        {{ hairstyleError }}
      </p>
    </div>

    <template v-else>
      <!-- Subtitle with Hairstyle Name -->
      <div class="text-center mb-8 px-6">
      <p class="text-[24px] font-poppins font-normal text-[#6E645F] capitalize">
        Confirmer mon rendez-vous pour {{ bookingData.hairstyleName }}
      </p>
      </div>

      <!-- Stepper -->
      <BookingStepper
        :steps="steps"
        :currentStep="currentStep"
      />

      <!-- Step Content -->
      <div class="max-w-4xl mx-auto">
        <!-- Step 1: User Info -->
        <StepUserInfo
          v-if="currentStep === BookingStep.UserInfo"
          :initialData="bookingData.userInfo"
          @update="updateUserInfo"
        />

        <!-- Step 2: Date & Time -->
        <StepDateTime
          v-if="currentStep === BookingStep.DateTime"
          :initialDate="bookingData.selectedDate"
          :initialTime="bookingData.selectedTime"
          :hairstyleDuration="bookingData.hairstyleDuration"
          @update="updateDateTime"
          @dateChanged="updateDate"
          @timeChanged="updateTime"
        />

        <!-- Step 3: Confirmation -->
        <StepConfirmation
          v-if="currentStep === BookingStep.Confirmation"
          :bookingData="bookingData"
        />
      </div>

      <!-- Navigation Buttons -->
      <div class="max-w-4xl mx-auto px-6 mt-8">
        <div class="flex justify-between items-center">
          <!-- Back Button -->
          <MainButton
            text="Retour"
            background="#6E645F"
            :borderRadius="15"
            :fontSize="20"
            :capitalized="false"
            :fontBold="false"
            @click="handleBack"
          />

          <!-- Continue / Confirm Button -->
          <MainButton
            v-if="currentStep < BookingStep.Confirmation"
            text="Continuer"
            :borderRadius="15"
            :fontSize="20"
            :capitalized="false"
            :fontBold="false"
            :class="{ 'opacity-50 cursor-not-allowed': !canProceed }"
            @click="handleNext"
          />

          <MainButton
            v-else
            text="Confirmer"
            :borderRadius="15"
            :fontSize="20"
            :capitalized="false"
            :fontBold="false"
            @click="handleConfirm"
          />
        </div>
      </div>
    </template>

    <!-- Toast -->
    <Toast :message="toastMessage" />
  </div>
</template>

<style scoped></style>
