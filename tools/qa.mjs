/* Zero-dependency quality checks for the generated site. */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.cwd());
const IGNORE = new Set([".git", "node_modules", "docs", "src", "tools"]);

function walk(dir, ext = ".html") {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, ext));
    else if (entry.name.endsWith(ext)) out.push(full);
  }
  return out;
}

const files = walk(ROOT);
const problems = [];
const assetRefs = new Set();

for (const file of files) {
  const rel = path.relative(ROOT, file).replaceAll("\\", "/");
  const html = fs.readFileSync(file, "utf8");

  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(url)) continue;
    if (url.startsWith("//")) continue;

    const clean = url.split("#")[0].split("?")[0];
    if (!clean) continue;

    let target = clean.startsWith("/")
      ? path.join(ROOT, clean)
      : path.resolve(path.dirname(file), clean);

    if (clean.endsWith("/")) target = path.join(target, "index.html");
    if (!fs.existsSync(target)) {
      problems.push(`${rel}: missing ${url}`);
    } else if (/\.(png|jpe?g|webp|svg|css|js)$/i.test(clean)) {
      assetRefs.add(path.relative(ROOT, target).replaceAll("\\", "/"));
    }
  }

  if (/\{\{[A-Z_]+\}\}/.test(html)) {
    problems.push(`${rel}: unresolved template placeholder`);
  }

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) problems.push(`${rel}: duplicate id "${id}"`);
    seen.add(id);
  }

  if (!/<html lang="en"/.test(html)) problems.push(`${rel}: missing lang="en"`);
  if (!/<h1[\s>]/.test(html)) problems.push(`${rel}: missing h1`);
  if (!/<meta name="description"/.test(html)) problems.push(`${rel}: missing description`);
  if (!/<link rel="canonical"/.test(html)) problems.push(`${rel}: missing canonical`);
}

const unreferencedAssets = walk(path.join(ROOT, "assets"), "")
  .map((file) => path.relative(ROOT, file).replaceAll("\\", "/"))
  .filter((file) => !assetRefs.has(file) && !file.endsWith(".DS_Store"));

console.log(`Checked ${files.length} HTML pages.`);
if (problems.length) {
  console.log(`\nProblems (${problems.length}):`);
  for (const problem of problems) console.log(`  - ${problem}`);
} else {
  console.log("No broken local links, placeholders, or duplicate ids.");
}

if (unreferencedAssets.length) {
  console.log(`\nAssets not referenced by any page (${unreferencedAssets.length}):`);
  for (const file of unreferencedAssets) console.log(`  - ${file}`);
}

process.exitCode = problems.length ? 1 : 0;
