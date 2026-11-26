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
│   ├── hero-{1200,1920,2560}.{webp,jpg}   hero background (responsive <picture>, WebP first)
│   ├── bay-{600,1000}.{webp,jpg}          "A horseshoe bay" photo (4:5 crop)
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
- Hero: `<picture class="hero-bg">` (WebP + JPG, 3 widths, `fetchpriority=high`, preloaded in `<head>`), a `.hero-shade` overlay for text legibility, and a slow zoom that is disabled under `prefers-reduced-motion`.
- To change the hero photo: export 1200/1920/2560px widths as WebP (q~80) and JPG (q~82) with the same names, then bump `VERSION` in `sw.js`.
- Forms are front-end only: they show a "not sent" notice until a backend is connected.

## Admin Studio (admin.html)
- Edit every text, link and section switch of the site, with a live preview (Desktop / Tablet / Phone, Light / Dark, any page) and **Click to edit** inside the preview.
- `content-map.js` is the single list of editable items (selector -> label). To make something new editable, add ONE line there. Both `index.html` and `admin.html` load it.
- Text, links, switches and custom CSS are saved in Supabase `site_theme` under key `content` (the design stays under key `theme`), so no new table is needed.
- Files to upload together: `admin.html`, `content-map.js`, `data.js`, `index.html`, `sw.js` (VERSION is now `hiriketiyo-v33`).
- `admin.html` must stay in the same folder (same origin) as `index.html`, because the preview loads `index.html?hkpreview=1`.
