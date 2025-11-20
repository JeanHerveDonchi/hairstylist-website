export interface HairStyle {
    id: string,
    name: string
    category: HairstyleCategory,
    type: HairstyleType,
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

export enum HairstyleType {
  Curls = 'curls',
  Braids = 'braids',
  Twists = 'twists',
  Locks = 'locks'
}