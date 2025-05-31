# Media Domain Integration for MALIKLI1992

## Overview
We've updated the MALIKLI1992 landing page to use the official media domain (`https://media.malikli1992.com/`) for all images and media assets. This ensures consistent branding and faster loading times by using a dedicated media server.

## Changes Made

### 1. Added Media Configuration
- Created a new `media-config.js` file that centralizes all media URLs
- Organized media assets by type (banners, products, brand assets, social)
- Added helper functions for easy image URL retrieval

### 2. Updated Image References
- Updated all placeholder and fallback images to use the media domain
- Changed mock data to reference the media domain
- Fixed error handling to use media domain for fallback images

### 3. Database Integration
- Updated SQL scripts to use the media domain when creating test data
- Modified database checker tool to use media domain URLs

## Usage Instructions

### How to Use the Media Configuration
The `media-config.js` file provides a global `MEDIA_CONFIG` object that contains all media asset URLs. You can access them like this:

```javascript
// Get a banner image
const bannerUrl = window.MEDIA_CONFIG.banners.summer2025;

// Get the brand logo
const logoUrl = window.MEDIA_CONFIG.brand.logo;

// Use the helper function (recommended)
const productImage = window.getImageUrl('product', 'luxury-bag');
```

### Adding New Media Assets
When adding new media assets to the site, follow these steps:

1. Upload the asset to the media server in the appropriate directory
2. Update the `media-config.js` file with the new asset reference
3. Use the helper function or direct reference in your code

### Folder Structure on Media Server
The media server should maintain this folder structure:

```
/banners/        - Drop and collection banner images
/products/        - Product images
/brand/          - Logo and brand assets
/social/         - Social media sharing images
```

## Technical Notes

### Image URLs
- All image URLs are now absolute (always beginning with https://)
- The default banner fallback is: `https://media.malikli1992.com/banners/default-banner.jpg`
- When adding new images, maintain consistent naming conventions (kebab-case)

### Error Handling
- All image error handlers now point to the media domain
- The default fallback image is served when requested images fail to load
- Console warnings will show when images fail to load

### Performance Considerations
- The media domain should be configured with proper caching headers
- Consider using a CDN for global distribution
- Images should be optimized for web (WebP format with fallbacks)
