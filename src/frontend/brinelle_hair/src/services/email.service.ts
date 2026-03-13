import emailjs from '@emailjs/browser'
import { APPOINTMENT_PRICING } from '@/constants/business-rules/business-rules'
import { HAIRSTYLIST } from '@/constants/links'
import type { BookingData } from '@/types/booking.types'

interface BookingDataReadyForEmail extends BookingData {
  userInfo: NonNullable<BookingData['userInfo']>
  selectedDate: string
  selectedTime: string
}

interface EmailServiceConfig {
  serviceId: string
  publicKey: string
  customerTemplateId: string
  hairstylistTemplateId: string
}

interface BookingEmailResult {
  success: boolean
  message?: string
}

type EmailEnvKey =
  | 'VITE_EMAILJS_SERVICE_ID'
  | 'VITE_EMAILJS_PUBLIC_KEY'
  | 'VITE_EMAILJS_CUSTOMER_TEMPLATE_ID'
  | 'VITE_EMAILJS_HAIRSTYLIST_TEMPLATE_ID'

type EmailTemplateParams = Record<string, string | number>

const isEnvValueConfigured = (value: string): boolean => {
  const normalized = value.trim().toLowerCase()
  if (!normalized) {
    return false
  }

  if (
    normalized.startsWith('your_') ||
    normalized.includes('change_me') ||
    normalized.includes('changeme')
  ) {
    return false
  }

  return true
}

const getEmailEnvValue = (key: EmailEnvKey): string => {
  const viteEnv = import.meta.env as Partial<Record<EmailEnvKey, string>> | undefined
  const nodeEnv = (
    globalThis as typeof globalThis & {
      process?: { env?: Partial<Record<EmailEnvKey, string>> }
    }
  ).process?.env

  const candidates = [viteEnv?.[key], nodeEnv?.[key]]
    .map((value) => value?.trim() ?? '')
    .filter(Boolean)

  return candidates.find(isEnvValueConfigured) ?? candidates[0] ?? ''
}

const getEmailServiceConfig = (): { config: EmailServiceConfig | null; missing: string[] } => {
  const rawServiceId = getEmailEnvValue('VITE_EMAILJS_SERVICE_ID')
  const rawPublicKey = getEmailEnvValue('VITE_EMAILJS_PUBLIC_KEY')
  const rawCustomerTemplateId = getEmailEnvValue('VITE_EMAILJS_CUSTOMER_TEMPLATE_ID')
  const rawHairstylistTemplateId = getEmailEnvValue('VITE_EMAILJS_HAIRSTYLIST_TEMPLATE_ID')

  const serviceId = isEnvValueConfigured(rawServiceId) ? rawServiceId : ''
  const publicKey = isEnvValueConfigured(rawPublicKey) ? rawPublicKey : ''
  const customerTemplateId = isEnvValueConfigured(rawCustomerTemplateId) ? rawCustomerTemplateId : ''
  const hairstylistTemplateId = isEnvValueConfigured(rawHairstylistTemplateId)
    ? rawHairstylistTemplateId
    : ''

  const missing: string[] = []

  if (!serviceId) {
    missing.push('VITE_EMAILJS_SERVICE_ID')
  }

  if (!publicKey) {
    missing.push('VITE_EMAILJS_PUBLIC_KEY')
  }

  if (!customerTemplateId) {
    missing.push('VITE_EMAILJS_CUSTOMER_TEMPLATE_ID')
  }

  if (!hairstylistTemplateId) {
    missing.push('VITE_EMAILJS_HAIRSTYLIST_TEMPLATE_ID')
  }

  if (missing.length > 0) {
    return { config: null, missing }
  }

  return {
    config: {
      serviceId,
      publicKey,
      customerTemplateId,
      hairstylistTemplateId,
    },
    missing: [],
  }
}

const isBookingDataReadyForEmail = (
  bookingData: BookingData,
): bookingData is BookingDataReadyForEmail => {
  return Boolean(
    bookingData.userInfo &&
      bookingData.userInfo.email &&
      bookingData.selectedDate &&
      bookingData.selectedTime,
  )
}

const formatDateForEmail = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number)
  if (year === undefined || month === undefined || day === undefined) {
    return dateString
  }

  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('fr-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatTimeForEmail = (timeString: string): string => {
  const [hourString = '0', minuteString = '00'] = timeString.split(':')
  const hour = Number(hourString)
  const minute = Number(minuteString)

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return timeString
  }

  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  const displayMinute = String(minute).padStart(2, '0')

  return `${displayHour}:${displayMinute} ${period}`
}

const roundCurrency = (amount: number): number => {
  return Math.round((amount + Number.EPSILON) * 100) / 100
}

const buildTemplateBaseParams = (bookingData: BookingDataReadyForEmail): EmailTemplateParams => {
  const fullName = `${bookingData.userInfo.firstName} ${bookingData.userInfo.lastName}`.trim()
  const appointmentTaxes = roundCurrency(bookingData.hairstylePrice * APPOINTMENT_PRICING.nbTaxRate)
  const appointmentTotal = roundCurrency(bookingData.hairstylePrice + appointmentTaxes)

  return {
    customer_first_name: bookingData.userInfo.firstName,
    customer_last_name: bookingData.userInfo.lastName,
    customer_name: fullName,
    customer_email: bookingData.userInfo.email,
    customer_phone: bookingData.userInfo.phone,
    hairstyle_name: bookingData.hairstyleName,
    appointment_date: formatDateForEmail(bookingData.selectedDate),
    appointment_time: formatTimeForEmail(bookingData.selectedTime),
    appointment_duration: `${bookingData.hairstyleDuration} minutes`,
    appointment_price: bookingData.hairstylePrice,
    appointment_taxes: appointmentTaxes,
    appointment_total: appointmentTotal,
    hairstylist_email: HAIRSTYLIST.email,
    hairstylist_phone: HAIRSTYLIST.phone,
  }
}

const sendTemplateEmail = async (
  config: EmailServiceConfig,
  templateId: string,
  templateParams: EmailTemplateParams,
) => {
  await emailjs.send(config.serviceId, templateId, templateParams, {
    publicKey: config.publicKey,
  })
}

export const sendBookingConfirmationEmails = async (
  bookingData: BookingData,
): Promise<BookingEmailResult> => {
  if (!isBookingDataReadyForEmail(bookingData)) {
    return {
      success: false,
      message: 'Informations incomplètes pour envoyer les emails de confirmation.',
    }
  }

  if (!HAIRSTYLIST.email?.trim()) {
    return {
      success: false,
      message: 'Email de la coiffeuse manquant dans la configuration.',
    }
  }

  const { config, missing } = getEmailServiceConfig()
  if (!config) {
    return {
      success: false,
      message: `Configuration EmailJS incomplète (${missing.join(', ')}).`,
    }
  }

  const baseParams = buildTemplateBaseParams(bookingData)
  const customerName = `${bookingData.userInfo.firstName} ${bookingData.userInfo.lastName}`.trim()

  try {
    await Promise.all([
      sendTemplateEmail(config, config.customerTemplateId, {
        ...baseParams,
        recipient_type: 'customer',
        to_name: customerName,
        to_email: bookingData.userInfo.email,
        reply_to: HAIRSTYLIST.email,
      }),
      sendTemplateEmail(config, config.hairstylistTemplateId, {
        ...baseParams,
        recipient_type: 'hairstylist',
        to_name: HAIRSTYLIST.name,
        to_email: HAIRSTYLIST.email,
        reply_to: bookingData.userInfo.email,
      }),
    ])

    return { success: true }
  } catch (error) {
    console.error('Failed to send booking confirmation emails:', error)
    return {
      success: false,
      message: "Impossible d'envoyer les emails de confirmation. Veuillez réessayer.",
    }
  }
}
