// Configuration file for MALIKLI1992 Waiting Page
// Replace these with your actual Supabase credentials

// Supabase Configuration
window.SUPABASE_URL = 'https://dmzdshysoovqxsghrpjr.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtemRzaHlzb292cXhzZ2hycGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MTkyNDMsImV4cCI6MjA2MzA5NTI0M30._-0FKmdBpiYW3TzEva_DY5DBSC4ex5-t-dRkjqkZ448';

// Google Analytics Configuration (optional)
window.GA_MEASUREMENT_ID = 'GA_MEASUREMENT_ID';

// Facebook Pixel ID (optional)
window.FB_PIXEL_ID = 'YOUR_PIXEL_ID';

// Application Settings
window.APP_CONFIG = {
    // Email validation settings
    email: {
        allowDisposable: false,
        requireVerification: false
    },
    
    // Countdown settings
    countdown: {
        updateInterval: 1000, // milliseconds
        showMilliseconds: false
    },
    
    // Animation settings
    animations: {
        reducedMotion: false,
        parallaxEnabled: true,
        hoverEffectsEnabled: true
    },
    
    // Analytics settings
    analytics: {
        trackScrollDepth: true,
        trackTimeOnPage: true,
        trackFormInteractions: true
    },
    
    // Development settings
    debug: {
        enabled: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
        logLevel: 'info' // 'debug', 'info', 'warn', 'error'
    }
};

// Theme Configuration
window.THEME_CONFIG = {
    colors: {
        primary: '#0ABAB5',
        primaryLight: '#2DD4CF',
        primaryDark: '#088B87',
        accent: '#D4AF37',
        accentLight: '#F4D03F'
    },
    
    fonts: {
        heading: 'Playfair Display',
        body: 'Inter'
    },
    
    breakpoints: {
        mobile: '768px',
        tablet: '1024px',
        desktop: '1200px'
    }
};

// Load configuration immediately
console.log('🔧 Configuration loaded for MALIKLI1992');

// Auto-initialize if running in development
if (window.APP_CONFIG.debug.enabled) {
    console.log('🛠️ Development mode enabled');
    console.log('Configuration:', {
        supabaseConfigured: !!window.SUPABASE_URL && window.SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE',
        analyticsConfigured: !!window.GA_MEASUREMENT_ID && window.GA_MEASUREMENT_ID !== 'GA_MEASUREMENT_ID'
    });
}
