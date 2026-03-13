import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { BookingData } from '@/types/booking.types'
import { HAIRSTYLIST } from '@/constants/links'
import { sendBookingConfirmationEmails } from '@/services/email.service'

const sendMock = vi.fn()
const EMAIL_ENV_KEYS = [
  'VITE_EMAILJS_SERVICE_ID',
  'VITE_EMAILJS_PUBLIC_KEY',
  'VITE_EMAILJS_CUSTOMER_TEMPLATE_ID',
  'VITE_EMAILJS_HAIRSTYLIST_TEMPLATE_ID',
] as const
const originalProcessEnv = Object.fromEntries(
  EMAIL_ENV_KEYS.map((key) => [key, process.env[key]]),
) as Record<(typeof EMAIL_ENV_KEYS)[number], string | undefined>

vi.mock('@emailjs/browser', () => ({
  default: {
    send: (...args: unknown[]) => sendMock(...args),
  },
}))

const validBookingData: BookingData = {
  hairstyleId: 'style_001',
  hairstyleName: 'Knotless Braids',
  hairstyleDuration: 180,
  hairstylePrice: 150,
  userInfo: {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '506-123-4567',
  },
  selectedDate: '2026-03-21',
  selectedTime: '10:00',
}

const setRequiredEnv = () => {
  vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'service_abc123')
  vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'public_xyz987')
}

const restoreProcessEnv = () => {
  EMAIL_ENV_KEYS.forEach((key) => {
    const originalValue = originalProcessEnv[key]
    if (originalValue === undefined) {
      delete process.env[key]
      return
    }

    process.env[key] = originalValue
  })
}

describe('sendBookingConfirmationEmails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    restoreProcessEnv()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    restoreProcessEnv()
  })

  it('returns failure when booking data is incomplete', async () => {
    const incompleteBookingData: BookingData = {
      ...validBookingData,
      userInfo: null,
    }

    const result = await sendBookingConfirmationEmails(incompleteBookingData)

    expect(result.success).toBe(false)
    expect(result.message).toContain('Informations incomplètes')
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('returns failure when EmailJS configuration is missing', async () => {
    setRequiredEnv()
    vi.stubEnv('VITE_EMAILJS_CUSTOMER_TEMPLATE_ID', '')
    vi.stubEnv('VITE_EMAILJS_HAIRSTYLIST_TEMPLATE_ID', '')
    const result = await sendBookingConfirmationEmails(validBookingData)

    expect(result.success).toBe(false)
    expect(result.message).toContain('Configuration EmailJS incomplète')
    expect(result.message).toContain('VITE_EMAILJS_CUSTOMER_TEMPLATE_ID')
    expect(result.message).toContain('VITE_EMAILJS_HAIRSTYLIST_TEMPLATE_ID')
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('returns failure when EmailJS env values are placeholders', async () => {
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'your_emailjs_service_id')
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'your_emailjs_public_key')
    vi.stubEnv('VITE_EMAILJS_CUSTOMER_TEMPLATE_ID', 'your_customer_template_id')
    vi.stubEnv('VITE_EMAILJS_HAIRSTYLIST_TEMPLATE_ID', 'your_hairstylist_template_id')

    const result = await sendBookingConfirmationEmails(validBookingData)

    expect(result.success).toBe(false)
    expect(result.message).toContain('Configuration EmailJS incomplète')
    expect(result.message).toContain('VITE_EMAILJS_SERVICE_ID')
    expect(result.message).toContain('VITE_EMAILJS_PUBLIC_KEY')
    expect(result.message).toContain('VITE_EMAILJS_CUSTOMER_TEMPLATE_ID')
    expect(result.message).toContain('VITE_EMAILJS_HAIRSTYLIST_TEMPLATE_ID')
    expect(sendMock).not.toHaveBeenCalled()
  })

  it('sends confirmation emails to customer and hairstylist with dedicated templates', async () => {
    setRequiredEnv()
    vi.stubEnv('VITE_EMAILJS_CUSTOMER_TEMPLATE_ID', 'template_customer_001')
    vi.stubEnv('VITE_EMAILJS_HAIRSTYLIST_TEMPLATE_ID', 'template_hairstylist_001')
    sendMock.mockResolvedValue({})

    const result = await sendBookingConfirmationEmails(validBookingData)

    expect(result).toEqual({ success: true })
    expect(sendMock).toHaveBeenCalledTimes(2)

    const firstCallArgs = sendMock.mock.calls[0]!
    const secondCallArgs = sendMock.mock.calls[1]!

    expect(firstCallArgs[0]).toBe('service_abc123')
    expect(firstCallArgs[1]).toBe('template_customer_001')
    expect(firstCallArgs[3]).toEqual({ publicKey: 'public_xyz987' })
    expect(firstCallArgs[2]).toEqual(
      expect.objectContaining({
        recipient_type: 'customer',
        to_name: 'Jane Doe',
        to_email: 'jane.doe@example.com',
        customer_name: 'Jane Doe',
        hairstyle_name: 'Knotless Braids',
        appointment_time: '10:00 AM',
        appointment_duration: '180 minutes',
        appointment_taxes: 22.5,
        appointment_total: 172.5,
        hairstylist_email: HAIRSTYLIST.email,
        hairstylist_phone: HAIRSTYLIST.phone,
      }),
    )

    expect(secondCallArgs[0]).toBe('service_abc123')
    expect(secondCallArgs[1]).toBe('template_hairstylist_001')
    expect(secondCallArgs[3]).toEqual({ publicKey: 'public_xyz987' })
    expect(secondCallArgs[2]).toEqual(
      expect.objectContaining({
        recipient_type: 'hairstylist',
        to_name: HAIRSTYLIST.name,
        to_email: HAIRSTYLIST.email,
        reply_to: 'jane.doe@example.com',
        customer_email: 'jane.doe@example.com',
        appointment_time: '10:00 AM',
        appointment_duration: '180 minutes',
        appointment_total: 172.5,
      }),
    )
  })

  it('falls back to process.env when Vite env values are placeholders or unavailable', async () => {
    process.env.VITE_EMAILJS_SERVICE_ID = 'service_process_001'
    process.env.VITE_EMAILJS_PUBLIC_KEY = 'public_process_001'
    process.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID = 'template_customer_process_001'
    process.env.VITE_EMAILJS_HAIRSTYLIST_TEMPLATE_ID = 'template_hairstylist_process_001'
    sendMock.mockResolvedValue({})

    const result = await sendBookingConfirmationEmails(validBookingData)

    expect(result).toEqual({ success: true })
    expect(sendMock).toHaveBeenCalledTimes(2)
    expect(sendMock.mock.calls[0]![0]).toBe('service_process_001')
    expect(sendMock.mock.calls[0]![1]).toBe('template_customer_process_001')
    expect(sendMock.mock.calls[1]![1]).toBe('template_hairstylist_process_001')
    expect(sendMock.mock.calls[0]![3]).toEqual({ publicKey: 'public_process_001' })
  })

  it('returns failure when EmailJS send throws', async () => {
    setRequiredEnv()
    vi.stubEnv('VITE_EMAILJS_CUSTOMER_TEMPLATE_ID', 'template_customer_001')
    vi.stubEnv('VITE_EMAILJS_HAIRSTYLIST_TEMPLATE_ID', 'template_hairstylist_001')

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    sendMock.mockRejectedValueOnce(new Error('EmailJS failed')).mockResolvedValueOnce({})

    const result = await sendBookingConfirmationEmails(validBookingData)

    expect(result.success).toBe(false)
    expect(result.message).toContain("Impossible d'envoyer les emails")
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to send booking confirmation emails:',
      expect.any(Error),
    )

    consoleSpy.mockRestore()
  })
})
