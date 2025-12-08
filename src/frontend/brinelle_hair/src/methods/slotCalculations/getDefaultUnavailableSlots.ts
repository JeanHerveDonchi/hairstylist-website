import { BUSINESS_HOURS } from "@/constants/business-rules/business-rules";

/**
 * Generate default unavailable slots (outside business hours)
 * Returns slots for 00:00-07:00 and 20:00-23:00
 */

export function getDefaultUnavailableSlots(): string[] {
    const slots: string[] = [];

    // Midnight to before business start (0am-7am)
    for (let hour = 0; hour < BUSINESS_HOURS.startHour; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    // After business end to midnight (8pm-11pm)
    for (let hour = BUSINESS_HOURS.endHour; hour < 24; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    return slots;
}
