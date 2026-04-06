import { NextResponse } from "next/server";
import { okrConfig } from "@/lib/data/okr-config";

/**
 * OKR Dashboard API
 *
 * GET /api/analytics/okr — returns company OKR, team OKRs, and health metrics
 */
export async function GET() {
  return NextResponse.json(okrConfig);
}
