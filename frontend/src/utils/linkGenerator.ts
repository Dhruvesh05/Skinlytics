/**
 * Dynamic Link Generator Utility
 * Generates search links for products and ingredients
 */

interface LinkGeneratorOptions {
  brand?: string;
  ingredient?: string;
  type?: 'product' | 'ingredient' | 'skincare';
}

/**
 * Generate a dynamic Google search URL for a product
 * @param productName - Name of the product
 * @param options - Additional options (brand, type, etc.)
 * @returns Google search URL
 */
export function generateProductSearchLink(
  productName: string,
  options?: LinkGeneratorOptions
): string {
  let query = productName;

  // Add brand if available
  if (options?.brand) {
    query = `${options.brand} ${productName}`;
  }

  // Add context keywords based on type
  if (options?.type === 'skincare') {
    query += ' skincare';
  } else if (options?.type === 'product') {
    query += ' product';
  }

  // Encode and return Google search URL
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

/**
 * Generate a dynamic Google search URL for an ingredient
 * @param ingredientName - Name of the ingredient
 * @param skinType - Optional skin type context
 * @returns Google search URL
 */
export function generateIngredientSearchLink(
  ingredientName: string,
  skinType?: string
): string {
  let query = `${ingredientName} skincare`;

  if (skinType) {
    query += ` for ${skinType}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

/**
 * Generate a dynamic Google search URL for product recommendations
 * @param productName - Product name
 * @param concern - Skin concern (e.g., acne, dryness)
 * @param brand - Brand name (optional)
 * @returns Google search URL
 */
export function generateProductRecommendationLink(
  productName: string,
  concern?: string,
  brand?: string
): string {
  let query = productName;

  if (brand) {
    query = `${brand} ${productName}`;
  }

  if (concern) {
    query += ` for ${concern}`;
  }

  query += ' skincare';

  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

/**
 * Generate a dynamic Google search URL for buying a product
 * @param productName - Product name
 * @param brand - Brand name (optional)
 * @returns Google search URL with shopping intent
 */
export function generateProductBuyLink(
  productName: string,
  brand?: string
): string {
  let query = productName;

  if (brand) {
    query = `${brand} ${productName}`;
  }

  query += ' buy online';

  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

/**
 * Curated resources for popular ingredients
 * Falls back to dynamic generation for unknown ingredients
 */
const curatedIngredients: Record<string, string> = {
  'niacinamide': 'https://www.google.com/search?q=niacinamide+skincare+benefits',
  'retinol': 'https://www.google.com/search?q=retinol+skincare+guide',
  'hyaluronic acid': 'https://www.google.com/search?q=hyaluronic+acid+skincare',
  'vitamin c': 'https://www.google.com/search?q=vitamin+c+serum+skincare',
  'salicylic acid': 'https://www.google.com/search?q=salicylic+acid+acne+treatment',
  'benzoyl peroxide': 'https://www.google.com/search?q=benzoyl+peroxide+acne',
  'glycolic acid': 'https://www.google.com/search?q=glycolic+acid+exfoliant',
  'peptides': 'https://www.google.com/search?q=peptides+anti+aging+skincare',
  'ceramides': 'https://www.google.com/search?q=ceramides+moisturizer+skincare',
  'alpha arbutin': 'https://www.google.com/search?q=alpha+arbutin+skin+brightening',
};

/**
 * Get ingredient link with fallback to dynamic generation
 * @param ingredientName - Ingredient name
 * @param skinType - Optional skin type
 * @returns Google search URL (curated if popular, dynamic otherwise)
 */
export function getIngredientLink(
  ingredientName: string,
  skinType?: string
): string {
  const normalizedName = ingredientName.toLowerCase();
  
  // Check if it's a curated ingredient
  if (curatedIngredients[normalizedName]) {
    return curatedIngredients[normalizedName];
  }

  // Fall back to dynamic generation
  return generateIngredientSearchLink(ingredientName, skinType);
}
