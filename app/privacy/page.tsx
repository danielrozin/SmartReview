import type { Metadata } from "next";
import { PrivacyContent } from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy — ReviewIQ",
  description: "Read the ReviewIQ Privacy Policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
