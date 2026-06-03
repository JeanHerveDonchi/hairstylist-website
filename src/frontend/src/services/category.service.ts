import { api } from '@/lib/api'
import type { Category } from '@/types/category.types'

export async function fetchCategories(): Promise<Category[]> {
  return api.categories.list()
}
