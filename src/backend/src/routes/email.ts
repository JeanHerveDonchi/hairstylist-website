import Elysia from 'elysia'
import { Type as t } from '@sinclair/typebox'
import { sendConfirmationEmails } from '../services/email.service'

export const emailRoutes = new Elysia({ prefix: '/api/email' })
  .post('/confirmations', async ({ body }) => {
    await sendConfirmationEmails(
      body.bookingData,
      body.hairstylistEmail,
      body.hairstylistName,
      body.hairstylistPhone,
    )
    return { success: true }
  }, {
    body: t.Object({
      bookingData: t.Any(),
      hairstylistEmail: t.String(),
      hairstylistName: t.String(),
      hairstylistPhone: t.String(),
    }),
  })
