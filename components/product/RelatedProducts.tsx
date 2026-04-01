import Link from "next/link";
import { SmartScore } from "@/components/ui/SmartScore";

interface RelatedProduct {
  name: string;
  slug: string;
  brand: string;
  smartScore: number;
  reviewCount: number;
  priceMin: number;
  priceMax: number;
  categorySlug: string;
  categoryName: string;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  categorySlug: string;
  categoryName: string;
}

export function RelatedProducts({
  products,
  categorySlug,
  categoryName,
}: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Related {categoryName} Products
      </h2>

      {/* ItemList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Related ${categoryName} Products`,
            numberOfItems: products.length,
            itemListElement: products.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: product.name,
              url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://smartreview.com"}/category/${product.categorySlug}/${product.slug}`,
            })),
          }),
        }}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/category/${categorySlug}/${product.slug}`}
            title={`${product.name} review — SmartScore ${product.smartScore}/100`}
            className="group flex flex-col border border-gray-100 rounded-xl overflow-hidden hover:border-brand-200 hover:shadow-md transition-all"
          >
            {/* Product Thumbnail Placeholder */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center overflow-hidden p-4">
              <span className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-lg font-bold mb-2">
                {product.brand.charAt(0)}
              </span>
              <span className="text-xs text-gray-400 text-center line-clamp-2 px-2">
                {product.name}
              </span>
            </div>

            {/* Product Info */}
            <div className="p-3 flex flex-col gap-1.5 flex-1">
              <div className="flex items-center gap-2">
                <SmartScore score={product.smartScore} size="sm" />
                <span className="text-xs text-gray-400">{product.categoryName}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                {product.name}
              </p>
              <p className="text-xs text-gray-500">
                {product.brand}
              </p>
              <p className="text-xs text-gray-400 mt-auto">
                {product.reviewCount.toLocaleString()} reviews &middot; ${product.priceMin}&ndash;${product.priceMax}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href={`/category/${categorySlug}`}
        className="inline-block mt-5 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
      >
        View all {categoryName} products &rarr;
      </Link>
    </section>
  );
}
