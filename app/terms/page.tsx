import type { Metadata } from "next";
import { TermsContent } from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms of Service — ReviewIQ",
  description: "Read the ReviewIQ Terms of Service. Understand your rights and responsibilities as a user.",
};

export default function TermsPage() {
  return <TermsContent />;
}
