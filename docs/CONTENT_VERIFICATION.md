# Content Verification Ledger

**Rule:** nothing marked `Unverified` or `Needs owner input` may appear as fact on the site.
`Verified` means the claim was checked against source code, local documentation, a live
endpoint, or explicit owner instruction on 2026-11-10.

Status values: `Verified` · `False` · `Unverified` · `Needs owner input` · `Remove`.

---

## Identity and positioning

| Claim | Where used | Evidence | Status |
| --- | --- | --- | --- |
| Name is Jacob Muniko; goes by "Muniko" | Global | Owner brief §24 | Verified |
| Based in Karatina, Kenya; available for remote work | Hero, contact, footer | Owner brief §24 | Verified |
| Time zone is East Africa Time (UTC+3) | Contact, availability | Owner brief §24 and §26 | Verified |
| Positioned as an independent technology builder, not an agency | Global | Owner brief §2 | Verified (direction) |
| Works across AI, web, desktop, automation, data, product | Global | Owner brief §2; repositories | Verified |
| Bachelor of Education (Arts), Karatina University; teaching subjects Business Studies and Geography; final year; expected graduation around November 2027 | About, Home, About meta | Owner statement, 11 November 2026 (overrides earlier brief §24) | Verified by owner statement |
| School of Education and Social Sciences, Department of Curriculum Technology and Management | About | Owner statement, 11 November 2026 | Verified by owner statement |
| Remote generalist AI training / data annotation / response ranking | Current hero and About | Current site copy only; no project or document evidence | Needs owner input |
| Response time usually within 24 hours | Contact | Current site copy only | Needs owner input |
| English fluent, Kiswahili native | Contact | Current site copy; not contradicted | Needs owner input |
| Public contact email is `jacobmuniko53@gmail.com` | Contact | Current site uses it; owner has not confirmed it as the chosen public address | Needs owner input |
| WhatsApp contact number | Contact | Not supplied | Needs owner input |
| LinkedIn or other profile URLs | Footer/contact | Not supplied | Needs owner input |
| Linklet Solutions as a business name | About/footer | GitHub profile lists "Linklet Solutions"; owner brief says leave room for a studio name but do not invent one | Needs owner input |
| Business registration number (redacted) | Current Work section | Owner brief §24 forbids publishing it | Removed |

---

## Linklet

| Claim | Where used | Evidence | Status |
| --- | --- | --- | --- |
| Linklet is a campus marketplace for university students and the surrounding community, not a gig marketplace | Case study | `linklet/README.md` line 3; owner brief §7 | Verified |
| Buyers and sellers can list, discover, and trade goods | Case study | `linklet/README.md`; `frontend/src/pages` | Verified |
| React 19, Create React App, React Router 7, Tailwind CSS 3 | Case study | `linklet/frontend/package.json` | Verified |
| Node.js 18+, Express 4, Socket.IO | Case study | `linklet/backend/package.json`; `README.md` | Verified |
| PostgreSQL 15 on Supabase, via session pooler with TLS | Case study | `linklet/README.md`; `ARCHITECTURE.md` | Verified |
| Frontend hosted on Vercel at `linklet.co.ke` | Case study, links | `README.md`; live domain resolves | Verified |
| Backend hosted on Google Cloud Run (`us-central1`) | Case study | `README.md`; `ARCHITECTURE.md`; live health endpoint | Verified |
| Linklet is currently live | Featured work | `https://linklet-backend-...run.app/api/health` returned `status: ok`, `database: up` on 2026-11-10; domain resolves | Verified at audit date |
| Linklet is in public beta | Featured work/status | Owner brief says beta testing; repo calls it production; not confirmed | Needs owner input |
| M-Pesa Daraja STK Push for listing promotion | Case study | `README.md`; `ARCHITECTURE.md`; backend utilities | Verified |
| M-Pesa is live (real money), not sandbox | Case study | Not stated in repo; needs confirmation | Needs owner input |
| Cloudinary uploads with a local upload fallback | Case study | `README.md` mentions Cloudinary; local fallback claim comes from the brief, not confirmed in code | Needs owner input |
| Google OAuth, email/phone OTP, optional 2FA | Case study | `README.md` | Verified |
| Direct messaging with images, documents, voice notes, replies, reactions, blocking, unread counts | Case study | `README.md` | Verified |
| Seller verification, ratings, response-rate badges | Case study | `README.md` | Verified |
| Admin panel for users, listings, reports, payments, verification, growth, maintenance | Case study | `README.md`; `backend/src/routes` | Verified |
| PWA, dark mode, offline handling | Case study | `README.md` | Verified |
| Resend for email, Africa's Talking for SMS, Web Push | Case study | `backend/package.json`; `README.md` | Verified |
| Admin lockout bug caused by a race between maintenance mode and auth context | Case study challenge | Commit `a668f3d` ("maintenance cookie bypass") supports a maintenance/auth defect; the exact race diagnosis is owner-supplied | Needs owner input |
| Cold starts and WebSocket drops on free-tier hosting were handled | Case study challenge | Owner brief; commit `17663b8` ("Prefer polling with WebSocket upgrade for Socket.IO auth") supports reconnect work | Needs owner input |
| Hosting providers changed before the current stack | Case study challenge | `README.md` history and commit messages mention Railway and Render | Verified (general) |
| Backend is on Render | Current Work section | Current architecture is Cloud Run | False — correct |
| "Platform is live and operating" | Current Work section | Live API health verified; business operations not verified | Needs owner input / qualify |
| Additional listing categories and business advertising are planned | Case study next steps | Owner brief §7 | Verified as future plans only |
| Source code is publicly available | Case study links | `github.com/muniko53/linklet` is not in the public repository list | Unverified — likely private |

---

## MICA

| Claim | Where used | Evidence | Status |
| --- | --- | --- | --- |
| MICA is a local-first Windows assistant | Case study | `MICA/README.md` | Verified |
| Voice input and spoken replies via browser Web Speech API | Case study | `README.md`; `public/app.js` | Verified |
| Browser UI and tool runner bind to `127.0.0.1` | Case study | `README.md` | Verified |
| Google Gemini is the default provider; OpenAI is optional | Case study | `README.md` | Verified |
| Groq cheap-brain routing and automatic fallback | Case study | `README.md`; `lib/cheap-brain.mjs`; `DEVELOPMENT-STATUS.md` | Verified |
| Local tool runner with file listing/search/read inside approved folders | Case study | `README.md`; tool schemas | Verified |
| Native desktop companion with animated character and tray verbs | Case study | `README.md`; `DEVELOPMENT-STATUS.md`; `avatar/` | Verified |
| Approval system with replay, session, expiry, cancel, fail-closed checks | Case study | `DEVELOPMENT-STATUS.md`; `lib/autonomy.mjs` | Verified |
| Scoped autonomy modes: Strict, Assisted, Trusted | Case study | `README.md`; `DEVELOPMENT-STATUS.md` | Verified |
| Browser automation through a dedicated Chrome profile and CDP | Case study | `README.md`; `lib/cdp.mjs` | Verified |
| Local SQLite memory, tasks, jobs, audit trail | Case study | `README.md`; `*.db` files; `DEVELOPMENT-STATUS.md` | Verified |
| Test suite reports 1,290 green tests | Case study | `DEVELOPMENT-STATUS.md` as of 2026-10-25 | Needs re-run before publishing |
| MICA is complete/production-ready | Case study status | `DEVELOPMENT-STATUS.md` lists remaining work; version 0.1.0 | False — present as in development |
| MICA source is publicly available | Case study links | No remote configured locally; not in public repo list | Unverified — likely local only |
| Screenshots of the console, companion, and approval flow are available | Case study visuals | No image assets found in `public/`; must be captured | Needs owner input |

---

## FilePilot

| Claim | Where used | Evidence | Status |
| --- | --- | --- | --- |
| FilePilot is a Windows file-intelligence and storage-maintenance app | Case study | Owner brief §7 | Needs owner input |
| Built with PySide6 and SQLite | Case study | Owner brief §24 only; no source found locally | Unverified |
| Central safety layer for destructive operations | Case study | Owner brief only; no source | Unverified |
| Storage analysis: tree view, largest-first, size bars, cancel, free-space report | Case study | Owner brief only | Unverified |
| Smart Clean, organiser, duplicate finder, CSV export, exclusions | Case study | Owner brief only | Unverified |
| Microsoft Defender integration, Explorer diagnostics, recovery assistant | Case study | Owner brief only | Unverified |
| Version 0.1.0, feature-complete in code, awaiting Windows testing and installer | Case study status | Owner brief only | Unverified |
| Source code location | Links | No local folder; GitHub search returns 0 public repositories | Blocked |
| Screenshots | Visuals | None available | Blocked |

---

## NSE Intelligence Agent

| Claim | Where used | Evidence | Status |
| --- | --- | --- | --- |
| The project is a Node.js bot, not an n8n workflow | Case study, library | `projects/nse-bot/package.json`, `index.js` | Verified |
| Scheduled by GitHub Actions on weekdays at 14:00 UTC (17:00 EAT) | Case study | `.github/workflows/nse-daily-report.yml` | Verified |
| Pulls live prices for the full NSE board from AFX Kenya | Case study | `README.md`; `PLAN.md`; `index.js` | Verified |
| Parses 60+ counters across 10 sectors | Case study | `PLAN.md` verified dry run: 63 counters, 10 sectors | Verified from documented dry run |
| Headlines come from Google News RSS | Case study | `README.md`; `PLAN.md` | Verified |
| Optional AI commentary uses a self-hosted FreeLLMAPI gateway | Case study | `README.md`; `PLAN.md` | Verified |
| When AI is unavailable, a deterministic data-driven commentary is used | Case study | `README.md`; `PLAN.md` | Verified |
| Email delivery uses Resend | Case study | `README.md`; `package.json`; workflow secrets | Verified |
| Report includes market overview, NASI/market cap, analysis, movers, most active, sector tables, headlines | Case study | `README.md`; `nse-report-preview.html` | Verified |
| Uses Yahoo Finance | Current Work section | Removed from the data path; Yahoo returns 401 | False — remove |
| Uses Reuters RSS | Current Work section | Replaced by Google News RSS | False — remove |
| Uses a Claude AI analysis step | Current Work section | No Claude integration; FreeLLMAPI is optional | False — remove |
| Sends over SMTP | Current Work section | Uses Resend API | False — remove |
| Schedule is 4:30 PM EAT | Current Work section | Workflow is 14:00 UTC = 17:00 EAT | False — remove |
| Analyses only SCOM, EQTY, KCB | Current Work section | Full board, 60+ counters | False — qualify |
| Runs unattended | Case study | Scheduled workflow; no manual step | Verified (with workflow enabled) |
| Predicts prices or guarantees returns | Anywhere | Must never be claimed | Prohibited |
| Not financial advice disclaimer | Case study, report preview | Required by owner brief §7; add visibly | Required |

---

## Library projects

| Claim | Where used | Evidence | Status |
| --- | --- | --- | --- |
| WordCraft One is a Microsoft Word add-in writing assistant using TypeScript, React, Office.js, and a platform-agnostic Core engine | Library | `wordcraft-one/README.md` | Verified |
| WordCraft is in active development | Library | `README.md` roadmap; `DEPLOY.md` notes pre-AppSource work | Verified |
| WordCraft has a working live demo at the Netlify URL | Library | URL loads the task pane shell on 2026-11-10 | Verified (shell only; in-Word behaviour needs owner confirmation) |
| Lead-Gen Scraper is a local, free lead-generation pipeline with a Streamlit UI and Excel/CSV/JSON export | Library | `lead-gen-scraper/README.md`; `app.py`; `modules/` | Verified |
| Lead-Gen Scraper uses Bing by default, DuckDuckGo fallback, no paid APIs | Library | `README.md` | Verified |
| Smart Sales Assistant is a WhatsApp automation platform with Flask, PostgreSQL, OpenAI, and a React 18 + Recharts dashboard | Library | `projects/smart-whatsapp-bot/requirements.txt`; `frontend/package.json` | Verified |
| Smart Sales Assistant is deployed and operating | Library status | Vercel proxy URL exists; live status not verified | Needs owner input |
| Linklet Telegram Bot is an AI customer-support bot using Groq/Llama 3.3, deployed 24/7 on Render | Library | GitHub repository description; `package.json`; `bot.js` | Verified from repository metadata |
| Linklet Social Poster generates daily posts via Groq and posts to Facebook, Instagram, Pinterest, TikTok with Telegram approval | Library | GitHub repository description; `poster.js`; `package.json` | Verified from repository metadata |
| Linklet Seller Report is a weekly seller-performance email report reading the Linklet PostgreSQL database and sending via Resend | Library | `projects/linklet-seller-report/README.md`; `package.json` | Verified |
| Email Summary Bot sends a daily Gmail digest to WhatsApp via CallMeBot | Library | `projects/email-summary/README.md` | Verified |
| Email Summary Bot uses OpenRouter free models | Library | README says OpenRouter; `requirements.txt` lists `google-generativeai` | Needs owner input — conflicting evidence |
| An AI Telegram bot and UniLink exist | Library | Résumé references only; no repository found | Unverified — omit unless supplied |
| `muniko.php` is a portfolio-relevant project | Library | Public PHP repository; purpose not inspected | Needs owner input |

---

## Assets, links, and metadata

| Claim | Where used | Evidence | Status |
| --- | --- | --- | --- |
| `photo.jpg` is a portrait of Jacob Muniko | About | Supplied file | Verified (owner-supplied) |
| `Jacob_Muniko_Resume.pdf` is current | Hero, About, Contact | Supplied by owner 11 November 2026; education section matches the corrected facts. Project sections still describe the older NSE n8n workflow and FilePilot 0.1.0, so the PDF needs a manual refresh. | Needs owner input |
| Résumé may be published publicly | Hero, About, Contact | Owner supplied the file and instructed that it be linked from the site, 11 November 2026 | Verified by owner statement |
| GitHub profile is `github.com/muniko53` | Footer/contact | Profile loads; 6 public repositories | Verified |
| Linklet live URL is `https://www.linklet.co.ke` | Featured work | Domain resolves; API healthy | Verified at audit date |
| WordCraft demo URL is live | Library | Loads task pane shell | Verified (shell) |
| NSE workflow screenshots are available and sanitized | Case study | None found; old site claimed n8n, which is wrong | Blocked |
| Custom domain is configured | Global | No `CNAME`; site is on `github.io` sub-path | False |
| Site is deployed from the repository root on GitHub Pages | Deployment | Live path structure; no build config | Verified (working assumption; confirm before changing) |
