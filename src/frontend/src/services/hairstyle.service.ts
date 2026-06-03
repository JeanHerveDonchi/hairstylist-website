import { api } from '@/lib/api'
import type { HairStyle } from '@/types/hairstyle.types'

export async function fetchHairstyles(): Promise<HairStyle[]> {
  return api.hairstyles.list()
}

export async function fetchHairstyleById(id: string): Promise<HairStyle> {
  return api.hairstyles.byId(id)
}
