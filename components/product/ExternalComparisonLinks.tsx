import Link from "next/link";

export interface ExternalComparison {
  title: string;
  url: string;
  source: string;
}

interface ExternalComparisonLinksProps {
  comparisons: ExternalComparison[];
}

export function ExternalComparisonLinks({
  comparisons,
}: ExternalComparisonLinksProps) {
  if (comparisons.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Head-to-Head Comparisons
      </h2>
      <div className="space-y-3">
        {comparisons.map((comp, i) => (
          <a
            key={i}
            href={comp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border border-purple-100 rounded-xl hover:border-purple-300 hover:bg-purple-50/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xs font-bold">
                A⚡B
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                  {comp.title}
                </p>
                <p className="text-xs text-gray-400">
                  on {comp.source}
                </p>
              </div>
            </div>
            <span className="text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              View &rarr;
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
