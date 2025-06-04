// i18n-config.js - Configuration for internationalization
window.I18N_CONFIG = {
    // Default language
    defaultLanguage: 'en',
    
    // Available languages
    languages: {
        'en': {
            name: 'English',
            flag: '🇺🇸',
            file: 'en.json'
        },
        'ru': {
            name: 'Русский',
            flag: '🇷🇺',
            file: 'ru.json'
        },
        // Future languages can be added here:
        'tr': {
            name: 'Türkçe',
            flag: '🇹🇷', 
            file: 'tr.json'
        },
        'ar': {
            name: 'العربية',
            flag: '🇸🇦',
            file: 'ar.json'
        },
        'az': {
            name: 'Azərbaycan',
            flag: '🇦🇿',
            file: 'az.json'
        },
        'be': {
            name: 'Беларуская',
            flag: '🇧🇾',
            file: 'be.json'
        },
        'de': {
            name: 'Deutsch',
            flag: '🇩🇪',
            file: 'de.json'
        },
        'fr': {
            name: 'Français',
            flag: '🇫🇷',
            file: 'fr.json'
        },
        'es': {
            name: 'Español',
            flag: '🇪🇸',
            file: 'es.json'
        },
        'it': {
            name: 'Italiano',
            flag: '🇮🇹',
            file: 'it.json'
        },
        'zh': {
            name: '中文',
            flag: '🇨🇳',
            file: 'zh.json'
        },
        'ja': {
            name: '日本語',
            flag: '🇯🇵',
            file: 'ja.json'
        },
        'ko': {
            name: '한국어',
            flag: '🇰🇷',
            file: 'ko.json'
        },
        'pt': {
            name: 'Português',
            flag: '🇵🇹',
            file: 'pt.json'
        }
    },
    
    // Fallback behavior
    fallbackLanguage: 'en',
    
    // Storage key for saving user preference
    storageKey: 'malikli1992-language',
    
    // URL parameter for language switching
    urlParam: 'lang',
    
    // Auto-detect browser language
    autoDetect: true,
    
    // Translation file path
    translationsPath: './translations/'
};
