<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { COLORS } from '@/constants/colors'
import Title from '@/components/ui/reusable/Title.vue'
import HairStyleList from '@/components/ui/reusable/HairStyleList.vue'
import type { Category } from '@/types/category.types'
import type { HairStyle } from '@/types/hairstyle.types'
import { fetchCategories } from '@/services/category.service'
import { fetchHairstyles } from '@/services/hairstyle.service'

type FilterOption = {
  id: string
  label: string
}

const router = useRouter()
const route = useRoute()
const categories = ref<Category[]>([])
const hairstyles = ref<HairStyle[]>([])
const isLoading = ref(true)
const loadError = ref<string | null>(null)

const filterOptions = computed<FilterOption[]>(() => [
  { id: 'all', label: 'Tout' },
  ...categories.value.map((category) => ({
    id: category.id,
    label: category.title,
  })),
])

const categoryIds = computed(() => new Set(categories.value.map((category) => category.id)))

const selectedCategory = computed(() => {
  const rawCategory = route.query.category
  const category = typeof rawCategory === 'string' ? rawCategory : ''

  if (!category || !categoryIds.value.has(category)) {
    return 'all'
  }

  return category
})

const filteredHairstyles = computed(() => {
  if (selectedCategory.value === 'all') {
    return hairstyles.value
  }

  return hairstyles.value.filter((hairstyle) => hairstyle.category?.id === selectedCategory.value)
})

const handleCategoryFilter = (categoryId: string) => {
  const query = { ...route.query }

  if (categoryId === 'all') {
    delete query.category
  } else {
    query.category = categoryId
  }

  router.replace({
    path: route.path,
    query,
  })
}

const handleHairstyleClick = (id: string) => {
  router.push(`/confirmer-rendez-vous/${id}`)
}

onMounted(async () => {
  isLoading.value = true
  loadError.value = null

  try {
    const [loadedCategories, loadedHairstyles] = await Promise.all([
      fetchCategories(),
      fetchHairstyles(),
    ])

    categories.value = loadedCategories
    hairstyles.value = loadedHairstyles
  } catch (error) {
    console.error('TakeAppointment load failed', error)
    loadError.value = 'Impossible de charger les coiffures pour le moment.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen">
    <Title text="PRENDRE RENDEZ-VOUS" />

    <section class="px-6 pt-2 pb-4 md:px-12">
      <div class="mx-auto flex max-w-[1200px] flex-col gap-4">
        <p
          class="font-poppins text-[13px] uppercase tracking-[0.22em]"
          :style="{ color: COLORS.color_title }"
        >
          Filtrer par categorie
        </p>

        <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            v-for="option in filterOptions"
            :key="option.id"
            @click="handleCategoryFilter(option.id)"
            class="
              min-w-[140px]
              rounded-full
              border
              px-5
              py-3
              text-left
              font-poppins
              text-[15px]
              uppercase
              tracking-[0.08em]
              transition-all
              duration-200
              sm:min-w-0
              sm:text-center
            "
            :style="selectedCategory === option.id
              ? {
                  backgroundColor: COLORS.color_primary,
                  borderColor: COLORS.color_primary,
                  color: COLORS.color_text_sub,
                }
              : {
                  backgroundColor: COLORS.color_secondary,
                  borderColor: COLORS.color_tertiary,
                  color: COLORS.color_text_main,
                }"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </section>

    <section class="px-6 py-8 md:px-12">
      <div class="mx-auto max-w-[1200px]">
        <div v-if="isLoading" class="py-16 text-center">
          <p class="font-poppins text-lg" :style="{ color: COLORS.color_text_main }">
            Chargement des coiffures...
          </p>
        </div>

        <div v-else class="flex flex-col gap-4">
          <HairStyleList
            v-for="hairstyle in filteredHairstyles"
            :key="hairstyle.id"
            :id="hairstyle.id"
            :imageUrl="hairstyle.image"
            :name="hairstyle.name"
            :description="hairstyle.description"
            :price="hairstyle.price"
            @click="handleHairstyleClick"
          />
        </div>

        <div v-if="!isLoading && filteredHairstyles.length === 0" class="py-16 text-center">
          <p class="font-poppins text-lg" :style="{ color: COLORS.color_text_main }">
            {{ loadError || 'Aucune coiffure disponible pour cette catégorie.' }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
