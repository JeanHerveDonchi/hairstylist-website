<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useBookingValidation } from '@/composables/useBookingValidation'
import type { UserInfo } from '@/types/booking.types'

/**
 * Step 1: User Information Form
 * 
 * Collects customer contact details with real-time validation
 */

interface Props {
  initialData?: UserInfo | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [userInfo: UserInfo]
}>()

const { getFieldError, validateUserInfo } = useBookingValidation()

// ==========================================================================
// FORM STATE
// ==========================================================================

const formData = reactive<UserInfo>({
  firstName: props.initialData?.firstName || '',
  lastName: props.initialData?.lastName || '',
  email: props.initialData?.email || '',
  phone: props.initialData?.phone || ''
})

const errors = reactive<Record<string, string>>({})
const touched = reactive<Record<string, boolean>>({})

// ==========================================================================
// VALIDATION
// ==========================================================================

const validateField = (field: keyof UserInfo) => {
  touched[field] = true
  const error = getFieldError(field, formData[field])
  
  if (error) {
    errors[field] = error
  } else {
    delete errors[field]
  }
}

const validateAllFields = () => {
  const result = validateUserInfo(formData)
  
  Object.keys(formData).forEach(key => {
    touched[key] = true
  })
  
  if (result.isValid) {
    Object.keys(errors).forEach(key => delete errors[key])
  } else {
    Object.assign(errors, result.errors)
  }
  
  return result.isValid
}

// ==========================================================================
// WATCHERS
// ==========================================================================

// Emit updates when form data changes (if valid)
watch(formData, () => {
  if (validateAllFields()) {
    emit('update', { ...formData })
  }
}, { deep: true })
</script>

<template>
  <div class="max-w-2xl mx-auto px-6 py-8">
    <h2 class="text-2xl md:text-3xl font-poppins font-semibold text-[#6E645F] mb-8 text-center">
      Vos informations
    </h2>
    
    <div class="space-y-6">
      <!-- First Name -->
      <div>
        <label 
          for="firstName" 
          class="block text-sm font-poppins font-medium text-[#6E645F] mb-2"
        >
          Prénom *
        </label>
        <input
          id="firstName"
          v-model="formData.firstName"
          type="text"
          @blur="validateField('firstName')"
          class="
            w-full 
            px-4 py-3 
            border rounded-lg
            font-poppins
            focus:outline-none focus:ring-2 focus:ring-[#F98B54] focus:border-transparent
            transition-all
          "
          :class="{
            'border-gray-300': !errors.firstName || !touched.firstName,
            'border-red-500': errors.firstName && touched.firstName
          }"
          placeholder="Entrez votre prénom"
        />
        <p 
          v-if="errors.firstName && touched.firstName" 
          class="mt-1 text-sm text-red-600 font-poppins"
        >
          {{ errors.firstName }}
        </p>
      </div>
      
      <!-- Last Name -->
      <div>
        <label 
          for="lastName" 
          class="block text-sm font-poppins font-medium text-[#6E645F] mb-2"
        >
          Nom de famille *
        </label>
        <input
          id="lastName"
          v-model="formData.lastName"
          type="text"
          @blur="validateField('lastName')"
          class="
            w-full 
            px-4 py-3 
            border rounded-lg
            font-poppins
            focus:outline-none focus:ring-2 focus:ring-[#F98B54] focus:border-transparent
            transition-all
          "
          :class="{
            'border-gray-300': !errors.lastName || !touched.lastName,
            'border-red-500': errors.lastName && touched.lastName
          }"
          placeholder="Entrez votre nom de famille"
        />
        <p 
          v-if="errors.lastName && touched.lastName" 
          class="mt-1 text-sm text-red-600 font-poppins"
        >
          {{ errors.lastName }}
        </p>
      </div>
      
      <!-- Email -->
      <div>
        <label 
          for="email" 
          class="block text-sm font-poppins font-medium text-[#6E645F] mb-2"
        >
          Email *
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          @blur="validateField('email')"
          class="
            w-full 
            px-4 py-3 
            border rounded-lg
            font-poppins
            focus:outline-none focus:ring-2 focus:ring-[#F98B54] focus:border-transparent
            transition-all
          "
          :class="{
            'border-gray-300': !errors.email || !touched.email,
            'border-red-500': errors.email && touched.email
          }"
          placeholder="exemple@email.com"
        />
        <p 
          v-if="errors.email && touched.email" 
          class="mt-1 text-sm text-red-600 font-poppins"
        >
          {{ errors.email }}
        </p>
      </div>
      
      <!-- Phone -->
      <div>
        <label 
          for="phone" 
          class="block text-sm font-poppins font-medium text-[#6E645F] mb-2"
        >
          Téléphone *
        </label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          @blur="validateField('phone')"
          class="
            w-full 
            px-4 py-3 
            border rounded-lg
            font-poppins
            focus:outline-none focus:ring-2 focus:ring-[#F98B54] focus:border-transparent
            transition-all
          "
          :class="{
            'border-gray-300': !errors.phone || !touched.phone,
            'border-red-500': errors.phone && touched.phone
          }"
          placeholder="506-123-4567"
        />
        <p 
          v-if="errors.phone && touched.phone" 
          class="mt-1 text-sm text-red-600 font-poppins"
        >
          {{ errors.phone }}
        </p>
      </div>
    </div>
    
    <p class="mt-6 text-sm text-gray-500 font-poppins text-center">
      * Champs obligatoires
    </p>
  </div>
</template>

<style scoped></style>