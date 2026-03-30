import type { Metadata } from "next";
import { CookiePolicyContent } from "./CookiePolicyContent";

export const metadata: Metadata = {
  title: "Cookie Policy — SmartReview",
  description: "Learn how SmartReview uses cookies and similar tracking technologies.",
};

export default function CookiePolicyPage() {
  return <CookiePolicyContent />;
}
