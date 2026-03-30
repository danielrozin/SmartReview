# Event Taxonomy: New Feature Tracking

**Date:** 2026-03-30
**Status:** Ready for implementation
**Related tasks:** DAN-162 (Email Capture + Account-Required Reviews), DAN-163 (Quick Answer)

## Overview

This document defines the GA4 custom events, funnel stages, and baseline KPI targets for three new SmartReview features:

1. **Email Capture** — Newsletter/email collection forms shown across the site
2. **Account-Required Reviews** — Auth gate before review submission
3. **Quick Answer** — AI-generated quick answers on product pages

---

## 1. Email Capture Events

| Event | Category | Description | Parameters |
|-------|----------|-------------|------------|
| `email_capture_shown` | lead_capture | Email capture form rendered in viewport | `source` (popup, inline, post-review, exit-intent), `page` |
| `email_capture_submit` | lead_capture | User submits email address | `source`, `page` |

**Funnel:** Page View → Form Shown → Email Submitted

**Target KPIs:**
- Form Show Rate: `email_capture_shown / page_view` → >60%
- Capture Conversion: `email_capture_submit / email_capture_shown` → >5%

**GA4 Configuration:**
- Mark `email_capture_submit` as a conversion event
- Create custom dimension for `source` parameter
- Also fires `generate_lead` (GA4 recommended) and Meta Pixel `Lead` event

---

## 2. Account-Required Reviews Events

| Event | Category | Description | Parameters |
|-------|----------|-------------|------------|
| `review_auth_gate_shown` | conversion | Auth requirement presented to user | `product_slug`, `trigger_action` (write_review, edit_review, vote) |
| `review_auth_signup` | conversion | User creates account via auth gate | `product_slug`, `method` (email, google, github) |

**Funnel:** Product View → Start Review → Auth Gate Shown → Sign Up → Review Submitted

**Target KPIs:**
- Gate-to-Signup Rate: `review_auth_signup / review_auth_gate_shown` → >30%
- Signup-to-Review Rate: `review_submitted / review_auth_signup` → >50%
- Gate Drop-off: `1 - (review_auth_signup / review_auth_gate_shown)` → <70% (high drop-off = too much friction)

**GA4 Configuration:**
- Mark `review_auth_signup` as a conversion event
- Also fires `sign_up` (GA4 recommended) and Meta Pixel `CompleteRegistration`
- Create custom dimension for `method` and `trigger_action` parameters

---

## 3. Quick Answer Events

| Event | Category | Description | Parameters |
|-------|----------|-------------|------------|
| `quick_answer_view` | engagement | Quick Answer section enters viewport | `product_slug`, `question_id` |
| `quick_answer_expand` | engagement | User clicks to expand a Quick Answer | `product_slug`, `question_id` |

**Funnel:** Product Page → QA Section View → QA Expand

**Target KPIs:**
- QA Visibility Rate: `quick_answer_view / product_viewed` → >40%
- QA Engagement Rate: `quick_answer_expand / quick_answer_view` → >15%

**GA4 Configuration:**
- Create custom dimensions for `question_id` parameter
- Use Scroll Depth trigger in GTM if viewport-based tracking is needed

---

## Implementation Notes

### Tracking Functions (lib/tracking/analytics.ts)

```typescript
import {
  trackEmailCaptureShown,
  trackEmailCaptureSubmit,
  trackReviewAuthGateShown,
  trackReviewAuthSignup,
  trackQuickAnswerView,
  trackQuickAnswerExpand,
} from "@/lib/tracking/analytics";
```

### Integration Points

1. **Email Capture component** — Call `trackEmailCaptureShown()` on mount/visibility, `trackEmailCaptureSubmit()` on form submit
2. **Auth gate modal** — Call `trackReviewAuthGateShown()` when modal opens, `trackReviewAuthSignup()` on successful registration
3. **Quick Answer component** — Call `trackQuickAnswerView()` with IntersectionObserver, `trackQuickAnswerExpand()` on click

### Dashboard

View all feature funnels at `/admin/analytics` → "New Features" tab. The dashboard shows:
- Funnel step visualization for each feature
- Target KPI cards with formulas
- GA4 setup instructions

### Baseline Collection

Once features deploy, allow 2 weeks of data collection before:
- Setting final targets based on actual conversion rates
- Adjusting funnel definitions if user behavior differs from expected flow
- Comparing against industry benchmarks (email capture: 3-5%, auth signup: 25-40%)
