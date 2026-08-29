# Git LFS Setup

## Why Git LFS?

This repo accumulates **many large binary image files** over 25 years. Without Git LFS:
- Each image file is stored in full in every clone
- Git history grows exponentially
- Cloning and pushing becomes very slow

**Git LFS solution:** Store only pointers to large files in git, keep actual binaries on LFS server (GitHub's free tier).

---

## Installation

### macOS

```bash
# Using Homebrew
brew install git-lfs
git lfs install
```

### Ubuntu / Debian

```bash
# Install
curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
sudo apt-get install git-lfs

# Initialize
git lfs install
```

### Windows

1. Download installer from [git-lfs.com](https://git-lfs.com/)
2. Run installer (it will run `git lfs install` automatically)

### Verify Installation

```bash
git lfs version
# Should output: git-lfs/3.x.x (or similar)
```

---

## Configuration

`.gitattributes` (already in repo) configures which files LFS tracks:

```
photos/**/*.jpg filter=lfs diff=lfs merge=lfs -text
photos/**/*.jpeg filter=lfs diff=lfs merge=lfs -text
photos/**/*.png filter=lfs diff=lfs merge=lfs -text
photos/**/*.gif filter=lfs diff=lfs merge=lfs -text
photos/**/*.webp filter=lfs diff=lfs merge=lfs -text
photos/**/*.tiff filter=lfs diff=lfs merge=lfs -text
photos/**/*.heic filter=lfs diff=lfs merge=lfs -text
photos/**/*.heif filter=lfs diff=lfs merge=lfs -text
```

All image files in `photos/` are tracked with LFS.

---

## Workflow

### Adding New Photos

```bash
# 1. Add photo files (as normal)
cp ~/Pictures/alice-2025.jpg photos/alice/2025.jpg

# 2. Stage files (git will automatically apply LFS tracking)
git add photos/alice/2025.jpg

# 3. Commit
git commit -m "Add 2025 photos"

# 4. Push (LFS files are uploaded to GitHub LFS server)
git push origin main
```

Git and LFS handle everything automatically. **You don't need to run any LFS commands manually.**

### Checking LFS Status

```bash
# See which files are tracked by LFS
git lfs ls-files

# Should output:
# <hash> photos/alice/2001.jpg
# <hash> photos/alice/2002.jpg
# ... etc
```

### Cloning Repo with LFS

```bash
# With LFS installed, normal clone works
git clone https://github.com/username/vieillitude.git
cd vieillitude

# LFS automatically downloads large files
# (This may take a moment on first clone due to image size)
```

If LFS is NOT installed when cloning, you'll get `.git/media/` pointers instead of actual files. **Just install Git LFS and run:**

```bash
git lfs pull
```

---

## GitHub Pages & LFS

**Good news:** GitHub Actions automatically handles Git LFS.

- When `.github/workflows/build-and-deploy.yml` runs on push, it clones the repo with LFS files already present
- `npm run build` reads from `photos/` and finds actual image files (not pointers)
- Workflow completes successfully

**No extra setup needed** — GitHub's free LFS tier is sufficient for this use case (~1000 images = ~2 GB at max).

---

## LFS Bandwidth Limits

**GitHub LFS free tier:**
- 1 GB storage per month (rolls over)
- 1 GB bandwidth per month (rolls over)
- Typical portrait image: 2-5 MB each
- 25 friends × 25 years × 2 sizes (thumb + full) = ~1000 files
- Estimated storage: 4-10 GB (within reasonable limits)

If you hit limits, upgrade to Pro ($5/month) for 100 GB storage/bandwidth.

---

## Removing LFS (Not Recommended)

If you decide not to use LFS:

```bash
# 1. Convert LFS files back to git (⚠️ increases repo size significantly)
git lfs uninstall

# 2. Remove LFS tracking from .gitattributes
# (Edit .gitattributes and remove LFS filter lines)

# 3. Commit
git commit -am "Remove Git LFS"

# 4. Push
git push origin main
```

**Warning:** This will add all binary files to git history, making clones very slow. **Not recommended for photo repos.**

---

## Troubleshooting

### "Smudge filter lfs failed" error

```
error: external filter 'git-lfs filter-process' failed
smudge filter lfs failed
```

**Solution:**
```bash
# Reinstall Git LFS
git lfs install --force

# Pull LFS files
git lfs pull

# Retry your command
```

### Large files show as pointers in repo

```
version https://git-lfs.github.com/spec/v1
oid sha256:...
size ...
```

This means:
- Git LFS is NOT installed on your machine, OR
- You cloned before installing Git LFS

**Solution:**
```bash
git lfs install
git lfs pull
```

### "Pack LFS object failed" on push

```
Uploading LFS objects: 100% (10/10)
error: failed to push some refs to 'origin'
```

Usually a temporary network issue. **Retry:**
```bash
git push origin main
```

If it persists, check your GitHub LFS quota:
1. Go to GitHub profile → **Settings** → **Billing and plans**
2. Check LFS usage under **Git LFS**
3. If exceeded, upgrade plan or remove old files

---

## Git LFS + GitHub Actions Example

The workflow (`.github/workflows/build-and-deploy.yml`) automatically:

1. **Checks out repo** with LFS files
2. **Runs npm run build:**
   ```bash
   # In build/scripts/build.js
   const sourceBuffer = fs.readFileSync(fullPath);  // ← reads actual image (not pointer)
   ```
3. **Generates WebPs** from actual files
4. **Deploys to Pages**

No extra steps or commands needed. LFS is transparent.

---

## Best Practices

1. **Always commit source images via Git LFS** — never commit generated WebPs
2. **Use `.gitignore` for build outputs:**
   ```
   build/dist/
   site/photos/
   site/manifest.json
   node_modules/
   ```
3. **Keep photos/ folder lean:**
   - Rename files to match `<year>.<ext>` before adding
   - Delete duplicates or unused photos
   - Compress originals before adding (LFS charges for storage)
4. **Test locally before pushing:**
   ```bash
   npm run build
   # Verify site/photos/ has WebPs
   # Verify site looks good locally
   git push origin main
   ```

---

**Last updated:** August 2026
