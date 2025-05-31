# MALIKLI1992 - Exclusive Fashion Drops

A premium waiting page for MALIKLI1992's exclusive fashion drops, featuring real-time countdown timers, Supabase integration, and a luxury design aesthetic.

## 🌟 Features

- **Luxury Design**: Premium color palette with Tiffany Blue (#0ABAB5) and gold accents
- **Real-time Countdown**: Dynamic countdown timer that updates based on drop status
- **Supabase Integration**: Seamless database integration for drop data and waitlist management
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Waitlist Signup**: Email collection with validation and success tracking
- **Analytics Ready**: Google Analytics and Facebook Pixel integration
- **Performance Optimized**: Fast loading with smooth animations

## 🚀 Quick Start

### Method 1: Quick Start (No Server Required)
1. **Double-click**: `launcher.html` in your project folder
2. Click the "Open MALIKLI1992 Website" button
3. Note: When opened directly, the app will use mock data mode

### Method 2: Using the Batch File
1. **Double-click**: `START_SERVER.bat` in your project folder
2. Open your browser and go to: http://localhost:8000
3. The site should now be running with full functionality

### Method 3: Manual Command
1. Open Command Prompt
2. Navigate to your project folder: 
   ```
   cd c:\Users\alien\Desktop\Me\Github\Malikli-Landing
   ```
3. Start a Python HTTP server:
   ```
   python -m http.server 8000
   ```
4. Open your browser to: http://localhost:8000

### Method 4: Using VS Code
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html` and select "Open with Live Server"
3. Your browser will automatically open with the site

### 1. Clone and Setup
```bash
git clone [repository-url]
cd Malikli-Landing
```

### 2. Configure Supabase

You'll need to set up your Supabase credentials. You can do this in several ways:

#### Option A: Environment Variables (Recommended for production)
Create a `config.js` file:
```javascript
window.SUPABASE_URL = 'your-supabase-url';
window.SUPABASE_ANON_KEY = 'your-supabase-anon-key';
```

#### Option B: Direct Configuration
Edit the `js/supabase.js` file and replace the placeholder values:
```javascript
this.supabaseUrl = 'YOUR_ACTUAL_SUPABASE_URL';
this.supabaseKey = 'YOUR_ACTUAL_SUPABASE_ANON_KEY';
```

### 3. Database Setup

For a complete database setup, run the SQL script provided in the project:

1. Go to your Supabase SQL Editor
2. Run the contents of `database-setup.sql`

The script will:
- Create the necessary tables
- Set up security policies
- Add indexes for performance
- Insert sample data

For detailed instructions and troubleshooting, see [SETUP-GUIDE.md](SETUP-GUIDE.md)

```sql
INSERT INTO drops_drop (name, description, details, start_datetime, end_datetime, banner_image, status, is_public)
VALUES (
  'Summer Luxe Collection',
  'Discover our exclusive summer collection featuring handpicked premium pieces designed for the discerning individual.',
  'Our summer collection brings together the finest materials and exceptional craftsmanship. Each piece is carefully selected to ensure uniqueness and quality that exceeds expectations.',
  '2025-06-01 12:00:00+00',
  '2025-06-07 23:59:59+00',
  'images/banner-placeholder.jpg',
  'upcoming',
  true
);
```

### 5. Deploy

#### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy automatically on git push

#### Vercel
1. Connect repository to Vercel
2. Add environment variables
3. Deploy with zero configuration

#### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Configure Supabase credentials directly in code
3. Push changes to deploy

## 📁 Project Structure

```
Malikli-Landing/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Complete CSS with luxury design
├── js/
│   ├── main.js             # Application controller
│   ├── supabase.js         # Database integration
│   ├── countdown.js        # Timer functionality
│   ├── waitlist.js         # Form handling
│   └── animations.js       # UI animations and effects
├── images/
│   └── banner-placeholder.jpg  # Default banner image
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Tiffany Blue (#0ABAB5)
- **Accent**: Gold (#D4AF37)
- **Neutral**: Soft White (#FAFAFA), Charcoal (#2C3E50)

### Typography
- **Headlines**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Components
- Hero section with dynamic content
- Real-time countdown timer
- Feature cards with hover effects
- Waitlist form with validation
- Responsive footer

## 🔧 Configuration

### Analytics Setup

#### Google Analytics 4
Add to your HTML head:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Facebook Pixel
Add to your HTML head:
```html
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

## 🧪 Development

### Testing the App
1. Open `index.html` in your browser
2. The app will use mock data if Supabase isn't configured
3. Test the countdown timer and waitlist form
4. Check browser console for debug information

### Development Helpers
In development mode, these helpers are available in the browser console:
```javascript
// Check app status
window.dev.getStatus()

// Refresh data
window.dev.refreshData()

// Reset waitlist form
window.dev.showForm()

// Test countdown (5 minutes from now)
window.dev.testCountdown(5)
```

### Mock Data
The app includes comprehensive mock data for development:
- Sample drop information
- Countdown timer with realistic dates
- Form submission simulation
- Error state handling

## 📱 Mobile Optimization

- Mobile-first responsive design
- Touch-friendly form inputs (44px minimum)
- Optimized animations for performance
- Reduced motion support for accessibility

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast color ratios (4.5:1 minimum)
- Screen reader compatibility

## 🔒 Security

- Input sanitization and validation
- Rate limiting for form submissions
- XSS protection
- CSRF protection via Supabase RLS

## 📊 Performance

- Optimized CSS and JavaScript
- Lazy loading for images
- Minimal dependencies
- Target: <3 second load time
- 95+ Lighthouse score

## 🚀 Deployment Checklist

- [ ] Configure Supabase credentials
- [ ] Set up database tables
- [ ] Add sample drop data
- [ ] Configure analytics (GA4, Facebook Pixel)
- [ ] Test on multiple devices and browsers
- [ ] Optimize images for web
- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Test form submissions
- [ ] Monitor performance metrics

## 🐛 Troubleshooting

### Common Issues

1. **Countdown not working**
   - Check if drop data exists in database
   - Verify date formats are correct
   - Check browser console for errors

2. **Form not submitting**
   - Verify Supabase credentials
   - Check database permissions
   - Ensure table exists with correct schema

3. **Images not loading**
   - Check image paths
   - Verify file extensions
   - Ensure images are optimized for web

### Debug Information
Check the browser console for detailed debug information and status updates.

## 📄 License

This project is proprietary to MALIKLI1992. All rights reserved.

## 🤝 Support

For technical support or questions about implementation, please refer to the documentation or contact the development team.

---

Built with ❤️ for MALIKLI1992's exclusive fashion community.
