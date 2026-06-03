import type { TimeSlot } from '@/types/booking.types'

interface GenerateSlotsOptions {
  hours: any
  appointments: any[]
  blocked: any[]
  duration: number
}

export function generateTimeSlots({
  hours,
  appointments,
  blocked,
  duration
}: GenerateSlotsOptions): TimeSlot[] {
  const slots: TimeSlot[] = []

  const startHour = parseInt((hours.open_time?.split(':')[0]) ?? '0')
  const endHour = parseInt((hours.close_time?.split(':')[0]) ?? '0')

  for (let hour = startHour; hour < endHour; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`
    const exceedsBusinessHours = hour + duration > endHour
    const isTaken = exceedsBusinessHours || isSlotTaken(time, duration, appointments, blocked)

    slots.push({
      time,
      available: !isTaken,
    })
  }

  return slots
}

export function generateAvailableSlots({
  hours,
  appointments,
  blocked,
  duration
}: GenerateSlotsOptions) {
  return generateTimeSlots({ hours, appointments, blocked, duration })
    .filter((slot) => slot.available)
    .map((slot) => slot.time)
}

function isSlotTaken(
  slot: string,
  duration: number,
  appointments: any[],
  blocked: any[]
) {
  const slotHour = parseInt((slot.split(':')[0]) ?? '0')

  const slotStart = slotHour
  const slotEnd = slotHour + duration

  // Check appointments
  for (const appt of appointments) {
    const apptStart = parseInt((appt.start_time?.split(':')[0]) ?? '0')
    const apptEnd = apptStart + (appt.duration_hours ?? 0)

    if (overlaps(slotStart, slotEnd, apptStart, apptEnd)) {
      return true
    }
  }

  // Check blocked events
  for (const block of blocked) {
    const blockStart = parseInt((block.start_time?.split(':')[0]) ?? '0')
    const blockEnd = parseInt((block.end_time?.split(':')[0]) ?? '0')

    if (overlaps(slotStart, slotEnd, blockStart, blockEnd)) {
      return true
    }
  }

  return false
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && aEnd > bStart
}
