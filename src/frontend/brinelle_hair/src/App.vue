<script setup lang="ts">
import NavBar from './components/ui/fixed/NavBar.vue';
import Footer from './components/ui/fixed/Footer.vue';
import { COLORS } from './constants/colors';
</script>
<template>
  <div id="app" :style="{backgroundColor: COLORS.color_secondary}">
    <NavBar />
    <main class="pt-[116px]">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
