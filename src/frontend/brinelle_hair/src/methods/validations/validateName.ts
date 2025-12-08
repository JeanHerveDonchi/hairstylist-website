// ==========================================================================
// USER INFO VALIDATION
// ==========================================================================

import { VALIDATION_PATTERNS } from "@/constants/business-rules/business-rules"

/**
   * Validate name
   */
const validateName = (name: string, errorMessageName: string): string | null => {
    if (!name || name.trim() === '') {
        return `Le ${name} est requis`
    }

    if (name.length < 2) {
        return `Le ${name} doit contenir au moins 2 caractères`
    }

    if (!VALIDATION_PATTERNS.name.test(name)) {
        return `Le ${name} contient des caractères invalides`
    }

    return null
}
export default validateName;
