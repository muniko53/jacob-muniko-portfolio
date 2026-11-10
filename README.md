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
`sitemap.xml`, `robots.txt`, and `assets/` to the repository root.

## Preview

```bash
npm run preview
```

This starts a local HTTP server on port 4173.

## Deploy

The repository is deployed from the branch root by GitHub Pages, so the generated
pages need no settings change. Run `npm run build` before pushing.

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