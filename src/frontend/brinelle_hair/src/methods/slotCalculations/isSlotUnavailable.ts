import { MOCK_UNAVAILABLE_SLOTS } from '@/mock-data/availability';

/**
 * Check if a specific slot is unavailable
 */

export function isSlotUnavailable(date: string, timeSlot: string): boolean {
    return MOCK_UNAVAILABLE_SLOTS.some(
        slot => slot.date === date && slot.timeSlot === timeSlot
    );
}
