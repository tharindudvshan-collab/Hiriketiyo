# HIRIKETIYO website

Static site (no build step). Open through any web server; the service worker only runs on `https://` or `localhost`.

```
hiriketiyo/
├── index.html              Markup only (head, header, 6 pages, footer)
├── style.css               All styles (design tokens, layout, logo/hero animation, dark mode)
├── app.js                  Behaviour: hash routing, menu, itinerary planner, form notices, SW registration
├── sw.js                   Service worker: offline app shell + font caching
├── manifest.webmanifest    PWA manifest (name, colours, icons)
├── assets/                 Brand + hero images (extracted from the old inline base64)
│   ├── hero.jpg
│   ├── logo-emblem-{black,white}.png   logo-depth-gold.png   logo-lines-{cream,dark}.png
│   ├── wordmark-{black,white,gold}.png slogan-{black,white}.png   blank.png
└── icons/                  icon-192.png, icon-512.png, maskable-512.png
```

## Run locally
    python3 -m http.server 8000      # then open http://localhost:8000

## Updating
- Edit the file for the concern you are changing (content → index.html, look → style.css, behaviour → app.js).
- **Whenever any file changes, bump `VERSION` in `sw.js`** (e.g. `hiriketiyo-v2`) so returning visitors get the new files.
- If you add or rename a file that must work offline, add it to the `CORE` list in `sw.js`.
  (`cache.addAll` fails the whole install if a listed file is missing.)

## Notes
- This build is pixel-identical to the master `HIRIKETIYO (4).html` (verified on all 6 pages, desktop + mobile).
- Hero image is used twice (hero background and "A horseshoe bay" photo) from the single `assets/hero.jpg`.
- Forms are front-end only: they show a "not sent" notice until a backend is connected.
