
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  type Locale,
} from '@/constants/locales'

// function to get the current locale from localStorage or default
function getCurrentLocale(): Locale {
  const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null
  if (storedLocale && SUPPORTED_LOCALES.includes(storedLocale)) {
    return storedLocale
  }
  return DEFAULT_LOCALE
}

// function to set a new locale and store it in localStorage
function setCurrentLocale(locale: Locale) {
  if (SUPPORTED_LOCALES.includes(locale)) {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }
}

//function to remove the stored locale from localStorage (for testing purposes)
function removeCurrentLocale() {
  localStorage.removeItem(LOCALE_STORAGE_KEY)
}

//validates that a string is a supported locale, otherwise returns the default
function isSupportedLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale)
}

// export the functions as a service object
export const LocaleService = {
  getCurrentLocale,
  setCurrentLocale,
  isSupportedLocale,
  removeCurrentLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
}
