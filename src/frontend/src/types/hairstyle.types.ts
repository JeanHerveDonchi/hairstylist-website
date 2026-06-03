import type { Category } from "./category.types"

export interface HairStyle {
    id: string,
    name: string
    category: Category | undefined,
    type: HairstyleType,
    price: number
    duration: number // in minutes
    description: string
    image: string
    available: boolean
}



export enum HairstyleType {
  Curls = 'curls',
  Braids = 'braids',
  Twists = 'twists',
  Locks = 'locks'
}