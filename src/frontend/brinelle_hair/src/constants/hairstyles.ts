import { HairstyleCategory, HairstyleType, type HairStyle } from '@/types/hairstyle.types'

export const MOCK_HAIRSTYLES: HairStyle[] = [
  {
    id: '1',
    name: 'Braids Hommes',
    category: HairstyleCategory.Men,
    type: HairstyleType.Braids,
    price: 30,
    duration: 45,
    description: 'Braids hommes',
    image: '/images/mens_braids.jpg',
    available: true
  },
  {
    id: '2',
    name: 'Basic Curls',
    category: HairstyleCategory.Women,
    type: HairstyleType.Curls,
    price: 50,
    duration: 45,
    description: 'Curls femmes',
    image: '/images/womens_curls.jpg',
    available: true
  },
  {
    id: '3',
    name: 'Extra Boho Braids',
    category: HairstyleCategory.Children,
    type: HairstyleType.Braids,
    price: 30,
    duration: 45,
    description: 'Braids enfants',
    image: '/images/childrens_braids.jpg',
    available: true
  },
]