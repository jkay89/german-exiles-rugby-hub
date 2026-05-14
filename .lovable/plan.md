# Kaiser Cup Feature Plan

## What gets built

1. **New public page `/kaiser-cup`**
   - Hero with title + the description you provided (the "what is the Kaiser Cup" copy).
   - Event details block: date, time, venue, location.
   - Sponsors sections grouped by category: Main, Ball, MOTM, Warm-Up Tops, Affiliates (and any other categories you add).
   - Each sponsor shows logo + name, clickable if a website is set.

2. **Navigation**
   - Add "Kaiser Cup" link to the main nav.

3. **Admin: `/admin/kaiser-cup`**
   - Edit event details (date / time / venue / location).
   - Edit description text (rich text).
   - Manage sponsors: add / edit / delete, with fields: name, logo (Cloudinary upload), website URL, category (dropdown: main, ball, motm, warm_up_top, affiliate, other), display order.
   - Multiple sponsors per category supported.

4. **Home page sponsor carousel**
   - Kaiser Cup sponsors are appended to the existing moving sponsor carousel on the homepage.
   - They are tagged so they DO NOT appear on `/sponsors` (the main sponsors page).

## Database changes

Two new tables (separate from existing `sponsors` table so they never bleed into the main sponsors page):

- **`kaiser_cup_event`** (single-row settings table)
  - `description` (text, rich), `event_date` (date), `event_time` (text), `venue` (text), `location` (text)

- **`kaiser_cup_sponsors`**
  - `name`, `logo_url`, `website_url`, `category` (text: main | ball | motm | warm_up_top | affiliate | other), `display_order`, `is_active`

RLS: public read; admin-only write (using existing `is_admin()`).

## Technical notes

- Public reads on both tables; mutations gated by `is_admin(auth.uid())`.
- Home `SponsorCarousel` will fetch from both `sponsors` (existing) + `kaiser_cup_sponsors` and merge for display only.
- `/sponsors` page stays unchanged — it only reads `sponsors` table, so Kaiser Cup logos won't appear there.
- Logos uploaded via existing Cloudinary util (same pattern as match sponsors).

## Files

New:
- `src/pages/KaiserCup.tsx`
- `src/pages/admin/AdminKaiserCup.tsx`

Edited:
- `src/App.tsx` (routes)
- `src/components/navigation/NavigationLinks.tsx` (nav link)
- `src/components/home/SponsorCarousel.tsx` (merge Kaiser sponsors)
- `src/pages/admin/AdminDashboard.tsx` (admin tile)

Confirm and I'll run the migration and build it.
