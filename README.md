# Arnaud Jouan — Portfolio

A personal portfolio built with plain HTML, CSS, and JavaScript — no framework and no build step. It presents my profile, projects, internship experience, certifications, and contact options across a responsive landing page, a detailed profile page, and a dedicated projects page.

**Live:** https://arjouan.github.io/Portfolio/

## Features

- **Bilingual (EN / FR)** with a language toggle; preference is remembered and the browser language is auto-detected on first visit.
- **Light / dark theme** toggle that follows the OS preference by default and is remembered across visits.
- **Branded loading screen** shown once on a visitor's first arrival.
- **Responsive design** with a mobile hamburger menu, and a fully accessible, keyboard-friendly layout (focus states, `aria` attributes, reduced-motion support).
- **Interactive canvas globe** on the profile page, highlighting the countries I've lived in.
- **Animated reveal effects**, scroll-spy navigation, a scroll progress bar, and a vertical experience timeline.
- **Tech-stack chips** generated from the content.
- **Working contact form** (via Web3Forms) alongside direct email / GitHub / LinkedIn links.
- **Live GitHub section** on the projects page that fetches recent public repositories.
- **Installable PWA** with offline support via a service worker.
- **SEO ready:** Open Graph / Twitter preview card, canonical URLs, `sitemap.xml`, `robots.txt`, and JSON-LD structured data.
- **Privacy-friendly analytics** (GoatCounter — no cookies).
- **Self-contained:** fonts are self-hosted and the globe geometry is bundled locally, so there are no third-party runtime dependencies (other than optional analytics).

For a detailed breakdown of how everything fits together, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Project structure

- `index.html` — main landing page (hero, profile, projects, experience, contact + form)
- `profile.html` — detailed profile (education, internships, certifications, community, projects, skills)
- `projects.html` — per-year EPITECH project details + live GitHub repositories
- `styles.css` — shared styling
- `script.js` — translations, theme, i18n, globe, scroll-spy, loader, contact form, GitHub fetch, service-worker registration
- `sw.js` — service worker (offline cache)
- `manifest.webmanifest` — PWA manifest
- `sitemap.xml`, `robots.txt` — SEO
- `favicon.svg`, `favicon.png`, `apple-touch-icon.png` — icons
- `assets/`
  - `fonts/` — self-hosted Space Grotesk & Sora (woff2 + `fonts.css`)
  - `logos/` — company, school, and certification logos
  - `world-geo.js` — bundled world geometry for the globe
  - `og-image.png` — social preview card
  - `CV/` — CV (PDF)

## Running locally

Open `index.html` directly in a browser, or serve the folder for full functionality:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Note: the **service worker (PWA)** and the **contact form** only work over HTTPS (or `localhost`), so they are inactive when opening the file directly via `file://`.

## Deployment

Hosted on **GitHub Pages** from the `Portfolio` repository. Pushing to the default branch rebuilds and publishes the site automatically.

## Author

**Arnaud Jouan** — [GitHub](https://github.com/Arjouan) · [LinkedIn](https://www.linkedin.com/in/arnaud-jouan-613a53263)
