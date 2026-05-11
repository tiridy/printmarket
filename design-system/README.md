# TİRİDY Design System

A design system for **TİRİDY** — Turkey's AI-powered 3D printing marketplace connecting customers with verified manufacturers. This system captures the visual language, content fundamentals, and UI patterns extracted directly from the production codebase.

## What is TİRİDY?

TİRİDY (pronounced *tee-ree-dee*) is a B2B/B2C marketplace where:

- **Customers** upload 3D files (STL / OBJ / 3MF / STEP), get instant AI-powered pricing analysis, and either receive bids from manufacturers or use **"Hızlı Üretim"** (Fast Production) for instant ordering.
- **Manufacturers** receive verified job leads matched to their material capacity and capabilities, build a public score, and chat with customers in real time.

Tagline (from landing): **"3D dosyandan saniyeler içinde fiyat al"** — *Get a price from your 3D file in seconds.*

### Core product surfaces

| Surface | Purpose | Reference |
|---|---|---|
| Marketing landing | Value prop, materials, manufacturer highlights | `app/page.tsx` |
| Explore / Marketplace | Filter & browse manufacturers | `app/explore/page.tsx` |
| Order flow (4-step) | Upload → Details → AI Pricing → Mode | `app/order/new/page.tsx` |
| Customer dashboard | Requests, offers, orders | `app/dashboard/customer/page.tsx` |
| Producer dashboard | Verification, products, offers, orders, revenue | `app/dashboard/producer/page.tsx` |
| Producer profile | Hero + portfolio + reviews + score breakdown | `app/producers/[id]/page.tsx` |
| Real-time chat | Per-order messaging with file attachments | `app/chat/[id]/page.tsx` |
| Auth | Login (email + Google + Apple), register, role select | `app/login/page.tsx` |

### Source

- **Repository:** `tiridy/printmarket` (branch `master`)
- **Stack:** Next.js 16, React 19, Tailwind CSS v4, Supabase, Geist font family
- **Locale:** Turkish (tr-TR). Currency: ₺ (Turkish Lira).
- **Three user roles:** customer, producer, admin (verification-gated).

---

## Content fundamentals

### Voice & tone

**Friendly, direct, action-oriented.** Copy is short, second-person familiar (Turkish "sen" form, not "siz"), and uses imperatives liberally. Sentences are clipped — landing-page CTAs and feature cards rarely exceed two short clauses.

- **You vs we:** addresses the user directly ("Dosyanı yükle", "Ücretsiz başla"). Brand uses "biz/we" only when explaining mechanism.
- **Casing:** Sentence case in body. Title Case is **not** used — Turkish convention is sentence-style. Brand wordmark is always full-caps with diacritic: **TİRİDY** (note the dotted İ).
- **Numbers & units:** Turkish locale formatting (`12.400+`, `4,9/5`, `₺340 – ₺520`). Price ranges use en-dash with spaces. Always currency-prefix.
- **Status language:** Past-tense or stative for completion (*"Tamamlandı"*, *"Onaylandı"*), present-progressive for active states (*"Üretimde"*, *"Yükleniyor..."*).

### Vocabulary anchors

These exact terms appear repeatedly and should be preserved:

| Concept | Term | Notes |
|---|---|---|
| Instant order shortcut | **Hızlı Üretim** | Always paired with ⚡ accent treatment |
| Bidding flow | Teklif Al / Teklif Talebi | "Get an offer" |
| AI pricing result | **AI Anlık Fiyat Analizi** | Capital A in AI |
| Verified manufacturer | Doğrulanmış Üretici | Trust marker |
| Producer score | Skor (0–100) | Numeric, with color tier |
| Categories | Süper Üretici · Hızlı Üretici · Ekonomik · Endüstriyel · Uzman · Yeni · Doğrulanmış | Badge taxonomy |

### Copy examples

**Hero:** "3D dosyandan / saniyeler içinde fiyat al" (line break is intentional — visual rhythm)
**Sub-hero:** "STL / OBJ dosyanı yükle, yapay zeka anlık fiyat hesaplasın. 340+ doğrulanmış üreticiden teklif al ya da 'Hızlı Üretim' moduyla anında sipariş ver."
**CTA primary:** "3D Dosya Yükle" / "Ücretsiz Başla" / "Teklif Al"
**Feature title:** "AI Anlık Fiyatlama" + 1-line description
**Empty state:** "Henüz talep oluşturmadınız" + helpful instruction

### Emoji usage

**Sparingly, decoratively, never as primary affordance.** The codebase uses emoji in three controlled places:
1. Dashboard nav icons (🏠 🛒 💬 📦) — **slated for replacement** with line icons in this design system; flagged as legacy.
2. Material chips on order form (🌿 PLA, ⚙️ ABS, 💧 PETG, 🔬 Resin, 🪢 Nylon, 🔩 Metal). Acceptable — adds visual recall.
3. Empty-state illustrations (📋 💬 📦 🔒 🎨). Acceptable as filler when no real illustration is available.

The waving 👋 appears in welcome cards. Star ratings are SVG, never ⭐.

### Microcopy patterns

- "← Geri" / "Devam Et →" for step navigation (literal arrow chars).
- Time qualifiers always concrete: *"2–3 gün"*, *"saniyeler içinde"*, *"24 saatte"*.
- Free-tier reassurance: *"Ücretsiz kayıt • Kredi kartı gerekmez • Anında başla"* — bullet-separated mid-dot.

---

## Visual foundations

### Color philosophy

**A warm, decisive palette anchored on a single signature orange.** The marketing surface is a deep slate (`slate-950 = #020617`) with orange as the action color and electric accents. The product surfaces invert to a soft gray (`gray-50 = #F9FAFB`) on white cards, with the same orange holding the primary actions for continuity.

- **Primary:** Orange-500 `#F97316` — used for CTAs, the wordmark, score rings ≥95, active tab borders, focus rings.
- **Marketing dark:** Slate-950 `#020617` background, slate-900 `#0F172A` cards, slate-800 `#1E293B` borders, slate-100 `#F1F5F9` foreground.
- **Product light:** Gray-50 `#F9FAFB` background, white surfaces, gray-200 `#E5E7EB` borders, gray-900 `#111827` foreground.
- **Score tiers:** Orange `≥95`, Blue `≥90`, Green `<90` — applied to score rings, ring borders, badge text.
- **Status colors:** Green (success/delivered), Yellow (pending), Blue (confirmed), Orange (in-progress), Purple (shipped), Red (cancelled/error). Applied as `bg-{color}-100` + `text-{color}-700` chip pairs.
- **Material badges:** Each material has a fixed color: PLA-green, ABS-blue, Resin-purple, PETG-orange, Nylon-yellow, Metal-slate.

### Typography

- **Geist Sans** (variable via `next/font/google`) for everything text-related. Loaded as `--font-geist-sans`.
- **Geist Mono** for code, metadata, and technical specs. Loaded as `--font-geist-mono`.
- **Weights in active use:** 400 (body), 500 (medium label), 600 (semibold), 700 (bold), **900 (black)** — the `font-black` weight is signature; used on hero H1, brand wordmark, statistic values, and price displays.
- **Tracking:** `tracking-tight` (-0.02em) on display headings, `tracking-[0.3em]` on UPPERCASE eyebrow labels (`text-orange-400 text-xs font-bold uppercase`).
- **Sizes:** Hero `text-7xl/text-6xl/text-5xl` responsive. Section H2 `text-4xl/text-5xl`. Body `text-sm` to `text-lg`. Eyebrow `text-xs`.

### Spacing & layout

- **Container caps:** `max-w-7xl` (1280px) for marketing/explore, `max-w-3xl` for forms (order/new, login), `max-w-5xl` for profile detail, `max-w-screen-xl` for dashboard chrome.
- **Vertical rhythm:** Marketing sections `py-24` (96px), card padding `p-6` to `p-8`, form gaps `space-y-6`.
- **Sidebar:** 224px (`w-56`) for explore filters, 208px (`w-52`) for dashboard nav.
- **Grid:** 3-up cards on desktop (`md:grid-cols-3`), 2-up on tablet, gap-4 to gap-6.

### Corner radii

A **deliberately rounded** system. No square corners.

| Token | Value | Use |
|---|---|---|
| `rounded-lg` | 8px | Small chips, nav items, dense table cells |
| `rounded-xl` | 12px | Inputs, secondary buttons, internal cards |
| `rounded-2xl` | 16px | Cards, modal panels, primary buttons |
| `rounded-3xl` | 24px | Marketing feature cards, drop zones, mode-select cards |
| `rounded-[2rem]` / `rounded-[2.5rem]` | 32–40px | Hero AI pricing card, CTA banner |
| `rounded-full` | ∞ | Pills, score rings, avatars, primary CTAs (`px-8 py-3.5 rounded-full`) |

The **fully-rounded primary button** is a signature — every hero CTA is a pill, not a rounded rectangle.

### Shadows

- **Marketing:** `shadow-2xl shadow-slate-950/60` for the floating AI-pricing hero card; large soft drop on dark.
- **Branded glow:** `shadow-lg shadow-orange-500/25` on primary buttons; `shadow-sm shadow-orange-200` on dashboard primary actions — orange-tinted shadow is a recurring brand-level lift.
- **Surface elevation:** `shadow-sm` on cards, `shadow-md` on hover, no shadows on dark surfaces (replaced by border color shift).
- **Inner backgrounds:** Hero uses `backdrop-blur-xl` over `bg-slate-950/90` for sticky nav.

### Backgrounds & motifs

- **Subtle radial blobs:** Marketing hero has `bg-orange-500/8 blur-3xl` and `bg-blue-500/6 blur-3xl` ambient blobs — pointer-events-none, behind content. Used **once per section max**, kept very low opacity (6–10%).
- **No gradients on long surfaces.** Gradients appear only in two specific places: (1) the orange CTA banner (`from-orange-500 to-orange-600`), (2) the headline emphasis word (`bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent`).
- **No textures, no patterns, no hand-drawn illustrations.** No imagery in the existing codebase outside SVG icons.
- **Portfolio placeholders** use gradient color fills (`from-blue-500/20 to-blue-900` etc.) with a faint cube SVG centered — for products without photo assets.
- **Status dot** with `animate-pulse` for live indicators (analysis complete, AI active, online).

### Animation & interaction

- **Transitions:** Default `transition` (150ms all). Duration is rarely overridden.
- **Hover lift:** Cards translate `-translate-y-0.5` and grow shadow on hover.
- **Hover color:** Borders darken (`hover:border-orange-300`), text shifts to brand orange.
- **Press / active:** Inherited; no explicit scale-down.
- **Focus:** `focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400` — soft glow, not hard ring.
- **Loaders:** A single primitive — `h-{n} w-{n} animate-spin rounded-full border-2 border-gray-200 border-t-orange-500`. Used everywhere there is async work.
- **Score bars:** Width-animated with `transition-all duration-700`.
- **No parallax, no scroll-triggered animation, no easing curves applied manually.**

### Borders & dividers

- **Marketing:** `border-slate-800` and `border-slate-800/60` (with backdrop). Top/bottom section dividers via `border-y border-slate-800`.
- **Product:** `border-gray-200` for rest, `border-gray-100` for inner separators, `border-orange-300` on hover/active.
- **Score rings:** `border-2` colored to score tier, sitting on white circle.
- **Drop zones:** `border-2 border-dashed`, color-shifts to orange on drag-over, green when filled.

### Cards (the workhorse)

The system has one core card archetype with three variants:

1. **Marketing card** — `rounded-3xl border border-slate-800 bg-slate-900/50 p-7` + hover `border-orange-500/30 bg-slate-900`.
2. **Product card** — `rounded-2xl border border-gray-200 bg-white p-6 shadow-sm` + hover `-translate-y-0.5 border-orange-300 shadow-md`.
3. **Inset card** — `rounded-xl border border-gray-200 bg-gray-50 p-4` (used inside other cards for list rows).

### Iconography

See **assets/ICONOGRAPHY.md** — using **Heroicons (outline, 1.5 stroke)** as the substitute system. The codebase uses inline Heroicons SVGs throughout; no icon font, no image-based icons, no emoji as icons. **Substitution flagged below.**

---

## Iconography summary (full notes in assets/ICONOGRAPHY.md)

**Primary icon system:** Inline SVG, **Heroicons-shape** (Outline, 1.5 stroke, 24×24 viewBox). The codebase hand-inlines Heroicons paths directly — no library dep. We use Heroicons CDN in this kit.

**Solid-fill icons** appear for: stars (rating), the verified-checkmark badge, the lightning bolt on Hızlı Üretim CTAs.

**Emoji as decoration** (not icons): Material chips, dashboard nav legacy, empty states. Documented but treated as deprecated path forward.

---

## Index — what's in this folder

```
README.md                              ← you are here
SKILL.md                               Cross-compatible skill manifest (Claude Code)
colors_and_type.css                    CSS variables: colors, type, radius, shadow tokens
assets/
  logos/tiridy-wordmark.svg            The TİRİDY brand wordmark (orange-500)
  ICONOGRAPHY.md                       Detailed icon system notes
preview/                               Design-system review cards (registered as assets)
  _base.css                              shared preview baseline
  logo.html · type-display · type-body · numbers
  colors-primary · colors-marketing-dark · colors-status · colors-materials
  radii · shadows
  buttons · inputs · cards · badges · score · dropzone · stepper · empty-states · icons
ui_kits/
  marketing/                           Landing recreation (dark)
    index.html                           Composed full-page kit
    MarketingNav · Hero · MaterialsGrid · ManufacturerPreview · Sections (Stats/CTA/Footer)
  product/                             App surface recreation (light)
    index.html                           Clickable kit (sidebar nav switches screens)
    AppShell · DashboardScreen · ExploreScreen · OrderStep1 · ChatScreen
```

Both UI kit `index.html` files are interactive — the product kit's sidebar swaps between Home / Explore / Yeni Sipariş / Mesajlar to demonstrate component coverage.

---

## Caveats & substitutions (FLAGGED)

- **Geist font** — the production app uses `next/font/google` to load Geist. In this kit we link Geist via Google Fonts CDN. If unavailable, the fallback is `Inter, system-ui`.
- **Heroicons** are pulled from CDN, not the inlined SVGs in the codebase. Visual parity should be 1:1 since the codebase uses Heroicons paths.
- **No real photography or product imagery** exists in `public/` — the codebase ships with default Next.js placeholder SVGs only. Portfolio cards use gradient color blocks with a Heroicons cube placeholder.
- **Dashboard emoji nav** is preserved in the UI kit for fidelity but flagged as a legacy pattern.
