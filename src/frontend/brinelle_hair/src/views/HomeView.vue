<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import HeroSection from '@/components/sections/HeroSection.vue'
import Title from '@/components/ui/reusable/Title.vue'
import HairCategoryCard from '@/components/ui/reusable/HairCategoryCard.vue'
import MainButton from '@/components/ui/reusable/MainButton.vue'
import { COLORS } from '@/constants/colors'
import type { Category } from '@/types/category.types'
import { fetchCategories } from '@/services/category.service'
import { data } from '@/data/cms0'

const router = useRouter()
const categories = ref<Category[]>([])
const isLoadingCategories = ref(true)
const categoriesError = ref<string | null>(null)
const heroTitle = ref<string>("")

const categoryRoutes = computed(() =>
  categories.value.map((category) => ({
    id: category.id,
    imageUrl: category.coverImageUrl,
    title: category.title,
    price: category.startPrice,
    route: `/prendre-rendez-vous?category=${category.id}`,
  })),
)

const handleClickToRoute = (route: string) => {
  router.push(route)
}

onMounted(async () => {
  isLoadingCategories.value = true
  categoriesError.value = null

  const [homeResult, categoriesResult] = await Promise.allSettled([
    data.HomePage(),
    fetchCategories(),
  ])

  if (homeResult.status === 'fulfilled') {
    heroTitle.value = homeResult.value.heroTitle
  } else {
    console.error('HomeView CMS load failed', homeResult.reason)
  }

  if (categoriesResult.status === 'fulfilled') {
    categories.value = categoriesResult.value
  } else {
    console.error('HomeView categories load failed', categoriesResult.reason)
    categoriesError.value = 'Impossible de charger les categories pour le moment.'
  }

  isLoadingCategories.value = false
})
</script>

<template>
  <div id="app">
    <HeroSection />
    <Title :text="heroTitle" />
    <section id="services" class="scroll-mt-[140px] py-16 px-6">
      <div class="max-w-[1400px] mx-auto">
        <div v-if="isLoadingCategories" class="py-16 text-center">
          <p class="font-poppins text-lg" :style="{ color: COLORS.color_text_main }">
            Chargement des categories...
          </p>
        </div>

        <div
          v-else-if="categoryRoutes.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
        >
          <HairCategoryCard v-for="category in categoryRoutes" :key="category.id" :imageUrl="category.imageUrl"
            :categoryTitle="category.title" :startPrice="category.price" :size="350"
            @click="handleClickToRoute(category.route)" />
        </div>

        <div v-else class="py-16 text-center">
          <p class="font-poppins text-lg" :style="{ color: COLORS.color_text_main }">
            {{ categoriesError || 'Aucune categorie disponible pour le moment.' }}
          </p>
        </div>
      </div>
    </section>
    <div class="flex justify-center py-8">
      <MainButton text="prendre rendez-vous" @click="handleClickToRoute('/prendre-rendez-vous')" />
    </div>
  </div>
</template>

<style scoped></style>
