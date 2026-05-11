---
name: tiridy-design
description: Use this skill to generate well-branded interfaces and assets for TİRİDY (Turkey's AI-powered 3D printing marketplace), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Key files:
- `README.md` — full brand, content & visual foundations
- `colors_and_type.css` — drop-in CSS tokens (orange brand, Geist fonts, Turkish locale defaults)
- `assets/logos/tiridy-wordmark.svg` — primary wordmark (orange-500, never re-tinted)
- `assets/ICONOGRAPHY.md` — icon system notes (Heroicons outline 1.5)
- `preview/` — registered design-system review cards
- `ui_kits/marketing/` — dark landing surface (Hero, MaterialsGrid, ManufacturerPreview, StatsBar, CTABanner, Footer)
- `ui_kits/product/` — light app surface (AppShell with sidebar, DashboardScreen, ExploreScreen, OrderStep1, ChatScreen)

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files for the user to view. If working on production code, copy assets and read the rules to become an expert in designing with this brand.

If the user invokes this skill without other guidance, ask them what they want to build, ask some clarifying questions (audience, screen, locale), and act as an expert designer who outputs HTML artifacts or production code as needed.

Quick rules to remember:
- Turkish locale always — `tr` lang, `₺` prefix, comma decimals, sentence case (no Title Case).
- Brand wordmark **TİRİDY** must keep dotted İ; color is always `#F97316`.
- Marketing surfaces are dark (`slate-950` bg); product surfaces are light (`gray-50` bg). Don't mix.
- Primary CTAs are pill-shaped (`rounded-full`, ~`px-7 py-3.5`) with orange-tinted shadow.
- Use Heroicons outline 1.5 for line icons. Avoid emoji as primary affordance.
- "Hızlı Üretim" is a feature name — pair with a ⚡ accent or solid bolt icon, never plain text.
