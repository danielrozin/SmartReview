import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MultiProsConsComparisonProps {
  products: Product[];
}

export function MultiProsConsComparison({ products }: MultiProsConsComparisonProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        What People Love & Hate
      </h2>

      <div className={cn(
        "grid gap-4",
        products.length === 2 ? "grid-cols-1 md:grid-cols-2" :
        products.length === 3 ? "grid-cols-1 md:grid-cols-3" :
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      )}>
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-100 rounded-xl overflow-hidden"
          >
            {/* Product header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
              <Link
                href={`/category/${product.categorySlug}/${product.slug}`}
                className="text-sm font-semibold text-gray-900 hover:text-brand-600 transition-colors"
              >
                {product.name}
              </Link>
              <p className="text-xs text-gray-400 mt-0.5">
                SmartScore: {product.smartScore}
              </p>
            </div>

            {/* Pros */}
            <div className="p-4">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">
                What People Love
              </p>
              <ul className="space-y-2">
                {product.aiSummary.whatPeopleLove.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                    <span className="line-clamp-2">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="p-4 pt-0">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">
                What People Hate
              </p>
              <ul className="space-y-2">
                {product.aiSummary.whatPeopleHate.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-400 mt-0.5 shrink-0">-</span>
                    <span className="line-clamp-2">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Best For */}
            <div className="px-4 pb-4">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
                Best For
              </p>
              <div className="flex flex-wrap gap-1">
                {product.aiSummary.bestFor.slice(0, 3).map((item, i) => (
                  <span
                    key={i}
                    className="inline-block px-2 py-0.5 text-xs bg-brand-50 text-brand-700 rounded-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
