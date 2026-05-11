# TİRİDY UI Kit — Product

Recreation of the authenticated product surface (`app/dashboard/customer`, `app/explore`, `app/order/new`, `app/chat`).

- **Surface:** light (gray-50 background, white cards)
- **Width:** designed at 1280, app sidebar 208px + content
- **Screens covered:**
  - Customer dashboard (welcome card, KPIs, recent activity)
  - Explore / marketplace (filter sidebar + producer cards)
  - Order flow step 1 (drop zone)
  - Chat detail (per-order)

Components:
- `AppShell.jsx` — sidebar nav + topbar wrapper
- `DashboardScreen.jsx` — customer home with welcome + stats + recent
- `ExploreScreen.jsx` — filter sidebar + grid of producer cards
- `OrderStep1.jsx` — 4-step header + drop zone
- `ChatScreen.jsx` — message list + composer
