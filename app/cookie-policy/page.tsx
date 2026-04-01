import type { Metadata } from "next";
import { CookiePolicyContent } from "./CookiePolicyContent";

export const metadata: Metadata = {
  title: "Cookie Policy — ReviewIQ",
  description: "Learn how ReviewIQ uses cookies and similar tracking technologies.",
};

export default function CookiePolicyPage() {
  return <CookiePolicyContent />;
}
