<template>
  <transition name="toast-fade">
    <div v-if="message" class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps<{ message: string | null }>()
const message = props.message
</script>

<style scoped>
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity .2s ease;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
}
</style>
