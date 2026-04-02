"use client";

import { Crown } from "lucide-react";

interface ProBadgeProps {
  size?: "sm" | "md";
}

export function ProBadge({ size = "sm" }: ProBadgeProps) {
  const sizeClasses = size === "sm"
    ? "px-1.5 py-0.5 text-[10px] gap-0.5"
    : "px-2 py-1 text-xs gap-1";

  const iconSize = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200 ${sizeClasses}`}
    >
      <Crown className={iconSize} />
      PRO
    </span>
  );
}
