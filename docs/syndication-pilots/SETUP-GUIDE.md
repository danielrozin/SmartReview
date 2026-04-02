# Content Syndication Platform Setup Guide

**Purpose:** Step-by-step instructions to create SmartReview accounts on Medium, dev.to, and LinkedIn.
**Time estimate:** ~30 minutes total for all three platforms.
**Prerequisite:** A personal account on each platform (or create one).

---

## 1. Medium — Create "SmartReview" Publication

### Steps:
1. Go to https://medium.com and sign in
2. Click your profile icon (top right) → **Manage publications**
3. Click **New publication**
4. Fill in:
   - **Name:** SmartReview
   - **Description:** Data-driven product and concept comparisons. We help people make informed decisions with structured, unbiased comparisons backed by real data.
   - **Avatar:** Use SmartReview logo
   - **Publication URL:** `medium.com/smartreview` (if available, otherwise `medium.com/smartreview-comparisons`)
   - **Tags:** Technology, Product Reviews, Data Science, Consumer Electronics
5. Click **Create**
6. Under publication settings → **Homepage** → set layout to "Grid"
7. Under **Navigation** → add tabs: "Tech", "Products", "Concepts"

### Content ready to publish:
- `syndication-pilots/medium-airpods-vs-sony.md` — "AirPods Pro 2 vs Sony WF-1000XM5"
- `syndication-pilots/medium-roomba-vs-roborock.md` — "Roomba vs Roborock"

### Publishing each article:
1. Click **New story** within the publication
2. Copy-paste the markdown content (Medium renders it well)
3. Set the **canonical URL** to the aversusb.net original (included in each file's header)
4. Add relevant tags (up to 5)
5. Publish

---

## 2. dev.to — Create "SmartReview" Organization

### Steps:
1. Go to https://dev.to and sign in
2. Go to https://dev.to/settings/organization
3. Click **Create Organization**
4. Fill in:
   - **Name:** SmartReview
   - **URL:** `dev.to/smartreview`
   - **Summary:** Structured comparisons for developers and tech enthusiasts. We publish data-driven breakdowns of tools, frameworks, and products.
   - **Website:** `https://www.aversusb.net`
   - **Logo:** Upload SmartReview logo
   - **Brand color:** Use primary brand color
5. Click **Create Organization**

### Content ready to publish:
- `syndicated/devto-chatgpt-vs-claude.md` — "ChatGPT vs Claude API: A Developer's Honest Comparison (2026)"

### Publishing:
1. Click **Create Post** → select "SmartReview" as the organization
2. Paste the full markdown (dev.to uses frontmatter — it's already included in the file)
3. The `canonical_url` in frontmatter will auto-set the canonical link
4. Preview → Publish

---

## 3. LinkedIn — Create/Verify SmartReview Company Page

### Steps:
1. Go to https://www.linkedin.com/company/setup/new/
2. Select **Company** → **Small business**
3. Fill in:
   - **Name:** SmartReview
   - **LinkedIn URL:** `linkedin.com/company/smartreview` (if available, otherwise `smartreview-comparisons`)
   - **Website:** `https://www.aversusb.net`
   - **Industry:** Internet Publishing
   - **Company size:** 2-10 employees
   - **Type:** Privately Held
4. Add **Tagline:** "Data-driven comparisons that help you decide"
5. Upload logo and banner image
6. In **About:** "SmartReview publishes structured, data-backed comparisons of products, tools, and concepts. We help millions of people make better decisions by breaking down the real differences — attribute by attribute, with transparent data and clear verdicts."
7. Click **Create page**

### Content ready to publish:
- `syndication-pilots/linkedin-week1-posts.md` — 4 posts for Week 1 launch series

### Publishing schedule:
- **Monday:** Post 1 — Industry Insight
- **Tuesday:** Post 2 — Data Highlight
- **Thursday:** Post 3 — Partnership CTA
- **Friday:** Post 4 — Cross-Post Teaser

---

## Post-Setup Checklist

- [ ] Medium publication created, 2 pilot articles published with canonical URLs
- [ ] dev.to organization created, ChatGPT vs Claude article published with canonical URL
- [ ] LinkedIn company page created, Week 1 posts scheduled
- [ ] Share account credentials/access with the team
- [ ] Update `SmartReview/.env` with any API keys needed for automated syndication (future)

## Environment Variables (for future automation)

Once accounts are set up, the syndication service (`src/lib/services/content-syndication.ts`) can be connected with:

```env
MEDIUM_INTEGRATION_TOKEN=   # Medium API token (Settings → Integration tokens)
DEVTO_API_KEY=              # dev.to API key (Settings → Extensions → DEV Community API Keys)
LINKEDIN_ACCESS_TOKEN=      # LinkedIn Marketing API (requires app registration)
```
