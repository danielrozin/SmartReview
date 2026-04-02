import { prisma } from "./prisma";
import type { PlanKey } from "./stripe";

export type SubscriptionPlan = PlanKey;

export interface SubscriptionStatus {
  plan: SubscriptionPlan;
  isActive: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date | null;
}

export const FREE_LIMITS = {
  maxSavedComparisons: 3,
} as const;

export async function getUserSubscription(userId: string): Promise<SubscriptionStatus> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription || subscription.status !== "active") {
    return {
      plan: "free",
      isActive: false,
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null,
    };
  }

  return {
    plan: subscription.plan as SubscriptionPlan,
    isActive: true,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    currentPeriodEnd: subscription.currentPeriodEnd,
  };
}

export function isPro(status: SubscriptionStatus): boolean {
  return status.plan === "pro" && status.isActive;
}

export async function hasProAccess(userId: string): Promise<boolean> {
  const status = await getUserSubscription(userId);
  return isPro(status);
}
