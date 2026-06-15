<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { COLORS } from '@/constants/colors'
import { useRoute, useRouter } from 'vue-router'
import { useLocale } from '@/composables/useLocale'
import { cms } from '@/data/cms0'
import type { RootSchema } from '@/data/cms0'
import { watch } from 'vue'
import { getLocalizedString } from '@/utils/locales/localized'

const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)

const { locale, toggleLocale } = useLocale()

const siteSettings = ref<RootSchema['SiteSettings'] | null>(null)

async function loadSiteSettings(){
  try {
    const settings = await cms.SiteSettings({ locale: locale.value })
    siteSettings.value = settings
  } catch (error) {
    console.error('Failed to load site settings:', error)
  }
}

onMounted(() => {
  console.log(siteSettings.value);
  loadSiteSettings();
});

watch(locale, loadSiteSettings)


// computed localized labels (reactive to locale changes)
const servicesLabel = computed(() =>
  siteSettings.value ? getLocalizedString(siteSettings.value.navbar.servicesLabel, locale.value) : undefined
)

const contactsLabel = computed(() =>
  siteSettings.value ? getLocalizedString(siteSettings.value.navbar.contactsLabel, locale.value) : undefined
)

const bookingLabel = computed(() =>
  siteSettings.value ? getLocalizedString(siteSettings.value.navbar.bookingCta, locale.value) : undefined
)

const brandName = computed(() =>
  siteSettings.value ? getLocalizedString(siteSettings.value.brandName, locale.value) : undefined
)


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

const navigateToServices = async () => {
  if (route.path === '/') {
    scrollToSection('services')
    return
  }

  isMobileMenuOpen.value = false
  await router.push({ path: '/', hash: '#services' })
}

const navigateToContacts = () => {
  scrollToSection('contactes')
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
  <nav class="fixed top-0 left-0 w-full h-[116px] z-50 px-6 md:px-12" :style="{ backgroundColor: COLORS.color_primary }">
    <div class="h-full max-w-[1400px] mx-auto flex items-center justify-between">
      <!-- Left: Services & Contactes (Desktop) -->
      <div class="hidden md:flex items-center gap-8">
        <button @click="navigateToServices"
          class="text-[16px] font-poppins uppercase tracking-wide  hover:opacity-80 transition-opacity"
          :style="{ color: COLORS.color_text_sub }">
          {{ servicesLabel }}
        </button>
        <button @click="navigateToContacts"
          class="text-[16px] font-poppins uppercase tracking-wide  hover:opacity-80 transition-opacity"
          :style="{ color: COLORS.color_text_sub }">
          {{ contactsLabel }}
        </button>
      </div>

      <!-- Center: Brand Name -->
      <button @click="navigateToHome" class="text-[30px] font-poppins uppercase  hover:opacity-80 transition-opacity"
        :style="{ color: COLORS.color_text_sub }">
        {{ brandName }}
      </button>

      <!-- Right: CTA & Language (Desktop) -->
      <div class="hidden md:flex items-center gap-6">
        <button @click="navigateToBooking" class="px-6 py-3 text-[16px]
          font-poppins uppercase rounded-full
          hover:bg-opacity-90 transition-all" :style="{
            color: COLORS.color_primary,
            backgroundColor: COLORS.color_text_sub
          }">
          {{ bookingLabel }}
        </button>
        <!-- Language Icon Placeholder -->
        <div class="w-10 h-10 rounded-full"></div>
      </div>

      <!-- Localization button -->
      <button @click="toggleLocale">
        {{ locale === 'fr' ? 'EN' : 'FR' }}
      </button>

      <!-- Mobile Hamburger Menu -->
      <button @click="toggleMobileMenu" class="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
        aria-label="Toggle menu">
        <span class="w-6 h-0.5 transition-all" :class="{ 'rotate-45 translate-y-2': isMobileMenuOpen }"
          :style="{ backgroundColor: COLORS.color_text_sub }"></span>
        <span class="w-6 h-0.5 transition-all" :class="{ 'opacity-0': isMobileMenuOpen }"
          :style="{ backgroundColor: COLORS.color_text_sub }"></span>
        <span class="w-6 h-0.5 transition-all" :class="{ '-rotate-45 -translate-y-2': isMobileMenuOpen }"
          :style="{ backgroundColor: COLORS.color_text_sub }"></span>
      </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div v-if="isMobileMenuOpen" class="md:hidden absolute top-[116px] left-0 w-full
       border-t border-white/20 py-6 px-6" :style="{ backgroundColor: COLORS.color_primary }">
      <div class="flex flex-col gap-4">
        <button @click="navigateToServices" class="text-[14px] font-poppins uppercase  text-left py-2"
          :style="{ color: COLORS.color_text_sub }">
          {{ servicesLabel }}
        </button>
        <button @click="navigateToContacts" class="text-[14px] font-poppins uppercase  text-left py-2"
          :style="{ color: COLORS.color_text_sub }">
          {{ contactsLabel }}
        </button>
        <button @click="navigateToBooking" class="px-6 py-3 text-[14px] font-poppins uppercase rounded-full text-center"
          :style="{
            color: COLORS.color_primary,
            backgroundColor: COLORS.color_text_sub
          }">
          {{ bookingLabel }}
        </button>
        <!-- Localization button -->
        <button @click="toggleLocale">
          {{ locale === 'fr' ? 'EN' : 'FR' }}
        </button>
      </div>
    </div>
  </nav>
</template>
