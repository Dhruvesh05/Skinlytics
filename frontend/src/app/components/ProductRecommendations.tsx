import { motion } from "motion/react";
import {
    buildProductImageDataUri,
    getRankedRecommendations,
    type RankedProduct,
} from "../../utils/productCatalog";

interface ProductRecommendationsProps {
  ingredient?: string;
  concern?: string;
  skinType?: string;
  sensitivity?: string;
}

function formatPrice(price: string): string {
  return price.trim();
}

function isProductCatalogItem(product: RankedProduct): product is RankedProduct {
  return Boolean(product.product_name && product.brand);
}

export function ProductRecommendations({ ingredient, concern, skinType, sensitivity }: ProductRecommendationsProps) {
  const { products: rankedProducts, hasStrongMatch } = getRankedRecommendations({
    predictedIngredients: ingredient || "",
    skinType,
    sensitivity,
    concern,
    limit: 4,
  });

  const products = rankedProducts.filter(isProductCatalogItem);
  const showBestPossibleMessage = products.length > 0 && !hasStrongMatch;

  const renderProductCard = (product: RankedProduct, index: number) => {
    const productUrl = product.product_url?.trim();
    const hasProductUrl = Boolean(productUrl && productUrl !== "#");

    const cardContent = (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -6 }}
        className={`group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl transition-all duration-300 ease-in-out ${
          hasProductUrl
            ? "cursor-pointer hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
            : "cursor-not-allowed"
        }`}
      >
        <div className="relative aspect-square overflow-hidden bg-slate-900/40">
          <img
            src={product.image_url || buildProductImageDataUri(product.product_name, product.brand)}
            alt={product.product_name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        </div>
        <div className="p-6">
          <p className="mb-1 text-sm text-gray-400">{product.brand}</p>
          <h3 className="mb-3 text-lg font-medium text-white">{product.product_name}</h3>
          <p className="mb-3 text-sm leading-relaxed text-gray-300">{product.reason}</p>
          {formatPrice(product.price) && (
            <p className="font-semibold text-emerald-300">{formatPrice(product.price)}</p>
          )}
          {!hasProductUrl && (
            <p className="mt-3 text-xs uppercase tracking-widest text-gray-500">
              Link unavailable
            </p>
          )}
        </div>
      </motion.div>
    );

    if (!hasProductUrl) {
      return cardContent;
    }

    return (
      <a
        key={product.id}
        href={productUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label={`Open ${product.product_name} in a new tab`}
      >
        {cardContent}
      </a>
    );
  };
  
  return (
    <section className="px-6 py-20 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl"
      >
        <h2 className="mb-4 text-center text-4xl font-bold tracking-tight text-white md:text-6xl">
          Curated Products
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-400">
          Premium formulations featuring your recommended ingredient
        </p>

        {showBestPossibleMessage && (
          <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-amber-300/20 bg-amber-400/10 px-5 py-4 text-center text-sm text-amber-100 backdrop-blur-xl">
            Showing best possible matches
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-4">
          {products.map((product, index) => renderProductCard(product, index))}
        </div>
      </motion.div>
    </section>
  );
}
