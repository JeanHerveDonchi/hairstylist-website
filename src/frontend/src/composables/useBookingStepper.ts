/**
 * Booking Stepper Composable
 *
 * Core state management for the booking flow
 * Handles stepper navigation, validation, and session persistence
 */

import { ref, computed, watch, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { BookingStep, BookingData, UserInfo, BookingStepConfig } from '@/types/booking.types'
import { BookingStep as Step } from '@/types/booking.types'
import { useBookingValidation } from './useBookingValidation'
import type { HairStyle } from '@/types/hairstyle.types'
import { api } from '@/lib/api'

const SESSION_STORAGE_KEY = 'booking_session'
const SLOT_CONFLICT_MESSAGE = "Ce créneau n'est plus disponible. Veuillez en choisir un autre."

export function useBookingStepper(hairstyleId: string, hairstyle: Ref<HairStyle | null>) {
  const router = useRouter()
  const { validateUserInfo } = useBookingValidation()

  const initialHairstyle = hairstyle.value

  // ==========================================================================
  // STATE
  // ==========================================================================

  const currentStep = ref<BookingStep>(Step.UserInfo)

  const bookingData = ref<BookingData>({
    hairstyleId: hairstyleId,
    hairstyleName: initialHairstyle?.name ?? '',
    hairstyleDuration: initialHairstyle?.duration ?? 0,
    hairstylePrice: initialHairstyle?.price ?? 0,
    userInfo: null,
    selectedDate: null,
    selectedTime: null,
  })

  // ==========================================================================
  // STEP CONFIGURATION
  // ==========================================================================

  const steps = computed<BookingStepConfig[]>(() => [
    {
      step: Step.UserInfo,
      title: 'Entrer mes informations',
      isComplete: isStepComplete(Step.UserInfo),
    },
    {
      step: Step.DateTime,
      title: 'Choisir mon horaire',
      isComplete: isStepComplete(Step.DateTime),
    },
    {
      step: Step.Confirmation,
      title: 'Confirmer mon rdv',
      isComplete: isStepComplete(Step.Confirmation),
    },
  ])

  // ==========================================================================
  // STEP VALIDATION
  // ==========================================================================

  /**
   * Check if a specific step is complete
   */
  function isStepComplete(step: BookingStep): boolean {
    switch (step) {
      case Step.UserInfo:
        return (
          bookingData.value.userInfo !== null &&
          validateUserInfo(bookingData.value.userInfo).isValid
        )

      case Step.DateTime:
        return bookingData.value.selectedDate !== null && bookingData.value.selectedTime !== null

      case Step.Confirmation:
        // Confirmation step is always complete if reached
        return currentStep.value === Step.Confirmation

      default:
        return false
    }
  }

  /**
   * Check if current step is complete (for "Continuer" button)
   */
  const canProceed = computed(() => {
    return isStepComplete(currentStep.value)
  })

  // ==========================================================================
  // NAVIGATION
  // ==========================================================================

  /**
   * Go to next step
   */
  const nextStep = () => {
    if (!canProceed.value) {
      return // Cannot proceed if current step not complete
    }

    if (currentStep.value < Step.Confirmation) {
      currentStep.value++
      saveToSession()
    }
  }

  /**
   * Go to previous step
   */
  const previousStep = () => {
    if (currentStep.value > Step.UserInfo) {
      currentStep.value--
      saveToSession()
    } else {
      // On first step, go back to previous page
      router.back()
    }
  }

  /**
   * Go to specific step (only if allowed)
   */
  const goToStep = (step: BookingStep) => {
    // Can only go to completed steps or next uncompleted step
    if (step < currentStep.value || isStepComplete(step - 1)) {
      currentStep.value = step
      saveToSession()
    }
  }

  // ==========================================================================
  // DATA UPDATES
  // ==========================================================================

  /**
   * Update user information
   */
  const updateUserInfo = (userInfo: UserInfo) => {
    bookingData.value.userInfo = userInfo
    saveToSession()
  }

  /**
   * Update date and time selection
   */
  const updateDateTime = (date: string, time: string) => {
    bookingData.value.selectedDate = date
    bookingData.value.selectedTime = time
    saveToSession()
  }

  /**
   * Update only date (resets time)
   */
  const updateDate = (date: string) => {
    bookingData.value.selectedDate = date
    bookingData.value.selectedTime = null // Reset time when date changes
    saveToSession()
  }

  /**
   * Update only time
   */
  const updateTime = (time: string) => {
    bookingData.value.selectedTime = time
    saveToSession()
  }

  const handleSlotConflict = () => {
    bookingData.value.selectedTime = null
    currentStep.value = Step.DateTime
    saveToSession()
    showToast(SLOT_CONFLICT_MESSAGE, 4000)
  }

  // ==========================================================================
  // SESSION PERSISTENCE
  // ==========================================================================

  /**
   * Save booking state to sessionStorage
   */
  const saveToSession = () => {
    const state = {
      hairstyleId: bookingData.value.hairstyleId,
      currentStep: currentStep.value,
      bookingData: bookingData.value,
    }

    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state))
  }

  /**
   * Restore booking state from sessionStorage
   * Only restores if hairstyleId matches (otherwise start fresh)
   */
  const restoreFromSession = () => {
    const saved = sessionStorage.getItem(SESSION_STORAGE_KEY)

    if (!saved) {
      return false
    }

    try {
      const state = JSON.parse(saved)

      // Only restore if same hairstyle
      if (state.hairstyleId === hairstyleId) {
        currentStep.value = state.currentStep
        bookingData.value = state.bookingData
        return true
      }
    } catch (error) {
      console.error('Failed to restore session:', error)
    }

    return false
  }

  /**
   * Clear session storage
   */
  const clearSession = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
  }

  // ==========================================================================
  // FINAL SUBMISSION
  // ==========================================================================

  /**
   * Submit booking (final step)
   */
  const submitBooking = async () => {
    if (!canProceed.value) {
      return { success: false, message: 'Informations incomplètes' }
    }

    if (
      !bookingData.value.userInfo ||
      !bookingData.value.selectedDate ||
      !bookingData.value.selectedTime
    ) {
      return { success: false, message: 'Informations incomplètes pour confirmer le rendez-vous.' }
    }

    // Build booking input for service
    const bookingInput = {
      hairstyleId: bookingData.value.hairstyleId,
      customer: {
        firstName: bookingData.value.userInfo.firstName,
        lastName: bookingData.value.userInfo.lastName,
        email: bookingData.value.userInfo.email,
        phone: bookingData.value.userInfo.phone,
      },
      startDatetime: `${bookingData.value.selectedDate}T${bookingData.value.selectedTime}:00.000Z`,
      durationHours: bookingData.value.hairstyleDuration / 60, // convert minutes to hours
    }

    try {
      await createBooking(bookingInput as any)

      // Clear session after successful booking
      clearSession()

      // Navigate to success page
      await router.push('/rendez-vous/confirmation')

      return { success: true }
    } catch (error: unknown) {
      const isConflict =
        typeof error === 'object' &&
        error !== null &&
        'conflict' in error &&
        error.conflict === true

      if (isConflict) {
        handleSlotConflict()

        return {
          success: false,
          message: SLOT_CONFLICT_MESSAGE,
          reason: 'conflict' as const,
        }
      }

      console.error('Booking submission failed:', error)
      showToast('Please try again')

      return {
        success: false,
        message: 'Please try again',
      }
    }
  }

  // ==========================================================================
  // LIFECYCLE
  // ==========================================================================

  onMounted(() => {
    // Try to restore session on mount
    restoreFromSession()
  })

  watch(
    hairstyle,
    (nextHairstyle) => {
      if (!nextHairstyle) {
        return
      }

      bookingData.value.hairstyleName = nextHairstyle.name
      bookingData.value.hairstyleDuration = nextHairstyle.duration
      bookingData.value.hairstylePrice = nextHairstyle.price
    },
    { immediate: true },
  )

  // Auto-save on data changes
  watch(bookingData, saveToSession, { deep: true })

  // Toast for temporary UI notifications
  const toastMessage = ref<string | null>(null)
  function showToast(message: string, duration = 2000) {
    toastMessage.value = message
    setTimeout(() => {
      toastMessage.value = null
    }, duration)
  }

  return {
    // State
    currentStep,
    bookingData,
    steps,
    canProceed,

    // Validation
    isStepComplete,

    // Navigation
    nextStep,
    previousStep,
    goToStep,

    // Data updates
    updateUserInfo,
    updateDateTime,
    updateDate,
    updateTime,

    // Submission
    submitBooking,

    // Session management
    clearSession,

    // UI helpers
    toastMessage,
  }
}
