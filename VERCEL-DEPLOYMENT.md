# Deploying to Vercel

This guide explains how to deploy the MALIKLI1992 landing page to Vercel.

## Prerequisites

- A GitHub account (for connecting to Vercel)
- A Vercel account (sign up at [vercel.com](https://vercel.com))

## Deployment Options

### Option 1: Deploy via Vercel Dashboard (Recommended for first-time setup)

1. Sign up or log in to [Vercel](https://vercel.com)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: Leave empty (static site)
   - Output Directory: ./
5. Add Environment Variables:
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` from your Supabase project
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI (if not already installed):

   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:

   ```bash
   vercel login
   ```

3. Deploy to production:

   ```bash
   npm run deploy
   ```
   
   Or for a preview deployment:

   ```bash
   npm run preview
   ```

## Environment Variables

Make sure to set these environment variables in your Vercel project settings:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Custom Domain Setup

1. Go to your Vercel dashboard > Project > Settings > Domains
2. Add your custom domain
3. Follow the verification instructions
4. Update DNS settings as directed by Vercel

## Continuous Deployment

Vercel automatically deploys when you push changes to your connected repository. To disable this:

1. Go to Project Settings > Git
2. Toggle "Enable Git Integration" to Off

## Troubleshooting

- **Static Files Not Loading**: Make sure your file paths are relative and not absolute
- **Environment Variables Not Working**: Check if they're correctly set in Vercel's dashboard
- **Deployment Fails**: Check the deployment logs in Vercel dashboard for specific errors

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Static Site Deployment Guide](https://vercel.com/guides/deploying-static-sites)
