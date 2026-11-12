#!/usr/bin/env node
/**
 * Zero-dependency local preview server.
 *
 * Serves the generated site from the repository root, resolves clean URLs
 * (`/work/linklet/` -> `work/linklet/index.html`), and falls back to 404.html.
 * Use `npm run preview`; set PORT to override 4173.
 */

import { createServer } from "node:http";
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 4173);
const HOST = "127.0.0.1";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

async function resolveFile(requestUrl) {
  const clean = decodeURIComponent(requestUrl.split("?")[0].split("#")[0]);
  let target = path.resolve(ROOT, clean.replace(/^\/+/, ""));
  const relative = path.relative(ROOT, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;

  try {
    const stat = await fs.stat(target);
    if (stat.isDirectory()) target = path.join(target, "index.html");
  } catch {
    if (!path.extname(target)) target += ".html";
  }

  try {
    const stat = await fs.stat(target);
    return stat.isFile() ? target : null;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  const file = await resolveFile(request.url || "/");

  if (!file) {
    try {
      const body = await fs.readFile(path.join(ROOT, "404.html"));
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(body);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
    }
    return;
  }

  const ext = path.extname(file).toLowerCase();
  response.writeHead(200, {
    "Content-Type": MIME[ext] || "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  createReadStream(file).pipe(response);
});

server.listen(PORT, HOST, () => {
  console.log(`Preview: http://${HOST}:${PORT}/`);
});
