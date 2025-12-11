import BookingSuccess from '@/views/BookingSuccess.vue'
import ConfirmBooking from '@/views/ConfirmBooking.vue'
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
    },
    {
      path: '/confirmer-rendez-vous/:hairstyleId',
      name: 'confirm-booking',
      component: ConfirmBooking
    },
    {
      path: '/rendez-vous/confirmation',
      name: 'booking-success',
      component: BookingSuccess
    }
  ],
})

export default router
