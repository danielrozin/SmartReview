import { NextRequest, NextResponse } from "next/server";
import { dataForSeoRequest } from "@/lib/dataforseo/client";
import { categories } from "@/data/categories";

export const maxDuration = 300;

interface DataForSEOResponse {
  tasks: Array<{
    result: Array<{
      items: Array<Record<string, unknown>>;
    }>;
  }>;
}

interface TrendOpportunity {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  category: string;
  type: "review" | "comparison" | "buyer_guide" | "complaint";
  opportunityScore: number;
}

// Seed keywords per category for review-oriented discovery
const CATEGORY_SEEDS: Record<string, string[]> = {
  "robot-vacuums": ["best robot vacuum", "robot vacuum review", "roomba vs roborock", "robot vacuum problems"],
  "coffee-machines": ["best coffee machine", "espresso machine review", "nespresso vs keurig", "coffee maker worth it"],
  "air-fryers": ["best air fryer", "air fryer review", "ninja vs cosori air fryer", "air fryer problems"],
  "wireless-earbuds": ["best wireless earbuds", "earbuds review", "airpods vs galaxy buds", "earbuds worth it"],
  "mattresses": ["best mattress", "mattress review", "purple vs casper mattress", "mattress problems"],
};

function scoreOpportunity(volume: number, cpc: number, competition: number, difficulty: number): number {
  return (
    Math.log10(Math.max(volume, 1)) * 20 +
    (100 - difficulty) * 0.6 +
    Math.min(cpc * 5, 25) +
    (1 - competition) * 15
  );
}

function classifyKeyword(keyword: string): TrendOpportunity["type"] {
  const kw = keyword.toLowerCase();
  if (/\bvs\b|versus|compared?\s+to|difference between/.test(kw)) return "comparison";
  if (/problem|issue|complaint|defect|broken|bad/.test(kw)) return "complaint";
  if (/guide|how to choose|what to look|before buying/.test(kw)) return "buyer_guide";
  return "review";
}

/**
 * GET /api/cron/discover-trends
 *
 * Daily cron: uses DataForSEO to discover trending product review keywords
 * across all SmartReview categories. Returns scored opportunities.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const allOpportunities: TrendOpportunity[] = [];
  const errors: string[] = [];

  for (const cat of categories) {
    const seeds = CATEGORY_SEEDS[cat.slug];
    if (!seeds) continue;

    try {
      const data = await dataForSeoRequest<DataForSEOResponse>(
        "/dataforseo_labs/google/keyword_suggestions/live",
        [
          {
            keyword: seeds[0],
            location_code: 2840,
            language_code: "en",
            limit: 50,
            filters: [["keyword_info.search_volume", ">", 100]],
            order_by: ["keyword_info.search_volume,desc"],
          },
        ]
      );

      const items = data.tasks?.[0]?.result?.[0]?.items || [];
      for (const item of items) {
        const keyword = (item.keyword as string) || "";
        const kwInfo = item.keyword_info as Record<string, unknown> | undefined;
        const volume = (kwInfo?.search_volume as number) || 0;
        const cpc = (kwInfo?.cpc as number) || 0;
        const competition = (kwInfo?.competition as number) || 0;
        const kwProps = item.keyword_properties as Record<string, unknown> | undefined;
        const difficulty = (kwProps?.keyword_difficulty as number) || 50;

        if (volume < 100 || difficulty > 80) continue;

        allOpportunities.push({
          keyword,
          searchVolume: volume,
          cpc,
          competition,
          category: cat.slug,
          type: classifyKeyword(keyword),
          opportunityScore: Math.round(scoreOpportunity(volume, cpc, competition, difficulty) * 100) / 100,
        });
      }
    } catch (err) {
      errors.push(`${cat.slug}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Sort by score descending
  allOpportunities.sort((a, b) => b.opportunityScore - a.opportunityScore);

  return NextResponse.json({
    success: true,
    totalOpportunities: allOpportunities.length,
    byType: {
      review: allOpportunities.filter((o) => o.type === "review").length,
      comparison: allOpportunities.filter((o) => o.type === "comparison").length,
      buyer_guide: allOpportunities.filter((o) => o.type === "buyer_guide").length,
      complaint: allOpportunities.filter((o) => o.type === "complaint").length,
    },
    topOpportunities: allOpportunities.slice(0, 50),
    errors: errors.length > 0 ? errors : undefined,
    durationMs: Date.now() - startTime,
  });
}
