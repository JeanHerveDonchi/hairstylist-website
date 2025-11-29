<script setup lang="ts">
import HeroSection from '@/components/sections/HeroSection.vue';
import Title from '@/components/ui/reusable/Title.vue';
import HairCategoryCard from '@/components/ui/reusable/HairCategoryCard.vue';
import MainButton from '@/components/ui/reusable/MainButton.vue';
import { CATEGORY_IMAGES } from '@/constants/images';
import { useRouter } from 'vue-router';

const router = useRouter();

//routes will not work, still to be decided
const categories = [
  {
    id: 'men',
    imageUrl: CATEGORY_IMAGES.men,
    title: 'Hommes',
    price: 25,
    route: '/prendre-rendez-vous?category=men'
  },
  {
    id: 'women',
    imageUrl: CATEGORY_IMAGES.women,
    title: 'Femmes',
    price: 35,
    route: '/prendre-rendez-vous?category=women'
  },
  {
    id: 'children',
    imageUrl: CATEGORY_IMAGES.children,
    title: 'Enfants',
    price: 20,
    route: '/prendre-rendez-vous?category=children'
  }
]

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
          <HairCategoryCard v-for="category in categories" :key="category.id" :imageUrl="category.imageUrl"
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