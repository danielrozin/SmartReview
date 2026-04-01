import type { Product, ProductSpec } from "@/types";
import { cn } from "@/lib/utils";

interface SpecsComparisonTableProps {
  productA: Product;
  productB: Product;
}

export function SpecsComparisonTable({
  productA,
  productB,
}: SpecsComparisonTableProps) {
  // Merge spec labels from both products
  const allLabels = new Map<string, { group: string; a?: string; b?: string }>();

  for (const spec of productA.specs) {
    allLabels.set(spec.label, {
      group: spec.group || "General",
      a: spec.value,
    });
  }
  for (const spec of productB.specs) {
    const existing = allLabels.get(spec.label);
    if (existing) {
      existing.b = spec.value;
    } else {
      allLabels.set(spec.label, {
        group: spec.group || "General",
        b: spec.value,
      });
    }
  }

  // Group specs
  const groups = new Map<string, { label: string; a?: string; b?: string }[]>();
  for (const [label, data] of allLabels) {
    const list = groups.get(data.group) || [];
    list.push({ label, a: data.a, b: data.b });
    groups.set(data.group, list);
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Specs Comparison
      </h2>
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_1fr_1fr] bg-gray-50 border-b border-gray-100">
          <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
            Spec
          </div>
          <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">
            {productA.name}
          </div>
          <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">
            {productB.name}
          </div>
        </div>

        {Array.from(groups.entries()).map(([groupName, specs], gi) => (
          <div key={groupName}>
            {groups.size > 1 && (
              <div className="px-4 py-2 bg-gray-50/50 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                {groupName}
              </div>
            )}
            {specs.map((spec, si) => (
              <div
                key={spec.label}
                className={cn(
                  "grid grid-cols-[1fr_1fr_1fr] text-sm",
                  si < specs.length - 1 || gi < groups.size - 1
                    ? "border-b border-gray-50"
                    : ""
                )}
              >
                <div className="px-4 py-3 text-gray-500">{spec.label}</div>
                <div className="px-4 py-3 text-gray-900 font-medium text-center">
                  {spec.a || "—"}
                </div>
                <div className="px-4 py-3 text-gray-900 font-medium text-center">
                  {spec.b || "—"}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
