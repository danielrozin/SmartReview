"use client";

import { useEffect } from "react";
import { trackProductViewed } from "@/lib/tracking/analytics";

export function TrackProductView({ slug, category }: { slug: string; category: string }) {
  useEffect(() => {
    trackProductViewed(slug, category);
  }, [slug, category]);

  return null;
}
