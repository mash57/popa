# popa — Product Requirements Document
*Version 1.0 — May 2026*

> **Status: DRAFT — awaiting product owner approval before any code is written.**

---

## Table of Contents

1. [Vision & Strategy](#1-vision--strategy)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [User Personas](#3-user-personas)
4. [Product Catalogue](#4-product-catalogue)
5. [Core User Flows](#5-core-user-flows)
6. [Screen-by-Screen Requirements](#6-screen-by-screen-requirements)
7. [Design System](#7-design-system)
8. [Technical Architecture](#8-technical-architecture)
9. [Integrations](#9-integrations)
10. [Performance Requirements](#10-performance-requirements)
11. [Backend & Operator Experience](#11-backend--operator-experience)
12. [Print Pipeline](#12-print-pipeline)
13. [Pricing & Billing](#13-pricing--billing)
14. [Security & Privacy](#14-security--privacy)
15. [Out of Scope (v1)](#15-out-of-scope-v1)
16. [Release Phases](#16-release-phases)
17. [Open Questions](#17-open-questions)

---

## 1. Vision & Strategy

### Product Vision

popa is a mobile-first PWA that lets anyone turn phone photos into beautiful physical print products — fast, affordably, and with a sense of craft. It ships internationally from India (Printo), giving popa a structural cost advantage of 30–40% over local US, UK, and European alternatives.

**Tagline:** *"your photo papa"*

### Strategic Positioning

Every major competitor in the photo-print space fails at the same moment: the gap between "I have photos on my phone" and "I see something I want to buy." Shutterfly overwhelms with choice. Snapfish/Printique have slow, dated editors. Chatbooks automates but removes agency. Artifact Uprising is beautiful but inflexible. Motif is seamless but Apple-only.

popa wins by making that gap disappear. The Aha Moment — a photorealistic product preview that renders in under 3 seconds — is not a feature. It is the product.

### The North Star

> When a user selects a photo and product, a high-speed photorealistic preview renders — zooming in on the product with the user's actual photo on it. It must feel alive. It must feel fast.

**Target: < 3 seconds to first preview. < 1 second if assets are cached.**

Every engineering, design, and architecture decision is subordinate to this.

---

## 2. Goals & Success Metrics

### Primary KPIs

| Metric | Target | Rationale |
|---|---|---|
| Time to first preview | < 3 seconds | The Aha Moment. Non-negotiable. |
| Checkout completion rate | > 60% of preview views | 2× industry average (30%); requires wallet payments + 3-screen checkout |
| Bundle attach rate | > 30% | Core revenue mechanic |
| Repeat order rate (90 days) | > 25% | Indicates product-market fit |
| NPS | > 60 | Premium experience expectation |

### Secondary KPIs

| Metric | Target |
|---|---|
| Gallery load time (thumbnails) | 0ms (pre-cached) |
| Permission grant rate | > 75% |
| Photo quality block rate at checkout | 0% (enforced at selection) |
| Order processing time (art → pre-press) | < 2 hours (automated) |

---

## 3. User Personas

### Primary Persona — "The Celebrator" (Core)
- **Who:** 25–45 year old, smartphone-primary, shops on mobile
- **Context:** Has a meaningful photo occasion — baby milestone, holiday trip, family gathering, new home
- **Pain:** Photos are trapped on their phone. They want to do something with them but the existing tools are too slow, too confusing, or too expensive
- **Motivation:** Pride of craft. The desire to see a memory made tangible
- **Tech comfort:** High enough to use Google Photos; not a designer

### Secondary Persona — "The Gift Sender"
- **Who:** Any age. Buying for someone else
- **Context:** Birthday, anniversary, Mother's Day, baby shower
- **Pain:** Last-minute, needs to feel premium despite low effort
- **Motivation:** The gift must look like it took effort; it must arrive on time
- **Key requirement:** Estimated delivery date visible before payment

### Tertiary Persona — "The Photographer"
- **Who:** Semi-professional, curates their shots
- **Context:** Wants to print portfolio pieces, give framed prints as gifts
- **Pain:** Existing services have mediocre output or clunky pro workflows
- **Motivation:** Print quality and accurate colour reproduction

---

## 4. Product Catalogue

### Launch Products (Phase 1)

| Product | Category | Sizes | Starting Price (USD) | Ships In |
|---|---|---|---|---|
| Canvas / Gallery Wrap | canvas | 8×10″, 12×16″, 16×20″, 20×30″ | $29 | 7 days |
| Photo Calendar (wall, monthly) | calendar | Standard (11×8.5″) | $14 | 5 days |
| Fridge Magnet | magnet | 4×4″, 4×6″, custom shapes | $6 | 5 days |
| Photo Prints | prints | 4×6″, 5×7″, 8×10″ | $4 | 4 days |
| Notebook (photo cover) | stationery | A5, A4 | $18 | 5 days |

### Phase 2 Products

| Product | Category |
|---|---|
| Photo Tiles (wall mount) | tiles |
| Photo Acrylic Frames | frames |
| Photo With Wooden Stand | frames |
| Photo Books (soft/hardcover) | books |
| Premium Photo Books | books |

### Product Rules
- Every product must have a complete mockup set in `/public/mockups/<product-id>/` before it appears in the UI
- Products not in `products.json` do not exist in the UI — no exceptions
- All products support single and multi-photo layouts
- All products must have an auto-layout option (smart default)
- Resolution requirements enforced per product per size at photo selection time

---

## 5. Core User Flows

### Happy Path — First-Time User

```
Land → Product cards (no friction) → Tap "Create"
  → Permission sheet slides up → Grant access
  → Thumbnails buffer in background (user keeps browsing)
  → Tap product card → Photo gallery (already loaded)
  → Select photo → Tap "Preview"
  → AHA MOMENT: dolly animation, photorealistic preview
  → Editor (crop/adjust)
  → "Add to order" → Bundle upsell
  → Checkout (Review → Address → Payment)
  → Confirmation with delivery date
```

### Happy Path — Returning User

```
Land → Product cards → Tap product
  → Photo gallery (thumbnails cached from last session)
  → Select photo → Preview (< 1 second, cached mockup assets)
  → "Add to order" → Checkout (saved address + Apple Pay = 2 taps)
```

### Permission Denied Path

```
Tap "Create" → Permission sheet → Deny
  → Sheet dismisses
  → Upload button appears in photo gallery
  → User uploads from Files / camera directly
  → Flow continues unchanged from gallery step
```

---

## 6. Screen-by-Screen Requirements

### 6.1 Home Screen — Product Picker

**Purpose:** Orient the user visually. No text-heavy onboarding. Let products sell themselves.

**Layout:** Full-screen product card carousel. Two-item bottom nav only: `me` and `create`.

**Requirements:**
- Full-bleed product cards, one per product, filling the viewport between status bar and nav
- Each card has a product-specific colour gradient and structural pattern overlay (grid for calendar, inset frame for canvas, etc.)
- Film grain texture on all cards (`opacity: 0.035`)
- Product name, price from, shipping estimate, and "pull for sizes" hint on each card
- "Most popular" / "Best gift" / "Bundle & save" badges on relevant cards
- Horizontal swipe + tap-zone navigation (left third = previous, right third = next)
- Dot indicator synced to active card
- Vertical pull (swipe up) on a card reveals size/format selector sheet
- `create` pill is the sole primary CTA — white, centre-right in nav

**Phase 1 card order:** Canvas Wrap, Calendar, Fridge Magnet, Photo Prints, Notebook

**Does not show:** a sign-up gate, a tutorial, a splash screen, or any interstitial before the cards

---

### 6.2 Permission & Buffering Flow

**Purpose:** Get photo access without alarming the user. Begin loading photos immediately.

**Trigger:** Tap on `create` pill

**Requirements:**
- Bottom sheet slides up immediately with backdrop blur (`blur(8px)`)
- Sheet contains: popa grid icon (amber→violet gradient tile), title, one-line body copy, buffer bar, Allow/Deny buttons, privacy footnote
- Buffer bar begins animating immediately on sheet open (not on Allow tap) — signals work is happening
- Buffer bar uses signature amber→violet gradient, `3s ease` fill animation, fills to ~72% then waits
- "Allow Access" button is 2× width of "Don't allow"
- Privacy copy: `"Your photos never leave your device until you order"`
- On "Allow Access": initiate Google Photos Picker API session in background; user returns to product browsing with no interruption
- On "Don't Allow": dismiss sheet; expose manual upload fallback in gallery view
- **Critical:** photo buffering must be non-blocking — the user should never wait at this step

---

### 6.3 Photo Gallery Screen

**Purpose:** Let the user pick a photo. Everything must already be loaded.

**Trigger:** Tapping the centre zone of a product card (after permission granted or upload fallback)

**Requirements:**
- Back arrow shows which product is selected (e.g. "← Canvas Wrap")
- Header: "Choose a photo" (19px, weight 300)
- Speed strip below header:
  - Pulsing amber→violet dot
  - Label: "Photos ready"
  - Right-aligned: "{count} photos · instant"
- 3-column square thumbnail grid, 2px gap
- Most recent photo pre-selected (white border + ✓ badge)
- Single-select (Phase 1); multi-select Phase 2 for books/calendars
- Zero loading states in the grid — every thumbnail already in cache
- Resolution indicator per thumbnail: 🟢 / 🟡 / 🔴 based on selected product size
  - 🔴 photos are visible but tapping them shows a clear warning; cannot proceed with red-rated photo
  - Indicator updates if user changes product size
- Full-width white pill CTA: "Preview on [Product Name] →"
- On photo select: begin fetching full-res in background immediately

---

### 6.4 The Aha Moment Screen

**Purpose:** The product's core value prop. One of the most important screens in any consumer app built in 2026.

**Trigger:** Tapping "Preview on [Product]" in gallery

**Animation sequence (dolly push):**
- 0ms: screen transitions, product appears small, centred, opacity 0
- 60ms: animation begins
- 130ms: product reaches full opacity
- 750ms: product overshoots to 1.07× scale (physical camera-push sensation)
- 920ms: product springs back to 1.0× (Framer Motion spring: stiffness 180, damping 18)
- 980ms: product name + size fades in below

**White flash:**
- At ~80ms: full-screen white overlay fades opacity 0.3 → 0 over 550ms
- Effect: camera flash; a memory being made

**Product rendering (canvas wrap example):**
- User's photo fills the canvas frame entirely
- Wrap edges on right and bottom: darker shade of photo's dominant colour
- Gloss layer: `linear-gradient(135deg, rgba(255,255,255,0.08), transparent 50%, rgba(0,0,0,0.15))`
- Film grain: `opacity: 0.05`
- Box shadow: `0 3px 0 rgba(0,0,0,0.5), 0 6px 20px rgba(0,0,0,0.6)`

**CTA:** "Looks great — edit ✦" (white pill; ✦ appears on this screen only)

**Fallback:** If full-res not yet ready when user taps Preview, button label shows "Loading…" with progress indicator until ready; dolly triggers immediately when ready

**Important Fallback**
If this Aha Moment needs to be discarded and replaced with another Aha Moment, ensure it is modular and does not disrupt the entire app or needs the entire app to be recreated.  
---

### 6.5 Editor Screen

**Purpose:** Light personalisation. Photo dominates. Controls are available, not intrusive.

**Trigger:** Tapping "Looks great — edit ✦" on Aha screen

**Requirements:**
- Product mockup stays visible, slightly smaller, centred
- Crop handles visible at all four corners
- Horizontal scroll chip row: Crop (default), Brightness, Contrast, Warmth, Text
- Active chip shows its slider immediately below the chip row
- Slider: label (8px uppercase) / gradient track (amber→violet) / 13px white circle thumb / numeric value
- Advanced tools (filters, borders) accessed by scrolling chip row rightward — not visible by default
- Bottom bar: "← Back" (ghost, returns to Aha with state preserved) and "Add to order →" (white pill)
- All adjustments are non-destructive and applied client-side
- Full-res processing (crop, colour profile conversion) runs in a Web Worker — never on main thread

---

### 6.6 Bundle Upsell Screen

**Purpose:** Drive AOV. Make pricing feel rewarding. Surface at the right moment — after preview, before checkout.

**Trigger:** Tapping "Add to order →" in editor

**Requirements:**
- Auto-detect the photo(s) used
- Auto-generate a preview of a complementary product using the same photo (e.g. canvas → fridge magnet)
- Show both products side by side with visible bundle discount
- Bundle offer: "Add [product] for [X]% off" — the more products, the lower per-unit cost
- User can: accept bundle, skip, or swap the complementary product
- Skipping goes directly to checkout with original product only

---

### 6.7 Checkout — 3 Screens Maximum

#### Screen 1: Review
- Thumbnail of product(s) with rendered preview
- Product name, size, quantity, unit price
- Subtotal, shipping cost (never hidden), estimated delivery date
- "Continue" → Address

#### Screen 2: Address
- Pre-filled if returning user
- Auto-detect country from IP; show relevant shipping options
- Address form: name, line 1, line 2 (optional), city, postcode, country (allow special characters)
- No account creation required (guest checkout always available)
- "Continue" → Payment

#### Screen 3: Payment
- Apple Pay / Google Pay as primary CTA (Stripe Express Checkout Element)
- Card input as secondary option (Razorpay payment element)
- Price shown in user's local currency (USD, GBP, EUR, JPY)
- Confirm button disabled until payment method selected
- No upsells, no pop-ups, no distractions on this screen

---

### 6.8 Order Confirmation Screen
- Animated confirmation (no spinner — instant transition)
- Preview thumbnail(s) of ordered product(s)
- Order number
- Estimated delivery date (confirmed, not estimated range)
- "Track your order" link (active once shipped)
- "Order more" CTA returns to home product picker

---

### 6.9 Me / Orders Screen
- Order history with status indicators
- Tap order → detail view with print preview, status timeline, tracking link
- Profile: name, email, saved addresses
- Light/dark mode toggle (dark is default)
- Account deletion option (GDPR/CCPA compliance)

---

## 7. Design System

### Colour Palette

| Role | Dark Mode | Light Mode |
|---|---|---|
| App background | `#080808` | `#F8F7F4` |
| Surface / card | `#1C1C1E` | `#FFFFFF` |
| Primary text | `#FFFFFF` | `#0A0A0A` |
| Secondary text | `rgba(255,255,255,0.28)` | `rgba(0,0,0,0.28)` |
| Muted label | `rgba(255,255,255,0.22)` | `rgba(0,0,0,0.22)` |
| Divider | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.05)` |
| **Signature accent** | `linear-gradient(90deg, #FF9A3C → #C05FFF)` | Same |

### Product Card Gradients

| Product | Gradient |
|---|---|
| Calendar | `#FF9A3C → #E84B1A → #8B1A00` |
| Canvas Wrap | `#1EEEA0 → #0CA865 → #024D2E` |
| Notebook | `#5B8FFF → #1E3FCC → #050F5E` |
| Fridge Magnet | `#C05FFF → #7B15E8 → #330070` |
| Photo Prints | `#FF3D8F → #C40052 → #5C0027` |

### Typography
- Font stack: `-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif`
- Wordmark: `10px`, `letter-spacing: 5px`, lowercase, muted opacity
- Hero greeting: `21px`, weight 300, `letter-spacing: -0.7px`
- Product name on card: `26px`, weight 300, `letter-spacing: -0.8px`
- Price / meta: `13px`, `rgba(255,255,255,0.55)`
- Labels / badges: `9px`, `letter-spacing: 1.2–2px`, uppercase

### Motion
- Card swipe: `cubic-bezier(0.32, 0.72, 0, 1)` — the iOS feel
- Sheet slide-up: `0.42s cubic-bezier(0.32, 0.72, 0, 1)`
- Buffer bar: `3s ease`
- Aha dolly: Framer Motion spring — `stiffness: 180, damping: 18`
- All transitions feel physical, not mechanical. No linear easing anywhere.

### Mode
- Dark mode is the default and primary experience
- Light mode is a toggle in the Me section
- No system-preference auto-switching in v1 (simplicity)

---

## 8. Technical Architecture

### Frontend

| Decision | Detail |
|---|---|
| Framework | React 18 + TypeScript |
| App type | PWA (installable, offline-capable for cached assets) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Base width | 390px (mobile-first); responsive up to tablet |
| Preview rendering | Client-side CSS/Canvas compositing (Option A — see below) |
| State management | React Context + `useReducer` (no Redux in v1) |
| Testing | Vitest + React Testing Library; TDD methodology |

### Preview Rendering Architecture

Product previews are rendered entirely client-side — zero server round-trips for the preview step.

**Asset structure:**
```
/public/mockups/
  products.json              ← loaded once, cached
  canvas-8x10/
    base.webp                ← product shot, photo zone transparent
    overlay.webp             ← shadow/glare/depth (mix-blend-mode: multiply)
    config.json              ← photo zone coords + transform matrix
  canvas-12x16/
    ...
```

**`config.json` shape:**
```json
{
  "photoZone": {
    "x": 112, "y": 84, "width": 648, "height": 486,
    "perspectiveTransform": [1,0,0,0,1,0,0,0,1],
    "borderRadius": 4
  },
  "overlayBlendMode": "multiply",
  "baseSize": { "w": 872, "h": 654 }
}
```

**`products.json` shape:**
```json
[{
  "id": "canvas-8x10",
  "label": "Canvas 8×10",
  "category": "canvas",
  "mockupPath": "/mockups/canvas-8x10",
  "printSizeMM": { "w": 203, "h": 254 },
  "minResolutionPx": { "w": 2400, "h": 3000 }
}]
```

**Render pipeline:**
1. Load `base.webp` + `config.json` (tiny, cached after first load)
2. Draw user photo onto `<canvas>`, clipped/transformed to photo zone
3. Layer `overlay.webp` on top with `mix-blend-mode: multiply`
4. Full-res processing in Web Worker — never blocks main thread
5. Result: < 100ms render once cached; < 1s on first load

### Backend

| Decision | Detail |
|---|---|
| Runtime | Node.js (LTS) |
| API style | REST |
| Database | PostgreSQL |
| Auth | Google OAuth 2.0 (primary) + email/password fallback |
| Hosting | Cloud (provider TBD — AWS or GCP) |
| File storage | Cloud object storage (S3 or GCS) for print files |

### Photo Thumbnail Buffering Strategy

This is a hard engineering requirement for the Aha Moment:

```
1. Permission granted → immediately call Google Photos Picker API (background)
2. Picker session created → pickerUri returned
3. Poll session until mediaItemsSet = true
4. Fetch thumbnail URLs for most recent photos (up to API limit)
5. Preload thumbnails into browser cache via link rel=preload
6. Store blob URLs in a local Map keyed by photo ID
7. Gallery grid renders from this local cache — zero network requests at render time
```

```
Full-res loading:
1. User selects photo → begin fetching full-res immediately in background
2. "Preview" button activates immediately (don't gate on full-res completion)
3. On Preview tap:
   a. Full-res ready → dolly animation triggers instantly
   b. Still loading → "Loading…" progress on button; dolly triggers on ready
4. Full-res crop/colour-profile processing in Web Worker
```

---

## 9. Integrations

### 9.1 Google Photos — Picker API

> **Note:** The Google Photos Library API is deprecated as of March 2025. All photo-picking must use the new Picker API.

**Flow:**
1. User grants permission
2. Backend creates a Picker API session → returns `pickerUri`
3. User is directed to the Google Photos picker UI at `pickerUri`
4. Backend polls the session until `mediaItemsSet = true`
5. On completion: call `list` method to retrieve selected media items (thumbnails + download URLs)
6. Thumbnails preloaded to browser cache; full-res fetched on demand

**Scopes required:** `photospicker.mediaitems.readonly`

**Auth:** Google OAuth 2.0 — request at the moment the user taps "Allow Access", not on app launch

**Fallback:** If user denies or is not signed into Google, provide a direct file upload input (`<input type="file" accept="image/*" multiple>`)

**Privacy:** No photos stored server-side until the user confirms an order. Thumbnails are blobs in browser memory only.

### 9.2 Stripe — Payments

**Integration approach:** Stripe Express Checkout Element (single integration covers Apple Pay, Google Pay, and card)

**Key requirements:**
- PaymentIntent created server-side with `amount`, `currency`, and `automatic_payment_methods: { enabled: true }`
- Currency set from user's detected locale (USD, GBP, EUR, JPY)
- Apple Pay domain verification file served at `/.well-known/apple-developer-merchantid-domain-association`
- Google Pay: enabled automatically via Stripe — no extra config
- Express Checkout Element displayed as the **primary** CTA on the payment screen
- Standard card input (Stripe Payment Element) as secondary option
- Webhook endpoint for `payment_intent.succeeded` → triggers order pipeline
- Multi-currency: Stripe handles conversion and display; Printo settles in INR

**Supported currencies (Phase 1):** USD, GBP, EUR, JPY

### 9.3 Printo API — Print Submission

- Receives press-ready PDF + JDF job ticket from the Print Expert Agent
- Returns order ID and status
- popa polls or receives webhook for status updates: `Received → Art Processing → Pre-press → Sent to Print → Shipped → Delivered`
- Integration details defined separately with Printo team (internal)

### 9.4 Shipping APIs

- Phase 1: Printo handles shipping dispatch from India; estimated delivery dates computed server-side based on destination country
- Phase 2: Integrate country-specific carrier APIs for live tracking (FedEx International, Royal Mail, DHL, Japan Post)

---

## 10. Performance Requirements

These are hard constraints, not aspirational targets. Any feature that cannot meet these requirements must be re-architected before shipping.

| Interaction | Hard Limit | Measured How |
|---|---|---|
| Time to first meaningful paint (home) | < 1.5s on 4G | Lighthouse CI |
| Gallery appears after product tap | < 100ms | Manual + Vitest |
| Thumbnails visible in gallery | 0ms (pre-cached) | Manual inspection |
| Dolly animation start after "Preview" tap | < 200ms | Performance mark |
| Full-res photo composited on product | < 3000ms total | Canonical Aha test |
| Editor appears after "Looks great" tap | < 150ms | Performance mark |
| Checkout screen transitions | < 150ms | Manual |

**Bundle size targets:**
- Initial JS bundle: < 150kb gzipped
- Mockup assets (base + overlay per product): < 200kb combined per product
- `products.json`: < 5kb

**Caching strategy:**
- All mockup assets: `Cache-Control: public, max-age=31536000, immutable`
- `products.json`: `Cache-Control: public, max-age=3600`
- User photos: never cached to server; browser memory only until order

---

## 11. Backend & Operator Experience

### Order Management Dashboard

Accessible to Printo operators at `/admin` (authenticated):

| Feature | Requirement |
|---|---|
| Order queue | Real-time list; filterable by status, date, product type, destination country |
| Status pipeline | Visual: Received → Art Processing → Pre-press → Sent to Print → Shipped → Delivered |
| Manual override | Operator can update any status with a note |
| File download | Download press-ready PDF + JDF for any order |
| Customer detail | Name, address, product, photos, order value |
| Error queue | Failed print validations surfaced here with reason |

### Print Expert Agent (Automated)

An automated backend agent that runs on every confirmed order:

1. Receives `payment_intent.succeeded` webhook
2. Validates the print file:
   - Minimum 300 DPI at final print size
   - Dimensions match ordered product size (mm)
   - Colour space: convert RGB → CMYK (ISO Coated v2)
   - Bleed: 3mm all sides
3. Generates press-ready PDF with:
   - JDF job ticket
   - Cut and crop marks
   - Embedded CMYK ICC profile
4. AI enhancement pass (upscaling / sharpening if resolution marginal)
5. Submits to Printo API
6. Receives Printo order ID → stores against popa order record
7. Schedules shipping trigger
8. Updates order status at each stage
9. Sends customer email at: Order Confirmed, Sent to Print, Shipped (with tracking)

---

## 12. Print Pipeline

### File Output Standard

| Property | Requirement |
|---|---|
| Format | PDF/X-4 |
| Colour profile | CMYK, ISO Coated v2 300% (ECI) |
| Resolution | Minimum 300 DPI at final print dimensions |
| Bleed | 3mm all sides |
| Safe zone | 5mm inside cut line |
| Marks | Cut marks, registration marks, colour bars |
| Job ticket | JDF 1.4 format |

### Resolution Enforcement

Resolution check runs at photo selection time, per product per size:

```
required_px_width  = product.printSizeMM.w / 25.4 * 300
required_px_height = product.printSizeMM.h / 25.4 * 300

green  = photo resolution ≥ 1.25× required
amber  = photo resolution ≥ 1.0× required (warn, allow)
red    = photo resolution < 1.0× required (warn, block confirmation)
```

Users are never surprised by a quality failure after the fact. Red-rated photos cannot be confirmed. The bleed should be enforced without intervention of the customer or the back end operator. Research a  bleed creator library and add that as an option in the back end before downloading the print ready photographs.  

---

## 13. Pricing & Billing

- Prices displayed in user's local currency: USD (US), GBP (UK), EUR (Europe), JPY (Japan)
- Currency detected from IP geolocation on first visit; user can override in Me section
- All transactions billed from Printo India entity
- No GST on international orders (export)
- GST applies only to India-destined OR Rupee payment orders (v2 scope)
- Shipping cost shown before payment screen — never revealed at confirmation
- Estimated delivery date shown before payment screen
- Bundle discounts applied at cart level, visible in Review screen

### Indicative Price Points (USD)

| Product | Size | Price |
|---|---|---|
| Canvas Wrap | 8×10″ | $29 |
| Canvas Wrap | 12×16″ | $39 |
| Canvas Wrap | 16×20″ | $54 |
| Calendar | Standard | $14 |
| Fridge Magnet | 4×4″ | $6 |
| Photo Prints | 4×6″ (set of 10) | $12 |
| Notebook | A5 | $18 |

*Prices TBC with Printo pricing team. These are placeholders.*

---

## 14. Security & Privacy

### Photo Handling
- Thumbnails: browser memory only; never sent to server during browse/preview
- Full-res photos: sent to server only at order confirmation, for print file generation
- After print file is generated and validated: original uploaded photo deleted from server within 24 hours
- Press-ready PDF retained for 90 days (reprint support), then deleted

### Auth
- Google OAuth 2.0 with PKCE for web
- Sessions: JWTs with 7-day expiry; refresh token rotation
- Email/password: bcrypt (12 rounds), no plain-text storage

### Payment
- No card data touches popa servers — Stripe handles all PCI scope
- Stripe webhooks validated via `stripe-signature` header

### Data
- GDPR: right to erasure supported (account + order data deleted on request, subject to 90-day print file retention)
- CCPA: opt-out of sale (no data sold; stated in privacy policy)
- No analytics that read photo content

---

## 15. Out of Scope (v1)

The following are explicitly deferred to Phase 2 or later to keep v1 focused:

| Feature | Rationale |
|---|---|
| Multi-photo products (books, calendars) | Requires multi-select UI + layout engine; significant scope |
| Instagram / iCloud import | Google Photos covers the majority; add later |
| Custom text overlays (beyond basic) | Font picker, positioning adds scope |
| Advanced filters (beyond brightness/contrast/warmth) | 4 tools cover 80% of use cases |
| India domestic orders (GST) | Different tax/logistics flow |
| Subscription / auto-reorder | Post-PMF feature |
| Desktop web experience | Mobile PWA first; responsive later |
| Native iOS/Android app | PWA is the v1 delivery vehicle |
| Operator mobile dashboard | Web dashboard sufficient for v1 |
| AI-generated layouts | Phase 2 product differentiation |
| Third-party shipping APIs (live tracking) | Printo handles v1; integrate carriers in v2 |
| Localisation beyond EN | English only in v1 |

---

## 16. Release Phases

### Phase 0 — Foundation (Sprint 1–2)
- [ ] Repo scaffolding: React 18 + TypeScript + Tailwind + Framer Motion + Vitest
- [ ] PWA manifest, service worker skeleton
- [ ] Design system: tokens, colours, typography in CSS custom properties
- [ ] `products.json` with Phase 1 products
- [ ] Mockup asset pipeline: placeholder assets for canvas-8x10 to prove render architecture

### Phase 1 — The Aha Moment (Sprint 3–6)
- [ ] Home screen: product card carousel, permission sheet, buffer bar
- [ ] Google Photos Picker API integration + thumbnail buffering
- [ ] Photo gallery screen with pre-cached grid + resolution indicators
- [ ] Client-side preview compositing (`<canvas>` + overlay)
- [ ] Dolly animation (Framer Motion spring)
- [ ] Editor screen: crop/brightness/contrast/warmth
- [ ] Web Worker for full-res processing
- [ ] Performance test suite: Aha Moment canonical test < 3000ms

### Phase 2 — Purchase Flow (Sprint 7–10)
- [ ] Bundle upsell screen
- [ ] Checkout: Review → Address → Payment (3 screens)
- [ ] Stripe Express Checkout Element (Apple Pay / Google Pay)
- [ ] Order confirmation screen
- [ ] Email notifications (Order Confirmed, Shipped)
- [ ] Backend: order model, payment webhook, print file generation
- [ ] Print Expert Agent: PDF/X-4 output + JDF job ticket
- [ ] Printo API integration

### Phase 3 — Retention & Operations (Sprint 11–14)
- [ ] Me / Orders screen with tracking
- [ ] Operator dashboard (order queue, status pipeline)
- [ ] Repeat order flow (< 2 taps from order history to re-order)
- [ ] Multi-photo products: Photo Books, Premium Photo Books
- [ ] Bundle mechanic enhancements
- [ ] Performance hardening + Lighthouse CI gate

### Phase 4 — Growth (Sprint 15+)
- [ ] Additional product types (Tiles, Acrylic Frames, Wooden Stand)
- [ ] Instagram import
- [ ] AI layout engine
- [ ] India domestic orders + GST
- [ ] Live carrier tracking APIs
- [ ] Localisation

---

## 17. Open Questions

| # | Question | Owner | Priority |
|---|---|---|---|
| 1 | What are the exact Printo API endpoints and auth mechanism for print file submission? | Printo engineering | P0 |
| 2 | What are the final price points per product per currency? | Printo commercial | P0 |
| 3 | Which cloud provider (AWS / GCP) for hosting? Affects Google Photos Picker API OAuth configuration | Engineering | P1 |
| 4 | Is there a minimum order value for Printo to fulfil? | Printo commercial | P1 |
| 5 | What is the exact carrier and transit time per destination country for Phase 1? | Printo ops | P1 |
| 6 | Should the Picker API session be created server-side (more secure) or client-side? | Engineering | P1 |
| 7 | Do we want a guest checkout (no account required) in v1, or is auth mandatory? | Product | P1 |
| 8 | What is the reprint / refund policy? Needs to be reflected in confirmation email and Me section | Product / Legal | P2 |
| 9 | What AI upscaling model (if any) does the Print Expert Agent use for marginal-resolution photos? | Engineering | P2 |
| 10 | Stripe account — India entity or international entity? Affects settlement currency and fees | Finance | P0 |

---

*This PRD is a living document. It will be updated as open questions are resolved and as user research informs decisions. No code is written until the product owner approves this document.*

*Authored with inputs from: Brief.md, competition_ux.md, popa-UX-brief.md, Google Photos Picker API docs, Stripe Express Checkout documentation, and mobile UX research (2026).*
