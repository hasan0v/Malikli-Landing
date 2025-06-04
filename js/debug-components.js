/**
 * debug-components.js
 * 
 * Comprehensive debugging utility for component loading issues
 * Use this script to diagnose header/footer loading problems
 */

window.MALIKLI = window.MALIKLI || {};

window.MALIKLI.debugger = {
    // Enable verbose logging
    verbose: true,
    
    // Log function with timestamp
    log: function(message, ...args) {
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        console.log(`[${timestamp}] COMPONENT DEBUG:`, message, ...args);
    },
    
    // Comprehensive component status check
    checkStatus: function() {
        this.log('=== COMPONENT STATUS CHECK ===');
        
        const header = document.getElementById('header-placeholder');
        const footer = document.getElementById('footer-placeholder');
        
        this.log('Header placeholder:', {
            exists: !!header,
            hasContent: !!header?.innerHTML.trim(),
            hasElements: !!header?.querySelector('*'),
            innerHTML: header?.innerHTML.substring(0, 100) + '...'
        });
        
        this.log('Footer placeholder:', {
            exists: !!footer,
            hasContent: !!footer?.innerHTML.trim(),
            hasElements: !!footer?.querySelector('*'),
            innerHTML: footer?.innerHTML.substring(0, 100) + '...'
        });
        
        this.log('Global state:', window.MALIKLI.componentsState);
        
        this.log('Scripts loaded:', {
            components: !!window.MALIKLI.components,
            preloader: !!window.MALIKLI.preloader,
            i18n: !!window.i18n
        });
        
        this.log('Document state:', {
            readyState: document.readyState,
            hidden: document.hidden,
            url: window.location.href
        });
        
        return {
            headerOK: !!header?.querySelector('*'),
            footerOK: !!footer?.querySelector('*'),
            state: window.MALIKLI.componentsState
        };
    },
    
    // Force reload components with verbose logging
    forceReload: async function() {
        this.log('=== FORCING COMPONENT RELOAD ===');
        
        if (window.MALIKLI.components?.forceReload) {
            try {
                await window.MALIKLI.components.forceReload();
                this.log('Force reload completed successfully');
            } catch (error) {
                this.log('Force reload failed:', error);
            }
        } else {
            this.log('Force reload not available, using fallback');
            this.fallbackReload();
        }
        
        setTimeout(() => {
            this.checkStatus();
        }, 1000);
    },
    
    // Fallback reload mechanism
    fallbackReload: function() {
        this.log('Using fallback reload mechanism');
        
        const header = document.getElementById('header-placeholder');
        const footer = document.getElementById('footer-placeholder');
        
        if (header) {
            header.innerHTML = '';
            this.loadDirect('header', 'components/header.html');
        }
        
        if (footer) {
            footer.innerHTML = '';
            this.loadDirect('footer', 'components/footer.html');
        }
    },
    
    // Direct loading with logging
    loadDirect: function(elementId, path) {
        this.log(`Loading ${elementId} from ${path}`);
        
        const placeholder = document.getElementById(elementId + '-placeholder');
        if (!placeholder) {
            this.log(`Placeholder ${elementId}-placeholder not found`);
            return;
        }
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        
        xhr.onload = () => {
            if (xhr.status === 200) {
                placeholder.innerHTML = xhr.responseText;
                this.log(`${elementId} loaded successfully`);
                
                // Reinitialize i18n if available
                if (window.i18n?.reinitialize) {
                    setTimeout(() => {
                        window.i18n.reinitialize();
                        this.log('i18n reinitialized');
                    }, 100);
                }
            } else {
                this.log(`Failed to load ${elementId}: HTTP ${xhr.status}`);
            }
        };
        
        xhr.onerror = () => {
            this.log(`Network error loading ${elementId}`);
        };
        
        xhr.send();
    },
    
    // Monitor component changes
    startMonitoring: function() {
        this.log('Starting component monitoring');
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const target = mutation.target;
                    if (target.id === 'header-placeholder' || target.id === 'footer-placeholder') {
                        this.log(`Component change detected in ${target.id}:`, {
                            added: mutation.addedNodes.length,
                            removed: mutation.removedNodes.length,
                            hasContent: !!target.querySelector('*')
                        });
                    }
                }
            });
        });
        
        const header = document.getElementById('header-placeholder');
        const footer = document.getElementById('footer-placeholder');
        
        if (header) observer.observe(header, { childList: true, subtree: true });
        if (footer) observer.observe(footer, { childList: true, subtree: true });
        
        this.observer = observer;
    },
    
    // Stop monitoring
    stopMonitoring: function() {
        if (this.observer) {
            this.observer.disconnect();
            this.log('Component monitoring stopped');
        }
    },
    
    // Test network connectivity to component files
    testNetwork: async function() {
        this.log('=== TESTING NETWORK CONNECTIVITY ===');
        
        const files = ['components/header.html', 'components/footer.html'];
        
        for (const file of files) {
            try {
                const response = await fetch(file);
                this.log(`${file}:`, {
                    status: response.status,
                    ok: response.ok,
                    size: response.headers.get('content-length')
                });
            } catch (error) {
                this.log(`${file}: ERROR -`, error.message);
            }
        }
    },
    
    // Run comprehensive diagnostics
    runDiagnostics: async function() {
        this.log('=== RUNNING COMPREHENSIVE DIAGNOSTICS ===');
        
        this.checkStatus();
        await this.testNetwork();
        this.startMonitoring();
        
        this.log('Diagnostics complete. Monitoring started.');
        this.log('Use MALIKLI.debugger.forceReload() to test reload');
        this.log('Use MALIKLI.debugger.checkStatus() to check status');
        this.log('Use MALIKLI.debugger.stopMonitoring() to stop monitoring');
    }
};

// Auto-start diagnostics if this script is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.MALIKLI.debugger.runDiagnostics(), 1000);
    });
} else {
    setTimeout(() => window.MALIKLI.debugger.runDiagnostics(), 1000);
}

console.log('Component debugger loaded. Use window.MALIKLI.debugger for debugging tools.');
