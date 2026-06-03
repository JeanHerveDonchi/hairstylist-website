import { supabase } from '../lib/supabase'
import type { Category } from "../dtos"

type CategoryRow = {
  id: string
  name: string
  image_url: string | null
  starting_price: number
}

const CATEGORY_NAME_MAP: Record<string, string> = {
  men: 'Men',
  women: 'Women',
  children: 'Children',
}

function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    coverImageUrl: row.image_url || '',
    title: CATEGORY_NAME_MAP[row.name.toLowerCase()] ?? row.name,
    startPrice: row.starting_price,
    description: '',
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('hairstyle_categories')
    .select('id, name, image_url, starting_price')
    .order('starting_price', { ascending: true })

  if (error) throw error
  return (data ?? []).map((row) => mapCategoryRow(row as CategoryRow))
}

export async function fetchCategoryById(id: string): Promise<Category | null> {
  if (!id) return null
  const { data, error } = await supabase
    .from('hairstyle_categories')
    .select('id, name, image_url, starting_price')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return mapCategoryRow(data as CategoryRow)
}
