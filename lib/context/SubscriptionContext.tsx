"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useSession } from "next-auth/react";

export type SubscriptionPlan = "free" | "pro";

interface SubscriptionContextValue {
  plan: SubscriptionPlan;
  isPro: boolean;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  plan: "free",
  isPro: false,
  isLoading: true,
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState<SubscriptionPlan>("free");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      setPlan("free");
      setIsLoading(false);
      return;
    }

    fetch("/api/subscription/status")
      .then((res) => res.json())
      .then((data) => {
        setPlan(data.plan === "pro" ? "pro" : "free");
      })
      .catch(() => {
        setPlan("free");
      })
      .finally(() => setIsLoading(false));
  }, [session, status]);

  return (
    <SubscriptionContext.Provider value={{ plan, isPro: plan === "pro", isLoading }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
