# popa — UX Brief
*Version 1.0 — Home Screen & Create Flow*

> This document is the visual and interaction contract for the popa web app.
> Claude Code must treat this as the UX source of truth alongside `Brief.md`.

---

## 1. Design System

### Philosophy
- **Clean & minimal** — Apple / Linear aesthetic. Premium without decoration.
- **Speed is the design** — every transition, every load state must feel instant.
- **Dark-first** — dark mode is the primary experience. Light mode is a toggle.
- **Mobile-first** — designed for thumb navigation, portrait orientation, 390px base width.

### Colour Palette

| Role | Dark Mode | Light Mode |
|---|---|---|
| App background | `#080808` | `#F8F7F4` |
| Surface / card | `#1C1C1E` | `#FFFFFF` |
| Primary text | `#FFFFFF` | `#0A0A0A` |
| Secondary text | `rgba(255,255,255,0.28)` | `rgba(0,0,0,0.28)` |
| Muted label | `rgba(255,255,255,0.22)` | `rgba(0,0,0,0.22)` |
| Divider | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.05)` |
| **Signature accent** | Gradient: `#FF9A3C → #C05FFF` | Same |

The amber-to-violet gradient is popa's signature. It appears on: the Create button, the photo buffer bar, the permission sheet icon, and key interactive moments.

### Product Colour Cards
Each product has a full-screen immersive colour. These are shown before the user's own photos load.

| Product | Gradient |
|---|---|
| Calendar | `#FF9A3C → #E84B1A → #8B1A00` |
| Canvas Wrap | `#1EEEA0 → #0CA865 → #024D2E` |
| Notebook | `#5B8FFF → #1E3FCC → #050F5E` |
| Fridge Magnet | `#C05FFF → #7B15E8 → #330070` |
| Photo Prints | `#FF3D8F → #C40052 → #5C0027` |

All cards have a subtle film grain overlay (`opacity: 0.035`) to feel warm and analogue.

### Typography
- System font stack: `-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif`
- Wordmark: `10px`, `letter-spacing: 5px`, lowercase, muted opacity
- Hero greeting: `21px`, `font-weight: 300`, `letter-spacing: -0.7px`
- Product name on card: `26px`, `font-weight: 300`, `letter-spacing: -0.8px`
- Price / meta: `13px`, `rgba(255,255,255,0.55)`
- Labels / badges: `9px`, `letter-spacing: 1.2–2px`, uppercase

### Motion Principles
- Card swipe: `cubic-bezier(0.32, 0.72, 0, 1)` — the iOS feel
- Sheet slide-up: `0.42s cubic-bezier(0.32, 0.72, 0, 1)`
- Buffer bar fill: `3s ease` — starts immediately on permission sheet open
- All transitions feel **physical**, not mechanical

---

## 2. Screen: Home / Product Picker

### Layout
```
┌─────────────────────────────┐
│  [island]                   │  ← Dynamic Island
│  9:41            ▮▮▮ 100%   │  ← Status bar
│                             │
│  p · o · p · a              │  ← Wordmark (muted, centered)
│                             │
│ ╔═══════════════════════════╗│
│ ║                           ║│
│ ║   [Full-screen            ║│  ← Product card (fills remaining height)
│ ║    product card]          ║│
│ ║                           ║│
│ ║   Calendar         →      ║│
│ ║   from $14 · 5 days       ║│
│ ║   ↓ pull for sizes        ║│
│ ╚═══════════════════════════╝│
│  ● ○ ○ ○ ○                  │  ← Dot indicator
│─────────────────────────────│
│  [Me]           [create]    │  ← Navigation (2 items only)
└─────────────────────────────┘
```

### Product Cards
- Cards are **full-screen** (fill the entire content area between status bar and nav)
- Each card is a **full-bleed colour field** with a structural pattern overlay hinting at the product type:
  - Calendar → subtle grid lines
  - Canvas Wrap → inset border frame
  - Notebook → ruled lines + left margin
  - Fridge Magnet → arch silhouette centred
  - Photo Prints → double-border photo frame
- Product info sits at the **bottom of the card** on a gradient scrim (`rgba(0,0,0,0.88) → transparent`)
- A small "Most popular" / "Best gift" / "Bundle & save" badge appears above the name on relevant products

### Card Interactions

**Horizontal swipe / tap** — navigate between products  
- Tap left third of card → previous product  
- Tap right third of card → next product  
- Swipe gesture supported  
- Dot indicator updates in sync  
- Transition: `left` position animates with iOS cubic-bezier

**Vertical pull (swipe up on card)** — reveals size/format options for that product  
- A "↓ pull for sizes" micro-label sits at the bottom of the card info  
- Pulling up slides in a size selector panel from the bottom (design TBD in next screen)

### Navigation Bar
Two items only. Nothing else.

| Item | Position | State |
|---|---|---|
| **Me** | Left | Icon (person outline) + "me" label in 9px lowercase |
| **Create** | Centre-right | White pill button with `+` icon, `font-weight: 500` |

The Create pill uses a white background in both light and dark modes — it is the primary CTA and must always stand out.

---

## 3. Flow: Tapping "Create"

This is the most important interaction in the app.

### Step 1 — Permission Sheet slides up immediately

On tapping Create, a **bottom sheet** overlays the screen with:
- Backdrop blur (`blur(8px)`) over the product card
- Sheet background: `#1C1C1E`, `border-radius: 18px 18px 0 0`
- Drag handle at top

**Sheet contents:**
1. **Icon** — popa grid icon on the amber-to-violet gradient background (`border-radius: 12px`)
2. **Title** — `"popa" would like to access your photos`
3. **Body copy** — `Browse products while your library loads silently in the background — no waiting around.`
4. **Buffer bar** — labelled "Buffering photos", fills immediately when sheet opens using the signature gradient
5. **Two buttons:**
   - `Don't allow` — ghost button, left
   - `Allow Access` — white filled button, right (2× width of deny)
6. **Footnote** — `Your photos never leave your device until you order` (9px, muted)

### Step 2 — Buffering happens in the background

**Critically:** photo buffering starts the moment the permission sheet opens (or the moment `Allow Access` is tapped).

The user does **not wait**. They return to browsing product cards. The buffer bar is a visible signal that work is happening — by the time they've decided on a product, photos are ready.

**Technical requirement:** Google Photos API call and local photo thumbnail generation must be initiated in background thread immediately on permission grant. Thumbnails cached locally. Full-res loaded on demand at preview time.

### Step 3 — User browses and picks a product

After dismissing the permission sheet, the user continues swiping through product cards as normal. No change in experience. No spinner. No gate.

### Step 4 — User taps a product card (centre zone)

Tapping the centre of a card (not left/right swipe zones) selects that product and proceeds to the Photo Selection screen. (Design TBD — next brief iteration.)

---

## 4. Screens To Design Next (Backlog)

In priority order:

| # | Screen | Why it matters |
|---|---|---|
| 1 | **The Aha Moment** — photo preview with zoom-in | This is the product's north star. Must nail before coding. |
| 2 | **Photo selection** — after permission, pick photos for the product | Needs to feel like a gallery, not a file picker |
| 3 | **Bundle upsell** — complementary product offer post-preview | The revenue mechanic |
| 4 | **Checkout** — simple, local currency, minimal fields | Conversion-critical |
| 5 | **Me / Orders** — order history, tracking, profile | Secondary but important |
| 6 | **Operator dashboard** — order queue, print agent status | Backend UX |

---

## 5. Interactive Prototype (HTML Reference)

The following is a working HTML/CSS/JS prototype of the Home screen approved by the product owner. Claude Code should use this as the **exact visual reference** for implementing the React component.

```html
<!-- PASTE FULL MOCKUP HTML HERE -->
<!-- Source: generated in Claude.ai chat, approved by Mash -->
<!-- Key classes and variables are documented in Section 2 above -->


<style>
*{box-sizing:border-box;margin:0;padding:0}
.outer{display:flex;justify-content:center;padding:2rem 0;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif}
.phone{width:300px;background:#1A1A1A;border-radius:50px;padding:10px;box-shadow:0 0 0 1px rgba(255,255,255,0.07),inset 0 0 0 1px rgba(255,255,255,0.03),0 40px 80px rgba(0,0,0,0.6)}
.screen{border-radius:42px;overflow:hidden;height:622px;background:#080808;display:flex;flex-direction:column;position:relative}
.island{width:88px;height:26px;background:#000;border-radius:20px;margin:10px auto 0;flex-shrink:0;z-index:10;position:relative}
.statusbar{display:flex;justify-content:space-between;align-items:center;padding:6px 22px 0;flex-shrink:0;z-index:10;position:relative}
.s-time{font-size:13px;font-weight:600;color:#fff;letter-spacing:-0.3px}
.s-right{font-size:10px;color:rgba(255,255,255,0.65);letter-spacing:0.2px}
.card-area{flex:1;position:relative;overflow:hidden}
.pcard{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:flex-end}
.card-bg{position:absolute;inset:0}
.c0{background:linear-gradient(160deg,#FF9A3C 0%,#E84B1A 45%,#8B1A00 100%)}
.c1{background:linear-gradient(160deg,#1EEEA0 0%,#0CA865 45%,#024D2E 100%)}
.c2{background:linear-gradient(160deg,#5B8FFF 0%,#1E3FCC 45%,#050F5E 100%)}
.c3{background:linear-gradient(160deg,#C05FFF 0%,#7B15E8 45%,#330070 100%)}
.c4{background:linear-gradient(160deg,#FF3D8F 0%,#C40052 45%,#5C0027 100%)}
.tex{position:absolute;inset:0;opacity:0.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
/* Product pattern overlays */
.pat-cal{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 32px,rgba(255,255,255,0.06) 32px,rgba(255,255,255,0.06) 33px),repeating-linear-gradient(90deg,transparent,transparent 32px,rgba(255,255,255,0.04) 32px,rgba(255,255,255,0.04) 33px)}
.pat-canvas{position:absolute;top:24px;left:24px;right:24px;bottom:80px;border:18px solid rgba(255,255,255,0.07);border-radius:2px}
.pat-nb{position:absolute;inset:0;margin-left:28px;border-left:2px solid rgba(255,255,255,0.1);background:repeating-linear-gradient(0deg,transparent,transparent 22px,rgba(255,255,255,0.05) 22px,rgba(255,255,255,0.05) 23px)}
.pat-mag{position:absolute;top:50%;left:50%;transform:translate(-50%,-68%);width:80px;height:52px;border:12px solid rgba(255,255,255,0.1);border-bottom:none;border-radius:40px 40px 0 0}
.pat-print{position:absolute;top:28px;left:28px;right:28px;bottom:90px;border:2px solid rgba(255,255,255,0.08);border-radius:3px}
.pat-print::before{content:'';position:absolute;top:8px;left:8px;right:8px;bottom:8px;border:1px solid rgba(255,255,255,0.05)}
.card-info{position:relative;z-index:2;padding:0 22px 16px;background:linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.4) 60%,transparent 100%);padding-top:60px}
.badge{display:inline-block;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;background:rgba(255,255,255,0.14);color:rgba(255,255,255,0.75);padding:3px 9px;border-radius:20px;margin-bottom:7px}
.pname{display:block;font-size:26px;font-weight:300;letter-spacing:-0.8px;color:#fff;line-height:1.1;margin-bottom:4px}
.pmeta{display:flex;align-items:center;justify-content:space-between}
.pprice{font-size:13px;color:rgba(255,255,255,0.55);letter-spacing:0.1px}
.pull-hint{font-size:9px;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.3);display:flex;align-items:center;gap:4px}
.pull-hint svg{opacity:0.4}
/* Tap zones */
.tap-l,.tap-r{position:absolute;top:0;bottom:0;width:38%;z-index:20;cursor:pointer}
.tap-l{left:0}
.tap-r{right:0}
/* Dots */
.dots{display:flex;justify-content:center;gap:5px;padding:7px 0 5px;flex-shrink:0;background:#080808}
.dot{width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,0.18);transition:all 0.3s ease}
.dot.on{width:18px;border-radius:3px;background:rgba(255,255,255,0.75)}
/* Nav */
.bnav{display:flex;justify-content:space-between;align-items:center;padding:10px 28px 18px;background:#080808;border-top:0.5px solid rgba(255,255,255,0.04);flex-shrink:0}
.me-btn{display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;cursor:pointer}
.me-lbl{font-size:9px;letter-spacing:0.5px;color:rgba(255,255,255,0.28);text-transform:lowercase}
.create-pill{background:#FFFFFF;color:#000;border:none;border-radius:22px;padding:10px 26px;font-size:13px;font-weight:500;letter-spacing:0.1px;cursor:pointer;display:flex;align-items:center;gap:7px;transition:transform 0.15s,opacity 0.15s}
.create-pill:active{transform:scale(0.96)}
/* Permission sheet */
.perm-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:flex-end;z-index:50;opacity:0;pointer-events:none;transition:opacity 0.3s ease;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.perm-overlay.show{opacity:1;pointer-events:all}
.perm-sheet{width:100%;background:#1C1C1E;border-radius:18px 18px 0 0;padding:22px 20px 24px;transform:translateY(100%);transition:transform 0.42s cubic-bezier(0.32,0.72,0,1)}
.perm-overlay.show .perm-sheet{transform:translateY(0)}
.perm-drag{width:36px;height:4px;background:rgba(255,255,255,0.15);border-radius:2px;margin:0 auto 18px}
.perm-icon-wrap{width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,#FF9A3C,#C05FFF);display:flex;align-items:center;justify-content:center;margin-bottom:13px}
.perm-title{font-size:15px;font-weight:600;color:#fff;margin-bottom:5px;line-height:1.3}
.perm-body{font-size:12px;color:rgba(255,255,255,0.45);line-height:1.6;margin-bottom:16px}
.buffer-row{display:flex;align-items:center;gap:10px;margin-bottom:18px}
.buffer-label{font-size:10px;letter-spacing:0.5px;color:rgba(255,255,255,0.35)}
.buffer-track{flex:1;height:3px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden}
.buffer-bar{height:100%;width:0%;background:linear-gradient(90deg,#FF9A3C,#C05FFF);border-radius:3px;transition:width 3s ease}
.buffer-bar.go{width:72%}
.perm-btns{display:flex;gap:8px}
.p-deny{flex:1;padding:11px;border-radius:12px;border:0.5px solid rgba(255,255,255,0.12);background:none;color:rgba(255,255,255,0.45);font-size:13px;cursor:pointer}
.p-allow{flex:2;padding:11px;border-radius:12px;border:none;background:#fff;color:#000;font-size:13px;font-weight:500;cursor:pointer;letter-spacing:0.1px}
.perm-sub{font-size:9px;color:rgba(255,255,255,0.2);text-align:center;margin-top:10px;letter-spacing:0.4px}
</style>

<div class="outer">
<div class="phone">
  <div class="island"></div>
  <div class="screen">
    <div class="statusbar">
      <span class="s-time">9:41</span>
      <span class="s-right">▮▮▮ WiFi 100%</span>
    </div>

    <div class="card-area" id="ca">
      <!-- Card 0: Calendar -->
      <div class="pcard" id="c0" style="left:0%">
        <div class="card-bg c0"></div><div class="tex"></div><div class="pat-cal"></div>
        <div class="card-info">
          <span class="badge">Most popular</span>
          <span class="pname">Calendar</span>
          <div class="pmeta">
            <span class="pprice">from $14 &nbsp;·&nbsp; ships in 5 days</span>
          </div>
          <div class="pull-hint" style="margin-top:8px"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 6l3 3 3-3" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>pull for sizes</div>
        </div>
      </div>
      <!-- Card 1: Canvas -->
      <div class="pcard" id="c1" style="left:100%">
        <div class="card-bg c1"></div><div class="tex"></div><div class="pat-canvas"></div>
        <div class="card-info">
          <span class="badge">Best gift</span>
          <span class="pname">Canvas Wrap</span>
          <div class="pmeta"><span class="pprice">from $29 &nbsp;·&nbsp; ships in 7 days</span></div>
          <div class="pull-hint" style="margin-top:8px"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 6l3 3 3-3" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>pull for sizes</div>
        </div>
      </div>
      <!-- Card 2: Notebook -->
      <div class="pcard" id="c2" style="left:200%">
        <div class="card-bg c2"></div><div class="tex"></div><div class="pat-nb"></div>
        <div class="card-info">
          <span class="pname">Notebook</span>
          <div class="pmeta"><span class="pprice">from $18 &nbsp;·&nbsp; ships in 5 days</span></div>
          <div class="pull-hint" style="margin-top:8px"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 6l3 3 3-3" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>pull for sizes</div>
        </div>
      </div>
      <!-- Card 3: Fridge Magnet -->
      <div class="pcard" id="c3" style="left:300%">
        <div class="card-bg c3"></div><div class="tex"></div><div class="pat-mag"></div>
        <div class="card-info">
          <span class="badge">Bundle &amp; save</span>
          <span class="pname">Fridge Magnet</span>
          <div class="pmeta"><span class="pprice">from $6 &nbsp;·&nbsp; ships in 5 days</span></div>
          <div class="pull-hint" style="margin-top:8px"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 6l3 3 3-3" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>pull for sizes</div>
        </div>
      </div>
      <!-- Card 4: Prints -->
      <div class="pcard" id="c4" style="left:400%">
        <div class="card-bg c4"></div><div class="tex"></div><div class="pat-print"></div>
        <div class="card-info">
          <span class="pname">Photo Prints</span>
          <div class="pmeta"><span class="pprice">from $4 &nbsp;·&nbsp; ships in 4 days</span></div>
          <div class="pull-hint" style="margin-top:8px"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 6l3 3 3-3" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>pull for sizes</div>
        </div>
      </div>

      <!-- Tap zones -->
      <div class="tap-l" id="tl"></div>
      <div class="tap-r" id="tr"></div>

      <!-- Permission overlay -->
      <div class="perm-overlay" id="po">
        <div class="perm-sheet">
          <div class="perm-drag"></div>
          <div class="perm-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="1" y="1" width="9" height="9" rx="2" fill="white" fill-opacity="0.9"/>
              <rect x="12" y="1" width="9" height="9" rx="2" fill="white" fill-opacity="0.45"/>
              <rect x="1" y="12" width="9" height="9" rx="2" fill="white" fill-opacity="0.45"/>
              <rect x="12" y="12" width="9" height="9" rx="2" fill="white" fill-opacity="0.9"/>
            </svg>
          </div>
          <div class="perm-title">"popa" would like to access your photos</div>
          <div class="perm-body">Browse products while your library loads silently in the background — no waiting around.</div>
          <div class="buffer-row">
            <span class="buffer-label">Buffering photos</span>
            <div class="buffer-track"><div class="buffer-bar" id="bb"></div></div>
          </div>
          <div class="perm-btns">
            <button class="p-deny" id="db">Don't allow</button>
            <button class="p-allow" id="ab">Allow Access</button>
          </div>
          <div class="perm-sub">Your photos never leave your device until you order</div>
        </div>
      </div>
    </div>

    <!-- Dots -->
    <div class="dots" id="dots">
      <div class="dot on"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div>
    </div>

    <!-- Nav -->
    <div class="bnav">
      <button class="me-btn">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="8" r="4" stroke="white" stroke-opacity="0.3" stroke-width="1.3" fill="none"/>
          <path d="M3 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" stroke-opacity="0.3" stroke-width="1.3" fill="none"/>
        </svg>
        <span class="me-lbl">me</span>
      </button>
      <button class="create-pill" id="cpill">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 1v11M1 6.5h11" stroke="black" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        create
      </button>
      <div style="width:38px"></div>
    </div>
  </div>
</div>
</div>

<script>
let cur=0,tot=5;
const cards=[...document.querySelectorAll('.pcard')];
const dots=[...document.querySelectorAll('.dot')];
function go(n){
  if(n<0||n>=tot)return;
  cur=n;
  cards.forEach((c,i)=>{
    c.style.left=((i-cur)*100)+'%';
    c.style.transition='left 0.4s cubic-bezier(0.32,0.72,0,1)';
  });
  dots.forEach((d,i)=>d.classList.toggle('on',i===cur));
}
document.getElementById('tl').onclick=()=>go(cur-1);
document.getElementById('tr').onclick=()=>go(cur+1);

function openPerm(){
  const o=document.getElementById('po');
  o.classList.add('show');
  setTimeout(()=>document.getElementById('bb').classList.add('go'),150);
}
function closePerm(){document.getElementById('po').classList.remove('show')}
document.getElementById('cpill').onclick=openPerm;
document.getElementById('db').onclick=closePerm;
document.getElementById('ab').onclick=closePerm;
</script>




```

> **Note for Claude Code:** The prototype uses vanilla JS for interaction. Implement in React with the same visual output. Use `framer-motion` for the card transitions and sheet animation. Use CSS custom properties matching the design system in Section 1.

---

## 6. Component Checklist for Claude Code

Before marking the home screen as done, verify:

- [ ] Full-screen product card fills content area exactly
- [ ] Horizontal swipe AND tap-zone navigation both work
- [ ] Dot indicator syncs with active card
- [ ] "Pull for sizes" gesture registered (sheet content TBD)
- [ ] Create pill has correct gradient-accent treatment
- [ ] Tapping Create opens permission sheet with backdrop blur
- [ ] Buffer bar starts animating immediately on sheet open
- [ ] Buffer bar uses signature amber-to-violet gradient
- [ ] Permission grant triggers Google Photos API call in background
- [ ] User can dismiss sheet and continue browsing — no blocking
- [ ] Dark mode is default; light mode toggle in Me section
- [ ] All transitions use `cubic-bezier(0.32, 0.72, 0, 1)`
- [ ] Film grain texture on all product cards
- [ ] Wordmark renders at correct tracking and opacity

---

*Next: Aha Moment screen brief — the photo preview with zoom-in animation.*

---

# popa — Aha Moment Screen Brief

## 7. The Aha Moment — Full Flow (3 Screens)

This is the north star of popa. Every engineering decision is subordinate to
making this feel like maska — pure butter. No wait, no friction, no spinners.

---

### 7.1 Screen: Photo Gallery

The user arrives here after selecting a product from the home screen.
Photos are **already loaded** — buffered in the background since permission
was granted. The user should never wait for photos to appear.

**Layout:**
```
┌─────────────────────────────┐
│  ← Canvas Wrap              │  ← Back context (which product)
│  Choose a photo             │  ← 19px, weight 300
│  Tap to select · already loaded │
├─────────────────────────────┤
│  ● Buffering photos · 247 photos · instant  │  ← Speed strip
├─────────────────────────────┤
│  ┌───┐ ┌───┐ ┌───┐         │
│  │ ✓ │ │   │ │   │         │  ← 3-column photo grid
│  └───┘ └───┘ └───┘         │     First photo pre-selected
│  ┌───┐ ┌───┐ ┌───┐         │
│  │   │ │   │ │   │         │
│  └───┘ └───┘ └───┘         │
│  ┌───┐ ┌───┐ ┌───┐         │
│  │   │ │   │ │   │         │
│  └───┘ └───┘ └───┘         │
├─────────────────────────────┤
│  [ Preview on Canvas → ]    │  ← White pill CTA
└─────────────────────────────┘
```

**Speed strip** (critical UX signal):
- Animated gradient dot (amber → violet, pulsing)
- Label: "Photos ready"
- Right-aligned count: "247 photos · instant"
- This communicates to the user that the maska loading already happened.
  They didn't wait. popa worked in the background.

**Photo grid:**
- 3-column, square thumbnails, 2px gap
- Thumbnails are cached locally — loaded from device/Google Photos buffer
- First/most recent photo pre-selected with white border + ✓ badge
- Tapping any photo selects it (single select for now)
- No loading states — every thumbnail is already present

**CTA:** "Preview on Canvas →" — white pill, full width

---

### 7.2 Screen: The Aha Moment (Dolly Shot)

This is the moment. Triggered the instant the user taps "Preview on Canvas".

**What happens — the dolly sequence:**

```
Frame 0ms   : Screen transitions. Product appears small, slightly below centre,
              opacity 0.
Frame 60ms  : Animation begins.
Frame 130ms : Product reaches full opacity.
Frame 750ms : Product overshoots scale slightly (1.07×) — feels physical,
              like a camera pushing in.
Frame 920ms : Product settles back to 1.0× — spring physics, not ease.
Frame 980ms : Product name and size fade in below.
```

This is NOT a simple scale animation. It is a **dolly push** — the sensation
of a camera physically moving toward the subject. Use Framer Motion spring
with stiffness: 180, damping: 18.

**The flash:**
At the moment the photo lands on the product (frame ~80ms), a very brief
white flash (opacity 0.3 → 0, over 550ms) washes over the screen. Like a
camera flash. Like a memory being made.

**Layout during Aha:**
```
┌─────────────────────────────┐
│                             │
│                             │
│                             │
│       ┌─────────────┐       │
│       │             │       │  ← Canvas product, centred
│       │  [USER'S    │       │     dolly zooming in
│       │   PHOTO]    │       │
│       │             │       │
│       └─────────────┘       │
│                             │
│    Canvas Wrap · 12×16″     │  ← Fades in after zoom settles
│    Tap to edit · pinch to zoom │
│                             │
├─────────────────────────────┤
│  [ Looks great — edit ✦ ]  │  ← White pill
└─────────────────────────────┘
```

**Canvas product mockup rendering:**
- Full photo fills the canvas frame
- Canvas wrap edges visible: right side and bottom show the wrap-around
  (darker shade of the photo's dominant colour)
- Subtle gloss: `linear-gradient(135deg, rgba(255,255,255,0.08), transparent 50%, rgba(0,0,0,0.15))`
- Film grain overlay: `opacity: 0.05`
- Box shadow: `0 3px 0 rgba(0,0,0,0.5), 0 6px 20px rgba(0,0,0,0.6)`

**The ✦ symbol on the CTA button:**
The sparkle character appears only on this screen. It signals something
special just happened. Keep it subtle — same weight as the text.

---

### 7.3 Screen: Editor (immediately after Aha)

The editor slides in after tapping "Looks great — edit ✦". The product
stays visible but slightly smaller, centred, with crop handles overlaid.

**Layout:**
```
┌─────────────────────────────┐
│                             │
│       ┌──────────────┐      │
│       │ ┌──────────┐ │      │  ← Product with crop overlay
│       │ │          │ │      │     Corner handles visible
│       │ │ [PHOTO]  │ │      │
│       │ │          │ │      │
│       │ └──────────┘ │      │
│       └──────────────┘      │
│                             │
├─────────────────────────────┤
│ [Crop] [Brightness] [Contrast] [Warmth] [Text] → │  ← Scrollable chips
│                             │
│ Crop ────────●──────── +2   │  ← Active tool slider
├─────────────────────────────┤
│ [← Back]  [Add to order →] │
└─────────────────────────────┘
```

**Tool chips (horizontal scroll, single select):**
- Crop (default selected)
- Brightness
- Contrast
- Warmth
- Text

Each chip activates its own slider below. Advanced options (filters,
borders, etc.) are accessed by scrolling the chip row — not visible
by default. Progressive complexity principle.

**Slider:**
- Label left (tool name, 8px uppercase)
- Track with signature gradient fill (amber → violet)
- Thumb: 13px white circle with drop shadow
- Value right (numeric, muted)

**Bottom bar:**
- "← Back" ghost button (returns to Aha screen, preserves state)
- "Add to order →" white pill (primary CTA, proceeds to bundle upsell)

---

### 7.4 Technical Requirements for Maska Speed

These are hard engineering requirements, not suggestions.

**Thumbnail buffering (must happen before gallery screen appears):**
```
1. On permission grant (home screen) → immediately call Google Photos API
2. Fetch thumbnail URLs for most recent 247 photos (or device limit)
3. Preload thumbnail images into browser cache using link rel=preload
4. Store thumbnail blob URLs in a local Map keyed by photo ID
5. Gallery grid renders from this local cache — zero network requests
   at gallery render time
```

**Full-res loading (must happen before dolly animation starts):**
```
1. When user selects a photo → begin fetching full-res in background
2. Show preview button as active immediately (don't wait for full-res)
3. On "Preview" tap:
   a. If full-res ready → dolly animation starts instantly
   b. If still loading → show progress on button label ("Loading…")
      then trigger dolly when ready
4. Full-res processing (crop to product dimensions, colour profile
   conversion) happens in a Web Worker — never blocks main thread
```

**Target timings:**
| Action | Target |
|---|---|
| Gallery appears after product tap | < 100ms |
| All thumbnails visible | 0ms (pre-cached) |
| Dolly animation start after "Preview" tap | < 200ms |
| Full-res photo on product | < 3000ms total from tap |
| Editor appears after "Looks great" tap | < 150ms |

---

### 7.5 Component Checklist for Claude Code

Before marking the Aha Moment flow as done, verify:

- [ ] Gallery thumbnails render with zero loading delay (pre-cached)
- [ ] Speed strip shows correct photo count and "instant" label
- [ ] First photo is pre-selected on gallery load
- [ ] Tapping a photo updates selection state correctly
- [ ] Dolly animation uses Framer Motion spring (not ease/tween)
- [ ] Spring params: stiffness 180, damping 18
- [ ] White flash fires at animation start (opacity 0.3 → 0 over 550ms)
- [ ] Canvas wrap edges rendered (darker wrap-around sides)
- [ ] Product name + size fade in after dolly settles (delay: 650ms)
- [ ] ✦ character appears only on Aha screen CTA
- [ ] Editor crop handles visible on all four corners
- [ ] Tool chips horizontally scrollable, single-select
- [ ] Active tool shows slider immediately
- [ ] "← Back" returns to Aha screen with state preserved
- [ ] Full-res processing runs in Web Worker (verify via DevTools)
- [ ] Preview render time test passes: < 3000ms (the canonical Aha test)

---

*This section appends to popa-UX-brief.md.*
