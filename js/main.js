// Main application controller
class MalikliApp {
    constructor() {
        console.log('🏁 Starting MALIKLI1992 Application...');
        this.dropData = null;
        this.isInitialized = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        // Wait a moment to allow other scripts to initialize their objects
        setTimeout(() => this.init(), 100);
    }

    async init() {
        try {
            console.log('🚀 Initializing MALIKLI1992 Application...');
            
            if (!window.MEDIA_CONFIG) {
                console.warn('⚠️ Media configuration not found, using fallback image paths');
                window.MEDIA_CONFIG = {
                    banners: {
                        default: 'https://media.malikli1992.com/banners/default-banner.jpg'
                    },
                    // Ensure baseUrl is defined, even if it's just an empty string or a sensible default
                    baseUrl: window.MEDIA_CONFIG?.baseUrl || '' 
                };
            } else if (!window.MEDIA_CONFIG.baseUrl) {
                window.MEDIA_CONFIG.baseUrl = ''; // Ensure baseUrl exists
            }
              await this.waitForDependencies();
            // TEMPORARILY COMMENTED OUT - Dynamic drop updates
            // await this.loadDropData(); // Initial call, not a retry
            this.setupEventListeners();
            this.initializeAnalytics();
            this.isInitialized = true;
            
            console.log('✅ MALIKLI1992 Application initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.handleInitError(error);
        }
    }

    async waitForDependencies() {
        console.log('🔄 Checking dependencies...');
        
        const dependencies = {
            supabaseClient: false,
            countdownTimer: false,
            waitlistForm: false,
            animationController: false
        };
        
        const checkDependencies = () => {
            dependencies.supabaseClient = !!window.supabaseClient;
            dependencies.countdownTimer = !!window.countdownTimer;
            dependencies.waitlistForm = !!window.waitlistForm;
            dependencies.animationController = !!window.animationController;
            
            return dependencies.supabaseClient && 
                   dependencies.countdownTimer && 
                   dependencies.waitlistForm && 
                   dependencies.animationController;
        };

        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait

        while (!checkDependencies() && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
            
            if (attempts % 10 === 0) {
                console.log(`⏳ Still waiting for dependencies (${attempts/10}s)...`, dependencies);
            }
        }

        if (!checkDependencies()) {
            console.error('❌ Missing dependencies:', dependencies);
            throw new Error('Required dependencies not loaded');
        }
        
        console.log('✅ All dependencies loaded successfully');
    }    // TEMPORARILY COMMENTED OUT - Dynamic drop data loading
    /*
    async loadDropData(isRetry = false) {
        if (!isRetry) {
            this.retryCount = 0; // Reset for a fresh sequence of attempts
        }

        try {
            this.dropData = await window.supabaseClient.fetchActiveDrop();
            
            if (this.dropData) {
                this.updateDropContent();
                console.log('📦 Drop data loaded:', this.dropData.name);
            } else {
                console.warn('⚠️ No active drop found, using defaults');
                // Optionally, still call updateDropContent which will use fallbacks,
                // or call showFallbackContent directly if that's preferred for no data.
                this.showFallbackContent(); 
            }
            
        } catch (error) {
            console.error('Failed to load drop data:', error);
            
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`🔄 Retrying loadDropData... (${this.retryCount}/${this.maxRetries})`);
                setTimeout(() => this.loadDropData(true), 2000); // Pass true for isRetry
            } else {
                console.error('📝 Max retries reached for loading drop data. Using fallback content.');
                this.showFallbackContent();
            }
        }
    }
    */

    // Helper method to format banner URLs
    _formatBannerUrl(rawUrl) {
        if (!rawUrl || typeof rawUrl !== 'string') {
            return null;
        }

        // If already an absolute URL or data URI, return as is
        if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('data:image')) {
            return rawUrl;
        }

        // Handle specific 'drop_banners/' paths from Supabase storage
        if (rawUrl.startsWith('drop_banners/')) {
            // Assuming these always come from this specific media domain
            return `https://media.malikli1992.com/media/${rawUrl}`;
        }
        
        // Handle cases where a full path might be stored without the protocol (less common)
        // Example: "media.malikli1992.com/media/drop_banners/image.jpg"
        if (rawUrl.includes('media.malikli1992.com/media/drop_banners/')) {
            return `https://${rawUrl}`; // Prepend https
        }

        // Handle other relative paths using MEDIA_CONFIG.baseUrl if provided
        // MEDIA_CONFIG.baseUrl could be e.g., 'https://cdn.example.com/assets' or '/assets'
        if (window.MEDIA_CONFIG && window.MEDIA_CONFIG.baseUrl && window.MEDIA_CONFIG.baseUrl.length > 0) {
            const baseUrl = window.MEDIA_CONFIG.baseUrl.endsWith('/') ? window.MEDIA_CONFIG.baseUrl.slice(0, -1) : window.MEDIA_CONFIG.baseUrl;
            const path = rawUrl.startsWith('/') ? rawUrl.substring(1) : rawUrl;
            return `${baseUrl}/${path}`;
        }
        
        // If it's a simple relative path like 'images/foo.jpg' and no baseUrl rule matched,
        // it will be resolved relative to the HTML document.
        // isValidImageUrl will do a final check.
        return rawUrl; 
    }    // TEMPORARILY COMMENTED OUT - Dynamic drop content updates
    /*
    updateDropContent() {
        if (!this.dropData) {
            console.warn("❌ No drop data available to update the content. Showing fallback.");
            this.showFallbackContent();
            return;
        }

        console.log("🔄 Updating page content with drop data:", this.dropData);

        const dropTitle = document.getElementById('drop-title');
        const dropDescription = document.getElementById('drop-description');
        const dropBanner = document.getElementById('drop-banner');
        const dropDetails = document.getElementById('drop-details');

        if (dropTitle) {
            dropTitle.textContent = this.dropData.name || 'Exclusive Collection';
            console.log(`✅ Updated title: ${dropTitle.textContent}`);
        } else {
            console.error("❌ 'drop-title' element not found");
        }

        if (dropDescription) {
            dropDescription.textContent = this.dropData.description || 
                'Get ready for our next exclusive collection...';
            console.log(`✅ Updated description: ${dropDescription.textContent}`);
        } else {
            console.error("❌ 'drop-description' element not found");
        }       

        if (dropBanner) {
            let imageUrl = null;
            if (this.dropData.banner_image) {
                imageUrl = this._formatBannerUrl(this.dropData.banner_image);
            }

            if (imageUrl && this.isValidImageUrl(imageUrl)) {
                console.log(`🖼️ Setting banner image to: ${imageUrl}`);
                dropBanner.src = imageUrl;
                dropBanner.alt = this.dropData.name || 'Exclusive Fashion Drop';
                
                dropBanner.onerror = () => {
                    console.error(`❌ Failed to load primary image: ${imageUrl}. Using fallbacks.`);
                    this.useLocalImageFallbacks(dropBanner);
                };
            } else {
                if (this.dropData.banner_image) {
                    console.warn(`⚠️ Invalid or unformattable banner image URL: '${this.dropData.banner_image}'. Formatted as: '${imageUrl}'. Using fallbacks.`);
                } else {
                    console.warn(`⚠️ No banner image URL provided. Using fallbacks.`);
                }
                this.useLocalImageFallbacks(dropBanner);
            }
        } else {
            console.error("❌ 'drop-banner' element not found");
        }

        if (dropDetails && this.dropData.details) {
            dropDetails.textContent = this.dropData.details;
            console.log(`✅ Updated details: ${dropDetails.textContent.substring(0, 50)}...`);
        } else if (dropDetails) {
            dropDetails.textContent = ''; // Clear if no details
            console.warn("⚠️ No details found in drop data, clearing details section.");
        } else {
            console.error("❌ 'drop-details' element not found");
        }

        document.title = `${this.dropData.name || 'MALIKLI1992'} - MALIKLI1992`;
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && this.dropData.description) {
            metaDesc.setAttribute('content', this.dropData.description);
        }
    }
    */

    isValidImageUrl(url) {
        if (!url || typeof url !== 'string') return false;
        
        // Allow fully qualified URLs
        if (url.startsWith('http://') || url.startsWith('https://')) return true;
        // Allow data URIs
        if (url.startsWith('data:image/')) return true;
        // Allow local project paths (e.g., 'images/banner.jpg')
        if (url.startsWith('images/') || url.includes('/images/')) return true;
        // Allow paths starting with a slash (could be relative to domain root or a base URL)
        if (url.startsWith('/')) return true;
        // Allow common relative paths
        if (url.startsWith('./') || url.startsWith('../')) return true;
        // Allow paths that might look like Supabase paths after formatting
        // (though _formatBannerUrl should fully qualify them)
        if (url.includes('drop_banners/')) return true; 
        
        // If it doesn't match known patterns, consider it potentially invalid for direct use
        // This is a heuristic; a more robust check might involve trying to load it or regex.
        // For now, if _formatBannerUrl did its job, this should catch unresolvable paths.
        console.warn(`[isValidImageUrl] URL "${url}" did not match expected patterns. It might still work if it's a valid relative path not covered.`);
        // To be more permissive for simple relative paths like "banner.jpg" if no base URL applies:
        if (!url.includes(':') && !url.startsWith('//') && url.includes('.')) { 
             // Simple check for a filename-like string that isn't an absolute URL
            return true;
        }

        return false;
    }

    useLocalImageFallbacks(imageElement) {
        const localPlaceholder = 'images/banner-placeholder.jpg'; // Ensure this path is correct
        const mediaDefault = window.MEDIA_CONFIG?.banners?.default;
        
        console.log(`🔄 Attempting local placeholder: ${localPlaceholder}`);
        imageElement.src = localPlaceholder;
        imageElement.alt = 'Exclusive Fashion Drop (Placeholder)';
        
        imageElement.onerror = () => {
            console.error(`❌ Failed to load local placeholder: ${localPlaceholder}`);
            if (mediaDefault) {
                console.log(`🔄 Attempting media default banner: ${mediaDefault}`);
                imageElement.src = mediaDefault;
                imageElement.onerror = () => {
                    console.error(`❌ Failed to load media default banner: ${mediaDefault}. Using inline placeholder.`);
                    imageElement.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; // 1x1 transparent pixel
                };
            } else {
                console.error('❌ No media default banner available. Using inline placeholder.');
                imageElement.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
            }
        };
    }

    showFallbackContent() {
        console.log('📝 Showing fallback content.');
        const dropTitle = document.getElementById('drop-title');
        const dropDescription = document.getElementById('drop-description');
        const dropBanner = document.getElementById('drop-banner'); // Also apply fallback to banner

        if (dropTitle) {
            dropTitle.textContent = 'Exclusive Collection Coming Soon';
        }
        if (dropDescription) {
            dropDescription.textContent = 'Stay tuned for our next luxury drop. Join the waitlist to be the first to know.';
        }
        if (dropBanner) {
            console.log('🖼️ Applying fallback banner image.');
            this.useLocalImageFallbacks(dropBanner); // Use the standard fallback mechanism
        }
        document.title = 'MALIKLI1992 - Coming Soon';
    }

    setupEventListeners() {
        window.addEventListener('online', () => this.handleConnectionChange(true));
        window.addEventListener('offline', () => this.handleConnectionChange(false));

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isInitialized) {
                console.log('🔄 Page became visible, refreshing data...');
                this.refreshData();
            }
        });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        document.addEventListener('waitlist-success', (e) => {
            this.handleWaitlistSuccess(e.detail);
        });

        window.addEventListener('error', (e) => {
            this.handleGlobalError(e);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.handleUnhandledRejection(e);
        });
        console.log('🎧 Event listeners set up.');
    }

    initializeAnalytics() {
        this.initGoogleAnalytics();
        this.initFacebookPixel();
        this.trackPageView();
        console.log('📈 Analytics initialized.');
    }

    initGoogleAnalytics() {
        if (typeof gtag === 'undefined') {
            console.log('📊 Google Analytics (gtag) not found or configured.');
            return;
        }
        // Replace 'GA_MEASUREMENT_ID' with your actual Measurement ID
        const gaMeasurementId = 'GA_MEASUREMENT_ID'; // TODO: Replace with actual ID
        if (gaMeasurementId === 'GA_MEASUREMENT_ID') {
            console.warn('⚠️ GA_MEASUREMENT_ID is a placeholder. Configure it for Google Analytics.');
        }

        gtag('config', gaMeasurementId, {
            page_title: document.title,
            page_location: window.location.href
        });
        console.log('📊 Google Analytics configured.');

        if (this.dropData) {
            gtag('event', 'view_item', { // Standard GA4 event for item views
                currency: "USD", // Optional: Or your relevant currency
                value: 0, // Optional: Price if applicable
                items: [{
                    item_id: this.dropData.id,
                    item_name: this.dropData.name,
                    item_category: "Fashion Drop" 
                }]
            });
            console.log('📊 GA: Tracked drop_view (view_item event)');
        }
    }

    initFacebookPixel() {
        if (typeof fbq === 'undefined') {
            console.log('📱 Facebook Pixel (fbq) not found or configured.');
            return;
        }
        fbq('track', 'PageView');
        console.log('📱 Facebook Pixel: Tracked PageView.');
        
        if (this.dropData) {
            fbq('track', 'ViewContent', {
                content_name: this.dropData.name,
                content_ids: [this.dropData.id], // Recommended to use content_ids
                content_type: 'product', // More specific content_type
                content_category: 'Fashion Drop'
            });
            console.log('📱 Facebook Pixel: Tracked ViewContent for drop.');
        }
    }

    trackPageView() {
        const pageData = {
            timestamp: new Date().toISOString(),
            page: 'waiting-page', // Or dynamically determine page type
            drop_id: this.dropData?.id,
            drop_name: this.dropData?.name,
            user_agent: navigator.userAgent,
            referrer: document.referrer,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };
        console.log('📊 Custom Page View Tracked:', pageData);
        // Here you might send pageData to your own analytics endpoint if needed
    }

    handleConnectionChange(isOnline) {
        const statusIndicator = this.createConnectionStatusIndicator();
        if (isOnline) {
            statusIndicator.textContent = '✅ Connection restored';
            statusIndicator.className = 'connection-status online';
            console.log('🟢 Network connection restored.');
            setTimeout(() => {
                if (this.isInitialized) { // Refresh only if app was initialized
                    console.log('🔄 Refreshing data after coming online...');
                    this.refreshData();
                }
            }, 1000);
        } else {
            statusIndicator.textContent = '⚠️ Connection lost';
            statusIndicator.className = 'connection-status offline';
            console.warn('🔴 Network connection lost.');
        }
        setTimeout(() => {
            statusIndicator.remove();
        }, 3000);
    }

    createConnectionStatusIndicator() {
        const existing = document.querySelector('.connection-status');
        if (existing) existing.remove();

        const indicator = document.createElement('div');
        // Styles are defined in the CSS block later or can be kept here
        document.body.appendChild(indicator);
        return indicator;
    }

    handleResize() {
        console.log('↔️ Window resized.');
        if (window.countdownTimer && typeof window.countdownTimer.updateDisplay === 'function') {
            window.countdownTimer.updateDisplay();
        }
        if (window.animationController && typeof window.animationController.setupParallaxEffects === 'function') {
            window.animationController.setupParallaxEffects(); // Assuming this is how it refreshes
        }
    }

    handleWaitlistSuccess(data) {
        console.log('🎉 Waitlist signup successful:', data);
        // Replace with your actual Conversion ID and Label
        const conversionId = 'AW-CONVERSION_ID'; // TODO: Replace
        const conversionLabel = 'CONVERSION_LABEL'; // TODO: Replace

        if (typeof gtag !== 'undefined') {
             if (conversionId === 'AW-CONVERSION_ID' || conversionLabel === 'CONVERSION_LABEL') {
                console.warn('⚠️ Google Ads conversion tracking ID/Label is a placeholder.');
            } else {
                gtag('event', 'conversion', {
                    'send_to': `${conversionId}/${conversionLabel}`,
                    'value': 1.0, // Example value
                    'currency': 'USD' // Example currency
                });
                console.log('📊 GA: Tracked waitlist conversion.');
            }
        }
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead'); // Standard event for lead generation
            console.log('📱 Facebook Pixel: Tracked Lead for waitlist signup.');
        }
    }

    async refreshData() {
        if (!this.isInitialized) {
            console.log('🔄 App not initialized, skipping refreshData.');
            return;
        }
        console.log('🔄 Refreshing application data...');
        try {
            await this.loadDropData(); // Will reset retry count internally
            if (window.countdownTimer && typeof window.countdownTimer.refresh === 'function') {
                await window.countdownTimer.refresh();
            }
            console.log('✅ Data refreshed successfully.');
        } catch (error) {
            console.error('❌ Failed to refresh data:', error);
        }
    }

    handleInitError(error) {
        console.error('❌ Initialization error caught by handleInitError:', error.message, error.stack);
        
        const existingErrorMsg = document.querySelector('.init-error');
        if (existingErrorMsg) existingErrorMsg.remove(); // Remove if one is already shown

        const errorMessage = document.createElement('div');
        errorMessage.className = 'init-error'; // Style with CSS
        
        let errorDetailsHtml = '';
        if (error.message === 'Required dependencies not loaded') {
            // Check which specific dependencies are missing
            const missingDeps = [];
            if (!window.supabaseClient) missingDeps.push('Database Connection (supabaseClient)');
            if (!window.countdownTimer) missingDeps.push('Countdown Timer');
            if (!window.waitlistForm) missingDeps.push('Waitlist Form');
            if (!window.animationController) missingDeps.push('Animation Controller');

            errorDetailsHtml = `
                <p>It seems some essential parts of the page couldn't load:</p>
                <ul>
                    ${missingDeps.map(dep => `<li>${dep}</li>`).join('')}
                </ul>
                <p>Please check your browser console for more technical details or try disabling browser extensions.</p>
            `;
        } else {
            errorDetailsHtml = `<p>An unexpected error occurred: ${error.message}.</p>`;
        }
        
        errorMessage.innerHTML = `
            <div class="error-content">
                <h3>⚠️ Oops! Something Went Wrong</h3>
                <p>We're having a bit of trouble loading this page right now.</p>
                ${errorDetailsHtml}
                <button id="error-refresh-button" class="btn btn--primary" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background-color: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Try Refreshing
                </button>
                <p class="error-tip" style="font-size: 0.9rem; margin-top: 1rem;">If the problem continues, please try again later or contact support.</p>
            </div>
        `;
        // CSS for .init-error and .error-content should be in the stylesheet
        document.body.appendChild(errorMessage);
        
        // Add event listener to the button programmatically
        const refreshButton = errorMessage.querySelector('#error-refresh-button');
        if (refreshButton) {
            refreshButton.onclick = () => window.location.reload();
        }
    }

    handleGlobalError(event) {
        console.error('🌍 Global unhandled error:', event.error || event.message, event.filename, event.lineno);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': `${event.message || 'Unknown error'} at ${event.filename}:${event.lineno}`,
                'fatal': event.error ? true : false // Mark as fatal if it's a full error object
            });
        }
    }

    handleUnhandledRejection(event) {
        console.error('🚫 Unhandled promise rejection:', event.reason);
        event.preventDefault(); // Prevent default browser handling (e.g. console error)
        
        if (typeof gtag !== 'undefined') {
            let description = 'Unhandled promise rejection';
            if (event.reason instanceof Error) {
                description = `Unhandled: ${event.reason.message || event.reason.toString()}`;
            } else if (typeof event.reason === 'string') {
                description = `Unhandled: ${event.reason}`;
            } else {
                try {
                    description = `Unhandled: ${JSON.stringify(event.reason)}`;
                } catch (e) { /* ignore stringify error */ }
            }
            gtag('event', 'exception', {
                'description': description,
                'fatal': false // Usually not fatal for the entire app, but needs investigation
            });
        }
    }

    getStatus() {
        return {
            isInitialized: this.isInitialized,
            hasDropData: !!this.dropData,
            currentDropName: this.dropData?.name || null,
            retryCount: this.retryCount,
            dependencies: {
                supabaseClient: !!window.supabaseClient,
                countdownTimer: !!window.countdownTimer,
                waitlistForm: !!window.waitlistForm,
                animationController: !!window.animationController
            },
            mediaConfig: window.MEDIA_CONFIG
        };
    }
}

// Add error styles (ensure these are suitable for your page)
const dynamicErrorStyles = `
    .connection-status {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 15px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    .connection-status.online { background: #28a745; }
    .connection-status.offline { background: #dc3545; }
    
    .init-error {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85); /* Darker overlay */
        display: flex; align-items: center; justify-content: center;
        z-index: 20000; /* Higher z-index */
        color: #333; /* Text color for content box */
        text-align: center;
        font-family: sans-serif; /* Basic font */
    }
    .init-error .error-content {
        background: white;
        padding: 2rem 2.5rem; /* More padding */
        border-radius: 8px; /* Softer radius */
        max-width: 450px; /* Slightly wider */
        margin: 1rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .init-error h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.6rem; /* Larger heading */
        color: #c0392b; /* Error-ish color */
    }
    .init-error p {
        margin-bottom: 1.2rem;
        line-height: 1.6;
        font-size: 1rem;
    }
    .init-error ul {
        list-style-position: inside;
        padding-left: 0;
        margin-bottom: 1.2rem;
        text-align: left;
    }
    .init-error li {
        margin-bottom: 0.5rem;
    }
    /* Button style is now inline in JS, but can be moved here */
    .init-error .btn--primary { /* Assuming you have this class */
        /* Add general button styles if not defined globally */
    }
    .init-error .error-tip {
        font-size: 0.85rem;
        color: #555;
        margin-top: 1.5rem;
    }
`;

// Ensure stylesheet is added only once and correctly
if (!document.getElementById('malikli-app-styles')) {
    const errorStyleSheet = document.createElement('style');
    errorStyleSheet.id = 'malikli-app-styles';
    errorStyleSheet.textContent = dynamicErrorStyles;
    document.head.appendChild(errorStyleSheet);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.malikliApp) { // Prevent multiple initializations
        window.malikliApp = new MalikliApp();
    }
});

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.dev = {
        app: () => window.malikliApp,
        getStatus: () => window.malikliApp?.getStatus(),
        refreshData: () => window.malikliApp?.refreshData(),
        showForm: () => window.waitlistForm?.showForm(), // Assuming waitlistForm has showForm
        testCountdown: (minutes = 5) => {
            if (window.countdownTimer) {
                const testDate = new Date(Date.now() + minutes * 60 * 1000);
                window.countdownTimer.targetDate = testDate; // Assuming targetDate can be set
                if(typeof window.countdownTimer.startCountdown === 'function') {
                    window.countdownTimer.startCountdown();
                } else {
                     console.warn("dev.testCountdown: countdownTimer.startCountdown() not found.");
                }
            } else {
                console.warn("dev.testCountdown: window.countdownTimer not found.");
            }
        },
        simulateOffline: () => {
            const offlineEvent = new Event('offline');
            window.dispatchEvent(offlineEvent);
            console.log('DEV: Simulated offline event.');
        },
        simulateOnline: () => {
            const onlineEvent = new Event('online');
            window.dispatchEvent(onlineEvent);
            console.log('DEV: Simulated online event.');
        }
    };
    console.log('🛠️ MALIKLI1992 Development helpers available: window.dev');
}