import type { Product } from "@/types";

interface ProsConsComparisonProps {
  productA: Product;
  productB: Product;
}

export function ProsConsComparison({
  productA,
  productB,
}: ProsConsComparisonProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        What People Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductProsConsCard product={productA} />
        <ProductProsConsCard product={productB} />
      </div>
    </section>
  );
}

function ProductProsConsCard({ product }: { product: Product }) {
  return (
    <div className="border border-gray-100 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        {product.name}
      </h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
            What People Love
          </h4>
          <ul className="space-y-1.5">
            {product.aiSummary.whatPeopleLove.slice(0, 4).map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="text-emerald-500 mt-0.5 shrink-0">
                  &#10003;
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
            What People Hate
          </h4>
          <ul className="space-y-1.5">
            {product.aiSummary.whatPeopleHate.slice(0, 3).map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="text-red-400 mt-0.5 shrink-0">&#10007;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
