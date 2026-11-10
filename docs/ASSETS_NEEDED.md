# Assets Needed

Every image must be genuine, sanitized, and readable at the size it is displayed. No
fabricated screenshots. Where an asset is missing, the site uses a clearly labelled
"Screenshot pending" frame, never a mock-up presented as real software.

Store source assets in `src/assets/img/`; the build copies and hashes them into
`assets/img/`. Use lowercase kebab-case filenames.

---

## 1. Portrait

| Filename | What it shows | Size | Notes |
| --- | --- | --- | --- |
| `portrait-640.webp` | Head-and-shoulders portrait, 4:5 crop | 640 × 800 | From `photo.jpg`; keep the face in the upper third |
| `portrait-1280.webp` | Same crop, 2× | 1280 × 1600 | For high-density screens |
| `portrait-640.jpg` | JPEG fallback | 640 × 800 | Quality ~82 |
| `portrait-1280.jpg` | JPEG fallback, 2× | 1280 × 1600 | Quality ~82 |

The current `photo.jpg` is 1254 × 1254 (square, 171.5 KB), so it must be cropped, not
stretched. Add explicit `width`/`height` and a `srcset`.

---

## 2. Linklet

| Filename | What it shows | Size | Capture method |
| --- | --- | --- | --- |
| `linklet-home.webp` | Public homepage / listing feed with real categories and search | 1600 × 1000 | Headless Edge, no auth |
| `linklet-listing.webp` | A listing detail page with images, price, seller card | 1600 × 1000 | Headless Edge, demo listing |
| `linklet-chat.webp` | Buyer–seller chat with text, image, voice note, unread state | 1600 × 1000 | **Owner** — authenticated; blur names/avatars/phone numbers |
| `linklet-admin.webp` | Admin dashboard: users, listings, reports, payments | 1600 × 1000 | **Owner** — authenticated; use demo data |
| `linklet-mobile-home.webp` | Mobile listing feed | 390 × 844 | Headless Edge, mobile viewport |
| `linklet-mobile-chat.webp` | Mobile chat | 390 × 844 | **Owner** — authenticated; sanitize |
| `linklet-architecture.svg` | Vercel → Cloud Run → Supabase; Cloudinary, Resend, Africa's Talking, M-Pesa, Google OAuth, Web Push | 1200 × 700 | Build from `linklet/ARCHITECTURE.md`; no invented services |

Do not include real student names, phone numbers, email addresses, delivery addresses, order
IDs, M-Pesa receipts, or Cloudinary URLs with signatures. Use seeded demo data or blur.

---

## 3. MICA

| Filename | What it shows | Size | Capture method |
| --- | --- | --- | --- |
| `mica-console.webp` | Console: chat, tool activity, status pill, task panel | 1600 × 1000 | Run locally (`npm start`) and capture; sanitize |
| `mica-companion.webp` | Native desktop companion (avatar) on a clean desktop | 1200 × 800 | **Owner** — needs the real companion running |
| `mica-approval.webp` | Approval card for a gated action | 1200 × 800 | **Owner** or local run; show a harmless demo action |
| `mica-autonomy.webp` | Settings: Strict / Assisted / Trusted, session grants, approved hosts | 1600 × 1000 | Local run; crop any API key fields |
| `mica-architecture.svg` | Browser UI ↔ local server ↔ tool runner / SQLite; provider calls; approval gate; companion over local pipe | 1200 × 700 | Build from `MICA/README.md` and `DEVELOPMENT-STATUS.md` |

Never capture `.env`, `.mica-secrets.json`, `.mica-token`, API keys, account emails, or real
private file paths. Use a scratch folder such as `C:\Users\Public\MICA Demo`.

---

## 4. FilePilot

**Blocked:** no local source and no public repository were found. The owner must supply the
project or assets before this case study can be written.

| Filename | What it shows | Size |
| --- | --- | --- |
| `filepilot-analysis.webp` | Storage analysis: tree view, largest-first, size bars, free-space summary | 1600 × 1000 |
| `filepilot-smart-clean.webp` | Smart Clean recommendations with categories and reclaimable space | 1600 × 1000 |
| `filepilot-safety.webp` | Safety confirmation before a destructive operation | 1600 × 1000 |
| `filepilot-duplicates.webp` | Duplicate finder results | 1600 × 1000 |
| `filepilot-organizer.webp` | File organiser rules / preview | 1600 × 1000 |
| `filepilot-architecture.svg` | PySide6 UI → safety layer → file operations / SQLite / Windows integrations | 1200 × 700 |

Capture only from a test machine or a sandbox folder. Do not show real user documents,
personal photos, account names, or system paths that identify the owner.

---

## 5. NSE Intelligence Agent

The project is a Node.js bot + GitHub Actions, not n8n. Do not use n8n workflow imagery.

| Filename | What it shows | Size | Capture method |
| --- | --- | --- | --- |
| `nse-report.webp` | Rendered HTML report: overview, analysis, movers, sector tables, headlines | 1200 × 1600 (full page) | Render `nse-report-preview.html` headlessly |
| `nse-email.webp` | The delivered email in an inbox, recipient redacted | 1200 × 900 | **Owner** — use a demo recipient; crop the address |
| `nse-actions.webp` | GitHub Actions run: weekday schedule, successful run, duration | 1400 × 900 | **Owner** — repository must be public or the screenshot sanitized |
| `nse-pipeline.svg` | AFX Kenya + Google News RSS → normalization → optional FreeLLMAPI analysis / deterministic fallback → HTML report → Resend | 1200 × 700 | Build from verified code |

Include a visible "Automated analysis — not financial advice" disclaimer near the visuals.

---

## 6. Library project imagery

Thumbnails are optional. If absent, use a typographic project card with no fake UI.

| Filename | Project | What it shows | Size |
| --- | --- | --- | --- |
| `wordcraft-taskpane.webp` | WordCraft One | Task pane with writing-health score and issue list | 900 × 1200 |
| `leadgen-ui.webp` | Lead-Gen Scraper | Streamlit search + results table | 1400 × 900 |
| `smart-sales-dashboard.webp` | Smart Sales Assistant | React dashboard with Recharts | 1400 × 900 |
| `telegram-bot.webp` | Linklet Telegram Bot | A sanitized support conversation | 900 × 1200 |
| `social-poster.webp` | Linklet Social Poster | Generated post + Telegram approval | 1200 × 900 |
| `seller-report.webp` | Linklet Seller Report | Weekly email report with demo data | 1200 × 900 |
| `email-summary.webp` | Email Summary Bot | WhatsApp digest with redacted content | 900 × 1200 |

---

## 7. Diagrams

Prefer hand-authored SVG for architecture, because it stays sharp, small, and accessible.
Each diagram needs a `<title>`, a `<desc>`, and a text alternative on the page.

| Filename | Purpose |
| --- | --- |
| `linklet-architecture.svg` | Runtime topology and integrations |
| `mica-architecture.svg` | Local-first assistant, approval gate, provider boundary |
| `filepilot-architecture.svg` | UI, safety layer, storage operations, SQLite |
| `nse-pipeline.svg` | Data sources, processing, analysis fallback, delivery |

---

## 8. Social share images

| Filename | What it shows | Size |
| --- | --- | --- |
| `og-home.png` | Name, positioning line, teal rule, "Karatina, Kenya · EAT" | 1200 × 630 |
| `og-linklet.png` | Project name + one-line description + category | 1200 × 630 |
| `og-mica.png` | Project name + one-line description + category | 1200 × 630 |
| `og-filepilot.png` | Project name + one-line description + category | 1200 × 630 |
| `og-nse.png` | Project name + "Not financial advice" note | 1200 × 630 |

Generate these from local HTML with headless Edge at an exact 1200 × 630 viewport. Do not
put text in the safe margins; keep it readable at thumbnail size.

---

## 9. Favicon and icons

| Filename | Purpose |
| --- | --- |
| `favicon.svg` | Existing JM monogram, refined for small sizes |
| `favicon-32.png` | Legacy fallback |
| `apple-touch-icon.png` | 180 × 180, solid background so it reads on iOS |
| `site.webmanifest` | Name, short name, theme color, icons |

---

## 10. What the agent can capture vs. what the owner must supply

| Asset | Agent | Owner |
| --- | --- | --- |
| Portrait derivatives | Yes | — |
| Linklet public pages | Yes | — |
| Linklet chat/admin/seller flows | — | Yes, or a demo account + seed data |
| MICA console / settings | Yes, by running locally | — |
| MICA companion / approval flow | Partly | Yes, for the real companion window |
| FilePilot everything | — | Yes, source or assets |
| NSE report preview | Yes | — |
| NSE delivered email / Actions run | — | Yes |
| WordCraft task pane | Yes, from the demo shell | Confirm in-Word behaviour |
| Architecture diagrams | Yes, from verified docs | Review for accuracy |
| OG images | Yes | Approve wording |
| Library thumbnails | Partly | Yes, for authenticated dashboards |
