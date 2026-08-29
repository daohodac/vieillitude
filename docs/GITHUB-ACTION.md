# GitHub Action & Deployment

## Automatic Build and Deploy Workflow

The file `.github/workflows/build-and-deploy.yml` automates the entire build-and-deploy pipeline:

1. **Trigger:** Push to `main` branch
2. **Setup:** Node.js 18 installed
3. **Install:** npm dependencies
4. **Build:** `npm run build` (walks photos/, generates WebPs, writes manifest)
5. **Deploy:** Publish `site/` to GitHub Pages

---

## Setup

### 1. Enable GitHub Pages

1. Go to your repo **Settings**
2. Scroll to **Pages** section
3. Set **Source** to **GitHub Actions**
4. (If custom domain: add CNAME in Pages settings and in workflow)

### 2. Verify Workflow File

`.github/workflows/build-and-deploy.yml` is already created. Verify:

```yaml
on:
  push:
    branches:
      - main  # Workflow triggers on push to main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site
```

### 3. (Optional) Configure Custom Domain

Edit `.github/workflows/build-and-deploy.yml`, line ~34:

```yaml
- uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./site
    cname: friend-portraits.example.com  # <-- Add this line
```

Then:
1. Point DNS to GitHub Pages (see GitHub documentation)
2. Add CNAME file to repo (the action handles this if you set `cname:`)
3. Enable HTTPS in Pages settings

---

## Publishing Workflow

### To publish a new year of photos:

1. **Locally or on remote:**
   ```bash
   # Add new photos
   cp ~/Pictures/2025/*.jpg photos/<friend-slug>/
   
   # Rename to match format
   # photos/<friend-slug>/<year>.<ext>
   # e.g., photos/alice/2025.jpg
   ```

2. **Commit and push:**
   ```bash
   git add photos/
   git commit -m "Add 2025 photos for all friends"
   git push origin main
   ```

3. **GitHub Action runs automatically:**
   - Installs dependencies
   - Runs `npm run build` (generates WebPs, manifest)
   - Deploys to GitHub Pages
   - Site is live within 2-3 minutes

4. **Verify deployment:**
   - Check **Actions** tab in GitHub repo (see workflow run)
   - Visit `https://<username>.github.io/vieillitude/`

---

## Workflow Details

### Inputs

The workflow expects:
- **Branch:** `main` (can be changed in `.github/workflows/build-and-deploy.yml`)
- **Source images:** `photos/<slug>/<year>.*` (Git LFS tracked)

### Outputs

The workflow produces:
- **Generated files in `site/`:**
  - `site/photos/` — WebP thumbnails and full-size images
  - `site/manifest.json` — Friend/year metadata
- **Deployed to:** GitHub Pages at `https://<username>.github.io/vieillitude/`
- **Artifacts:** Automatically removed after 90 days (GitHub default)

### Secrets

The workflow uses `${{ secrets.GITHUB_TOKEN }}` (built-in, no setup needed):
- Allows the action to push to GitHub Pages
- Automatically provided by GitHub Actions

---

## Troubleshooting

### Workflow fails with "npm install" error

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve dependency tree
```

**Solution:** Update `package.json` versions or use `npm install --legacy-peer-deps` in workflow.

**File:** `.github/workflows/build-and-deploy.yml`, line 18
```yaml
- run: npm install --legacy-peer-deps
```

### Workflow fails with "npm run build" error

Check build script output:
1. Go to repo **Actions** tab
2. Click the failed workflow run
3. Click **build-and-deploy** job
4. Scroll to **Build site** step
5. Read the error output

Common causes:
- Image file naming doesn't match `<year>.<ext>` format
- `build/scripts/build.js` has a syntax error
- File permissions issue (shouldn't happen on GitHub)

### Site not deployed after workflow succeeds

1. Workflow succeeded but site looks old?
   - GitHub Pages caches for a few minutes — **hard refresh** (Cmd+Shift+R / Ctrl+Shift+R)
   - Or wait 5 minutes

2. Workflow succeeded but site won't load?
   - Check **Settings** → **Pages** → ensure source is **GitHub Actions**
   - Verify custom domain DNS (if applicable)

3. Workflow shows "Error: Deployment failed"
   - Check Pages permissions: ensure `GITHUB_TOKEN` has write access
   - Verify repo is public (or Pages is enabled on private repos with Pro)

---

## GitHub Pages Limits

- **Free plans (personal):** Pages is public-only; cannot restrict to private viewers (confirmed August 2026)
  - Use Option A passphrase gate for "friends only" access (current implementation)
- **Pro plans:** Same limitation — no access control on GitHub Pages
  - Consider Cloudflare Pages + Cloudflare Access (Option B) if real auth is needed
- **Enterprise Cloud:** Has access control built-in

See [PROJECT-SPEC.md](../docs/PROJECT-SPEC.md#hosting--access-protection) for discussion.

---

## Git LFS & GitHub Pages

**Git LFS tracking** is configured in `.gitattributes`:
- Source images in `photos/` are stored in Git LFS
- Reduces git history bloat (binary images aren't diffed)
- GitHub Actions automatically has LFS access (no extra setup needed)

**Important:** Do NOT commit generated WebP files:
- `build/dist/` — build artifacts
- `site/photos/` — generated output
- `site/manifest.json` — generated output

These are in `.gitignore` and will be regenerated on every build.

---

## Manual Deploy

If you need to deploy without GitHub Actions:

```bash
# Local build
npm run build

# The site/ folder is ready to deploy
# Option 1: Copy site/ contents to your hosting
# Option 2: Use gh-pages CLI
npm install -g gh-pages
gh-pages -d site

# Option 3: Manually push to gh-pages branch
git add site/
git commit -m "Deploy"
git push origin site:gh-pages
```

But **GitHub Actions is recommended** for automation.

---

**Last updated:** August 2026
