"use client";

import { useState } from "react";
import { ThreadCard } from "@/components/community/ThreadCard";
import type { DiscussionThread } from "@/types";

type SortTab = "Trending" | "Recent" | "Top";

export function SortableDiscussions({
  trending,
  recent,
  top,
}: {
  trending: DiscussionThread[];
  recent: DiscussionThread[];
  top: DiscussionThread[];
}) {
  const [activeTab, setActiveTab] = useState<SortTab>("Trending");

  const tabs: SortTab[] = ["Trending", "Recent", "Top"];
  const threads = activeTab === "Trending" ? trending : activeTab === "Recent" ? recent : top;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {activeTab} Discussions
        </h2>
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-brand-50 text-brand-600"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {threads.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
    </section>
  );
}
