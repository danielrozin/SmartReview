import { products, getAllProducts } from "@/data/products";
import type { Product } from "@/types";

export interface ComparisonPair {
  slug: string; // e.g. "roborock-s8-maxv-ultra-vs-irobot-roomba-j7-plus"
  productA: Product;
  productB: Product;
  searchVolume: number;
}

function makeComparisonSlug(slugA: string, slugB: string): string {
  return [slugA, slugB].sort().join("-vs-");
}

export function getAllComparisonPairs(): ComparisonPair[] {
  const seen = new Set<string>();
  const pairs: ComparisonPair[] = [];

  for (const product of products) {
    for (const comp of product.comparisons) {
      const slug = makeComparisonSlug(product.slug, comp.productSlug);
      if (seen.has(slug)) continue;
      seen.add(slug);

      const other = products.find((p) => p.slug === comp.productSlug);
      if (!other) continue;

      // Ensure consistent A/B ordering (alphabetical by slug)
      const [productA, productB] =
        product.slug < other.slug ? [product, other] : [other, product];

      pairs.push({
        slug,
        productA,
        productB,
        searchVolume: comp.searchVolume ?? 0,
      });
    }
  }

  return pairs.sort((a, b) => b.searchVolume - a.searchVolume);
}

export function getComparisonBySlug(slug: string): ComparisonPair | undefined {
  return getAllComparisonPairs().find((pair) => pair.slug === slug);
}

export function getComparisonSlugForProducts(
  slugA: string,
  slugB: string
): string {
  return makeComparisonSlug(slugA, slugB);
}

export function generateVerdict(a: Product, b: Product): string {
  const diff = a.smartScore - b.smartScore;
  if (Math.abs(diff) <= 3) {
    return `The ${a.name} and ${b.name} are extremely close in overall quality. Your choice should come down to which features matter most to you and your specific use case.`;
  }
  const winner = diff > 0 ? a : b;
  const loser = diff > 0 ? b : a;
  if (Math.abs(diff) <= 8) {
    return `The ${winner.name} edges out the ${loser.name} with a SmartScore of ${winner.smartScore} vs ${loser.smartScore}. While both are solid choices, the ${winner.name} offers a slightly better overall experience based on verified buyer feedback.`;
  }
  return `The ${winner.name} is the clear winner with a SmartScore of ${winner.smartScore} compared to ${loser.smartScore} for the ${loser.name}. Based on hundreds of verified reviews, the ${winner.name} consistently delivers a superior experience.`;
}
