"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { products } from "@/data/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { MultiScoreComparison } from "@/components/comparison/MultiScoreComparison";
import { MultiSpecsTable } from "@/components/comparison/MultiSpecsTable";
import { MultiProsConsComparison } from "@/components/comparison/MultiProsConsComparison";

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") || "";
  const ids = idsParam.split(",").filter(Boolean);

  const compareProducts = ids
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  if (compareProducts.length < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No products to compare</h1>
        <p className="text-gray-500 mb-6">
          Select at least 2 products from the product listing to start comparing.
        </p>
        <a
          href="/products"
          className="inline-flex items-center px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
        >
          Browse Products
        </a>
      </div>
    );
  }

  const title = compareProducts.map((p) => p.name).join(" vs ");
  const totalReviews = compareProducts.reduce((sum, p) => sum + p.reviewCount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "Products", url: "/products" },
          { name: "Compare", url: `/compare?ids=${idsParam}` },
        ]}
      />

      {/* Header */}
      <div className="text-center mb-8 mt-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        <p className="text-gray-500 text-sm">
          Side-by-side comparison based on {totalReviews.toLocaleString()} verified buyer reviews
        </p>
        <div className="mt-4 flex justify-center">
          <ShareButtons
            url={`/compare?ids=${idsParam}`}
            title={`${title} — Side-by-Side Comparison`}
            description={`Compare ${compareProducts.length} products side-by-side based on ${totalReviews} verified reviews.`}
          />
        </div>
      </div>

      <div className="space-y-8">
        <MultiScoreComparison products={compareProducts} />
        <MultiSpecsTable products={compareProducts} />
        <MultiProsConsComparison products={compareProducts} />
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareLoadingSkeleton />}>
      <CompareContent />
    </Suspense>
  );
}

function CompareLoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 animate-pulse">
      <div className="h-8 bg-gray-100 rounded-lg w-96 mx-auto mb-4" />
      <div className="h-4 bg-gray-100 rounded w-64 mx-auto mb-8" />
      <div className="h-64 bg-gray-100 rounded-2xl mb-8" />
      <div className="h-96 bg-gray-100 rounded-2xl" />
    </div>
  );
}
