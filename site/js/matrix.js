/**
 * Matrix view: scrollable/filterable friend × year grid
 * Reads manifest.json and renders with sticky header (years) and sticky column (names)
 */

class MatrixView {
    constructor(manifest) {
        this.manifest = manifest;
        this.filteredFriends = manifest.friends;
        this.filter = '';
        this.zoom = 100;
        this.baseWidth = 350;

        this.friendsRowsEl = document.getElementById('friends-rows');
        this.yearsHeaderEl = document.getElementById('years-header');
        this.filterInputEl = document.getElementById('filter-input');
        this.yearRangeInfoEl = document.getElementById('year-range-info');
        this.zoomSliderEl = document.getElementById('zoom-slider');
        this.zoomLevelEl = document.getElementById('zoom-level');
        this.zoomInBtn = document.getElementById('zoom-in-btn');
        this.zoomOutBtn = document.getElementById('zoom-out-btn');
        this.zoomFitBtn = document.getElementById('zoom-fit-btn');
        this.scrollWrapperEl = document.querySelector('.matrix-scroll-wrapper');

        this.setup();
    }

    setup() {
        // Render year header
        this.renderYearsHeader();

        // Render initial matrix
        this.renderMatrix();

        // Setup filter
        this.filterInputEl.addEventListener('input', (e) => {
            this.filter = e.target.value.toLowerCase();
            this.applyFilter();
        });

        // Setup zoom controls
        this.zoomSliderEl.addEventListener('input', (e) => {
            this.zoom = parseInt(e.target.value);
            this.updateZoom();
        });

        this.zoomInBtn.addEventListener('click', () => {
            this.zoom = Math.min(200, this.zoom + 10);
            this.zoomSliderEl.value = this.zoom;
            this.updateZoom();
        });

        this.zoomOutBtn.addEventListener('click', () => {
            this.zoom = Math.max(50, this.zoom - 10);
            this.zoomSliderEl.value = this.zoom;
            this.updateZoom();
        });

        this.zoomFitBtn.addEventListener('click', () => {
            this.fitAllYears();
        });

        // Pinch-to-zoom on touch devices
        this.scrollWrapperEl.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -10 : 10;
                this.zoom = Math.max(50, Math.min(200, this.zoom + delta));
                this.zoomSliderEl.value = this.zoom;
                this.updateZoom();
            }
        }, { passive: false });

        // Calculate initial zoom to fit all years
        setTimeout(() => this.fitAllYears(), 100);

        // Display year range
        const { min, max } = this.manifest.yearRange;
        this.yearRangeInfoEl.textContent = `${min} – ${max}`;
    }

    updateZoom() {
        const newWidth = (this.baseWidth * this.zoom) / 100;
        document.documentElement.style.setProperty('--cell-width', `${newWidth}px`);
        this.zoomLevelEl.textContent = `${this.zoom}%`;
    }

    fitAllYears() {
        // Calculate zoom to fit all years on screen
        if (!this.scrollWrapperEl) return;

        const numYears = this.manifest.yearRange.max - this.manifest.yearRange.min + 1;
        const headerWidth = 150; // Friend name column width
        const availableWidth = this.scrollWrapperEl.clientWidth - headerWidth - 20; // 20px for scrollbar

        if (availableWidth <= 0) return;

        const totalWidth = numYears * this.baseWidth;
        const fitZoom = Math.max(50, Math.min(200, (availableWidth / totalWidth) * 100));
        this.zoom = Math.round(fitZoom);
        this.zoomSliderEl.value = this.zoom;
        this.updateZoom();
    }

    renderYearsHeader() {
        const { min, max } = this.manifest.yearRange;

        // Clear existing
        this.yearsHeaderEl.innerHTML = '';

        // Add corner cell
        const cornerCell = document.createElement('div');
        cornerCell.className = 'corner-cell';
        cornerCell.textContent = 'Friend';
        this.yearsHeaderEl.appendChild(cornerCell);

        // Add year cells
        for (let year = min; year <= max; year++) {
            const yearCell = document.createElement('div');
            yearCell.className = 'year-cell';
            yearCell.textContent = year;
            this.yearsHeaderEl.appendChild(yearCell);
        }
    }

    renderMatrix() {
        this.friendsRowsEl.innerHTML = '';

        for (const friend of this.manifest.friends) {
            const row = this.createFriendRow(friend);
            this.friendsRowsEl.appendChild(row);
        }
    }

    createFriendRow(friend) {
        const row = document.createElement('div');
        row.className = 'friend-row';
        row.dataset.slug = friend.slug;

        // Friend name cell (sticky left)
        const nameCell = document.createElement('div');
        nameCell.className = 'friend-name-cell';
        nameCell.innerHTML = `
            <div>${friend.displayName}</div>
            <button class="timelapse-button" data-slug="${friend.slug}">Timelapse</button>
        `;
        row.appendChild(nameCell);

        // Add timelapse button handler
        const timelapseBtn = nameCell.querySelector('.timelapse-button');
        timelapseBtn.addEventListener('click', () => {
            this.openTimelapse(friend.slug);
        });

        // Year cells
        const { min, max } = this.manifest.yearRange;
        for (let year = min; year <= max; year++) {
            const yearContainer = document.createElement('div');
            yearContainer.className = 'year-cell-container';

            const yearStr = String(year);
            const photoUrl = friend.years[yearStr];

            const photoCell = document.createElement('div');
            photoCell.className = 'year-photo';

            if (photoUrl) {
                const img = document.createElement('img');
                img.src = photoUrl;
                img.alt = `${friend.displayName} ${year}`;
                photoCell.appendChild(img);
            } else {
                photoCell.classList.add('empty');
                photoCell.textContent = '—';
            }

            yearContainer.appendChild(photoCell);
            row.appendChild(yearContainer);
        }

        return row;
    }

    applyFilter() {
        const rows = this.friendsRowsEl.querySelectorAll('.friend-row');

        rows.forEach((row) => {
            const slug = row.dataset.slug;
            const friend = this.manifest.friends.find((f) => f.slug === slug);
            const displayName = friend.displayName.toLowerCase();

            if (displayName.includes(this.filter)) {
                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
        });
    }

    openTimelapse(slug) {
        // Navigate to timelapse view with friend slug as query param
        window.location.href = `timelapse.html?slug=${slug}`;
    }
}

// Global entry point called by gate.js when gate unlocks
window.matrixViewReady = async function () {
    try {
        const response = await fetch('manifest.json');
        if (!response.ok) {
            throw new Error(`Failed to load manifest: ${response.status}`);
        }
        const manifest = await response.json();
        new MatrixView(manifest);
    } catch (error) {
        console.error('Error loading manifest:', error);
        document.getElementById('matrix-container').innerHTML = `
            <div class="loading">
                <p>Error loading manifest: ${error.message}</p>
            </div>
        `;
    }
};

// Fallback if gate is already passed
document.addEventListener('DOMContentLoaded', () => {
    const matrixContainer = document.getElementById('matrix-container');
    if (matrixContainer.style.display !== 'none') {
        window.matrixViewReady();
    }
});
