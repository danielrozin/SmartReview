"use client";

import { useSubscription } from "@/lib/context/SubscriptionContext";
import { ProBadge } from "./ProBadge";

interface UserProBadgeProps {
  userId: string;
  size?: "sm" | "md";
}

export function UserProBadge({ userId, size = "sm" }: UserProBadgeProps) {
  const { isPro } = useSubscription();

  // Only show Pro badge for the current logged-in user's own profile
  // In a full implementation, this would check the target user's subscription
  if (!isPro) return null;

  return <ProBadge size={size} />;
}
