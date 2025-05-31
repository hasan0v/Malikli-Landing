# MALIKLI1992 Setup and Troubleshooting Guide

This document consolidates setup instructions and common troubleshooting solutions for the MALIKLI1992 landing page project.

## 📋 Database Setup

### Standard Setup
1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **"New Query"**
5. Copy the entire contents of `database-setup.sql`
6. Paste it into the Supabase SQL Editor
7. Click **"RUN"** to execute

### Compatibility Notes
- The database script is designed to work with both new and existing Supabase projects
- It includes safeguards to prevent duplicate tables or columns
- It automatically creates the necessary indexes and security policies
- The script includes a sample drop to get you started

## 🔍 Troubleshooting

### Connection Issues
If you have trouble connecting to Supabase:
1. Verify your Supabase URL and anon key in `config.js`
2. Check browser console for error messages
3. Ensure your Supabase project is active (not paused)
4. Try opening the `database-checker.html` file to test connectivity

### Display Issues
If drops aren't displaying correctly:
1. Check that your database tables were created properly
2. Verify that sample data was inserted
3. Ensure your Supabase permissions allow public read access

### Permission Issues
If you encounter permission errors:
1. Make sure Row Level Security (RLS) is enabled
2. Verify the public policies are correctly set up
3. The main database setup script should handle all required permissions

## 📱 Media Configuration

### Media Files
- Store images in your preferred storage solution (Supabase Storage recommended)
- Update image URLs in the database or in `js/media-config.js`
- For optimal performance, use compressed images (< 500KB)

### Image Dimensions
- Banner images: 1920×1080px (16:9 ratio)
- Thumbnails: 600×600px (1:1 ratio)
- Maximum file size: 2MB

## 🚀 Deployment

See the full deployment instructions in the `DEPLOYMENT.md` file.
