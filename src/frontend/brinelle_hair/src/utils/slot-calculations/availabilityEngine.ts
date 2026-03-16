import { MOCK_BLOCKED_EVENTS, MOCK_BUSINESS_HOURS } from '@/mock-data/availability'
import type { BusinessHours, UnavailableSlotsByDate } from '@/types/booking.types'

const HOURS_IN_DAY = 24

function parseDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number)

  if (!year || !month || !day) {
    throw new Error(`Invalid date: ${date}`)
  }

  return new Date(year, month - 1, day)
}

function parseHour(time: string): number {
  const [hourText, minuteText] = time.split(':')
  const hour = Number(hourText)
  const minute = Number(minuteText)

  if (!Number.isInteger(hour) || hour < 0 || hour > 23 || minute !== 0) {
    throw new Error(`Invalid time: ${time}`)
  }

  return hour
}

function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`
}

function generateHourlySlots(startTime: string, endTime: string): string[] {
  const startHour = parseHour(startTime)
  const endHour = parseHour(endTime)

  if (endHour < startHour) {
    throw new Error(`Invalid time range: ${startTime} -> ${endTime}`)
  }

  const slots: string[] = []

  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(formatHour(hour))
  }

  return slots
}

function getBusinessHoursForDate(date: string): BusinessHours | undefined {
  const dayOfWeek = parseDate(date).getDay()
  return MOCK_BUSINESS_HOURS.find((hours) => hours.dayOfWeek === dayOfWeek)
}

function getDefaultBusinessHours(): BusinessHours | undefined {
  return MOCK_BUSINESS_HOURS.find((hours) => hours.dayOfWeek === 1) ?? MOCK_BUSINESS_HOURS[0]
}

function generateMonthDates(year: number, month: number): string[] {
  const daysInMonth = new Date(year, month, 0).getDate()
  const dates: string[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)
  }

  return dates
}

export function generateDailySlots(date: string): string[] {
  const businessHours = getBusinessHoursForDate(date)

  if (!businessHours) {
    return []
  }

  return generateHourlySlots(businessHours.openTime, businessHours.closeTime)
}

export function getBlockedSlotsForDate(date: string): string[] {
  const blockedSlots = new Set<string>()

  for (const event of MOCK_BLOCKED_EVENTS) {
    if (event.date !== date) {
      continue
    }

    for (const slot of generateHourlySlots(event.startTime, event.endTime)) {
      blockedSlots.add(slot)
    }
  }

  return [...blockedSlots].sort((left, right) => parseHour(left) - parseHour(right))
}

export function isSlotUnavailable(date: string, timeSlot: string): boolean {
  const blockedSlots = getBlockedSlotsForDate(date)
  return blockedSlots.includes(timeSlot)
}

export function getUnavailableSlotsForMonth(year: number, month: number): UnavailableSlotsByDate {
  const unavailableSlotsByDate: UnavailableSlotsByDate = {}

  for (const date of generateMonthDates(year, month)) {
    const blockedSlots = getBlockedSlotsForDate(date)

    if (blockedSlots.length > 0) {
      unavailableSlotsByDate[date] = blockedSlots
    }
  }

  return unavailableSlotsByDate
}

export function generateBusinessHourSlots(date?: string): string[] {
  if (date) {
    return generateDailySlots(date)
  }

  const businessHours = getDefaultBusinessHours()

  if (!businessHours) {
    return []
  }

  return generateHourlySlots(businessHours.openTime, businessHours.closeTime)
}

export function getDefaultUnavailableSlots(date?: string): string[] {
  const availableSlots = new Set(generateBusinessHourSlots(date))
  const unavailableSlots: string[] = []

  for (let hour = 0; hour < HOURS_IN_DAY; hour++) {
    const slot = formatHour(hour)

    if (!availableSlots.has(slot)) {
      unavailableSlots.push(slot)
    }
  }

  return unavailableSlots
}

export function getUnavailableSlotsForDate(date: string): string[] {
  return getBlockedSlotsForDate(date)
}
