/**
 * Booking Validation Composable
 * 
 * Handles all form validation logic for booking steps
 */

import { VALIDATION_PATTERNS } from '@/constants/business-rules/business-rules'
import validateEmail from '@/utils/user/validations/validateEmail'
import validateName from '@/utils/user/validations/validateName'
import validatePhone from '@/utils/user/validations/validatePhone'
import type { UserInfo, ValidationResult } from '@/types/booking.types'

export function useBookingValidation() {
  /**
   * Validate entire user info object
   */
  const validateUserInfo = (userInfo: Partial<UserInfo>): ValidationResult => {
    const errors: Record<string, string> = {}
    
    const firstNameError = validateName(userInfo.firstName || '', 'prénom')
    if (firstNameError) errors.firstName = firstNameError
    
    const lastNameError = validateName(userInfo.lastName || '', 'nom de famille')
    if (lastNameError) errors.lastName = lastNameError
    
    const emailError = validateEmail(userInfo.email || '')
    if (emailError) errors.email = emailError
    
    const phoneError = validatePhone(userInfo.phone || '')
    if (phoneError) errors.phone = phoneError
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
  
  // ==========================================================================
  // DATE/TIME VALIDATION
  // ==========================================================================
  
  /**
   * Validate date and time selection
   */
  const validateDateTime = (date: string | null, time: string | null): ValidationResult => {
    const errors: Record<string, string> = {}
    
    if (!date) {
      errors.date = 'Veuillez sélectionner une date'
    }
    
    if (!time) {
      errors.time = 'Veuillez sélectionner une heure'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
  
  // ==========================================================================
  // REAL-TIME FIELD VALIDATION
  // ==========================================================================
  
  /**
   * Get validation error for a single field (for real-time feedback)
   */
  const getFieldError = (field: string, value: string): string | null => {
    switch (field) {
      case 'firstName':
        return validateName(value, "prénom")
      case 'lastName':
        return validateName(value, "nom de famille")
      case 'email':
        return validateEmail(value)
      case 'phone':
        return validatePhone(value)
      default:
        return null
    }
  }
  
  return {
    validateUserInfo,
    validateDateTime,
    getFieldError
  }
}