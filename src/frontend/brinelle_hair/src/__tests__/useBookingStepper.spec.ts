import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useBookingStepper } from '@/composables/useBookingStepper'
import { createBooking } from '@/services/booking.service'
import { sendBookingConfirmationEmails } from '@/services/email.service'
import { BookingStep } from '@/types/booking.types'
import { HairstyleType, type HairStyle } from '@/types/hairstyle.types'

const push = vi.fn()
const back = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
    back,
  }),
}))

vi.mock('@/services/booking.service', () => ({
  createBooking: vi.fn(),
}))

vi.mock('@/services/email.service', () => ({
  sendBookingConfirmationEmails: vi.fn(),
}))

function mountBookingStepper() {
  const hairstyle = ref<HairStyle | null>({
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Test Style',
    category: undefined,
    type: HairstyleType.Braids,
    price: 120,
    duration: 60,
    description: 'Test description',
    image: '/test.jpg',
    available: true,
  })

  let stepper: ReturnType<typeof useBookingStepper> | undefined

  const TestComponent = defineComponent({
    setup() {
      stepper = useBookingStepper(hairstyle.value?.id ?? '', hairstyle)

      return () => h('div')
    },
  })

  mount(TestComponent)

  if (!stepper) {
    throw new Error('Failed to initialize useBookingStepper')
  }

  return stepper
}

describe('useBookingStepper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('returns the user to step 2 and clears the stale time when booking conflicts', async () => {
    vi.mocked(createBooking).mockRejectedValue(
      Object.assign(new Error('Booking conflict'), { conflict: true })
    )

    const stepper = mountBookingStepper()

    stepper.updateUserInfo({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '506-123-4567',
    })
    stepper.nextStep()

    stepper.updateDateTime('2026-04-06', '10:00')
    stepper.nextStep()

    expect(stepper.currentStep.value).toBe(BookingStep.Confirmation)
    expect(stepper.bookingData.value.selectedTime).toBe('10:00')

    const result = await stepper.submitBooking()

    expect(result).toEqual({
      success: false,
      message: "Ce créneau n'est plus disponible. Veuillez en choisir un autre.",
      reason: 'conflict',
    })
    expect(stepper.currentStep.value).toBe(BookingStep.DateTime)
    expect(stepper.bookingData.value.selectedDate).toBe('2026-04-06')
    expect(stepper.bookingData.value.selectedTime).toBeNull()
    expect(stepper.toastMessage.value).toBe("Ce créneau n'est plus disponible. Veuillez en choisir un autre.")
    expect(sendBookingConfirmationEmails).not.toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()
  })
})
