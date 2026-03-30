import type { Metadata } from "next";
import { PrivacyContent } from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy — SmartReview",
  description: "Read the SmartReview Privacy Policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
