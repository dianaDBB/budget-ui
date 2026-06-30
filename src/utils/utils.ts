import { Category, SubcategoriesByCategory, Subcategory, Type } from '@/types';

export function normalizeDate(value: string): string {
  const date = new Date(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getTypeName(allTypes: Type[], typeId: string): string {
  return allTypes.find((option) => option.id === typeId)?.type ?? '';
}

export function getCategoryName(allCategories: Category[], categoryId: string): string {
  return allCategories.find((option) => option.id === categoryId)?.category ?? '';
}

export function getSubcategories(subcategories: SubcategoriesByCategory[], categoryName: string): Subcategory[] {
  return subcategories.find((subcategory) => subcategory.category === categoryName)?.subcategories ?? [];
}
