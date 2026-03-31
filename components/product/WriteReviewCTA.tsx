import Link from "next/link";

interface WriteReviewCTAProps {
  productName: string;
  productSlug: string;
}

export function WriteReviewCTA({ productName, productSlug }: WriteReviewCTAProps) {
  return (
    <section className="bg-brand-50 rounded-2xl p-6 sm:p-8 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Own {productName}? Share your experience
      </h3>
      <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
        Help other buyers make informed decisions. Your honest review matters.
      </p>
      <Link
        href={`/write-review?product=${encodeURIComponent(productSlug)}`}
        className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
      >
        Write a Review
      </Link>
    </section>
  );
}
