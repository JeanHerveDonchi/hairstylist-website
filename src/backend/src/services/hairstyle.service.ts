import { supabase } from '../lib/supabase'
import { fetchCategories } from './category.service'
import type { HairStyle, Category } from '../dtos'

type HairstyleRow = {
  id: string
  name: string
  category_id: string | null
  description: string | null
  image_url: string | null
  duration_hours: number | null
  price: number
  available: boolean | null
  type_id: string
}

function mapHairstyleRow(row: HairstyleRow, categoryById?: Map<string, Category>): HairStyle {
  return {
    id: row.id,
    name: row.name,
    category: row.category_id ? categoryById?.get(row.category_id) : undefined,
    type: row.type_id,
    price: row.price,
    duration: (row.duration_hours ?? 1) * 60,
    description: row.description || '',
    image: row.image_url || '',
    available: !!row.available,
  }
}

export async function fetchHairstyles(): Promise<HairStyle[]> {
  const [categories, hairstyleResponse] = await Promise.all([
    fetchCategories(),
    supabase
      .from('hairstyles')
      .select('id, name, category_id, description, image_url, duration_hours, price, available, type_id')
      .eq('available', true)
      .order('price', { ascending: true }),
  ])

  const { data, error } = hairstyleResponse
  if (error) throw error

  const categoryById = new Map(categories.map((c) => [c.id, c]))
  return (data ?? []).map((row) => mapHairstyleRow(row as HairstyleRow, categoryById))
}

export async function fetchHairstyleById(id: string): Promise<HairStyle | null> {
  if (!id) return null

  const { data, error } = await supabase
    .from('hairstyles')
    .select('id, name, category_id, description, image_url, duration_hours, price, available, type_id')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return mapHairstyleRow(data as HairstyleRow)
}
