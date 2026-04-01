import type { Product } from "@/types";

interface BestForComparisonProps {
  productA: Product;
  productB: Product;
}

export function BestForComparison({
  productA,
  productB,
}: BestForComparisonProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Who Should Buy What?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BestForCard product={productA} />
        <BestForCard product={productB} />
      </div>
    </section>
  );
}

function BestForCard({ product }: { product: Product }) {
  return (
    <div className="border border-gray-100 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        {product.name}
      </h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-2">
            Best For
          </h4>
          <ul className="space-y-1.5">
            {product.aiSummary.bestFor.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="text-brand-500 mt-0.5 shrink-0">&#8594;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
            Not For
          </h4>
          <ul className="space-y-1.5">
            {product.aiSummary.notFor.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="text-amber-500 mt-0.5 shrink-0">&#9888;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
