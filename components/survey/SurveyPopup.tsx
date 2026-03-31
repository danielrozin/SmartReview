"use client";

import { useState, useEffect } from "react";

const SURVEY_DISMISSED_KEY = "sr_survey_dismissed";
const SURVEY_DELAY_MS = 30000; // Show after 30 seconds on site
const SURVEY_URL = "https://forms.gle/SmartReviewFeedback"; // Replace with actual survey URL

export function SurveyPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(SURVEY_DISMISSED_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => setVisible(true), SURVEY_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(SURVEY_DISMISSED_KEY, Date.now().toString());
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm animate-in slide-in-from-bottom-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-brand-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                Quick feedback?
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Help us improve SmartReview. Takes less than 2 minutes.
            </p>
            <div className="flex items-center gap-2">
              <a
                href={SURVEY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
              >
                Take survey
              </a>
              <button
                onClick={dismiss}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close survey"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
