import type { Metadata } from "next";
import { AcceptableUseContent } from "./AcceptableUseContent";

export const metadata: Metadata = {
  title: "Acceptable Use Policy — SmartReview",
  description: "Read the SmartReview Acceptable Use Policy. Understand the rules for using our platform responsibly.",
};

export default function AcceptableUsePage() {
  return <AcceptableUseContent />;
}
