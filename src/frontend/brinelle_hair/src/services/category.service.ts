import { supabase } from '@/lib/supabase'
import type { UUID } from '@/types/common.types'
import type { Category } from '@/types/category.types'

type CategoryRow = {
  id: string
  name: string
  image_url: string | null
  starting_price: number
}

function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id as UUID,
    coverImageUrl: row.image_url || '',
    title: row.name as Category['title'],
    startPrice: row.starting_price,
    description: '',
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('hairstyle_categories')
    .select('id, name, image_url, starting_price')
    .order('starting_price', { ascending: true })

  if (error) {
    console.error('fetchCategories error', error)
    return []
  }

  return (data ?? []).map((row) => mapCategoryRow(row as CategoryRow))
}

export async function fetchCategoryById(id: string): Promise<Category | null> {
  if (!id) return null
  const { data, error } = await supabase
    .from('hairstyle_categories')
    .select('id, name, image_url, starting_price')
    .eq('id', id)
    .single()

  if (error) {
    console.error('fetchCategoryById error', error)
    return null
  }

  return mapCategoryRow(data as CategoryRow)
}
