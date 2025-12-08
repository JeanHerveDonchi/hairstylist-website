import { VALIDATION_PATTERNS } from "@/constants/business-rules/business-rules"

  /**
   * Validate Canadian phone number
   */
  const validatePhone = (phone: string): string | null => {
    if (!phone || phone.trim() === '') {
      return 'Le numéro de téléphone est requis'
    }
    
    if (!VALIDATION_PATTERNS.canadianPhone.test(phone)) {
      return 'Format de numéro canadien invalide (ex: 506-123-4567)'
    }
    
    return null
  }
  export default validatePhone;
  