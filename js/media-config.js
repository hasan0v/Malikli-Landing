// Media configuration for MALIKLI1992
// This file contains all media-related constants and configuration

window.MEDIA_CONFIG = {
    // Base URL for all media assets
    baseUrl: 'https://media.malikli1992.com',
    
    // Banner images
    banners: {
        default: 'https://media.malikli1992.com/banners/default-banner.jpg',
        summer2025: 'https://media.malikli1992.com/banners/summer-2025-collection.jpg',
        winter2025: 'https://media.malikli1992.com/banners/winter-2025-collection.jpg',
        luxury: 'https://media.malikli1992.com/banners/luxury-collection.jpg'
    },
    
    // Product images
    products: {
        baseUrl: 'https://media.malikli1992.com/products',
        placeholder: 'https://media.malikli1992.com/products/placeholder-product.jpg'
    },
    
    // Brand assets
    brand: {
        logo: 'https://media.malikli1992.com/brand/malikli1992-logo.svg',
        logoWhite: 'https://media.malikli1992.com/brand/malikli1992-logo-white.svg',
        favicon: 'https://media.malikli1992.com/brand/favicon.svg'
    },
    
    // Social media images
    social: {
        shareImage: 'https://media.malikli1992.com/social/share-image.jpg',
        instagramPromo: 'https://media.malikli1992.com/social/instagram-promo.jpg'
    }
};

// Image helper functions
window.getImageUrl = function(type, key) {
    if (type === 'banner') {
        return window.MEDIA_CONFIG.banners[key] || window.MEDIA_CONFIG.banners.default;
    } else if (type === 'product') {
        return `${window.MEDIA_CONFIG.products.baseUrl}/${key}.jpg`;
    } else if (type === 'brand') {
        return window.MEDIA_CONFIG.brand[key] || window.MEDIA_CONFIG.brand.logo;
    } else if (type === 'social') {
        return window.MEDIA_CONFIG.social[key] || window.MEDIA_CONFIG.social.shareImage;
    }
    return window.MEDIA_CONFIG.banners.default;
};

console.log('📸 Media configuration loaded for MALIKLI1992');
