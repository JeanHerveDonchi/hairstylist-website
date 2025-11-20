<script setup lang="ts">
import NavBar from './components/ui/NavBar.vue';
</script>
<template>
  <div id="app">
    <NavBar />
    <main class="pt-[116px]">
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
