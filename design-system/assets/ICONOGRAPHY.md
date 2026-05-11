# TİRİDY Iconography

## Primary system: Heroicons (Outline, 1.5 stroke)

The TİRİDY codebase **inlines Heroicons SVG paths directly** in JSX — no icon library dependency. Every line icon found in the source matches a Heroicons path. The icons use a consistent style:

- **24×24 viewBox**, **fill: none**, **stroke: currentColor**, **strokeWidth: 1.5**
- `strokeLinecap="round"` and `strokeLinejoin="round"` on path segments
- Sized via Tailwind `w-{n} h-{n}` classes — typically `w-4 h-4` (form), `w-5 h-5` (buttons), `w-6 h-6` (feature cards), `w-8 h-8` (drop zones), `w-16 h-16` (portfolio placeholder)

In this design system kit, we link Heroicons via CDN script (`<script src="https://unpkg.com/heroicons-cdn"></script>` or copy SVGs from heroicons.com). The visual result is identical because the codebase already uses Heroicons paths.

### Cataloged icons in active use

From the source, mapped to Heroicons names:

| Use | Heroicons (outline) |
|---|---|
| Upload, Submit | `arrow-up-tray` |
| AI / Smart | `sparkles` |
| Lightning / Fast | `bolt` |
| Star (rating, fill variant) | `star` *(solid)* |
| Map pin / Location | `map-pin` |
| Document list | `document-text` |
| Chat | `chat-bubble` |
| Bell / Notifications | `bell` |
| Cube (3D file) | `cube` |
| Truck / Shipping | `truck` |
| Shield check | `shield-check` |
| Search | `magnifying-glass` |
| Check (success badge solid) | `check-badge` *(solid)* |
| Inline check (lists) | `check` |
| Arrow left/right | `arrow-left`, `arrow-right` |
| Chevron down | `chevron-down` |
| Paperclip (attach) | `paper-clip` |
| Send (rotated 90°) | `paper-airplane` |

## Secondary: Brand wordmark

Located at `assets/logos/tiridy-wordmark.svg`. Always:

- Color: `#F97316` (orange-500) — never re-tinted
- Font: Geist, weight 900, tracking -0.05em
- Casing: full-caps **TİRİDY** with the dotted İ characters preserved
- Min size: 88px wide. Don't shrink the wordmark below this.

## Emoji policy

**Status: legacy / decorative only.** Used as filler where a proper icon system isn't yet wired in. Do not introduce new emoji-as-icons in fresh designs.

Currently in production:

- Dashboard sidebar nav (🏠 🛒 💬 📦 🔍 🏭 ⚙️ 🚪) — replace with Heroicons.
- Material chips on order form (🌿 🔬 ⚙️ 💧 🪢 🔩) — acceptable; gives playful texture in a technical surface.
- Empty states (📋 💬 📦 🔒 🎨) — acceptable as placeholder.
- Welcome card greeting (👋) — acceptable; conventional micro-emoji.
- Score / rating display uses ⭐ in some footer text positions — replace with the SVG star.

## Brand-level glyphs

Two glyphs are used as tiny graphical accents:

- **Pulsing dot** — `<span class="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />` placed before live status text ("AI destekli", "Aktif").
- **Mid-dot bullet** `•` — used as a visual separator in trust strings: *"Ücretsiz kayıt • Kredi kartı gerekmez • Anında başla"*

## What this design system does NOT include

- No custom illustrations
- No mascots
- No 3D-rendered hero imagery
- No pattern fills / textures
