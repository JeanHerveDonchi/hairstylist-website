import type { UnavailableSlot } from '@/types/booking.types';
import { MOCK_UNAVAILABLE_SLOTS } from '@/mock-data/availability';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Get unavailable slots for a specific date
 */

export function getUnavailableSlotsForDate(date: string): UnavailableSlot[] {
    return MOCK_UNAVAILABLE_SLOTS.filter(slot => slot.date === date);
}
