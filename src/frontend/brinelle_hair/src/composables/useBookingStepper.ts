/**
 * Booking Stepper Composable
 * 
 * Core state management for the booking flow
 * Handles stepper navigation, validation, and session persistence
 */

import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { 
  BookingStep, 
  BookingData, 
  UserInfo,
  BookingStepConfig 
} from '@/types/booking.types'
import { BookingStep as Step } from '@/types/booking.types'
import { useBookingValidation } from './useBookingValidation'
import type { HairStyle } from '@/types/hairstyle.types'

const SESSION_STORAGE_KEY = 'booking_session'

export function useBookingStepper(hairstyleId: string, hairstyle: HairStyle) {
  
  const router = useRouter()
  const { validateUserInfo, validateDateTime } = useBookingValidation()
  
  // ==========================================================================
  // STATE
  // ==========================================================================
  
  const currentStep = ref<BookingStep>(Step.UserInfo)
  
  const bookingData = ref<BookingData>({
    hairstyleId: hairstyleId,
    hairstyleName: hairstyle.name,
    hairstyleDuration: hairstyle.duration,
    hairstylePrice: hairstyle.price,
    userInfo: null,
    selectedDate: null,
    selectedTime: null
  })
  
  // ==========================================================================
  // STEP CONFIGURATION
  // ==========================================================================
  
  const steps = computed<BookingStepConfig[]>(() => [
    {
      step: Step.UserInfo,
      title: 'Entrer mes informations',
      isComplete: isStepComplete(Step.UserInfo)
    },
    {
      step: Step.DateTime,
      title: 'Choisir mon horaire',
      isComplete: isStepComplete(Step.DateTime)
    },
    {
      step: Step.Confirmation,
      title: 'Confirmer mon rdv',
      isComplete: isStepComplete(Step.Confirmation)
    }
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
        return bookingData.value.userInfo !== null &&
               validateUserInfo(bookingData.value.userInfo).isValid
      
      case Step.DateTime:
        return bookingData.value.selectedDate !== null &&
               bookingData.value.selectedTime !== null
      
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
      bookingData: bookingData.value
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
    
    // TODO: In real app, send to backend API
    // For MVP, just simulate success
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Clear session after successful booking
      clearSession()
      
      // Navigate to success page
      router.push('/rendez-vous/confirmation')
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: 'Une erreur est survenue. Veuillez réessayer.' 
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
  
  // Auto-save on data changes
  watch(bookingData, saveToSession, { deep: true })
  
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
    
    // Submission
    submitBooking,
    
    // Session management
    clearSession
  }
}