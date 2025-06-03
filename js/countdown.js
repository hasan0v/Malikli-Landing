// Countdown Timer functionality
class CountdownTimer {
    constructor() {
        this.targetDate = null;
        this.interval = null;
        this.isInitialized = false;
        this.elements = {
            title: document.getElementById('countdown-title'),
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            timer: document.getElementById('countdown-timer')
        };
        this.dropData = null;
    }

    // Initialize countdown with drop data
    async initialize() {
        try {
            // Check if DOM elements are available yet
            if (!this.elements.timer) {
                this.elements = {
                    title: document.getElementById('countdown-title'),
                    days: document.getElementById('days'),
                    hours: document.getElementById('hours'),
                    minutes: document.getElementById('minutes'),
                    seconds: document.getElementById('seconds'),
                    timer: document.getElementById('countdown-timer')
                };
            }
            
            // If needed elements are not available, we might be initializing too early
            if (!this.elements.timer) {
                console.log('⏳ Countdown elements not yet available, will initialize later');
                return;
            }
            
            this.dropData = await window.supabaseClient.fetchActiveDrop();
            this.updateCountdownState();
            this.startCountdown();
            this.isInitialized = true;
            console.log('✅ CountdownTimer initialized successfully');
        } catch (error) {
            console.error('Error initializing countdown:', error);
            this.showError();
        }
    }

    // Update countdown state based on drop status
    updateCountdownState() {
        if (!this.dropData) {
            this.showError();
            return;
        }

        const now = new Date();
        const startDate = new Date(this.dropData.start_datetime);
        const endDate = new Date(this.dropData.end_datetime);

        if (window.supabaseClient.isDropUpcoming(this.dropData)) {
            // Drop is upcoming - countdown to start
            this.targetDate = startDate;
            this.elements.title.textContent = 'Drop Launches In';
            this.elements.timer.style.display = 'grid';
        } else if (window.supabaseClient.isDropActive(this.dropData)) {
            // Drop is active - countdown to end
            this.targetDate = endDate;
            this.elements.title.textContent = 'Drop Ends In';
            this.elements.timer.style.display = 'grid';
        } else {
            // Drop has ended
            this.showDropEnded();
            return;
        }
    }

    // Start the countdown interval
    startCountdown() {
        if (!this.targetDate) return;

        // Update immediately
        this.updateDisplay();

        // Update every second
        this.interval = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    // Update countdown display
    updateDisplay() {
        if (!this.targetDate) return;

        const now = new Date().getTime();
        const target = this.targetDate.getTime();
        const difference = target - now;

        if (difference <= 0) {
            this.onCountdownComplete();
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        this.elements.days.textContent = this.formatNumber(days);
        this.elements.hours.textContent = this.formatNumber(hours);
        this.elements.minutes.textContent = this.formatNumber(minutes);
        this.elements.seconds.textContent = this.formatNumber(seconds);

        // Add pulse animation to seconds
        this.elements.seconds.parentElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            this.elements.seconds.parentElement.style.transform = 'scale(1)';
        }, 100);
    }

    // Handle countdown completion
    onCountdownComplete() {
        this.stopCountdown();
        
        if (window.supabaseClient.isDropUpcoming(this.dropData)) {
            // Drop just started
            this.showDropLive();
        } else {
            // Drop just ended
            this.showDropEnded();
        }

        // Refresh drop data after a short delay
        setTimeout(() => {
            this.initialize();
        }, 5000);
    }

    // Show drop is live
    showDropLive() {
        this.elements.title.textContent = 'Drop is Live!';
        this.elements.title.style.color = '#D4AF37'; // Gold color
        this.elements.timer.innerHTML = `
            <div class="countdown-live">
                <div class="live-indicator">🔥</div>
                <p>The drop is now live! Join the waitlist to get notified about future drops.</p>
            </div>
        `;
        this.addLiveStyles();
    }

    // Show drop has ended
    showDropEnded() {
        this.elements.title.textContent = 'Drop Has Ended';
        this.elements.timer.innerHTML = `
            <div class="countdown-ended">
                <div class="ended-indicator">📧</div>
                <p>Join the waitlist to be the first to know about our next exclusive drop!</p>
            </div>
        `;
        this.addEndedStyles();
    }

    // Show error state
    showError() {
        this.elements.title.textContent = 'Stay Tuned';
        this.elements.timer.innerHTML = `
            <div class="countdown-error">
                <div class="error-indicator">⏰</div>
                <p>Our next exclusive drop is coming soon. Join the waitlist to be notified!</p>
            </div>
        `;
    }

    // Add styles for live state
    addLiveStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .countdown-live {
                text-align: center;
                padding: 2rem;
                background: linear-gradient(135deg, #D4AF37, #F4D03F);
                border-radius: 1rem;
                color: #2C3E50;
            }
            .live-indicator {
                font-size: 3rem;
                margin-bottom: 1rem;
                animation: pulse 1s infinite;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }

    // Add styles for ended state
    addEndedStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .countdown-ended, .countdown-error {
                text-align: center;
                padding: 2rem;
                background: #0abab5;
                border-radius: 1rem;
                color: #2C3E50;
                justify-content: center;
                display: flex;
                flex-direction: column;
                width: 25rem;
                position: relative;
                left: 30%;
            }
            .ended-indicator, .error-indicator {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
        `;
        document.head.appendChild(style);
    }

    // Format number with leading zero
    formatNumber(num) {
        return num.toString().padStart(2, '0');
    }

    // Stop countdown interval
    stopCountdown() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    // Refresh countdown with new data
    async refresh() {
        this.stopCountdown();
        await this.initialize();
    }

    // Destroy countdown instance
    destroy() {
        this.stopCountdown();
        this.dropData = null;
        this.targetDate = null;
    }
}

// Create global instance immediately
console.log('⏱️ Creating CountdownTimer instance');
window.countdownTimer = new CountdownTimer();

// Initialize immediately if possible
(function initCountdown() {
    try {
        window.countdownTimer.initialize();
        console.log('✅ CountdownTimer initialized');
    } catch (error) {
        console.log('⚠️ CountdownTimer initialization waiting for dependencies');
    }
})();

// Also initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Reinitialize if needed
    if (!window.countdownTimer.isInitialized) {
        console.log('🔄 Initializing CountdownTimer after DOM loaded');
        window.countdownTimer.initialize();
    }
    
    // Wait for Supabase to be ready for updated date
    const updateCountdown = () => {
        if (window.supabaseClient && window.supabaseClient.isConfigured) {
            window.countdownTimer.refresh();
        } else {
            setTimeout(updateCountdown, 100);
        }
    };
    
    updateCountdown();
});

// Handle page visibility changes (pause/resume when tab is hidden/visible)
document.addEventListener('visibilitychange', () => {
    if (window.countdownTimer) {
        if (document.hidden) {
            window.countdownTimer.stopCountdown();
        } else {
            window.countdownTimer.refresh();
        }
    }
});
