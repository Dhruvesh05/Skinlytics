import products from "../data/products.json";

export interface ProductCatalogItem {
  id: number;
  product_name: string;
  product_type?: string;
  skin_type: string;
  sensitivity: string;
  concern: string;
  ingredients: string;
  price: string;
  image_url: string;
  product_url: string;
  description: string;
  brand: string;
}

export interface RankedProduct extends ProductCatalogItem {
  score: number;
  reason: string;
}

const KNOWN_MULTI_WORD_BRANDS = [
  "The Ordinary",
  "First Aid Beauty",
  "Paula's Choice",
  "La Roche-Posay",
  "The Inkey List",
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function deriveBrand(productName: string): string {
  const trimmedName = productName.trim();

  for (const brand of KNOWN_MULTI_WORD_BRANDS) {
    if (trimmedName.startsWith(brand)) {
      return brand;
    }
  }

  const tokens = trimmedName.split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return "Unknown";
  }

  if (tokens[0] === "The" && tokens.length > 1) {
    return `${tokens[0]} ${tokens[1]}`;
  }

  if (tokens.length > 2 && tokens[0] === "First") {
    return tokens.slice(0, 3).join(" ");
  }

  return tokens[0];
}

export const productCatalog: ProductCatalogItem[] = (
  products as Omit<ProductCatalogItem, "brand">[]
).map((product) => ({
  ...product,
  brand: deriveBrand(product.product_name),
}));

export function extractIngredientKeywords(predictedIngredients: string): string[] {
  return predictedIngredients
    .toLowerCase()
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 3);
}

function getReason(product: ProductCatalogItem): string {
  const ingredients = normalize(product.ingredients);

  if (ingredients.includes("niacinamide")) {
    return "Helps control oil and reduce acne";
  }

  if (ingredients.includes("hyaluronic")) {
    return "Provides deep hydration";
  }

  if (ingredients.includes("vitamin c")) {
    return "Brightens skin and reduces pigmentation";
  }

  return "Matches your skin profile";
}

function getIngredientSignature(ingredients: string): string {
  const tokens = normalize(ingredients)
    .split(" ")
    .filter((token) => token.length > 3);

  return tokens.slice(0, 2).join(" ") || normalize(ingredients);
}

function diversifyProducts(products: RankedProduct[], limit: number): RankedProduct[] {
  const selected: RankedProduct[] = [];
  const usedConcerns = new Set<string>();

  for (const product of products) {
    if (selected.length >= limit) {
      break;
    }

    const normalizedConcern = normalize(product.concern);

    if (normalizedConcern && !usedConcerns.has(normalizedConcern)) {
      selected.push(product);
      usedConcerns.add(normalizedConcern);
    }
  }

  const usedSignatures = new Set(
    selected.map((product) => getIngredientSignature(product.ingredients))
  );

  if (selected.length < limit) {
    for (const product of products) {
      if (selected.length >= limit) {
        break;
      }

      const signature = getIngredientSignature(product.ingredients);
      if (!usedSignatures.has(signature) && !selected.some((item) => item.id === product.id)) {
        selected.push(product);
        usedSignatures.add(signature);
      }
    }
  }

  if (selected.length < limit) {
    for (const product of products) {
      if (selected.length >= limit) {
        break;
      }

      if (!selected.some((item) => item.id === product.id)) {
        selected.push(product);
      }
    }
  }

  return selected;
}

export function getRankedRecommendations(params: {
  predictedIngredients: string;
  skinType?: string;
  sensitivity?: string;
  concern?: string;
  limit?: number;
}): { products: RankedProduct[]; hasStrongMatch: boolean } {
  const {
    predictedIngredients,
    skinType = "",
    sensitivity = "",
    concern = "",
    limit = 4,
  } = params;

  const normalizedSkinType = normalize(skinType);
  const normalizedSensitivity = normalize(sensitivity);
  const normalizedConcern = normalize(concern);
  const keywords = extractIngredientKeywords(predictedIngredients);

  const scoredProducts: RankedProduct[] = productCatalog.map((product) => {
    let score = 0;
    const normalizedIngredients = normalize(product.ingredients);
    const normalizedProductConcern = normalize(product.concern);
    const normalizedProductSkinType = normalize(product.skin_type);
    const normalizedProductSensitivity = normalize(product.sensitivity);

    keywords.forEach((keyword) => {
      if (normalizedIngredients.includes(keyword)) {
        score += 5;
      }
    });

    if (normalizedProductConcern === normalizedConcern) {
      score += 6;
    } else {
      score -= 2;
    }

    if (normalizedProductSkinType === normalizedSkinType) {
      score += 3;
    } else {
      score -= 1;
    }

    if (normalizedProductSensitivity === normalizedSensitivity) {
      score += 2;
    }

    return {
      ...product,
      score,
      reason: getReason(product),
    };
  });

  const filteredProducts = scoredProducts.filter(
    (product) => normalize(product.concern) === normalizedConcern || product.score >= 5
  );

  const sortedProducts = filteredProducts
    .sort((a, b) => b.score - a.score || a.id - b.id)
    .slice(0, 8);

  const selected = diversifyProducts(sortedProducts, limit);

  if (selected.length === 0) {
    const fallback = scoredProducts
      .sort((a, b) => b.score - a.score || a.id - b.id)
      .slice(0, 8);

    return {
      products: diversifyProducts(fallback, limit),
      hasStrongMatch: false,
    };
  }

  return {
    products: selected,
    hasStrongMatch: selected.some((product) => product.score >= 7),
  };
}

function getProductInitials(productName: string): string {
  return productName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function getGradientSeed(value: string): number {
  return value.split("").reduce((seed, char) => seed + char.charCodeAt(0), 0);
}

export function buildProductImageDataUri(productName: string, brand: string): string {
  const initials = getProductInitials(productName) || "SK";
  const seed = getGradientSeed(`${productName}-${brand}`);
  const hueOne = seed % 360;
  const hueTwo = (seed + 48) % 360;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img" aria-label="${productName}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="hsl(${hueOne} 60% 22%)" />
          <stop offset="100%" stop-color="hsl(${hueTwo} 70% 38%)" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" rx="72" fill="url(#g)" />
      <circle cx="560" cy="180" r="160" fill="rgba(255,255,255,0.08)" />
      <circle cx="220" cy="590" r="210" fill="rgba(255,255,255,0.06)" />
      <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Manrope, Arial, sans-serif" font-size="180" font-weight="700" letter-spacing="4">${initials}</text>
      <text x="50%" y="70%" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.78)" font-family="Manrope, Arial, sans-serif" font-size="44" font-weight="500">Skinlytix Picks</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
