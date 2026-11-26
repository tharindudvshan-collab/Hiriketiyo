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
- Files to upload together: `admin.html`, `content-map.js`, `index.html`, `style.css`, `app.js`, `slideshow.js`, `sw.js` (VERSION is now `hiriketiyo-v34`).
- `admin.html` must stay in the same folder (same origin) as `index.html`, because the preview loads `index.html?hkpreview=1`.

## Discover guide
- `#discover` is the full Hiriketiya article: hero, chapter bar, 7 chapters, nearby places, map, best-time chart, responsible-travel list, planner, closing banner.
- Location buttons are plain Google Maps links (search + directions) and one embedded map; no API key needed. Edit the link in Admin Studio (Discover groups) or in `index.html`.
- Photos: each chapter/place has a slot (`disc-hero`, `disc-bay`, `disc-surf`, `disc-life`, `disc-food`, `disc-nature`, `disc-culture`, `disc-slow`, `disc-p1`..`disc-p5`). Upload in Admin > Photos (use Photo 1 of each group). Empty slots show a teal placeholder.
- In-page jumps use `data-go` + `scrollIntoView` (not `#hash`), because the hash is reserved for page routing in `app.js`.

## Places around Hiriketiya (Discover > Nearby)
- 8 place cards (`#dp1`..`#dp8`, photo slots `disc-p1`..`disc-p8`): Blue Beach Island, Hummanaya Blowhole, Dondra Lighthouse, Turtle Point (Bathigama), Mulkirigala Rock Temple, Rekawa Beach, Mawella Beach, Silent Beach.
- Each card shows the road distance and drive time from Hiriketiya Beach (`.dd b`, `.dt b`). The "How far from the bay" chart above the cards is built by `app.js` from those distances, so editing a distance in Admin Studio updates the chart.
- Distances are approximate road distances. Re-check them if a road or route changes.

## Slideshows
- `slideshow.js` gives every photo slot up to 4 photos (`slot`, `slot-2`, `slot-3`, `slot-4`): hero, About photo, 6 service cards, Discover banner, 7 chapters and the 8 place cards.
- Extra photos inside a `<picture>` (hero, About) are wrapped in a span, because a `<picture>` would otherwise show its first photo again instead of the new one.
- A slideshow only runs while on screen. With reduced motion on, photos swap without a fade, every 9 seconds.

## Places around Hiriketiya (Discover > Nearby)
- 8 place cards (`#dp1`..`#dp8`, photo slots `disc-p1`..`disc-p8`): Blue Beach Island, Hummanaya Blowhole, Dondra Lighthouse, Turtle Point (Bathigama), Mulkirigala Rock Temple, Rekawa Beach, Mawella Beach, Silent Beach.
- Each card shows the road distance and drive time from Hiriketiya Beach (`.dd b`, `.dt b`). The "How far from the bay" chart above the cards is built by `app.js` from those distances, so editing a distance in Admin Studio updates the chart.
- Distances are approximate road distances. Re-check them if a road or route changes.

## Slideshows
- `slideshow.js` gives every photo slot up to 4 photos (`slot`, `slot-2`, `slot-3`, `slot-4`): hero, About photo, 6 service cards, Discover banner, 7 chapters and the 8 place cards.
- Extra photos inside a `<picture>` (hero, About) are wrapped in a span, because a `<picture>` would otherwise show its first photo again instead of the new one.
- A slideshow only runs while on screen. With reduced motion on, photos swap without a fade, every 9 seconds.
