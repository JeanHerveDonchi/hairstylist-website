import emailjs from '@emailjs/nodejs'

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing env variable: ${key}`)
  return value
}

emailjs.init({ publicKey: getEnv('EMAILJS_PUBLIC_KEY') })

export const emailConfig = {
  serviceId: getEnv('EMAILJS_SERVICE_ID'),
  customerTemplateId: getEnv('EMAILJS_CUSTOMER_TEMPLATE_ID'),
  hairstylistTemplateId: getEnv('EMAILJS_HAIRSTYLIST_TEMPLATE_ID'),
}

export { emailjs }
