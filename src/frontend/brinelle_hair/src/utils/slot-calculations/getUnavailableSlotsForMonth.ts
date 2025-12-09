import type { UnavailableSlot } from '@/types/booking.types';
import { MOCK_UNAVAILABLE_SLOTS } from '@/mock-data/availability';

/**
 * Get all unavailable slots for a month
 */

export function getUnavailableSlotsForMonth(year: number, month: number): UnavailableSlot[] {
    const monthStr = month.toString().padStart(2, '0');
    const prefix = `${year}-${monthStr}`;

    return MOCK_UNAVAILABLE_SLOTS.filter(slot => slot.date.startsWith(prefix));
}
