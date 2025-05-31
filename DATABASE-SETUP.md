# 🗄️ Database Setup Instructions

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project: `dmzdshysoovqxsghrpjr`
3. Navigate to **SQL Editor** in the left sidebar
4. Click **"New Query"**

## Step 2: Run the Setup Script

1. Copy the entire contents of `database-setup.sql`
2. Paste it into the Supabase SQL Editor
3. Click **"RUN"** to execute

## Step 3: Verify Setup

After running the script, you should see:
- ✅ `drops_drop` table created
- ✅ `waitlist_subscribers` table created
- ✅ Sample data inserted
- ✅ Security policies enabled

## Step 4: Test Your Application

1. Refresh your page at http://localhost:3000
2. The countdown timer should now show real data
3. Test the waitlist signup form
4. Check the browser console for success messages

## 🎯 What the Script Creates:

### Tables:
- **drops_drop**: Stores your fashion drop information
- **waitlist_subscribers**: Stores email signups

### Sample Data:
- **MALIKLI1992 Signature Collection** (launches in 7 days)
- **Winter Luxe Preview** (launches in 21 days)

### Security:
- Row Level Security enabled
- Public read access for drops
- Secure insert for waitlist signups

## 🔍 Troubleshooting:

If you see any errors:
1. Make sure you're in the SQL Editor (not the Table Editor)
2. Run the script in parts if needed
3. Check the error message for specific issues

## ✅ Success Indicators:

You'll know it worked when:
- Your website shows "MALIKLI1992 Signature Collection" 
- The countdown timer displays the correct time
- Waitlist form submissions work without errors

---

**Next Step**: Run the SQL script, then test your application!
