import type { Product } from "@/types";

interface PriceComparisonProps {
  productA: Product;
  productB: Product;
}

export function PriceComparison({
  productA,
  productB,
}: PriceComparisonProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Price Comparison
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PriceCard product={productA} />
        <PriceCard product={productB} />
      </div>
    </section>
  );
}

function PriceCard({ product }: { product: Product }) {
  const { min, max, currency } = product.priceRange;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  return (
    <div className="border border-gray-100 rounded-xl p-5 text-center">
      <p className="text-sm font-semibold text-gray-900 mb-2">
        {product.name}
      </p>
      <p className="text-2xl font-bold text-gray-900">
        {formatter.format(min)}
        {max !== min && (
          <span className="text-gray-400"> – {formatter.format(max)}</span>
        )}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Verified purchase rate: {product.verifiedPurchaseRate}%
      </p>
    </div>
  );
}
