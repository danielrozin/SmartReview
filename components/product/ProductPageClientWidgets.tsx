"use client";

// Below-fold / tracking-only widgets for category and product pages.
// Wrapping them here lets us use `ssr: false` (forbidden in server components),
// keeping their HTML out of the initial SSR response and the streamed RSC payload.
// Mirrors the pattern from src/components/comparison/ComparisonClientWidgets.tsx
// in the aversusb codebase (DAN-410). Only widgets without SEO content live here.

import dynamic from "next/dynamic";

export const TrackProductView = dynamic(
  () =>
    import("@/components/tracking/TrackProductView").then((m) => ({
      default: m.TrackProductView,
    })),
  { ssr: false, loading: () => null },
);

export const TrackCategoryView = dynamic(
  () =>
    import("@/components/tracking/TrackCategoryView").then((m) => ({
      default: m.TrackCategoryView,
    })),
  { ssr: false, loading: () => null },
);

export const YouTubeVideos = dynamic(
  () =>
    import("@/components/product/YouTubeVideos").then((m) => ({
      default: m.YouTubeVideos,
    })),
  // Below the Key Facts / Rating Distribution / Recurring Issues / Reviews
  // sections, so well past the LCP fold — no placeholder needed.
  { ssr: false, loading: () => null },
);

export const ReviewFormCTA = dynamic(
  () =>
    import("@/components/product/ReviewFormCTA").then((m) => ({
      default: m.ReviewFormCTA,
    })),
  // ReviewFormCTA returns null in the control A/B variant. Deferring keeps
  // the experiment hook out of the initial RSC tree entirely on control.
  { ssr: false, loading: () => null },
);
