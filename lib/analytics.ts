declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined" || !window.gtag || !GA_MEASUREMENT_ID) {
    return;
  }
  window.gtag("event", eventName, params);
}

export function trackReviewSubmission(product: string, rating: number) {
  trackEvent("review_submission", { product, rating });
}

export function trackAffiliateClick(
  product: string,
  position: number,
  page: string
) {
  trackEvent("affiliate_click", { product, position, page });
}

export function trackShareClick(platform: string, page: string) {
  trackEvent("share_click", { platform, page });
}

export function trackRelatedComparisonClick(
  source_page: string,
  target_page: string
) {
  trackEvent("related_comparison_click", { source_page, target_page });
}
