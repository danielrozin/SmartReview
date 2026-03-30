/**
 * Centralized analytics & conversion tracking utility.
 * Supports GA4, Google Ads conversions, and Meta Pixel events.
 *
 * Usage:
 *   import { trackEvent, trackConversion } from "@/lib/tracking/analytics";
 *   trackEvent("review_submitted", { product_slug: "iphone-15" });
 *   trackConversion("google_ads", "CONVERSION_LABEL");
 */

// -- Types --

type GAEventParams = Record<string, string | number | boolean | undefined>;

interface ConversionOptions {
  value?: number;
  currency?: string;
  transactionId?: string;
}

// -- Helpers --

function getDataLayer(): unknown[] | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as Record<string, unknown>;
  if (!w.dataLayer) w.dataLayer = [];
  return w.dataLayer as unknown[];
}

function gtag(...args: unknown[]) {
  const dl = getDataLayer();
  if (dl) dl.push(args);
}

function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const f = (window as unknown as Record<string, unknown>).fbq as ((...a: unknown[]) => void) | undefined;
  if (f) f(...args);
}

// -- Public API --

/** Push a custom event to GA4 via dataLayer */
export function trackEvent(eventName: string, params?: GAEventParams) {
  gtag("event", eventName, params);
}

/** Track a Google Ads conversion or Meta Pixel event */
export function trackConversion(
  platform: "google_ads" | "meta",
  label: string,
  options?: ConversionOptions,
) {
  if (platform === "google_ads") {
    gtag("event", "conversion", {
      send_to: label, // format: AW-XXXXXXX/YYYYYYY
      value: options?.value,
      currency: options?.currency || "USD",
      transaction_id: options?.transactionId,
    });
  } else if (platform === "meta") {
    fbq("track", label, {
      value: options?.value,
      currency: options?.currency || "USD",
    });
  }
}

// -- Pre-built events for SmartReview --

export function trackReviewSubmitted(productSlug: string, rating: number) {
  trackEvent("review_submitted", { product_slug: productSlug, rating });
  // Also push as generate_lead for GA4 recommended conversion event
  trackEvent("generate_lead", { value: 1, currency: "USD", event_label: `review_${productSlug}` });
  fbq("trackCustom", "ReviewSubmitted", { product_slug: productSlug, rating });
}

export function trackVoteCast(targetType: string, voteType: string) {
  trackEvent("vote_cast", { target_type: targetType, vote_type: voteType });
}

export function trackDiscussionCreated(threadType: string) {
  trackEvent("discussion_created", { thread_type: threadType });
}

export function trackProductViewed(productSlug: string, category: string) {
  trackEvent("product_viewed", { product_slug: productSlug, category });
  fbq("track", "ViewContent", {
    content_ids: [productSlug],
    content_type: "product",
    content_category: category,
  });
}

export function trackSearch(query: string, resultsCount: number) {
  trackEvent("search", { search_term: query, results_count: resultsCount });
  fbq("track", "Search", { search_string: query });
}

export function trackNewsletterSignup(source: string) {
  trackEvent("newsletter_signup", { source });
  // GA4 recommended event for lead capture
  trackEvent("generate_lead", { value: 0.5, currency: "USD", event_label: `newsletter_${source}` });
  fbq("track", "Lead", { content_name: "newsletter", source });
}

export function trackContactFormSubmitted() {
  trackEvent("contact_form_submitted");
  // GA4 recommended event for contact conversion
  trackEvent("generate_lead", { value: 1, currency: "USD", event_label: "contact_form" });
  fbq("track", "Contact");
}

export function trackPageEngagement(pagePath: string, timeOnPageSec: number) {
  trackEvent("page_engagement", { page_path: pagePath, time_on_page_sec: timeOnPageSec });
}

// -- Conversion funnel events --

export function trackCategoryViewed(categorySlug: string, productCount: number) {
  trackEvent("category_viewed", { category_slug: categorySlug, product_count: productCount });
}

export function trackSearchResultClicked(query: string, resultType: string, resultName: string, position: number) {
  trackEvent("search_result_clicked", { search_term: query, result_type: resultType, result_name: resultName, position });
}

export function trackWriteReviewStep(step: number, stepName: string) {
  trackEvent("write_review_step", { step, step_name: stepName });
}

export function trackCtaClicked(ctaName: string, page: string) {
  trackEvent("cta_clicked", { cta_name: ctaName, page });
}

// -- New feature tracking events --

export function trackEmailCaptureShown(source: string, page: string) {
  trackEvent("email_capture_shown", { source, page });
}

export function trackEmailCaptureSubmit(source: string, page: string) {
  trackEvent("email_capture_submit", { source, page });
  trackEvent("generate_lead", { value: 0.5, currency: "USD", event_label: `email_capture_${source}` });
  fbq("track", "Lead", { content_name: "email_capture", source });
}

export function trackReviewAuthGateShown(productSlug: string, triggerAction: string) {
  trackEvent("review_auth_gate_shown", { product_slug: productSlug, trigger_action: triggerAction });
}

export function trackReviewAuthSignup(productSlug: string, method: string) {
  trackEvent("review_auth_signup", { product_slug: productSlug, method });
  trackEvent("sign_up", { method });
  fbq("track", "CompleteRegistration", { content_name: "review_auth", method });
}

export function trackQuickAnswerView(productSlug: string, questionId: string) {
  trackEvent("quick_answer_view", { product_slug: productSlug, question_id: questionId });
}

export function trackQuickAnswerExpand(productSlug: string, questionId: string) {
  trackEvent("quick_answer_expand", { product_slug: productSlug, question_id: questionId });
}
