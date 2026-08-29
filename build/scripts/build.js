const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PHOTOS_DIR = path.join(__dirname, '../../photos');
const DIST_DIR = path.join(__dirname, '../../build/dist');
const MANIFEST_PATH = path.join(__dirname, '../../build/manifest.json');

/**
 * Generate placeholder image for testing
 */
async function generatePlaceholder(width, height, text) {
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#e0e0e0"/>
      <text x="50%" y="50%" font-size="24" text-anchor="middle" dy="0.3em" fill="#999">
        ${text}
      </text>
    </svg>
  `;
    return sharp(Buffer.from(svg)).webp().toBuffer();
}

/**
 * Build the site: walk photos/, resize, output WebPs, generate manifest
 */
async function build() {
    console.log('🔨 Building vieillitude...');

    // Ensure output dir exists
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    const manifest = {
        friends: [],
        yearRange: { min: Infinity, max: -Infinity }
    };

    // Walk photos directory
    if (!fs.existsSync(PHOTOS_DIR)) {
        console.warn(`⚠️  ${PHOTOS_DIR} does not exist. Creating...`);
        fs.mkdirSync(PHOTOS_DIR, { recursive: true });
    }

    const slugs = fs.readdirSync(PHOTOS_DIR).filter(item => {
        const full = path.join(PHOTOS_DIR, item);
        return fs.statSync(full).isDirectory();
    });

    if (slugs.length === 0) {
        console.warn('⚠️  No friend directories found. Skipping image processing.');
    } else {
        for (const slug of slugs) {
            const slugDir = path.join(PHOTOS_DIR, slug);
            const years = {};

            // Read all files in friend directory
            const files = fs.readdirSync(slugDir);

            for (const file of files) {
                const fullPath = path.join(slugDir, file);
                const stat = fs.statSync(fullPath);

                // Skip directories and hidden files
                if (!stat.isFile() || file.startsWith('.')) {
                    continue;
                }

                // Extract year from filename (e.g., "2001.jpg" -> 2001)
                const match = file.match(/^(\d{4})\./);
                if (!match) {
                    console.warn(`⚠️  Skipping ${file}: filename must be YYYY.ext (e.g., 2001.jpg)`);
                    continue;
                }

                const year = match[1];

                // Ensure friend output dir exists
                const friendDistDir = path.join(DIST_DIR, slug);
                if (!fs.existsSync(friendDistDir)) {
                    fs.mkdirSync(friendDistDir, { recursive: true });
                }

                try {
                    // Read source image
                    const sourceBuffer = fs.readFileSync(fullPath);

                    // Generate thumbnail (300px width, maintain aspect)
                    const thumbBuffer = await sharp(sourceBuffer)
                        .resize(300, 300, { fit: 'cover', position: 'center' })
                        .webp({ quality: 80 })
                        .toBuffer();

                    const thumbPath = path.join(friendDistDir, `${year}-thumb.webp`);
                    fs.writeFileSync(thumbPath, thumbBuffer);
                    console.log(`✓ ${slug}/${year}-thumb.webp`);

                    // Generate full-size (800px width, maintain aspect)
                    const fullBuffer = await sharp(sourceBuffer)
                        .resize(800, 800, { fit: 'cover', position: 'center' })
                        .webp({ quality: 90 })
                        .toBuffer();

                    const fullSizePath = path.join(friendDistDir, `${year}-full.webp`);
                    fs.writeFileSync(fullSizePath, fullBuffer);
                    console.log(`✓ ${slug}/${year}-full.webp`);

                    // Track in manifest
                    years[year] = `photos/${slug}/${year}-thumb.webp`; // Grid uses thumb
                    manifest.yearRange.min = Math.min(manifest.yearRange.min, parseInt(year));
                    manifest.yearRange.max = Math.max(manifest.yearRange.max, parseInt(year));
                } catch (error) {
                    console.error(`✗ Error processing ${slug}/${file}:`, error.message);
                }
            }

            // Only add friend to manifest if they have at least one year
            if (Object.keys(years).length > 0) {
                manifest.friends.push({
                    slug,
                    displayName: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    years
                });
            }
        }
    }

    // Sort friends alphabetically
    manifest.friends.sort((a, b) => a.slug.localeCompare(b.slug));

    // If no friends found, set year range to sane defaults
    if (manifest.yearRange.min === Infinity) {
        manifest.yearRange.min = new Date().getFullYear();
        manifest.yearRange.max = manifest.yearRange.min;
    }

    // Write manifest
    const manifestDir = path.dirname(MANIFEST_PATH);
    if (!fs.existsSync(manifestDir)) {
        fs.mkdirSync(manifestDir, { recursive: true });
    }

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`\n✓ Manifest written to ${MANIFEST_PATH}`);
    console.log(`  - ${manifest.friends.length} friends`);
    console.log(`  - Years: ${manifest.yearRange.min}–${manifest.yearRange.max}`);

    // Copy manifest to site/ for frontend access
    const siteManifestPath = path.join(__dirname, '../../site/manifest.json');
    const siteDir = path.dirname(siteManifestPath);
    if (!fs.existsSync(siteDir)) {
        fs.mkdirSync(siteDir, { recursive: true });
    }
    fs.copyFileSync(MANIFEST_PATH, siteManifestPath);
    console.log(`✓ Manifest copied to ${siteManifestPath}`);

    // Copy WebP files to site/photos/ for serving
    const sitePhotosDir = path.join(__dirname, '../../site/photos');
    if (!fs.existsSync(sitePhotosDir)) {
        fs.mkdirSync(sitePhotosDir, { recursive: true });
    }

    const copyDirRecursive = (src, dest) => {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        const files = fs.readdirSync(src);
        files.forEach((file) => {
            const srcFile = path.join(src, file);
            const destFile = path.join(dest, file);
            if (fs.statSync(srcFile).isDirectory()) {
                copyDirRecursive(srcFile, destFile);
            } else {
                fs.copyFileSync(srcFile, destFile);
            }
        });
    };

    copyDirRecursive(DIST_DIR, sitePhotosDir);
    console.log(`✓ WebPs copied to ${sitePhotosDir}`);
}

build().catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
});
