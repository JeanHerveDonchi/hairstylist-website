import type { Category } from "./category.dto"

export interface HairStyle {
  id: string
  name: string
  category?: Category
  type: string
  price: number
  duration: number
  description: string
  image: string
  available: boolean
}
