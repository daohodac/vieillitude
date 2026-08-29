# Friend Portraits — Project Spec

## What this is

A personal static website that shares 25 years of yearly portraits of a group of
friends. Two views:

1. **Matrix view** — one row per friend, one column per year, scrollable and
   filterable by name. Some cells are empty (a year is sometimes missing for a
   friend).
2. **Timelapse view** — pick a friend, see their portraits play through
   chronologically (slider or play button), skipping missing years gracefully.

## Goals

- Zero server to maintain — static hosting only.
- Easy to extend every year: drop in new photos, run one script, push.
- Not indexed by search engines / not trivially stumbled upon by strangers.
  (See "Access protection" below — this is *not* meant to be bank-grade
  security, just a reasonable "friends only" gate.)
- Fast to load despite a growing multi-year photo archive.

## Non-goals

- No user accounts, comments, likes, uploads-from-browser, or admin UI.
  Content is managed by editing the repo directly.
- No real authentication/authorization system — see access protection options.

## Hosting & access protection

Default plan: **GitHub Pages**, deployed from this repo.

Important constraint (confirmed August 2026): GitHub Pages does not offer
access control for personal/Pro accounts — that feature requires GitHub
Enterprise Cloud. A Pages site built from a private repo is either
auto-unpublished (Free plan) or still fully public (Pro plan). So GitHub
Pages alone **cannot** truly restrict who can view the site.

Chosen mitigation (pick one, document the choice in this file once decided):

- **Option A — Obscurity + light gate (simplest)**: random unguessable URL
  path, `<meta name="robots" content="noindex">` + `robots.txt` disallow all,
  plus a basic client-side passphrase prompt (JS check) before the gallery
  renders. Not real security — a determined visitor can view source and
  bypass it — but keeps it off search engines and casual discovery.
- **Option B — Cloudflare Pages + Cloudflare Access**: same static-site
  deploy-on-push workflow, but gated behind real email-based one-time-code
  login restricted to a specific list of friends' email addresses. Check
  current Cloudflare pricing/limits before committing, as free-tier terms
  change.

**Claude Code: implement Option A first** (it's framework-agnostic and works
on GitHub Pages with zero extra infra). Structure the auth check as an
isolated module so swapping to Option B later doesn't require touching the
matrix/timelapse code.

## Data model

A single generated `manifest.json` at the site root, e.g.:

```json
{
  "friends": [
    {
      "slug": "alice",
      "displayName": "Alice",
      "years": {
        "2001": "photos/alice/2001.webp",
        "2002": "photos/alice/2002.webp",
        "2004": "photos/alice/2004.webp"
      }
    }
  ],
  "yearRange": { "min": 2001, "max": 2026 }
}
```

Missing years for a friend simply don't appear in their `years` object — the
UI renders an empty cell / skips that year in the timelapse.

**Do not hand-maintain this file.** It's generated from the folder structure
below by a build script (see "Build process").

## Folder structure (source of truth)

```
photos/
  <friend-slug>/
    <year>.jpg          # or .webp — original/working file per friend per year
```

- `<friend-slug>` is a stable, lowercase, hyphenated identifier per friend
  (e.g. `jean-dupont`), decoupled from their display name so renames don't
  break history.
- One file per friend per year. Absence = missing year, handled gracefully.

## Build process

A script (Node or Python — Claude Code's choice, pick whichever fits the
rest of the stack) that:

1. Walks `photos/<slug>/<year>.*`.
2. Resizes/converts each source image into two derived sizes as WebP:
   - a small thumbnail for the matrix grid,
   - a larger version for the timelapse view.
3. Writes derived images into a build/output folder (kept out of the
   hand-edited `photos/` source tree).
4. Emits `manifest.json` reflecting exactly what's on disk — no manual
   editing of the manifest ever.
5. Ideally runs both locally (for preview) and in a GitHub Action on push,
   so publishing a new year is: add files under `photos/`, commit, push.

Because the repo will accumulate many binary image versions over 25 years of
edits, **use Git LFS for the image files** to keep the plain git history
lean.

## Frontend

No framework required — vanilla HTML/CSS/JS is enough for this scope.

### Matrix view
- CSS Grid, friend names as sticky first column, years as sticky header row.
- Scrolls both directions for a large friend × year grid.
- Text input filters visible rows by friend name (client-side, no reload).
- Empty cells for missing years render as a subtle placeholder, not broken
  image icons.
- Clicking a row (or a "timelapse" button per row) opens that friend's
  timelapse view.

### Timelapse view
- Per friend: a slider (`<input type="range">`) or play/pause button that
  steps through their available years in order.
- Shows the current year as a label alongside the portrait.
- Skips missing years without an awkward pause/blank frame.

## Classification / backlog tooling (separate concern from the site)

Not part of the deployed site — local tooling to help sort the existing
25-year backlog into the `photos/<slug>/<year>.*` structure:

- Prefer a local photo manager with face detection (e.g. digiKam) to
  pre-cluster the backlog by person, or a small `face_recognition`-based
  Python script seeded with one reference photo per friend.
- A lightweight local "sorting" web page (drag/drop a photo, click a friend
  button, type a year, it moves/renames the file) as a fallback for whatever
  face-recognition doesn't confidently sort.
- EXIF capture dates are unreliable for scanned older photos — don't rely on
  them for the year; only trust EXIF for digital-era captures.

This backlog tooling can be a separate script/folder in the repo, not
something the deployed site depends on.

## Open decisions for the implementer

- [ ] Confirm Option A vs Option B for access protection.
- [ ] Confirm Node vs Python for the build script (match to whatever's most
      convenient to run in a GitHub Action).
- [ ] Decide final friend list and slugs.
- [ ] Decide whether thumbnails are pre-generated at build time (recommended)
      or resized client-side (not recommended — slower, worse for mobile).
