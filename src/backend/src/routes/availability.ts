import Elysia from 'elysia'
import { Type as t } from '@sinclair/typebox'
import { fetchAvailability } from '../services/availability.service'

export const availabilityRoutes = new Elysia({ prefix: '/api/availability' })
  .get('/', async ({ query: { date, hairstylistId } }) => {
    return await fetchAvailability(date, hairstylistId)
  }, {
    query: t.Object({
      date: t.String(),
      hairstylistId: t.Optional(t.String()),
    }),
  })
