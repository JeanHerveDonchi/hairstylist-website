// ============================================================================
// DURATION CALCULATIONS
// ============================================================================
/**
 * Calculate number of 1-hour slots needed for a duration
 * Rounds up: 70 minutes = 2 slots, 180 minutes = 3 slots
 */

export function calculateRequiredSlots(durationMinutes: number): number {
    return Math.ceil(durationMinutes / 60);
}
