import Elysia from 'elysia'
import { fetchHairstyles, fetchHairstyleById } from '../services/hairstyle.service'

export const hairstylesRoutes = new Elysia({ prefix: '/api/hairstyles' })
  .get('/', async () => {
    return await fetchHairstyles()
  })
  .get('/:id', async ({ params: { id } }) => {
    const hairstyle = await fetchHairstyleById(id)
    if (!hairstyle) return { error: 'Hairstyle not found' }
    return hairstyle
  })
