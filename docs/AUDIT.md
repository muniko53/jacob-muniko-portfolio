# Phase 1 Audit and Implementation Plan

- **Audit date:** 2026-11-10
- **Repository:** `github.com/muniko53/jacob-muniko-portfolio`
- **Live site:** `https://muniko53.github.io/jacob-muniko-portfolio/`
- **Baseline commit:** `aec434c` (recoverable tag: `pre-redesign-v2`)
- **Working branch:** `feat/portfolio-v3`
- **Governing brief:** the 30-section master prompt supplied by the owner on 2026-11-10.

This document records what exists, what is true, what is broken, and the plan. It does not
contain marketing copy. Every public claim must pass through
`docs/CONTENT_VERIFICATION.md` before it ships.

---

## 1. What exists today

| Area | Finding |
| --- | --- |
| Architecture | One hand-written `index.html` (25.3 KB) containing all HTML, CSS, and the only script. No framework, build step, package manager, or dependencies. |
| Tracked files | `index.html`, `photo.jpg`, `Jacob_Muniko_Resume.pdf`, `README.md`. No `404.html`, `CNAME`, `robots.txt`, `sitemap.xml`, manifest, or share image. |
| Deployment | GitHub Pages at a repository sub-path (`/jacob-muniko-portfolio/`), served from the repository root. No custom domain. All current links are root-relative to the repository path because there is only one page. |
| Pages | A single page with hash anchors: About, Work, Skills, Testimonials, Contact. No dedicated project pages, no project library, no services page. |
| Work shown | Three items: Linklet, NSE Market Intelligence Agent, WordCraft. `MICA` and `FilePilot` are absent. |
| Theming | Dark-first with a designed light theme, CSS custom properties, `localStorage` key `jm-theme`, and an inline head script that prevents a flash of the wrong theme. This is solid and worth keeping. |
| Contact | `mailto:` only. No form, no WhatsApp, no privacy note, no submission states. |
| Résumé | `Jacob_Muniko_Resume.pdf` (104.9 KB) is linked. Its currency could not be verified because the PDF's text could not be extracted in this environment. |
| Portrait | `photo.jpg`, 1254 × 1254 px, 171.5 KB. Displayed as a 4:5 crop. No responsive variants. |
| Fonts | Three Google font families: Source Serif 4, IBM Plex Sans, IBM Plex Mono. The brief allows at most two. |
| SEO | Title, description, Open Graph title/description/type, Person JSON-LD, inline SVG favicon, theme color. No canonical, no `og:image`, no Twitter card, no sitemap, no robots file, no per-project metadata. |
| Analytics | None. No trackers. |
| Current live status (audited) | Portfolio page loads. `linklet.co.ke` resolves. Linklet API `/api/health` returned `status: ok`, `database: up` on 2026-11-10. |

### Public GitHub visibility

The public profile shows six repositories: `jacob-muniko-portfolio`, `linklet-telegram-bot`,
`smart-whatsapp-bot`, `linklet-social-poster`, `muniko53`, and `muniko.php`. **`linklet`,
`MICA`, `filepilot`, and `nse-bot` are not public.** The current site's "View on GitHub"
links for Linklet and NSE point to the generic profile, which is misleading. Source links
must be hidden or labelled "Private repository" unless the owner publishes them.

---

## 2. Strengths worth preserving

- Genuinely semantic HTML with landmarks, a skip link, `:focus-visible`, reduced-motion
  handling, and print styles.
- A restrained dark palette (ink/teal/amber) that already feels more deliberate than a
  template. The light theme is designed, not inverted.
- Theme persistence without a flash on load.
- Honest "in development" labelling on WordCraft, and a visible anti-placeholder statement.
- Zero dependencies and no trackers: an excellent performance and privacy baseline.
- Real artefacts (portrait, résumé) rather than stock imagery.
- Linklet and MICA have unusually deep local documentation, which can support substantive
  case studies instead of decorative cards.

---

## 3. Problems to correct

### 3.1 Factual accuracy (critical)

| Problem | Evidence |
| --- | --- |
| The NSE project is described as an **n8n** workflow using **Yahoo Finance**, **Reuters RSS**, **Claude**, and **SMTP**. The code is a **Node.js** bot scheduled by **GitHub Actions**, using **AFX Kenya** for prices, **Google News RSS** for headlines, **Resend** for email, and an **optional self-hosted FreeLLMAPI** gateway with a deterministic fallback. | `projects/nse-bot/README.md`, `package.json`, `.github/workflows/nse-daily-report.yml`, `PLAN.md` |
| Linklet's backend is described as **Render**. It is **Google Cloud Run** (`us-central1`). | `linklet/README.md`, `linklet/ARCHITECTURE.md` |
| The site published the business registration number. The brief explicitly forbids publishing it. | `index.html` line 632; number redacted from this ledger |
| Education details were inconsistent with the owner's programme and stage. | `index.html` line 609 vs. brief §24. **Resolved 11 November 2026**: corrected to B.Ed (Arts), Business Studies and Geography, final year, expected November 2027. |
| A **placeholder testimonial** is published, framed as a placeholder. The brief says remove placeholder social proof. | `index.html` lines 750–760 |
| "Platform is live and operating" is plausible but unqualified. The API health check supports "live"; "operating" implies business activity that is not verified. | `index.html` line 636 |
| "Generalist AI training" positioning dilutes the technology-builder identity and is not supported by any project page. | `index.html` hero and About |
| NSE "runs unattended" is true for the scheduled workflow, but the AI commentary is optional and falls back to deterministic analysis. The current copy implies a guaranteed Claude analysis step. | `nse-bot/README.md` |
| WordCraft's live demo link works, but the copy calls it an "Office add-in" while the repo is a TypeScript/React/Office.js project. That is accurate; the stack list omits TypeScript and React. | `wordcraft-one/README.md` |

### 3.2 Structure and content

- No dedicated case-study pages, so projects cannot be shared or indexed individually.
- No project library, filters, or detail views for the smaller projects.
- No services section, despite freelance clients being the primary audience.
- No project inquiry form. The only action is `mailto:`.
- No visual evidence of any project: no screenshots, diagrams, or interface captures.
- Navigation is a single-page anchor list that includes a section with no real content.
- The hero has no primary or secondary call to action. It offers an email address and a
  GitHub profile, which assumes the visitor already knows what to do.
- About is written as a student biography rather than a working method and capability
  statement.

### 3.3 Accessibility

- The theme control is a `<button>` with `aria-pressed` and a label that changes between
  "Light mode" and "Dark mode". It works, but the state is ambiguous to screen readers;
  a native `<button>` with a stable accessible name plus `aria-pressed`, or a labelled
  switch, is clearer.
- The mobile navigation relies on a horizontally scrolling list. It technically works but
  is hard to discover and cramped at 320 px.
- The theme toggle's touch target is roughly 30 px high, below the 44 px target.
- Small "faint" text (0.82 rem) sits close to the 4.5:1 contrast threshold in both themes.
- No form means no validation, error, or status patterns yet.
- Focus styles and reduced-motion support are present and should be retained.

### 3.4 Performance

- `photo.jpg` is 171.5 KB at 1254 × 1254 and is served at 10 rem wide. It needs responsive
  variants and a modern format.
- Three font families add avoidable requests and payload.
- The single HTML file is small, and there is almost no JavaScript, so the baseline is fast.
  The redesign must not regress this with a framework or animation library.
- Lighthouse has not been run against the baseline yet; Phase 6 will record mobile and
  desktop scores.

### 3.5 SEO and sharing

- No canonical URL, `og:image`, Twitter card, sitemap, or robots file.
- No per-project titles/descriptions because there are no project pages.
- The Person JSON-LD is reasonable but repeats unverified positioning.
- GitHub Pages sub-path routing must be respected by every internal link.

### 3.6 Maintainability

- Content and presentation are coupled in one 774-line file. Adding a project means editing
  markup, and every new page would duplicate the navigation and footer.
- No content schema, no build command, no documentation for adding work.
- The README describes the site accurately but has no content workflow.

---

## 4. Recommended architecture

**Keep it static. Add a zero-dependency generator, not a framework.**

- `src/` holds layouts, partials, content, and source assets.
- `build.mjs` (Node, no npm dependencies) renders pages into the repository root so the
  current GitHub Pages "deploy from branch, root" arrangement keeps working unchanged.
- Generated output is committed: `index.html`, `work/<slug>/index.html`,
  `projects/index.html`, `projects/<slug>/index.html`, `services/index.html`,
  `about/index.html`, `contact/index.html`, `404.html`, `sitemap.xml`, `robots.txt`, and
  `assets/`.
- Content lives in JSON + HTML fragments, not in a CMS and not in a database.
- A small shared CSS layer and three small JS modules handle theme, mobile navigation, and
  library filtering. Core content works with JavaScript disabled.

### Why this instead of Astro or a hand-written multi-page site

| Option | Verdict |
| --- | --- |
| **Zero-dependency generator (recommended)** | Keeps the current deployment model, keeps the site fast, avoids dependency rot, and removes nav/footer duplication across ~15 pages. One command: `node build.mjs`. |
| Astro | Excellent tool, but adds a dependency tree and normally requires changing Pages to a GitHub Actions build. That is a deployment change the brief says not to make casually. |
| Hand-written pages | Simple at first, but navigation, metadata, and footer would be duplicated across every page and drift immediately. |
| Client-side SPA | Bad for SEO, sharing, and no-JS resilience. Rejected. |

### Proposed structure

```text
/
  index.html                      generated
  work/
    linklet/index.html            generated case study
    mica/index.html
    filepilot/index.html
    nse-agent/index.html
  projects/
    index.html                    library with filters
    <slug>/index.html             generated detail pages
  services/index.html
  about/index.html
  contact/index.html
  404.html
  sitemap.xml
  robots.txt
  assets/
    css/site.css
    js/site.js
    js/library.js
    js/contact.js
    img/...
  src/
    layouts/base.html
    partials/nav.html
    partials/footer.html
    content/site.json
    content/work/*.json + *.html
    content/library/*.json
    content/pages/*.html
    assets/...                    source CSS/JS/images
  docs/
  build.mjs
```

### Content model

- `src/content/site.json`: name, tagline, contact details, availability, navigation.
- `src/content/work/<slug>.json`: title, summary, category, status, stack, links, visual
  assets, SEO fields, and ordered section metadata.
- `src/content/work/<slug>.html`: the case-study body, authored as semantic HTML fragments.
- `src/content/library/<slug>.json`: name, slug, category, status, summary, problem, solution,
  stack, links, optional image.
- Library pages are generated from the JSON; adding a project is one file.
- Validation in `build.mjs` fails the build on missing required fields, duplicate slugs, or
  unknown statuses.

### Design system

- **Direction:** an engineer's field notebook. Editorial serif headlines, quiet sans body,
  system monospace metadata, hairline rules, generous whitespace, a numbered section
  rhythm, and evidence-first project layouts. No gradients, glass, floating blobs, or
  generic dashboard cards.
- **Palette:** keep the warm off-black, paper light theme, teal signal accent, and amber
  secondary. Define semantic tokens for text, surface, rule, accent, and status.
- **Type:** two families only. Source Serif 4 for display; IBM Plex Sans for body/UI;
  `ui-monospace` for labels. Drop the IBM Plex Mono webfont.
- **Layout:** 68–72 ch measure, 56 rem content width, a wider project grid only where
  screenshots need it. Mobile-first; breakpoints at 560, 768, 1024, 1280.
- **Components:** nav, theme control, mobile menu, buttons (primary/secondary/quiet),
  status pills, project rows, evidence frames, filter chips, form fields, callouts.
- **Motion:** 120–200 ms opacity/translate entrances, hover/focus transitions only.
  `prefers-reduced-motion` disables all non-essential motion.

### Homepage order

1. Navigation
2. Hero: who, what, why, primary "Start a Project", secondary "Explore My Work", quiet
   résumé link, availability in EAT
3. Featured work: Linklet, MICA, FilePilot, NSE — each with a real visual, one-sentence
   outcome, status, and stack
4. Services: four client-focused offers
5. Selected stack, grouped by discipline and linked to evidence
6. Project library preview with "Browse all projects"
7. About: working method and a short, honest "How I build" note
8. Contact: inquiry form + email + WhatsApp + response time
9. Footer

### Contact

- Recommend **Web3Forms** (free tier: 250 submissions/month, no backend, public access key,
  honeypot support). Fallback: Formspree (50/month) or Getform (50/month).
- No secrets in the frontend. The access key is public by design; the destination email is
  configured in the Web3Forms dashboard.
- Honeypot + submission timing check + Web3Forms spam filtering. Turnstile only if spam
  becomes a real problem.
- Visible `mailto:` and WhatsApp fallbacks. Success is shown only after the service
  confirms; failure preserves the message and offers the fallbacks.
- A short privacy note consistent with Kenya's Data Protection Act, 2019.
- Setup documented in `docs/CONTACT_FORM_SETUP.md`.

---

## 5. Phases and acceptance

| Phase | Deliverable | Acceptance |
| --- | --- | --- |
| 1. Audit (this document) | Audit, verification ledger, asset checklist, backup tag, branch | Complete |
| 2. Design system + homepage | Tokens, base layout, nav, theme, hero, featured work, services teaser, skills, library preview, about teaser, contact CTA, footer | Deployable at repo root; themes, keyboard nav, and 320–1440 px layouts pass |
| 3. Four case studies | Linklet, MICA, FilePilot, NSE pages with verified content and real visuals | Every claim in the ledger; no broken links; each page shareable |
| 4. Library + skills | Filterable/searchable library, detail pages, evidence-linked skills | Search, category/status filters, empty state, clear-filters, keyboard access |
| 5. Services, About, Contact | Four service offers, profile, working form with fallbacks | Form confirmed end-to-end or explicitly documented as pending owner key |
| 6. QA + deployment | Responsive, accessibility, performance, SEO, links, console, Pages paths | `docs/QA_REPORT.md` with Pass/Fail/Not run and Lighthouse scores |

Each phase ends in a deployable state. Nothing is pushed to `main` or to GitHub Pages
settings until the owner approves a preview.

---

## 6. Blockers and decisions needed

1. **FilePilot has no local source and no public repository.** It cannot be truthfully
   case-studied from the brief alone. Need the repository path or a zip, plus screenshots.
2. **Linklet, MICA, and NSE repositories are private/unpublished.** Need a decision: keep
   source links hidden, label them "Private", or publish sanitized repositories.
3. **MICA is publishable only if its documentation and screenshots contain no secrets.**
   Local `.env`, `.mica-secrets.json`, and token files must never be copied into the site.
4. **Linklet M-Pesa mode (sandbox vs live) is unverified.** The site must not imply real
   payments until confirmed.
5. **Contact details:** public email confirmation, WhatsApp number, LinkedIn URL.
6. **Résumé currency and publication permission.**
7. **Library statuses** for WordCraft, Lead-Gen Scraper, Smart Sales Assistant, Telegram
   bot, Social Poster, Seller Report, and Email Summary.
8. **Authenticated Linklet screenshots** (chat, admin, seller flows) need the owner or a
   seeded demo account; public pages can be captured headlessly.
9. **Form service and analytics approval.** Default recommendation: Web3Forms, no analytics.
10. **Custom domain** is a later decision; no purchase without approval.

Answers and defaults are requested in the Phase 1 reply. Until then, Phase 2 can proceed on
the design system, homepage shell, and verified content; case-study copy for FilePilot and
any unverified claim stays blocked.
