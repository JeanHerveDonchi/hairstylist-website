import { HairstyleCategory, type HairStyle } from '@/types/hairstyle.types'

export const MOCK_HAIRSTYLES: HairStyle[] = [
  {
    id: '1',
    name: 'Classic Cut',
    category: HairstyleCategory.Men,
    price: 30,
    duration: 45,
    description: 'Traditional men\'s haircut',
    image: '/images/classic-cut.jpg',
    available: true
  },
  // Add more as you discuss with your friend
]