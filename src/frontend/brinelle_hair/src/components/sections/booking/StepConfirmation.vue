<script setup lang="ts">
import type { BookingData } from '@/types/booking.types'

/**
 * Step 3: Confirmation
 *
 * Review all booking details before final submission
 */

interface Props {
  bookingData: BookingData
}

const { bookingData } = defineProps<Props>()

// Format date for display
const formatDateDisplay = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number)
  if (year === undefined || month === undefined) {
    throw new Error("undefined date error");
  }
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('fr-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-6 py-8">
    <h2 class="text-2xl md:text-3xl font-poppins font-semibold text-[#6E645F] mb-8 text-center">
      Confirmez votre rendez-vous
    </h2>

    <div class="bg-gray-50 rounded-lg p-6 space-y-6">
      <!-- Hairstyle Info -->
      <div class="border-b border-gray-200 pb-6">
        <h3 class="text-lg font-poppins font-semibold text-[#6E645F] mb-4">
          Service
        </h3>
        <div class="space-y-2">
          <p class="font-poppins text-gray-800">
            <span class="font-semibold">Coiffure:</span> {{ bookingData.hairstyleName }}
          </p>
          <p class="font-poppins text-gray-800">
            <span class="font-semibold">Durée estimée:</span> {{ bookingData.hairstyleDuration }} minutes
          </p>
          <p class="font-poppins text-gray-800">
            <span class="font-semibold">Prix:</span> ${{ bookingData.hairstylePrice }}
          </p>
        </div>
      </div>

      <!-- Date & Time -->
      <div class="border-b border-gray-200 pb-6">
        <h3 class="text-lg font-poppins font-semibold text-[#6E645F] mb-4">
          Date et heure
        </h3>
        <div class="space-y-2">
          <p class="font-poppins text-gray-800">
            <span class="font-semibold">Date:</span>
            {{ bookingData.selectedDate ? formatDateDisplay(bookingData.selectedDate) : 'Non sélectionnée' }}
          </p>
          <p class="font-poppins text-gray-800">
            <span class="font-semibold">Heure:</span> {{ bookingData.selectedTime || 'Non sélectionnée' }}
          </p>
        </div>
      </div>

      <!-- Customer Info -->
      <div>
        <h3 class="text-lg font-poppins font-semibold text-[#6E645F] mb-4">
          Vos informations
        </h3>
        <div v-if="bookingData.userInfo" class="space-y-2">
          <p class="font-poppins text-gray-800">
            <span class="font-semibold">Nom:</span>
            {{ bookingData.userInfo.firstName }} {{ bookingData.userInfo.lastName }}
          </p>
          <p class="font-poppins text-gray-800">
            <span class="font-semibold">Email:</span> {{ bookingData.userInfo.email }}
          </p>
          <p class="font-poppins text-gray-800">
            <span class="font-semibold">Téléphone:</span> {{ bookingData.userInfo.phone }}
          </p>
        </div>
      </div>
    </div>

    <!-- Important Notice -->
    <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p class="text-sm text-yellow-800 font-poppins">
        ⚠️ En confirmant, vous acceptez que ces informations soient envoyées à la coiffeuse.
        Un email de confirmation vous sera envoyé.
      </p>
    </div>
  </div>
</template>

<style scoped></style>
