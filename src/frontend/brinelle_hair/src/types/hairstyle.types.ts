export interface HairStyle {
    id: string,
    name: string
    category: HairstyleCategory,
    price: number
    duration: number // in minutes
    description: string
    image: string
    available: boolean
}

export enum HairstyleCategory {
  Men = 'men',
  Women = 'women',
  Children = 'children'
}