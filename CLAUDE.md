# CLAUDE.md — popa

Context file for Claude Code sessions (web and CLI). Read this before touching any code.

---

## What popa is

A mobile-first web app (PWA) that lets anyone turn phone photos into beautiful physical print products — fast, affordably, and with a sense of craft. Ships internationally from India (Printo), giving popa a structural cost advantage over local alternatives in US, UK, Europe, Japan.

Tagline: *"your photo papa — making memories tangible"*

Full product context: `Brief.md` | Competition research: `competition_ux.md`

---

## The single most important thing

The **Aha Moment** is the north star for all decisions:

> When a user selects a photo and product, a high-speed photorealistic preview renders — zooming in on the product with the user's actual photo on it. It must feel alive. It must feel fast.

**Target: < 3 seconds to first preview, < 1 second if assets are cached.**

Every performance, architecture, and UX decision is measured against this.

---

## Tech stack

| Layer | Decision | Notes |
|---|---|---|
| Frontend | React 18 + TypeScript | PWA, mobile-first |
| Styling | Tailwind CSS | No component library imposed yet |
| Preview rendering | **Option A — client-side CSS/Canvas compositing** | See below |
| Backend | Node.js + REST API | Cloud hosted |
| Auth | Google OAuth (primary), email fallback | |
| Photo import | Google Photos API + direct upload fallback | |
| Payments | Stripe (multi-currency) | |
| Database | TBD — PostgreSQL likely | |
| Print pipeline | Printo API (internal) | |

---

## Preview rendering architecture (Option A)

Product previews are rendered **entirely client-side** — no server round-trips for the preview step.

### How it works

1. A `products.json` manifest (loaded once, cached) lists every product variant
2. Each product has a folder in `/public/mockups/<product-id>/` containing:
   - `base.webp` — product shot with photo zone transparent
   - `overlay.webp` — shadow/glare/depth layer (`mix-blend-mode: multiply`)
   - `config.json` — photo zone coordinates and transform matrix
3. On photo + product selection:
   - Load `base.webp` + `config.json` (tiny, cached after first load)
   - Draw user photo onto `<canvas>` clipped/transformed to the photo zone
   - Layer `overlay.webp` on top for photorealism
4. Total render: < 100ms once cached, < 1s on first load

### Mockup file structure

```
/public/mockups/
  products.json
  canvas-8x10/
    base.webp
    overlay.webp
    config.json
  canvas-12x16/
    ...
  photo-book-8x8/
    ...
  fridge-magnet-4x4/
    ...
```

### config.json shape

```json
{
  "photoZone": {
    "x": 112,
    "y": 84,
    "width": 648,
    "height": 486,
    "perspectiveTransform": [1, 0, 0, 0, 1, 0, 0, 0, 1],
    "borderRadius": 4
  },
  "overlayBlendMode": "multiply",
  "baseSize": { "w": 872, "h": 654 }
}
```

### products.json shape

```json
[
  {
    "id": "canvas-8x10",
    "label": "Canvas 8×10",
    "category": "canvas",
    "mockupPath": "/mockups/canvas-8x10",
    "printSizeMM": { "w": 203, "h": 254 },
    "minResolutionPx": { "w": 2400, "h": 3000 }
  }
]
```

**Rule:** if a product isn't in `products.json`, it doesn't exist in the UI.

---

## Product catalogue

| Product | Category |
|---|---|
| Photo Calendar (monthly, wall) | calendar |
| Notebook (photo cover) | stationery |
| Canvas / Gallery Wrap (multiple sizes) | canvas |
| Fridge Magnet (standard + custom shapes) | magnet |
| Photo Tiles (wall mount, multiple sizes) | tiles |
| Photo Acrylic Frames (wall/standing) | frames |
| Photo With Wooden Stand (desktop) | frames |
| Photo Books (soft/hardcover) | books |
| Premium Photo Books | books |

---

## Core user flow

1. Land → clean, no onboarding friction
2. Pick product → visually led, 2–3 hero products upfront, full catalogue behind "more"
3. Select photos → Google Photos API or direct upload; **ask for permission at this moment, not on launch**
4. **Preview instantly** ← Aha Moment
5. Light personalisation → crop, brightness, preset filter; advanced options 2 taps deep
6. Bundle upsell → system auto-generates complementary product preview using same photo(s)
7. Checkout → address + Apple Pay/Google Pay; max 3 screens
8. Confirmation → estimated delivery date, tracking hook

---

## UX rules (non-negotiable)

- **Speed above all** — every interaction feels instant
- **Mobile-first** — thumb navigation, portrait orientation
- **Quality is never the user's problem** — resolution and bleed warnings surface at photo selection, never at checkout
- **One decision at a time** — progressive disclosure throughout
- **Posh without embellishment** — premium aesthetic, no unnecessary decoration
- **Editor controls hide at rest** — photo always dominates the viewport
- **Smart defaults** — auto-layout, auto-crop to safe zone, auto-sequence by date; overriding is easy, not necessary
- **Checkout = 3 screens max** — Review → Address → Payment (Apple Pay primary CTA)

---

## Photo quality enforcement

Every photo slot must show a real-time resolution indicator:
- 🟢 Green — sufficient for selected product size
- 🟡 Amber — acceptable but suboptimal; warn user
- 🔴 Red — too low-res; block confirmation with clear explanation

This check runs at photo selection, not at cart or checkout.

---

## Bundle mechanic

When user adds a primary product:
1. Detect photo(s) used
2. Auto-generate preview of complementary product (same photo, different product)
3. Offer bundle with visible discount
4. Show both products side by side

More products bundled = lower per-unit cost. Drives AOV, makes pricing feel rewarding.

---

## Backend operations

Order pipeline stages: `Received → Art Processing → Pre-press → Sent to Print → Shipped → Delivered`

**Print Expert Agent** (automated):
- Validates print file on order confirmation
- Generates press-ready PDF with JDF job ticket, cut/crop marks
- Colour profile: CMYK, ISO Coated v2
- Resolution: minimum 300 DPI at final print size
- Submits to Printo API, schedules shipping, updates order status

---

## Development workflow

- **Methodology:** TDD — write failing test first, then implementation
- **Always run tests first** at the start of any session: `npm test` or equivalent
- **Branch strategy:** all work on `dev`; `main` only updated on explicit approval
- **Never touch Printo's production repos** — this repo is fully isolated
- **Commit often** — small, reversible commits; agents can checkpoint and revert

### Starting a new task

1. `git pull origin dev` — get latest
2. Run the test suite — establish baseline
3. Write a failing test for the new behaviour
4. Implement until tests pass
5. Commit with a descriptive message

---

## Success metrics

| Metric | Target |
|---|---|
| Time to first preview | < 3 seconds |
| Checkout completion rate | > 60% of preview views |
| Bundle attach rate | > 30% |
| Repeat order rate (90 days) | > 25% |
| NPS | > 60 |

---

## What doesn't exist yet

As of project start, there is no code — only documentation. The first engineering task is scaffolding the React PWA and implementing the client-side preview compositing component for a single product (canvas-8x10).
