import Elysia from 'elysia'
import { Type as t } from '@sinclair/typebox'
import { createBooking } from '../services/booking.service'
import { sendConfirmationEmails } from '../services/email.service'

export const bookingsRoutes = new Elysia({ prefix: '/api/bookings' })
  .post('/', async ({ body }) => {
    const booking = await createBooking(body as any)

    // Send confirmation emails after successful booking
    const hairstylistEmail = process.env.HAIRSTYLIST_EMAIL || 'donchiherve1@gmail.com'
    const hairstylistName = process.env.HAIRSTYLIST_NAME || 'Brinelle'
    const hairstylistPhone = process.env.HAIRSTYLIST_PHONE || '506-899-7052'

    try {
      await sendConfirmationEmails(
        {
          userInfo: body.customer,
          selectedDate: body.startDatetime.split('T')[0] || '',
          selectedTime: body.startDatetime.split('T')[1]?.slice(0, 5) || '',
          hairstyleName: '',
          hairstyleDuration: body.durationHours * 60,
          hairstylePrice: 0,
        },
        hairstylistEmail,
        hairstylistName,
        hairstylistPhone,
      )
    } catch (emailErr) {
      console.error('Failed to send confirmation emails:', emailErr)
    }

    return booking
  }, {
    body: t.Object({
      hairstyleId: t.String(),
      customer: t.Object({
        firstName: t.String(),
        lastName: t.String(),
        email: t.String(),
        phone: t.String(),
      }),
      startDatetime: t.String(),
      durationHours: t.Number(),
    }),
  })
