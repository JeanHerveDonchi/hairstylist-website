export interface BusinessHours {
  isClosed: boolean
  hours?: {
    day_of_week: number
    open_time: string
    close_time: string
    is_closed: boolean
  }
}

export interface AvailabilityResult {
  isClosed: boolean
  hours?: {
    day_of_week: number
    open_time: string
    close_time: string
    is_closed: boolean
  }
  appointments?: unknown[]
  blocked?: unknown[]
}
