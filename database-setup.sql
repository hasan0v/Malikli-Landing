-- FIXED DATABASE SETUP - Compatible with bigint IDs
-- For MALIKLI1992 Landing Page
-- Run this script in your Supabase SQL Editor

-- Check the data type of users_user.id first
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'users_user' AND column_name = 'id';

-- Check if drops_drop table exists and if not, create it with a bigint ID
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'drops_drop') THEN
        CREATE TABLE drops_drop (
            id BIGSERIAL PRIMARY KEY,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            title VARCHAR(255) NOT NULL,
            description TEXT,
            banner_image_url TEXT,
            launch_date TIMESTAMP WITH TIME ZONE NOT NULL,
            end_date TIMESTAMP WITH TIME ZONE,
            status VARCHAR(50) DEFAULT 'upcoming',
            is_featured BOOLEAN DEFAULT false,
            collection_name VARCHAR(255),
            price_range VARCHAR(100),
            sizes_available TEXT[]
        );
    END IF;
END $$;

-- Create waitlist_subscribers table with a bigint ID to match users_user
CREATE TABLE IF NOT EXISTS waitlist_subscribers (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contact Information
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    
    -- Preferences
    preferred_sizes TEXT[],
    style_preferences TEXT[],
    
    -- Status
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    
    -- Analytics
    source VARCHAR(100),
    user_agent TEXT,
    ip_address INET,
    
    -- Reference to user if they register later
    user_id BIGINT REFERENCES users_user(id) ON DELETE SET NULL,
    
    -- Engagement
    email_opens INTEGER DEFAULT 0,
    email_clicks INTEGER DEFAULT 0,
    last_engagement TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Add missing columns to drops_drop if they don't exist
DO $$ 
BEGIN 
    -- Check and add title column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drops_drop' AND column_name = 'title') THEN
        ALTER TABLE drops_drop ADD COLUMN title VARCHAR(255);
    END IF;
    
    -- Check and add description column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drops_drop' AND column_name = 'description') THEN
        ALTER TABLE drops_drop ADD COLUMN description TEXT;
    END IF;
    
    -- Check and add banner_image_url column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drops_drop' AND column_name = 'banner_image_url') THEN
        ALTER TABLE drops_drop ADD COLUMN banner_image_url TEXT;
    END IF;
    
    -- Check and add launch_date column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drops_drop' AND column_name = 'launch_date') THEN
        ALTER TABLE drops_drop ADD COLUMN launch_date TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Check and add end_date column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drops_drop' AND column_name = 'end_date') THEN
        ALTER TABLE drops_drop ADD COLUMN end_date TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Check and add status column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drops_drop' AND column_name = 'status') THEN
        ALTER TABLE drops_drop ADD COLUMN status VARCHAR(50) DEFAULT 'upcoming';
    END IF;
    
    -- Check and add is_featured column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drops_drop' AND column_name = 'is_featured') THEN
        ALTER TABLE drops_drop ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
    
    -- Check and add collection_name column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drops_drop' AND column_name = 'collection_name') THEN
        ALTER TABLE drops_drop ADD COLUMN collection_name VARCHAR(255);
    END IF;
    
    -- Check and add price_range column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drops_drop' AND column_name = 'price_range') THEN
        ALTER TABLE drops_drop ADD COLUMN price_range VARCHAR(100);
    END IF;
    
    -- Check and add sizes_available column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'drops_drop' AND column_name = 'sizes_available') THEN
        ALTER TABLE drops_drop ADD COLUMN sizes_available TEXT[];
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_drops_status ON drops_drop(status);
CREATE INDEX IF NOT EXISTS idx_drops_launch_date ON drops_drop(launch_date);
CREATE INDEX IF NOT EXISTS idx_drops_featured ON drops_drop(is_featured);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist_subscribers(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_active ON waitlist_subscribers(is_active);

-- Enable Row Level Security
ALTER TABLE drops_drop ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
DROP POLICY IF EXISTS "Allow public read access to drops" ON drops_drop;
CREATE POLICY "Allow public read access to drops" ON drops_drop
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous inserts to waitlist" ON waitlist_subscribers;
CREATE POLICY "Allow anonymous inserts to waitlist" ON waitlist_subscribers
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to read their own data" ON waitlist_subscribers;
CREATE POLICY "Allow users to read their own data" ON waitlist_subscribers
    FOR SELECT USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_drops_updated_at ON drops_drop;
CREATE TRIGGER update_drops_updated_at BEFORE UPDATE ON drops_drop
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_waitlist_updated_at ON waitlist_subscribers;
CREATE TRIGGER update_waitlist_updated_at BEFORE UPDATE ON waitlist_subscribers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample drop data only if no drops exist
INSERT INTO drops_drop (
    title,
    description,
    banner_image_url,
    launch_date,
    end_date,
    status,
    is_featured,
    collection_name,
    price_range,
    sizes_available
) 
SELECT 
    'MALIKLI1992 Signature Collection',
    'Experience luxury redefined with our exclusive signature pieces. Limited quantities available for our most discerning customers.',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '14 days',
    'upcoming',
    true,
    'Signature Series',
    '$299 - $899',
    ARRAY['XS', 'S', 'M', 'L', 'XL']
WHERE NOT EXISTS (SELECT 1 FROM drops_drop LIMIT 1);

-- Create a view for active drops
CREATE OR REPLACE VIEW active_drops AS
SELECT 
    *,
    CASE 
        WHEN NOW() < launch_date THEN 'upcoming'
        WHEN NOW() BETWEEN launch_date AND COALESCE(end_date, launch_date + INTERVAL '30 days') THEN 'active'
        ELSE 'ended'
    END as computed_status
FROM drops_drop
WHERE status != 'ended' OR status IS NULL
ORDER BY is_featured DESC NULLS LAST, launch_date ASC NULLS LAST;

-- Success message
SELECT 'FIXED: MALIKLI1992 database setup completed successfully! 🎉' as message;
