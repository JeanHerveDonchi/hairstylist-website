<script setup lang="ts">
import { COLORS } from '@/constants/colors'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  isMobileMenuOpen.value = false
}

const navigateToBooking = () => {
  router.push('/prendre-rendez-vous')
  isMobileMenuOpen.value = false
}

const navigateToHome = () => {
  router.push('/')
  isMobileMenuOpen.value = false
}
</script>

<template>
  <nav class="fixed top-0 left-0 w-full h-[116px] z-50 px-6 md:px-12"
  :style="{backgroundColor: COLORS.color_primary}">
    <div class="h-full max-w-[1400px] mx-auto flex items-center justify-between">
      <!-- Left: Services & Contactes (Desktop) -->
      <div class="hidden md:flex items-center gap-8">
        <button
          @click="scrollToSection('services')"
          class="text-[16px] font-poppins uppercase tracking-wide  hover:opacity-80 transition-opacity"
          :style="{color: COLORS.color_text_sub}"
        >
          SERVICES
        </button>
        <button
          @click="scrollToSection('contactes')"
          class="text-[16px] font-poppins uppercase tracking-wide  hover:opacity-80 transition-opacity"
          :style="{color: COLORS.color_text_sub}"
        >
          CONTACTES
        </button>
      </div>

      <!-- Center: Brand Name -->
      <button
        @click="navigateToHome"
        class="text-[30px] font-poppins uppercase  hover:opacity-80 transition-opacity"
        :style="{color: COLORS.color_text_sub}"
      >
        BRINELLE-BRAIDER
      </button>

      <!-- Right: CTA & Language (Desktop) -->
      <div class="hidden md:flex items-center gap-6">
        <button
          @click="navigateToBooking"
          class="px-6 py-3 text-[16px] 
          font-poppins uppercase rounded-full
          hover:bg-opacity-90 transition-all"
          :style="{
            color: COLORS.color_primary,
            backgroundColor: COLORS.color_text_sub
            }"
        >
          PRENDRE RENDEZ-VOUS
        </button>
        <!-- Language Icon Placeholder -->
        <div class="w-10 h-10 rounded-full"></div>
      </div>

      <!-- Mobile Hamburger Menu -->
      <button
        @click="toggleMobileMenu"
        class="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
        aria-label="Toggle menu"
      >
        <span class="w-6 h-0.5 transition-all" 
        :class="{ 'rotate-45 translate-y-2': isMobileMenuOpen }" 
        :style="{ backgroundColor: COLORS.color_text_sub }"></span>
        <span class="w-6 h-0.5 transition-all" 
        :class="{ 'opacity-0': isMobileMenuOpen }"
        :style="{ backgroundColor: COLORS.color_text_sub }"></span>
        <span class="w-6 h-0.5 transition-all" 
        :class="{ '-rotate-45 -translate-y-2': isMobileMenuOpen }"
        :style="{ backgroundColor: COLORS.color_text_sub }"></span>
      </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden absolute top-[116px] left-0 w-full
       border-t border-white/20 py-6 px-6"
       :style="{backgroundColor: COLORS.color_primary}"
    >
      <div class="flex flex-col gap-4">
        <button
          @click="scrollToSection('services')"
          class="text-[14px] font-poppins uppercase  text-left py-2"
          :style="{color: COLORS.color_text_sub}"
        >
          SERVICES
        </button>
        <button
          @click="scrollToSection('contactes')"
          class="text-[14px] font-poppins uppercase  text-left py-2"
          :style="{color: COLORS.color_text_sub}"
        >
          CONTACTES
        </button>
        <button
          @click="navigateToBooking"
          class="px-6 py-3 text-[14px] font-poppins uppercase rounded-full text-center"
          :style="{
            color: COLORS.color_primary,
            backgroundColor: COLORS.color_text_sub
            }"
        >
          PRENDRE RENDEZ-VOUS
        </button>
        <div class="w-10 h-10 rounded-full mx-auto mt-2"
        :style="{ backgroundColor: COLORS.color_text_sub }"></div>
      </div>
    </div>
  </nav>
</template>