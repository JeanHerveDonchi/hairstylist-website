export interface Category {
    id: string,
    coverImageUrl: string,
    title: HairstyleCategoryName,
    startPrice: number,
    description: string
}

export enum HairstyleCategoryName {
  Men = 'Hommes',
  Women = 'Femmes',
  Children = 'Enfants'
}
