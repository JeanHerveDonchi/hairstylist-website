<script setup lang="ts">
import NavBar from './components/ui/fixed/NavBar.vue';
import Footer from './components/ui/fixed/Footer.vue';
</script>
<template>
  <div id="app">
    <NavBar />
    <main class="pt-[116px]">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>
