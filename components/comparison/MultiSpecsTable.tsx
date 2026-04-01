import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface MultiSpecsTableProps {
  products: Product[];
}

export function MultiSpecsTable({ products }: MultiSpecsTableProps) {
  // Merge all spec labels from all products
  const allLabels = new Map<string, { group: string; values: Map<string, string> }>();

  for (const product of products) {
    for (const spec of product.specs) {
      const existing = allLabels.get(spec.label);
      if (existing) {
        existing.values.set(product.id, spec.value);
      } else {
        const values = new Map<string, string>();
        values.set(product.id, spec.value);
        allLabels.set(spec.label, {
          group: spec.group || "General",
          values,
        });
      }
    }
  }

  // Group specs
  const groups = new Map<string, { label: string; values: Map<string, string> }[]>();
  for (const [label, data] of allLabels) {
    const list = groups.get(data.group) || [];
    list.push({ label, values: data.values });
    groups.set(data.group, list);
  }

  // Determine column template
  const colTemplate = `grid-cols-[minmax(120px,1fr)_${products.map(() => "1fr").join("_")}]`;

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Specs Comparison
      </h2>

      {/* Mobile: horizontal scroll wrapper */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            {/* Header */}
            <div
              className="grid bg-gray-50 border-b border-gray-100"
              style={{ gridTemplateColumns: `minmax(120px, 1fr) ${products.map(() => "1fr").join(" ")}` }}
            >
              <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                Spec
              </div>
              {products.map((product) => (
                <div
                  key={product.id}
                  className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center"
                >
                  <span className="line-clamp-2">{product.name}</span>
                </div>
              ))}
            </div>

            {Array.from(groups.entries()).map(([groupName, specs], gi) => (
              <div key={groupName}>
                {groups.size > 1 && (
                  <div className="px-4 py-2 bg-gray-50/50 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                    {groupName}
                  </div>
                )}
                {specs.map((spec, si) => {
                  // Check if values differ across products
                  const uniqueValues = new Set(products.map((p) => spec.values.get(p.id) || "—"));
                  const isDifferent = uniqueValues.size > 1;

                  return (
                    <div
                      key={spec.label}
                      className={cn(
                        "grid text-sm",
                        isDifferent ? "bg-amber-50/30" : "",
                        si < specs.length - 1 || gi < groups.size - 1
                          ? "border-b border-gray-50"
                          : ""
                      )}
                      style={{ gridTemplateColumns: `minmax(120px, 1fr) ${products.map(() => "1fr").join(" ")}` }}
                    >
                      <div className="px-4 py-3 text-gray-500 flex items-center gap-1.5">
                        {spec.label}
                        {isDifferent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Values differ" />
                        )}
                      </div>
                      {products.map((product) => {
                        const value = spec.values.get(product.id);
                        // Determine if this product has the "best" value for numeric specs
                        return (
                          <div
                            key={product.id}
                            className="px-4 py-3 text-gray-900 font-medium text-center"
                          >
                            {value || "—"}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
