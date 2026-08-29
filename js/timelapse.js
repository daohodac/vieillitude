/**
 * Timelapse view: per-friend slider/playback through available years
 * Gracefully skips missing years
 */

class TimelapseView {
    constructor(manifest, slug) {
        this.manifest = manifest;
        this.slug = slug;
        this.friend = manifest.friends.find((f) => f.slug === slug);

        if (!this.friend) {
            throw new Error(`Friend not found: ${slug}`);
        }

        // Extract available years, sorted
        this.years = Object.keys(this.friend.years)
            .map((y) => parseInt(y))
            .sort((a, b) => a - b);

        if (this.years.length === 0) {
            throw new Error(`Friend ${slug} has no photos`);
        }

        this.currentIndex = 0;
        this.isPlaying = false;
        this.playInterval = null;

        // DOM elements
        this.container = document.getElementById('timelapse-container');
        this.friendNameEl = document.getElementById('friend-name');
        this.photoEl = document.getElementById('photo');
        this.yearLabelEl = document.getElementById('year-label');
        this.sliderEl = document.getElementById('year-slider');
        this.sliderLabelEl = document.getElementById('slider-label');
        this.playButtonEl = document.getElementById('play-button');
        this.backButtonEl = document.getElementById('back-button');
        this.yearInfoEl = document.getElementById('year-info');

        this.setup();
    }

    setup() {
        // Set up UI
        this.friendNameEl.textContent = this.friend.displayName;
        this.sliderEl.max = this.years.length - 1;
        this.sliderEl.value = 0;

        // Display year info
        this.updateYearInfo();

        // Event listeners
        this.sliderEl.addEventListener('input', () => {
            this.stop();
            this.currentIndex = parseInt(this.sliderEl.value);
            this.render();
        });

        this.playButtonEl.addEventListener('click', () => {
            if (this.isPlaying) {
                this.stop();
            } else {
                this.play();
            }
        });

        this.backButtonEl.addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.stop();
                this.previousYear();
            } else if (e.key === 'ArrowRight') {
                this.stop();
                this.nextYear();
            } else if (e.key === ' ') {
                e.preventDefault();
                if (this.isPlaying) {
                    this.stop();
                } else {
                    this.play();
                }
            }
        });

        // Initial render
        this.render();
    }

    render() {
        const year = this.years[this.currentIndex];
        const thumbUrl = this.friend.years[String(year)];
        const fullUrl = thumbUrl.replace('-thumb.webp', '-full.webp');

        this.photoEl.src = fullUrl;
        this.yearLabelEl.textContent = year;
        this.sliderEl.value = this.currentIndex;
        this.sliderLabelEl.textContent = `${this.currentIndex + 1} / ${this.years.length}`;
    }

    updateYearInfo() {
        const yearStr = this.years.map((y) => y.toString()).join(', ');
        this.yearInfoEl.innerHTML = `
            <p>Available years: ${yearStr}</p>
            <p style="font-size: 0.8rem; color: #777; margin-top: 0.5rem;">
                ← → arrow keys to navigate • Space to play/pause
            </p>
        `;
    }

    nextYear() {
        if (this.currentIndex < this.years.length - 1) {
            this.currentIndex++;
            this.render();
        }
    }

    previousYear() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.render();
        }
    }

    play() {
        this.isPlaying = true;
        this.playButtonEl.classList.add('playing');
        this.playButtonEl.textContent = 'Pause';

        // Play through years with 1s interval
        this.playInterval = setInterval(() => {
            if (this.currentIndex < this.years.length - 1) {
                this.nextYear();
            } else {
                // Loop back to start
                this.currentIndex = 0;
                this.render();
            }
        }, 1000);
    }

    stop() {
        this.isPlaying = false;
        this.playButtonEl.classList.remove('playing');
        this.playButtonEl.textContent = 'Play';
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    }
}

// Global entry point called by gate.js
window.timelapseViewReady = async function () {
    try {
        // Get slug from URL query params
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');

        if (!slug) {
            throw new Error('No friend slug provided (missing ?slug=...)');
        }

        // Load manifest
        const response = await fetch('manifest.json');
        if (!response.ok) {
            throw new Error(`Failed to load manifest: ${response.status}`);
        }
        const manifest = await response.json();

        // Initialize timelapse view
        const timelapse = new TimelapseView(manifest, slug);
        document.getElementById('timelapse-container').style.display = 'flex';
    } catch (error) {
        console.error('Error loading timelapse:', error);
        const errorEl = document.getElementById('error');
        const errorTextEl = document.getElementById('error-text');
        errorTextEl.textContent = `Error: ${error.message}`;
        errorEl.style.display = 'flex';
    }
};

// Fallback if gate is already passed
document.addEventListener('DOMContentLoaded', () => {
    const timelapseContainer = document.getElementById('timelapse-container');
    if (timelapseContainer.style.display !== 'none') {
        window.timelapseViewReady();
    }
});
