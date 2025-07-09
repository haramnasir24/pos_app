export type CategoryObj = { id: string; name: string };

/**
 * Toggles a category in the selected list
 * @param category - The category to toggle
 * @param selected - Current selected categories
 * @returns Updated selected categories array
 */
export const toggleCategory = (
  category: CategoryObj,
  selected: CategoryObj[]
): CategoryObj[] => {
  return selected.some((c) => c.id === category.id)
    ? selected.filter((c) => c.id !== category.id)
    : [...selected, category];
};

/**
 * Checks if a category is selected
 * @param category - The category to check
 * @param selected - Current selected categories
 * @returns True if category is selected, false otherwise
 */
export const isCategorySelected = (
  category: CategoryObj,
  selected: CategoryObj[]
): boolean => {
  return selected.some((c) => c.id === category.id);
};

/**
 * Clears all selected categories
 * @returns Empty array
 */
export const clearSelectedCategories = (): CategoryObj[] => {
  return [];
};

/**
 * Gets category IDs from category objects
 * @param categories - Array of category objects
 * @returns Array of category IDs
 */
export const getCategoryIds = (categories: CategoryObj[]): string[] => {
  return categories.map((category) => category.id);
};

/**
 * Gets category names from category objects
 * @param categories - Array of category objects
 * @returns Array of category names
 */
export const getCategoryNames = (categories: CategoryObj[]): string[] => {
  return categories.map((category) => category.name);
};
