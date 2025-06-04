/**
 * components.js - Handles loading of reusable HTML components
 */

// Global state management
window.MALIKLI = window.MALIKLI || {};
window.MALIKLI.componentsState = window.MALIKLI.componentsState || {
    headerLoaded: false,
    footerLoaded: false,
    retryCount: 0,
    maxRetries: 3,
    isInitializing: false,
    initializationPromise: null
};

// Main initialization
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Components.js: DOM loaded, starting component initialization');
    await initializeComponents();
});

// Fallback initialization
window.addEventListener('load', async function() {
    console.log('Components.js: Window loaded, checking components');
    if (!window.MALIKLI.componentsState.headerLoaded || !window.MALIKLI.componentsState.footerLoaded) {
        console.log('Components.js: Components not loaded, retrying...');
        await initializeComponents();
    }
});

/**
 * Main initialization function with retry logic
 */
async function initializeComponents() {
    // Prevent multiple simultaneous initializations
    if (window.MALIKLI.componentsState.isInitializing) {
        console.log('Components.js: Already initializing, waiting for current process');
        return window.MALIKLI.componentsState.initializationPromise;
    }
    
    window.MALIKLI.componentsState.isInitializing = true;
    
    // Create promise for this initialization
    window.MALIKLI.componentsState.initializationPromise = (async () => {
        try {
            console.log('Components.js: Initializing components, attempt:', window.MALIKLI.componentsState.retryCount + 1);
            
            // Load header component with retry
            if (!window.MALIKLI.componentsState.headerLoaded) {
                await loadComponentWithRetry('header', 'components/header.html');
            }
            
            // Load footer component with retry
            if (!window.MALIKLI.componentsState.footerLoaded) {
                await loadComponentWithRetry('footer', 'components/footer.html');
            }
            
            // Set active nav link based on current page
            setActiveNavLink();
            
            // Initialize i18n after components are loaded with a delay
            setTimeout(() => {
                if (window.i18n && typeof window.i18n.reinitialize === 'function') {
                    console.log('Components.js: Reinitializing i18n');
                    window.i18n.reinitialize();
                }
            }, 100);
            
            // Setup link interception
            setupLinkInterception();
            
            console.log('Components.js: Component initialization completed successfully');
            
        } catch (error) {
            console.error('Components.js: Error during component initialization:', error);
            
            // Retry logic
            if (window.MALIKLI.componentsState.retryCount < window.MALIKLI.componentsState.maxRetries) {
                window.MALIKLI.componentsState.retryCount++;
                console.log('Components.js: Retrying component initialization in 500ms...');
                
                // Reset initialization state before retry
                window.MALIKLI.componentsState.isInitializing = false;
                
                await new Promise(resolve => setTimeout(resolve, 500));
                return initializeComponents();
            } else {
                console.error('Components.js: Max retries reached, component initialization failed');
                throw error;
            }
        } finally {
            window.MALIKLI.componentsState.isInitializing = false;
        }
    })();
    
    return window.MALIKLI.componentsState.initializationPromise;
}

/**
 * Sets the active class on the navigation link for the current page
 */
function setActiveNavLink() {
    // Wait a bit to ensure header is loaded
    setTimeout(() => {
        try {
            // Get the current page filename
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            
            // Find all nav links
            const navLinks = document.querySelectorAll('.nav__link');
            
            if (navLinks.length === 0) {
                console.log('Components.js: No nav links found, header may not be loaded yet');
                return;
            }
            
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to the current page link
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPage) {
                    link.classList.add('active');
                    console.log(`Components.js: Set active nav link for ${currentPage}`);
                } else if (currentPage === 'index.html' && link.getAttribute('data-nav-link') === 'home') {
                    link.classList.add('active');
                    console.log('Components.js: Set active nav link for home page');
                }
            });
        } catch (error) {
            console.error('Components.js: Error setting active nav link:', error);
        }
    }, 100);
}

/**
 * Enhanced link interception with better error handling
 */
function setupLinkInterception() {
    try {
        // Remove any existing listeners to prevent duplicates
        document.removeEventListener('click', handleLinkClick);
        
        // Add new listener
        document.addEventListener('click', handleLinkClick);
        
        console.log('Components.js: Link interception setup completed');
    } catch (error) {
        console.error('Components.js: Error setting up link interception:', error);
    }
}

/**
 * Handle navigation link clicks
 */
function handleLinkClick(event) {
    try {
        // Check if the clicked element is a navigation link
        const link = event.target.closest('.nav__link');
        if (!link) return;
        
        // If it's already the active page, do nothing
        if (link.classList.contains('active')) {
            return;
        }
        
        // Update active class immediately for better UX
        document.querySelectorAll('.nav__link').forEach(navLink => {
            navLink.classList.remove('active');
        });
        link.classList.add('active');
        
        console.log('Components.js: Navigation link clicked:', link.getAttribute('href'));
    } catch (error) {
        console.error('Components.js: Error handling link click:', error);
    }
}

/**
 * Load a component with retry logic
 */
async function loadComponentWithRetry(elementId, componentPath) {
    const maxRetries = 3;
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            await loadComponent(elementId, componentPath);
            
            // Mark as loaded in global state
            if (elementId === 'header') {
                window.MALIKLI.componentsState.headerLoaded = true;
                console.log('Components.js: Header loaded successfully');
            } else if (elementId === 'footer') {
                window.MALIKLI.componentsState.footerLoaded = true;
                console.log('Components.js: Footer loaded successfully');
            }
            
            return; // Success, exit the retry loop
        } catch (error) {
            retries++;
            console.warn(`Components.js: Failed to load ${elementId} (attempt ${retries}/${maxRetries}):`, error);
            
            if (retries < maxRetries) {
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 200 * retries));
            } else {
                console.error(`Components.js: Failed to load ${elementId} after ${maxRetries} attempts`);
                throw error;
            }
        }
    }
}

/**
 * Core function to load a component
 */
async function loadComponent(elementId, componentPath) {
    return new Promise((resolve, reject) => {
        // Get the placeholder element
        const placeholder = document.getElementById(elementId + '-placeholder');
        if (!placeholder) {
            reject(new Error(`Placeholder element '${elementId}-placeholder' not found`));
            return;
        }
        
        // Check if already loaded and has meaningful content
        const existingContent = placeholder.innerHTML.trim();
        if (existingContent && placeholder.querySelector('*')) {
            console.log(`Components.js: ${elementId} already loaded and has content`);
            resolve();
            return;
        }
        
        // Create XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.open('GET', componentPath, true);
        xhr.timeout = 10000; // 10 second timeout (increased from 5)
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    const content = xhr.responseText.trim();
                    if (!content) {
                        reject(new Error(`Empty content received for ${componentPath}`));
                        return;
                    }
                    
                    placeholder.innerHTML = content;
                    
                    // Verify content was actually inserted
                    setTimeout(() => {
                        if (placeholder.querySelector('*')) {
                            console.log(`Components.js: ${elementId} loaded and verified from ${componentPath}`);
                            resolve();
                        } else {
                            reject(new Error(`Failed to verify ${elementId} content insertion`));
                        }
                    }, 50);
                    
                } catch (error) {
                    reject(new Error(`Failed to insert ${elementId} content: ${error.message}`));
                }
            } else {
                reject(new Error(`Failed to load ${componentPath}: HTTP ${xhr.status}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error(`Network error loading ${componentPath}`));
        };
        
        xhr.ontimeout = function() {
            reject(new Error(`Timeout loading ${componentPath}`));
        };
        
        xhr.send();
    });
}

/**
 * Periodic health check to ensure components stay loaded
 */
function startComponentHealthCheck() {
    // Run health check every 30 seconds
    setInterval(() => {
        const header = document.getElementById('header-placeholder');
        const footer = document.getElementById('footer-placeholder');
        
        const headerEmpty = header && !header.querySelector('*');
        const footerEmpty = footer && !footer.querySelector('*');
        
        if (headerEmpty || footerEmpty) {
            console.warn('Components.js: Health check detected missing components, reloading...');
            
            // Reset state for missing components
            if (headerEmpty) window.MALIKLI.componentsState.headerLoaded = false;
            if (footerEmpty) window.MALIKLI.componentsState.footerLoaded = false;
            
            // Reinitialize
            initializeComponents();
        }
    }, 30000);
}

/**
 * Enhanced page navigation handler
 */
function setupNavigationHandlers() {
    // Handle browser back/forward navigation
    window.addEventListener('popstate', function(event) {
        console.log('Components.js: Navigation detected via popstate');
        setTimeout(() => {
            initializeComponents();
        }, 100);
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log('Components.js: Page became visible, checking components');
            setTimeout(() => {
                initializeComponents();
            }, 100);
        }
    });
    
    // Handle hash changes
    window.addEventListener('hashchange', function() {
        console.log('Components.js: Hash change detected');
        setActiveNavLink();
    });
}

// Start health check and navigation handlers after initial load
window.addEventListener('load', function() {
    setTimeout(() => {
        startComponentHealthCheck();
        setupNavigationHandlers();
        console.log('Components.js: Health check and navigation handlers initialized');
    }, 1000);
});

// Expose functions globally for debugging and external access
window.MALIKLI.components = window.MALIKLI.components || {};
Object.assign(window.MALIKLI.components, {
    initializeComponents,
    loadComponent,
    loadComponentWithRetry,
    setActiveNavLink,
    setupLinkInterception,
    // Debugging utilities
    getState: () => window.MALIKLI.componentsState,
    forceReload: async () => {
        window.MALIKLI.componentsState.headerLoaded = false;
        window.MALIKLI.componentsState.footerLoaded = false;
        window.MALIKLI.componentsState.retryCount = 0;
        window.MALIKLI.componentsState.isInitializing = false;
        await initializeComponents();
    },
    checkComponents: () => {
        const header = document.getElementById('header-placeholder');
        const footer = document.getElementById('footer-placeholder');
        console.log('Header placeholder:', header, 'Has content:', !!header?.querySelector('*'));
        console.log('Footer placeholder:', footer, 'Has content:', !!footer?.querySelector('*'));
        console.log('Component state:', window.MALIKLI.componentsState);
    }
});
