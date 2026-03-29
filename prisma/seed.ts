import { PrismaClient } from "@prisma/client";
import { categories } from "../data/categories";
import { products } from "../data/products";
import { users } from "../data/users";
import { discussions, comments } from "../data/discussions";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Seed users (from static data)
  console.log("Seeding users...");
  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        avatar: u.avatar || null,
        bio: u.bio,
        trustLevel: u.trustLevel,
        reputationScore: u.reputationScore,
        badges: u.badges,
        expertiseCategories: u.expertiseCategories,
        verifiedProductCount: u.verifiedProductCount,
        joinedAt: new Date(u.joinedAt),
        lastActiveAt: new Date(u.lastActiveAt),
      },
    });
  }
  console.log(`  Seeded ${users.length} users`);

  // 2. Seed categories
  console.log("Seeding categories...");
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        image: cat.image || null,
        productCount: cat.productCount,
      },
    });
  }
  console.log(`  Seeded ${categories.length} categories`);

  // 3. Seed products with all nested data
  console.log("Seeding products...");
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        categoryId: p.categoryId,
        description: p.description,
        image: p.image,
        priceMin: p.priceRange.min,
        priceMax: p.priceRange.max,
        priceCurrency: p.priceRange.currency,
        smartScore: p.smartScore,
        verifiedPurchaseRate: p.verifiedPurchaseRate,
        reviewCount: p.reviewCount,
        rating5: p.ratingDistribution[5],
        rating4: p.ratingDistribution[4],
        rating3: p.ratingDistribution[3],
        rating2: p.ratingDistribution[2],
        rating1: p.ratingDistribution[1],
      },
    });

    // AI Summary
    if (p.aiSummary) {
      await prisma.aISummary.upsert({
        where: { productId: p.id },
        update: {},
        create: {
          productId: p.id,
          whatPeopleLove: p.aiSummary.whatPeopleLove,
          whatPeopleHate: p.aiSummary.whatPeopleHate,
          bestFor: p.aiSummary.bestFor,
          notFor: p.aiSummary.notFor,
          topComplaints: p.aiSummary.topComplaints,
          keyFacts: p.aiSummary.keyFacts,
        },
      });
    }

    // Specs
    for (const spec of p.specs) {
      await prisma.productSpec.create({
        data: {
          productId: p.id,
          label: spec.label,
          value: spec.value,
          group: spec.group || null,
        },
      });
    }

    // Recurring issues
    for (const issue of p.recurringIssues) {
      await prisma.recurringIssue.create({
        data: {
          productId: p.id,
          title: issue.title,
          mentionCount: issue.mentionCount,
          severity: issue.severity,
          description: issue.description,
        },
      });
    }

    // Comparisons
    for (const comp of p.comparisons) {
      await prisma.comparisonRef.create({
        data: {
          productId: p.id,
          targetProductId: comp.productId,
          targetProductName: comp.productName,
          targetProductSlug: comp.productSlug,
          searchVolume: comp.searchVolume || null,
        },
      });
    }

    // FAQs
    for (const faq of p.faq) {
      await prisma.fAQ.create({
        data: {
          productId: p.id,
          question: faq.question,
          answer: faq.answer,
        },
      });
    }

    // YouTube videos
    if (p.youtubeVideos) {
      for (const yt of p.youtubeVideos) {
        await prisma.youTubeVideo.create({
          data: {
            productId: p.id,
            videoId: yt.id,
            title: yt.title,
          },
        });
      }
    }

    // Reviews
    for (const review of p.reviews) {
      await prisma.review.create({
        data: {
          productId: p.id,
          headline: review.headline,
          rating: review.rating,
          verifiedPurchase: review.verifiedPurchase,
          verificationTier: review.verificationTier,
          timeOwned: review.timeOwned,
          experienceLevel: review.experienceLevel,
          pros: review.pros,
          cons: review.cons,
          reliabilityRating: review.reliabilityRating,
          easeOfUseRating: review.easeOfUseRating,
          valueRating: review.valueRating,
          body: review.body,
          aiTopics: review.aiTopics,
          authorName: review.authorName,
          authorAvatar: review.authorAvatar || null,
          helpfulCount: review.helpfulCount,
          status: "published",
          createdAt: new Date(review.createdAt),
        },
      });
    }
  }
  console.log(`  Seeded ${products.length} products with nested data`);

  // 4. Seed discussion threads
  console.log("Seeding discussions...");
  for (const thread of discussions) {
    await prisma.discussionThread.upsert({
      where: { id: thread.id },
      update: {},
      create: {
        id: thread.id,
        title: thread.title,
        body: thread.body,
        threadType: thread.threadType,
        authorId: thread.authorId,
        productId: thread.productId || null,
        categoryId: thread.categoryId || null,
        upvotes: thread.upvotes,
        downvotes: thread.downvotes,
        commentCount: thread.commentCount,
        viewCount: thread.viewCount,
        isPinned: thread.isPinned,
        isResolved: thread.isResolved,
        tags: thread.tags,
        createdAt: new Date(thread.createdAt),
        lastActivityAt: new Date(thread.lastActivityAt),
      },
    });
  }
  console.log(`  Seeded ${discussions.length} threads`);

  // 5. Seed comments (top-level first, then replies)
  console.log("Seeding comments...");
  const topLevel = comments.filter((c) => !c.parentId);
  const replies = comments.filter((c) => c.parentId);

  for (const c of topLevel) {
    await prisma.comment.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        threadId: c.threadId,
        authorId: c.authorId,
        body: c.body,
        upvotes: c.upvotes,
        downvotes: c.downvotes,
        isTopAnswer: c.isTopAnswer,
        isOwnerVerified: c.isOwnerVerified,
        helpfulCount: c.helpfulCount,
        createdAt: new Date(c.createdAt),
      },
    });
  }

  for (const c of replies) {
    await prisma.comment.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        threadId: c.threadId,
        parentId: c.parentId,
        authorId: c.authorId,
        body: c.body,
        upvotes: c.upvotes,
        downvotes: c.downvotes,
        isTopAnswer: c.isTopAnswer,
        isOwnerVerified: c.isOwnerVerified,
        helpfulCount: c.helpfulCount,
        createdAt: new Date(c.createdAt),
      },
    });
  }
  console.log(`  Seeded ${comments.length} comments`);

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
