import { BUSINESS_HOURS } from "@/constants/business-rules/business-rules";

// ============================================================================
// SLOT GENERATION
// ============================================================================
/**
 * Generate all time slots within business hours
 * Returns array like ['08:00', '09:00', ..., '19:00']
 */

export function generateBusinessHourSlots(): string[] {
    const slots: string[] = [];

    for (let hour = BUSINESS_HOURS.startHour; hour < BUSINESS_HOURS.endHour; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    return slots;
}
