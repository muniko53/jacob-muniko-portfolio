# Jacob Muniko — Portfolio

A portfolio for Jacob Muniko, a technology builder in Karatina, Kenya. The site
is generated from source files by a small Node script with zero dependencies.

## What it is

- `src/` — source content: JSON for data, HTML for page bodies, CSS, JS, and
  images.
- `build.mjs` — a zero-dependency Node generator that validates the source and
  writes static pages to the repository root.
- The generated output is plain HTML, CSS, and a little JavaScript. There is no
  framework, no build service, and no paid dependency.

## Run the build

```bash
npm run build
```

This reads `src/`, validates the content, and writes `index.html`, `work/`,
`projects/`, `services/`, `about/`, `contact/`, `privacy/`, `404.html`,
`sitemap.xml`, `robots.txt`, `site.webmanifest`, and `assets/` to the repository
root.

GitHub Pages caches HTML and CSS for ten minutes, so the build stamps the CSS
and JS URLs with a hash of their contents (`site.css?v=3d65725b`). The stamp
changes only when those files change, which stops a browser from pairing fresh
HTML with a stale stylesheet.

## Check

```bash
npm run qa
```

This checks local links, template placeholders, duplicate IDs, required page
metadata, and unreferenced assets.

## Preview

```bash
npm run preview
```

This starts a zero-dependency Node preview server on port 4173. It resolves
clean URLs and serves `404.html` for missing paths.

## Deploy

The repository is deployed from the branch root by GitHub Pages, so the generated
pages need no settings change. Run `npm run build` before pushing.

## Résumé

`Jacob_Muniko_Resume.pdf` is the public résumé. It is linked from the home hero,
the About page, and the Contact page.

The source is `docs/resume.html`. Edit that file, open it in Edge or Chrome, and
print to PDF (A4, default margins) to regenerate `Jacob_Muniko_Resume.pdf`. The
PDF is two pages and uses only verified claims from the site content.

## Icons and share images

```bash
python tools/make-icons.py
python tools/make-og.py
python tools/make-thumbs.py
```

`make-icons.py` rebuilds the favicons, touch icon, manifest icons, and
`favicon.ico` from `src/assets/img/brand-logo.png`. `make-og.py` rebuilds the
1200 x 630 share images from the current screenshots. `make-thumbs.py` rebuilds
the 1200 x 750 thumbnails used by the projects page cards, cutting those four
images from about 394 KB to 152 KB. All three require Pillow.

## Layouts

- `src/layouts/base.html` — shared head, nav, footer, theme boot script.
- `src/content/pages/*.html` — page bodies.
- `src/content/work/*.json` + `*.html` — the four case studies.
- `src/content/library/*.json` — the project register.
- `src/content/site.json` — identity, contact details, form configuration.

## Content rules

Every public claim in this site is checked against `docs/CONTENT_VERIFICATION.md`
before it ships. Case files separate implemented features from planned ones,
and honest status lines name what is not yet verified.

## Fonts

Fonts are self-hosted under `assets/fonts/`. See that folder's `README.md` for
the source and licence links.

## Privacy

See [`privacy/`](privacy/) for what this site stores and why.

The Web3Forms access key in `src/content/site.json` is a public form identifier,
not a secret. It is designed to appear in the generated HTML and only routes
inquiries to the configured email address. No API secrets, passwords, or private
keys belong in this repository.