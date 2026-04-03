import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Redis } from "@upstash/redis";

export async function GET() {
  const checks: Record<string, { status: string; latencyMs?: number }> = {};
  let overallStatus = "ok";

  // Check PostgreSQL
  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: "ok", latencyMs: Date.now() - dbStart };
  } catch {
    checks.database = { status: "error", latencyMs: Date.now() - dbStart };
    overallStatus = "degraded";
  }

  // Check Redis
  const redisStart = Date.now();
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const redis = new Redis({ url: redisUrl, token: redisToken });
      await redis.ping();
      checks.redis = { status: "ok", latencyMs: Date.now() - redisStart };
    } catch {
      checks.redis = { status: "error", latencyMs: Date.now() - redisStart };
      overallStatus = "degraded";
    }
  } else {
    checks.redis = { status: "not_configured" };
  }

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: "0.1.0",
      checks,
    },
    { status: overallStatus === "ok" ? 200 : 503 }
  );
}
