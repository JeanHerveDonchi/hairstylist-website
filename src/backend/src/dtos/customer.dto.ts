export interface CustomerInput {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  created_at?: string
}
