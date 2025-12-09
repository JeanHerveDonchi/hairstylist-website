import { calculateRequiredSlots } from "./calculateRequiredSlots";

/**
 * Get all time slots that will be blocked by a booking
 * Example: startTime='10:00', duration=180 → ['10:00', '11:00', '12:00']
 */

export function getBlockedSlots(startTime: string, durationMinutes: number): string[] {
    const slotsNeeded = calculateRequiredSlots(durationMinutes);
    const slots: string[] = [];

    const parts = startTime.split(':');
    const hour = Number(parts[0]);
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
        throw new Error(`Invalid startTime hour: ${startTime}`);
    }

    for (let i = 0; i < slotsNeeded; i++) {
        const slotHour = hour + i;
        if (slotHour < 24) { // Don't exceed 23:00
            slots.push(`${slotHour.toString().padStart(2, '0')}:00`);
        }
    }

    return slots;
}
