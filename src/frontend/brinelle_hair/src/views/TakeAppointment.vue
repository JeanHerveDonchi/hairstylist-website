<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { COLORS } from '@/constants/colors'
import { MOCK_CATEGORIES } from '@/mock-data/categories'
import { MOCK_HAIRSTYLES } from '@/mock-data/hairstyles'
import Title from '@/components/ui/reusable/Title.vue'
import HairStyleList from '@/components/ui/reusable/HairStyleList.vue'

type FilterOption = {
  id: string
  label: string
}

const router = useRouter()
const route = useRoute()

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'Tout' },
  ...MOCK_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.title,
  })),
]

const categoryIds = new Set(MOCK_CATEGORIES.map((category) => category.id))

const selectedCategory = computed(() => {
  const rawCategory = route.query.category
  const category = typeof rawCategory === 'string' ? rawCategory : ''

  if (!category || !categoryIds.has(category)) {
    return 'all'
  }

  return category
})

const filteredHairstyles = computed(() => {
  if (selectedCategory.value === 'all') {
    return MOCK_HAIRSTYLES
  }

  return MOCK_HAIRSTYLES.filter((hairstyle) => hairstyle.category?.id === selectedCategory.value)
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
            v-for="option in FILTER_OPTIONS"
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
        <div class="flex flex-col gap-4">
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

        <div v-if="filteredHairstyles.length === 0" class="py-16 text-center">
          <p class="font-poppins text-lg" :style="{ color: COLORS.color_text_main }">
            Aucune coiffure disponible pour cette catégorie.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
