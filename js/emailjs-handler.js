/**
 * EmailJS Handler
 * Manages all email sending functionality for contact forms
 */

class EmailJSHandler {
    constructor() {
        // EmailJS credentials - try to use environment variables if available
        this.userId = this.getEnvVariable('EMAILJS_USER_ID') || "VPcVXhPxRGNoAkDJmLjB0";
        this.serviceId = this.getEnvVariable('EMAILJS_SERVICE_ID') || "service_nf604ld";
        this.templateId = this.getEnvVariable('EMAILJS_TEMPLATE_ID') || "template_0vnaj2c";
        this.publicKey = this.getEnvVariable('EMAILJS_PUBLIC_KEY') || "037LRbdfVdiKdAuaI";
        
        // Initialize EmailJS
        this.init();
    }
    
    /**
     * Get environment variable if available
     * @param {string} name - Name of the environment variable
     * @returns {string|null} - Value of the environment variable or null
     */
    getEnvVariable(name) {
        // Check if running in a modern environment that supports process.env
        if (typeof process !== 'undefined' && process.env && process.env[name]) {
            return process.env[name];
        }
        
        // Check if running in Vercel and window.__ENV__ was injected
        if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[name]) {
            return window.__ENV__[name];
        }
        
        return null;
    }
    
    /**
     * Initialize EmailJS with user ID
     */
    init() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.userId);
            console.log("EmailJS initialized successfully");
        } else {
            console.error("EmailJS SDK not loaded");
        }
    }
    
    /**
     * Send an email using EmailJS
     * @param {Object} templateParams - Template parameters for the email
     * @returns {Promise} - Promise object representing the email sending operation
     */
    sendEmail(templateParams) {
        return emailjs.send(
            this.serviceId,
            this.templateId,
            templateParams,
            this.publicKey
        );
    }
    
    /**
     * Validate email address format
     * @param {string} email - Email address to validate
     * @returns {boolean} - True if email is valid, false otherwise
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Create a global instance for easy access
window.emailJSHandler = new EmailJSHandler();
