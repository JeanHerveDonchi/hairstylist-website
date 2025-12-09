<script setup lang="ts">
import { useRouter } from 'vue-router'
import MainButton from '@/components/ui/reusable/MainButton.vue'

/**
 * Booking Success Page
 * 
 * Shown after successful booking confirmation
 * Route: /rendez-vous/confirmation
 */

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-6">
    <div class="max-w-2xl w-full text-center">
      <!-- Success Icon -->
      <div class="mb-8">
        <div class="
          w-24 h-24 
          mx-auto 
          bg-green-100 
          rounded-full 
          flex items-center justify-center
        ">
          <svg 
            class="w-12 h-12 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      
      <!-- Success Message -->
      <h1 class="text-3xl md:text-4xl font-poppins font-bold text-[#6E645F] mb-4">
        Rendez-vous confirmé ! 🎉
      </h1>
      
      <p class="text-lg font-poppins text-gray-700 mb-8">
        Votre rendez-vous a été enregistré avec succès. 
        Un email de confirmation vous a été envoyé.
      </p>
      
      <!-- Info Box -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
        <h2 class="font-poppins font-semibold text-blue-900 mb-3">
          Prochaines étapes:
        </h2>
        <ul class="space-y-2 text-sm font-poppins text-blue-800">
          <li>✅ Vérifiez votre email pour les détails du rendez-vous</li>
          <li>✅ Ajoutez la date à votre calendrier</li>
          <li>✅ En cas de questions, contactez-nous directement</li>
        </ul>
      </div>
      
      <!-- Back to Home Button -->
      <MainButton
        text="Retour à l'accueil"
        @click="goHome"
      />
      
      <!-- Additional Info -->
      <p class="mt-8 text-sm text-gray-500 font-poppins">
        Besoin d'aide? Contactez-nous par email ou téléphone.
      </p>
    </div>
  </div>
</template>

<style scoped></style>