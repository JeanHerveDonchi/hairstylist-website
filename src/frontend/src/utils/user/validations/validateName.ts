// ==========================================================================
// USER INFO VALIDATION
// ==========================================================================

import { VALIDATION_PATTERNS } from "@/constants/business-rules/business-rules"

/**
   * Validate name
   */
const validateName = (name: string, errorMessageName: string): string | null => {
    if (!name || name.trim() === '') {
        return `Le ${errorMessageName} est requis`
    }

    if (name.length < 2) {
        return `Le ${errorMessageName} doit contenir au moins 2 caractères`
    }

    if (!VALIDATION_PATTERNS.name.test(name)) {
        return `Le ${errorMessageName} contient des caractères invalides`
    }

    return null
}
export default validateName;
