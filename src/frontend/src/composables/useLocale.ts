import { ref } from "vue";
import { LocaleService } from "@/services/locale.service";
import { SUPPORTED_LOCALES, type Locale } from "@/constants/locales";

//share reactive ref - single source of truth accross app
const locale = ref<Locale>(LocaleService.getCurrentLocale());

export function useLocale() {
  function setLocale(newLocale: Locale) {
    if (LocaleService.isSupportedLocale(newLocale)) {
      locale.value = newLocale;
      LocaleService.setCurrentLocale(newLocale);
    }
  }

  function toggleLocale() {
    const currentIndex = SUPPORTED_LOCALES.indexOf(locale.value);
    const nextIndex = (currentIndex + 1) % SUPPORTED_LOCALES.length;
    const nextLocale = SUPPORTED_LOCALES[nextIndex];
    if (nextLocale !== undefined) {
      setLocale(nextLocale);
    }
  }

  return {
    locale,
    setLocale,
    toggleLocale
  };
}

