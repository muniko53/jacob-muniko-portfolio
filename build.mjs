#!/usr/bin/env node
/**
 * Zero-dependency static site generator for jacob-muniko-portfolio.
 *
 * Source:  src/
 * Output:  repository root (index.html, work/, projects/, assets/, ...)
 *
 * Why root output: GitHub Pages currently serves this repository from the
 * branch root. Generating there means no Pages settings change and no build
 * service. Run `npm run build` after editing content.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(ROOT, "src");
const OUT = ROOT;

const read = (p) => fs.readFile(p, "utf8");
const readJSON = async (p) => JSON.parse(await read(p));
const exists = async (p) => {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
};

const esc = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const site = await readJSON(path.join(SRC, "content/site.json"));

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const workDir = path.join(SRC, "content/work");
const work = [];
for (const file of (await fs.readdir(workDir)).filter((f) => f.endsWith(".json"))) {
  const data = await readJSON(path.join(workDir, file));
  const bodyPath = path.join(workDir, file.replace(/\.json$/, ".html"));
  data.body = (await exists(bodyPath)) ? await read(bodyPath) : "";
  data.order = Number(data.order || 0);
  work.push(data);
}
work.sort((a, b) => a.order - b.order);

const libraryDir = path.join(SRC, "content/library");
const library = [];
for (const file of (await fs.readdir(libraryDir)).filter((f) => f.endsWith(".json"))) {
  library.push(await readJSON(path.join(libraryDir, file)));
}
library.sort((a, b) => Number(a.order ?? 99) - Number(b.order ?? 99) || a.name.localeCompare(b.name));

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

const errors = [];
const warnings = [];
const workStatuses = ["Live", "Beta", "In development", "Scheduled"];
const libraryStatuses = ["Completed", "In Development", "Experiment", "Concept"];

const seenWork = new Set();
for (const item of work) {
  for (const key of ["slug", "title", "category", "status", "summary", "card", "role", "stack", "hero"]) {
    if (!item[key] || (Array.isArray(item[key]) && item[key].length === 0)) {
      errors.push(`work/${item.slug || "?"}: missing "${key}"`);
    }
  }
  if (seenWork.has(item.slug)) errors.push(`duplicate work slug: ${item.slug}`);
  seenWork.add(item.slug);
  if (!workStatuses.includes(item.status)) errors.push(`work/${item.slug}: bad status "${item.status}"`);
  if (!item.body.trim()) errors.push(`work/${item.slug}: empty case-study body`);
  if (item.hero && !(await exists(path.join(SRC, "assets/img", item.hero)))) {
    errors.push(`work/${item.slug}: missing hero image ${item.hero}`);
  }
}

const seenLibrary = new Set();
for (const item of library) {
  for (const key of ["slug", "name", "category", "status", "summary", "problem", "solution", "stack"]) {
    if (!item[key] || (Array.isArray(item[key]) && item[key].length === 0)) {
      errors.push(`library/${item.slug || item.name || "?"}: missing "${key}"`);
    }
  }
  if (seenLibrary.has(item.slug)) errors.push(`duplicate library slug: ${item.slug}`);
  seenLibrary.add(item.slug);
  if (!libraryStatuses.includes(item.status)) {
    errors.push(`library/${item.slug}: bad status "${item.status}"`);
  }
}

if (errors.length) {
  console.error("\nBuild stopped. Fix these content errors:\n");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
for (const warning of warnings) console.warn(`warning: ${warning}`);

/* ------------------------------------------------------------------ */
/* Templates                                                           */
/* ------------------------------------------------------------------ */

const layout = await read(path.join(SRC, "layouts/base.html"));
const formPartial = await read(path.join(SRC, "partials/form.html"));

function rootFor(relFile) {
  const depth = relFile.split("/").length - 1;
  return depth ? "../".repeat(depth) : "./";
}

function navFor(root, active) {
  const items = [
    ["projects", "Projects", "projects/"],
    ["services", "Services", "services/"],
    ["about", "About", "about/"],
    ["contact", "Contact", "contact/"],
    ["privacy", "Privacy", "privacy/"],
  ];
  const desktop = items
    .map(
      ([key, label, href]) =>
        `<li><a href="${root}${href}"${key === active ? ' aria-current="page"' : ""}>${label}</a></li>`
    )
    .join("\n        ");
  const mobile = items
    .map(
      ([key, label, href]) =>
        `<a href="${root}${href}"${key === active ? ' aria-current="page"' : ""}>${label}</a>`
    )
    .join("\n          ");

  return `<header class="site-head">
  <div class="head-inner">
    <a class="brand" href="${root}" aria-label="Jacob Muniko — home">
      <span class="brand-mark" aria-hidden="true"><img src="${root}assets/img/brand-mark.png" alt="" width="30" height="30" loading="eager" decoding="async"></span>
      <span class="brand-name">Jacob Muniko</span>
    </a>

    <nav class="desktop-nav" aria-label="Primary">
      <ul>
        ${desktop}
      </ul>
    </nav>

    <div class="head-actions">
      <a class="nav-cta" href="${root}contact/">Start a project</a>
      <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to light theme" title="Switch theme">
        <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></svg>
      </button>

      <details class="mobile-menu">
        <summary aria-label="Menu">
          <span class="menu-bars" aria-hidden="true"><span></span><span></span></span>
          <span class="menu-label">Menu</span>
        </summary>
        <div class="menu-panel">
          <nav aria-label="Mobile">
          ${mobile}
          </nav>
          <a class="btn btn-primary" href="${root}contact/">Start a project</a>
          <p class="menu-note">${esc(site.location)}. ${esc(site.timezone)}.</p>
        </div>
      </details>
    </div>
  </div>
</header>`;
}

function footerFor(root) {
  return `<footer class="site-foot">
  <div class="foot-inner">
    <div class="foot-brand">
      <a class="brand" href="${root}" aria-label="Jacob Muniko — home">
        <span class="brand-mark" aria-hidden="true"><img src="${root}assets/img/brand-mark.png" alt="" width="30" height="30" loading="eager" decoding="async"></span>
        <span class="brand-name">Jacob Muniko</span>
      </a>
      <p class="foot-line">${esc(site.tagline)}</p>
      <p class="foot-line">${esc(site.location)}. ${esc(site.timezone)}.</p>
      <p class="foot-line foot-avail"><span class="dot dot-live" aria-hidden="true"></span>${esc(site.availability)}</p>
    </div>
    <nav class="foot-links" aria-label="Footer">
      <a href="${root}projects/">Projects</a>
      <a href="${root}services/">Services</a>
      <a href="${root}about/">About</a>
      <a href="${root}contact/">Contact</a>
      <a href="${root}privacy/">Privacy</a>
    </nav>
    <div class="foot-contact">
      <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>
      <a href="https://wa.me/${esc(site.whatsapp)}" rel="noopener">WhatsApp</a>
      <a href="${esc(site.github)}" rel="noopener">GitHub</a>
    </div>
    <div class="foot-base">
      <span>© ${new Date().getFullYear()} Jacob Muniko</span>
      <span>No advertising trackers. No cookie banner.</span>
    </div>
  </div>
</footer>`;
}

function analyticsTag() {
  if (site.analytics?.provider !== "goatcounter" || !site.analytics?.siteCode) return "";
  return `<script data-goatcounter="https://${esc(site.analytics.siteCode)}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`;
}

function page({
  relFile,
  title,
  description,
  canonicalPath,
  bodyClass = "",
  ogImage = "assets/img/og-home.png",
  content,
  active = "",
  scripts = [],
  robots = "index,follow",
}) {
  const root = rootFor(relFile);
  const cleanPath = canonicalPath.replace(/^\/|\/$/g, "");
  const canonical = cleanPath
    ? `${site.url}/${cleanPath}${path.extname(cleanPath) ? "" : "/"}`
    : `${site.url}/`;
  const ogAbsolute = `${site.url}/${ogImage}`;
  const vars = {
    LANG: "en",
    TITLE: esc(title),
    DESCRIPTION: esc(description),
    CANONICAL: esc(canonical),
    OG_TITLE: esc(title),
    OG_DESCRIPTION: esc(description),
    OG_IMAGE: esc(ogAbsolute),
    THEME_COLOR: "#0C0F0E",
    ROBOTS: robots,
    ROOT: root,
    NAV: navFor(root, active),
    FOOTER: footerFor(root),
    CONTENT: content,
    BODY_CLASS: bodyClass,
    ANALYTICS: analyticsTag(),
    SCRIPTS: scripts.map((s) => `<script src="${root}assets/js/${s}" defer></script>`).join("\n"),
    YEAR: String(new Date().getFullYear()),
  };
  let html = layout;
  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }
  return { relFile, html };
}

async function writePage(relFile, html) {
  const target = path.join(OUT, relFile);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, html, "utf8");
  return relFile;
}

/* ------------------------------------------------------------------ */
/* Reusable sections                                                   */
/* ------------------------------------------------------------------ */

const statusClass = (status) =>
  ({
    Live: "status-live",
    Beta: "status-beta",
    "In development": "status-dev",
    Scheduled: "status-auto",
    Completed: "status-live",
    "In Development": "status-dev",
    Experiment: "status-beta",
    Concept: "status-concept",
  })[status] || "status-dev";

const arrow = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5"/></svg>`;

function workCard(item, root) {
  return `<article class="work-row">
  <div class="work-copy">
    <p class="work-kicker">${esc(item.category)}</p>
    <h3><a href="${root}work/${esc(item.slug)}/">${esc(item.title)}</a></h3>
    <p class="work-summary">${esc(item.card)}</p>
    <p class="work-status"><span class="status ${statusClass(item.status)}">${esc(item.status)}</span><span class="work-stack">${esc(item.stack.slice(0, 3).join(", "))}</span></p>
    <a class="text-link" href="${root}work/${esc(item.slug)}/">Read the case file</a>
  </div>
  <figure class="work-visual">
    <a href="${root}work/${esc(item.slug)}/" aria-label="${esc(item.title)} case file">
      <img src="${root}assets/img/${esc(item.hero)}" alt="${esc(item.heroAlt)}" width="${item.heroWidth || 1320}" height="${item.heroHeight || 820}" loading="lazy" decoding="async">
    </a>
    <figcaption>${esc(item.heroCaption || `${item.title}.`)}</figcaption>
  </figure>
</article>`;
}

function featuredCard(item, root) {
  return `<article class="project-card">
  <a class="project-card-media" href="${root}work/${esc(item.slug)}/" aria-label="${esc(item.title)} case file">
    <img src="${root}assets/img/${esc(item.hero)}" alt="${esc(item.heroAlt)}" width="${item.heroWidth || 1320}" height="${item.heroHeight || 820}" loading="lazy" decoding="async">
  </a>
  <div class="project-card-body">
    <p class="work-kicker">${esc(item.category)}</p>
    <h3><a href="${root}work/${esc(item.slug)}/">${esc(item.title)}</a></h3>
    <p class="work-summary">${esc(item.card)}</p>
    <p class="work-status"><span class="status ${statusClass(item.status)}">${esc(item.status)}</span><span class="work-stack">${esc(item.stack.slice(0, 3).join(", "))}</span></p>
    <a class="text-link" href="${root}work/${esc(item.slug)}/">Read the case file</a>
  </div>
</article>`;
}

function libraryRow(item, root) {
  return `<article class="lib-row" data-category="${esc(item.category)}" data-status="${esc(item.status)}" data-search="${esc(`${item.name} ${item.summary} ${item.stack.join(" ")}`.toLowerCase())}">
  <div class="lib-main">
    <p class="lib-meta"><span class="status ${statusClass(item.status)}">${esc(item.status)}</span><span class="lib-category">${esc(item.category)}</span></p>
    <h3><a href="${root}projects/${esc(item.slug)}/">${esc(item.name)}</a></h3>
    <p>${esc(item.summary)}</p>
    <p class="lib-stack">${esc(item.stack.join(", "))}</p>
  </div>
  <a class="lib-open" href="${root}projects/${esc(item.slug)}/" aria-label="Open ${esc(item.name)}">${arrow}</a>
</article>`;
}

function formBlock(root) {
  const configured = Boolean(site.form?.accessKey);
  return formPartial
    .replaceAll("{{ROOT}}", root)
    .replaceAll("{{ACCESS_KEY}}", esc(site.form?.accessKey || ""))
    .replaceAll("{{CONFIGURED}}", configured ? "true" : "false")
    .replaceAll("{{EMAIL}}", esc(site.email))
    .replaceAll("{{WHATSAPP}}", esc(site.whatsapp))
    .replaceAll("{{WHATSAPP_DISPLAY}}", esc(site.whatsappDisplay || site.whatsapp));
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

const written = [];

/* Home */
{
  const root = "./";
  const pageTemplate = await read(path.join(SRC, "content/pages/home.html"));
  const vars = {
    ROOT: root,
    FEATURED: work.map((item) => workCard(item, root)).join("\n"),
    LIBRARY_PREVIEW: library.slice(0, 4).map((item) => libraryRow(item, root)).join("\n"),
    FORM: formBlock(root),
  };
  let content = pageTemplate;
  for (const [key, value] of Object.entries(vars)) content = content.replaceAll(`{{${key}}}`, value);
  const out = page({
    relFile: "index.html",
    title: "Jacob Muniko — Technology builder in Karatina, Kenya",
    description:
      "Jacob Muniko builds practical software: web applications, local AI tools, Windows utilities, and automation. Based in Karatina, Kenya. Open for freelance and contract work.",
    canonicalPath: "",
    content,
    scripts: [],
  });
  written.push(await writePage(out.relFile, out.html));
}

/* Work case studies */
for (const item of work) {
  const relFile = `work/${item.slug}/index.html`;
  const root = rootFor(relFile);
  const template = await read(path.join(SRC, "content/pages/work.html"));
  const metaRows = [
    ["Role", item.role],
    ["Status", item.status],
    ["Stack", item.stack.join(", ")],
    item.timeline ? ["Timeline", item.timeline] : null,
  ]
    .filter(Boolean)
    .map(
      ([label, value]) =>
        `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`
    )
    .join("\n      ");

  const links = (item.links || [])
    .map(
      (link) =>
        `<a class="btn ${link.type === "primary" ? "btn-primary" : "btn-secondary"}" href="${link.internal ? `${root}${link.url.replace(/^\/+/, "")}` : esc(link.url)}"${link.external ? ' rel="noopener"' : ""}>${esc(link.label)}</a>`
    )
    .join("\n      ");

  const heroClass =
    item.heroFit === "contain"
      ? "case-hero-contain"
      : item.heroFit === "crop"
        ? "case-hero-crop"
        : "";

  const vars = {
    ROOT: root,
    TITLE: esc(item.title),
    CATEGORY: esc(item.category),
    STATUS: esc(item.status),
    STATUS_CLASS: statusClass(item.status),
    SUMMARY: esc(item.summary),
    HERO: esc(item.hero),
    HERO_CLASS: heroClass,
    HERO_ALT: esc(item.heroAlt),
    HERO_CAPTION: item.heroCaption ? `<figcaption>${esc(item.heroCaption)}</figcaption>` : "",
    HERO_FULL_LINK: item.hero.endsWith(".svg")
      ? `<p class="figure-note"><a href="${root}assets/img/${esc(item.hero)}" target="_blank" rel="noopener">Open the full diagram</a></p>`
      : "",
    HERO_WIDTH: String(item.heroWidth || 1320),
    HERO_HEIGHT: String(item.heroHeight || 820),
    META_ROWS: metaRows,
    LINKS: links || `<a class="btn btn-primary" href="${root}contact/">Discuss a similar project</a>`,
    BODY: item.body.replaceAll("{{ROOT}}", root),
    NEXT: (item.next || []).map((n) => `<li>${esc(n)}</li>`).join(""),
  };
  let content = template;
  for (const [key, value] of Object.entries(vars)) content = content.replaceAll(`{{${key}}}`, value);
  const out = page({
    relFile,
    title: item.seoTitle || `${item.title} — Jacob Muniko`,
    description: item.seoDescription || item.summary,
    canonicalPath: `work/${item.slug}`,
    content,
    active: "projects",
    ogImage: `assets/img/${item.ogImage || item.hero.replace(/\.webp$/, "") + "-og.png"}`,
    scripts: [],
  });
  written.push(await writePage(out.relFile, out.html));
}

/* Projects library */
{
  const relFile = "projects/index.html";
  const root = rootFor(relFile);
  const categories = [...new Set(library.map((p) => p.category))].sort();
  const statuses = ["Completed", "In Development", "Experiment", "Concept"].filter((s) =>
    library.some((p) => p.status === s)
  );
  const template = await read(path.join(SRC, "content/pages/projects.html"));
  const vars = {
    ROOT: root,
    FEATURED_CARDS: work.map((item) => featuredCard(item, root)).join("\n"),
    ROWS: library.map((item) => libraryRow(item, root)).join("\n"),
    CATEGORY_OPTIONS: categories
      .map((c) => `<option value="${esc(c)}">${esc(c)}</option>`)
      .join(""),
    STATUS_OPTIONS: statuses
      .map((s) => `<option value="${esc(s)}">${esc(s)}</option>`)
      .join(""),
    COUNT: String(library.length),
  };
  let content = template;
  for (const [key, value] of Object.entries(vars)) content = content.replaceAll(`{{${key}}}`, value);
  const out = page({
    relFile,
    title: "Projects — Jacob Muniko",
    description:
      "Case studies and a project register by Jacob Muniko: web applications, AI tools, desktop software, automation, and data pipelines.",
    canonicalPath: "projects",
    content,
    active: "projects",
    scripts: ["library.js"],
  });
  written.push(await writePage(out.relFile, out.html));
}

/* Library detail pages */
for (const item of library) {
  const relFile = `projects/${item.slug}/index.html`;
  const root = rootFor(relFile);
  const template = await read(path.join(SRC, "content/pages/library-item.html"));
  const links = (item.links || [])
    .map(
      (link) =>
        `<a class="btn ${link.type === "primary" ? "btn-primary" : "btn-secondary"}" href="${link.internal ? `${root}${link.url.replace(/^\/+/, "")}` : esc(link.url)}"${link.external ? ' rel="noopener"' : ""}>${esc(link.label)}</a>`
    )
    .join("\n      ");
  const vars = {
    ROOT: root,
    NAME: esc(item.name),
    CATEGORY: esc(item.category),
    STATUS: esc(item.status),
    STATUS_CLASS: statusClass(item.status),
    SUMMARY: esc(item.summary),
    PROBLEM: esc(item.problem),
    SOLUTION: esc(item.solution),
    NOTES: (item.notes || "").replaceAll("{{ROOT}}", root),
    STACK: item.stack.map((s) => `<li>${esc(s)}</li>`).join(""),
    LINKS: links || `<a class="btn btn-secondary" href="${root}contact/">Ask about this project</a>`,
  };
  let content = template;
  for (const [key, value] of Object.entries(vars)) content = content.replaceAll(`{{${key}}}`, value);
  const out = page({
    relFile,
    title: `${item.name} — Jacob Muniko`,
    description: item.summary,
    canonicalPath: `projects/${item.slug}`,
    content,
    active: "projects",
  });
  written.push(await writePage(out.relFile, out.html));
}

/* Services */
{
  const relFile = "services/index.html";
  const root = rootFor(relFile);
  const template = await read(path.join(SRC, "content/pages/services.html"));
  const content = template.replaceAll("{{ROOT}}", root);
  const out = page({
    relFile,
    title: "Services — Jacob Muniko",
    description:
      "Web development, AI development, workflow automation, and custom software. Independent technology builder in Karatina, Kenya.",
    canonicalPath: "services",
    content,
    active: "services",
  });
  written.push(await writePage(out.relFile, out.html));
}

/* About */
{
  const relFile = "about/index.html";
  const root = rootFor(relFile);
  const template = await read(path.join(SRC, "content/pages/about.html"));
  const content = template.replaceAll("{{ROOT}}", root);
  const out = page({
    relFile,
    title: "About — Jacob Muniko",
    description:
      "Jacob Muniko is a technology builder in Karatina, Kenya, completing a Bachelor of Education (Arts) at Karatina University while building web, AI, desktop, and automation software.",
    canonicalPath: "about",
    content,
    active: "about",
  });
  written.push(await writePage(out.relFile, out.html));
}

/* Contact */
{
  const relFile = "contact/index.html";
  const root = rootFor(relFile);
  const template = await read(path.join(SRC, "content/pages/contact.html"));
  const content = template
    .replaceAll("{{ROOT}}", root)
    .replaceAll("{{FORM}}", formBlock(root));
  const out = page({
    relFile,
    title: "Contact — Jacob Muniko",
    description:
      "Start a project with Jacob Muniko: web development, AI tools, automation, and custom software. Email, WhatsApp, or use the project inquiry form.",
    canonicalPath: "contact",
    content,
    active: "contact",
    scripts: ["contact.js"],
  });
  written.push(await writePage(out.relFile, out.html));
}

/* Privacy */
{
  const relFile = "privacy/index.html";
  const root = rootFor(relFile);
  const template = await read(path.join(SRC, "content/pages/privacy.html"));
  const content = template.replaceAll("{{ROOT}}", root);
  const out = page({
    relFile,
    title: "Privacy — Jacob Muniko",
    description:
      "What the portfolio stores in your browser, how inquiry messages are handled, and why there are no advertising trackers.",
    canonicalPath: "privacy",
    content,
  });
  written.push(await writePage(out.relFile, out.html));
}

/* 404 */
{
  const template = await read(path.join(SRC, "content/pages/404.html"));
  const out = page({
    relFile: "404.html",
    title: "Page not found — Jacob Muniko",
    description: "That page does not exist. Browse projects or get in touch.",
    canonicalPath: "404.html",
    content: template.replaceAll("{{ROOT}}", "./"),
    robots: "noindex,follow",
  });
  written.push(await writePage(out.relFile, out.html));
}

/* ------------------------------------------------------------------ */
/* Sitemap, robots, assets                                             */
/* ------------------------------------------------------------------ */

const urls = written
  .filter((f) => f !== "404.html")
  .map((f) => {
    const clean = f.replace(/index\.html$/, "").replace(/\\/g, "/");
    return `${site.url}/${clean}`.replace(/\/+$/, "/");
  });

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...new Set(urls)].map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;
await fs.writeFile(path.join(OUT, "sitemap.xml"), sitemap, "utf8");

await fs.writeFile(
  path.join(OUT, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
  "utf8"
);

/* Copy assets (clean first so deleted sources do not linger) */
const assetsOut = path.join(OUT, "assets");
await fs.rm(assetsOut, { recursive: true, force: true });
await fs.mkdir(assetsOut, { recursive: true });
await fs.cp(path.join(SRC, "assets"), assetsOut, { recursive: true });
await fs.copyFile(path.join(SRC, "site.webmanifest"), path.join(OUT, "site.webmanifest"));

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */

console.log(`\nBuilt ${written.length} pages with zero dependencies.\n`);
for (const file of written) console.log(`  ${file}`);
console.log(`\n  sitemap.xml (${new Set(urls).size} URLs)`);
console.log("  robots.txt");
console.log("  assets/\n");
