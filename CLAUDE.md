@AGENTS.md

# the round — Client (user app)

The practice app for **the round**: clinical speaking practice for student midwives. Users spin a random clinical topic, answer it out loud against the clock, replay their recording, reflect, and go again. Tagline: "Find the words. One round at a time." / "Know it. Say it. Practice it."

This is the `APP_URL` front-end of `theround-service` (welcome and invite emails link here).

## Sibling projects (all in `~/Documents/code`)

| Folder | What | Stack |
| --- | --- | --- |
| `theround` | Landing page + waitlist (gettheround.com). **Source of the brand.** | Next 16, Tailwind 4, framer-motion |
| `theround-admin` | Founder dashboard (port 3001). Same auth/API pattern this app copies. | Next 16, Tailwind 4, Tiptap |
| `theround-service` | API: NestJS + TypeORM, Postgres (Neon) / SQLite dev, S3 audio, Resend email. Everything under `/api`. README has the full endpoint list. | NestJS |
| `the-round-admin-dashboard` | Old single-file mockup. Superseded by `theround-admin`; ignore. | — |

## Stack notes

- Next 16.4 with `cacheComponents` and `partialPrefetching` on (see `next.config.ts`). Read `node_modules/next/dist/docs/` before using an API; dynamic data (`cookies()`, `apiFetch`) must sit under a `<Suspense>` boundary.
- Tailwind 4 through the `@tailwindcss/turbopack` loader (no PostCSS config). Tokens live in `app/globals.css` (`@theme inline`).
- Route protection goes in `proxy.ts` (Next 16 renamed middleware), like `theround-admin/proxy.ts`.
- Dev port is **5173** to match the service's default `APP_URL`.

## API and auth

- `lib/api.ts` → `apiFetch()` calls the service **server-side only** with `Authorization: Bearer <jwt>` from the httpOnly `tr_session` cookie (`lib/session.ts`). The browser never talks to the API. 401/403 → `/auth/signout?reason=expired|suspended`, which clears the cookie and shows the reason on `/login`. Server actions that catch errors must call `unstable_rethrow(e)` so those redirects get through.
- **Sign-in flow** (all server-side, no Google JS on the page):
  1. `/login` → "Continue with Google" links to `/auth/google` (route handler): sets `tr_oauth` (state + `next`), redirects to Google's consent screen (OAuth code flow, `openid email profile`).
  2. `/auth/google/callback`: checks state, swaps the code for Google's ID token (needs `GOOGLE_CLIENT_SECRET`), then `POST /auth/google {idToken}`.
  3. Session → `tr_session` cookie (30 days) → `/onboarding` if `user.onboarded` is false, else `next` or `/`. Two-factor on → `tr_2fa` challenge cookie (5 min) → `/login/verify` → `verifyTwoFactor` action → `POST /auth/2fa`.
  4. `/onboarding`: step 1 `PATCH /me {name, stage, course, year, semester}` (qualified users: profession goes in `course`), step 2 `PATCH /me {avatarId, goal}` → `/`.
  5. Sign out: `signOut` action (the service has no user logout endpoint; JWTs just expire).
- `proxy.ts`: no `tr_session` → `/login?next=…`; signed in → away from `/login`; `/login/verify` needs `tr_2fa`.
- Round lifecycle: `POST /rounds/spin` → `POST /rounds/:id/start {durationSeconds 90|240}` → `POST /rounds/:id/complete` (multipart `audio` + `spokenSeconds`) → `POST /rounds/:id/save {reflection?, note?}`, or `DELETE /rounds/:id` to discard. Only saved rounds show in history/stats.
- Audio: `GET /rounds/:id/audio` → signed URL (~15 min) for `<audio src>`.
- Response types live in `lib/types.ts`.
- Env (`.env.example`): `THEROUND_API_URL` (includes `/api`), `APP_URL`, `GOOGLE_CLIENT_ID` (same as the service's), `GOOGLE_CLIENT_SECRET`. Register `<APP_URL>/auth/google/callback` as a redirect URI on that Google OAuth client.

## The app (signed in)

Designs: `~/Downloads/01 · … Desktop.png` … `20 · … Desktop.png` (4x of 1440×900) and the mobile set in `~/Downloads/the round.zip` (includes 11 · Rename session). Chat-style practice:

- `app/(app)/layout.tsx`: session sidebar (`components/app/sidebar.tsx`, drawer on mobile via `shell.tsx`) + page.
- `/` home (01/02, 12 undo toast): greeting, "What shall we *practise today?*", topic chips (midwifery or nursing set by `user.course`), composer (shuffle = surprise; typing a topic starts it).
- `/s/[id]` session (03–11): `components/app/session-view.tsx` renders the thread: user bubble → intro → `QuestionCard` (answer length, real mic recording via `use-recorder.ts`, different question) → `AnsweredCard` with playback → "Listening back…" → `FeedbackBlock` → Try again / Next question / Change topic (inline topic chips). Header: rename (pencil or tap title), delete (`delete-dialog.tsx`) → home with Undo.
- `/profile` (13–20): stats, avatar picker (+ photo upload in mock mode), accordion rows for name, stage, course or registration, year & semester, focus, default answer length; sign out.
- Server actions: `app/actions/practice.ts`, `app/actions/profile.ts`. Data: `lib/practice/repo.ts` → `practice()` returns the mock or API repository; types in `lib/practice/types.ts`; topic colours/icons in `lib/practice/catalog.ts` + `components/app-icons.tsx` (inline Lucide-style SVGs, no icon package).

**Backend:** `theround-service` `/practice/*` (src/practice) implements the same contract (`lib/practice/api-repo.ts`). Feedback scoring there is a placeholder (see its README → Practice sessions). Photo upload has no backend yet (profile hides it outside mock mode).

## Mock mode (local demo)

`MOCK_MODE=1` in `.env.local` (ignored in production builds): no backend needed. `/login` shows "Local demo: continue as Nkem · start from onboarding" (`/auth/demo`, `/auth/demo?onboarding=1`, `/auth/demo?reset=1` reseeds). Data lives in memory (`lib/mock/store.ts`, on `globalThis`, survives hot reload, resets on server restart): seeded user Nkem (Student Midwife, Year 2) with three past sessions, real recordings kept in memory and served from `/api/mock-audio/[id]`, feedback from `lib/practice/feedback.ts`. `apiFetch` routes `/me` to `lib/mock/api.ts`.

## Design system (App V2)

Source designs (not in the repo): `~/Downloads/Section 1.png` (auth: sign-in + 2-step onboarding, desktop 1440 and mobile 393) and `~/Downloads/App V2 · Shared elements.png` (avatars, icons, topic tags, history nav, recording controls, composer, profile rows, stat cards). Both are 3.1x / 8.4x exports; measure at 1x.

The app is **light**: paper panels with a forest-green brand panel on the left (desktop) or a compact brand header (mobile sign-in only).

**Colour tokens** (`app/globals.css`, sampled from the designs): `ink` #14271a brand panel + headings · `forest` #15251a primary button · `lime` #caff79 arrow circles + italic headline · `moss` #5e9d3d eyebrows, progress, selection, links · `sprout` #8fb85d waveform · `mist` #ecefe9 desktop canvas · `paper` #fbfcf9 content · `chip` #f4f6f2 · `brand-card` #213327 / `brand-line` #37473c · `field` #dce2d8 borders · `track` #e5e9e2 · `tint` #eef4ea selected bg · `ring` #82a874 selected border · `dot-off` · `disabled` #b1b7b1 / `disabled-circle` · text `text` / `text-2` #5f675f / `text-3` #8a918a.

**Type:** Satoshi (`font-sans`) for everything; Newsreader italic (`font-serif`, Google Fonts) only for the "before they count." line, as the closest open match to the design's serif. Headings are Satoshi medium with heavy negative tracking (`Heading`: 68px / 57px desktop, 44.5px / 41px mobile). Eyebrows 13px bold caps, `tracking-[0.075em]`, moss. Field labels 13px medium (14px mobile). Brand name is "the round" (logo) / "The Round" (footer, buttons).

**Layout:** desktop = 15px mist inset, 24px-radius frame, brand panel ≈54% wide, content column 488–490px. Mobile = full-bleed paper, 18px gutter.

**Components:** `components/ui.tsx` (`Eyebrow`, `Heading`, `Sub`, `Label`, `TextInput`, `Select`, `OptionCard`, `PillButton` — forest pill with a lime arrow circle, `BackButton`, `ErrorNote`, `cx`); `components/auth/` (`AuthShell`, `AuthFooter`, `BrandPanel`, `BrandHeader`); `components/icons.tsx`. Avatars 1–8 are `public/avatars/{id}.png`, cut from the shared-elements sheet in that sheet's order (that order = `avatarId`).

**Voice:** short, warm, plain. Clinical but not cold. British spelling (haemorrhage, practise as verb). Respect `prefers-reduced-motion` (handled globally).
