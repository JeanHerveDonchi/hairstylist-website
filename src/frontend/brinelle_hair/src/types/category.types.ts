export interface Category {
    id: string,
    coverImageUrl: string,
    title: HairstyleCategoryName,
    startPrice: number,
    available: boolean,
    description: string
}

export enum HairstyleCategoryName {
  Men = 'Hommes',
  Women = 'Femmes',
  Children = 'Enfants'
}