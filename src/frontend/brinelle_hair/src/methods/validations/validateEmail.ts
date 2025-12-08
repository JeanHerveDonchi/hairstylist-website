import { VALIDATION_PATTERNS } from "@/constants/business-rules/business-rules"

  /**
   * Validate email
   */
  const validateEmail = (email: string): string | null => {
    if (!email || email.trim() === '') {
      return 'L\'email est requis'
    }
    
    if (!VALIDATION_PATTERNS.email.test(email)) {
      return 'Format d\'email invalide'
    }
    
    return null
  }

  export default validateEmail;