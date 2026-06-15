import type { Locale } from "@/constants/locales";

type LocalizedString = {
  defaultLocale: string
  locales: Record<string, string>
}

export function getLocalizedString(localized: LocalizedString, locale: Locale): string {
  return localized.locales[locale]
  ?? localized.locales[localized.defaultLocale]
  ?? ''
}
