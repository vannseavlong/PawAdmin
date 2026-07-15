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
- [ ] **External, human-only step:** register `http://localhost:3000/admin/auth/callback`
      (and the production equivalent, when deployed) as an *additional* authorized
      redirect URI on the Google Cloud OAuth client — the admin Google sign-in button
      won't complete a real round-trip until this is done.
- [ ] User `status: "inactive"` (settable via `PATCH /admin/users/:id`) doesn't actually
      block login yet — it's informational only right now (noted in `ADMIN_API.md`).
- [ ] No automated tests for the new `/admin/*` routes — verified manually via curl
      against live data during development, not covered by a test suite (the repo has no
      test runner configured at all, backend or otherwise).
- [ ] 26 files changed, nothing committed yet — everything above is sitting in the
      working tree.

### `admin_portal`
- [ ] No automated tests for the new Orders/Content/Users features (the existing test
      suite covers old template scaffolding, not this work).
- [ ] No production deployment/hosting configured — dev-only right now
      (`VITE_API_BASE_URL` defaults to `localhost:3000`).
- [ ] Generic/default favicon and app icons — not yet swapped for Paw branding.
- [ ] "Terms of Use" / "Privacy Policy" on the sign-in page are placeholder text, not
      linked to real pages.
- [ ] Zero commits in this repo since the git history was stripped — everything is
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
- [ ] **Multi-store/marketplace pivot — scoped but not started.** Decisions already made
      (see memory `paw_multistore_pivot`): new "Merchant" role, shop catalog data isolated
      via a shared table with a `shop_id` column (not per-shop sheets), invitation emails
      via EmailJS, admin approves merchant applications before an invite goes out.
      Deliberately parked until this admin portal ships and stabilizes — pick this up
      only when asked.
