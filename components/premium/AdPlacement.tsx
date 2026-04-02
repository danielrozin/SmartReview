"use client";

import { useSubscription } from "@/lib/context/SubscriptionContext";

interface AdPlacementProps {
  slot: string;
  className?: string;
  children: React.ReactNode;
}

export function AdPlacement({ slot, className, children }: AdPlacementProps) {
  const { isPro } = useSubscription();

  if (isPro) return null;

  return (
    <div className={className} data-ad-slot={slot}>
      {children}
    </div>
  );
}
