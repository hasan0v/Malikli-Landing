# EmailJS Environment Variables

When deploying your site to Vercel, you should set up the following environment variables in your Vercel project dashboard for better security:

## Required Environment Variables

1. `EMAILJS_USER_ID`: VPcVXhPxRGNoAkDJmLjB0
2. `EMAILJS_SERVICE_ID`: service_nf604ld
3. `EMAILJS_TEMPLATE_ID`: template_0vnaj2c
4. `EMAILJS_PUBLIC_KEY`: 037LRbdfVdiKdAuaI

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Add each variable with its corresponding value
5. Set the environment to "Production" (and "Preview" if needed)
6. Click "Save"

## Using Environment Variables in Your Code

To use these environment variables in your contact form instead of hardcoding them, modify your EmailJS implementation as follows:

```javascript
// EmailJS initialization
emailjs.init(process.env.EMAILJS_USER_ID);

// When sending email
emailjs.send(
  process.env.EMAILJS_SERVICE_ID,
  process.env.EMAILJS_TEMPLATE_ID,
  templateParams,
  process.env.EMAILJS_PUBLIC_KEY
)
```

Note: This is a more secure approach than hardcoding the values directly in your HTML file. For now, the values are hardcoded in your contact.html file for immediate functionality, but consider updating to use environment variables for better security.
