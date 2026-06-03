import { ref } from "vue";

//global shared state (singleton)
const locale = ref<'fr' | 'en'>(
  localStorage.getItem('locale') as 'fr' | 'en'
) || 'fr';

//global language switch
export function useLocale() {
  const setLocale = (newLocale: 'fr' | 'en') => {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale);
  }

  return {
    locale,
    setLocale,
  }
}
