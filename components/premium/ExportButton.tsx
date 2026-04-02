"use client";

import { useState } from "react";
import { Download, Lock } from "lucide-react";
import { useSubscription } from "@/lib/context/SubscriptionContext";
import { UpgradePrompt } from "./UpgradePrompt";

interface ExportButtonProps {
  onExport: (format: "csv" | "pdf") => void;
}

export function ExportButton({ onExport }: ExportButtonProps) {
  const { isPro } = useSubscription();
  const [showGate, setShowGate] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = () => {
    if (!isPro) {
      setShowGate(true);
      return;
    }
    setShowMenu(!showMenu);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {isPro ? (
          <Download className="w-4 h-4" />
        ) : (
          <Lock className="w-3.5 h-3.5 text-amber-500" />
        )}
        Export
      </button>

      {showMenu && isPro && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
          <button
            onClick={() => { onExport("csv"); setShowMenu(false); }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Export as CSV
          </button>
          <button
            onClick={() => { onExport("pdf"); setShowMenu(false); }}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Export as PDF
          </button>
        </div>
      )}

      {showGate && !isPro && (
        <div className="absolute right-0 mt-2 w-80 z-20">
          <UpgradePrompt gate="export" compact />
          <button
            onClick={() => setShowGate(false)}
            className="mt-1 text-xs text-gray-400 hover:text-gray-600 w-full text-right"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
