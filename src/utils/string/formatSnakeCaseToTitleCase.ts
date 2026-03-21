/**
 * Convert snake_case string to Title Case
 * 
 * @param str - The snake_case string to convert
 * @returns Title Case string
 * 
 * @example
 * formatSnakeCaseToTitleCase('company_name') // 'Company Name'
 * formatSnakeCaseToTitleCase('favorite_color') // 'Favorite Color'
 */
export const formatSnakeCaseToTitleCase = (str: string): string => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
