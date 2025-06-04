// i18n.js - Internationalization module using i18next
class I18nManager {    constructor() {
        this.config = window.I18N_CONFIG || {
            defaultLanguage: 'en',
            languages: { 'en': { name: 'English', flag: '🇺🇸', file: 'en.json' } },
            fallbackLanguage: 'en',
            storageKey: 'malikli1992-language',
            urlParam: 'lang',
            autoDetect: true,
            translationsPath: './translations/'
        };
        this.currentLanguage = this.config.defaultLanguage;
        this.translations = {};
        this.initialized = false;
        this.outsideClickHandler = null;
    }async init() {
        try {
            // Get preferred language
            const preferredLang = this.getPreferredLanguage();
            // Load translation file
            await this.loadTranslations(preferredLang);
            this.initialized = true;
            this.updatePage();
            this.setupLanguageSwitcher();
            this.updateLanguageSwitcherDisplay();
            console.log(`i18n initialized successfully with language: ${this.currentLanguage}`);
        } catch (error) {
            console.error('Failed to initialize i18n:', error);
            // Fallback to default language
            if (this.currentLanguage !== this.config.fallbackLanguage) {
                await this.loadTranslations(this.config.fallbackLanguage);
                this.initialized = true;
                this.updatePage();
                this.setupLanguageSwitcher();
                this.updateLanguageSwitcherDisplay();
            }
        }
    }async loadTranslations(language) {
        try {
            const langConfig = this.config.languages[language];
            if (!langConfig) {
                throw new Error(`Language ${language} not supported`);
            }
            
            const response = await fetch(`${this.config.translationsPath}${langConfig.file}`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${language}`);
            }
            this.translations = await response.json();
            this.currentLanguage = language;
        } catch (error) {
            console.error('Error loading translations:', error);
            throw error;
        }
    }

    t(key, defaultValue = '') {
        if (!this.initialized) {
            return defaultValue || key;
        }

        const keys = key.split('.');
        let value = this.translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue || key;
            }
        }
        
        return typeof value === 'string' ? value : defaultValue || key;
    }    updatePage() {
        // Add transition class to prevent jarring changes
        document.body.classList.add('language-transition');
        
        // Update all elements with data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.type === 'submit' || element.type === 'button') {
                    element.value = translation;
                } else {
                    element.placeholder = translation;
                }
            } else {
                // Add text container class for better text handling
                if (!element.classList.contains('text-container')) {
                    element.classList.add('text-container');
                }
                element.textContent = translation;
            }
        });

        // Update elements with data-i18n-html attributes (for HTML content)
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = this.t(key);
            if (!element.classList.contains('text-container')) {
                element.classList.add('text-container');
            }
            element.innerHTML = translation;
        });

        // Update elements with data-i18n-placeholder attributes (for input placeholders)
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            element.placeholder = translation;
        });

        // Update meta tags
        this.updateMetaTags();
        
        // Remove transition class after a short delay
        setTimeout(() => {
            document.body.classList.remove('language-transition');
            document.body.classList.add('language-transition-complete');
            setTimeout(() => {
                document.body.classList.remove('language-transition-complete');
            }, 200);
        }, 50);
    }

    updateMetaTags() {
        // Update page title
        const title = this.t('meta.title');
        if (title) {
            document.title = title;
        }

        // Update meta description
        const description = this.t('meta.description');
        if (description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', description);
            }
        }
    }    setupLanguageSwitcher() {
        console.log('Setting up language switcher...');
        // Set up existing language switcher
        const switcher = document.querySelector('.language-switcher');
        if (switcher) {
            console.log('Found existing language switcher, setting it up...');
            this.setupExistingLanguageSwitcher(switcher);
        } else {
            console.log('No language switcher found, creating one...');
            this.createLanguageSwitcher();
        }
    }    setupExistingLanguageSwitcher(switcher) {
        console.log('Setting up existing language switcher...');
        const button = switcher.querySelector('.language-switcher__button');
        const dropdown = switcher.querySelector('.language-switcher__dropdown');
        
        console.log('Button found:', !!button, 'Dropdown found:', !!dropdown);
        
        if (button && dropdown) {
            // Remove any existing event listeners to prevent duplicates
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            console.log('Populating language dropdown...');
            // Populate dropdown with available languages
            this.populateLanguageDropdown(dropdown);
            
            console.log('Adding click handler to button...');
            // Add click handler to toggle dropdown
            newButton.addEventListener('click', (e) => {
                console.log('Language switcher button clicked!');
                e.preventDefault();
                e.stopPropagation();
                switcher.classList.toggle('open');
                console.log('Switcher open state:', switcher.classList.contains('open'));
            });
            
            // Close dropdown when clicking outside (remove old listeners first)
            if (this.outsideClickHandler) {
                document.removeEventListener('click', this.outsideClickHandler);
            }
            
            this.outsideClickHandler = (e) => {
                if (!switcher.contains(e.target)) {
                    switcher.classList.remove('open');
                }
            };
            
            document.addEventListener('click', this.outsideClickHandler);
            console.log('Language switcher setup complete!');
        }
    }populateLanguageDropdown(dropdown) {
        dropdown.innerHTML = '';
        
        Object.entries(this.config.languages).forEach(([code, config]) => {
            const option = document.createElement('button');
            option.className = 'language-option';
            option.setAttribute('data-lang', code);
            option.innerHTML = `
                <span class="language-flag">${config.flag}</span>
                <span class="language-name">${config.name}</span>
            `;
            
            if (code === this.currentLanguage) {
                option.classList.add('active');
            }
            
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.changeLanguage(code);
                const switcher = dropdown.closest('.language-switcher');
                if (switcher) {
                    switcher.classList.remove('open');
                }
            });
            
            dropdown.appendChild(option);
        });
    }    updateLanguageSwitcherDisplay() {
        const switcher = document.querySelector('.language-switcher');
        if (switcher) {
            const currentConfig = this.config.languages[this.currentLanguage];
            const button = switcher.querySelector('.language-switcher__button');
            
            if (button && currentConfig) {
                const flag = button.querySelector('.language-flag');
                const name = button.querySelector('.language-name');
                
                if (flag) flag.textContent = currentConfig.flag;
                if (name) name.textContent = currentConfig.flag;
            }
            
            // Update active state in dropdown
            const dropdown = switcher.querySelector('.language-switcher__dropdown');
            if (dropdown) {
                dropdown.querySelectorAll('.language-option').forEach(option => {
                    option.classList.remove('active');
                    if (option.getAttribute('data-lang') === this.currentLanguage) {
                        option.classList.add('active');
                    }
                });
            }
        }
    }

    createLanguageSwitcher() {
        const nav = document.querySelector('.nav__menu');
        if (!nav) return;

        const languageSwitcher = document.createElement('div');
        languageSwitcher.className = 'language-switcher';        languageSwitcher.innerHTML = `
            <button class="language-switcher__button" id="current-language">
                <span class="language-flag">🇺🇸</span>
                <span class="language-name">🇺🇸</span>
                <span class="language-arrow">▼</span>
            </button>
            <div class="language-switcher__dropdown" id="language-dropdown">
                <!-- Language options will be populated -->
            </div>
        `;

        nav.appendChild(languageSwitcher);
        this.setupExistingLanguageSwitcher(languageSwitcher);
    }    async changeLanguage(language) {
        if (language === this.currentLanguage) return;

        try {
            await this.loadTranslations(language);
            this.updatePage();
            this.updateLanguageSwitcherDisplay();
            
            // Stabilize mobile layout after language change
            setTimeout(() => {
                this.stabilizeMobileLayout();
            }, 100);
            
            // Save preference
            localStorage.setItem('preferred-language', language);
            
            // Update URL without reload (optional)
            const url = new URL(window.location);
            url.searchParams.set('lang', language);
            window.history.replaceState({}, '', url);
            
        } catch (error) {
            console.error('Failed to change language:', error);
        }
    }

    getPreferredLanguage() {
        // Check URL parameter first
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang) return urlLang;

        // Check localStorage
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang) return savedLang;

        // Check browser language
        const browserLang = navigator.language.split('-')[0];
        return browserLang || 'en';
    }

    // Utility method to add translations dynamically
    addTranslations(translations, language = null) {
        language = language || this.currentLanguage;
        if (language === this.currentLanguage) {
            this.translations = { ...this.translations, ...translations };
            this.updatePage();
        }
    }    // Public method to reinitialize i18n after dynamic content loading
    reinitialize() {
        console.log('Reinitializing i18n..., initialized:', this.initialized);
        if (this.initialized) {
            this.updatePage();
            this.setupLanguageSwitcher();
            this.updateLanguageSwitcherDisplay();
            console.log('i18n reinitialization complete');
        }
    }

    // Mobile layout stabilization after language change
    stabilizeMobileLayout() {
        if (window.innerWidth <= 768) {
            // Force reflow for mobile elements
            const hero = document.querySelector('.hero');
            const nav = document.querySelector('.nav');
            const waitlist = document.querySelector('.waitlist');
            
            if (hero) {
                const heroTitle = hero.querySelector('.hero__title');
                const heroSubtitle = hero.querySelector('.hero__subtitle');
                
                if (heroTitle) {
                    heroTitle.style.height = 'auto';
                    const titleHeight = heroTitle.scrollHeight;
                    heroTitle.style.minHeight = Math.max(titleHeight, window.innerWidth <= 480 ? 72 : 56) + 'px';
                }
                
                if (heroSubtitle) {
                    heroSubtitle.style.height = 'auto';
                    const subtitleHeight = heroSubtitle.scrollHeight;
                    heroSubtitle.style.minHeight = Math.max(subtitleHeight, window.innerWidth <= 480 ? 96 : 64) + 'px';
                }
            }
            
            // Stabilize navigation
            if (nav) {
                const navLinks = nav.querySelectorAll('.nav__link');
                navLinks.forEach(link => {
                    link.style.minWidth = window.innerWidth <= 480 ? '45px' : '50px';
                });
            }
            
            // Stabilize waitlist section
            if (waitlist) {
                const waitlistTitle = waitlist.querySelector('.waitlist__title');
                const waitlistSubtitle = waitlist.querySelector('.waitlist__subtitle');
                
                if (waitlistTitle) {
                    waitlistTitle.style.minHeight = '48px';
                }
                
                if (waitlistSubtitle) {
                    waitlistSubtitle.style.minHeight = window.innerWidth <= 480 ? '96px' : '64px';
                }
            }
        }
    }
}

// Create global instance
const i18n = new I18nManager();

// Auto-initialize when DOM is loaded, but delay slightly to allow components to load
document.addEventListener('DOMContentLoaded', () => {
    // Use a small delay to ensure components have time to load
    setTimeout(() => {
        if (!i18n.initialized) {
            i18n.init();
        }
    }, 100);
});

// Add resize handler for mobile orientation changes
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.stabilizeMobileLayout();
            }, 250);
        });

        // Add orientation change handler
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.stabilizeMobileLayout();
            }, 500);
        });

// Export for use in other modules
window.i18n = i18n;
