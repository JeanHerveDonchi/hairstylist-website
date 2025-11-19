<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <h1>You did it!</h1>
  <div id="app">
  <button @click="count++">{{ count }}</button>
</div>
</template>

<style scoped></style>
