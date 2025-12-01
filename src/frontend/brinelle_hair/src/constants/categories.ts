import { HairstyleCategoryName, type Category } from "@/types/category.types";
import { CATEGORY_IMAGES } from "./images";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'men',
    coverImageUrl: CATEGORY_IMAGES.men,
    title: HairstyleCategoryName.Men,
    startPrice: 25,
    available: true,
    description: "Category Hommes"
  },
  {
    id: 'women',
    coverImageUrl: CATEGORY_IMAGES.women,
    title: HairstyleCategoryName.Women,
    startPrice: 35,
    available: true,
    description: "Category Hommes"
  },
  {
    id: 'children',
    coverImageUrl: CATEGORY_IMAGES.children,
    title: HairstyleCategoryName.Children,
    startPrice: 20,
    available: true,
    description: "Category Hommes"
  }
]