import Elysia from 'elysia'
import { fetchCategories, fetchCategoryById } from '../services/category.service'

export const categoriesRoutes = new Elysia({ prefix: '/api/categories' })
  .get('/', async () => {
    return await fetchCategories()
  })
  .get('/:id', async ({ params: { id } }) => {
    const category = await fetchCategoryById(id)
    if (!category) return { error: 'Category not found' }
    return category
  })
