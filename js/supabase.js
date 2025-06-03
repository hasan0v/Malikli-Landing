// Supabase configuration and client setup
class SupabaseClient {    constructor() {
        // Get credentials from config.js
        this.supabaseUrl = window.SUPABASE_URL || 'YOUR_SUPABASE_URL';
        this.supabaseKey = window.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
        this.client = null;
        this.isConfigured = false;
        
        // Auto-initialize if credentials are available
        if (this.supabaseUrl !== 'YOUR_SUPABASE_URL' && this.supabaseKey !== 'YOUR_SUPABASE_ANON_KEY') {
            this.initialize(this.supabaseUrl, this.supabaseKey);
        }
    }

    // Initialize Supabase client
    async initialize(url, key) {
        try {
            // Import Supabase from CDN
            if (typeof window !== 'undefined' && !window.supabase) {
                await this.loadSupabaseSDK();
            }
            
            this.supabaseUrl = url;
            this.supabaseKey = key;
            this.client = window.supabase.createClient(url, key);
            this.isConfigured = true;
            
            console.log('Supabase client initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            return false;
        }
    }

    // Load Supabase SDK from CDN
    async loadSupabaseSDK() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });    }

    // Check if client is configured
    checkConfiguration() {
        // Allow file:// protocol for direct file opening
        const isLocalFile = window.location.protocol === 'file:';
        
        if (!this.isConfigured) {
            console.warn('Supabase client not configured. Using mock data.');
            return false;
        }
        
        if (isLocalFile) {
            console.warn('Running from local file system. Some features may be limited. Using mock data for testing.');
            return false;
        }
        
        return true;
    }// Fetch active or upcoming drop
    async fetchActiveDrop() {
        if (!this.checkConfiguration()) {
            console.log('⚠️ Supabase yapılandırılmamış, mock veri kullanılıyor');
            return this.getMockDropData();
        }

        try {
            console.log('🔍 Veritabanından drop verisi alınıyor...');
            
            // First, try to list all tables to see if drops_drop exists
            const { data: tableList, error: tableError } = await this.client
                .from('pg_tables')
                .select('tablename')
                .eq('schemaname', 'public');
                
            if (tableError) {
                console.warn('⚠️ Table list could not be retrieved:', tableError);
            } else {
                console.log('📑 Available tables:', tableList.map(t => t.tablename));
            }
            
            // Önce tüm dropları basit bir sorguyla getirmeyi deneyelim
            const { data, error } = await this.client
                .from('drops_drop')
                .select('*')
                .limit(10);

            if (error) {
                console.error('❌ Supabase sorgu hatası:', error);
                
                // Try alternative table names if the default one failed
                const altTableNames = ['drop', 'drops', 'product_drop', 'product_drops'];
                
                for (const tableName of altTableNames) {
                    console.log(`🔄 Alternatif tablo deneniyor: ${tableName}`);
                    
                    const { data: altData, error: altError } = await this.client
                        .from(tableName)
                        .select('*')
                        .limit(5);
                        
                    if (!altError && altData && altData.length > 0) {
                        console.log(`✅ ${tableName} tablosunda veri bulundu:`, altData);
                        return this.mapDropData(altData[0]);
                    }
                }
                
                throw error;
            }

            // Verileri konsola yazdır (debug için)
            console.log('📊 Drops tablosundan alınan veriler:', data);

            if (data && data.length > 0) {
                console.log('✅ Veritabanında droplar bulundu');
                
                // Her bir satırın yapısını kontrol edelim
                const firstDrop = data[0];
                console.log('📋 İlk drop yapısı:', Object.keys(firstDrop));
                
                // Öne çıkan dropları bulmaya çalışalım
                let featuredDrop = data.find(drop => drop.is_featured === true);
                
                // Eğer öne çıkan yoksa, ilk kaydı alalım
                if (!featuredDrop && data.length > 0) {
                    featuredDrop = data[0];
                    console.log('⚠️ Öne çıkan drop bulunamadı, ilk kayıt kullanılıyor');
                }
                  if (featuredDrop) {
                    // Map database fields to app fields for compatibility
                    return this.mapDropData(featuredDrop);
                }
            }
            
            // Veri yoksa veya hata varsa
            console.warn('⚠️ Veritabanında drop bulunamadı, mock veri kullanılıyor');
            return this.getMockDropData();
        } catch (error) {
            console.error('❌ Drop verisi alınırken hata:', error);
            return this.getMockDropData();
        }
    }
    
    // Map database fields to app fields with smart field detection
    mapDropData(dbDrop) {
        if (!dbDrop) return null;
        
        console.log('🔄 Drop verisini uygulama formatına dönüştürüyorum:', dbDrop);
        
        // Helper function to find the first available field from alternatives
        const getFieldValue = (obj, alternatives, defaultValue) => {
            for (const field of alternatives) {
                if (obj[field] !== undefined && obj[field] !== null) {
                    console.log(`✅ Mevcut alan bulundu: ${field} = ${obj[field]}`);
                    return obj[field];
                }
            }
            console.log(`❌ Hiçbir alan bulunamadı, varsayılan değer kullanılıyor: ${defaultValue}`);
            return defaultValue;
        };
        
        // Map fields with alternatives for each expected property       
        return {
            id: getFieldValue(dbDrop, ['id', 'drop_id', 'product_id'], 1),
            name: getFieldValue(dbDrop, ['title', 'name', 'product_name', 'drop_name'], 'Exclusive Drop'),
            description: getFieldValue(dbDrop, ['description', 'short_description', 'summary'], 'Limited edition luxury pieces'),
            banner_image: getFieldValue(dbDrop, ['banner_image_url', 'banner_image', 'image_url', 'image'], 'https://media.malikli1992.com/banners/default-banner.jpg'),
            details: getFieldValue(dbDrop, ['collection_name', 'details', 'long_description']),
            start_datetime: getFieldValue(dbDrop, ['launch_date', 'start_datetime', 'start_date', 'release_date'], new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),
            end_datetime: getFieldValue(dbDrop, ['end_date', 'end_datetime', 'expiry_date'], new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()),
            status: getFieldValue(dbDrop, ['status', 'state'], 'upcoming'),
            is_featured: getFieldValue(dbDrop, ['is_featured', 'featured'], true)
        };
    }

    // Add subscriber to waitlist
    async joinWaitlist(email, firstName = '') {
        if (!this.checkConfiguration()) {
            return this.simulateWaitlistJoin(email, firstName);
        }

        try {
            const { data, error } = await this.client
                .from('waitlist_subscribers')
                .insert([
                    {
                        email: email,
                        first_name: firstName,
                        source: 'waiting_page'
                    }
                ]);

            if (error) {
                // Handle unique constraint violation (duplicate email)
                if (error.code === '23505') {
                    throw new Error('This email is already on our waitlist!');
                }
                throw error;
            }

            return { success: true, data: data };
        } catch (error) {
            console.error('Error joining waitlist:', error);
            throw error;
        }
    }    // Get mock drop data for development/fallback
    getMockDropData() {
        const now = new Date();
        const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
          // Try to use local images first
        let bannerImage = 'images/banner-placeholder.jpg';
        
        // Use media config as a fallback if local images aren't available
        if (window.MEDIA_CONFIG && window.MEDIA_CONFIG.banners) {
            // Check if summer2025 exists in media config
            if (window.MEDIA_CONFIG.banners.summer2025) {
                console.log('Using summer2025 banner from media config');
                bannerImage = window.MEDIA_CONFIG.banners.summer2025;
            } else if (window.MEDIA_CONFIG.banners.default) {
                console.log('Using default banner from media config');
                bannerImage = window.MEDIA_CONFIG.banners.default;
            }
        }
        
        return {
            id: 1,
            name: "Summer Luxe Collection",
            description: "Discover our exclusive summer collection featuring handpicked premium pieces designed for the discerning individual. Limited quantities available.",
            start_datetime: futureDate.toISOString(),
            end_datetime: new Date(futureDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            banner_image: bannerImage,
            status: "upcoming",
            is_public: true,
            details: "Our summer collection brings together the finest materials and exceptional craftsmanship. Each piece is carefully selected to ensure uniqueness and quality that exceeds expectations."
        };
    }

    // Simulate waitlist join for development
    async simulateWaitlistJoin(email, firstName) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for testing
                if (Math.random() > 0.1) { // 90% success rate
                    console.log(`Mock: Added ${email} to waitlist`);
                    resolve({ success: true, data: { email, first_name: firstName } });
                } else {
                    reject(new Error('This email is already on our waitlist!'));
                }
            }, 1000); // Simulate network delay
        });
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Check if drop is currently active
    isDropActive(drop) {
        const now = new Date();
        const startDate = new Date(drop.start_datetime);
        const endDate = new Date(drop.end_datetime);
        
        return now >= startDate && now <= endDate;
    }

    // Check if drop is upcoming
    isDropUpcoming(drop) {
        const now = new Date();
        const startDate = new Date(drop.start_datetime);
        
        return now < startDate;
    }

    // Check if drop has ended
    isDropEnded(drop) {
        const now = new Date();
        const endDate = new Date(drop.end_datetime);
        
        return now > endDate;
    }
}

// Create global instance immediately
console.log('📦 Creating Supabase client instance');
window.supabaseClient = new SupabaseClient();

// Auto-initialize with environment variables if available
(function initializeSupabase() {
    // Check for environment variables or config
    const supabaseUrl = window.SUPABASE_URL || '';
    const supabaseKey = window.SUPABASE_ANON_KEY || '';
    
    if (supabaseUrl && supabaseKey) {
        console.log('🔑 Initializing Supabase with provided credentials');
        window.supabaseClient.initialize(supabaseUrl, supabaseKey);
    } else {
        console.log('No Supabase credentials found. Using mock data for development.');
    }
})();

// Also listen for DOMContentLoaded in case config loads later
document.addEventListener('DOMContentLoaded', () => {
    if (!window.supabaseClient.isConfigured) {
        const supabaseUrl = window.SUPABASE_URL || '';
        const supabaseKey = window.SUPABASE_ANON_KEY || '';
        
        if (supabaseUrl && supabaseKey) {
            console.log('🔄 Re-initializing Supabase after DOM loaded');
            window.supabaseClient.initialize(supabaseUrl, supabaseKey);
        }
    }
});
