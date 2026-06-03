/**
 * External links and social media URLs
 * Centralized for easy updates (future dashboard integration)
 */

import type { Hairstylist } from "@/types/hairstylist.types"

export const SOCIAL_LINKS = {
  instagram: '#',
  facebook: '#',
  whatsapp: '#', // Will be https://wa.me/PHONENUMBER
  email: '#', // Will be mailto:contact@brinellehair.com
} as const

export const POLICY_LINKS = {
  privacy: '#', // Route to privacy policy page
  terms: '#', // Route to terms of service page
  refund: '#', // Route to refund policy page
} as const

export const REVIEW_LINKS = {
  leaveReview: '#', // Google Reviews, Facebook, or internal review page
} as const

export const INTERNAL_ROUTES = {
  gallery: '/galerie', // Gallery page route (not created yet)
} as const

export const HAIRSTYLIST: Hairstylist = {
  id: '1',
  name: 'Brinelle',
  email: 'donchiherve1@gmail.com',
  phone: '506-899-7052',
} as const
