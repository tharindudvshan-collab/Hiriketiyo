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

## Trip planner (Surf & Experiences > top section `#tp`)
- `trip.js` builds the itinerary (days, food/gym/surf/places, room, arrival transfer). Rides between stops default to tuk-tuk; the customer can change each one, or all at once, or type their own.
- Plan goes out by WhatsApp (number in `trip.js`, `wa.me/94717505506`), Copy, or the form (hidden `#tp-plan` field). Add `trip.js` to the offline `CORE` list (done, VERSION `hiriketiyo-v35`).
- Upload together: `index.html`, `style.css`, `trip.js`, `sw.js`, `content-map.js`.

## Main navigation (6 buttons)
- Top bar / phone menu: 01 Discover (`#discover`), 02 Experiences (`#surf`), 03 Stay & Eat (`#stay`), 04 Destinations (`#destinations`), 05 Shopping (`#shop`), 06 Plan Your Trip (`#plan`, the pill button). The logo goes Home; Transport stays reachable from the footer and the Discover page.
- `#destinations` and `#plan` are not pages: `app.js` (`AL` list) opens the Discover page and scrolls to `#d-places`, or opens the Plan your trip page (`#trip`) and scrolls to the trip planner `#tp`. `#partner` also opens `#trip` (menu stays on 02 Experiences).
- Each item has an icon (inline SVG, 1.5 stroke), a number and a one-line description (hover card on desktop, shown in the phone menu). All texts are editable in Admin Studio > Top bar & menus.
- Below 1320px wide the bar becomes the phone menu (six items would not fit).
- Upload together: `index.html`, `style.css`, `app.js`, `content-map.js`, `sw.js` (VERSION `hiriketiyo-v36`).

## DO HIRIKETIYO marketplace (`#do`, `do.js`)
- Hero button "DO HIRIKETIYO ↗" (`.box.s.dobtn`, arrow drawn in CSS) opens `#do`; the top bar highlights "02 Experiences" while it is open.
- Page: hero, 8 category tiles (Surf & Ocean, Wellness & Fitness, Food & Culinary, Tours & Adventures, Spa & Relaxation, Rentals & Equipment, Creative & Lifestyle, Events & Special Experiences), filter chips, listing cards, closing partner CTA.
- **Only approved providers are shown.** `do.js` reads the Supabase `listings` table (client shared by `data.js` as `window.hkSb`). The categories and their services are listed once at the top of `do.js` (`CATS`); a service chip only appears when a listing uses it. Empty categories show "Opening soon". Nothing is invented: every card/detail field is optional and hidden when the listing lacks it; ratings need `reviews_verified = true`.
- Placement: `listings.do_category` (+ `do_service`). If empty, partner type decides (surf → Surf & Ocean, experience → Tours & Adventures). Stay, transport and shop partners and `kind = product` are never shown here (no duplicates across sections).
- Card: photo, category, provider, location, title, description, duration, group size, dates, "From" price, View Details, Book Now. Detail dialog: gallery, overview, provider, included / not included, pricing, dates and times, cancellation, map, verified reviews, Book Now, WhatsApp enquiry.
- Booking is a **request** flow (Experience > Date > Guests > Details > Submit) saved through `submit_enquiry('booking_request', …)` with status `pending_provider_confirmation`. It is never auto-confirmed. If the request can not be sent, the customer is offered the same details on WhatsApp (`94717505506`).
- Payment and commissions are not connected (`PAYMENT.enabled=false` in `do.js`). The existing PayHere checkout (`#co`) is untouched.
- Optional columns for richer listings: `supabase-do-marketplace.sql` (review and run it yourself). Without it the cards still work with the basic fields.
- Photo slots (Admin > Photos, up to 4 each): `do-hero`, `do-surf`, `do-wellness`, `do-food`, `do-tours`, `do-spa`, `do-rentals`, `do-creative`, `do-events`. Texts: Admin Studio > Page: DO HIRIKETIYO.
- Upload together: `index.html`, `style.css`, `app.js`, `data.js`, `do.js`, `slideshow.js`, `content-map.js`, `admin.html`, `sw.js` (VERSION `hiriketiyo-v41`).

## Experiences page (`#surf`, short cinematic editorial)
- Six sections only, in the Discover look: hero "Experience the South", `#x-life` coastal lifestyle (photo mosaic), `#x-things` six things to experience (Ocean, Wellness, Food, Adventure, Nightlife, Creativity), `#x-beyond` nearby beaches / landmarks / hidden gems (names only, distances stay in Discover), `#x-culture` local culture and flavours, `#x-cta` "Your Hiriketiya Story Starts Here." with the DO HIRIKETIYO button.
- Role of each page: Discover = destination information, Experiences = lifestyle and inspiration, DO HIRIKETIYO = bookable activities and services.
- **The old content of this page moved to a new page `#trip` ("Plan Your Trip")**: trip planner `#tp`, surf/experience listings, booking request form and the partner application `#partner`. Nothing in them changed; `app.js` (`P` and `AL`) routes the Plan Your Trip pill and every `#partner` link there.
- Photo slots (Admin > Photos, up to 4 each): `exp-hero`, `exp-l1`..`exp-l4`, `exp-ocean`, `exp-wellness`, `exp-food`, `exp-adventure`, `exp-night`, `exp-creative`, `exp-beyond`, `exp-c1`, `exp-c2`. Slots with no photo show a tinted placeholder; a few start with existing site images until real photos are uploaded.
- Texts: Admin Studio > Page: Experiences. Planner, listings and partner texts: Page: Plan your trip.
- Styles are the `.x*` block at the end of `style.css`; reveal-on-scroll for `#surf` is at the end of `app.js`.
- Upload together: `index.html`, `style.css`, `app.js`, `slideshow.js`, `content-map.js`, `admin.html`, `sw.js` (VERSION `hiriketiyo-v42`).

## Shop: products, payment options and the product line strip (`shop.js`, `productline.js`, Admin Studio tabs)
- **Admin Studio > Products**: add / edit / delete / reorder products (name, price in LKR, availability: in stock / made to order / sold out, optional category, description, up to 3 photos, "Show on the website"). "Save product" goes live straight away (it does not use the Publish button). Photos are stored in the `site-images` bucket.
- **Admin Studio > Payment**: WhatsApp number for orders, and the payment options customers can pick: Order on WhatsApp, Bank transfer, Pay on delivery or pickup, and one extra option, each with a name and instructions, plus a message shown under every product (delivery, returns). Only ticked options are shown.
- Where it is stored: Supabase `site_theme`, key `shop` (products) and key `payment`. No new table. The public site must be allowed to read these keys (the same read policy that already lets it read keys `theme` and `content`).
- **Shopping page (`#shop`)**: search, category filter (appears when products have categories), sort, product grid, and a detail dialog (photo gallery, price, description, quantity, payment choice with instructions, live total). "Order on WhatsApp" sends a ready-made order message (product, quantity, total, chosen payment); if WhatsApp is switched off it falls back to an email. Sold-out products cannot be ordered. With no products the original "Collection coming soon" card stays.
- **Partner products** (Supabase `listings`, `kind = 'product'`) are still shown after yours and keep the existing secure checkout ("Buy now", `window.hkCheckout` from `data.js`).
- **Product line strip**: slow, endlessly running band in the middle of whichever page is open. It shows only real, visible products (your Admin Studio products and partner products). With none, it is hidden. Not shown on the Shopping page itself. Clicking a product opens its detail dialog. About 38px per second; pauses on hover / focus / off screen; reduced motion gets a calm swipeable row.
- Styles: `.pline` / `.pl-*` and the `.shop-*` / `.sp*` / `#pd` / `.pd-*` blocks at the end of `style.css`.
- Upload together: `index.html`, `style.css`, `data.js`, `shop.js`, `productline.js`, `admin.html`, `sw.js` (VERSION `hiriketiyo-v45`, `shop.js` in `CORE`).

## Surf Partners page (`#surfpartners`, `surfpartners.js`)
- Own page for surf schools and instructors (the "gig list"). Opened by: Discover > "Browse surf partners", the home service catalog "Browse surf schools", the home "Surf lessons" link and Explore Services > "Surf Lessons". The top bar highlights "02 Experiences". (`app.js`: `P`, `AL`, chip link.)
- **Admin Studio > Surf partners**: add / edit / delete / reorder partners. Per partner: name, tagline, status, badge, location + map link, description, experience, languages, certifications, team, safety, skill levels, lesson types, group size, minimum age, equipment / included / not included / what to bring, **packages** (name, type, level, duration, price, per person / group / session, included), **ratings and reviews** (manual rating or real reviews, average is calculated), **booking details** (how it works, hours, book-ahead, time slots, deposit, cancellation, payment methods, notes, WhatsApp, phone, email), logo and 5 photos. "Save surf partner" goes live straight away.
- Stored in Supabase `site_theme`, key `surfpartners` (no new table). The public read policy must allow this key (same as `shop`, `payment`, `content`).
- Customers open a partner: About / Packages / Reviews / Book. The booking is a **request** (`submit_enquiry('booking_request', {kind:'surf_lesson',...})`, status `pending_provider_confirmation`), with a WhatsApp fallback. Payment is not connected.
- Styles: `.sf-*` and `#sfd` at the end of `style.css`.
- Upload together: `index.html`, `style.css`, `app.js`, `surfpartners.js`, `admin.html`, `sw.js` (VERSION `hiriketiyo-v46`).

## Full-width pages
- Block "Full-width, full-height pages" at the end of `style.css`: content containers (`.in`, `.ft`, ...) use the full screen width (cap 2200px) with side padding `clamp(1.25rem,4vw,5rem)`; `main` and the open `.page` are at least one screen tall, so short pages fill the screen and the footer sits below the fold. `--hh` (header height) is set by `app.js`.
- Upload together: `style.css`, `sw.js` (VERSION `hiriketiyo-v47`).

## Stay & Eat page (`#stay`, `stay.js`)
- Rebuilt as its own page: hero "Find Your Stay. Taste the South." with a search card (Places to stay / Food & drink), **Places to stay** (Boutique Hotels, Villas & Private Stays, Guesthouses, Hostels, Budget Accommodation), **Food & drink** (Restaurants, Beachfront Cafés, Breakfast & Brunch, Sri Lankan Cuisine, Seafood & Dining), and **Become a Partner** (links to the partner application `#partner`, which already has Stay and Food types). The old placeholder text and the public fee/commission note were removed.
- **Data (both real, nothing invented):** Admin Studio > **Stay & Eat** (properties with rooms and nightly prices; venues with cuisine, hours, price range, reservation times; each with up to 6 photos, contact, status, "Verified Partner" and "Show on the website"), saved in Supabase `site_theme` key `stay`; plus approved partners' rows in `listings` (`partners.type` = `stay` / `food`; for stays `price_cents` is read as the nightly price; optional columns `location`, `capacity`, `facilities`, `gallery`, `cuisine`, `opening_hours`, `price_range`, `map_url`, `long_description`). The public site must be allowed to read key `stay`.
- No ratings, availability or businesses are made up. With no listings the sections show one short "being verified" line.
- Banner photo slot: Admin > Photos > "Stay & Eat: top banner" (`stay-hero`).
- **Booking = request flow.** Stay: check-in, check-out, guests, rooms, room, contact, requests, with a live price breakdown (room × nights × rooms, customer service fee, total). Table: date, time, guests, requests, contact (no charge). Saved via `submit_enquiry('booking_request', {kind:'stay_booking' | 'table_reservation', status:'requested', ...})`, WhatsApp fallback. Never auto-confirmed; no payment is taken (`PAYMENT.enabled=false` in `stay.js`).
- **Fees:** customer service fee = `platform_settings.customer_fee_bps` (default 2%), shown before payment. **Partner commission (8% of the listed price)** is not shown to customers; it is computed only server-side for a PAID booking, once (`commission_ledger.booking_id` is the primary key). Rules and tables: `supabase-stay-bookings.sql` (review and run it yourself). Put the 8% in the partner agreement and partner dashboard.
- Other pages are unchanged. Styles: `.se-*`, `#sed`, `#seb` at the end of `style.css`.
- Upload together: `index.html`, `style.css`, `stay.js`, `admin.html`, `sw.js` (VERSION `hiriketiyo-v49`, `stay.js` in `CORE`).

## Same hero and look on every page
- Every page now opens with the Discover hero (`.ph.dhero`: full-width photo, ocean shade, wave edge, `clamp(400px,64vh,580px)` tall): Discover, Experiences, DO HIRIKETIYO, Plan Your Trip, Stay & Eat, Transport, Shopping, Explore Services, Surf Partners. Home keeps its own hero.
- Banner photos (Admin > Photos): `stay-hero`, `trip-hero`, `transport-hero`, `shop-hero`, `services-hero`, `sp-hero` (plus `disc-hero`, `exp-hero`, `do-hero`). Until a photo is uploaded the Bay photo (`hero-1920.webp`) is used.
- Stay & Eat and Surf Partners cards use the Discover place-card look (18px corners, 4:3 photo, script title, lift on hover). The Stay search card floats under the hero.
- Upload together: `index.html`, `style.css`, `admin.html`, `sw.js` (VERSION `hiriketiyo-v50`).
