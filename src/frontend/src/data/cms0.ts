import { cms0 } from '@cms0/cms0'
import type { LocalizedString } from '@cms0/cms0/custom-types'

type HomePage = {
  heroTitle: string
}

type SiteSettings = {
  brandName: LocalizedString
  navbar: {
    servicesLabel: LocalizedString
    contactsLabel: LocalizedString
    bookingCta: LocalizedString
  }
}

export type RootSchema = {
  HomePage: HomePage
  SiteSettings: SiteSettings
}

export const cms = cms0<RootSchema>({
  apiConfig: {
    baseUrl: import.meta.env.VITE_CMS0_API_BASEURL,
    key: import.meta.env.VITE_CMS0_API_KEY,
  },
})
