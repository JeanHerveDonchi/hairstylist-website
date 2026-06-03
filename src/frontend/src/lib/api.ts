import type { AvailabilityResult } from '@/types/booking.types'

const BASE_URL = import.meta.env.VITE_API_BASEURL || 'http://localhost:3000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

export const api = {
  categories: {
    list: () => request<import('../types/category.types').Category[]>('/api/categories'),
    byId: (id: string) => request<import('../types/category.types').Category>(`/api/categories/${id}`),
  },
  hairstyles: {
    list: () => request<import('../types/hairstyle.types').HairStyle[]>('/api/hairstyles'),
    byId: (id: string) => request<import('../types/hairstyle.types').HairStyle>(`/api/hairstyles/${id}`),
  },
  availability: {
    get: (date: string, hairstylistId?: string | null) => {
      const params = new URLSearchParams({ date })
      if (hairstylistId) params.set('hairstylistId', hairstylistId)
      return request<AvailabilityResult>(`/api/availability?${params}`)
    },
  },
  bookings: {
    create: (data: import('../types/booking.types').BookingInput) =>
      request<import('../types/booking.types').Booking>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
}
