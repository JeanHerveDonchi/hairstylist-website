/**
 * Availability Composable
 * 
 * Handles all slot availability calculations and validation
 */

import { ref, computed } from 'vue'

import * as slotCalculations from '@/utils/slot-calculations'

import type { TimeSlot } from '@/types/booking.types'
import { formatDate } from '@/utils/booking/validations/formatDate'

export function useAvailability() {

    // ==========================================================================
    // STATE
    // ==========================================================================

    const loadedMonths = ref<Set<string>>(new Set())

    // ==========================================================================
    // AVAILABILITY CALCULATIONS
    // ==========================================================================

    /**
     * Get all available time slots for a specific date
     */
    const getAvailableSlotsForDate = (date: string): TimeSlot[] => {
        const allSlots = slotCalculations.generateBusinessHourSlots()
        const defaultUnavailable = slotCalculations.getDefaultUnavailableSlots()
        const dateUnavailable = slotCalculations.getUnavailableSlotsForDate(date)

        return allSlots.map((time: any) => {
            // Check if slot is unavailable
            const isDefaultUnavailable = defaultUnavailable.includes(time)
            const isDateUnavailable = dateUnavailable.some((slot: { timeSlot: any }) => slot.timeSlot === time)

            return {
                time,
                available: !isDefaultUnavailable && !isDateUnavailable
            }
        })
    }

    /**
     * Check if entire day is completely unavailable
     */
    const isDayCompletelyUnavailable = (date: string): boolean => {
        const slots = getAvailableSlotsForDate(date)
        return slots.every(slot => !slot.available)
    }

    /**
     * Validate if a booking can be made at specific date/time
     * Checks if all required slots (based on duration) are available
     */
    const validateBookingSlots = (
        date: string,
        startTime: string,
        durationMinutes: number
    ): { isValid: boolean; message?: string } => {
        const requiredSlots = slotCalculations.getBlockedSlots(startTime, durationMinutes)
        const availableSlots = getAvailableSlotsForDate(date)

        // Check if all required slots are available
        for (const requiredSlot of requiredSlots) {
            const slot = availableSlots.find(s => s.time === requiredSlot)

            if (!slot || !slot.available) {
                return {
                    isValid: false,
                    message: `Le créneau ${requiredSlot} n'est plus disponible`
                }
            }
        }

        return { isValid: true }
    }

    // ==========================================================================
    // MONTH LOADING
    // ==========================================================================

    /**
     * Load availability for a specific month
     * In real app, this would fetch from API
     * For MVP, we preload mock data
     */
    const loadMonthAvailability = async (year: number, month: number): Promise<void> => {
        const monthKey = `${year}-${month.toString().padStart(2, '0')}`

        if (loadedMonths.value.has(monthKey)) {
            return // Already loaded
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100))

        // In real app: fetch from backend
        // For now, we use MOCK_UNAVAILABLE_SLOTS which is already loaded
        slotCalculations.getUnavailableSlotsForMonth(year, month)

        loadedMonths.value.add(monthKey)
    }

    /**
     * Get available dates for a month (for calendar UI)
     */
    const getAvailableDatesForMonth = (year: number, month: number): Set<string> => {
        const availableDates = new Set<string>()
        const daysInMonth = new Date(year, month, 0).getDate()

        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

            // Skip past dates
            if (new Date(date) < new Date(formatDate(new Date()))) {
                continue
            }

            // Check if day has any available slots
            if (!isDayCompletelyUnavailable(date)) {
                availableDates.add(date)
            }
        }

        return availableDates
    }

    // ==========================================================================
    // RE-VALIDATION (CONCURRENCY PROTECTION)
    // ==========================================================================

    /**
     * Re-validate slots before proceeding to next step
     * Protects against concurrent bookings
     */
    const revalidateSlots = async (
        date: string,
        startTime: string,
        durationMinutes: number
    ): Promise<{ isValid: boolean; message?: string }> => {
        // In real app: make fresh API call to check availability
        // For MVP: check against current mock data

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 200))

        return validateBookingSlots(date, startTime, durationMinutes)
    }

    return {
        getAvailableSlotsForDate,
        isDayCompletelyUnavailable,
        validateBookingSlots,
        loadMonthAvailability,
        getAvailableDatesForMonth,
        revalidateSlots
    }
}