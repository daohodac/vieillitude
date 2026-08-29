/**
 * Gate: Passphrase-based access control (isolated module)
 * This is intentionally decoupled from matrix/timelapse logic
 * so auth can be swapped for Cloudflare Access (Option B) without touching the gallery code.
 */

const GATE_PASSPHRASE = 'friends2026'; // TODO: change to real passphrase
const GATE_SESSION_KEY = 'vieillitude_gate_passed';

class Gate {
    constructor() {
        this.modal = document.getElementById('gate-modal');
        this.input = document.getElementById('gate-passphrase');
        this.button = document.getElementById('gate-submit');
        this.errorEl = document.getElementById('gate-error');

        // Detect which view we're on and get the appropriate container
        this.contentContainer = document.getElementById('matrix-container') ||
            document.getElementById('timelapse-container');

        this.setup();
    }

    setup() {
        // Check if user already passed gate in this session
        if (sessionStorage.getItem(GATE_SESSION_KEY) === 'true') {
            this.unlock();
            return;
        }

        // Bind events
        this.button.addEventListener('click', () => this.checkPassphrase());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkPassphrase();
            }
        });

        // Focus passphrase input
        this.input.focus();
    }

    checkPassphrase() {
        const entered = this.input.value.trim();

        if (entered === GATE_PASSPHRASE) {
            sessionStorage.setItem(GATE_SESSION_KEY, 'true');
            this.unlock();
        } else {
            this.errorEl.textContent = 'Incorrect passphrase. Try again.';
            this.input.value = '';
            this.input.focus();
        }
    }

    unlock() {
        // Hide gate, show content
        this.modal.style.display = 'none';
        if (this.contentContainer) {
            this.contentContainer.style.display =
                this.contentContainer.id === 'timelapse-container' ? 'flex' : 'flex';
        }

        // Trigger view-specific initialization
        if (window.matrixViewReady && document.getElementById('matrix-container')) {
            window.matrixViewReady();
        } else if (window.timelapseViewReady && document.getElementById('timelapse-container')) {
            window.timelapseViewReady();
        }
    }
}

// Initialize gate on page load
document.addEventListener('DOMContentLoaded', () => {
    new Gate();
});
