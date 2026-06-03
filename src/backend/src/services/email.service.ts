import { emailjs, emailConfig } from '../lib/email'

interface BookingData {
  userInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  selectedDate: string
  selectedTime: string
  hairstyleName: string
  hairstyleDuration: number
  hairstylePrice: number
}

export async function sendConfirmationEmails(
  bookingData: BookingData,
  hairstylistEmail: string,
  hairstylistName: string,
  hairstylistPhone: string,
): Promise<void> {
  const fullName = `${bookingData.userInfo.firstName} ${bookingData.userInfo.lastName}`.trim()

  const baseParams: Record<string, unknown> = {
    customer_first_name: bookingData.userInfo.firstName,
    customer_last_name: bookingData.userInfo.lastName,
    customer_name: fullName,
    customer_email: bookingData.userInfo.email,
    customer_phone: bookingData.userInfo.phone,
    hairstyle_name: bookingData.hairstyleName,
    appointment_date: bookingData.selectedDate,
    appointment_time: bookingData.selectedTime,
    appointment_duration: `${bookingData.hairstyleDuration} minutes`,
    appointment_price: bookingData.hairstylePrice,
    hairstylist_email: hairstylistEmail,
    hairstylist_phone: hairstylistPhone,
  }

  await Promise.all([
    emailjs.send(
      emailConfig.serviceId,
      emailConfig.customerTemplateId,
      {
        ...baseParams,
        to_name: fullName,
        to_email: bookingData.userInfo.email,
        reply_to: hairstylistEmail,
      },
    ),
    emailjs.send(
      emailConfig.serviceId,
      emailConfig.hairstylistTemplateId,
      {
        ...baseParams,
        to_name: hairstylistName,
        to_email: hairstylistEmail,
        reply_to: bookingData.userInfo.email,
      },
    ),
  ])
}
