# popa — Product Brief
*"your photo papa" — making memories tangible*

---

## Vision

We are always celebrating — birth, school, coming of age, graduation, love, marriage, parenthood, homecoming. But these moments stay trapped in our phones. popa brings them alive, all around you: on your walls, your fridge, your desk, your shelves.

popa is a mobile-first web app that lets anyone turn their phone photos into beautiful physical products — fast, affordably, and with a sense of craft and joy.

---

## Target Markets

Primary: USA, UK, Europe, Japan
- Photo printing is expensive and inconvenient in these markets
- Customers are not conditioned to same-day delivery — quality and value win
- Shipped from India (Printo), giving popa a structural cost advantage

---

## Product Catalogue

| Product | Notes |
|---|---|
| Photo Calendar | Monthly, wall format |
| Notebook | Photo cover |
| Canvas / Gallery Wrap, Multiple sizes |
| Fridge Magnet | Standard and custom shapes, Multiple sizes |
| Photo Tiles | Wall mount, Multiple sizes |
| Photo Acrylic Frames | Wall mount or Standing, multiple sizes |
| Photo With Wooden Stand | Desktop Landscape or Portrait, multiple sizes |
| Photo books | Soft or Hardcover, Specific number of pages, multiple sizes |
| Premium Photo books | Multiple designs, Specific number of pages, multiple sizes |

*Additional products may be added. All products support single or multi-photo layouts. All products should have an auto layout feature*

---

## Core User Flow

1. **Land on app** — clean, fast, no unnecessary onboarding
2. **Pick a product** — visually led, minimal text
3. **Select photos** — this has to be the fastest process. upload directly or connect via Google Photos API
4. **Preview instantly** — this is the Aha Moment (see below)
5. **Light personalisation** — crop, adjust, minor edits; advanced options tucked away
6. **Bundle upsell** — system suggests a complementary product using the same photo(s) with a live preview (e.g. buy a gallery wrap → offered a matching fridge magnet)
7. **Order** — pricing in user's local currency, simple checkout, ships internationally from India
8. **Confirmation** — clear timeline, tracking hook

---

## The Aha Moment

> The app's success is defined by this single instant.

The super fast rendering of photos to select from and when the user selects a photo and product, a **high-speed, photorealistic preview** renders — zooming in on the product with the user's actual photo on it. It must feel alive. It must feel fast. It must make the user feel like a craftsperson creating something meaningful, not filling out a form.

This photo select and preview moment is the north star for all engineering and design decisions.

---

## UX Principles

- **Speed above all** — every interaction should feel instant
- **Mobile-first** — designed for thumb navigation, portrait orientation
- **Posh without embellishment** — premium aesthetic, no unnecessary decoration
- **Progressive complexity** — simple by default, advanced options available but not in the way
- **Joyful, not transactional** — the user should feel creative and proud, not like they're placing a B2B print order

The UX should feel like nothing seen in this category before, while remaining immediately intuitive.

---

## Bundle Mechanic

When a user adds a primary product (e.g. gallery wrap), the app:
1. Detects the photo(s) used
2. Automatically generates a preview of a complementary product (e.g. fridge magnet) using the same photo
3. Offers the bundle with a visible discount
4. Shows both products side by side in the preview

The more products bundled, the lower the per-unit cost. This drives AOV and makes pricing feel rewarding, not punishing.

---

## Pricing & Billing

- Prices displayed in the user's local currency (USD, GBP, EUR, JPY)
- All transactions billed from India (Printo entity)
- No GST on international orders
- GST applicable only on domestic India orders (if any)
- Competitive pricing is core to the USP — popa should be meaningfully cheaper than local alternatives

---

## Technical Architecture

**Frontend**
- Mobile-first web app (PWA)
- Framework: TBD (React recommended)
- Optimised for speed — preview rendering is a performance-critical path

**Backend**
- Server + database (cloud hosted)
- REST or GraphQL API
- Google Photos API integration for photo import
- Auth: Google OAuth (primary), email fallback

**Third-party integrations**
- Google Photos API
- Payment gateway (Stripe or equivalent, multi-currency)
- Shipping APIs (per country/region — providers TBD per market)
- Printo production API (print file submission)

---

## Backend Operations (Operator Experience)

The backend operator UX is as important as the consumer experience.

**Order Management Dashboard**
- Full order queue visibility
- Status stages: Received → Art Processing → Pre-press → Sent to Print → Shipped → Delivered
- Each stage updateable by operator or automated agent

**Print Expert Agent (Automated)**
An AI agent that:
1. Receives confirmed orders
2. Processes and validates the print file
3. Generates press-ready files with:
   - Pre-press instructions
   - JDF format output
   - Cut/crop marks
4. Submits the file to Printo via API
5. Schedules shipping via the relevant country's Shipping API
6. Updates order status automatically at each stage

**File Output Standard**
- All files delivered as press-ready PDFs with JDF job ticket
- Cut and crop marks embedded
- Colour profile: CMYK, ISO Coated v2 or equivalent
- Resolution: minimum 300 DPI at final print size
- Enhancement: enhance output using AI

---

## Development Approach

This project will be built using an agentic engineering workflow:

- **Orchestrator:** Claude Code (primary)
- **Parallel agents:** Research agent, UX agent, Build agent, QA agent
- **Methodology:** Test-Driven Development (TDD) — red/green cycles
- **Version control:** GitHub (dedicated repository, never touching Printo's production repos)
- **Branch strategy:** All work on `dev` branch; `main` only updated on explicit approval

**Skills / rules to be defined separately in SKILLS.md**

---

## Success Metrics

| Metric | Target |
|---|---|
| Time to first preview | < 3 seconds |
| Checkout completion rate | > 60% of preview views |
| Bundle attach rate | > 30% |
| Repeat order rate (90 days) | > 25% |
| NPS | > 60 |

---

## Reviewer Notes
*Added after competition UX research across Artifact Uprising, Chatbooks, Mixbook, Shutterfly, Snapfish, Printique, Motif*

### What this Brief gets right that competitors miss

The "Aha Moment" framing is the correct north star. Every major competitor fumbles the gap between "I have photos" and "I see something I want to buy." The Brief has identified and named that gap precisely. The bundle mechanic is also distinctive — no competitor does contextual cross-sell with a live preview at the moment of product selection.

---

### Gaps to address

**1. Product selection hierarchy — prevent choice paralysis**

Nine product types is a lot for a first session. Shutterfly's failure mode is exactly this: too many products presented too early. The Brief says "visually led, minimal text" but needs a sequencing decision:
- Lead with the 2–3 highest-margin / most emotionally resonant products (canvas, photo book, tiles)
- Surface the full catalogue via "more products" — not as the default view
- Consider a quiz or intent signal ("celebrating something?") to pre-select the most relevant product

**2. Photo quality enforcement must be a first-class UX concern**

Every competitor fails at this: resolution warnings appear at checkout, not in the editor. Users discover their photo is too low-res after they've spent 10 minutes designing. This kills trust.

popa should enforce quality *at the photo selection step*:
- Show per-photo resolution suitability for each product size (green / amber / red)
- Block low-res photos from being confirmed, with a clear explanation
- Never let a quality problem reach the cart

This should be added as an explicit UX requirement, not left to implementation.

**3. "Light personalisation" needs definition**

The Brief lists this step but doesn't define its scope. Based on competition research, the minimum viable set is:
- Crop / reframe (with safe zone overlay shown)
- Brightness / contrast (optional, single slider)
- Filter / tone preset (optional, 4–6 curated options — not 40)
- Caption / text overlay for books and calendars

Advanced options (custom fonts, colour correction, manual layout) should be accessible but two taps deep. Mixbook gets this balance right.

**4. The 3-second preview is a hard engineering constraint, not just a UX goal**

Photorealistic 3D product renders (especially canvas wraps, acrylic frames) are expensive to compute. To hit < 3 seconds the architecture needs a decision up front:
- **Option A:** Pre-render product mockup templates; apply user photo as a CSS/WebGL transform client-side (fastest, slight fidelity tradeoff)
- **Option B:** Server-side render pipeline with aggressive CDN caching of base product images (better fidelity, latency depends on infra)
- **Option C:** Progressive preview — show a fast low-fidelity render in < 1s, upgrade to photorealistic in background

Recommend Option C for the Aha Moment: the instant response feels alive, the quality arrives a beat later. This should be a first-sprint architectural decision.

**5. Camera roll permission is a high-stakes first interaction**

The Brief says "no unnecessary onboarding" — correct. But the camera roll / Google Photos permission prompt is the riskiest moment in the entire flow. If the user denies it, the app is dead.

Best practice from competitors:
- Don't ask for permissions on launch — ask at the exact moment the user taps "select photos"
- Show a one-line value prop before the OS prompt fires: *"We only read your photos to let you preview them — we never store them without your permission"*
- Always provide a manual upload fallback if permission is denied

**6. Checkout completion rate > 60% is ambitious — validate the path**

Industry average for e-commerce checkout is ~30%. Hitting 60% requires the following to all be true:
- Apple Pay / Google Pay as the primary CTA (no form filling for returning users)
- Shipping cost visible before the payment screen
- Estimated delivery date shown before payment (not after)
- No upsell interstitials between cart and payment — the bundle offer happens earlier in the flow (Step 6), not at checkout

If any of these slip during build, the 60% target should be revised down.

---

### One addition to UX Principles

The current five principles are right. Add one:

- **Quality is never the user's problem** — resolution checks, bleed warnings, and file validation happen automatically and silently. The user should never encounter a print quality failure after the fact.