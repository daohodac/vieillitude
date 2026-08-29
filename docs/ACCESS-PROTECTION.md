# Access Protection — Option A

## Overview

The site uses **obscurity + light gate** (Option A from PROJECT-SPEC.md):
- Random unguessable URL path (handled by GitHub Pages URL)
- `robots.txt` blocks all search engines
- `<meta name="robots" content="noindex">` on all views
- Client-side passphrase gate before gallery renders

This is **not bank-grade security** but keeps the site off search engines and prevents casual discovery.

## Implementation

### Gate Module (`site/js/gate.js`)

- **Isolated** from matrix/timelapse logic so it can be swapped for Option B (Cloudflare Access) without touching gallery code
- **Session-based** — passphrase check stored in `sessionStorage` key `vieillitude_gate_passed`
- Reusable across both `index.html` and `timelapse.html`
- Auto-detects which view is loaded and initializes appropriately

### Current Passphrase

**`friends2026`** — Hardcoded in `site/js/gate.js` (line ~7)

Change this before deploying to production. Consider:
- Using a build-time environment variable (e.g., `VITE_GATE_PASSPHRASE`)
- Rotating monthly or per-deployment
- Sharing out-of-band with trusted friends

### SEO Blocking

**`site/robots.txt`:**
```
User-agent: *
Disallow: /
```

**HTML meta tags** (both `index.html` and `timelapse.html`):
```html
<meta name="robots" content="noindex">
```

This combination tells search engines not to crawl or index the site.

## Swapping to Option B (Cloudflare Access)

If you later migrate to Cloudflare Pages + Cloudflare Access:

1. Remove `site/js/gate.js` entirely
2. Remove gate-related imports and HTML from both `index.html` and `timelapse.html`
3. Configure Cloudflare Access policy with allowed email addresses
4. Matrix/timelapse logic stays unchanged — zero modifications needed

## Testing

- Passphrase: `friends2026`
- After entering once per session, no re-prompt (sessionStorage)
- Refresh page → gate re-checks (session persists during browser session)
- Close and reopen browser → gate re-prompts (new session)

