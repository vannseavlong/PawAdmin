# Paw — Project Status

Tracks status across all three repos in `/Users/suntel/personal/paw`:
`paw_sheetDB` (backend), `admin_portal` (this repo), `pet_carrying_app` (mobile).
Last updated 2026-07-15.

## Done

### `paw_sheetDB` (backend)
- Upgraded `longcelot-sheet-db` 0.1.18 → 0.1.39; fixed the breaking `createUserSheet`
  options-object change, `role`→`actor` rename, `sheet-db`→`lsdb` CLI/config/token-file
  renames. Verified against live Google Sheets data.
- Built the `/admin` API: `/admin/users` (list, status toggle), `/admin/services`
  (full CRUD + reorder), `/admin/bookings` (cross-user aggregation + the
  confirmed→active→completed transitions the mobile app doesn't expose). Documented in
  `ADMIN_API.md`. Verified end-to-end against live data (create/update/delete, invalid
  transition guard, etc.).
- Built a second, admin-only Google OAuth flow (`/admin/auth/google` →
  `/admin/auth/callback`), `login-only` + role-gated, with its own redirect URI
  separate from the mobile app's customer OAuth flow.
- `seeds/super-admin.ts` to seed a real admin account for local testing/login.

### `admin_portal` (this repo)
- Cloned `shadcn-admin`, git history stripped, de-branded to "Paw Admin".
- Real auth wired to the backend (Clerk and all fake/demo auth removed): email/password
  login, Google OAuth button, session bootstrap via `/user/auth/me`, route guard on
  `_authenticated`.
- Orders (`/admin/bookings`), Content (`/admin/services`), Users (`/admin/users`) pages
  built and wired to live data. Nav trimmed to Dashboard/Orders/Content/Users/Settings;
  Apps/Chats/Tasks/Help Center demo features removed. Dashboard shows real stat cards.
- Sign-in screen redesigned: two-column layout, phone-frame mockup on the left using the
  real app screenshot (`public/images/Home.jpg`), Paw's actual color palette.
- `pnpm lint` / `pnpm build` both pass clean.

### `pet_carrying_app` (mobile)
- No changes made this round — already a working app (auth, services browsing, booking
  flow, history) per its own `CLAUDE.md`. Untouched by the admin-portal work above.

## Remaining / known gaps

### `paw_sheetDB`
- [x] **External, human-only step:** register `http://localhost:3000/admin/auth/callback`
      (and the production equivalent, when deployed) as an *additional* authorized
      redirect URI on the Google Cloud OAuth client — the admin Google sign-in button
      won't complete a real round-trip until this is done.
- [x] User `status: "inactive"` (settable via `PATCH /admin/users/:id`) now blocks login on
      all three auth paths (email/password, customer Google OAuth, admin Google OAuth).
      Existing JWTs for already-logged-in users are not revoked (stateless JWT, no
      per-request DB check) — see `ADMIN_API.md` for the per-path status codes/behavior.
- [ ] No automated tests for the new `/admin/*` routes — verified manually via curl
      against live data during development, not covered by a test suite (the repo has no
      test runner configured at all, backend or otherwise).
- [x] 26 files changed, nothing committed yet — everything above is sitting in the
      working tree.

### `admin_portal`
- [ ] No automated tests for the new Orders/Content/Users features (the existing test
      suite covers old template scaffolding, not this work).
- [ ] No production deployment/hosting configured — dev-only right now
      (`VITE_API_BASE_URL` defaults to `localhost:3000`).
- [ ] Generic/default favicon and app icons — not yet swapped for Paw branding.
- [ ] "Terms of Use" / "Privacy Policy" on the sign-in page are placeholder text, not
      linked to real pages.
- [x] Zero commits in this repo since the git history was stripped — everything is
      uncommitted.

### `pet_carrying_app`
- [ ] iOS has no per-flavor Xcode scheme yet (existing gap, documented in `CLAUDE.md`) —
      iOS builds always use the prod entry-point's baked-in config.
- [ ] Minimal test coverage — only the default `test/widget_test.dart` boilerplate.
- [ ] `CLAUDE.md` has one uncommitted edit pending from earlier `/init` work.

### Cross-cutting / product-wide
- [ ] **No payment processing anywhere in the product.** Bookings track `daily_rate`/
      `total` but there's no real payment gateway — the mobile app's "Payment Methods"
      profile menu item is an explicit "coming soon" stub.
- [ ] **Multi-store/marketplace pivot — scoped, plan below, not started.** Deliberately
      parked until this admin portal ships and stabilizes. See "Planned: Multi-store /
      marketplace pivot" below for the full phased plan.

## Planned: Multi-store / marketplace pivot

Turns the current single-shop product into a marketplace of independently-managed shops.
Sequencing: **starts only after the admin portal above ships and stabilizes** — don't
begin implementation until asked.

Naming: role is **"Merchant"** (shop-owner / service-provider role, distinct from
`user`/`admin`) — already decided, keep this name rather than re-opening it.

### Phase 1 — Backend foundations (`paw_sheetDB`)
- [x] Add `merchant` as a third `role` value alongside `user`/`admin` on the `users` table;
      add `requireMerchant` middleware alongside the existing `requireAuth`/`requireAdmin`.
- [x] New admin-actor `shops` table: `shop_id` (PK), `owner_user_id`, `name`, `status`
      (`pending` / `active` / `suspended`), and basic shop configuration (description,
      logo, contact info, hours).
- [x] New shared **`catalog_items`** admin table (kept separate from the existing
      `services` table rather than generalizing it in place, to avoid touching the
      already-shipped admin portal Content page / mobile `GET /user/services`) with a
      `shop_id` column and an `item_type: 'service' | 'product'` discriminator, since
      shops may sell services or physical goods (e.g. pet accessories). **Isolate by
      `shop_id` in one shared table — do not give each merchant their own Google
      Sheet.** Schema-only for now — no CRUD endpoints against it yet (Phase 2/3 work).
- [x] Decided and implemented how `bookings`/orders reference a `shop_id`/merchant:
      denormalized `shop_id` column on `bookings` (mirrors the existing `service_name`
      denormalization), filterable in `GET /admin/bookings?shop_id=`. Stays empty until
      booking creation targets `catalog_items` instead of `services` (Phase 4).
- [x] Public, unauthenticated `POST /merchant/apply` — the registration form submission,
      no login required.
- [x] Admin review endpoints: `GET /admin/merchant-applications` (list, `?status=`),
      `POST /admin/merchant-applications/:id/approve` (generates invite + triggers email),
      `.../reject`.
- [x] Invite token design: single-use, expiring (7 days), **stored hashed**
      (HMAC-SHA256 with a dedicated `INVITE_TOKEN_SECRET`, never the raw token),
      rate-limited issuance/redemption (`express-rate-limit`: 5/hr/IP on apply,
      20/15min/IP on invite get+accept).
- [x] `GET/POST /merchant/invite/:token` — accept flow: set a password. **Google OAuth
      activation deferred** — the upstream `createAuthRouter` package has no way to carry
      the invite token through the OAuth redirect round-trip (no custom `state` support),
      so it needs a session/cookie mechanism this stateless-JWT codebase doesn't have yet.
      Documented as a known gap in `ADMIN_API.md`.
- [x] EmailJS integration for the invite email (`src/services/email.service.ts`, via the
      EmailJS REST API + built-in `fetch`). Best-effort — a failed/unconfigured send
      doesn't fail the approve request; the link is also console-logged in non-production.
- [x] Updated `ADMIN_API.md` (new Merchant Applications / Shops / public Merchant
      onboarding sections) and `FLUTTER_GUIDE.md` (new `shop_id` field note on
      `BookingModel`) for the new endpoints/shapes.

### Phase 2 — Admin portal (`admin_portal`)
- [ ] "Merchant Applications" nav section: review queue, approve/reject actions, detail
      view per application.
- [ ] Shop management view: list all shops, view/suspend/reactivate.
- [ ] Existing Content (`/admin/services`) page becomes shop-aware once catalog items
      carry `shop_id` — decide whether admin's view stays cross-shop (with a shop filter)
      or moves entirely to the merchant-facing surface in Phase 3.

### Phase 3 — Merchant-facing web
- [ ] Public, no-login registration form page (shop name, contact, type — services vs.
      goods — basic info) that posts to `POST /merchant/apply`.
- [ ] Invite acceptance page: set password or "Continue with Google".
- [ ] Merchant dashboard, scoped to the merchant's own `shop_id`: manage their catalog
      (services and/or products) and basic shop configuration (hours, description, logo,
      contact). Reuse the existing route-guard pattern (`_authenticated`), but every
      query/mutation must be scoped by the merchant's `shop_id` — never trust a client-
      supplied `shop_id`.

### Phase 4 — Mobile app (`pet_carrying_app`)

**Why a bigger rewrite than it looks:** the current app hard-assumes one shop end to
end — `ServiceController.services` is one global flat list with no `shopId`, tapping a
service on Home (`services_section.dart`) jumps *straight* into `AddBookingScreen` with
no browse/shop-selection step, the amber FAB opens that same booking form completely
blank, and there is **no GetX route table at all** (zero `GetPage`s — every screen is
pushed imperatively via `Get.to(() => Screen())`). None of that holds once a service
name isn't unique to one shop. UX decisions below made 2026-07-15.

Blocked on Phase 1 (`shop_id`/`item_type` need to exist in the API and
`FLUTTER_GUIDE.md` first) — sequence after backend + admin portal.

**New flow:**
```
Home (discovery)          Browse                ShopDetail             Booking
┌──────────────────┐     ┌─────────────────┐   ┌──────────────────┐  ┌──────────────────┐
│ search bar        │──┐ │ search + filters │   │ shop header       │  │ pet/date form,    │
│ category chips     │  ├▶│ shop list/grid   │──▶│ (logo/desc/hours) │─▶│ shop+item already  │
│ Popular Shops rail  │  │ (tap → ShopDetail)│   │ catalog: Services │  │ preselected (no    │
│ Near You rail (2)   │  └─────────────────┘   │ / Products tabs   │  │ freeform dropdown) │
└──────────────────┘                            │ (tap item → Book) │  └────────┬───────────┘
     ▲ FAB (search icon) also opens Browse ──────┘                            ▼
     │                                                                Confirmation screen (new)
     └────────────────────────────────────────────────────────────────────────┘
                                                                                 ▼
                                                                    Bookings tab (Upcoming/Past)
```

- [ ] **Nav bar restructure** (`app_screen.dart`, `navigation_controller.dart`): merge
      today's separate **Stays** and **History** tabs into a single **Bookings** tab with
      an internal segmented control (Upcoming / Past) — this frees a slot without
      crowding the bar. New 4-tab layout: **Home | Browse | Bookings | Profile**.
- [ ] **FAB repurposed** (`app_screen.dart:33-37`): stop opening a blank
      `AddBookingScreen` (`initialService: null`, empty dropdown — the thing that reads
      as a confusing "book nothing" entry point today). Point it at a new global
      `SearchScreen` instead (shops/items search), reachable from anywhere, same visual
      slot.
- [ ] **New `SearchScreen`**: text search across shops (and optionally catalog items),
      results list, tap → `ShopDetailScreen`.
- [ ] **New `BrowseScreen`** (Browse tab body): search bar + category filter chips +
      shop list/grid. Reached directly from the tab, or from tapping a Home category
      chip (pre-filtered) or "Popular Shops"/"Near You" "See all →".
- [ ] **Home page redesign** (`home_screen.dart`):
  - Keep `HomeHeader` (greeting/avatar/notifications) as-is.
  - Drop or replace `StatusCard` — it's currently hardcoded fake text
    ("3 pets checked in · 2 spots left") with a dead `onTap: () {}`; either remove it or
    repurpose as a real "your next upcoming booking" preview card linking into the
    Bookings tab.
  - Add a search bar entry point (same destination as the FAB/`SearchScreen`).
  - Add category quick-filter chips (Grooming, Boarding, Daycare, Pet Shop/products,
    etc. — `category` already exists as an unused string field on `Service`, formalize
    it as the filter key) → tapping one opens `BrowseScreen` pre-filtered.
  - Replace the flat `ServicesSection` grid with a **"Popular Shops"** horizontal rail of
    shop cards (logo, name, category tags) → tap opens `ShopDetailScreen`.
  - **"Near You" rail is phase-2 / not blocking initial ship** — needs shop lat/lng in
    the API and a location-permission flow in the app that doesn't exist today; stub it
    out or hide it until that groundwork lands.
- [ ] **New `ShopDetailScreen`**: shop header (logo, description, hours, contact) +
      catalog, tabbed or sectioned by `item_type` (Services / Products) once that field
      exists. Tapping a catalog item leads into booking with shop + item already known —
      no free-text service dropdown needed on this path.
- [ ] **`AddBookingScreen` rework**: when entered from `ShopDetailScreen`, shop+item are
      always preselected; the current service-dropdown-only entry point goes away since
      a "shopless" booking is no longer a valid state. Add pet/date/notes as today.
- [ ] **New booking confirmation screen** — today success is just `Get.back()` with a
      snackbar and no explicit confirmation step; add one that shows a summary
      (shop, item, dates) before landing on the Bookings tab (Upcoming segment).
- [ ] **Introduce a real GetX route table** (`app_pages.dart`/`app_routes.dart`,
      `GetPage` list passed to `GetMaterialApp`) instead of imperative `Get.to()` calls
      scattered across views — this graph is about to get 4-5 screens deep
      (Home/Browse → ShopDetail → Booking → Confirmation → Bookings), and named routes
      also set up future deep-linking (e.g. a push notification opening a specific shop).
- [ ] **New `Shop` entity/model/repository/datasource/usecase**, mirroring the existing
      `Service` structure (`domain/entities`, `data/models`, `data/repositories`,
      `data/datasources/{remote,local}`, `domain/usecases`).
- [ ] Update `Service` (or generalize to `CatalogItem`) with `shopId` + `itemType:
      'service' | 'product'` fields per the updated `FLUTTER_GUIDE.md`.
- [ ] `Booking`/`PetBooking` model and creation flow carry `shopId` through to the order.
- [ ] Surface shop-level branding (logo, description) on `PetDetailScreen` and
      Bookings-tab list items, so a booking is traceable back to its shop.

### Cross-cutting
- [ ] Finalize the bookings/orders ↔ `shop_id` association model (Phase 1 item above) —
      this affects the mobile booking flow (Phase 4) and admin Orders page, so nail it
      down before either depends on it.
- [ ] Full security pass on the invite-link flow (token hashing algorithm, expiry window,
      single-use enforcement, rate limiting on both `/merchant/apply` and invite
      redemption) before it ships to real users.
