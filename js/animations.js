// Animation and scroll effects
class AnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.isInitialized = false;
        this.init();
    }

    init() {
        try {
            this.setupScrollAnimations();
            this.setupParallaxEffects();
            this.setupHoverEffects();
            this.setupPageLoadAnimations();
            this.setupFaqAccordion(); // Add FAQ accordion functionality
            this.isInitialized = true;
            console.log('✅ AnimationController initialized successfully');
        } catch (error) {
            console.error('❌ AnimationController initialization failed:', error);
        }
    }

    // Setup scroll-triggered animations
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger staggered animations for child elements
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            });
        }, this.observerOptions);        // Observe elements that should animate on scroll
        const animateElements = document.querySelectorAll(
            '.info__content, .info__features, .waitlist__content, .footer__content, .shipping-content__section, .terms-section, .terms-container'
        );
        
        animateElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });        // Add stagger-child class to feature cards and faq items
        const staggerItems = document.querySelectorAll('.feature-card, .faq-item, .shipping-info, .terms-section');
        staggerItems.forEach(item => item.classList.add('stagger-child'));
    }

    // Setup FAQ accordion functionality
    setupFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            // Set initial state
            if (index === 0) {
                item.classList.add('active');
            } else {
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                answer.style.overflow = 'hidden';
            }
            
            // Add click event
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Reset all items
                faqItems.forEach(faqItem => {
                    const faqAnswer = faqItem.querySelector('.faq-answer');
                    
                    if (faqItem !== item) {
                        faqItem.classList.remove('active');
                        faqAnswer.style.maxHeight = '0';
                        faqAnswer.style.opacity = '0';
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                    answer.style.opacity = '0';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.opacity = '1';
                }
            });
            
            // Add keyboard accessibility
            question.setAttribute('tabindex', '0');
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
            answer.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
            
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }

    // Setup parallax scrolling effects
    setupParallaxEffects() {
        const heroImage = document.querySelector('.hero__image-container');
        const heroContent = document.querySelector('.hero__content');
        
        if (!heroImage || !heroContent) return;

        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            
            if (scrolled < heroHeight) {
                const rate = scrolled * -0.5;
                const rate2 = scrolled * -0.2;
                
                heroImage.style.transform = `translateY(${rate}px)`;
                heroContent.style.transform = `translateY(${rate2}px)`;
            }
            
            ticking = false;
        };

        const requestParallax = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestParallax, { passive: true });
    }

    // Setup hover effects
    setupHoverEffects() {
        // Magnetic effect for buttons
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Tilt effect for cards
        const cards = document.querySelectorAll('.feature-card, .countdown__card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    // Setup page load animations
    setupPageLoadAnimations() {
        window.addEventListener('load', () => {
            // Fade in header
            const header = document.querySelector('.header');
            if (header) {
                header.classList.add('fade-in');
            }

            // Animate hero elements sequentially
            const heroElements = [
                '.hero__badge',
                '.hero__title',
                '.hero__subtitle',
                '.hero__cta'
            ];

            heroElements.forEach((selector, index) => {
                const element = document.querySelector(selector);
                if (element) {
                    setTimeout(() => {
                        element.classList.add('animate-in');
                    }, index * 200);
                }
            });

            // Animate hero image
            const heroImage = document.querySelector('.hero__visual');
            if (heroImage) {
                setTimeout(() => {
                    heroImage.classList.add('animate-in');
                }, 600);
            }
            
            // Animate page hero
            const pageHero = document.querySelector('.page-hero');
            if (pageHero) {
                pageHero.classList.add('fade-in');
                
                const pageHeroTitle = document.querySelector('.page-hero__title');
                const pageHeroSubtitle = document.querySelector('.page-hero__subtitle');
                
                if (pageHeroTitle) {
                    setTimeout(() => {
                        pageHeroTitle.classList.add('animate-in');
                    }, 200);
                }
                
                if (pageHeroSubtitle) {
                    setTimeout(() => {
                        pageHeroSubtitle.classList.add('animate-in');
                    }, 400);
                }
            }
        });
    }

    // Smooth scroll to element
    scrollToElement(selector, offset = 0) {
        const element = document.querySelector(selector);
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Add floating animation to element
    addFloatingAnimation(element, duration = 6000, distance = 10) {
        if (!element) return;

        const animation = element.animate([
            { transform: 'translateY(0px)' },
            { transform: `translateY(-${distance}px)` },
            { transform: 'translateY(0px)' }
        ], {
            duration: duration,
            iterations: Infinity,
            easing: 'ease-in-out'
        });

        return animation;
    }

    // Typewriter effect for text
    typeWriter(element, text, speed = 50) {
        if (!element) return;

        element.textContent = '';
        let i = 0;

        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);

        return timer;
    }

    // Pulse animation for elements
    pulse(element, scale = 1.05, duration = 1000) {
        if (!element) return;

        const animation = element.animate([
            { transform: 'scale(1)' },
            { transform: `scale(${scale})` },
            { transform: 'scale(1)' }
        ], {
            duration: duration,
            iterations: 1,
            easing: 'ease-in-out'
        });

        return animation;
    }
}

// CSS animations
const animationStyles = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .stagger-child {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .stagger-child.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .header {
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.6s ease;
    }

    .header.fade-in {
        opacity: 1;
        transform: translateY(0);
    }

    .hero__badge,
    .hero__title,
    .hero__subtitle,
    .hero__cta {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .hero__visual {
        opacity: 0;
        transform: translateX(30px);
        transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .hero__badge.animate-in,
    .hero__title.animate-in,
    .hero__subtitle.animate-in,
    .hero__cta.animate-in,
    .hero__visual.animate-in {
        opacity: 1;
        transform: translateY(0) translateX(0);
    }

    .btn {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .feature-card,
    .countdown__card {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    /* Scroll indicator */
    .scroll-indicator {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color) 0%, var(--accent-gold) 100%);
        transform-origin: left;
        transform: scaleX(0);
        transition: transform 0.3s ease;
        z-index: 9999;
    }

    /* FAQ animations */
    .faq-item {
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .faq-item.active {
        box-shadow: var(--shadow-lg);
    }

    .faq-question {
        position: relative;
        padding-right: 30px;
        cursor: pointer;
    }

    .faq-question::after {
        content: '+';
        position: absolute;
        right: 0;
        top: 0;
        font-size: 1.2rem;
        color: var(--primary-color);
        transition: transform 0.3s ease;
    }

    .faq-item.active .faq-question::after {
        transform: rotate(45deg);
    }

    .faq-answer {
        transition: max-height 0.5s ease, opacity 0.3s ease;
    }

    /* Page hero animations */
    .page-hero {
        opacity: 0;
        transition: opacity 0.8s ease;
    }

    .page-hero.fade-in {
        opacity: 1;
    }

    .page-hero__title,
    .page-hero__subtitle {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .page-hero__title.animate-in,
    .page-hero__subtitle.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    /* Loading animations */
    @keyframes shimmer {
        0% {
            background-position: -468px 0;
        }
        100% {
            background-position: 468px 0;
        }
    }

    .loading-shimmer {
        animation: shimmer 1.5s ease-in-out infinite;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 1000px 100%;
    }

    /* Enhanced focus styles for accessibility */
    .btn:focus-visible,
    .form-input:focus-visible,
    .nav__link:focus-visible {
        outline: 3px solid var(--primary-color);
        outline-offset: 2px;
        border-radius: 4px;
    }

    /* Reduced motion for accessibility */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
`;

// Add animation styles to document
const animationStyleSheet = document.createElement('style');
animationStyleSheet.textContent = animationStyles;
document.head.appendChild(animationStyleSheet);

// Create scroll progress indicator
const createScrollIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.appendChild(indicator);

    const updateScrollProgress = () => {
        const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        indicator.style.transform = `scaleX(${scrollProgress / 100})`;
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
};

// Initialize animations immediately
console.log('🎬 Creating AnimationController instance');
window.animationController = new AnimationController();

// Setup additional functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Make sure we have a valid instance
    if (!window.animationController || !window.animationController.isInitialized) {
        console.log('🔄 Reinitializing AnimationController after DOM loaded');
        window.animationController = new AnimationController();
    }
    
    // Add scroll indicator
    createScrollIndicator();

    // Setup smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                window.animationController.scrollToElement(link.getAttribute('href'), 80);
            }
        });
    });
});

// Export for external use
window.AnimationController = AnimationController;
