import { HairstyleType, type HairStyle } from '@/types/hairstyle.types'
import { MOCK_CATEGORIES } from './categories'

export const MOCK_HAIRSTYLES: HairStyle[] = [
  {
    id: '1',
    name: 'Braids Hommes',
    category: MOCK_CATEGORIES.find(c => c.id === "men"),
    type: HairstyleType.Braids,
    price: 30,
    duration: 45,
    description: 'Mi pretium. Ad praesent sodales, eget sed ligula lectus convallis et, sagittis etiam convallis quis inceptos dapibus curae; Feugiat pede fermentum fringilla montes lectus vehicula praesent laoreet arcu aliquet ultricies egestas magna a nibh egestas id rhoncus ligula amet rutrum nibh malesuada magnis sem ipsum. Aliquam nam nisi habitasse non.',
    image: '',
    available: true
  },
  {
    id: '2',
    name: 'Basic Curls',
    category: MOCK_CATEGORIES.find(c => c.id === "women"),
    type: HairstyleType.Curls,
    price: 50,
    duration: 45,
    description: 'Curls femmes',
    image: '',
    available: true
  },
  {
    id: '3',
    name: 'Extra Boho Braids',
    category: MOCK_CATEGORIES.find(c => c.id === "children"),
    type: HairstyleType.Braids,
    price: 30,
    duration: 45,
    description: 'Braids enfants',
    image: '',
    available: true
  },
    {
    id: '4',
    name: 'Locks Hommes',
    category: MOCK_CATEGORIES.find(c => c.id === "men"),
    type: HairstyleType.Braids,
    price: 30,
    duration: 45,
    description: 'Locks hommes',
    image: '',
    available: true
  },
  {
    id: '5',
    name: 'French Curls',
    category: MOCK_CATEGORIES.find(c => c.id === "women"),
    type: HairstyleType.Curls,
    price: 50,
    duration: 45,
    description: 'French Curls femmes',
    image: '',
    available: true
  },
  {
    id: '6',
    name: 'Extra Boho Curls',
    category: MOCK_CATEGORIES.find(c => c.id === "children"),
    type: HairstyleType.Braids,
    price: 30,
    duration: 45,
    description: 'Boho curls enfants',
    image: '',
    available: true
  },
]