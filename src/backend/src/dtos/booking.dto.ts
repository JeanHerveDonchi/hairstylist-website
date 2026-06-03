import type { CustomerInput } from "./customer.dto"

export interface BookingInput {
  hairstyleId: string
  customer: CustomerInput
  startDatetime: string
  durationHours: number
}

export interface Booking {
  id: string
  hairstyle_id: string
  customer_id: string
  start_datetime: string
  duration_hours: number
  status: string
  created_at?: string
}
