/**
 * component-preloader.js
 * 
 * This script ensures components are correctly loaded and displayed
 * when navigating between pages. It coordinates with components.js
 * to prevent conflicts and ensure reliable loading.
 */

// Create a global namespace for our utility
window.MALIKLI = window.MALIKLI || {};
window.MALIKLI.componentsState = window.MALIKLI.componentsState || {
    headerLoaded: false,
    footerLoaded: false,
    retryCount: 0,
    maxRetries: 3
};

// Enhanced component handling utilities
window.MALIKLI.preloader = {
    // Track if preloader has run
    preloaderInitialized: false,
    
    // Initialize preloader
    init: function() {
        if (this.preloaderInitialized) return;
        this.preloaderInitialized = true;
        
        console.log('Component preloader: Initializing');
        
        // Set up early component check
        this.setupEarlyCheck();
        
        // Set up visibility change listener for browser navigation
        this.setupVisibilityListener();
        
        // Set up page show listener for back/forward navigation
        this.setupPageShowListener();
    },
    
    // Set up early component checking
    setupEarlyCheck: function() {
        // Check immediately if DOM is already ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.checkComponents());
        } else {
            this.checkComponents();
        }
        
        // Also check on window load as fallback
        if (document.readyState !== 'complete') {
            window.addEventListener('load', () => this.checkComponents());
        }
    },
    
    // Check if components need to be loaded
    checkComponents: function() {
        setTimeout(() => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            const footerPlaceholder = document.getElementById('footer-placeholder');
            
            // Check if placeholders exist but are empty
            const headerNeedsLoad = headerPlaceholder && (!headerPlaceholder.innerHTML.trim() || !headerPlaceholder.querySelector('*'));
            const footerNeedsLoad = footerPlaceholder && (!footerPlaceholder.innerHTML.trim() || !footerPlaceholder.querySelector('*'));
            
            if (headerNeedsLoad || footerNeedsLoad) {
                console.log('Component preloader: Components need loading, triggering main system');
                this.triggerMainComponentSystem();
            } else {
                console.log('Component preloader: Components appear to be loaded');
                // Update state
                window.MALIKLI.componentsState.headerLoaded = !!headerPlaceholder?.querySelector('*');
                window.MALIKLI.componentsState.footerLoaded = !!footerPlaceholder?.querySelector('*');
            }
        }, 50);
    },
    
    // Trigger the main component system
    triggerMainComponentSystem: function() {
        // Check if main components system is available
        if (window.MALIKLI.components && window.MALIKLI.components.initializeComponents) {
            console.log('Component preloader: Triggering main component system');
            window.MALIKLI.components.initializeComponents();
        } else {
            // Main system not loaded yet, wait for it
            console.log('Component preloader: Waiting for main component system');
            this.waitForMainSystem();
        }
    },
    
    // Wait for main component system to be available
    waitForMainSystem: function() {
        let attempts = 0;
        const maxAttempts = 20; // 2 seconds max wait
        
        const checkInterval = setInterval(() => {
            attempts++;
            
            if (window.MALIKLI.components && window.MALIKLI.components.initializeComponents) {
                clearInterval(checkInterval);
                console.log('Component preloader: Main system now available, initializing');
                window.MALIKLI.components.initializeComponents();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.warn('Component preloader: Main system not available, falling back to direct load');
                this.fallbackLoad();
            }
        }, 100);
    },
    
    // Fallback loading mechanism
    fallbackLoad: function() {
        console.log('Component preloader: Using fallback loading');
        
        // Load components directly using XMLHttpRequest
        this.loadComponentDirect('header', 'components/header.html');
        this.loadComponentDirect('footer', 'components/footer.html');
    },
    
    // Direct component loading
    loadComponentDirect: function(elementId, componentPath) {
        const placeholder = document.getElementById(elementId + '-placeholder');
        if (!placeholder || placeholder.querySelector('*')) return;
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', componentPath, true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                placeholder.innerHTML = xhr.responseText;
                console.log(`Component preloader: ${elementId} loaded directly`);
                
                // Update state
                if (elementId === 'header') {
                    window.MALIKLI.componentsState.headerLoaded = true;
                } else if (elementId === 'footer') {
                    window.MALIKLI.componentsState.footerLoaded = true;
                }
                
                // Trigger i18n if available
                if (window.i18n && typeof window.i18n.reinitialize === 'function') {
                    setTimeout(() => window.i18n.reinitialize(), 100);
                }
            }
        };
        xhr.send();
    },
    
    // Set up visibility change listener
    setupVisibilityListener: function() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // Page is visible again (e.g., after using browser back button)
                setTimeout(() => this.checkComponents(), 100);
            }
        });
    },
    
    // Set up page show listener for back/forward navigation
    setupPageShowListener: function() {
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                // Page was loaded from cache (back/forward navigation)
                console.log('Component preloader: Page loaded from cache, checking components');
                setTimeout(() => this.checkComponents(), 100);
            }
        });
    }
};

// Initialize preloader immediately
window.MALIKLI.preloader.init();
