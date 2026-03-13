<script setup lang="ts">
import HeroSection from '@/components/sections/HeroSection.vue';
import Title from '@/components/ui/reusable/Title.vue';
import HairCategoryCard from '@/components/ui/reusable/HairCategoryCard.vue';
import MainButton from '@/components/ui/reusable/MainButton.vue';
import { useRouter } from 'vue-router';
import { MOCK_CATEGORIES } from '@/mock-data/categories';

const router = useRouter();

const categoryRoutes = MOCK_CATEGORIES.map(c => ({
  id: c.id,
  imageUrl: c.coverImageUrl,
  title: c.title,
  price: c.startPrice,
  route: `/prendre-rendez-vous?category=${c.id}`
}))

const handleClickToRoute = (route: string) => {
  router.push(route)
}
</script>

<template>
  <div id="app">
    <HeroSection />
    <Title text="tressez vos cheveux avec soins" />
    <section class="py-16 px-6">
      <div class="max-w-[1400px] mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <HairCategoryCard v-for="category in categoryRoutes" :key="category.id" :imageUrl="category.imageUrl"
            :categoryTitle="category.title" :startPrice="category.price" :size="350"
            @click="handleClickToRoute(category.route)" />
        </div>
      </div>
    </section>
    <div class="flex justify-center py-8">
      <MainButton text="prendre rendez-vous" @click="handleClickToRoute('/prendre-rendez-vous')" />
    </div>
  </div>
</template>

<style scoped></style>
