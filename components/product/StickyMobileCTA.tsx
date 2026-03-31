import Link from "next/link";

interface StickyMobileCTAProps {
  productName: string;
  productSlug: string;
}

export function StickyMobileCTA({ productName, productSlug }: StickyMobileCTAProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-gray-200 px-4 py-3 safe-area-bottom">
      <Link
        href={`/write-review?product=${encodeURIComponent(productSlug)}`}
        className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors touch-manipulation"
        aria-label={`Write a review for ${productName}`}
      >
        Write a Review for {productName}
      </Link>
    </div>
  );
}
