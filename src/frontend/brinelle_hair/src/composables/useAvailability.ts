/**
 * Availability Composable
 *
 * Handles all slot availability calculations and validation
 */

import { ref } from 'vue'

import { fetchAvailability } from '@/services/availability.service'
import { generateAvailableSlots } from '@/utils/slot-calculations/generateAvailableSlots'

import type { TimeSlot } from '@/types/booking.types'
import { formatDate } from '@/utils/booking/validations/formatDate'

export function useAvailability() {

    // ==========================================================================
    // STATE
    // ==========================================================================

    const loadedMonths = ref<Set<string>>(new Set())

    // ==========================================================================
    // AVAILABILITY CALCULATIONS (SUPABASE)
    // ==========================================================================

    /**
     * Get all available time slots for a specific date
     * Fetches business hours, appointments and blocked events from Supabase
     */
    const getAvailableSlotsForDate = async (
        date: string,
        durationHours: number,
        hairstylistId?: string | null
    ): Promise<TimeSlot[]> => {
        const data = await fetchAvailability(date, hairstylistId)

        if (data.isClosed) {
            return []
        }

        const slots = generateAvailableSlots({
            hours: data.hours,
            appointments: data.appointments || [],
            blocked: data.blocked || [],
            duration: durationHours
        })

        return slots.map((time) => ({ time, available: true }))
    }

    /**
     * Check if entire day is completely unavailable
     */
    const isDayCompletelyUnavailable = async (date: string, durationHours: number, hairstylistId?: string | null): Promise<boolean> => {
        const slots = await getAvailableSlotsForDate(date, durationHours, hairstylistId)
        return slots.length === 0
    }

    /**
     * Validate if a booking can be made at specific date/time
     * Checks if all required slots (based on duration) are available
     */
    const validateBookingSlots = async (
        date: string,
        startTime: string,
        durationMinutes: number,
        hairstylistId?: string | null
    ): Promise<{ isValid: boolean; message?: string }> => {
        // Convert durationMinutes to hours rounded up for our slot granularity
        const durationHours = Math.ceil(durationMinutes / 60)

        const availableSlots = await getAvailableSlotsForDate(date, durationHours, hairstylistId)
        const requiredSlots: string[] = []

        // Build required slots based on startTime and durationHours
        const startHour = parseInt((startTime.split(':')[0] ?? '0'), 10)
        for (let i = 0; i < durationHours; i++) {
            requiredSlots.push(`${(startHour + i).toString().padStart(2, '0')}:00`)
        }

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
     * Prefetches availability for each day of the month for the given hairstylist
     */
    const loadMonthAvailability = async (year: number, month: number, hairstylistId?: string | null): Promise<void> => {
        const monthKey = `${year}-${month.toString().padStart(2, '0')}`

        if (loadedMonths.value.has(monthKey)) {
            return // Already loaded
        }

        const daysInMonth = new Date(year, month, 0).getDate()

        const promises: Promise<any>[] = []

        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

            // Skip past dates
            if (new Date(date) < new Date(formatDate(new Date()))) {
                continue
            }

            // Prefetch availability for the date (no duration required for prefetch)
            promises.push(fetchAvailability(date, hairstylistId))
        }

        await Promise.all(promises)

        loadedMonths.value.add(monthKey)
    }

    /**
     * Get available dates for a month (for calendar UI)
     */
    const getAvailableDatesForMonth = async (year: number, month: number, durationHours: number, hairstylistId?: string | null): Promise<Set<string>> => {
        const availableDates = new Set<string>()
        const daysInMonth = new Date(year, month, 0).getDate()

        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

            // Skip past dates
            if (new Date(date) < new Date(formatDate(new Date()))) {
                continue
            }

            // Check if day has any available slots
            const unavailable = await isDayCompletelyUnavailable(date, durationHours, hairstylistId)

            if (!unavailable) {
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
        durationMinutes: number,
        hairstylistId?: string | null
    ): Promise<{ isValid: boolean; message?: string }> => {
        // Make fresh API call to check availability
        return validateBookingSlots(date, startTime, durationMinutes, hairstylistId)
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
