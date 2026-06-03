//  useLocalized.ts
export function useLocalized() {
  const t = (field: any, locale: string) => {
    return field?.[locale] || ''
  }

  return { t }
}
