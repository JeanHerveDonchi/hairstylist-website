import HomeView from '@/views/HomeView.vue'
import TakeAppointment from '@/views/TakeAppointment.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: 'home',
      component: HomeView
    },
    {
      path: '/prendre-rendez-vous',
      name: 'booking',
      component: TakeAppointment
    }
  ],
})

export default router
