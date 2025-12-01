<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MOCK_HAIRSTYLES } from '@/constants/hairstyles'
import Title from '@/components/ui/reusable/Title.vue'
import HairStyleList from '@/components/ui/reusable/HairStyleList.vue'
const router = useRouter()
const route = useRoute()

// Filter by category if provided in query params
const categoryFilter = computed(() => route.query.category as string | undefined)

const filteredHairstyles = computed(() => {
  if (!categoryFilter.value) {
    return MOCK_HAIRSTYLES
  }
  // Filter by category id
  return MOCK_HAIRSTYLES.filter(h => h.category?.id === categoryFilter.value)
})

// Handle hairstyle click - navigate to detail page
const handleHairstyleClick = (id: string) => {
  router.push(`/hairstyle/${id}`)
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Page Title -->
    <Title text="PRENDRE RENDEZ-VOUS" />
    
    <!-- Hairstyles List -->
    <section class="py-8 px-6 md:px-12">
      <div class="max-w-[1200px] mx-auto">
        <!-- List View Container -->
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
        
        <!-- Empty State -->
        <div 
          v-if="filteredHairstyles.length === 0"
          class="text-center py-16"
        >
          <p class="text-gray-500 text-lg">
            Aucune coiffure disponible pour cette catégorie.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>