/**
 * Generate placeholder test images for development/demo
 * Run this once to populate photos/ with sample images
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PHOTOS_DIR = path.join(__dirname, '../../photos');

const FRIENDS = [
    { slug: 'alice', displayName: 'Alice' },
    { slug: 'bob', displayName: 'Bob' },
    { slug: 'charlie', displayName: 'Charlie' }
];

const YEARS = [2001, 2002, 2004, 2005, 2010, 2015, 2020, 2023, 2024];

async function generatePlaceholder(width, height, text) {
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#4a90e2"/>
      <circle cx="${width / 2}" cy="${height / 2}" r="60" fill="#fff" opacity="0.8"/>
      <text x="50%" y="${height - 30}" font-size="32" font-weight="bold" text-anchor="middle" fill="#fff">
        ${text}
      </text>
    </svg>
  `;
    return sharp(Buffer.from(svg)).png().toBuffer();
}

async function setupTestPhotos() {
    console.log('📸 Generating placeholder test images...\n');

    for (const friend of FRIENDS) {
        const friendDir = path.join(PHOTOS_DIR, friend.slug);
        if (!fs.existsSync(friendDir)) {
            fs.mkdirSync(friendDir, { recursive: true });
        }

        // Not every friend has every year (to test missing year handling)
        const friendYears = YEARS.filter(() => Math.random() > 0.2); // 80% chance of inclusion

        for (const year of friendYears) {
            const filename = path.join(friendDir, `${year}.png`);

            if (fs.existsSync(filename)) {
                console.log(`  (skip) ${friend.slug}/${year}.png`);
                continue;
            }

            const placeholder = await generatePlaceholder(
                600,
                800,
                `${friend.displayName}\n${year}`
            );
            fs.writeFileSync(filename, placeholder);
            console.log(`  ✓ ${friend.slug}/${year}.png`);
        }
    }

    console.log('\n✓ Test photos ready. Run "npm run build" to process.\n');
}

setupTestPhotos().catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
});
