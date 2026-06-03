import type { BusinessHours } from '@/types/booking.types'

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

export function generateHourlySlots(startTime: string, endTime: string): string[] {
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

export function generateDailySlots(businessHours?: BusinessHours): string[] {
  if (!businessHours) {
    return []
  }

  return generateHourlySlots(businessHours.openTime, businessHours.closeTime)
}

export function getUnavailableSlotsFromBlockedEvents(blockedEvents: { startTime: string; endTime: string; date?: string }[]): string[] {
  const blockedSlots = new Set<string>()

  for (const event of blockedEvents) {
    for (const slot of generateHourlySlots(event.startTime, event.endTime)) {
      blockedSlots.add(slot)
    }
  }

  return [...blockedSlots].sort((left, right) => parseHour(left) - parseHour(right))
}

export function isSlotUnavailable(date: string, timeSlot: string, blockedSlots: string[]): boolean {
  return blockedSlots.includes(timeSlot)
}

export function getUnavailableSlotsForMonthFromBlocked(year: number, month: number, blockedByDate: Record<string, string[] | undefined>): Record<string, string[]> {
  const unavailableSlotsByDate: Record<string, string[]> = {}

  for (const date of Object.keys(blockedByDate)) {
    if (!date.startsWith(`${year}-${month.toString().padStart(2, '0')}`)) continue
    const blockedSlots = blockedByDate[date] ?? []

    if (blockedSlots.length > 0) {
      unavailableSlotsByDate[date] = blockedSlots
    }
  }

  return unavailableSlotsByDate
}

export function generateBusinessHourSlots(businessHours?: BusinessHours): string[] {
  if (!businessHours) {
    return []
  }

  return generateHourlySlots(businessHours.openTime, businessHours.closeTime)
}

export function getDefaultUnavailableSlots(businessHours?: BusinessHours): string[] {
  const availableSlots = new Set(generateBusinessHourSlots(businessHours))
  const unavailableSlots: string[] = []

  for (let hour = 0; hour < HOURS_IN_DAY; hour++) {
    const slot = formatHour(hour)

    if (!availableSlots.has(slot)) {
      unavailableSlots.push(slot)
    }
  }

  return unavailableSlots
}
