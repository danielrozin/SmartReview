import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

/**
 * Analytics Dashboard API for ReviewIQ
 *
 * GET /api/analytics — full config + live DB metrics
 * GET /api/analytics?section=funnel|kpis|events|live|report
 */

const GA4_PROPERTY = process.env.NEXT_PUBLIC_GA_ID || "G-9ZZV60ESL3";
const CLARITY_PROJECT = process.env.NEXT_PUBLIC_CLARITY_ID || "w3w5leh6ae";

const CUSTOM_EVENTS = [
  { name: "category_viewed", category: "discovery", description: "User views a category page", params: ["category_slug", "product_count"] },
  { name: "search_result_clicked", category: "discovery", description: "User clicks a search result", params: ["search_term", "result_type", "result_name", "position"] },
  { name: "product_viewed", category: "consideration", description: "User views a product page", params: ["product_slug", "category"] },
  { name: "write_review_step", category: "conversion", description: "User progresses through review form", params: ["step", "step_name"] },
  { name: "review_submitted", category: "conversion", description: "User submits a review", params: ["product_slug", "rating"] },
  { name: "generate_lead", category: "conversion", description: "GA4 recommended conversion event", params: ["value", "currency", "event_label"] },
  { name: "cta_clicked", category: "engagement", description: "User clicks a CTA", params: ["cta_name", "page"] },
  { name: "vote_cast", category: "engagement", description: "User votes on content", params: ["target_type", "vote_type"] },
  { name: "discussion_created", category: "engagement", description: "User creates a discussion thread", params: ["thread_type"] },
  { name: "search", category: "discovery", description: "User performs a search", params: ["search_term", "results_count"] },
  { name: "newsletter_signup", category: "lead_capture", description: "User signs up for newsletter", params: ["source"] },
  { name: "contact_form_submitted", category: "lead_capture", description: "User submits contact form", params: [] },
  { name: "page_engagement", category: "engagement", description: "User spends 30+ seconds on page", params: ["page_path", "time_on_page_sec"] },
  // New feature events
  { name: "email_capture_shown", category: "lead_capture", description: "Email capture form displayed to user", params: ["source", "page"] },
  { name: "email_capture_submit", category: "lead_capture", description: "User submits email via capture form", params: ["source", "page"] },
  { name: "review_auth_gate_shown", category: "conversion", description: "Auth gate displayed before review action", params: ["product_slug", "trigger_action"] },
  { name: "review_auth_signup", category: "conversion", description: "User signs up via review auth gate", params: ["product_slug", "method"] },
  { name: "quick_answer_view", category: "engagement", description: "Quick Answer section viewed on product page", params: ["product_slug", "question_id"] },
  { name: "quick_answer_expand", category: "engagement", description: "User expands a Quick Answer for full detail", params: ["product_slug", "question_id"] },
];

const CONVERSION_FUNNEL = {
  name: "ReviewIQ Review Submission Funnel",
  steps: [
    { step: 1, name: "Landing", event: "page_view", description: "User arrives at ReviewIQ" },
    { step: 2, name: "Browse Category", event: "category_viewed", description: "User browses a product category" },
    { step: 3, name: "View Product", event: "product_viewed", description: "User views a specific product" },
    { step: 4, name: "Start Review", event: "write_review_step:1", description: "User begins writing a review (product selection)" },
    { step: 5, name: "Rate Product", event: "write_review_step:2", description: "User rates the product" },
    { step: 6, name: "Write Content", event: "write_review_step:3", description: "User writes review content with pros/cons" },
    { step: 7, name: "Verify & Submit", event: "write_review_step:4", description: "User adds details and submits" },
    { step: 8, name: "Review Submitted", event: "review_submitted", description: "Review successfully submitted" },
  ],
};

const FEATURE_FUNNELS = {
  emailCapture: {
    name: "Email Capture Funnel",
    description: "Measures email capture conversion from impression to submission",
    steps: [
      { step: 1, name: "Page View", event: "page_view", description: "User visits a page with email capture" },
      { step: 2, name: "Form Shown", event: "email_capture_shown", description: "Email capture form renders in viewport" },
      { step: 3, name: "Email Submitted", event: "email_capture_submit", description: "User enters email and submits" },
    ],
    kpis: [
      { metric: "Form Show Rate", formula: "email_capture_shown / page_view", target: ">60%" },
      { metric: "Capture Conversion", formula: "email_capture_submit / email_capture_shown", target: ">5%" },
    ],
  },
  accountRequiredReviews: {
    name: "Account-Required Review Funnel",
    description: "Measures auth gate impact on review completion",
    steps: [
      { step: 1, name: "View Product", event: "product_viewed", description: "User views a product page" },
      { step: 2, name: "Start Review", event: "write_review_step:1", description: "User begins writing a review" },
      { step: 3, name: "Auth Gate Shown", event: "review_auth_gate_shown", description: "Auth requirement presented to user" },
      { step: 4, name: "Sign Up", event: "review_auth_signup", description: "User creates account to continue" },
      { step: 5, name: "Review Submitted", event: "review_submitted", description: "User completes and submits review" },
    ],
    kpis: [
      { metric: "Gate-to-Signup Rate", formula: "review_auth_signup / review_auth_gate_shown", target: ">30%" },
      { metric: "Signup-to-Review Rate", formula: "review_submitted / review_auth_signup", target: ">50%" },
      { metric: "Gate Drop-off", formula: "1 - (review_auth_signup / review_auth_gate_shown)", target: "<70%", warning: "High drop-off means auth friction is too high" },
    ],
  },
  quickAnswer: {
    name: "Quick Answer Engagement Funnel",
    description: "Measures Quick Answer feature engagement depth",
    steps: [
      { step: 1, name: "Product Page", event: "product_viewed", description: "User views a product page" },
      { step: 2, name: "Quick Answer View", event: "quick_answer_view", description: "Quick Answer section enters viewport" },
      { step: 3, name: "Quick Answer Expand", event: "quick_answer_expand", description: "User clicks to expand a Quick Answer" },
    ],
    kpis: [
      { metric: "QA Visibility Rate", formula: "quick_answer_view / product_viewed", target: ">40%" },
      { metric: "QA Engagement Rate", formula: "quick_answer_expand / quick_answer_view", target: ">15%" },
    ],
  },
};

const KPI_TARGETS = {
  northStar: {
    metric: "Reviews submitted per week",
    description: "Number of user-generated reviews submitted weekly",
    target: "To be set after 2 weeks of data collection",
  },
  core: [
    { metric: "Sessions", source: "GA4 session_start", frequency: "weekly", target: null as string | null },
    { metric: "Unique Users", source: "GA4 active_users", frequency: "weekly", target: null as string | null },
    { metric: "Bounce Rate", source: "GA4 bounce_rate", frequency: "weekly", target: "<55%" },
    { metric: "Avg Session Duration", source: "GA4 average_session_duration", frequency: "weekly", target: ">3 min" },
    { metric: "Funnel Completion Rate", source: "review_submitted / write_review_step:1", frequency: "weekly", target: ">20%" },
    { metric: "Review Rate", source: "review_submitted / product_viewed", frequency: "weekly", target: ">2%" },
  ],
  engagement: [
    { metric: "Vote Rate", formula: "vote_cast / product_viewed", target: ">10%" },
    { metric: "Discussion Rate", formula: "discussion_created / sessions", target: ">1%" },
    { metric: "Search Success", formula: "search_result_clicked / search", target: ">50%" },
    { metric: "Newsletter Conversion", formula: "newsletter_signup / sessions", target: ">1.5%" },
    { metric: "Page Engagement", formula: "page_engagement / product_viewed", target: ">40%" },
  ],
};

async function getLiveMetrics() {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const [
      totalProducts,
      totalCategories,
      totalReviews,
      recentReviews,
      totalUsers,
      totalVotes,
      totalThreads,
      totalComments,
      recentUsers,
      reviewsByRating,
      topProducts,
      topCategories,
      recentThreads,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.review.count(),
      prisma.review.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.user.count(),
      prisma.vote.count(),
      prisma.discussionThread.count(),
      prisma.comment.count(),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.review.groupBy({
        by: ["rating"],
        _count: { id: true },
        orderBy: { rating: "desc" },
      }),
      prisma.product.findMany({
        orderBy: { reviewCount: "desc" },
        take: 10,
        select: { name: true, slug: true, reviewCount: true, smartScore: true, category: { select: { name: true } } },
      }),
      prisma.category.findMany({
        select: { name: true, slug: true, _count: { select: { products: true } } },
        orderBy: { products: { _count: "desc" } },
        take: 10,
      }),
      prisma.discussionThread.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ]);

    const ratingDistribution = [5, 4, 3, 2, 1].map((r) => {
      const found = reviewsByRating.find((rr: { rating: number; _count: { id: number } }) => rr.rating === r);
      return { rating: r, count: found?._count.id || 0 };
    });

    return {
      period: { start: sevenDaysAgo.toISOString().split("T")[0], end: now.toISOString().split("T")[0], days: 7 },
      summary: {
        totalProducts,
        totalCategories,
        totalReviews,
        recentReviews,
        totalUsers,
        recentUsers,
        totalVotes,
        totalThreads,
        totalComments,
        recentThreads,
      },
      ratingDistribution,
      topProducts: topProducts.map((p: { name: string; slug: string; reviewCount: number; smartScore: number; category: { name: string } }) => ({
        name: p.name,
        slug: p.slug,
        reviewCount: p.reviewCount,
        smartScore: p.smartScore,
        category: p.category.name,
      })),
      topCategories: topCategories.map((c: { name: string; slug: string; _count: { products: number } }) => ({
        name: c.name,
        slug: c.slug,
        productCount: c._count.products,
      })),
    };
  } catch (err) {
    console.error("Analytics DB error:", err);
    return {
      period: { start: sevenDaysAgo.toISOString().split("T")[0], end: now.toISOString().split("T")[0], days: 7 },
      summary: { totalProducts: 0, totalCategories: 0, totalReviews: 0, recentReviews: 0, totalUsers: 0, recentUsers: 0, totalVotes: 0, totalThreads: 0, totalComments: 0, recentThreads: 0 },
      ratingDistribution: [],
      topProducts: [],
      topCategories: [],
    };
  }
}

async function generateWeeklyReport() {
  const live = await getLiveMetrics();
  const now = new Date();

  const avgRating = live.ratingDistribution.reduce((sum, r) => sum + r.rating * r.count, 0) /
    Math.max(live.summary.totalReviews, 1);

  const report = {
    title: `ReviewIQ Weekly Report — ${live.period.start} to ${live.period.end}`,
    generatedAt: now.toISOString(),
    headline: {
      totalProducts: live.summary.totalProducts,
      totalReviews: live.summary.totalReviews,
      reviewsThisWeek: live.summary.recentReviews,
      averageRating: Math.round(avgRating * 10) / 10,
      totalUsers: live.summary.totalUsers,
      newUsersThisWeek: live.summary.recentUsers,
      totalDiscussions: live.summary.totalThreads,
      totalVotes: live.summary.totalVotes,
    },
    ratingDistribution: live.ratingDistribution,
    topProducts: live.topProducts,
    topCategories: live.topCategories,
    callouts: [] as string[],
  };

  if (live.summary.recentReviews === 0) {
    report.callouts.push("No reviews submitted this week — consider user activation campaigns.");
  }
  if (avgRating < 3.0 && live.summary.totalReviews > 0) {
    report.callouts.push(`Average rating is ${avgRating.toFixed(1)} — investigate product quality issues.`);
  }
  if (live.summary.recentUsers > 0) {
    report.callouts.push(`${live.summary.recentUsers} new users joined this week.`);
  }
  if (live.summary.recentThreads > 0) {
    report.callouts.push(`${live.summary.recentThreads} new discussion threads this week.`);
  }

  return report;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  if (section === "funnel") return NextResponse.json({ funnel: CONVERSION_FUNNEL });
  if (section === "feature-funnels") return NextResponse.json({ featureFunnels: FEATURE_FUNNELS });
  if (section === "kpis") return NextResponse.json({ kpis: KPI_TARGETS });
  if (section === "events") return NextResponse.json({ events: CUSTOM_EVENTS });
  if (section === "live") {
    const live = await getLiveMetrics();
    return NextResponse.json(live);
  }
  if (section === "report") {
    const report = await generateWeeklyReport();
    return NextResponse.json(report);
  }

  const live = await getLiveMetrics();
  return NextResponse.json({
    product: "ReviewIQ",
    ga4Property: GA4_PROPERTY,
    clarityProject: CLARITY_PROJECT,
    events: CUSTOM_EVENTS,
    funnel: CONVERSION_FUNNEL,
    featureFunnels: FEATURE_FUNNELS,
    kpis: KPI_TARGETS,
    live,
  });
}
