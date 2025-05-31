// Waitlist form functionality
class WaitlistForm {
    constructor() {
        this.form = document.getElementById('waitlist-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.successMessage = document.getElementById('success-message');
        this.emailInput = document.getElementById('email');
        this.firstNameInput = document.getElementById('first-name');
        this.termsCheckbox = document.getElementById('terms');
        
        this.isSubmitting = false;
        this.isInitialized = false;
        
        // If form is available, set up now
        if (this.form) {
            this.setupEventListeners();
            this.setupValidation();
            this.isInitialized = true;
            console.log('✅ WaitlistForm initialized successfully');
        } else {
            console.log('⏳ WaitlistForm elements not yet available, will initialize later');
        }
    }

    // Setup form event listeners
    setupEventListeners() {
        if (!this.form) {
            console.log('⚠️ Form element not found, cannot setup event listeners');
            return;
        }

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        this.emailInput?.addEventListener('blur', () => this.validateEmail());
        this.emailInput?.addEventListener('input', () => this.clearError(this.emailInput));
        
        // Terms checkbox handling
        this.termsCheckbox?.addEventListener('change', () => this.validateTerms());
    }

    // Setup form validation
    setupValidation() {
        // Email input styling
        if (this.emailInput) {
            this.emailInput.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.showFieldError(this.emailInput, 'Please enter a valid email address');
            });
        }
    }

    // Handle form submission
    async handleSubmit() {
        if (this.isSubmitting) return;

        if (!this.validateForm()) {
            return;
        }

        const formData = {
            email: this.emailInput.value.trim(),
            firstName: this.firstNameInput.value.trim()
        };

        try {
            this.setSubmittingState(true);
            
            // Submit to Supabase
            await window.supabaseClient.joinWaitlist(formData.email, formData.firstName);
            
            // Track successful signup
            this.trackWaitlistSignup(formData.email);
            
            // Show success message
            this.showSuccess();
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            console.error('Waitlist signup error:', error);
            this.showError(error.message || 'Something went wrong. Please try again.');
        } finally {
            this.setSubmittingState(false);
        }
    }

    // Validate entire form
    validateForm() {
        let isValid = true;

        // Clear previous errors
        this.clearAllErrors();

        // Validate email
        if (!this.validateEmail()) {
            isValid = false;
        }

        // Validate terms
        if (!this.validateTerms()) {
            isValid = false;
        }

        return isValid;
    }

    // Validate email field
    validateEmail() {
        const email = this.emailInput.value.trim();
        
        if (!email) {
            this.showFieldError(this.emailInput, 'Email is required');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showFieldError(this.emailInput, 'Please enter a valid email address');
            return false;
        }

        this.clearError(this.emailInput);
        return true;
    }

    // Validate terms checkbox
    validateTerms() {
        if (!this.termsCheckbox.checked) {
            this.showFieldError(this.termsCheckbox, 'Please accept the terms and privacy policy');
            return false;
        }

        this.clearError(this.termsCheckbox);
        return true;
    }

    // Check if email format is valid
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show field-specific error
    showFieldError(field, message) {
        this.clearError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    // Clear error for specific field
    clearError(field) {
        field.classList.remove('error');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Clear all form errors
    clearAllErrors() {
        const errorElements = this.form.querySelectorAll('.field-error');
        errorElements.forEach(error => error.remove());
        
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }

    // Show general form error
    showError(message) {
        this.clearGeneralError();
        
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-text">${message}</span>
            </div>
        `;
        
        this.form.insertBefore(errorElement, this.submitBtn);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.clearGeneralError();
        }, 5000);
    }

    // Clear general error message
    clearGeneralError() {
        const existingError = this.form.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Set form submitting state
    setSubmittingState(isSubmitting) {
        this.isSubmitting = isSubmitting;
        
        const btnText = this.submitBtn.querySelector('.btn__text');
        const btnLoader = this.submitBtn.querySelector('.btn__loader');
        
        if (isSubmitting) {
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('submitting');
            btnText.style.opacity = '0';
            btnLoader.style.display = 'block';
            
            // Disable form inputs
            this.emailInput.disabled = true;
            this.firstNameInput.disabled = true;
            this.termsCheckbox.disabled = true;
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('submitting');
            btnText.style.opacity = '1';
            btnLoader.style.display = 'none';
            
            // Re-enable form inputs
            this.emailInput.disabled = false;
            this.firstNameInput.disabled = false;
            this.termsCheckbox.disabled = false;
        }
    }

    // Show success message
    showSuccess() {
        this.form.style.display = 'none';
        this.successMessage.style.display = 'block';
        
        // Add success animation
        this.successMessage.classList.add('show');
        
        // Scroll to success message
        this.successMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }

    // Reset form to initial state
    resetForm() {
        this.form.reset();
        this.clearAllErrors();
        this.clearGeneralError();
    }

    // Track waitlist signup for analytics
    trackWaitlistSignup(email) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'waitlist_signup', {
                event_category: 'engagement',
                event_label: 'email_captured',
                value: 1
            });
        }

        // Facebook Pixel tracking
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Waitlist Signup'
            });
        }

        // Custom tracking
        console.log('Waitlist signup tracked:', email);
    }

    // Reset form and show form again (for testing)
    showForm() {
        this.form.style.display = 'block';
        this.successMessage.style.display = 'none';
        this.successMessage.classList.remove('show');
        this.resetForm();
        this.setSubmittingState(false);
    }
}

// Add CSS for form validation states
const formStyles = `
    .form-input.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }

    .field-error {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .field-error::before {
        content: '⚠️';
        font-size: 0.75rem;
    }

    .form-error {
        background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
        border: 1px solid #f5c6cb;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
        animation: slideDown 0.3s ease;
    }

    .error-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #721c24;
    }

    .error-icon {
        font-size: 1.25rem;
    }

    .btn.submitting {
        pointer-events: none;
        opacity: 0.8;
    }

    .waitlist__success.show {
        animation: fadeInScale 0.5s ease;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .checkbox-label.error .checkbox-custom {
        border-color: #dc3545;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = formStyles;
document.head.appendChild(styleSheet);

// Initialize waitlist form immediately
console.log('📋 Creating WaitlistForm instance');
window.waitlistForm = new WaitlistForm();

// Also initialize when DOM is loaded to ensure elements are available
document.addEventListener('DOMContentLoaded', () => {
    if (!window.waitlistForm || !window.waitlistForm.form) {
        console.log('🔄 Reinitializing WaitlistForm after DOM loaded');
        window.waitlistForm = new WaitlistForm();
    }
});
