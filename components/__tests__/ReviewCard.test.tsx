import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReviewCard } from "@/components/product/ReviewCard";
import type { Review } from "@/types";

// --- Mocks ---

vi.mock("@/components/ui/RatingStars", () => ({
  RatingStars: ({ rating }: { rating: number }) => (
    <div data-testid="rating-stars">{rating}</div>
  ),
}));

vi.mock("@/components/ui/VerificationBadge", () => ({
  VerificationBadge: ({ tier }: { tier: string }) => (
    <div data-testid="verification-badge">{tier}</div>
  ),
}));

// --- Fixtures ---

function makeReview(overrides: Partial<Review> = {}): Review {
  return {
    id: "rev-1",
    productId: "prod-1",
    headline: "Best headphones I have ever owned",
    rating: 5,
    verifiedPurchase: true,
    verificationTier: "receipt_upload",
    timeOwned: "6 months",
    experienceLevel: "expert",
    pros: ["Incredible sound quality", "Comfortable for long sessions"],
    cons: ["Expensive", "No wired mode without battery"],
    reliabilityRating: 5,
    easeOfUseRating: 4,
    valueRating: 3,
    body: "These headphones changed my daily commute entirely.",
    aiTopics: ["sound quality", "comfort", "battery life"],
    authorName: "Alex Johnson",
    createdAt: "2026-02-10",
    helpfulCount: 42,
    ...overrides,
  };
}

// --- Tests ---

describe("ReviewCard", () => {
  it("renders the headline", () => {
    render(<ReviewCard review={makeReview()} />);

    expect(
      screen.getByText("Best headphones I have ever owned")
    ).toBeInTheDocument();
  });

  it("displays the author name and ownership duration", () => {
    render(<ReviewCard review={makeReview()} />);

    expect(screen.getByText("By Alex Johnson")).toBeInTheDocument();
    expect(screen.getByText("Owned 6 months")).toBeInTheDocument();
  });

  it("renders the review body", () => {
    render(<ReviewCard review={makeReview()} />);

    expect(
      screen.getByText("These headphones changed my daily commute entirely.")
    ).toBeInTheDocument();
  });

  it("lists pros and cons", () => {
    render(<ReviewCard review={makeReview()} />);

    expect(screen.getByText("Incredible sound quality")).toBeInTheDocument();
    expect(screen.getByText("Comfortable for long sessions")).toBeInTheDocument();
    expect(screen.getByText("Expensive")).toBeInTheDocument();
    expect(
      screen.getByText("No wired mode without battery")
    ).toBeInTheDocument();
  });

  it("shows sub-ratings for reliability, ease of use, and value", () => {
    render(<ReviewCard review={makeReview()} />);

    expect(screen.getByText("Reliability: 5/5")).toBeInTheDocument();
    expect(screen.getByText("Ease of Use: 4/5")).toBeInTheDocument();
    expect(screen.getByText("Value: 3/5")).toBeInTheDocument();
  });

  it("displays helpful count", () => {
    render(<ReviewCard review={makeReview()} />);

    expect(screen.getByText("42 found helpful")).toBeInTheDocument();
  });

  it("renders aiTopics as tags", () => {
    render(<ReviewCard review={makeReview()} />);

    expect(screen.getByText("sound quality")).toBeInTheDocument();
    expect(screen.getByText("comfort")).toBeInTheDocument();
    expect(screen.getByText("battery life")).toBeInTheDocument();
  });
});
